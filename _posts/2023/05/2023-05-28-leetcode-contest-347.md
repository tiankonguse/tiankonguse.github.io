---   
layout:  post  
title: leetcode 第 347 场算法比赛  
description: 这次比赛有点意思。          
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2023-05-28 18:13:00  
published: true  
---  


## 零、背景  


这次比赛最后一题提交错误了一次，是自己思考不全面。  


## 一、移除字符串中的尾随零  


题意：给一个正整数，问去除后缀0后答案是多少。  


思路：不断删除最后一个 0 即可。  


提示：正整数，不存在特殊判断，即是否都删完。  


## 二、对角线上不同值的数量差  


题意：给一个矩阵，求一个矩阵，矩阵的每个单元格的值是左上对角线不同值个数与右下对角线不同值个数的绝对值查。  


思路：按题意模拟即可。  


提示：数据范围不大，建议不要预处理，直接枚举求每个单元格的答案。  


## 三、使所有字符相等的最小成本  


题意：给一个二进制字符串，可以反转前缀或者后缀，问最终使得字符串所有值都相等的最小代价和。  
反转代价为反转字符串的长度。  


思路：贪心题。  


首先可以证明，对于相邻想要的字符，肯定是同时被反转的，即是兄弟就同生共死。  
这样，字符串就可以理解为 01 间隔的固定字符串。  


其次可以证明，对于反转的前缀和后缀不可能有交集，即字符串一分为二，一部分是反转前缀，一部分是反转后缀。  
对于 01 间隔字符串，反转的代价是有规律的。  


以反转前缀为例，假设长度是 n，每次找到最后一个非目标字符，反转前缀即可。  
由于字符串是 01 间隔的，所以最后一个非目标字符的位置就是倒数第二个字符。  


假设字符串最后一个字符不是目标字符，则需要反转 n 次，反转长度依次递减。  
假设字符串最后一个字符是目标字符，则需要反转 `n-1`次，反转场地依次递减。  


反转一次的代价是前缀和 `sum[n]`。  
反转 n 次的代价就是前缀和的前缀和 `sum[1]+sum[2]+...+sum[n]`。  


最后，枚举前缀和后缀的分界线，枚举目标答案，根据上面的规律计算出答案，求最小值。  


## 四、矩阵中严格递增的单元格数  


题意：给一个矩阵，如果一个单元格的值严格大于另一个单元格，则这两个单元格之间存在一条路径。  
问矩阵中的最长路径是多少。  


思路：图论题。  



思路1：拓扑排序。  


同一行与同一列相邻数字之间建一条边，共 `n*m`个顶点，`2nm` 条边。  
之后根据拓扑图求最优答案即可。   


思路2：分层DP。  


根据数字的值，进行分层，并维护每层中每行和每列当前的最优答案。  


对于相同数字，可以根据上一层的最优答案，计算出当前层的最优答案。  


默认情况下，不同值很多时，不管是空间还是时间，都会超时。  


空间优化：由于至于上一层的答案有关，可以使用双 BUF 来节省空间。  


时间优化：考虑到层与层之间只有部分状态的值得到更新，可以记录下有变化的位置。  
这样层与层切换双 BUF 时，只需要修改有变更的值。  


综合复杂度：`O(n*m)`  


## 五、最后  


这次比赛，后面两题其实有点难度的。  


大家都是怎么做的？  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
