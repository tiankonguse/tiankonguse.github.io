---
layout: post  
title: leetcode 周赛 504  
description: 分块  
keywords: 算法,leetcode,算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-05-31 12:13:00  
published: true  
---


## 零、背景

这次比赛难度比较大，做完还差10分钟。  


本场题型概览如下。  
A 题：统计。  
B 题：01背包与完全背包。  
C 题：贪心。  
D 题：贪心Mex。  


## 一、计算数字频率得分

题意：给一个数字，每个数字字符的得分是值乘以频次，求总得分。  


思路：统计  


统计每个字符出现的频率，最后循环计算字符得分，求和。  


## 二、购买最多物品数目 I


题意：给n个物品，每个物品有一个价格和重量，给总的金钱，问最多可以买多少物品。  
规则：  
1）如果购买了物品i，当所有满足物品j的重量是物品i的整数倍时，则免费送物品j。  
2）重复购买物品i，不会重复送免费物品。  
3）赠送的物品j，可以通过多次购买不同的物品来触发赠送。  


思路：背包  


先确定题意，购买物品i时，第一次可以触发赠送，买1送N，之后无法触发赠送，买1得1。  
所以，问题分两类：第一类是物品只有一个，第二类是物品有无数个。  
显然是 01背包和完全背包。  


首先如何计算买1送N呢？  
数据量不大，直接双层计算即可。  
复杂度 `O(n^2)`。  


而对于背包，可以发现动态转移方程的关键特征是只与背包大小有关，与物品无关。  
区别是，01背包是逆序循环，完全背包是正序循环。  
所以可以合在一起。  


```cpp
vector<int> dp(budget + 1, 0);
for (int i = 0; i < n; i++) {
  int cost = items[i][1];
  for (int b = budget; b >= cost; --b) {
    dp[b] = max(dp[b], dp[b - cost] + gain[i]);
  }
  for (int b = cost; b <= budget; ++b) {
    dp[b] = max(dp[b], dp[b - cost] + 1);
  }
}
return *max_element(dp.begin(), dp.end());
```


PS：由于不同物品赠送的个数不一样，必须进行01背包贪心，否则可能得到错误的答案。  
而对于完全背包，收益都是1，故可以贪心直接选择最便宜的物品。  


```cpp
vector<int> dp(budget + 1, 0);
int ans = 0;
int minCost = INT_MAX;
for (int i = 0; i < n; i++) {
  int cost = items[i][1];
  minCost = min(minCost, cost);
  for (int b = budget; b >= cost; --b) {
    dp[b] = max(dp[b], dp[b - cost] + gain[i]);
  }
}
for (int b = 0; b <= budget; b++) {
  ans = max(ans, dp[b] + (budget - b) / minCost);
}
return ans;
```


PS：代码写完提交到第三题了，样例始终无法通过，调试了半天，浪费不少时间。  


## 三、购买最多物品数目 II


题意：与第二题类似，赠送规则发生变化。  
规则：  
1）如果购买了物品i，当所有满足物品j的重量是物品i的整数倍时，则免费送物品j。  
2）每买一次物品i，只能赠送一个物品。  
3）多次购买物品i，赠送的物品需要不同。  
4）赠送的物品j，可以通过多次购买不同的物品来触发赠送。  


思路：贪心  


先确定题意。  
假设一个物品最多可以赠送 P 个物品，则前 P 个物品买一赠一，之后的物品买一得一。  


怎么计算出一个物品最高可以被送几次呢？  
可以因数分解，计算出每个重量的所有因子，统计每个数字是多少个数字的因子。  
由此，便可以计算出赠送物品 P 的个数。  
复杂度：`O(n sqrt(n))`  


```cpp
unordered_map<ll, ll> factorCount;
void InitFactors(ll item) {
  for (ll i = 1; i * i <= item; i++) {
    if (item % i == 0) {
      ll j = item / i;
      factorCount[i]++;
      if (i != j) {
        factorCount[j]++;
      }
    }
  }
}

for (auto& item : items) {
  InitFactors(item[0]);
}
```


之后来看这个问题的特征。  
有些物品买一赠一，有些买一得一，很容易想到按单价排序来贪心。  


而对于买一得一，显然是买最便宜的，所以只需要存一个即可。  
另外，买一得一可以无限购买无数次，所以遇到买一得一，就不需要继续循环了，直接得到答案。  


```cpp
ll ans = 0;
for (auto [price, count] : nums) {
  if (count > 0) { //买一赠一
    if (price > budget) {
      // 为了避免小数，price 是买两件物品的价格，后面可能还有更便宜的买一得一
      continue; 
    }
    ll cnt = min(count, budget / price);
    ans += cnt * 2;
    budget -= cnt * price;
  } else { // 买一得一
    price = price / 2;
    ans += budget / price;
    break; // 剪枝
  }
}
return ans;
```


PS：一开始读错题了，以为每个物品只能买一赠一一次，写完贪心发现样例无法通过，调试半天，浪费不少时间。  


## 四、字典序最大的 MEX 数组

题意：给一个数组，每次可以删除一个数组的前缀，得分为数组的 Mex。  
不断这样操作，直到数组为空，从而得到一个得分列表。  
问如何操作，才能使得得分列表的字典序最大。  


思路：贪心  


字典序最大，显然需要挑选的 Mex 尽可能的大。  
而前缀越长，Mex 越大。  
故，删除的前缀需要满足 Mex 等于数组的 Mex 且数组前缀长度尽可能的小。  


如何求中间某个状态下整个数组的 Mex？  
观察这些数组，都是原始数组的某个后缀。  
故可以预处理，得到所有后缀的 Mex，从而可以直接查询中间状态下整个数组的Mex。  


有了当前状态下的目标 Mex，如何找到最小前缀呢？  
直接滑动窗口扫描即可。  
每个元素最多入队一次，出队一次，复杂度`O(n)`。  


```cpp
int R = 0;
while (R < n) {
  int maxMex = suffix_mex[R];
  ans.push_back(maxMex);
  if (maxMex == 0) {
    R++;
    continue;
  }
  int mex = 0;
  int L = R;
  while (R < n && mex < maxMex) {
    flag[nums[R]] = true;
    R++;
    while (flag[mex]) {
      mex++;
    }
  }
  for (int i = L; i < R; ++i) {
    flag[nums[i]] = false;
  }
}
```


## 五、最后  


这次比赛稍微有点难度。  
第二题考察01背包和完全背包。  
第三题考察性价比贪心，需要处理买一送一这种特殊情况。  
第四题考察滑动窗口，很容易以为复杂度很高，其实是线性的。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
