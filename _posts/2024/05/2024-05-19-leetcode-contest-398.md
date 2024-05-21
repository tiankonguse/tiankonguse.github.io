---
layout: post  
title: leetcode 第 397 场算法比赛 
description:  考驾照去练车了，所以没参加比赛。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData:  2024-05-19 18:13:00  
published: true  
---


## 零、背景  


这次比赛最后一题有点难度，画出状态图后，就可以写出记忆化递归搜索了。  


A: 签到题。   
B: 二分查找。   
C: 按为统计，公式计算。  
D: 记忆化搜索。  


排名：无  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/3/398


## 一、特殊数组 I  


题意：给一个数组，问是否是特殊数组。  
特殊数组：所有相邻位奇偶性不同。  


思路：循环判断相邻位奇偶性是否相同即可。  


## 二、特殊数组 II  


题意：给一个数组，问指定子数组是否是特殊数组。  
特殊数组：所有相邻位奇偶性不同。  


思路：预处理，按下标顺序储存下所有相邻位相同的下标。  


对于一个子数组询问，如果区间内存在相邻位相同，则不是特殊数组。  


实现1：有序集合，例如 SET 或者 map。  
实现2：数组。  


## 三、所有数对中数位不同之和  


题意：给若干等长数位的数字，问所有数字对的不同数位个数之和。  
不同数位个数：两个数字相同位数值不同的个数。  


思路：显然，不同位数没有关系。  


对于相同位数，只有 0 到 9 共 10 个数字，统计各个数字的出现次数。  


计算答案的方式有两种。  


方式1：直接计算。  
假设数字共 n 个，值为 0 的数字有 m 个，则值不为 0 的数字为  `n-m`个，与 0 不同的数字对有 `m * (n-m)` 个。  
由于是枚举所有数字，所有数字对重复计算一次，答案除 2 即可。  


方式2：求差法。  
假设值为 0 的数字有 m 个，则只为 0 数位相同的数字对有 `C(m,2)`个。  
所有数字对减去每个数字数位相同的个数，就是数位不同的个数。  


## 四、到达第 K 级台阶的方案数

题意：起始位置在台阶1，有两个操作，问有多少种操作，最终位置在台阶 K。  
操作1：倒退一个台阶，但是不能连续倒退，台阶0 也不能倒退。  
操作2：前进 `2^jump` 台阶， jump 值加一。  


思路：模拟画出状态图，可以发现对于每个台阶和 jump，分为两个操作状态：倒退状态、前进状态。  


令状态 1 为可进可退，状态 0 为只能前进，则可以画出下面的状态图。  


![](https://res2024.tiankonguse.com/images/2024/05/19/001.png)



可以发现，对于 `(k,jump,0)` 的状态，肯定来自 `(k+1,jump,1)` 的倒退，即操作1。  
而对于`(k,jump,1)`的状态，肯定来自 `(k-2^(jump-1), jump-1, ?)`状态，其中操作状态为谁都正确。  


我们跟进发现的两个结论写出递归记忆化搜索即可。  
搜索的出口是台阶为负，或者初始状态。  


而对于答案，最终位置在台阶K，对应的 状态有很多，枚举所有 jummp 和操作状态，求和。  



代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/3/398


## 五、最后  


这次比赛最后一题起始有一定的难度，需要先正向推出状态关系，再逆向写记忆化搜索。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
