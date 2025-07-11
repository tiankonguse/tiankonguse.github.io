---
layout: post  
title: leetcode 第 387 场算法比赛 
description:  四道题都比较简单，不过没参加比赛。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-03-03 18:13:00  
published: true  
---


## 零、背景  


今天比赛比较简单，不过我今天开始去练科目三了，所以没有参加比赛。  


A: 构造题，按题意拆分数组，最后合并数组。    
B: 枚举题，求出所有左上角的子矩阵和，统计个数。    
C: 枚举题，统计两个区域每个值出现的次数，枚举两个区域的值，求最小值。    
D: 构造题，通过树状数组/线段树/平衡树等数据结构统计大于某个值的个数，之后和第一题一样。  


比赛代码：https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、将元素分配到两个数组中 I  


题意：给一个数组，默认将前两个元素分别分配给两个数组，之后的元素按规则分配到两个数组中。  


规则：如果数组1最后一个元素大于数组2的最后一个元素，则将当前元素加入到数组1，否则加入到数组2。  


思路：定义两个数组，按题意模拟构造两个数组即可。  


优化：可以指定定义一个答案数组，数组1从前到后插入，数组2从后到前插入，最后反转数组2即可。  


## 二、元素和小于等于 k 的子矩阵的数目  


题意：给一个矩阵，问左上角的所有子矩阵中，矩阵和不大于 k 的元素个数。  


思路：预处理出所有矩阵和，统计答案即可。  


公式：`g[i][j]=g[i-1][j]+g[i][j-1]-g[i-1][j-1]`  


优化：可以在原数组上进行，从而避免申请额外的内存。  


## 三、在矩阵上写出字母 Y 所需的最少操作次数


题意：给一个矩阵，按规则将矩阵分为两个区域，问将两个区域内的数值相等，不同区域数值不等的最小操作数。  


思路：统计两个区域所有值出现的次数，枚举两个区域的所有值组合，求出最优答案。  


小技巧：假设区域1的个数为 sum1，值1的个数为 v1，则修改为值1的操作数为 `sum1-v1`。  


## 四、将元素分配到两个数组中 II  


题意：与第一题类似，不过加入两个数组的规则变复杂了。  


规则：统计数组中大于当前元素的个数。  


思路：根据题意可以得知需要这样一个数据结构：可以动态插入元素，然后动态询问大于某个值的元素个数。  


对于这个数据结构，是经典的带计数的平衡树。  


不过我们可以通过数值离散化，把`10^9`范围内的数值转化为`10^5`范围内的下标，然后通过线段树或者树状数组来代替平衡树。  


小提示：这种离散化，有一个专业名称叫做 `FenwickTree`。  



## 五、最后  


这次比赛比较简单，你都会做了吗？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

