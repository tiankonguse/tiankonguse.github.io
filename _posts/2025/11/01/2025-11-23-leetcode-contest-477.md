---
layout: post
title: leetcode 周赛 477 - 子集和与容斥  
description: 很有难度的问题        
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-11-23 12:13:00
published: true
---

## 零、背景

这场比赛最后一题比较有难度，需要使用容斥原理来求解。  
容斥的时候需要统计子集和，所以还需要使用 DP 来预处理计算子集和。  


A: 循环  
B: 前缀和  
C: 前缀和  
D: 容斥+DP   


**最终排名**：60  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、连接非零数字并乘以其数字和 I  


题意：给一个整数，问删除所有数字 0 后，剩余数字拼成的数与所有数字和的乘积是多少？  



思路：循环模拟  


按题意一位位判断，遇到 0 就跳过，遇到其他数字就进行数字拼接，以及计算数字和。    


## 二、最大平衡异或子数组的长度  


题意：给一个数组，求一个最长的子数组，使得子数组的元素异或值为 0，且子数组中奇数和偶数个数相等。  


思路：前缀和  


前缀不仅需要记录异或值，还需要记录奇数与偶数的差值。  


满足要求的前缀：异或值相同，奇数与偶数的差值相同。  


```cpp
map<pair<ll, ll>, ll> H;  // <xor, oddEven> -> index
ll preXor = 0, PreOddEven = 0;
H[{preXor, PreOddEven}] = 0;
int n = nums.size();
ll ans = 0;
for (int i = 1; i <= n; i++) {
  ll v = nums[i - 1];
  preXor ^= v;
  if (v % 2 == 0) {
    PreOddEven++;
  } else {
    PreOddEven--;
  }
  pair<ll, ll> key = {preXor, PreOddEven};
  if (H.count(key)) {  // 最长，不覆盖
    ans = max(ans, i - H[key]);
  } else {
    H[key] = i;
  }
}
```


## 三、连接非零数字并乘以其数字和 II  


题意：给一个字符串和若干询问。  
问对每个区间子串，删除其中所有数字 0 后，剩余数字拼成的数与所有数字和的乘积是多少？  



思路：前缀和    


先预处理字符串，预处理出每个位置的前缀和 `preSum[i]`，以及非 0 数字的前缀值与个数 `preNum[i]={val, count}`。  


```cpp
vector<ll> preSum(n + 1, 0);
vector<pair<ll, ll>> preNum(n + 1, {0, 0});  // <val, count>
vector<ll> base(n + 1, 1);
for (int i = 1; i <= n; i++) {
  ll v = s[i - 1] - '0';
  preSum[i] = (preSum[i - 1] + v) % mod;
  preNum[i] = preNum[i - 1];
  base[i] = (base[i - 1] * 10) % mod;
  if (v == 0) continue;
  preNum[i].first = (preNum[i].first * 10 + v) % mod;
  preNum[i].second++;
}
```


假设询问的是 `[l,r]`。  
则区间内数字和为  `sum = preSum[r] - preSum[l - 1]`。  
则区间内数字个数为  `k = preNum[r].count - preNum[l-1].count`。  
区间内的数字值为 `val = preNum[r] - preNum[l-1] * 10^k`。  
答案为 `val * sum`。  



```cpp
vector<int> ans;
ans.reserve(queries.size());
for (auto& q : queries) {
  int l = q[0] + 1, r = q[1] + 1;
  ll sum = (preSum[r] - preSum[l - 1] + mod) % mod;
  auto [leftVal, leftCount] = preNum[l - 1];
  auto [rightVal, rightCount] = preNum[r];
  ll leftBaseVal = (leftVal * base[rightCount - leftCount]) % mod;
  ll val = (rightVal - leftBaseVal + mod) % mod;
  ans.push_back((sum * val) % mod);
}
return ans;
```


## 四、有效子序列的数量  


题意：给一个数组，数组的强度定义为所有元素的按位或值，问存在多少个非空子序列，删除后可以使得数组的强度降低。  


思路：容斥+DP  


显然，要使数组的强度降低，至少把某个 Bit 位为 1 的元素全部删除。  


这个是一个典型的容斥问题。  
先把所有 1 个 Bit 位的元素都删除，此时所有 2 位 Bit 位的元素被重复删除，需要加回来。  
依次递推，奇数个 Bit 位的元素进行删除，偶数个 Bit 位的元素进行添加。  


有了这个规律，我们可以通过枚举有效位子集的方式，来计算容斥。  
假设当前有效位是 mask，计算出所有包含这些 Bit 位的元素个数 `count_A`。  
`count_A` 个元素删除后就可以满足要求，故其他元素可以任意选择，共 `2^(n - count_A)` 种方案。  


复杂度：`O(n*2^n)`  
通过的测试用例数为 `987 / 1041` 个。  



```cpp
ll ans = 0;
for (int realMask = 1; realMask < kRealMaxMask; realMask++) {
  ll mask = getMask(realMask);
  ll oneCount = __builtin_popcount(mask);
  ll count_A = 0;  // 子集个数
  for (ll x : nums) {
    if ((x & mask) != 0) {
      count_A++;
    }
  }
  ll count_B = n - count_A;
  ll tmp = powers[count_B];
  if (oneCount % 2 == 1) {
    ans = (ans + tmp) % mod;
  } else {
    ans = (ans - tmp + mod) % mod;
  }
}
return ans;
```


可以发现，容斥是没办法优化了。  
但是计算一个子集的个数是可以预处理优化的。  


包含 Bit 位的元素个数 `count_A` 与不包含 Bit 位的元素个数 `count_B` 之和为 `n`。  


如何计算至少包含某些 Bit 位的元素个数？  
这是一个典型的子集 DP 问题。  


定义状态：`dp[mask]` 表示包含 `mask` Bit 位的元素个数。  


状态转移方程如下：  


```cpp
// mask & (1 << i) != 0
dp[mask] = dp[mask] + dp[mask ^ (1 << i)];
```

故，预处理出所有子集的个数，即可优化到 `O(n*log(n))`。  


```cpp
const ll kMaxMask = 1 << kMaxBit;
vector<ll> preMaskCount(kMaxMask, 0);
for (ll x : nums) {
  preMaskCount[x]++;
}
for (int i = 0; i < kMaxBit; i++) {
  for (int mask = 0; mask < kMaxMask; mask++) {
    if (mask & (1 << i)) {
      preMaskCount[mask] += preMaskCount[mask ^ (1 << i)];
    }
  }
}
```


## 五、最后  


这次比赛的第四题比较有难度，需要使用容斥原理来求解。  
容斥的时候需要统计子集和，所以还需要使用 DP 来预处理计算子集和。  
两个子问题都比较难，加起来就更难了。  


《完》

-EOF-

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
