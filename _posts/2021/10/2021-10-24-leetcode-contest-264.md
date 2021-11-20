---   
layout:     post  
title: leetcode 第 264 场算法比赛  
description: 全程翻车，需要调整一下了。     
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


昨晚突然想起很多人在看《进击的巨人》，便找到片源尝试看了下，发现还不错，便看到很晚很晚。  


早上起来后头昏沉沉的，比赛四道题全程都在翻车了。  



## 一、句子中的有效单词数  


题意：给一个句子，问有多少个有效单词。  


有效单词条件：  
-）仅有小写字母、连接符、标点组成。  
-）最多只能有一个连接符，左右必须都是小写字母。  
-）最多只能有一个标点符号，且在单词最后。  



思路：模拟题，拆分出单词，判断是否有效即可。  



## 二、下一个更大的数值平衡数  


题意：如果整数  x 满足：对于每个数位 d ，这个数位 恰好 在 x 中出现 d 次。那么整数 x 就是一个 数值平衡数 。    
现在给一个整数，求大于这个整数的最小数值平衡数。  


思路：本来想可以直接构造答案的，后来发现枚举更简单。  


我不是从小到大枚举数字，而是枚举所有合法的位数，比如枚举 1 个 1，2 个 2，3 个 3 等。  
枚举的时候，相同数字按连续处理了，样例没过，我就提交了。  


提交后报错，错误样例就是题目给的样例。  
顿悟不能这样枚举，直接从小到大枚举数字即可。  


原先使用 map 统计判断是否合法，竟然超时了。  
改成数组就过了。  


## 三、统计最高分的节点数目  


题意：给一个有根树，每个节点的分数为删除改节点剩余子树大小的乘积。  
求最高得分节点的个数。  


思路：预处理出每个节点左右子树的个数，就可以计算出父子树的大小，相乘即可求出当前节点的分数。  


注意实现：乘积可能 32位整数越界，需要使用 64位整数。  


## 四、并行课程 III  

题意：给一个有向无环图，每个节点有一个时间代价。  
一个节点的前驱都处理之后才能处理当前节点，问所有节点都处理完需要多长时间。  


思路：每个节点维护一个前驱的个数与所有前驱都处理完的最大时间。  


再使用队列储存可运行节点。  
当某个节点的前驱都处理完了，节点加入队列。  
所有节点都处理完时，循环求最大处理时间即可。  


小技巧1：加一个起始超源，队列只需要加入一个起始超源即可。  
小技巧2：加一个结束超源，答案就是结束超源的开始时间。  


## 五、最后  


这次比赛都不满，不过我翻车了。  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
