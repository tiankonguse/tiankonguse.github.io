---   
layout:     post  
title: Go：一段代码让服务性能降低100倍  
description: 网上找的代码有风险。     
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2021-09-11 21:30:00  
published: true  
---  


## 一、背景


带的实习生重构了一个 http 服务，压测后正常上线了。  


实习生会学校后，有业务反馈数据和之前有点不一样。  



## 二、分析    


简单看了下业务反馈的问题，旧接口是 cpp 语言开发的，通过 json 库自带的功能，把 utf8 编码转化为了 unicode。  
Go 语言重构后，漏掉了这个转化逻辑。  


不过看下代码，遗漏这个逻辑也正常，因为代码长这样。  


```
Json::FastWriter writer(false,true);

class FastWriter {   
    FastWriter(bool bReplaceAMP = false, bool bUTF8Trans = false);
};
```


不去看 json 库的头文件，这两个 true 与 false 还真不知道时干啥的。  


明确了问题，接下来就是给 go 语言的 http 服务也加入这个编码转换功能。  


## 三、编码转换  


网上一顿搜索与了解，发现 go 语言的 json 库默认不支持 utf8 转 unicode 。  


实现方式有两种。  


一种是私有实现，把所有结构的字符串类型定义为自定义类型。  
转化为 json 时就可以按照自定义的方式进行编码转换了。  


另一种是通用实现。  
即先得到 json 的 utf8 编码的字符串，再通过一个函数转化为 unicode 编码即可。  


于是我去网上搜了这样一个函数。  


![](https://res.tiankonguse.com/images/2021/09/11/001.png)  


找了一个有中文的链接，经过测试，发现输出和旧接口一模一样了。  


## 四、性能降低100倍  


我将这个 Utf8 转 unicode 逻辑封装为一个函数。  


最近我们公司在大力推行 devops，发布的流水线之前是5批，慢慢发布的，现在改成 2 批发布。  


上午我灰度第一批后，没有业务反馈问题，也没收到服务告警。  
下午全量后，就有不少业务反馈服务超时。  
同时我也发现容器在疯狂的扩容。  


有问题第一时间肯定是回滚了，但是我们的 decops 不支持回滚，于是只好手动的找到旧版本手动强制覆盖最新版本。  
是的，回滚是手动操作的，我们的 devops 不支持这个功能。  



回滚后，业务看监控就正常了。  


线上服务都正常后，我先去看为啥上午发布第一批时没收到告警。  
结果发现监控系统的告警接收人都变成空了，也许是由于实习生离职后，人名搜不到了，触发了监控系统的BUG吧。  
于是收到修改监控系统的告警接收人。  


接着看下监控，发现发布后只是耗时增加，容器疯狂的告警，并没有人反馈数据有问题。  
那说明逻辑没问题，只是性能问题。  


于是我看了下网上找的这段代码，果然有性能问题。  

```
    json := ""
    for _, r := range rs {
        rint := int(r)
        if rint < 128 {
            json += string(r)
        } else {
            json += "\\u"+strconv.FormatInt(int64(rint), 16)
        }
    }
```

我的这个接口是数据接口，数据大小一般都是几百K大小。  
这循环一般不断的字符串拼接，看着没问题，背后内存会不断的重新分配，从而导致复杂度是`O(n^2)`的。  


我网上找了一个 http 压测工具 wrk，一压测吓一跳。  
变更前的代码与变更后的代码性能相差一百倍。  
管不得耗时飙升，容器疯狂扩容的。  


于是我就开始优化这段代码。  
其实优化也很简单，提前扫描一遍计算出最终的大小，然后预先申请目标大小的内存切片即可。  


```
cap := escapeUnicodeLen(rs)
ret := make([]byte, 0, cap)
```

这个优化代码再次压测，性能就和最开始的一模一样了。  


## 五、一个编码BUG  


网上找的那段代码其实还有一个编码 BUG。  


```
"\\u"+strconv.FormatInt(int64(rint), 16)
```


如上，网上是通过 `strconv.FormatInt` 将数字转化为十六进制字符串，然后拼接前缀 `\\u` 得到 unicode 字符串。  


性能优化后的代码我发布后，再次有个业务反馈 HTTP 接口有问题，说 JSON 解析失败。  


于是一起定位了下，发现标准的 unicode 字符串是4个十六进制，即有前缀0。  
所以那行代码需要修改为下面的样子  


```
ret = append(ret, []byte(fmt.Sprintf("\\u%04x", rint))...)
```


然后通过之前有问题的请求参数进行对比，就和修改前的unicode 返回一模一样了。  


## 六、最后  


问题是修复了，不过我有个疑问：json 转 unicode 这么常见的功能，为啥 go 的 json 库没支持呢？  


这个应该有通用的库来做这件事，而不是自己写个函数来转化，你怎么看待这个问题？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

