---
layout: post  
title: leetcode 第 386 场算法比赛 
description:  最后一题比赛期间没做出来。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-02-25 18:13:00  
published: true  
---


## 零、背景  


今天比赛最后一题有点难，只有23个人做出来，赛后我使用暴力算法竟然一下通过了。  


A: 统计题，统计值的个数。  
B: 模拟题，矩阵求交。  
C: 二分，直接构造数组，判断是否合法。  
D: 二分，贪心构造数据，判断是否合法。  


## 一、分割数组  


题意：给一个数组，问是否可以拆分为两个等长的子数组，子数组值互补相同。  


思路：统计值的个数，不大于 2 即可构造。  


统计方法1：hash 表  
统计方法2：排序，判断是否存在相邻三个元素是否相等。  


## 二、求交集区域内的最大正方形面积  


题意：给若干矩阵，任意两个矩阵的重叠区域可以找到一个正方形，求最大正方向。  


思路：枚举所有矩阵组合，判断是否重叠，重叠了，求正方形。  



是否重叠：判断横坐标以及纵坐标是否存在一根垂直线是否在另外一个矩阵中间。  


```
if (B0 >= T1 || B1 >= T0) continue;  // 上下没有交集
if (L0 >= R1 || L1 >= R0) continue;  // 左右没有交集
```


重叠区域：上下左右四个边界分别求最小值。  


```
ll T2 = min(T0, T1);
ll L2 = max(L0, L1);
ll B2 = max(B0, B1);
ll R2 = min(R0, R1);
```

正方形：重叠区域的最短边。  


```
ll r = min(T2 - B2, R2 - L2);
```


## 三、标记所有下标的最早秒数 I  

思路：给两个数组，第二个数组是操作命令，问最短多少秒可以将数组1所有下标标记。  


操作1：第一个数组随机选一个下标，减一。  
操作2：数组1固定下标的值为0时，标记此下标完成。  
操作3：无操作  


思路：显然需要二分，判断指定操作内是否可以完成。  


简单分析可以得到下面几个信息。  


数组1的所有下标都需要标记。  
每个下标只能通过操作2进行标记。  
对于一个下标，如果在操作命令里出现多次，标记的越晚越好，即可以在最后一次进行标记。  


由于要求标记的时候值为0，前面需要选择对应若干个操作1进行减一。  


前面的操作，用于减哪个值无所谓，只要最终所有值都可以减为 0 即可，但必须是前面的操作减后面的下标，后面的无法减前面的。  


故可以从后到前循环，遇到最后一个下标，进行标记，并累计记录需要在前面减多少次。  
如果遇到重复的下标，则对累计值进行减一，但不能是负数。  


最后，如果所有下标都进行标记，且累计值都被减完，则存在答案。  


## 四、标记所有下标的最早秒数 II  

思路：给两个数组，第二个数组是操作命令，问最短多少秒可以将数组1所有下标标记。  


操作1：第一个数组随机选一个下标，减一。  
操作2：数组1固定下标设置为任意非负数值。  
操作3：第一个数组随机选一个下标，进行标记。  
操作3：无操作  


思路：显然需要二分，判断指定操作内是否可以完成。  


但是进行判断的方法与第三题完全不同了。  


操作2可以设置为任意值，显然最优解是直接设置为0。  


故答案显然是选择若干操作2对下标设置为0，其他的操作全部用来减一或者标记完成。  


选择哪些下标2进行操作呢？  
显然是选择值大的，且越大越好。  


第一种贪心为从大到小尝试进行操作2，并判断操作后，是否可以满足后面的可以把前面的操作2都标记。  


从大到小需要排序，复杂度 `O(m log(m))`  
每一个选择会影响历史的选择的合法情况，所以需要判断整个历史选择是否可以合法，最简单的是遍历整个数组，判断当前的所有选择是否有冲突，复杂度`O(m^2)`
综合复杂度：`O(m^2 log(n))`  



看其他人的代码，还有人按第一次出现的下标，从后到前进行贪心选择。  
由于是从后到前选择的，前面的选择不会影响后面的选择的答案，故判断的复杂度为`O(1)`  
综合复杂度：`O(m log^2(n))`  


PS：我没有证明按下标进行贪心的正确性，目测有badcase，一个小的靠后的下标选择后，前面的较大的下标就无法选择了。  



## 五、最后  


这次比赛最后一题较难。  


目前我想到的可以通过的方法复杂度较高。  
简单看了几个人的代码，贪心是通过比赛了，但是可以证明有 badcase。  
后面有时间了，再研究下其他人的代码，看是否有更优的解法。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

