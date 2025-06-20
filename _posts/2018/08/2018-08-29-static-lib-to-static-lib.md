---   
layout:     post  
title:       静态库遇到静态库  
description: 在C或C++的世界里，一切皆符号。      
keywords: 技术 
tags: [程序人生]  
categories: [程序人生]  
updateDate:  23:40 2018/08/29   
published: true   
---  




## 一、背景  

在C或C++的世界里，一切皆符号。稍有不慎就会遇到找不到符号的问题。  
最近更新静态库，遇到里两个符号问题，这里来看看静态库遇到静态库时都会遇到什么问题吧。  


## 二、单向依赖问题  

最常见的符号问题就是一个静态库依赖另一个静态库问题了。  

例如有下面代码：  


add库实现加法，mul库实现乘法，但是依赖add库。  
A程序 server只依赖add库。  
B程序 client依赖mul库。  


![](https://res2018.tiankonguse.com/images/2018/08/20180829012817.png) 


这里先问第一个问题：如下图，对于mul库，依赖的add库的头文件放在源码c文件里client程序可以编译通过运行吗？  


![](https://res2018.tiankonguse.com/images/2018/08/20180829013425.png) 



答案是肯定的。  
因为依赖库的头文件只用于编译检查，如果mul库的头文件不依赖add库的符号，放在mul的源码文件是没问题的。  


接着问第二个问题：上上那张图中，add库和mul库的位置正确吗？client程序是否可以编译？编译出来后是否可以运行？  
对于这个问题，是所有人最常遇到的问题。  
<red>**链接程序的实现方式决定了，被依赖的库应该放在后面。**</red>  
所以图中两个静态库的位置不正确，程序编译不通过。    


## 三、静态库与改名  


不知大家有没有注意到，对于add库里面，函数名是add1。  
那个是我故意加的，含义为初期这个库拼写不规范，名字有问题。  


此时我们想把add1修改成add该怎么办呢？  


假设没有Mul库，也就是大家都是直接使用add库的，我们在升级add库时进行改名即可。    
有些旧程序为了能够兼容，我们可以将add名称映射到add1。    


<red>**对于函数，一般使用define重定义，而对于类型，则使用typedef重定义。**</red>    


![](https://res2018.tiankonguse.com/images/2018/08/20180829015859.png) 


但是可以发现，如果有静态库对add库进行了进一步封装，则那些依赖add库的静态库就会有问题。  


<red>**这是因为define是在预处理阶段进行的，typedef是在编译阶段进行的，而静态库已经经历过编译了，所以他们依赖的符号都是确定的，不能变更了。**</red>  


因为我们不知道是否有人对这些库进一步封装。  
面对这个问题，我们就不能改名了，历史是什么名字就保留什么名字了。  

# 四、静态库追与默认参数  

如果对于c++程序，经常会有一堆默认参数，随着业务的发展还经常会加默认参数。  


![](https://res2018.tiankonguse.com/images/2018/08/20180829020849.png)   


这时候，如果有业务依赖这个公共库，增加了默认参数后，client程序还能正常编译或运行吗？  


想要弄清楚加了默认参数后能不能正常编译或运行，就需要知道默认构造参数是怎么实现的。  
对于c++语言，可以有相同的函数名，参数类型不同即可。  
所以c++函数的符号是函数名和参数类型一起组成的，每一个函数只会生成一个符号。    
而对于默认参数，c++是在编译的时候自身生成各个默认参数的临时变量，最终还是以完整的参数调用函数的。  


## 五、结尾  

了解了上面的机制，我们可以得出一个结论：曾经提供出去的静态库的接口再也不能变更了。  
不管是函数名，或是默认参数的个数，都不能有丝毫的变更。  
那想要增加默认参数怎么办呢？  
对于改名这个场景，只能新的名指向旧的名称。  
对于新增默认参数，只能新增函数了。  


其实，google c++ style里面有一条说明：禁止使用默认参数。  
而看看我们这个业务，默认参数竟然多大五六个，看来以后都需要改成重载的方式了。  
  

另外，静态库与静态库还有很多其他的东西。  
比如循环依赖，比如希望将一个静态库打包进另一个静态库，这个就不多说了。  
  

---


本文首发于公众号：天空的代码世界，微信号：tiankonguse-code。  


推荐阅读：  


* [经济危机（一）](https://mp.weixin.qq.com/s/hxO7oR8cLljSClYS-yE6pw)   
* [读书《淘宝技术这十年》](https://mp.weixin.qq.com/s/IeOQGh22U_1TPrf6sYYTkQ)   
* [读恐怖小说《1984》](https://mp.weixin.qq.com/s/q7HL5o_R5cqJc0b9Ll7EMw)    
* [那些营销套路（初级版）](https://mp.weixin.qq.com/s/xdvqZo9ll6kaL66Cdx)   
* [数据脏了怎么办](https://mp.weixin.qq.com/s/Blw4yxmIsE51dzzbNcfFbg)    
* [中年危机笔记与思考](https://mp.weixin.qq.com/s/dFzDtZS0JN6hhpc1DF-e_g)     



![](https://res2018.tiankonguse.com/images/tiankonguse-support.png) 




