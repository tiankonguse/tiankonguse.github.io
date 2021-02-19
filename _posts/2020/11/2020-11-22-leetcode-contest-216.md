---   
layout:     post  
title: leetcode 第 216 场算法比赛  
description: 贪心题写出来容易，证明比较难。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛最后一题看很多人都过了，不知道是做过还是怎么回事。  
我感觉挺难想的，需要逻辑推理一番。  



## 一、检查两个字符串数组是否相等。


题意：给两个字符串数组，问字符串数组按顺序连接后的字符串是否相等。  


思路：连接对比即可。  


如果使用函数功能比较强大的 python 写的话，一行代码即可。  


大概是`a.join("") == b.join(",")`  


源代码：  
https://github.com/tiankonguse/leetcode-solutions/blob/master/problemset-new/056/05605-check-if-two-string-arrays-are-equivalent/check-if-two-string-arrays-are-equivalent.cc  


## 二、具有给定数值的最小字符串。


题意：每个小写字母有一个权重，字符串的权重为各字符的权重指和。  
求给一个权重后字典序最小的字符串。  


思路：  


方法一：暴力枚举，即先假设所有位置是`a`,从后到前判断能否设置为值`z`，最后一个不足`z`是谁就设置为谁。  


方法二：使用数学公式计算出前面几个`a`,后面几个`z`。  


![](http://res2020.tiankonguse.com/images/2020/11/22/001.png)  



源代码：  
https://github.com/tiankonguse/leetcode-solutions/blob/master/problemset-new/056/05606-smallest-string-with-a-given-numeric-value/smallest-string-with-a-given-numeric-value.cc  


## 三、生成平衡数组的方案数  


题意：给一个数组，问删除一个元素后，剩余的元素奇数位置元素之和等于偶数位置元素之和的方案数。  


思路：  


方法一、枚举删除每个位置的元素，然后计算是否满足。  
复杂度：`O(n^2)`  


方法二、预处理计算每个位置的前缀奇数位置和、前缀偶数位置和、后缀奇数位置和、后缀偶数位置和。  
然后枚举删除每个位置，通过前后缀快速判断是否满足。  
复杂度：`O(n)`  


源代码：  
https://github.com/tiankonguse/leetcode-solutions/blob/master/problemset-new/056/05607-ways-to-make-a-fair-array/ways-to-make-a-fair-array.cc  


## 四、完成所有任务的最少初始能量  


题意：给一个任务集合，执行每个任务会消耗 x 能量，执行任务的前提时拥有 y 能量。  
问起始至少拥有多少能量，才能完成任务。  


思路：数据范围是`10^5`，无法动态规划来做。  
即使想其他的数据结构，也无法证明起正确性。  


所以需要先假设按照一定的顺序完成任务，然后只看相邻的两个任务，什么时候交换位置会更优。  


一顿分析猛如虎，可以发现相邻的两个任务确实有一个关系。  


![](http://res2020.tiankonguse.com/images/2020/11/22/002.png)  



假设交换后，一个比另外一个更优后，可以得到一个不等式，即差值小的在前面处理会更优。  


![](http://res2020.tiankonguse.com/images/2020/11/22/003.png)  


故，先对集合按差值排序，然后扫描一遍相加即可。  


具体的讲解后面有一个链接，感兴趣的可以去看看。  
这里我们来看看这种贪心的几何意义是什么。  


如果前提能量小于消耗能量，我们可以把前提能量修正为消耗能量。  
这样任务就分两类：第一类是前提能量等于消耗能量的，第二类是前提能量大于消耗能量的。  


显然，应该先处理第二类任务，最后再处理第一类任务。  
因为第二类任务有剩余，可以让第一类任务消耗掉。  


那对于第二类任务之间，差值越大代表消耗能量后剩余的越多，放在最前面则有更大的机会被后面差值小的利用上。  


所以差值排序的几何意义就是，差值大的放在最前面，避免差值造成额外的浪费。
那看到的代码为啥时差值小的在前面呢？  
因为消耗能量减去前提能量都是负数，标准的写法应该是反过来，大的在前面。  



源代码：  
https://github.com/tiankonguse/leetcode-solutions/blob/master/problemset-new/056/05608-minimum-initial-energy-to-finish-tasks/minimum-initial-energy-to-finish-tasks.cc  


具体讲解可以参考：  
https://leetcode-cn.com/problems/minimum-initial-energy-to-finish-tasks/solution/wan-cheng-suo-you-ren-wu-de-zui-shao-chu-shi-neng-/  


## 五、最后  


这次比赛最后一题不容易想，我是没做出来。  
当时想的是使用二分查找加线段树来做，后来发现还是涉及顺序问题，线段树不能保证正确性。  


不知道其他人为啥这么容易就想到了，好像过了快一千人了。  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

