---
layout: post
title: leetcode 第 463 场算法比赛 - 78名
description: 分组调和级数 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-08-17 12:13:00
published: true
---

## 零、背景


这次比赛比较简单，第一题我做了 15 分钟，浪费了不少时间，最终排名 78。  


A: 枚举+前缀和  
B: 模拟  
C: 贪心+动态规划  
D: 分组+调和级数  


排名：78  
代码地址： https://github.com/tiankonguse/leetcode-solutions  

## 一、按策略交易股票的最佳时机  


![](https://res2025.tiankonguse.com/images/2025/08/17/001.png) 


题意：给出股票每天的价格与每天的买入卖出策略，现在可以对选择一个日期区间，前一半时间不交易，后一半时间每天都卖出，问最终所有天数的收益。  


思路：枚举+前缀和    


一开始没看懂题，研究了半天。  
原来是假设一开始手上有无限数量无成本的股票，然后按策略进行买卖，卖出是收益，买入是支出，问最终的收益。  


选择一个日期区间，前一半时间不交易，后一半时间每天都卖出。  
由于不知道选择哪个区间收益最大，因此需要枚举所有情况。  


假设区间 `[L,M-1]` 为前一半时间不交易，`[M, R]` 为后一半时间每天都卖出，这个区间的收益就是后一半时间的股价之和。  
而对于区间 `[1,L-1]` 的收益与区间 `[R+1,n]` 的收益，可以预处理前缀和，然后求差直接计算。  
三个区间的收益之和就是最终收益。  


```cpp
vector<ll> preSum(n + 2, 0), pricesSum(n + 2, 0);
for (int i = 1; i <= n; i++) {
  preSum[i] = preSum[i - 1] + prices[i - 1] * strategy[i - 1];
}
for (int i = 1; i <= n; i++) {
  pricesSum[i] = pricesSum[i - 1] + prices[i - 1];
}
ll ans = preSum[n];
for (int i = 1; i + k - 1 <= n; i++) {
  int k2 = k / 2;
  int L = i - 1, R = i + k;     // [1, L] [R, n]
  int SL = i + k2, SR = R - 1;  // [SL, SR]
  ll sum = 0;
  sum += preSum[L] - preSum[0];
  sum += preSum[n] - preSum[R - 1];
  sum += pricesSum[SR] - pricesSum[SL - 1];
  ans = max(ans, sum);
}
return ans;
```

## 二、区间乘法查询后的异或 I  


![](https://res2025.tiankonguse.com/images/2025/08/17/002.png) 


题意：给一个数组，然后若干操作，每个操作时对区间 `[L,R]` 从 L 开始按步长 K 进行遍历，然后对遍历到的位置进行乘上 X 。  
求所有操作后，数组的异或和。  


思路：模拟  


数组大小为 `10^3`，操作次数为 `10^3`，可以暴力模拟即可。  


```cpp
 for (const auto& q : queries) {
   ll li = q[0], ri = q[1], ki = q[2], vi = q[3];
   for (int idx = li; idx <= ri; idx += ki) {
     nums[idx] = (nums[idx] * vi) % mod;
   }
 }
 int ans = 0;
 for (auto v : nums) {
   ans ^= v;
 }
 return ans;
```

## 三、删除可整除和后的最小数组和  


![](https://res2025.tiankonguse.com/images/2025/08/17/003.png) 



题意：给一个数组，每次可以删除一个区间和为 k 的整数倍的子数组，问如何操作，最终可以使得剩余的数组和最小。  


思路：贪心+动态规划  


贪心1：如果删除的两个子数组重叠，那么可以将这两个子数组合并，依旧满足删除 k 的整数倍的子数组的条件。  
故问题转化为了，删除一些不重叠的区间和为k整数倍的子数组，使得剩余的数组和最小。  


在子数组不重叠的情况下，就可以使用动态规划来解决。  


状态定义：`f(n)` 表示前 n 个元素进行操作后的最小剩余和。  


状态转移方程：分为最后一个元素删除与不删除两种情况。  


不删除：`f(n) = f(n-1) + nums[n]`  


删除：需要找到所有后缀和为 k 的整数倍的子数组，然后取最小值。  
贪心2：如果两个相邻的区间和都为 k 的整数倍，那么只需要删除最后一个，前面的在递归时会被删除。  
故需要预处理出每个位置为右边界的最小区间，使得区间和为 k 的整数倍，左边界储存在`leftLast`数组中。  



```cpp
vector<ll> dp(n + 1, 0);
for (int i = 1; i <= n; i++) {
  dp[i] = dp[i - 1] + nums[i - 1];
  if (leftLast[i] != -1) {
    dp[i] = min(dp[i], dp[leftLast[i] - 1]);
  }
}
return dp[n];
```


求最小区间的左边界，很经典的问题，可以通过前缀和与哈希表来做。  


```cpp
vector<int> kIndex(k, -1);        // 哈希表：储存前缀和的最后一个位置
vector<int> leftLast(n + 1, -1);  // 储存找到的左边界
ll pre = 0;
kIndex[0] = 0;
for (int i = 1; i <= n; i++) {
  ll v = nums[i - 1];
  pre = (pre + v) % k;
  if (kIndex[pre] != -1) {
    leftLast[i] = kIndex[pre] + 1;
  }
  kIndex[pre] = i;
}
```


## 四、区间乘法查询后的异或 II  


![](https://res2025.tiankonguse.com/images/2025/08/17/004.png) 


题意：与第二题完全一样，数据范围变为 `10^5`。  


思路：分组+调和级数  


暴力计算，复杂度是 `O(n/k1 + n/k2 + n/k3+...)`。  
如果 k 互不相同，则这是一个调和级数，复杂度是 `O(nlogn)`。  
所以，我们需要对 k 进行分组，单独处理每一组内的操作。  


由于起始位置不同的关系，即使 k 相同，有些操作因为偏移量不同，永远都不会发生重叠。  
故，还需要对起始位置取模 k 求出偏移量，来进一步分组。  


这时候，问题转化为了，多次对区间内的每个位置乘以一个数，求最终每个位置的值。  


问题：区间内每个位置都加上一个数，大家思考如何做。  
这是一个典型的问题，可以对区间拆分为左加右减的两个操作，然后使用扫描线法来求答案。  


```cpp
vector<tuple<ll, ll, ll, ll, ll>> fixQuerys;
fixQuerys.reserve(queries.size() * 2);
for (auto& q : queries) {
  const int& li = q[0];
  int& ri = q[1];
  const int& ki = q[2];
  const int& vi = q[3];
  ri = li + (ri - li) / ki * ki;  // 修正右边界
  const ll offset = li % ki;
  fixQuerys.push_back({offset, ki, li, 1, vi});
  fixQuerys.push_back({offset, ki, ri + 1, -1, vi});
}
```


加减时很简单，乘除时由于涉及到除法，需要使用逆元来处理。  


```cpp
sort(fixQuerys.begin(), fixQuerys.end());
ll preOffset = -1, preKi = -1;
ll V = 1, offsetIndex = -1;
for (const auto [offset, ki, idx, flag, vi] : fixQuerys) {
  if (preOffset != offset || preKi != ki) { // 两个维度的分组
    preOffset = offset;
    preKi = ki;
    // 初始化
    offsetIndex = offset;
    V = 1;
  }
  while (offsetIndex < idx) { // 扫描线
    nums[offsetIndex] = (nums[offsetIndex] * V) % mod;
    offsetIndex += ki;
  }
  if (flag == 1) {  // 左加
    V = (V * vi) % mod;
  } else { // 右减
    V = (V * inv(vi, mod)) % mod;
    // V = (V / vi) % mod; // 简单数据验证正确性
  }
}
```


由于是两次分组，有人可能会疑问，这样会不会导致实际复杂度更高呢？  


很容易想到，最坏情况下就是 k 很小，每次都需要扫描整个区间，则数据如下：  


`K=1`，出现 1 次，最终扫描整个区间。    
`K=2`，出现 2 次互不重叠，合起来最终扫描整个区间。  
`K=3`，出现 3 次互不重叠，合起来最终扫描整个区间。  


由于操作数是`10^5`，则`1+2+...+K<=10^5`，K 大约为 `sqrt(10^5)`。  
所以最坏情况下，复杂度为 `O(n*sqrt(n))`，虽然变大了，但不会超时。  



## 五、最后  


这次比赛最后一题比较有难度，不过我想到了分组与调和级数，大概 11:30 就写完了代码，不过敲错一个地方，错误一次，调试半天，最终通过后排名 78 名。  
如果没敲错地方，有可能进入前 50 名。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
