---
layout: post  
title: 持续 4 年 strnstr 函数 BUG， 
description: 遇到很多次，竟然一直没修复。  
keywords: 程序人生  
tags: [程序人生]  
categories: [程序人生]  
updateData: 2024-09-08 12:13:00  
published: true  
---


## 零、背景  


4年前，隔壁团队遇到过一个 coredump 问题。  
一番分析，发现是一个 http 公共库自己实现了 strnstr 函数，实现的有问题导致 coredump。  
我一直以为这个公共库修复了这个问题。  


2024年4月份的时候，团队的服务再次遇到 coredump，一番分析，又是 coredump 在那个公共库的 strnstr 函数上。  
查看公共库的代码合并记录，最后一次合并就是修复 strnstr 函数的 coredump。  


再看下版本，果然没有使用最新版本。  
于是大家意味这次升级就可以解决这个问题了。  


2024年9月份，也就是这几天，团队又遇到 coredump 了，而且还是出在 http 库的 strnstr 函数上。  


相同的问题一而再、再而三的出现，我只好介入，去看看到底是什么问题，为啥没有修复问题。  


## 一、现象   


首先是登录机器，GDB 到 core 文件上，看下堆栈，如下。  


![](https://res2024.tiankonguse.com/images/2024/09/09/001.png)



可以清楚的看到，文件为 tc_http.cpp，函数 strnstr 的第 38 行，这一行调用了 strlen 函数，然后 coredump 了。 


![](https://res2024.tiankonguse.com/images/2024/09/09/001.png)



## 二、分析  


这一行为啥会 coredump 呢？  


gdb 到对应的堆栈，p 打印对应的参数即可。  


当然，默认 p 打印的字符串与 堆栈中的一样。  
所以我们需要调大默认打印的 buf。  


使用 `set print elements 0` 即可设置为不限制 buf 长度。  


![](https://res2024.tiankonguse.com/images/2024/09/09/003.png)


如上图，打印时报报 `Cannot access memory` 错误。  
显然，是由于没限制访问字符串的长度，又一直没遇到 `\0` 结束符，最后遇到内存不可读错误了。  


这个函数的名字是 `strnstr`，含义是查找指定长度字符串的子串位置。  
既然指定长度了，那入参自然就不保证以 `\0` 字符结束了。  


PS：对于网络库中的字符串，一般都没有 `\0` 结束符。  



那先看下输入的长度是多少，限制下打印长度，再试试，果然没有报错了。  


![](https://res2024.tiankonguse.com/images/2024/09/09/004.png)


至此，问题就很清楚了。  


`strnstr` 函数中的 `n` 就是用来限制输入字符串的长度的，用来保护避免越界的。  
但是 http 库中的 `strnstr` 直接对输入字符串来了一个 `strlen`，自然就越界了。  



## 三、修复  


针对 strnstr 函数，第一感觉是：这个常用的功能，难道库函数没有实现，还自己去实现？  


网上一搜，第一个是 CSDN 的 strnstr 实现，第二个是 man 手册。  



![](https://res2024.tiankonguse.com/images/2024/09/09/004.png)



先看第二个 man 手册，原来这个函数确实大部分库没有，只有 FreeBSD 系统才有。  


Since the strnstr() function is a FreeBSD specific API,it should only be used when portability is not a	concern.  
The `strnstr()` function	was introduced by FreeBSD 4.5 and is non-standard.  


![](https://res2024.tiankonguse.com/images/2024/09/09/004.png)


再看第一个 CSDN ，我震惊了，公共库的代码竟然和这个完全一样。  
也就是 CSDN 最火的 strnstr 函数文章，代码是有 BUG 的，而公共库直接使用了这个代码。  


![](https://res2024.tiankonguse.com/images/2024/09/09/004.png)


再往下翻，其实可以找到苹果开源 libc 库中的 strnstr 源码， 其实也是 FreeBSD 的官方实现。  


https://opensource.apple.com/source/Libc/Libc-1158.30.7/string/FreeBSD/strnstr.c.auto.html



所以我们只需要把这个函数换成 FreeBSD libc 中的源码即可。  


## 四、最后  


strnstr 的这个 BUG，其实不难发现， gdb p 一下就找到原因了，但不知什么原因，大家一直没去修复。  


后来我想了想，应该是由于和公共库有关。  


问题出现在其他人的公共库里面，使用者第一时间肯定是反馈给公共库的 Owner，然后只需要过一段时间偶尔问一下公共库的 Ower 这个问题是否已修复。  


这个是公共库， 实际上是没有 Owner 的，即大家共建维护这个公共库，或者只有一个临时 Owner。  
临时 Owner 都在忙自己的 OKR，这个事情的优先级自然就是极低的。  


第二个原因是这个库 coredump 的概率极低。  


面对一个问题，尤其是责任归属不明确时， 一般是谁痛谁来解决问题。  
而这个问题出现的概率极低，半年才遇到一次，所以使用者也不愿意投入时间去分析定位了。  


一开始的时候提到有人修复过一次，但是修复时应该没找到原因，只是加了一个入参的非空判断，所以并没有真正解决这个问题。  


这就导致一个简单的 BUG，无数个服务都在偶尔遇到，但是持续了 4 年时间，这周才找到原因。  
这周我们团队就去提交一个 PR，去修复这个问题吧。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

