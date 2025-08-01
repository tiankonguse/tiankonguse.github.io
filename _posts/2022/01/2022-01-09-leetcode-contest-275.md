---   
layout:     post  
title: leetcode 第 275 场算法比赛  
description: 睡眠不好，果然做题思路不清晰。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2022-01-09 12:12:00  
published: true  
---  


## 零、背景  

这次比赛题目不难，但是我这两天每晚睡得比较晚，脑袋比较晕，导致思路不清晰。  


第一题我就做了好久。  


以后还是要保证睡眠，不仅为了比赛，还为了健康。  


所以，我准备在 2022 年制定一个睡眠计划。  
等我执行一段时间看下效果，再决定是否公布计划的细节吧。  

## 一、检查是否每一行每一列都包含全部整数  


题意：检查 `n*n` 的矩阵，每行每列是否都是数字 1 到 n。  


思路：按照题意，把每行每列的数字存到数组里，排序，判断即可。  


优化1：由于每个数字只能出现一次，可以使用 hash 来标记是否出现过。  


PS：我看错题了，看错每行的数字为 1 到 n，把每列漏掉了。  


## 二、最少交换次数来组合所有的 1 II  


题意：给一个循环 01 数组，可以任意交换两个位置的值。  
现在可以任意选择一个起始位置，把所有的 1 都交换到这个起始位置之后。  
问选择哪个位置，交换次数最少。  


思路：1 的个数固定，假设为 K，则连续 1 的区间和也是固定的，为 K。  
枚举起始位置，查询长度为 K 的区间和，不够 K 的就是需要交换的。  


## 三、统计追加字母可以获得的单词数  


题意：给两个字符串数组，问目标数组的字符串，是否可以由原始数组的某个字符串转换得到。  
对于一个原始字符串，转换规则如下：  
1、追加一个不在原始字符串的字母  
2、对原始字符串任意排序。
求目标字符串数组中，可以转换得到的答案个数。  


思路：  


看数据范围，很大。  
看字符串特征，字符不存在重复，那显然是位压缩了。  


由于转换规则是追加一个不存在的字符串，枚举追加字符，复杂度 `O(26)`。  
预处理原始字符串，转化为 bit位数字，查找复杂度`O(1)`。  


所以，可以预处理原始字符串，转化为 bit 数字，储存在 hash 中。  
然后对于目标字符串，枚举字符串中的字符，当做追加的字符，构造出追加前的 bit 数组，然后去 hash 中查找即可。  


综合复杂度：`O(26 * n)`  


PS：这道题我也看错题了，看错可以不追加字符串，浪费了大量时间。  


## 四、全部开花的最早一天  


题意：有 n 个种子，需要先种下种子，然后等若干天等待开花结果。  
同一时间只能播种一个种子。  
现在告诉你每个种子的播种天数与开花天数，问哪天所有种子可以开花。  


思路：由于等待开花的时间允许重合，那肯定是等待时间最长的种子播种越早。  


所以按照等待时间排序即可。  


PS：由于脑子比较晕，思路一直在中断，画图时有几次甚至把等待也当做不能重叠了。  


## 五、最后  


这次比赛题目还好，不过我算是翻车了。  


本来可以半个小时做完的，不在状态，做了一个小时多。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

