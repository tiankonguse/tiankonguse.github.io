---
layout: post  
title: leetcode 周赛 521  
description: 前缀DP  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-09-27 12:13:00  
published: true  
---


## 零、背景


这次比赛中秋回家了，所以没参加比赛。  
晚上抽空做了下题，我怎么感觉第三题比第四题难呢。  


本场题型概览如下。  


A 题：统计排序  
B 题：贪心统计  
C 题：构造前缀最小值  
D 题：前缀DP  


## 一、移除不同值重排数组


题意：给你一个整数数组 nums。  
初始时，你有一个 空 数组 ans。重复执行以下操作，直到 nums 变为 空 ：  


- 找出当前 nums 中 所有不同 的值。  
- 将当前 nums 中每个 不同 的值各移除一个，并按 升序 将这些值依次添加到 ans 中。  


返回数组 ans。  


思路：统计排序。  


所有数据放入有序集合，按题意，每次选择互不相同的元素，按升序排列。  


```cpp
vector<int> rearrangeArray(vector<int>& nums) {
  map<int, int> mp;
  for (int v : nums) {
    mp[v]++;
  }
  vector<int> ans;
  while (!mp.empty()) {
    for (auto it = mp.begin(); it != mp.end();) {
      ans.push_back(it->first);
      if (--it->second == 0) {
        it = mp.erase(it);
      } else {
        ++it;
      }
    }
  }
  return ans;
}
```


另外，根据答案的特征，如果我们对相同数字进行编号，然后按编号排序，编号相同时再按数值排序，则可以直接构造出答案。  


```cpp
vector<int> rearrangeArray(vector<int>& nums) {
  vector<pair<int, int>> indexNums;
  unordered_map<int, int> mp;
  for (int v : nums) {
    mp[v]++;
    indexNums.push_back({mp[v], v});
  }
  sort(indexNums.begin(), indexNums.end());
  vector<int> ans;
  for (auto [_, v] : indexNums) {
    ans.push_back(v);
  }
  return ans;
}
```


## 二、至多一次替换后的最大相邻相等元素对数


题意：给你一个 下标从 1 开始 的整数数组 nums。  
你可以选择两个 不同 的值 x 和 y，并 最多 执行一次以下操作：将 nums 中所有值为 x 的元素替换为 y。  
返回执行操作后，相邻且相等的元素对数量的 最大值 。  


思路：贪心统计  


答案是统计相等的相邻二元组，先统计不修改的答案。  



题目要求找到一个不相等二元组，修改为相等的值，则可以使得答案更大。  


要想答案最大，显然统计所有相邻的二元组的个数，修改个数最多的那个，则可以使得答案最大。  


```cpp
int maxEqualAdjacentPairs(vector<int>& nums) {
  map<pair<int, int>, int> mp;
  int n = nums.size();
  int ans = 0;
  int maxCount = 0;
  for (int i = 0; i < n - 1; ++i) {
    int a = nums[i], b = nums[i + 1];
    if (a > b) swap(a, b);
    if (a == b) {
      ans++;
    } else {
      mp[{a, b}]++;
      maxCount = max(maxCount, mp[{a, b}]);
    }
  }
  return ans + maxCount;
}
```


## 三、数对和受限的最长子数组


题意：给你一个整数数组 nums。  
如果不存在三个 互不相同 的下标 i、j 和 k，满足 `l <= i, j, k <= r` 且：`nums[i] + nums[j] == nums[k]`，则子数组 `nums[l..r]` 是 有效 子数组。  


返回 nums 中有效子数组的 最大 长度。  
子数组 是数组中一个连续 非空 元素序列。  


思路：构造前缀最小值  


对于子数组问题，要么枚举左端点，求满足右端点的个数；要么枚举右端点，求满足左端点的个数。  


假设左端点 `L` 固定，如何判断一个右端点 `R` 是不是答案呢？  
如果存在一个 `i,j,k` 满足 `L <= min(i,j,k) <= max(i,j,k) <= R`，则 `[L,R]` 显然不可能是有效子数组。  


