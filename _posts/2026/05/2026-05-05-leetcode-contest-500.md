---
layout: post
title: leetcode 周赛 500
description: 二维最长递增子序列
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2026-05-05 12:13:00
published: true
---


## 零、背景

这次比赛时间在 5 月 3 号，我还在五一休假，故没参加比赛。  
5 号有时间了，补做了一下比赛。  


本场题型概览如下。  
A 题：统计。  
B 题：素数。  
C 题：前缀和。  
D 题：二维 LIS。  


## 一、统计下标的相反奇偶性得分

题意：给一个数组，统计每个下标对应的值与后缀中值的奇偶性不同的个数。  


思路：统计。  


从后到前统计奇偶值的个数，即可得到每个下标的答案。  


## 二、区间内的质数和

题意：给一个数字 a，反转得到数字 b，问 `[a, b]` 之间素数的个数。  


思路：筛素数。  


方法1：数据范围不大，逐个判断是否是素数即可。  
方法2：前缀和预处理每个数字前缀素数的个数，两个前缀和求差即可。  


## 三、在下标间移动的最小代价

题意：给一个严格递增的数组，有两类移动操作。  
操作1：从下标 x 跳到下标 y，代价为 `abs(nums[x] - nums[y])`。  
操作2：从下标 x 移动到最近的相邻位置，代价为 1。  
有 q 个询问，问从下标 x 移动到 y 的最小代价。  


最近相邻位置定义：左右最近的位置，如果距离相等，则下标小的为最近的位置。  


思路：前缀和。  


分析：由于数组严格递增，从下标 x 直接跳到下标 y，等价于沿这个方向逐个跳过去。  
因此，如果某一跳刚好是最近的相邻位置，则可以贪心地使用操作2 来降低代价。  


暴力模拟复杂度为 `O(q * (y - x))`。  


优化：预处理第一个位置到任意一个位置的累计代价，通过前缀和求差，即可求出任意两个位置之间的代价。  


注意事项：两个方向的代价不一样，前缀和与后缀和需要分别计算。  


## 四、删除元素后最大固定点数目

题意：给一个数组，删除若干元素，问最多可以使多少个下标与值恰好相等。  


思路：二维最长递增子序列。  


删除元素后，后面的元素会左移，所以只有 `nums[i] <= i` 时，`nums[i]` 才可能通过左移与位置匹配。  
另外，`nums[i]` 要到达下标 `nums[i]`，左边需要恰好删除 `i - nums[i]` 个元素。  


假设预处理所有满足条件的数字对 `(v, i-v)`，如何才能保证两个数字的值都与位置匹配呢？  


假设有两个数字 `v1` 和 `v2`，左移的偏移距离分别是 `d1` 和 `d2`。  


![截图](https://res2026.tiankonguse.com/images/2026/05/05/001.png)


如上图，显然 d1 需要小于等于 d2，d1 个数字在 v1 之前删除，`d2-d1` 个数字在 `v1` 到 `v2` 之间删除。  
故只要满足 `d1 <= d2` 且 `v1 < v2`，就可以保证两个数字的值都与位置匹配。  


由此，这道题转化为一个二维最长递增子序列问题：对于 d 需要满足非递减，对于 v 需要满足严格递增。  


回顾一维 LIS 的 `n log(n)` 算法，利用的是 DP + 二分思想。  
dp 状态 `tail[i]` 定义为长度为 `i+1` 的递增子序列中，结尾元素的最小值。  


这样做的原因是：结尾越小，后面越容易接上更多数字。  


对于一个新的数字 v，我们需要找到小于 v 的最大答案。  
在 `tail` 中，值小于 `v` 的都是合法答案，最后一个就是最长的答案，故 v 可以放在其下一个位置。  


```cpp
auto it = upper_bound(dp.begin(), dp.end(), x);
if (it == dp.end()) {
  dp.push_back(x);
} else {
  *it = x;
}
```


对于二维，比较抽象，有两种做法。  


做法1：第一维非递减，第二维严格递增，使用 `lower_bound`。  
由于第二维要求严格递增，不能有等于，所以使用 `lower_bound`。  


```cpp
// 要求：第一维非递减，第二维递增
// 排序：默认，需要使用 lower_bound
int Lis2(vector<pair<int, int>>& pts) {
  sort(pts.begin(), pts.end());

  vector<int> tails;
  for (auto& [x, d] : pts) {
    auto it = lower_bound(tails.begin(), tails.end(), d);
    if (it == tails.end()) {
      tails.push_back(d);
    } else {
      *it = d;
    }
  }
  return tails.size();
}
```


做法2：第一维严格递增，第二维非递减，使用 `upper_bound`。  
由于第二维允许重复，所以使用 `upper_bound`。  


```cpp
// 要求：第一维递增，第二维非递减
// 排序：第一维升序，第二维降序，使用 upper_bound
int Lis2(vector<pair<int, int>>& pts) {
  // x 升序；x 相同则 d 降序
  sort(pts.begin(), pts.end(), [](const auto& a, const auto& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second > b.second;
  });

  // 在 d 上求最长非递减子序列
  vector<int> tails;
  for (auto& [x, d] : pts) {
    auto it = upper_bound(tails.begin(), tails.end(), d);
    if (it == tails.end()) {
      tails.push_back(d);
    } else {
      *it = d;
    }
  }

  return tails.size();
}
```


不管哪种做法，二维 LIS 都比一维 LIS 更抽象一些。  


## 五、最后

这次比赛最后一题是二维 LIS，属于比较抽象的模板题。  
如果比赛时遇到这类问题，我会选择使用线段树或者树状数组来求区间最大值，从而降低理解难度。  






《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
