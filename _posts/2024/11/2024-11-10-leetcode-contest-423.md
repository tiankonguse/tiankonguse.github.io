---
layout: post  
title: leetcode 第 423 场算法比赛（数位DP）  
description: 数位DP。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2024-11-10 12:13:00  
published: true  
---


## 零、背景  


这次比赛第二题开始难度就上来了，后三道题都很有意思。  


A: 暴力  
B: 分段  
C: 计数DP  
D: 数位DP  


排名： 145   
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/423  
 

## 一、检测相邻递增子数组 I  

题意：给一个数组，问是否存在两个相邻的长度为K的严格递增子数组。  


思路：暴力。  


首先可以确定一个结论：一个递增的区间内，任何子数组都是递增的。  
根据这个结论，可以对数组划分为几个递增的最大区间。  
区间内，第一个元素的最大递增数组为区间大小，之后的依次递减，最后一个长度为1。  


按上面的理论，预处理所有位置向后的最长递增数组。  
然后枚举每个位置当做起始位置，判断是否存在相邻的长度为 k 的递增子数组。  


预处理复杂度：`O(n)`  
枚举复杂度：`O(n)`  


## 二、检测相邻递增子数组 II  


题意：给一个数组，问相邻的等长的最大递增子数组是多少。  


思路：分段。  


根据第一题的力量，可以知道一个递增的区间内，任何子数组都是递增的。  
故可以根据最大的递增区间，对数组划分为几段。  


答案分两种情况：  
情况1：在一个递增区间内划分两个相邻的子数组。  
情况2：相邻的两个递增区间组成两个相邻的子数组。  


情况1中，每个区间大小除2就是区间内的临时答案。  
情况2中，相邻的区间较小的为临时答案。  


两种情况所有的临时答案取最大值即可。  


复杂度：`O(n)`  


PS：第一题也可以这样做，找到最大值后，判断是否大于等于k即可。  


## 三、好子序列的元素之和  


题意：给一个数组，求所有的好子序列的元素之和。  
好子序列：相邻元素的绝对差恰好为1。  


思路：计数动态规划。  


通过分析可以发现，一个好子序列后面追加一个数字，依旧可以组成好子序列。  
故，每个位置为结尾的好子序列可以通过前面的好子序列转移计算得到。  


状态1定义: `N(i)`  
含义： 以第 i 个元素为结尾的所有好子序列的个数。  


状态2定义：`S(i)`  
含义：以第 i 个元素为结尾的所有好子序列的和。  


状态转移方程：  


```
v = nums[i];
N(i) = 1 + N(v+1) + N(v-1)  
S(i) = S(v+1) + S(v-1) + N(i)*v
```


新的好子序列分为三种情况：自身、前一个值大于v，前一个值小于v。  
根据这三种情况计算出新的个数和子序列和。  


复杂度：`O(n)`  


## 四、统计小于 N 的 K 可约简整数  


题意：给一个值为 n 的二进制字符串，求小于 n 的 k 次约简后值为1 的数字个数。  



思路：数位DP。  


虽然二进制有800多位，代表数字有 `2^800` 多个。  
但是进行第一轮约简后，二进制的值就会缩减为 `log(n)=800`。  
第二轮约简后，二进制会缩减为`log(800)=8`  
第三轮约简后，二进制会缩减为`log(8)=3`  
第四轮第五轮，全部都会变成 1 个。  



对于第二轮到第五轮，可以直接暴力模拟，复杂度为`log(n) + log(log(n)) + ...`，约等于`log(n)=800`  
故关键是第一轮，如何把 800 位二进制进行第一轮约简。  


假设要约简的二进制是完整的`[0,2^n)`  
最高位分为 0 和 1 两种情况。  


假设最高位为0，则答案与数字 `[0, 2^(n-1))`一致。  
假设最高位为1，则答案是数字 `[0,2^(n-1))` 偏移一位。  
偏移一位的含义是如果 `[0,2^(n-1))` 有 `x` 个 1, 则最高位为1时有`x+1`个1。  


状态定义： `f(n,i)`  
含义： n 位二进制在`[0, 2^(n-1))` 内，有 i 个 1 的数字个数。  


状态转移方程：  


```
f(n,i) = f(n-1,i) + f(n-1, i-1)  
```


方程解释：最高位取0，则与`n-1`一致；最高位取`1`，则与`i-1`一致。  


上面的方程只能解决完整区间各个1的统计。  


对于非完整区间的部分，则需要特殊处理。  


假设对于数字 `11011`，分为 `[0,10000)` 和 `[10000, 11011)`。  
`[0,10000)` 可以按上面的状态方程计算出来。  
`[10000, 11011)` 可以可以转化为区间`[0,1011)`的个数偏移1位。  


可以发现，这个过程也是递归的，递归即可求出答案。  


## 五、最后  


这次比赛最后三题都比较有难度。  


第二题需要找到关键点：多段独立的递增区间。  
第三题是经典的计数DP。  
第四题是经典的数位DP。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

