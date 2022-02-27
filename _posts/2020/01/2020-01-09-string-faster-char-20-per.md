---   
layout:     post  
title:  你知道吗？string比字符串快20%  
description: 看了很多人的代码，发现都没注意到这个细节。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-01-09 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


最近在思考性能优化的事情。  


说起性能优化，大家都知道能用引用的地方就不要使用赋值copy。  


关于左值引用`&`与右值引用`&&`相信大家都已经很熟悉了。  
如果你不了解左值引用，可以去看一下`c++`的基础书籍，任何一本都有介绍。  
如果右值引用你不了解，可以看《[学习 c++11 之 右值引用](https://mp.weixin.qq.com/s/fzPhNgvSTGSvn-uenjsH1w)》这篇文章。  


那既然说到不要赋值 copy，我看了无数人的代码，有一个细节几乎所有人都忽略了，都在使用赋值copy，而不是引用。  


没错，就是常量字符串。  



## 一、有问题的代码  


相信大家都看过这样的代码  


```
map<string, string> m;
m["one"] = 1;
auto it = m.find("one")
```

大家可曾想过字符串与string之间的关系？  


是的，字符串需要先隐试转化为 string，那这个转化就存在一次默认构造与 字符串copy了。  


假设一个服务qps是几十万，每次请求大量的使用了字符串，那是不是就存在大量的隐式转化带来的性能损耗呢？  


## 二、性能损耗  


其实，关于这个问题我在四年前已经测试过了。  


![](https://res2020.tiankonguse.com/images/2020/01/09/002.png)


当时我对所有常用的语法全部进行了压测。  


![](https://res2020.tiankonguse.com/images/2020/01/09/001.png)


今天，我再次运行了这个测试程序，性能差异之大已经令我不敢置信。  


压测程序源码我使用`c++11`重写了，代码如下，有三个函数。  
`charFun`是字符串查找函数  
`stringFun`是string函数  
`avgFun`是运行次数，这里运行5轮求平均值。  


![](https://res2020.tiankonguse.com/images/2020/01/09/004.png)


这个压测程序接受两个参数，第一个是压测次数，第二个是`map`的大小。  
可以看到，`map`比较小时，性能差异非常大；而`map`较大时，性能差异有`22%`左右。  


![](https://res2020.tiankonguse.com/images/2020/01/09/003.png)


## 三、最后  


你平常写代码的时候，对于那些常量字符串，使用`string`了吗？  




-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

