---   
layout:     post  
title: Google C++代码规范：头文件  
description: 好的规范还是需要学习一下。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-05-13 21:30:00  
published: true  
---  


## 一、背景  


最近在阅读 Google C++ 代码规范，常用的整理出来，分享给大家。  


阅读的相关规范主要是 [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html)。  


作为第一篇，先分享一下头文件规范。  


## 二、头文件  


通常，每一个 .cc 文件都有一个对应的 .h 文件。  
也有一些常见例外，如单元测试和只包含 main() 函数的小型 .cc 文件。  


正确使用头文件可令代码在可读性、文件大小和性能上大为改观。  


## 三、Self-contained 头文件  


头文件应该是自给自足（ self-contained，可自编译），以 .h 结尾。  
禁止分离出 -inl.h 头文件的做法。  


自给自足的意思是用户和重构工具不需要为特别场合而包含额外的头文件和符号（symbols）。  


## 四、头文件保护  


所有头文件都应该使用 #define 或 #pragma once 来防止头文件被多重包含。  


其中 #define 的命名格式当是： <PROJECT>_<PATH>_<FILE>_H_。  


使用 cpplint 工具来检查头文件保护，如果不符合要求，会有下面两种错误提示：  


```
#ifndef header guard has wrong style, please use: <PROJECT>_<PATH>_<FILE>_H_  [build/header_guard]cpplint

#endif line should be "#endif  // <PROJECT>_<PATH>_<FILE>_H_  [build/header_guard]cpplint
```


## 五、前置声明  


尽可能地避免使用前置声明。  


使用 #include 包含需要的头文件。  


定义：前置声明（forward declaration）是类、函数和模板的纯粹声明，没伴随着其定义。  


优点：节省编译时间。  


缺点：隐藏依赖关系，依赖升级可能会不兼容甚至引入某些 BUG。  


例如对函数进行声明，后来加了一个参数，就会导致找不到函数。  
如果对类进行声明，类进行调整时，甚至可能导致类的内存错误。  


## 六、内联函数  


只有当函数只有 10 行甚至更少时才将其定义为内联函数。  


定义：当函数被声明为内联函数之后，编译器会将其内联展开，而不是按通常的函数调用机制进行调用。  


优点：内联函数较小时，可以使代码性能更高（少一次函数调用）。  


缺点：滥用内联函数导致程序变慢。  


注意实现：递归和虚函数不能使用内联。  


## 七、  include 的路径及顺序  


标准的头文件包含顺序可增强可读性，避免隐藏依赖。  


要求头文件顺序为：相关头文件、C 库、C++ 库、其他库的 .h、本项目内的 .h。  


项目内头文件应按照项目源代码目录树结构排列，避免使用 UNIX 特殊的快捷目录. (当前目录) 或 .. (上级目录)。  


例如 dir/foo.cc 或 dir/foo\_test.cc 的主要作用是实现或测试 dir2/foo2.h 的功能，foo.cc 中包含头文件的次序如下：  


```
1. dir2/foo2.h（优先位置，详情如下）  
2. 空行  
3. C 系统头文件  
4. 空行  
5. C++ 标准库头文件  
6. 空行  
7. 其他库的 `.h`文件  
8. （可选）空行  
9. 本项目内 `.h`文件  
```


## 八、最后  


回顾一下，对于头文件的规范，细分为五个子规范，分别是 Self-contained 头文件、头文件保护、前置声明、内联函数、include 的路径及顺序。    


如果你想查看 Google C++ Style 原文文档，可以点击这里：https://google.github.io/styleguide/cppguide.html  


当然，你也可以点击左下角的原文阅读来快速到达。  




《完》


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

