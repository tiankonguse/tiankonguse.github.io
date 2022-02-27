---   
layout:     post  
title: Chrome 已屏蔽 mixed-content 错误解决方案
description: 网站好久没维护了，最近花点时间优化一下，遇到了这个问题。       
keywords: 前端技术  
tags: [前端技术]    
categories: [前端技术]  
updateData:  2022-01-03 21:30:00  
published: true  
---  


## 一、背景  

2022 年到来后，我在琢磨着批量调整下网站的图片地址。  


无意间把网站切换到 Https，发现竟然可以打开，只不过图片不显示了。  


报的错误是 `已屏蔽：mixed-content`。  


于是研究了下这个问题。  


## 二、chrome 策略  


原来，这个是最新版本 Chrome 的策略，在 https 网站下，禁止访问 http 内容了。  


在 [chrominum 官方博客](https://blog.chromium.org/2020/02/protecting-users-from-insecure.html)里可以看到策略的执行记录，如下图  


![](https://res.tiankonguse.com/images/2022/01/03/001.png)  


Chrome 88 以及之后的版本，就对png、Mp3等图片、视频、音频、文本富媒体资源限制访问了。  


当然，这个策略在 Chrome 上可以手动关闭。  
但是我们作为网站提供方，不可能让所有的使用者来关闭这个策略。  


所以还是需要从代码上来解决问题。  


## 三、主动 切换 https  


第一个方法自然是所有依赖的资源升级到 https。  


如果你确定某些资源支持 https 了，建议主动调整 URL 链接。  
这样的好处是升级后，这些资源就会更安全。  


当然，如果依赖外部其他网站的资源，那升级就不好说了。  



## 四、自适应 切换 https


第二个方法是根据当前网站的 http 协议，依赖的资源自适应协议。  


什么意思呢？  


假设 github.tiankonguse.com 网站依赖 res.tiankonguse.com 网站的一个 1.png 图片。  
这是 github.tiankonguse.com 网站的页面就会有这样一个链接 `res.tiankonguse.com/images/2022/01/03/001.png`。  


自适应的意思就是我们不指定 http 这个前缀。  
改为 `//res.tiankonguse.com/images/images/2022/01/03/001.png`。  


此时，如果 github.tiankonguse.com  网站以 http 协议的方式对外提供页面服务，浏览器就会使用 `http://res.tiankonguse.com` 的方式去打开图片。  


如果 github.tiankonguse.com  网站以 https 协议的方式对外服务，浏览器就会使用 `https://res.tiankonguse.com` 的方式去打开图片。  


是不是很神奇，这样就做到了自适配。  


那就有人问了：这样做的好处是什么？  


我想了想，适用于这样一种场景。  

你的网站依赖下游的网站还在进行 https 改造中，目前还未完全支持。  
此时，你的网站没法开启 https。  
正常情况下是你先等待下游资源网站改造完后，你再去排期改造你的网站。  
这就是串行改造了。  


下游改造两个月，你改造两个月，合起来四个月了。  


如果在下游改造的时候，你先把所有代码修改为 `//res.tiankonguse.com` 的形式。  
那下游改造完了，你在服务器上只需要配置一下开启 Https，就可以一键把整个网站切换到 https 了。  



## 五、强制切换 https

第三个方法是在网站的 Meta 中配置开关，强制切换到 https，代码如下，  


```
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```


强制切换与自适应切换相比，好处是不需要修改整个网页的代码了，只需要在文件顶部加一行代码就行了。  



## 六、最后  


总结下就是，`已屏蔽：mixed-content` 是 chrome 的最新版本的策略导致。  
目的是为了保证 https 页面的安全，禁用了 http 协议的资源。  


面对这个问题，有五个方法：  


1、自己的网站改为 http 方式。  
2、推动依赖的下游资源升级到 https，自己的网站也使用 https 的方式调用。  
3、自己的代码先修改为 `//` 自适配协议方式，等下游支持 https 了，自己的网站再开启 https。  
4、在页面顶部加入 `upgrade-insecure-requests` 强制使用 https 的方式请求下游。  
5、自己的浏览器关闭这个策略，允许不安全的内容（仅对自己有效）。  


大家可以根据每个方法的优缺点，选择一个适合自己的方式吧。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

