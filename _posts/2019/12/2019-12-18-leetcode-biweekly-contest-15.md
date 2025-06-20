---   
layout:     post  
title:  Leetcode 第 15 场双周赛回顾 
description: 比赛  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2019-12-18 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


上周有事，没有参加比赛。  
然后这周工作上又比较忙，一直没有写上周比赛的题解。  
今天公司年会，趁着看直播的时间，写一下上周六比赛的题解。  


## 一、超过 25% 的元素  

题意：给一个有序数组，只有一个元素重复的次数占比超多 `25%`。 求找到这个数字。  


思路：既然只有一个超过 `25%`， 也意味着出现次数最多的数字就是答案了。  
所以问题就转化为了求出现次数最多的那个数字。  


![](https://res2019.tiankonguse.com/images/2019/12/18/001.png)  


## 二、删除被覆盖的区间  


题意：给一些区间，如果区间`[a, b]`覆盖另外一个区间`[c, d]`，则将区间`[c, d]`删除。  
覆盖定义： 当 `a<=c && d <= b` 时，称为区间`[a, b]`覆盖区间`[c, d]`。  
问题：求删除后剩余的区间个数。  


思路：先分析区间之间的关系。  


如果区间起始位置相等时`a==c`，最大的结束位置肯定覆盖其他所有位置的区间。  
所以，对于相同的起始位置的区间，保留最大的那个，其他的肯定需要删除。  


如果起始位置不等，那么起始位置小的区间可能覆盖起始位置大的区间，反之不成立。  


根据上面的两个结论，先对区间排序。   


排序规则是前面的可能覆盖后面的，后面的一定不会覆盖前面的。  


具体是先按左区间排，小的在前面，大的在后面。  
左区间相等时，再按右区间排序，大区间在前面，小区间在后面。  


排完序后，我们就可以从前到后比较，把能删除的都标记删除。  


![](https://res2019.tiankonguse.com/images/2019/12/18/002.png)  


## 三、迭代组合  


题意：给`n`个不重复的字母，挑选`m`个组成一个字符串。  
大概有`C(n, m)`中组合情况，请按照字典序依次输出所有情况。  


比如给三个字母`abc`，挑选个数是`2`，则组合情况有三种：`ab`，`ac`，`bc`。  


思路：挑选`m`个字母，可以想象为有`m`个滚动时的字母转盘。  


![](https://res2019.tiankonguse.com/images/2019/12/18/003.png)  


从左到右的字母必须是升序，每次从最右边的转盘加一。  
如果从最大的转到最小的时候，就触发进位，左边的转盘需要转一下。  
如果左边的也是最大值转到最小值，则依次递推。  


当某一个转盘没有触发最大值转最小值的情况时，这个转盘右边的转盘需要递增重置。  


![](https://res2019.tiankonguse.com/images/2019/12/18/004.png)  


## 四、最小矩阵和  


题意：给一个矩阵，每一行可以挑选一个数组，相同两行挑选位置不能相同。  
使最终挑选数字的和最小。  


思路：典型的动态规划题。  


由于只有相邻两行不能相同，只需要计算出上一行每一列的最优值，就可以计算当前行每一列的最优值。  


比如对于 `dp[i][j]`为结尾的最优值，是第`i-1`行中，列不等于`j`的所有最优值里面最小的那个。  


暴力方法：按照基本思路寻找最优值。  
复杂度：`O(n^3)`  


![](https://res2019.tiankonguse.com/images/2019/12/18/005.png)  


优化：可以通过预处理，快速找到最小值。  


具体来说就是用`hash_map`做一个值到列位置的反向统计。  
如果上一行最小值的列数有不等于当前列数的答案，则找到最小值。  
否则上一行次最小值的列数就是要找的答案。  


复杂度：和输入数据一样，是`O(n^2)`。  


![](https://res2019.tiankonguse.com/images/2019/12/18/006.png)  


## 五、最后  


这次比赛后两题有点意思。  
而最后一题，则有很多变种，比如连续`k`行不能相同，此时该怎么做呢？  
还有所有行不能相同，又该如何做呢？  


对于这个变种，你会做吗？  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

