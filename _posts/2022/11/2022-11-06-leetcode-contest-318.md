---   
layout:  post  
title: leetcode 第 318 场算法比赛  
description: 拉了一个算法群  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2022-11-06 18:13:00  
published: true  
---  


## 零、背景  


年初 3 月 18 号，因为疫情，我在重庆酒店隔离的时候，做了一个决定：打卡 Leetcode 每日一题，看是否可以坚持半年。  


如果可以坚持半年，我就拉一个算法群，群里每天分享 Leetcode 每日一题的题解。  
当然，群里也可以答疑有比赛相关的算法题，如果有人问的话。  


半年很快过去了，事实证明，我做到了（中间有一次工作当天全天忙到24点之后，没来得及做）。  


![](https://res2022.tiankonguse.com/images/2022/11/06/001.png)  


对算法感兴趣的朋友可以扫描下面的群二维码，或者关注公众号，在对话框里回复 "算法群" 获得进群方法。  


![](https://res2022.tiankonguse.com/images/2022/11/06/002.jpg)  




## 一、对数组执行操作  


题意：给一个数组，顺序扫描处理。  
每次可以和向后相邻的元素对比，如果相等，则当前元素值翻倍，后面的元素值设置为0。  
最后，将所有为 0 的元素移动到最后，返回数组。  


思路：遇到相等的元素，后面的元素置为0，则肯定需要移动到最后。  
所以可以扫描数据，记录不为 0 的元素，最后在最后补充 0 即可。  


## 二、长度为 K 子数组中的最大和  


题意：给一个数组，求长度为 k 且值互不相同的最大子数组和。  


思路：双指针。  


右指针依次加入到 map 。  
加入后，如果存在重复值或者队列大于 K，则移除左指针，直到没有重复值。  


之后，如果队列大小为 K，则找到一个答案。  


## 三、雇佣 K 位工人的总代价  


题意：给一个数组，代表工人的工资，然后使用下面的规则选择 k 个工人。  


规则：数组两端分别选择 C 个人，这些人力工资最少且最靠左的那个人会被选中。  



思路：双指针。  


两端的 C 个人分别储存在两个最小堆里即可。  


哪个最小堆被选中了，对应的指针移动一次即可。  


注意事项：同一个人只能进入一个最小堆。  


## 四、最小移动总距离  


题意：给 n 个工厂和 m 个机器人的位置，每个工厂最多容纳若干机器人。  
每个机器人可以移动到某个工厂，问如何分配工厂与机器人的关系，才能使得机器人的移动距离最短。  


思路：典型的动态规划问题。  


可以证明，如果最后一个工厂可以容纳若干机器人，则这些机器人肯定是最后连续的那几个机器人。  
依次递推，最优答案肯定是若干连续的机器人分配给某个工厂，后面的机器人分配给后面的工厂，前面的机器人分配给前面的工厂。  
工厂与机器人的连线不会存在交叉的情况。  



状态定义：`f(i, j)` 前 i 个工厂容纳前 j 个机器人的最短移动距离。  


转移方程：  


```
f(i, j) = min(f(i-1, k-1) + F(i, k, j))
```


方程解释：枚举第 i 个工厂容纳 `[k, j]` 范围的机器人的答案，取最优值。  


状态：`F(i, k, j)` 可以通过前缀和预处理计算得到。  


复杂度：`O(n^3)`  



## 五、最后  



这次比赛最后一题其实有点难度，你是怎么做的呢？  





加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

