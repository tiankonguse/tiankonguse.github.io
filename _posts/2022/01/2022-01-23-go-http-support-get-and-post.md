---   
layout:     post  
title:  请教下，go HTTP 服务如何同时支持 GET 与 POST     
description: 遇到的一个实际问题，请教下大家。  
keywords: 程序人生,项目实战  
tags: [程序人生,项目实战]    
categories: [程序人生]  
updateData:  2022-01-22 23:05:00  
published: true  
---  


## 一、背景  


项目里有个读接口是 http 协议。  


由于旧的 CGI 框架不区分 GET 和 POST，两种都支持。  


去年一个小伙伴使用 go 语言进行了重构上云，即用 go 开发了一个 http 服务部署到容器平台上。  


浏览器域名来的流量，切换的时候都正常，流量也顺利切换了。  


切换到后台服务的流量时，发现有个 php 业务没有使用 GET 请求数据，而是使用的 POST 请求。  


这个小伙伴马上修改代码，兼容了 POST 请求。  
之后在正式环境的名字服务上配置了权重为 1 的流量。  


恰好那几天团队发生调整，小伙伴离开了。  


就这样，新的 HTTP 服务使用权重为 1 的流量在正式环境跑了几个月。  



## 二、降本增效发现问题  


最近快过年了，大家都在为降低成本发愁，老板问这个旧的 HTTP 服务能不能下线。  


本来我想，还有两周就过年了，还是不要动了，年后再说。  


后来又一想，旧的 HTTP 服务还是传统的实体机，流量暴涨的话无法自动扩容，年前就全部上云也没问题。  


于是发了一个项目变更周知公告：HTTP服务重构上云，之前权重很低跑了几个月了，这几天会增加流量。  


结果操作半天之后，有人反馈自己的服务读不到数据了（失败率升高暴露问题）。  


细问得知，这个业务使用的 POST 请求来读数据。  


于是我便回滚了这个业务访问的名字服务下的流量。  




之后，我找到尘封很久的 GO 开发的 HTTP 服务代码。  


找代码的时候，我还在纳闷，记得曾经小伙伴解决了这个问题的，怎么还有这个问题呢？  


vscode 打开代码后，看了眼 post 请求的参数处理逻辑，一眼便看出原因来。  


![http服务 post 源码](https://res2022.tiankonguse.com/images/2022/01/23/001.png) 


GET 请求的格式是 `k1=v1&k2=v2` 的形式。  
POST 的 BODY 里的格式正常情况下也是 `k1=v1&k2=v2` 的形式。  


小伙伴却把 POST 的请求数据当做 JSON 格式，去解析 JSON 了，那肯定解不开了。  


所以，POST 请求就全部报参数非法错误了。  


## 三、最原始的方法  



![http服务 post 源码2](https://res2022.tiankonguse.com/images/2022/01/23/001.png) 


看代码可以发现，具体实现的时候，会根据 Method 来回调不同的处理函数。  


我们需要做的是不解析 JSON，而是解析类似于 `k1=v1&k2=v2` 的字符串。  


所以修改完的代码就是下面的样子。  


```go
func postParamsToQuery(r *http.Request) url.Values {
  body := io.ReadAll(r.Body)
  post := doubleSplit(body, '&', '=')
  return trimMapValues(post)
}
```

## 四、复用 URL 库  


当然，实际上我不会去实现上面的解析函数的。  


因为 URL 库肯定实现了这个功能。  



于是我阅读了 `net/url` 库的全部源码，发现 url 库果然自带这个功能。  


代码就变成这样了。  


```go
func postParamsToQuery(r *http.Request) url.Values {
  body := io.ReadAll(r.Body)
  post, _ := url.ParseQuery(body) // 解析错误按空参数处理
  return trimMapValues(post)
}
```


## 五、另外一个逻辑缺陷


其实，上面的 POST 代码还有一个逻辑缺陷。  


对于一个 POST 请求，PATH 上的参数需要进行 GET 获取的，BODY 里的参数才需要 POST 获取。  


业务极有可能把固定的参数放在 PATH 中，变化的参数放在 BODY 中。  


比如下面的样子  


```http
GET /path?otype=json HTTP/1.1
Host: github.tiankonguse.com


k1=v1&k2=v2
```


此时，我们应该把 GET 参数与 POST 参数组合起来才行。  


大概代码如下  


```go
func postParamsToQuery(r *http.Request) url.Values {
  query := r.URL.Query()  // 获取 GET 的 Kv
  body := io.ReadAll(r.Body)
  post, _ := url.ParseQuery(body) // 解析错误按空参数处理
  queryAndPost = merge(query, post) // 合并 GET 与 POST
  return trimMapValues(queryAndPost)
}
```


## 六、复用 Http 库  


当然，上面的代码我并没有实现。  


因为我马上猜想，这个逻辑 go 的 HTTP 库应该都封装好了的。  


于是我又阅读了 HTTP 库的 Request 文件的全部源码，发现果然已经封装好了。  


于是代码可以简化为下面的样子了。  


```go
func postParamsToQuery(r *http.Request) url.Values {
  r.ParseForm() // HTTP Request 自动合并 GET/POST 到 Form
  return trimMapValues(r.Form)
}
```


## 七、继续优化  


还是看最初的代码。  


![http服务 post 源码](https://res2022.tiankonguse.com/images/2022/01/23/003.png) 



这里 30 多行代码，都是为了进行 GET 和 POST 请求的参数合并。  


既然现在我们知道 HTTP 库的 Request 库会帮我们做这件事，我们就可以把这些代码都删除了，保留一个函数就行了。  


```go
func trimMapValues(query url.Values) url.Values {
  for _, v := range query {
    if len(v) > 0 {  // 这里需要判断长度，小伙伴也没判断
      v[0] = strings.TrimSpace(v[0])
    }
  }
  return query
}
func getQuery(r *http.Request) url.Values {
  r.ParseForm() // HTTP Request 自动合并 GET/POST 到 Form
  return trimMapValues(r.Form)
}
```


## 八、最后  


对于 trimMapValues 这个函数，本来不应该做这个逻辑的，这样写非常不优雅。  


但是旧的 CGI 框架自动做了这个逻辑。  


根据墨菲定律，如果一个事情有几率发生，那最终肯定会发生。  


当时灰度上线的时候，发现确实有个别业务在参数的前后加了空格（就是这么神奇）。  


那只能保留这个历史包袱了。  



好了，这是目前我想到的方案，30 多行代码优化到 10 行左右。  


请教下，同时支持 GET 和 POST 请求，你有什么建议吗？  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