![](https://res2026.tiankonguse.com/images/2026/09/27/001.png)


由此还可以进一步得到两个推论：  
1）对于所有的 `Y>=R`，`[L,Y]` 都不可能是有效子数组。  
2）对于所有的 `X<=L`，`[X,R]` 都不可能是有效子数组。  


结论 2，用大白话理解就是 `L` 前面的点作为左端点时，有效子数组边界不可能超过 `R`。  


由此，可以想到一个贪心算法：枚举所有满足条件的 `i,j,k`，然后确定一批前缀左端点 `[1,L]` 的右边界。  
对一个左端点的所有右边界取最小值，就可以得到这个左端点的最长有效子数组的长度。  


如何对前缀批量设置最小值呢？  
线段树可能会超时，而离线逆向遍历一遍，可以线性求出所有最小值。  


```cpp
int ans = 0;
int pre = n;
for (int i = n - 1; i >= 0; i--) {
  pre = min(pre, preMax[i]);
  ans = max(ans, pre - i);
}
return ans;
```


如何枚举找到所有满足条件的 `i,j,k` 呢？  
可以枚举 `i` 和 `j`，然后二分查找 `k`，即可找到所有的三元组。  


```cpp
unordered_map<ll, vector<int>> valPos;
int n = nums.size();
for (int i = 0; i < n; ++i) {
  int v = nums[i];
  valPos[v].push_back(i);
}
vector<int> preMax(n, n);  // [i, preMax[i])
for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    int v = nums[i] + nums[j];
    auto itV = valPos.find(v);
    if (itV == valPos.end()) {
      continue;
    }
    auto& pos = itV->second;
    // ...
  }
}
```


对于同一个 `(i,j)`，满足条件的 `k` 可能很多，这样还会超时。  
可以发现，根据 `[i,j]`，可以将有序的 `k` 分三种情况讨论。  


1）在右边 `k>j`，前缀为 `[1,i]` 这些点有一个右边界 `k`。  
此时需要得到最小的 `k`。  


2）在中间 `i<k<j`，前缀为 `[1,i]` 这些点有一个右边界 `j`。  


3）在左边 `k<i`，前缀 `[1,k]` 这些点有一个右边界 `j`。  
此时，需要得到最大的 `k`。  


由此，对于每个 `(i,j)` 只需要判断三次即可。  
复杂度：`O(n^2 log(n))`  


![](https://res2026.tiankonguse.com/images/2026/09/27/002.png)


写代码时，情况 1 与情况 2 可以合并，从而只需要分两种情况。  


```cpp
auto& pos = itV->second;
auto itI = lower_bound(pos.begin(), pos.end(), i);  // [i,j]
if (itI != pos.end()) {
  int idx = max(*itI, j);
  preMax[i] = min(preMax[i], idx);
}
if (itI != pos.begin()) {
  --itI;
  int idx = *itI;
  preMax[idx] = min(preMax[idx], j);
}
```


## 四、考虑空闲时间的会议最大收益


题意：给你一个二维整数数组 meetings，其中 `meetings[i] = [starti, endi, revenuei]` 表示一场会议从时间 starti 开始，在时间 endi 结束，并可获得 revenuei 的收益。  
所有会议均采用 左闭右开区间 `[start, end)` 表示，因此仅在端点处相接的会议 不视为 重叠。  


你可以选择任意一个会议 非空子集，所选会议两两不重叠。每选择一场会议，你都可以获得该会议对应的收益。  
将所选会议按照 开始时间递增 的顺序排列。  
对于该顺序中每一对相邻会议，你还可以根据它们之间的空闲时间获得额外收益，每单位空闲时间获得 1 单位收益。  
空闲时间等于后一场会议的开始时间减去前一场会议的结束时间。  


最早一场所选会议开始之前，以及最晚一场所选会议结束之后的空闲时间不会产生收益。  
如果只选择一场会议，则不会获得任何空闲时间收益。  


返回可以获得的 最大总收益 。  


思路：前缀DP  


很容易想到动态规划。  
状态定义：`dp[t]` 截止到时间 t 获取的最大收益。  


难点：dp 状态是否要包含最后一段空闲时间的收益。  


如果包含，则状态转移方程只依赖上一个时间，方程如下：  


```cpp
dp[t] = max(dp[t], dp[t-1] + 1);
```


此时状态 `dp[i]` 的含义是假设后面还有一个会议，截止到时间 i，前缀的最大收益。  


题目中时间数据范围是 `10^9`，所以需要离散化。  


离散化后如何求前缀最大值呢？  
可以使用一个游标来累计计算当前时刻的最大收益。  


```cpp
vector<ll> dp(n, 0);
ll ans = 0;
int p = 0;
for (auto& m : meetings) {
  int l = valToIdx[m[0]], r = valToIdx[m[1]];
  ll v = m[2];
  while (p < l) {
    if (dp[p] > 0) {
      dp[p + 1] = max(dp[p + 1], dp[p] + vals[p + 1] - vals[p]);
    }
    p++;
  }
  dp[r] = max(dp[r], dp[l] + v);
  ans = max(ans, dp[l] + v);
}
return ans;
```


如果状态中不包含最后的空闲时间，则状态转移方程需要加上空闲时间的收益，方程如下。  


```cpp
dp[t] = max(dp[T] + t - T);
      = max(dp[T] - T) + t;
```


这个就使得状态比较复杂了。  
而且还不好写出正确的状态转移方程，就不展开介绍了。  



## 五、最后


这次比赛，第四题很容易想到状态包含空闲时间，从而很快写出代码。  
而第三题，需要先根据左端点推导出右端点上限，再反向推导出左端点前缀。  
这样对比，第三题的思维难度其实更高的。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
