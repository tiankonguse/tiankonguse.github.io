---
layout: post  
title: leetcode 周赛 508 -排名68  
description: Kadane Algorithm 与 最短路  
keywords: 算法,leetcode,算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-06-28 12:13:00  
published: true  
---


## 零、背景

这次比赛后两题都是基础题，一道是 Kadane Algorithm，一道是二维最短路。  


本场题型概览如下。  
A 题：贪心。  
B 题：区间合并与删除。  
C 题：Kadane Algorithm。  
D 题：二维最短路。  


## 一、K 个元素的最大总和


题意：给一个数组，选择 k 个元素，乘以 mul 或者不乘，求这 k 个元素的最大和。  
规则：mul 每乘一次，值就减一。  


思路：贪心  


不乘的时候，可以定义为乘以 1。  
此时规则就修改为 mul 值为 1 时就不再降低。  


选择 k 个数字，乘以 mul 的递减序列。  
显然，优先数字应该从大到小选择。  


## 二、筛选忙碌区间


题意：给一些待合并区间，以及一个特殊区间。  
问待合并区间合并后，再删除特殊区间后的区间列表。  


思路：区间合并  


第一步，对待合并区间排序，然后进行合并。  


```cpp
sort(occupiedIntervals.begin(), occupiedIntervals.end());
vector<pair<int, int>> res;
res.reserve(occupiedIntervals.size());
int t = occupiedIntervals.front()[0];
res.push_back({t, t});  // 保证 res 不为空
for (auto& interval : occupiedIntervals) {
  int start = interval[0];
  int end = interval[1];
  auto& last = res.back();
  if (start <= last.second + 1) {
    last.second = max(last.second, end);
  } else {
    res.emplace_back(start, end);
  }
}
```

第二步：删除特殊区间


两个区间共有六种情况，逐个判断比较复杂，还容易遗漏。  
故可以分为两个步骤。  
1）根据特殊区间的两个顶点，对区间进行拆分。  
2）判断待删除区间是否被特殊区间包含。  


```cpp
vector<vector<int>> ans;
ans.reserve(res.size());
for (auto [start, end] : res) {
  if (start < freeStart && freeStart <= end) {
    ans.push_back({start, freeStart - 1}); // 前半段
    start = freeStart;
  }
  if (start <= freeEnd && freeEnd < end) {
    ans.push_back({freeEnd + 1, end}); // 后半段
    end = freeEnd;
  }
  if (start >= freeStart && end <= freeEnd) {
    continue;
  }
  ans.push_back({start, end});
}
return ans;
```

## 三、乘以系数后最大子数组和


题意：给一个数组，选择一个区间乘以k或者除以k，问之后整个数组可以选择的最大子数组和。  


思路：Kadane Algorithm  


Kadane Algorithm 算法可以使用 `O(n)` 的时间求最大子数组和。  
对于带修改的情况，只需要增加几个状态即可。  


由于乘除操作只有一次，故可以分别进行判断。  
根据操作，可以将区间分为三类：操作前区间、操作区间、操作后区间。  


故状态也可以分为三类：操作前、操作中、操作后。  
状态定义：`dp(i, s)` 前缀中选择第 i 个元素，状态为 s 的最大子数组和。  


状态转移方程：  


```cpp
opV = Op(v)
dp(i, Pre) = max(0, dp(i-1, Pre)) + v;
dp(i, Mid) = max({0, dp(i-1, Pre), dp(i-1, Mid)}) + opV;
dp(i, Suf) = max(dp(i-1, Mid), dp(i-1, Suf)) + v;
```


空间复杂度：`O(1)`  
时间复杂度：`O(n)`  


## 四、有限电量到达目标节点的最少时间


题意：给一个带时间+能量的二维权值有向图，求能从 S 到达 T 的最小时间，以及剩余的最大能量。  
数据范围：点 1000，能量 1000。  


思路：二维最短路  


与上次比赛的二维最短路一模一样，跑一次 Dijkstra 即可。  


PS：一开始我还想二分最小时间求答案，结果写完 Dijkstra 发现直接把答案求出来了。  


```cpp
vector<vector<ll>> dist(n, vector<ll>(maxPower + 1, INFL));
priority_queue<tll, vector<tll>, greater<tll>> pque;
dist[u][maxPower] = 0;
pque.push({0, u, maxPower});

ll retTime = INFL;
ll retPower = -1;
// 判断是否是答案，以及是否需要加入队列
auto Add = [&](int u, ll uTime, ll uPower, int v, ll vTime) {};

while (!pque.empty()) {
  auto [uTime, u, uPower] = pque.top();
  pque.pop();
  if (dist[u][uPower] < uTime) continue;
  for (auto& [v, vTime] : g[u]) {
    Add(u, uTime, uPower, v, vTime);
  }
}
if (retTime == INFL) {
  return {-1, -1};
}
return {retTime, retPower};
```


## 五、最后


这次比赛第二题区间合并很容易写错，第三题稍微有点难，不容易想到这个状态。  
而第四题，则信息量比较大比较复杂，看清楚是二维 Dijkstra 后，就是模板题了。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
