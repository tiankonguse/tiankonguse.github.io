---   
layout:  post  
title: leetcode 第 348 场算法比赛  
description: 数位DB，有点代码量。          
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2023-06-04 18:13:00  
published: true  
---  


## 零、背景  


这次比赛最后一题是很经典的数位DP，有点代码量，没能进入前一百名。  


## 一、最小化字符串长度  


题意：如果有相同的字母，可以删除一个，问最后剩余几个字母？  


思路：相同的删除一个，最后都不相同，集合统计即可。  


## 二、半有序排列  


题意：问通过交换相邻数字，最少多少次可以使得最小值在第一个且最大值在最后一个。  


思路：贪心即可，先找最小值把最小值交换到第一个位置，再找最大值交换到最后位置。  


## 三、查询后矩阵的和  


题意：给一个`n*n`的矩阵，有入若干操作，每次可以对一行或者一列的所有位置设置为相同值，问最后整个矩阵的和。  


分析：n 的数据范围是`10^4`，基本思路在 ACM 上必然超时，Leetcode 上不知道。  


基本思路：一行或一列设置为相同的值，我们可以直接计算这行或者这列的和，没必要一个个加。  
公式：假设有 n 行，某一列设置为 V，则累计的和为 `n * V`。  


问题：相同位置可能被某行或者某列设置多次。  


解决方案：逆序处理。  


1）相同行或者列只计算最后一次。hash 数据结构标记是否计算过。  
2）某一行计算之后，之前的列计算时，需要少计算一行。分别使用两个变量记录需要少计算的行和列。  


复杂度：`O(n)`  


## 四、统计整数数目  


题意：给两个大整数数字，问区间内，数字的各位值之和在指定范围的个数有多少。  


思路：典型的数位 DP。  


先对大整数数字标准化，长度对齐，不够的补0.  


然后从前到后处理，对于每一位，枚举所有数字。  


对于枚举值，分为四个阶段。  


第一阶段，前缀相等，取值固定，前缀和固定。  
第二阶段，区间分三部分，上区间、中间、下区间。  
对于上区间和下区间，会进入第三阶段；中间的枚举之后，进入第四阶段。  
第三阶段：分为两部分，相等的上区间或者下区间，会进去自身阶段，其他的枚举之后，进入第四阶段。  
第四阶段：之后随意取值，没有任意限制。  


以数字 `12543` 和 `12921` 两个大整数来举例。  


第 0 位，相等，只能取值 1，前缀和为 1。  
第 1 位，相等，只能取值 2，前缀和为 3。 
第 2 位，上区间是 5，下区间是 9，可以分为三种情况处理。  
情况1：取值 5，前缀和为 8，进入第三阶段。  
情况2：取值分别为 `6~8`，前缀和计算后，进去第四阶段。  
情况3：取值 9，前缀和为 12，进去第三阶段。  


第三位：  
对于情况1，处于第三阶段，可以确定前缀是和上区间前缀对齐的，所以取值分为两种情况。  
情况1.1：取值4，前缀和为 12，第三阶段递归。  
情况1.2：取值分别为 `5~9`，前缀和计算后，进去第四阶段。   


对于情况3，处于第三阶段，可以确定前缀是和下区间前缀对齐的，所以取值也分两种情况。  
情况3.1：取值 2，前缀和得到 14，第三阶段递归。  
情况3.2：取值 `0~1`，前缀和计算后，进去第四阶段。   


对于情况2，处于第四阶段，例如 6，前缀和之前是 9，第三位开始可以随意取值。  
大整数总共有 5 位，当前是第三位，故剩余 2 位可以随意取值，共有 `10^2` 个值。  
此时问题转化为了 2 位数字随意填充，数字和在指定区间内的有多少个。  
这个可以用另外一个动态规划来做，属于简单的动态规划，这里不做介绍了。  


就这样，递归的计算完所有数位即可。  


数位DP复杂度：`O(n)`  
简单的动态规划复杂度：`O(n*Low*High)`  
综合复杂度：`O(n^2*Low*High)`


注：简单的动态规划方程`f(n,Low,High)` n 位数字随意取值，数字和在区间`[Low, High]`的个数。  


## 五、最后  


这次比赛第三题需要一个逆序处理的方法，第四题则是数位DP经典算法，你做出来了吗？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

