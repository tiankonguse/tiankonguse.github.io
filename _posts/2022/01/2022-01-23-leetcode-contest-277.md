---   
layout:     post  
title: leetcode 第 277 场算法比赛  
description: 这次比赛很简单，听说第一名5分钟就AK了。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2022-01-24 00:12:00  
published: true  
---  


## 零、背景  

今天由于国家的春节假期调休要上班，我没有参加比赛。  


晚上做了四道题，发现挺简单的。  



## 一、元素计数  


题意：返回不是最大值也不是最小值的元素个数。  


思路1：map 统计，减去最大值和最小值的个数即可。  
注意实现：所有值都相等时，需要特殊判断。  



思路2：排序求出两个最值，然后循环判断不等于最值的个数。  
当然，也可以循环查找最值，或者使用STL库查找最值。  


PS：两个思路的代码已经上传到 github 了。  



## 二、按符号重排数组  

题意：给一个长度为偶数的数组，元素一半为正一半为负。  
要求重新排列元素，使得正负数交叉出现，但是正数之间的相对顺序不变，负数之间的相对顺序也不变。  


思路：预先申请内存，正数与负数分别使用一个下标标记位置，每遇到一个，偏移量加二即可。  


## 三、找出数组中的所有孤独数字  


题意：给一个数组，如果一个数字只出现一次，且相邻的数字不存在，则算孤独的数字。  
求孤独数字的个数。  


思路1：map 统计，然后遍历数据一次判断即可。  


思路2：数组排序，然后判断左右判断即可。  
小技巧：可以插入一个无穷小和无穷大的元素，则不需要考虑边界。  


PS：两个思路的代码已经上传到 github 了。 



## 四、基于陈述统计最多好人数  


题意：有 n 个人，某些人是好人，某些人是坏人。  
好人永远说真话，坏人可能说真话。  
现在给你一个矩阵，代表每个人对其他人的评价：好人、坏人、不确定。  
问好人最多可能为多少个，使得矩阵中的评价不冲突。  


思路：看数据范围，只有 15，显然是 Bit 位压缩了。  


枚举 Bit ，然后判断枚举的好人说的话是否冲突即可。  


判断方法也很简单，如果一个人是好人，则他的话都是真话。  
判断他的话（不确定的忽略）是否和枚举值冲突即可。  


复杂度：`2^15 * n^2`  


对于一个枚举值，判断是否冲突，通过预处理可以优化到 `O(n)`的复杂度。  


具体是假设一个人是好人，然后计算出这个人对其他人好人与坏人评价的 bit 位，以及不确认的 Bit 位。  
这样就可以通过一个位运算快速判断一个好人的话是否冲突。  


综合复杂度`2^15 * n`  


PS：优化前与优化后的代码已经上传到 github 了。 



## 五、最后


这次比赛题目很简单，不过最后一题还蛮有意思的。  


最后一题你是怎么做的呢？  


github: https://github.com/tiankonguse/leetcode-solutions.git  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
