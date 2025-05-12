---   
layout:  post  
title: cpp如何调用两个模板类的重载函数    
description: 一个有意思的问题。          
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2023-10-04 18:13:00  
published: true  
---  


## 零、背景  


有天晚上，小群里有个人问了一个 cpp 语言的问题：两个模板类如何放在一个容器里，不能使用任何形式的cast转换和`void*`，如何调用模板类的重载函数。  


![](https://res2023.tiankonguse.com/images/2023/10/04/001.png)


## 一、问题分析  


这里有两个问题。  


问题一：两个类没关系。  


虽然类 B 继承了类 A，类 C 继承了类 A，但是由于类 A 是模板类，且传入的类型不同，所以类 B 和 类 C 其实是完全不同的类，没有任何关系。  


如果要将类 A 和 类 B 放入容器，就需要使用某种技术忽略类的类型。  


方法1：`std::any`  
方法2：`void*`  
方法3：多态  
方法4：`std::variant`  


使用 `std::any`，需要使用`std::any_cast`来特殊判断。  
使用 `void*` 需要使用 `static_cast` 来特殊判断。  


可以供选择的就只有多态与`std::variant`了。   


问题2：不同类需要调用的方法不一样，即方法名相同，参数类型不同。  


这个比较棘手，不同参数类型其实就是不同的方法了。  
后面单独讨论。  


## 二、多态实现  


设计多态时，两个类型的方法都需要时虚函数，类图如下：  


![](https://res2023.tiankonguse.com/images/2023/10/04/002.png)



多态实例实际调用时，具体类型的方法可以触发多态，不相关类型的方法需要进行转发。  


![](https://res2023.tiankonguse.com/images/2023/10/04/003.png)



如果只有两个类型，互相转发好可以实现目标。  
如果有三个类型，我们就不知道该转发给那个类型了。  


对于这个问题，第一个方法是子类实现所有虚函数，进行转发。  
但是这样新增一个类型时，所有子类都需要进行修改。  


![](https://res2023.tiankonguse.com/images/2023/10/04/004.png)



第二个方法是基本保存类型信息，进行特殊判断。  


![](https://res2023.tiankonguse.com/images/2023/10/04/005.png)


## 三、variant 实现  


variant 是 C++17 引入的一种技术，是一种类型安全的 union，用于存储多个可能类型的值。  


![](https://res2023.tiankonguse.com/images/2023/10/04/006.png)


variant 有两种方法来获取值。  


一种是直接判断类型，类似于多态时通过类型的判断。  



![](https://res2023.tiankonguse.com/images/2023/10/04/007.png)


第二种是通过 `std::visit` 来多态地访问 `std::variant` 中的值。  


![](https://res2023.tiankonguse.com/images/2023/10/04/008.png)


## 四、最后  


对比了多态与variant，发现 variant 结合 visit 是最优解，不需要任何特殊判断了。  


其实，我一开始想通过工厂模式或者表格模式来管理各个类的回调，但是由于参数类型不同，一直没找到好的办法来实现。  


针对这个你有什么好的想法吗？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

