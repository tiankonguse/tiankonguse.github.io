---
layout: post
title: 历年 CSP-S 第二轮算法题型分析与总结
description: 二分、拓扑排序、哈希、线段树、模拟、动态规划、最短路、LCA、博弈            
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-10-03 20:13:00
published: true
---



## 零、背景


CSP-J/S 是从 2019 年开始举办的。  


上篇文章已经记录了《[近 6 年 CSP-J 算法题型分析](https://mp.weixin.qq.com/s/MkE5yfMLioAxGtiFKz1-cg)》 .  
这篇文章打算统计一下 CSP-S 的算法题型。  


2019 年第一年，CSP-S 参考的 NOI 赛制，第二轮算法比赛分两天，每天三道题，共六道题，数据模型差异较大，参考意义不大。  
2020 年开始，赛制与 CSP-J 完全一致，比赛只有 1 天，涉及四道题。  


所以，我先做了 2020 年以来所有 CSP-S 第二轮编程算法题，并输出了题解。  


今天也打算统计一下 2020 年到 2024 年近 5 年 CSP-S 编程算法的难度和题型，从而总结出常见的题型。  



代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/other/CSP-S/  


## 一、题解  


历年题解及题目整理在下表，点击第一列可查看具体比赛的题解。    



| 比赛题目分类与题解 |
| --- |
| [CSP-S 2024 题解](https://mp.weixin.qq.com/s/MVvztSH8LW13eP5lc7cHjg) <br> A:决斗 普及−           <br> B: 超速检测 普及+/提高 <br> C: 染色 提高+/省选−        <br> D: 擂台游戏 NOI/NOI+/CTSC |
| [CSP-S 2023 题解](https://mp.weixin.qq.com/s/BEsjZsgI-RhVGbWyeVgHUw) <br> A:密码锁 普及−         <br> B: 消消乐 提高+/省选−  <br> C: 结构体 提高+/省选−       <br> D: 种树 提高+/省选− |
| [CSP-S 2022 题解](https://mp.weixin.qq.com/s/2_6rHQGCn6DUijg9Bevnyw) <br> A:假期计划 提高+/省选−  <br> B: 策略游戏 普及+/提高  <br> C: 星战 省选/NOI−         <br> D: 数据传输 省选/NOI−	 |
| [CSP-S 2021 题解](https://mp.weixin.qq.com/s/QSQL6h3nASiXCnZ4Vzerug) <br> A:廊桥分配 普及+/提高	  <br> B: 括号序列 提高+/省选− <br> C: 回文 普及+/提高         <br> D: 交通规划 省选/NOI−	 |
| [CSP-S 2020 题解](https://mp.weixin.qq.com/s/lGtxCI5XBUd-swxgU-Bc9g) <br> A:儒略日 普及+/提高	    <br> B: 动物园 普及/提高−   <br> C: 函数调用 提高+/省选−     <br> D: 贪吃蛇 NOI/NOI+/CTSC	 |



## 二、难度  


CSP-J/S 的难度依次是入门、普及−、普及/提高−、普及+/提高、提高+/省选−、省选/NOI−、NOI/NOI+/CTSC。  


对于 CSP-S，每年有四道题，难度一般分布在 普及、提高、省选、NOI 这四个初级难度。  


如下图所示，是历年来四道题的难度分布。  


![](https://res2025.tiankonguse.com/images/2025/10/03/001.png)  



CSP-S 的题目等级覆盖了6个等级，所以覆盖等级较大。  
不过把 普及− 与 普及/提高− 当做一个等级，是最简单的入门签到题。  
把 省选/NOI− 与 NOI/NOI+/CTSC 当做一个等级，是用来拉开差距的题目。  
这样合并后就是四道题四个等级。  


前两个低等级合起来占比 15%。  
普及+/提高 占比 25%。  
提高+/省选− 是核心等级，占比35%。  
后两个等级合起来占比 25%。   


![](https://res2025.tiankonguse.com/images/2025/10/03/002.png)  



## 三、题型  


看 CSP- 历年来的题型，涉及二分、线段树、贪心、模拟、动态规划、最短路、拓扑排序、博弈等题型。  



![](https://res2025.tiankonguse.com/images/2025/10/03/003.png)  



这里把二进制、枚举、快慢指针都归属基础题，所以基础题占比 80%。  
题型概率大于 50% 的有：基础 80%，二分 80%，贪心 60%，动态规划 80%。  
题型概率大于 30% 的还有 拓扑排序 40%， 线段树 40%，模拟 40%，哈希 40%，最短路 40%。  



![](https://res2025.tiankonguse.com/images/2025/10/03/004.png)  



## 四、最后  



针对历年的难度和题型，我的结论与 CSP-J 的结论一致，二分、线段树、模拟、动态规划是必须要掌握的。  
此外，还需要掌握哈希、拓扑排序、最短路等。  


另外再来看下题型分布，可以看到，CSP-S 的题比较综合，每道题都会涉及多个算法，所以这些常见算法的权重都比较高。  



![](https://res2025.tiankonguse.com/images/2025/10/03/003.png)  



所以这里就对选手的要求比较高了。  
不仅仅要学会上面各个题型算法，还需要能够根据题目与已知的算法，设计出一套复合的数据结构与算法，来达到目标。  


面对这种情况，我们需要明白一件事：一道题的得分不是0分与满分，而是针对不同数据范围有不同的得分，我们的目标是尽可能的得高分。  


所以我打算十一之后，先介绍下各个题型的算法，最后再介绍面对不同数据范围时，该如何尽可能的得高分。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
