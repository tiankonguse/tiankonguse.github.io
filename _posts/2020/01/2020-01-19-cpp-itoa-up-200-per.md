---   
layout:     post  
title:  自己实现 to_string 性能提升415%  
description: 是不是还在使用 to_string，很影响性能的好不。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-01-19 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


之前在《[你知道吗？string比字符串快20%](https://mp.weixin.qq.com/s/fZoSyfpAg-_4uV1cVbvwbw)》文章中介绍了 string 代替 字符串 可以提少 性能，收到不少好评。  


今天遇到数字转字符串函数，突然意识到这个5年前我也压测过。  


于是找到压测程序，修改后重新压测，发现最优的实现比`c++`自带的`to_string`快4倍，这里分享给大家。  


## 一、基本需求  


基本需求是有一个数字，想转化为字符串。  


`c++` 自带的函数是`to_string`， `c`的话没有自带函数，我们需要使用`snprintf`来实现。  


系统函数为了兼容各种情况，会实现的特别复杂，这也导致最终这些系统函数性能很低。  


我分别对比了 `to_string`、`snprintf` 以及自己实现这三个方法，发现自己实现的比系统自带的函数快5倍，也就是提升了至少400%。  


## 二、数据实现  


`to_string` 的实现最简单，直接传参即可返回 string。  


`snprintf` 的实现需要先定义一个 buf， 然后把数字转换到字符串里，最后再赋值给 string。  


自己实现和`snprintf`类似，不过是自己不断除 10 得到每一位的字符的，最后转化为 string。  


对比数据如下， 可以看到，自己实现平均需要 0.027us， 而 `to_string`则需要 0.14us，相差五倍之多。  


![](http://res2020.tiankonguse.com/images/2020/01/19/001.png)  


## 三、最后  


`to_string` 执行一次平均使用 0.14us， 时间还是蛮多的，大家以后如果比较注重性能，就要尽量少使用这个函数了。  


相关代码已经上传到 github， 公众号后台回复`数字转字符串`获取源码地址。  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

