---
layout: post  
title: leetcode 周赛 507  
description: TOP N 算法  
keywords: 算法,leetcode,算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-06-21 12:13:00  
published: true  
---


## 零、背景

这次比赛不难，不过由于没睡好，头晕晕的，思路总是断掉，做完四道题时排名比较靠后了。  


本场题型概览如下。  
A 题：贪心。  
B 题：枚举。  
C 题：最短路。  
D 题：二分+枚举。


## 一、移动后的最大曼哈顿距离


题意：起初你在坐标原点，告诉你一个上下左右移动的操作顺序数组，某些位置的操作可以任意移动，问最终最大的曼哈顿距离。  


思路：贪心  


可以发现，任意打乱操作顺序，不影响答案。  
故可以先忽略任意操作的位置，把确定的移动先移动了，从而得到一个最大曼哈顿距离。  


假设有 K 个任意操作，则在当前最大曼哈顿距离上再加 K 即可。  



## 二、求和后首尾数字相同的有效子数组 I


题意：给你一个数组，问有多少子数组之和的首尾数字都是字符 x。  


思路：枚举  


双层循环计算所有子数组和，判断首尾数字即可。  



## 三、最多 K 个连续相同字符的最短路径


题意：给你一个有向带权图，每个点有一个标签，求起点到终点的最短路，且路径中不能有连续 k 个相同标签。  


思路：Dijkstra  


正常的 Dijkstra 是一维的。  
这里增加了标签的统计，使用二维 Dijkstra 即可。  


```cpp
// {cost, s, lableCount}
typedef tuple<ll, int, int> tll;  
priority_queue<tll, vector<tll>, greater<tll>> pque;
vector<vector<ll>> dist(n, vector<ll>(k + 1, INF));

while (!pque.empty()) {
  auto [uCost, u, uCount] = pque.top();
  pque.pop();
  if (dist[u][uCount] < uCost) continue;
  for (auto& [v, vCost] : g[u]) {
    Add(u, uCost, uCount, v, vCost);
  }
}
```


PS：一开始没想好，想成三维的了，考虑到内存可能爆掉，做了各种优化与剪枝，浪费不少时间。  


## 四、最大总价值


题意：有 n 个数字，挑选某个数字后，值就会减少一定的数值。  
最多选择 m 个数字，问选择数字的最大和是多少。  



思路：二分+枚举  


每个数字减少的数值是确定性的，所以是一个递减数列。  
m 比较大，不能一个个选择，必须批量选择。  



二分出最小的数字，使得大于这个数字的都选择，且满足不大于 m。  


```cpp
ll left = 0, right = maxVal + 1;  // [left, right)
while (left < right) {
  ll mid = (left + right) / 2;
  ll cnt = 0;
  for (auto& [val, dec] : nums) {
    cnt += CalCnt(val, dec, mid);
  }
  if (cnt <= m) {
    right = mid;
  } else {
    left = mid + 1;
  }
}
```


最后可能会还剩若干个，二分无法选择。  
可以确定，这个不会大于 n，优先队列一个个贪心枚举模拟即可。  


## 五、最后  


这次比赛比较简单，第三题我想错了浪费了比较多的时间。  





《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
