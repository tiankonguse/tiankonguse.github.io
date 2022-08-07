---   
layout:  post  
title: leetcode 第 300 场算法比赛 排名81/6549  
description: 家里的windows笔记本速度太慢，准备下周把mac笔记本带回来。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2022-07-03 18:13:00  
published: true  
---  


## 零、背景  


这次比赛的时候，发现家里的 windows 电脑很慢。  


突然意识到，最近几次比赛成绩比较好都是在 mac 笔记本上做的。  


所以，下周比赛我准备把笔记本带回来。  


## 一、解密消息  


题意：给一个密钥和待解密的字符串，求解密后的字符串。  


思路： 密钥是简单的字符映射，先计算出密钥映射，然后循环解密即可。  



## 二、螺旋矩阵 IV  


题意：给一个链表和矩阵，求链表按顺时针螺旋填充矩阵。  



思路：维护上下左右四个边界，每轮转一圈，直到最后即可。  


## 三、知道秘密的人数  


题意：第一天有 1 个人发现秘密。  
发现秘密的第 delay 天，这个人会把秘密告诉其他不知道秘密的人。  
发现秘密的第 forget 天，这个人会忘记秘密，变成不知道秘密的人。  
问第 n 天，有多少人还记得秘密。  


思路：  


方法一：暴力计算。  
由于数据量不大，每次循环删除忘记秘密的人，计算出有多少人会传播秘密即可。  


复杂度：`O(n^2)`  



方法2：维护两个队列。  
一个是发现秘密但是还不能传播秘密的队列，称为 delay 队列。  
一个是发现秘密可以传播秘密的队列，称为 forget 队列。  
队列的元素储存两个值：日期和这个日期发现秘密的人数。  


新的一天，有三步需要处理。  
第一步：从 forget 队列中尝试删除忘记秘密的人。  
第二步：判断 delay 队列中是否有人可以传播秘密，有了delay删除，加入到 forget 队列，。  
第三步：forget 队列剩余的总人数都会传播给新的人，这个人数和日期放入 delay 队列。  


最后，第 n 天的时候，答案就是两个队列的总人数。  


复杂度：`O(n)`  


## 四、网格图中递增路径的数目  


题意：给一个矩阵，求所有不同的严格递增路径。  


思路：最简单的动态规划题。  


循环一次求出每个位置为起点的不同路径数，求和就是答案。  


对于一个固定起点的路径，自身算一条，再加上 上下左右可到达坐标位置的路径数之和。  



## 五、 最后  


这次比赛第三题还算有点意思，不过数据范围太小了，两层循环暴力就可以水过去了。  


如果第三题数据范围提升到 `10^5`，把暴力方法卡主，我极有可能进去前 50 名吧。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
