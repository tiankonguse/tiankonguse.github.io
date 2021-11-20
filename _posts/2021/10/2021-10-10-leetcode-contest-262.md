---   
layout:     post  
title: leetcode 第 262 场算法比赛  
description: 这次比赛各种不顺，第一题做了十几分钟，最后一分钟四道题才AK掉。     
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛各种不顺，第一题做了十几分钟，最后一分钟四道题才AK掉。  


## 一、至少在两个数组中出现的值  


题意：给你三个整数数组 nums1、nums2 和 nums3 ，请你构造并返回一个 不同 数组，且由 至少 在 两个 数组中出现的所有值组成。  


思路：题目我反复读了十几遍，硬是没看懂。  


然后切换到英文，发现了几个关键词：  


```
return a distinct array containing all the values that are present in at least two out of the three arrays  
```


`a distinct array` 代表没有重复值的数组。  
`the values that are present in two arrays` 代表寻找的值至少在两个数组。  
`containing all` 代表返回所有满足要求的值。  


看到这次，我才明白这道题的含义。  


题意理解了，算法就简单了。  
三个数组转化为集合，遍历所有元素，判断是否是答案即可。  
答案都放在集合里来去重。  



## 二、获取单值网格的最小操作数  


题意：给一个矩阵以及一个操作数 X，问矩阵的所有元素通过加减 x 若干次，是否可以使得矩阵所有值都相等。  
如果可以，返回最小的操作次数。  


思路：值的数据范围是`[1, 10^4]`，比赛的时候，我的方法是枚举最终的值，求最优答案。  


假设最终的值都是 target，预处理出小于 target 的元素个数以及元素和，就可以计算出小于target 的需要加多少次。  
对于大于 target 的元素，计算方法一模一样。  


复杂度：`O(n)`  


赛后看下前几名的代码，发现是直接贪心做这道题的。  
即 target 肯定是中位数，所以直接计算中位数的答案即可。  


后来想了想，也很容易证明。  


假设目前 target 为 val ，左边有 a 个元素（含val），右边有 b 个元素, 答案为 ans。  
要计算 target 为  `val + x` 的答案，则 a 个元素需要加上 x，b 个元素需要减去 x，答案就是 `ans + a - b`。  


如果 val 在中位数左边，则 `a < b`，向右移动答案会更优。  
如果 val 在中位数右边，则 `a > b`，向左移动答案会更优。  
由此可以证明，中位数的时候答案是最优的。  



## 三、股票价格波动  


题意：给一个数据流代表每个时间的股票价格。  
由于某个时间的股票价格可能有误，后续的数据流会进行修正。  
然后有三个询问：最新日期的股票价格、历史上最高的股票价格、历史上最低的股票价格。  


思路：两个 map 解决。  


map1 储存每个时间的股票价格， map2 储存每个价格出现的次数。  


最新日期的过价格，可以取 map1 的最后一个值。  
历史最高价与历史最低价取 map2 的两端的值。  


更新的时候，先更新 map2 的价格次数，为0 时从 map2 中删除对应的价格。  


这道题可以算是这次比赛四道题中最简单的一道题，比第一题还简单。  



## 四、将数组分成两个数组并最小化数组和的差  


题意：给一个偶数长度的数组，问如何平均拆分两个数组后，才能使得两个数组和相差最小。  


思路：典型的背包问题，但是数据范围是`[-10^7, 10^7]` 没法使用背包处理。  
不过一看数组大小，拆分后长度只有 15，典型的暴力枚举题。  


但是计算下复杂度，`C(30, 15) = 10^8` , 对于 ACM 肯定会超时，但是 Leetcode 比赛不好说，之前遇到无数次不会超时。  


于是我直接几层循环暴力枚举了一发，果然超时了。  


超时了就需要优化。  


本来想看能不能剪枝的，结果也没想到什么剪枝的策略。  
于是只好使用终极优化策略：双向搜索。  



左半部暴力枚举所有组合 `2^15` 中情况，右半边暴力枚举所有组合`2^15`。  
最后枚举左半部的所有组合值，在右半边二分查找是否存在答案。  


复杂度：`O(2^15 log(2^15))`  


二分查找原理：假设左半部选择了 i 个元素，其中一个组合值是 a。  
则右半部需要在 `n-i`个元素的组合里面，寻找一个值 b，使得  `a+b` 与 `sum - a - b` 差值最小。  


公式一番转化，可以得到 `b = sum/2 - a`。  
所以我们二分查找最近的 `sum/2 - a` 即可。  


由于是寻找最近的，为了防止误差，二分查找找到一个值后，可以向左和向分别多判断一个值即可消除误差。  


## 五、最后  


这次比赛的题目虽然不难，我做的却惊心动魄。  


比赛前我先修正了电脑的时间，比赛剩余之后一分钟，我最后一题还没编译通过，一想来不及了，就直接提交了，结果最后一分钟 AK 了。  


具体可以看我的 B 站视频，下午三点上传到 B 站，点击原文也可以到达。  


B站地址： https://space.bilibili.com/30571241  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
