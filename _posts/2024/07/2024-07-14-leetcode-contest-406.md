---
layout: post  
title: leetcode 第 406 场算法比赛 
description:  找规律，拼手速的时候到了。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-07-14 18:13:00  
published: true  
---


## 零、背景  


这次比赛是找规律，大部分人都是 30分钟后内做完的吧。  


A: 贪心。   
B: 循环。   
C: 贪心。  
D: 贪心。   


排名：290   
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/406  


## 一、交换后字典序最小的字符串 


题意：给一个数字字符串，问交换哪一对相邻数字，可以使得字典序最小。  


思路：从前到后找到第一个可以交换的，交换后肯定最是最优答案。  


可交换条件：奇偶性相同且前面的更大。  


## 二、从链表中移除在数组中存在的节点  


题意：给一个链表，删除值在集合里的节点。  


思路：生成集合，循环判断与删除即可。  


## 三、切蛋糕的最小总开销 I  


题意：给一个矩阵，每次选择一个子矩阵，可以再选择一行或者一列进行切换，切割后矩阵会变成两个子矩阵。  
告诉你每行和每列的切割代价，问怎么切割总的切割代价最小。  


思路：找规律与贪心。  


使用`(2,2)`、`(2,3)`、`(3,2)`矩阵模拟一下，可以证明，每次选择代价行与列中代价最大的那一个答案是最优的。  


所以可以贪心，选切割最大的，再切割次大的。  
直接递归模拟，可以发现每次矩阵个数增加1个，切割到 `n*m` 个小矩阵复杂度是 `O(n*m)`。  
所以，需要想办法合并切割方案。  


这里继续观察子矩阵，看有什么规律。  
假设最大的是行，次大的是列。  


此时可以发现，最大的行把矩阵切割为两个子矩阵。  
次大的列需要分别切割两个子矩阵，代价都是相同的。  
由此，可以总结出之前行切割了多少次，当前这个列就需要切割多少次。  


所以，需要维护之前行和列的切割次数。  
这样，切割每一行和每一列时，只需要切割一次，就可以把所有子矩阵都切割了。   
复杂度：`O(n+m)`  



总结步骤如下：  


1）行与列的代价排序。  
2）维护行与列的切割次数。  
3）从大到小访问待切割的行与列，计算当前切割总代价。  


## 四、切蛋糕的最小总开销 II  


同第三题。  


## 五、最后  


这次比赛前两题签到题，第三题和第四题一样，找到规律，贪心即可。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

