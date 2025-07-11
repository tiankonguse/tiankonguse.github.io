---
layout: post  
title: leetcode 第 390 场算法比赛 
description:  第一题浪费不少时间。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-03-24 18:13:00  
published: true  
---


## 零、背景  


今天比赛四道题都比较简单。  
第一题浪费不少时间，导致做完四道题排名是 179 名，。  


A: 暴力或双指针。    
B: 贪心枚举。  
C: 有序平衡树数据结构题。  
D: 字典树模板题。  


比赛排名：179。  
比赛代码：https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、每个字符最多出现两次的最长子字符串  


题意：给一个字符串，问子串里相同字符个数不超过2个的最长子串。  


方案1：枚举所有子串，统计判断是否符合要求。  
复杂度：`O(n^2)`  


方法2：枚举所有起始位置，找到第一个不满足要求的子串。  
最坏情况，每个字符恰好出现两次。    
复杂度：`O(52 n)`  


方法3：双指针。  
复杂度：`O(n)`  



比赛的时候我敲的双指针，浪费不少时间，直接使用方法1，敲代码的效率是最高的。  


## 二、执行操作使数据元素之和大于等于 K  


题意：原先数组只有一个值为 1 的元素，有两个操作，求最少操作使得数组和不小于 K。  


操作1：数组中选择一个元素，值加1。  
操作2：数组中选择一个元素，追增到数组尾部。  


思路：可以证明，如果一个答案有操作1和操作2，优先全部进行操作1是最优的。  


至于进行多少个操作1再进行操作2，尝试推动计算公式找规律时，发现存在反例。  


故只能枚举操作1的次数，计算出操作2，保留最优答案即可。  



假设操作1 进行 a 次，则数组中只有1个元素，值为 `a+1`。  
操作 2 至少需要进行 `k/(a+1)`次，数组和才会不小于 k。  
答案为 `a + k/(a+1)`。  


复杂度：`O(n)`  


## 三、最高频率的 ID  


题意：构造一个数据结构后，动态增加 k 个相同元素或者减去 k 个相同元素，问数据结构中元素的最高频率是多少。  


思路：使用一个 hash 统计元素的频率，使用有序平衡树统计频率的次数（频率的频率）即可。  


增加：得到元素旧的频率，从有序平衡树和hash中删除，新的频率再分别插入进去。  
减少：与增加等价，删除旧的频率，添加新的频率。  


复杂度：`O(n log(m))`  



## 四、最长公共后缀查询  


题意：给一个输入字符串数组和询问字符串，求最长公共后缀的字符串，如果有多少，输出长度最短的，依旧多个，输出下标最小的。  


思路：字符串反转，则是求最长公共前缀，典型的字典树。  


插入：字典树种储存下字符串的长度和下标，路径上保存题意的最优值。  
查询：找到公共前缀，返回路径的最优值。  


复杂度：`O(sum(array))`  


## 五、最后  


这次比赛比较简单，需要拼手速了，所以排名比较靠后了。  


后面做比赛，还是要先评估复杂度，选择可以通过的代码最简单的算法才是最优解。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

