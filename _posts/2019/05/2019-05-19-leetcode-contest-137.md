---   
layout:     post  
title:  Leetcode 第137场比赛回顾  
description: 最后一题是好题，但是明白意思后是大水题。   
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate: 2019-05-18 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/5nK9I-HrSYeGI4TJJGBe_w  
---  


## 零、背景  


Leetcode 第136场比赛的题其实很不好，前三题太简单，第四题则是想到则会，想不到则很难的题。  
下面我们来看看吧。  


![](https://res2019.tiankonguse.com/images/2019/05/19/001.png)  


## 一、最后一块石头的重量  


题意：有一堆石头，每块石头的重量都是正整数。  
每一回合，从中选出两块最重的石头，然后将它们一起粉碎。  
如果两个石头重量不相等，剩余的重量会当做新的石头放在这堆石头里。  
问当不能操作时，这堆石头的重量。  


思路：使用堆这个数据结构来快速找到最大的石头即可。  
在`C++`的`STL`里面，名字叫做优先队列。  


## 二、删除字符串中的所有相邻重复项  


题意：字符串里相邻两个字母如果相等，可以同时删除。  
问最后不能再删除时的字符串。  


思路：就像括号匹配，维护一个栈即可。  


## 三、最长字符串链  


题意：如果一个字符串 A，在任意一个位置插入一个字符，能够形成另外一个字符串 B，则称 A 是 B 的前身。  
若干个字符串，如果能从第一个依次形成下一个字符串，则这些字符串称为词链。  
求词链的最大长度。  


思路：预处理字符串，构造出一个图，字符串是顶点，如果一个是另一个的前身，则有一个单向路径。  
然后 DP 求出每个字符串为起点的最大路径长度。  
答案则是这些路径长度里最大的那个。  


注意：DFS的时候，通过 DP 来防止计算过的节点重复计算。


## 四、最后一块石头的重量 II  


题意：有一堆石头，每块石头的重量都是正整数。  
每次可以任意选两块石头进行粉碎。  


如果重量相等，则两个石头都粉碎。  
如果重量不相等，则差值是合并后的石头重量。   
问最后这堆石头的最小重量。  


思路：比赛的时候在思考二分以及剪枝搜索，发现一直行不通。  
赛后看到有人说是 DP，然后恍然大悟。  


关键思想：对于一堆石头，比如四个，有很多种组合可能，哪种是最优值我们是不知道的。  
比如石头分别是 `A <= B <= C`。  


则有这些组合情况：  


```
A - (C - B)
B - (C - A)
C - (B - A)
```


简化一下就是：  


```
+ A + B - C
+ A + B - C
+ A - B + C
```


这里可以看到，一堆石头的合并可以看做有一堆括号的加减运算。  
而我们把括号全部展开后，就是一堆石头是加号，一堆石头是减号，目标是求绝对值最小。  


加号的石头放在一起，减号的石头放在一起，问题就转化为了：将这堆是有分成两部分，总重量差最小。  
妈呀，这不就是最基础的背包问题吗？  


考虑到物品只有 30 个，每个石头重量不超过 1000，总重量不超过 3万，直接暴力枚举所有加减符号即可。  


注：由于是最小值，也可以使用石头总和的一半来过滤显然不是答案的数据。  
不过数据量这么小，这里就不过滤了。  


![](https://res2019.tiankonguse.com/images/2019/05/19/002.png)  


## 五、最后  


这次比赛，第一题我没有使用优先队列，使用的是`multiset`，结果发现删除的时候，一下就把所有相同的删除了，而不是删一个，被坑了一下。于是我改成`map`计数过的  
第二题随手过了。  
第三题在判断是不是前身时，`copy`错了一个判断语句，`WA`了一次。  
最后一题就没想法了。  


另外，为了提高后续的编码速度，我将常用的函数收集在了模板文件`base.h`内。  
大家如果使用我的模板的话，可以来看这个来提高效率。  


![](https://res2019.tiankonguse.com/images/2019/05/19/003.png)


-EOF-  



