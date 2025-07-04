---   
layout:     post  
title:  Leetcode 第142场比赛回顾  
description: 今天因为第一题没看懂题意，导致这次比赛失败了。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate:  2019-06-23 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/Q3IugqcNwP8n82sGn0kRLA  
---  


## 零、背景  


Leetcode 第 141 场比赛的题目难度其实属于中等，但是比赛的时候我第一题一直没看懂题意，导致这次比赛只做了三道题。  
赛后看看，这些题都是好题。如第一题是统计题、第二题是调度题、第三题是二分查找题、第四题是模拟题。  



![](https://res2019.tiankonguse.com/images/2019/06/23/001.png)


## 一、大样本统计  


题意：这道题我看了半个小时才看懂题意。  

原来具体意思是，有255个数字`0~254`，分别统计了这些数字出现的次数（数组对应的值）。  
然后需要统计5个数据。  


1. `minimum` 最小值。  
出现的最小数字，就是最小的非0值得下标。  


2. `maximum` 最大值。  
出现的最大数字，就是最大的非0值的下标。  


3. `mean` 平均数。  
所有数字累积和除以数字个数。  
大概公式就是`count[i] * i / sum(count)`。  


4. `median` 中位数。  
中间的那个数，如果是偶数个，则中间的那两个的平均值。  
这个可以先遍历一遍统计数字的个数，然后再遍历一遍找中间的那个数字。  


5. `mode` 众数。  
出现次数最大的数字，就是`count[i]`最大值的下标。  


理解了题意，代码就好实现了。  
除了中位数有点挑战，其他的大家应该都可以随手写出来吧。  



## 二、拼车  


题意：依次告诉我们顺风车每个订单的人数、上车地点、下车地点。  
问顺风车一趟是否可以完成所有订单。  


思路：有多种方法做这道题。  


第一个方法是排序法。  

先排序，上车地点较小的排在前面。对于上车地点相等的订单，下车地点较小的排在前面。  
然后依次遍历订单，优先判断是否可以下车，可以了则下车，然后判断是否可以上车，不可以就代表不存在答案。  


![](https://res2019.tiankonguse.com/images/2019/06/23/002.png)


第二个方法是枚举模拟法。  
由于路程最多只有`1000`，那直接将上下车的信息储存在路程上。  
然后枚举所有路程，判断是否要下车，是否要上车，是否可以上车等等。  


![](https://res2019.tiankonguse.com/images/2019/06/23/003.png)


## 三、山脉数组中查找目标值  


题意：告诉一个山峰数组，问一个目标数字是否在山峰里，如果存在，输出最小的下标。  


思路：山峰是一个先递增再递减的数组。  
如果可以找到最高点的下标，则可以现在左半部二分查找，找到了则返回答案。  
没找到再去右半部二分查找，找到了则找到，没找到则不存在目标。  


这里查找最高点有两个方法。  
第一个方法是传统的三分查找。  
第二个方法是二分查找加特殊判断（判断当前属于递增区间还是递减区间）。  


而递增二分查找与递减二分查找是对称的，所以两个代码也可以合并为一个代码，使用flag标记即可。


![](https://res2019.tiankonguse.com/images/2019/06/23/004.png)


## 四、花括号展开 II  

题意：告诉我们三个规则。  


规则一：单个字符串集合，可以表示为`a`，代表一个字符串`"a"`。  
规则二、字符串集合的并集，表示为`{a,b,c,d}`，代表`"a","b","c"`四个字符串。  
规则三、字符串集合的叉集，表示为`{a,b}{c,d}e`，代表`"ace","ade","bce","bde"`四个字符串。  


问题：告诉我们一个表达式，求最终的字符串集合。  


思路： 这个规则描述其实不太好实现，我们稍微转化一下就简单了。    


定义：`a,b,c,d,e,f`都是符合规则的表达式。  
规则零、字符串，使用`[a-z]+`表示，代表一个集合，只有一个字符串。  
规则一、字符串集合，使用`{a}`表示，代表`a`是一个合法的表达式，对应的结果是一个字符串集合。  
规则二、字符串集合的并集，使用`a,b,c,d`表示，代表`a,b,c,d`四个集合求并集。  
规则三、字符串集合的叉集，使用`abcd`表示，代表`a,b,c,d`四个集合求叉集。  
叉集定义（两个集合为例）：第一个集合里的任何一个元素与第二个集合里的任何一个元素拼接在一起所形成的的字符串集合。  


按照这个定义，问题给的表达式其实属于规则二。   
规则一由花括号与规则二组成。  
规则二由若干个逗号分隔的规则三组成。  
规则三由若干相连的规则零或规则一组成。 


由此，我们可以写出对应的递归方程来。  


![](https://res2019.tiankonguse.com/images/2019/06/23/005.png)


## 五、最后  


这次比赛的最后一题其实不难，但是看比赛结果可以看出来很多人实现不出来。  


我在《[递归就是这么简单(原理篇)](https://mp.weixin.qq.com/s/pN9T9hyjClHFNfajxlWKkA)》的最后一小节提到：  


```
对于递归，已经写过程序的人都会感觉这个很简单。  
但是如果看过语法解析或者协议解析的代码，比如json库、protobuf库，就会发现这些库也就是一些递归函数的互相调用。  
  
  
那为什么说起递归会感觉简单，实现一个json库或者程序语言的语法分析器很多人认为很难呢？  
```


而这次最后一题就是一个最简单的语法解析，你可以来挑战一下，看你用多久才能独立实现这个花括号展开吧！  




-EOF-  

