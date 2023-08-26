---   
layout:  post  
title: leetcode 第 358 场算法比赛  
description: 最后一题被卡内存了。          
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2023-08-13 18:13:00  
published: true  
---  


## 零、背景  


周五的时候，组长说周日下午要召集大家开会。  
所以周日我今天就没出门，从而上午可以参加这场比赛了。  


## 一、数组中的最大数对和


题意：给一个数组，问是否存在两个下标匹配，使得坐标值的最大数位值相等。  
如果存在，输出满足匹配的最大坐标值之和。  


思路：预处理数组，计算出每个坐标的最大数位值，并按最大数位值分组。  
相同的最大数位值的可以形成匹配，排序可以计算出最大坐标值之和。  


## 二、翻倍以链表形式表示的数字  

题意：给一个链表形式的非负大整数。  
求这个大整数乘以2的答案。  


思路：分为三步。  
第一步：反转链表，使得个位在前面。  
第二步：乘以 2，记录最终是否有进位。   
有的话，创建一个新节点，放在最后。  
第三步：反转链表。  


## 三、限制条件下元素之间的最小绝对差


题意：给一个数组，选择两个元素，要求元素的下标距离不小于 x，求元素之差绝对值的最小值。  


思路：枚举。  


维护一个有序集合，用于二分查找指定值最近的元素。  
从左到右，枚举较小的下标。  
有序集合里把下标距离小于 x 的元素都删除。  
集合里剩下的元素都是满足要求的元素。  
从而可以二分计算出当前下标的最优答案。  


复杂度：`O(n log(n))`  


## 四、操作使得分最大

题意：给一个数组，每个元素有一个质数分。  
现在需要选择 k 个不同的子数组，使得子数组最高元素的乘积最大。  
质数分定义：一个数字质数分解，出现的不同质数个数。  
子数组最高元素定义：子数组中质数分最高的元素值，如果有多个，返回下标最小的那个。  


思路：综合题。  


第一步：预处理素数表，计算出每个元素的质数分。  
第二步：预处理子数组最高元素为每个下标的个数。  
第三步：对元素值与坐标二元组排序  
第四步：按元素值从大到小，选择 k 个子数组，答案使用快速幂计算。  


第一步的素数表，直接使用素数筛法即可。  
时间复杂度：`O(n log(n))`  
空间复杂度：`O(n)`  


第二步预处理每个位置为子数组最高元素的个数。  


比赛时，我使用线段树二分查找来做。  
对于一个下标 `i` ，二分查找最左边界`l`，使得 `[l, i)` 的最大值小于 `nums[i]`。  
二分查找最右边界 `r`，使得 `[i,r)` 的最大值小于等于`nums[i]`。  


时间复杂度：`O(n log(n))`  
空间复杂度：`O(n)`  
比赛的时候，这个算法被卡内存了， MLE。  


赛后发现大家都是使用单调栈做的。  
维护一个从左到右的单调递减栈，从而计算出每个下标的左边界。  
维护一个从右到左的单调递减栈，从而计算出每个下标的右边界。  
时间复杂度：`O(n)`  
空间复杂度：`O(n)`  


第四步：k 个选择最大是 `10^9`，一个个乘肯定会超时。  
所以可以使用快速幂来加速乘法。  


## 五、最后


这次比赛最后一题大意了。  
线段树我一开始使用的模板，内存常数比较大。
使用线段树 MLE 后，我一直在优化内存，直到比赛结束，还是 MLE。  


看来以后 leetcode 比赛选择线段树之前，先评估能不能扫描一遍就做出来。  
不然像这种遇到 MLE 卡内存，就很浪费时间了。  


这四道题你都是怎么做的呢？  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
