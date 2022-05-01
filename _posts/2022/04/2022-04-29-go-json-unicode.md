---   
layout: post  
title: GO 输出浏览器能够识别的 Unicode      
description: 特殊字符         
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2022-04-29 21:30:00  
published: true  
---  


## 一、背景  


我负责一个 go 编程语言开发的 http 服务。  


关于这个服务，之前已经写了两篇文章了，如下。  


[一段代码让服务性能降低100倍](https://mp.weixin.qq.com/s/PrumUA-KlJ4_UHdnoTLYHg)  
[go HTTP 服务如何同时支持 GET 与 POST](https://mp.weixin.qq.com/s/yjGXTGZK4TCS-_V3XIyXkQ)  


最近又有小伙伴反馈问题了，是个编码问题。  


## 二、编码问题  


有一天，有小伙伴反馈使用这个 http 接口，拉到数据不对。  


我看了一眼截图，是一个 emoji 表情字符。  



![](https://res2022.tiankonguse.com/images/2022/05/01/001.png)  



我心中想：不对呀，很早之前就做过处理，会转化为 unicode 编码的，不应该有问题呀。  


![](https://res2022.tiankonguse.com/images/2022/05/01/00101.png)  



浏览器打开接口一看，浏览器自动解析 JSON 后，确实变成特殊字符：`O5` 了。  
而抓包看回包，确实是 unicode 字符 `\u1f495`。  


![](https://res2022.tiankonguse.com/images/2022/05/01/002.png)  



## 三、原因  


我突然发现一点了差异点：其他编码都是4位的，如 `\uxxxx`。  
这个编码竟然是5位的，极有可能是这个导致的。  
于是我开始大量的 google 去查询资料。  


我搜索这个字符的官方文档时，文档中竟然也说 javascript 使用这个字符。  


地址：https://unicodeplus.com/U+1F495  


![](https://res2022.tiankonguse.com/images/2022/05/01/003.png)  


但是问题已经发生了，那显然，这个文档是有问题的。  


于是我使用 `\u1f495` 这个关键词来搜索，查阅了无数资料，最终找到了原因。  


地址：https://www.cyberdefinitions.com/symbols/heart-symbols/heart-couple.html  


虽然搜索的页面都是纯英文的，但是这些简单的单词还是很容易阅读的。  


![](https://res2022.tiankonguse.com/images/2022/05/01/004.png)  



图片中选择的英文可以看出，JavaScript 不识别 5 个字符的 unicode，需要转化为 UTF-16。  


下面还附加了一个转化的文章地址。  


地址：https://www.cyberdefinitions.com/symbols/converting-hexadecimal-to-UTF-16-format-for-JavaScript.html  



## 四、Unicode 转化 UTF-16 原理   


上面提到，查到的资料里给了一个 Unicode 转化 UTF-16 链接。  


要理解这个链接里的文章，首先需要了解几个背景知识。  


背景知识1：目前 unicode 的范围是 `[0, 0x10FFFF]`，共 21 比特位。  


背景知识2：一个 UTF-16 理论储存的范围是`[0, 0xFFFF]`  


有了上面两个背景知识，我们就可以来看这个问题了。  


如果一个 unicode 只使用一个 UTF-16 就可以储存下，那只需要使用一个即可。  
如果储存不下，使用一个算法，两个 UTF-16 肯定是可以储存下所有的 unicode。  


打开链接的文章后，截图如下  


![](https://res2022.tiankonguse.com/images/2022/05/01/005.png)  


可以发现，算法有一堆魔数。  


但是也不复杂，首先先减去 `0x10000`。  
背后的逻辑是，一个 utf-16 可以储存 `0x10000` 个 unicode，还剩余 `0xFFFFF` 个需要两个 utf-16 来储存。  
既然明确需要两位了，减去偏移量也合理。  


偏移量修正后，使用 `0x400` 进行对半分组，除法的结果为高位，取模的结果为低位。  
高位储存 `0X4FF` 个数字，低位储存 `0X4FF` 个数字，交叉相乘刚好是 `0xFFFFF` 个数字。  


`0X4FF` 只需要 10 比特位，剩余的几位使用魔数填充，就可以使用两位 UTF-16 来表达值比较大的 unicode 了。  



不过看到这里，聪明的你肯定会有疑问：解析 UTF-16 时，怎么区分这个是一位的还是两位的呢？  
万一两个一位的 UTF-16 某些位恰好与魔数相等，不就冲突了？  


是的，为了解决这个问题，魔数的位置，不能有合法的 UTF-16 值才行。  


于是，UTF-16 增加了一个补丁：`[0xD800, 0xDFFF]` 范围的值都是非法的，只能用于两位 UTF-16 使用。  
这样，两个魔数都在这个非法值内，就可以避免冲突了。  


## 五、GO 代码实现


这个算法很简单，本来我想自己实现的。  


后来一想，GO 既然支持 utf8 库，会不会也支持 utf-16 库呢？  


于是打开 go utf8 的源码，发现同目录就有个 utf16 的目录，里面就有这个算法的实现。  


于是我通过调用 `utf16.EncodeRune` 函数就可以获取上面算法的结果了。  


![](https://res2022.tiankonguse.com/images/2022/05/01/006.png)  


## 六、最后  


通过这个问题，我还学会了 utf16 储存 unicode 的原理。  


只是有个疑问：两位的 utf16 为何这样设计算法？  
为何不能想 utf8 那样，通过最高位比特位是否为 1 来判断?  




加油，打工人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

