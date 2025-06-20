---   
layout:     post  
title: leetcode 第 269 场算法比赛  
description: 这次的题非常简单，但是我差点翻车，排名比较靠后了。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-11-28 21:30:00  
published: true  
---  


## 零、背景  


这次比赛后，发现我的笔误还是挺多的， 后面要细心了。  


## 一、找出数组排序后的目标下标  


题意：给一个数组，求数组排序后，值等于目标数字的下标列表。  


思路：按照题意排序，循环寻找即可。  


优化：由于已经排序了，所以答案肯定是一个连续的数字。  
可以先二分求出左右边界，然后构造出答案即可。  


## 二、半径为 k 的子数组平均值  


题意：给一个数组，求每个下标在 k 半径范围内数字的平均数。  


思路：按照题意求出范围内的和，求出平均数即可。  


方法1：预处理出前缀和。  
然后对于每个下标计算出左右边界，然后计算出平均值即可。  
空间复杂度：`O(n)`  


方法2：双指针维护左右边界，动态计算和。  
空间复杂度：`O(1)`  


## 三、从数组中移除最大值和最小值  


题意：给一个值互不相同的数组，找到最大值和最小值后，要求从两边来删除最大值和最小值。  
问最少可以删除多少个数字。  


思路：先求出两个最值的下标，假设是 l 和 r，总长度为 n。  
总共有三种删除方法： 

1、都从左边删除，则答案是 `r+1`。  
2、都从右边删除，则答案是 `n - l`  
3、分别从两边删除，则答案是`l+1 + n-r`  


答案则是三种方法的最小值。  


## 四、找出知晓秘密的所有专家  


题意：可以理解为病毒传染的很厉害。  
起初零号感染者把病毒传染给了某个感染者，之后的每天人们会聚会。  
如果一个人与某个感染者聚会了，则这个人会被传染。  
同时，新被传染的人也会把病毒传染给当天参加聚会的所有其他人。  
若干天后，问那些人会被传染病毒。  


思路：首先预处理数据，每天的聚会数据分为一组。  
然后数据按天数从前到后处理。  


对于同一天的数据，可以理解为，一个连通图中只要有一个人被感染，所有人就会被感染。  


所以可以先把当天的聚会情况构造出一个图，然后枚举判断这天参加聚会的人是否被感染。  
被感染了，整个连通图的人都标记为感染。  


为了避免重复计算，一个人被标记为感染后，就说明这个图已经遍历过了，后面就并不需要重复遍历了。  
当然，更通用的方法是一个图遍历后，删除对应的边，这样后面就肯定不会重复遍历了。  


这道题我敲错了一个地方，定位了半个小时，最后重新CR了整个代码，发现错误，才赶在比赛结束前昨晚所有题。  


## 五、最后  


这次比赛的题都很简单，我甚至怀疑最后一题暴力做都可以过。   


平常的难度一般过两百人就不错了，这次比赛过了六七百人，


题目太简单了就没啥意思了。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

