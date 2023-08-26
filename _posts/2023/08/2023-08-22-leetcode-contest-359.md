---   
layout:  post  
title: leetcode 第 359 场算法比赛  
description: 万能的线段树，可以代替很多算法。          
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2023-08-22 18:13:00  
published: true  
---  


## 零、背景  


这个周末回河南老家接父母，顺便去武汉玩了几天，所以没参加比赛。  


机场候车室等飞机，写一下题解。  


## 一、判别首字母缩略词


题意：给一个字符串数组，问首字符按顺序相连得到的字符串是否与输入串相等。  


思路：先判断长度是否一致，一致了循环判断即可。  


## 二、k-avoiding 数组的最小总和


题意：求构造一个长度为 n 的数组，数组中不存在二元组的和等于 k。求符合要求的最小数组和。  


思路：贪心。  


二元组之和等于 k 的有 `k/2`组。  


```
1, k-1
2, k-2
3, k-3
k/2, k-k/2
```

对于这些二元组，只能选择一个，显然选择最小的那组。  


所以优先选择前面 `k/2` 个元素，如果不够 n 个，再选择 `k-k/2`之后的若干数字，凑够 n 个。  


算法1：循环计算。  
复杂度：`O(n)`  


算法2：数学计算。  
复杂度：`O(1)`  


注意事项：`k`为偶数时，二元组的两个值相等，需特殊判断。  


## 三、销售利润最大化


题意：有 n 个房子，现在有一些人要买一些连续的方案，每个人给出自己的房子区间和总报价，问卖给哪些人收入最高?  


思路：动态规划。  


状态定义：`f(i)` 前i个房子，最后一个报价以 i 结尾的最大收入。  


假设某人报价为 `[l, i]=v`， 则状态转移方程为 `f(i) = max(max(1, i), f(l-1)+v)`。  
状态转移方程含义为，报价区间的前面找到最大报价，加上当前人的报价，就是当前位置的最优报价。  


如何找 `max(1, i)`呢？  


方法1：线段树，区间求最大值。  


方法2：扫描线。  


观察`max(1, i)`，可以发现永远是求前缀最大值。  
当处理到左区间 `l` 时，左区间前面的最优值都不会变化了，所以可以计算出来。  


状态定义：`F(i)` 前i个房子里累计的最大报价。  
状态转移方程：`F(i) = max(F(i), F(i-1))`  


## 四、找出最长等值子数组


题意：给一个数组，求一个子数组，最多删除 k 个元素后，得到的子数组所有值都相等。  
求最多有多少个相等的值。  


思路：显然，不同的值之间没有关系，所以可以按值对数组进行分组，每组储存下标列表。  


分组之后，问题就转化为了求一个下标子数组，使得下标子数组中空缺的下标不超过 k 个。  


这个使用双指针扫描即可。  


## 五、最后  


这次比赛比较简单，第二题和第三题都可以使用两种方法来做。   


你都是怎么做的呢?  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
