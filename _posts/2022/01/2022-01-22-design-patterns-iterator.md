---   
layout:     post  
title:  设计模式之迭代器模式     
description: 大家用的最频繁的设计模式之一。  
keywords: 程序人生,项目实战  
tags: [程序人生,项目实战]    
categories: [程序人生]  
updateData:  2022-01-22 17:01:00  
published: true  
---  


## 一、背景  


之前在分享《[【团队分享】GO map 源码实现](https://mp.weixin.qq.com/s/umaH5NHkxg9zH7woNSwq3g)》的时候，介绍了 map 的迭代器实现。  


其实，这背后涉及到一种设计模式：迭代器模式。  


设计模式的书籍和文章很多，这里不过多介绍设计模式的概念，而介绍一些使用场景。  



## 二、日常使用  


先来看一段代码。  


```go
for k,v := range m {
  ...
}
```


相信对于 go 语言，大家平常写代码的时候，经常写上面的语法。  


而对于 cpp 语言，则会写下面的代码  


```cpp
for(auto it = m.begin(); it != m.end(); ++it) {

}
```


其他语言也都有类似的语法。  


不同语言看起来有一些细微差异，但是这些语言底层的实现方式都差不多的。  


都是遵循迭代器设计模式带来的一个好处，语法变得简洁多了。  



## 三、场景


迭代器模式的优点是，我们不需要理解容器的具体实现，就可以按照某种方法，遍历这个容器的所有元素。  


容器可能很抽象，在 java 里叫做集合。  
简单的容器有数组、链表、队列、栈等。  
复杂的容器有 hash 表、二叉树、红黑树等。  


![各种类型的集合](https://res2022.tiankonguse.com/images/2022/01/22/001.png)  



不管容器是什么数据结构，我们都不需要关心，迭代器会去封装好细节。  


我们只需要创建迭代器，然后不断的获取下个值即可。  


这时候你可能会想，直接把迭代器放在对应的容器里实现就好了。  


这样做正常情况下没问题，但是当需要同一时间多次使用迭代器时就有问题。  
因为迭代器迭代过程中需要保存一个状态，在容器内储存状态的话，就没法多次迭代了。  


所以，各种语言自带的迭代器都会封装一个独立的迭代器类。  


![列表与迭代器](https://res2022.tiankonguse.com/images/2022/01/22/002.png)  



有时候，我们希望根据迭代器的自身的性质，选择不同的方式来迭代容器。  


比如对于二叉树容器，我们可能希望采用深度优先便利，也可能希望采用广度优先便利。  


这时候，容器的遍历方式就是随着诉求的变化而变化了。  


![二叉树的不同遍历方式](https://res2022.tiankonguse.com/images/2022/01/22/003.png)  



而从面向对象的角度，有时候可能会有不同的容器，但是我们不关心这个容器的实现方式。  


此时就需要使用抽象迭代器与多态实现了。  


![列表多态与迭代器](https://res2022.tiankonguse.com/images/2022/01/22/004.png)  



## 四、理论  


容器可能是变化的，遍历算法可能是变化的，两个抽象一下，我们就可以设计出一种迭代器模型了。  


![迭代器设计模式](https://res2022.tiankonguse.com/images/2022/01/22/005.png)  


这个图看着比较抽象。  


实际各语言的内部容器实现上，由于只有一种遍历算法与一个容器实现方式，所以都进行了适当的简化，去掉了多态。  


但是，如果我们做项目设计的时候，涉及多种算法或者多种容器，就需要考虑引入多态了。  



## 五、最后  



那我们什么时候需要使用迭代器，什么不应该使用迭代器模式呢？    


如果数据结构或者遍历算法比较复杂时，需要拆分为容器集合类与迭代类，这属于单一职责原则。  


如果后续容器集合要更换数据结构，或者迭代算法要更换时，创建一个新的具体类即可，这样就不需要修改现有的代码。


另外，由于迭代器时单独的对象，遍历的状态与数据结构无关，所以我们同一时间可以创建多个迭代器。  



而项目处于初期，容器非常简单时，比如数组，那可以暂时不要引入迭代器模式，以防过度设计。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
