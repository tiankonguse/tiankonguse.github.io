---   
layout:     post  
title:  学习 c++11 之 function 模板  
description: 快来学习c++新功能 function 模板 吧。    
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2019-12-27 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


之前提到，我们开始从 c98 切换到 c++11 了。  


所以我打算分一个系列来介绍常见的 c++11 的语法。  


今天要分享的第三个知识点大家用的比较少，就是 function 模板 。  


## 一、旧的方式  


在一些工厂模式里面会经常遇到一些场景。  


比如根据指定的参数调用对应的函数来创建对象或者执行一些操作。  


![](https://res2019.tiankonguse.com/images/2019/12/27/001.png)  


一种不错的方法是记录参数与回调函数指针的对应关系。  

函数指针默认的写法非常复杂，没人会玩。  
于是大家都是使用 `typedef` 来对函数指针重命名。  


![](https://res2019.tiankonguse.com/images/2019/12/27/002.png)  


但是由于函数指针的的特殊性，这样写依旧很复杂。  
尤其是在写`typedef`的类型名称时，总是有人不知道写在哪里。  


所以我们需要一种符合常规语法的方法，那就是模板函数类。  


## 二、新的方式


新的方式里，我们可以轻松定义一个函数类型。  
语法如下：  


```
std::function<返回类型(参数列表)> 函数名称  
```


这样，我们就不需要纠结怎么函数指针了。  


![](https://res2019.tiankonguse.com/images/2019/12/27/003.png)  


function 函数对象可以直接储存全局函数、匿名函数、仿函数、类的静态函数。  

```

int globalFun(int v){
    return 10 * v;
}

auto lambdaFun = [](int v)->int{
    return 20 * v;
};

class Functor{
public:
    int operator()(int v){
        return 30 * v;
    }
};


class Class{
public:
    static int classFun(int v){
        return 40 * v;
    }
};

void test(){
    std::function< int(int)> func;
    func = globalFun;
    cout << "globalFun: " << func(100) << endl;
    func = lambdaFun;
    cout << "lambdaFun: " << func(100) << endl;
    func = Functor();
    cout << "Functor: " << func(100) << endl;
    func = Class::classFun;
    cout << "Class::classFun: " << func(100) << endl;
}

```


而对于类的普通函数，则需要使用更高级的做法才能储存起来，以后有机会分享给大家。  


## 三、实际应用  


上一篇文章《[学习 c++11 之 Lambda表达式](https://mp.weixin.qq.com/s/IIL3EA6GU1yuM3jfVcARsQ)》里介绍了匿名函数。  


那匿名函数创建后，总需要储存起来吧。  


你猜的没错，就是定义一个 function 变量来储存。  


这样就可以在恰当的时机，回调业务写的一段代码块，俗称匿名函数。


![](https://res2019.tiankonguse.com/images/2019/12/27/004.png)  


## 四、最后  


函数类这个语法是一件非常有意义的突破。  


有了函数类，所有的函数都是一家人了。  


我们通过同一个方式储存与访问所有的函数。  


你们在哪些场景使用函数类呢？  

-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

