---
layout: post
title: leetcode 周赛 485 - 最小字典序
description: 带条件的单调栈  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2026-01-18 12:13:00
published: true
---


## 零、背景


这次比赛最后一题有点难，要求字符串的最小字典序，需要使用带条件的单调栈。    


 A 题：统计（题意简单，略）  
 B 题：线段树 / 二分单调栈 / 动态规划等多种解法  
 C 题：map 统计  
 D 题：贪心算法   


**最终排名**：148名  
**代码仓库**：详见 <https://github.com/tiankonguse/leetcode-solutions>  


## 一、元音辅音得分  


题意：给定一个字符串，问元音个数除以辅音个数的值。  


思路：统计元音和辅音的个数，然后计算它们的比值即可。  


## 二、预算下的最大总容量


题意：每个物品有一个成本和价值，给定一个最大预算 `C`，问在不超过预算且最多选择两个物品的情况下的最大价值。  


思路：有多种解法。  


解法一：线段树  


由于最多可以选择两个物品，可以先枚举一个物品，然后计算另一个满足条件的物品的最大价值。  
假设枚举的物品成本为 `c0`，价值为 `v0`，则需要找到成本不超过 `C-c0` 的最大价值。  
即在线段树中求区间 `[1, C-c0-1]` 的最大值。  


为了避免选择两个相同的物品，可以在枚举物品后再将其加入线段树，这样可以保证选择的是两个不同的物品。  



解法二：二分单调栈  


先把所有物品按成本排序，这样可以得到一个有序的成本序列。  


另外，显然如果一个物品成本很小且价值很大，则成本较大但价值较小的物品就不需要考虑。  
所以可以维护一个递增的单调栈来筛选物品。  


与线段树一样，为了避免重复，只需要在已经枚举的成本里选择第二个物品的最大值。  
由于枚举的第一个物品的成本是升序的，则另一个物品的最大成本是降序的，即成本大于最大成本 `C-c0-1` 的物品都不需要考虑。  


所以，我们需要在单调栈中找到成本不大于 `C-c0-1` 的最大值，可以用二分查找实现。  


解法三：动态规划  


状态定义：`preMax[i]` 表示成本不大于 i 的最大价值。  


同样是先枚举一个物品，然后直接在 `preMax` 中查找另一个物品的最大值。  


如何更新 `preMax` 呢？  
显然，假如一个物品成本是 `c0`，价值是 `v0`，则状态转移方程为：  


```cpp
preMax[c0] = max(preMax[c0], max(preMax[c0-1], v0));
```


而由于成本不是连续的，所以我们需要维护一个游标，用于填补空缺的成本。  


```cpp
int nowMaxCost = 0;
while (nowMaxCost < cost) {
  preMax[nowMaxCost + 1] = preMax[nowMaxCost];
  nowMaxCost++;
}
```


不考虑排序的复杂度：`O(n + V)`（其中 n 为物品数量，V 为最大预算）  
考虑排序的复杂度：`O(n log n)`  


## 三、设计拍卖系统

题意：每个人可以对某个物品进行多次报价，也可以取消报价，问在某个时刻某个物品报价最高的用户是谁。  
如果有多个用户报价最高，返回用户编号最大的一个。  


思路：正反查 map 索引  


维护一个物品到用户到价格的索引，再维护一个物品到价格到用户集合的索引。  


```cpp
// item -> cost -> userSet
unordered_map<int, map<int, set<int>>> itemMaxCost;
// item -> user -> cost
unordered_map<int, unordered_map<int, int>> itemUserCost;
```

删除时，先查询价格，然后删除两个索引，同时将空的索引也清除。  

```cpp
void removeBid(int userId, int itemId) {  //
  auto& maxCost = itemMaxCost[itemId];
  auto& userCost = itemUserCost[itemId];
  if (userCost.count(userId) == 0) {
    return;
  }
  int cost = userCost[userId];
  maxCost[cost].erase(userId);
  if (maxCost[cost].empty()) {
    maxCost.erase(cost);
  }
  userCost.erase(userId);
}
```

更新时，先删除原有报价再插入新报价即可。  
查询时，利用索引的有序性，直接返回最大值即可。  

```cpp
int getHighestBidder(int itemId) {
  if (itemMaxCost[itemId].empty()) {
    return -1;
  }
  return *itemMaxCost[itemId].rbegin()->second.rbegin();
}
```

## 四、删除重复字符后的字典序最小字符串


题意：给定一个字符串，对于重复字符，可以执行任意多次删除操作，问删除后字典序最小的字符串。  


思路：贪心  


由于要求字典序最小，所以只需要关注相邻两个字符的关系。  


假设前缀 `s[0...i-1]` 已经得到最优答案，保存在 ans 中。  


对于 `s[i]` 字符，如果小于 `ans.back()`，则删除 `ans.back()`，然后插入 `s[i]` 可以得到更小的字典序。  


但有一种特殊情况：如果 `ans.back()` 是该字符最后一次出现，则无法删除。  
所以需要统计每个字符出现的次数，如果只剩下一次，则不能删除，否则可以删除。  


另外这个过程是递归的，所以需要不断判断，直到条件不再满足为止。  


```cpp
string ans;
for (auto c : s) {
  while (ans.size() > 0 && ans.back() > c && counts[ans.back() - 'a'] > 1) {
    counts[ans.back() - 'a']--;
    ans.pop_back();
  }
  ans.push_back(c);
}
```


最终计算出答案后，发现后缀可能有重复字符，这时只需要保留一个即可。  



## 五、最后


这次比赛最后一题一开始方向想错了，最后 5 分钟才想到只需要对比相邻字符，但时间不够，比赛后 3 分钟才通过，有点遗憾。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
