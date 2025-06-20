---   
layout:     post  
title:  程序如何输入一棵树  
description: 做树相关的题时，有没有想过如何输入一棵树呢？   
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate: 2019-05-24 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/6LkG-e1zq8q4pLI8UnxSCw  
---  


## 一、背景  


平常在 leetcode 上做树的题时，有没有发现树的输入是一个字符串？  


对于 Leetcode 来说，这样做的好处是输入样例和输出样例里面，可以使用字符串来表示一棵树。  


但是对于在本地编写代码，本地测试代码的我们来说，这个就会遇到一个问题：需要将这个字符串转化为树。  


实际上在很早之前，我曾在《[Leetcode 第127场比赛回顾](https://mp.weixin.qq.com/s/FJDQerprDF2RRfJf1boMkw)》里面提到，我的 Leetcode 模板里支持了树，原话如下：  


```
之前提到过，我自己精心打造了一个 LeetCode 专用的模板。
这次做了树相关的题后，发现我的模板中树的封装比较少，这次增加了一些树的基础功能，可以大大的加快测试。
想要我的这个模板的朋友，可以在公众号后台回复leetcode免费获取源代码。

这次主要新增了这样几个功能：
1.LeetCode 数组形式的输出样例转化为树
2.友好的打印树
3.自动对比树的答案是否正确
```


今天我们就来看看这个功能是如何实现的吧。  


## 二、题意  


设计一个算法来实现二叉树的序列化与反序列化。  


序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境。  
采取相反方式则可以得到原数据。  


## 三、标准二叉树  

 
假设这棵树是标准的二叉树，那直接按照先序遍历就可以生成一个序列，这个序列可以逆向生成原始的二叉树。  


大概方法是维护一个队列，代表当前构造出来树的叶子节点。  
每次从队列里得到待处理的节点`A`，序列里面接下来的两个值就是节点A的两个儿子。  
然后两个儿子进入队列，节点`A`出队列，这样队列就保持了所描述的包含所有叶子节点的性质。  


大概流程如下：  


![](https://res2019.tiankonguse.com/images/2019/05/25/001.png)  


## 四、非标准二叉树  


对于非标准二叉树，有些节点可能只有一个儿子或者没有儿子，此时可以使用 `null` 来代替。  
那我们有没有必要使用 `null` 填充一个满的二叉树呢？    


答案是否定的。  


分析一下上面标准二叉树的过程，队列里的节点与序列里的两个值一一对应起来。  
如果我们遇到某个节点的儿子为空填充为`null`时，只需要进行特殊处理，不进入队列。  
那么，队列里的叶子与序列里的值将依旧是一一对应的，从而保证可以还原会原始的二叉树。  


大概流程如下：  


![](https://res2019.tiankonguse.com/images/2019/05/25/002.png)  


按照这样的理论，我们就可以实现对应的序列转二叉树了。  


## 五、总结  


总结一下就是：当一个节点某个儿子为空时，用`null`代替。  
这样使用先序遍历生成的序列就可以唯一的表示一个二叉树了，从而能够还原二叉树。


![](https://res2019.tiankonguse.com/images/2019/05/25/003.png)  


而对于二叉树生成序列，而按照定义BFS生成即可。


![](https://res2019.tiankonguse.com/images/2019/05/25/004.png)  


## 六、最后  


二叉树序列化的方法其实很多，这篇文章分享的只是 LeetCode 上使用的一种方法。  
常见的序列化方法还有哪些呢？可以留言一起探讨一下。    


-EOF-  



