---   
layout:     post  
title:  学习 c++11 之 右值引用  
description: 这个功能可以大大提高代码的性能。    
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2019-12-31 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


之前提到，我们开始从 c98 切换到 c++11 了。  


所以我打算分一个系列来介绍常见的 c++11 的语法。  


今天要分享的第四个知识点非常有用，那就是右值引用 。  


## 一、旧的方式  


以前，为了性能，我们会使用`swap`来提高避免大量`copy`。  


```
void set(string& a){
    string b;
    b.swap(a);
    a.clear();
    //process b
}
```


但是有时候，传入的参数是右值，必须加`const`，不然编译不通过。  


```
set("hello");  //error non-const reference ...
```


此时能做的只能是加上`const`，然后进行`copy`操作。  


```
void set(const string& a){
    string b = a;
    //process b
}
set("hello");
```

而这样会导致大量的`copy`操作，从而导致性能低下。  




## 三、新的方式  


常见的右值有数字和字符串常量，以及所有的临时变量，隐式的类型转换也属于临时变量。  


面对右值只使用一次的`copy`问题，c++11 支持了一种叫做右值引用的新语法。  


语法：右值引用通过两个引号来表示，如`int&& rvalue_ref `。  


通过右值引用，我们就可以修改右值的值了，也就是可以对右值进行`swap`操作了。  


![](https://res2019.tiankonguse.com/images/2019/12/31/001.png)  


比如上图这段代码，`main`函数里面，第一个`f(a)`会调用左值引用的那个函数，也就是第一个函数。  
而第二个`f(A("99"))`则会调用右值引用那个函数，也就是第二个函数。  
而第三个`f(std::move(a))`则更高端，相当于告诉编译器`a`这个变量可以按临时变量进行优化处理。  


对于 `A` 这个类，我也在构造函数和赋值函数中加了对应的辅助信息。  


![](https://res2019.tiankonguse.com/images/2019/12/31/002.png)  


运行后，可以发现一个神奇的事情。  


![](https://res2019.tiankonguse.com/images/2019/12/31/003.png)  


右值引用 `i` 的值不见了。  


这就是右值引用神奇的地方，我们通过狸猫换太子的手法，把临时变量里面的值变没了。  
而且这个过程速度很快，不怎么消耗性能。  


## 四、最后  


右值引用这个功能非常好。  

有了这个语法，我们就可以使用简单的代码来提高服务的性能了，而不像之前那样各种`swap`。  


你是用过右值引用和`std::move`语法吗？有什么感想？  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

