---   
layout:     post  
title: go 接收器类型选择的 9 条原则  
description: CR 代码的时候，发现有人使用 Values，查阅了下文档。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2021-07-14 21:30:00  
published: true  
---  


## 一、背景  


在 CodeReview 同事的 go 语言代码时，发现有个方法的接收器写的是值，而不是指针。  


我写的 go 代码不多，于是，在群里抛出这个问题，是否应该改成指针。  


群里探讨起来，说有时候应该应该应该使用指针，有时候可以使用值。  


最后有人发了两个文档，算是做了总结，这里记录分享一下。  


## 二、Receiver Type  


这个是 go 官方的文档。    
https://github.com/golang/go/wiki/CodeReviewComments#receiver-type  


文中主要介绍，给接收器定义方法时，什么时候应该使用值，什么时候应该使用指针。 


下面是官方给的 9 条指导手册。  


1）如果接收器是 `map`、`func`、`chan`，不要使用指针。 
如果接收器是不会进行 `reslice` 和 `reallocate` 的 `slice`，也不要使用指针。  


2）如果接收器需要修改，接收器必须使用指针。  


3）如果接收器是个 `struct`，且包含 `sync.Mutex` 或者类似的同步字段，必须使用指针避免发生复制。  


4）如果接收器是一个大的 `struct` 或者 `array`，使用指针接收器更优效率。  


5）值方法会复制一份接收器，如果需要修改原始的接收器，就必须使用指针。  


6）如果接收器是`struct`、`array`、`slice`，并且他们的元素是可能被修改的指针，那为了保持意图一致，建议使用指针接收器。  


7）如果接收器是小的 `array` 或 `struct`，或者基本类型，并且都不会修改，可以考虑使用值接收器。  
这样做会更优效率，因为这时候，对于值复制参数，编译器会尝试直接在栈上分配内存，而不是堆上，从而可以减少 garbage 的数量。  


8）对于可导出的接收器的方法，类型不要混合使用。  


9）如果有疑问，那就使用指针接收器。  



可以看到上面的 9 条有一半都是重复的。  


所以去重总结下就是，`map`、`func`、`chan`类型的接收器必须使用指针，修改接收器或元素、同步字段必须使用指针。  
只有较小的类型且不修改时，才能使用值接收器。  


或者说，有疑问，使用指针就对了。  




## 三、Pointers vs Values  


还有另外一个官方文档。  
https://golang.org/doc/effective_go#pointers_vs_values    


这个文档主要介绍调用函数时，指针方法与值方法的区别。  


```
 The rule about pointers vs. values for receivers is that value methods can be invoked on pointers and values, but pointer methods can only be invoked on pointers.
```


翻译一下就是，value 方法都可以被 pointers 和 values 调用，但是指针方法只能通过指针调用。  


```
This rule arises because pointer methods can modify the receiver;   
invoking them on a value would cause the method to receive a copy of the value, so any modifications would be discarded. 
```


有上面的规则的原因是，指针方法可以修改接收器，通过值调用方法，接收器是值的一个 copy，这导致最终任何修改都会被忽略。  


```
There is a handy exception, though.   
When the value is addressable, the language takes care of the common case of invoking a pointer method on a value by inserting the address operator automatically. 
```

然而，go 原因提供了一个方便的例外。  
当一个值是可寻址的，go 语言会自动转化为指针调用的方式。  


例如：`a.set` 会自动转化为 `(&a).set`。  


有了自动转化这个逻辑，我们调用 go 语言的函数时，就不需要关心是 值还是指针了，全部使用 `.` 就行了。  


## 四、最后  


虽然 go 官方给出了一些建议，某些时候可以使用值接收器的方法。  


但是当接收器被 `type` 自定义为自定义类型时，我们 CR 别人的代码就无法区分这个写法是否正确了。  
每次看到值接收器，还需要去找接收器的真实类型，然后才能确定写的对不对。  


不知道大家 CR 代码时有没有这个困扰，或者有什么工具可以做这样的检查吗？  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

