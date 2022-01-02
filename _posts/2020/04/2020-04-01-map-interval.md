---   
layout:     post  
title:  leetcode上的几个区间题  
description: 你可以来做一下，很有意思。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-04-01 21:30:00  
published: true 
---  


## 一、背景   


在《[map中被你忽视的四个功能](https://mp.weixin.qq.com/s/e2JW_YpWEDPEx4Yv92Soaw)》文章中，我介绍了 map 的一些功能，尤其是最后提到可以用来解决区间问题。  


然后有人问我有没有题来练习，我去 leetcode 上找了一些，发现有很多不同难度的题供大家练习。  


这里我再介绍一下 map 怎么维护区间，然后简单介绍一下题目，大家可以去练习一下。  


## 二、基础知识  

map 内部是使用搜索树实现的，所以 map 的 key 是有序的。  


由于是有序的， map 的 key 可以进行二分查找，比如常见的 upper\_bound 和 lower\_bound 都可以使用。  


upper bound 的意思是查找第一个大于 k 的元素。  
lower bound 的意思是查找第一个大于等于 k 的元素。  


明白了这两个函数的意思，我们就可以使用 map 来查询区间了。  


一般 map 的 key 用来储存右区间，value 储存左区间。  
至于是否开放与封闭，则需要根据实际情况来使用。  


由于 upper bound 是第一个大于 k 的元素，右区间恰好等于k时不满足条件，所以需要按左关右开区间来处理。  

![](http://res2020.tiankonguse.com/images/2020/04/01/001.png)  


同理，lower bound 右区间可以查找到，所以需要按左开右关区间来处理。  


![](http://res2020.tiankonguse.com/images/2020/04/01/002.png)  


掌握了两个函数与区间关闭的关系，我们就可以来解锁很多题目了。  


## 三、Merge Intervals  


题意：给一些区间，对于有交集的区间需要合并，返回一个合并后的区间列表。  


思路：这道题暂时还不需要用到 map，直接对区间排序，一个个合并即可。  


![](http://res2020.tiankonguse.com/images/2020/04/01/003.png)  


## 四、Insert Interval  


题意：给一些没有交集的有序区间和一个任意区间，求合并后的区间。  


思路：可以先把所有区间当做任意区间，按照上一道题的思路来排序合并。  


但是这里既然是有序的，我们就没必要排序了。  


直接使用冒泡排序的思想，一个个冒泡去判断是否有交集，有了合并即可。  


当然，为了性能，我使用的是插入排序。  



![](http://res2020.tiankonguse.com/images/2020/04/01/004.png)  



## 五、Range Module  


题意：不但给一些操作，可以插入一个区间，也可以删除一个区间，问某个区间是否存在。  
这里是否存在可以是某个区间的子集。  


思路：使用 map 来储存区间即可。  


插入时，分三种情况：最右边无交集，中间无交集，有交集。  
注意事项是又交集时需要不断的循环来合并区间。  


![](http://res2020.tiankonguse.com/images/2020/04/01/005.png)  


删除的时候，有交集存在多种情况，比如全删除、删左半部、删右半部，删中间等。  


![](http://res2020.tiankonguse.com/images/2020/04/01/006.png)  


查找非常简单，直接判断边界即可。  


![](http://res2020.tiankonguse.com/images/2020/04/01/007.png)  


## 六、最后  


还有一道题，是 Data Stream as Disjoint Intervals， 和 Range Module 差不多，大家也可以练习一下。  


有没有发现区间合并的题很有意思？  


思考题：你感觉有意思呢，还是头晕了呢？  




《完》


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

