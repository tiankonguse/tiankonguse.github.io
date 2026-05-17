---
layout: post
title: leetcode 周赛 502 第 64 名
description: 字符串HASH与二分
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2026-05-17 12:13:00
published: true
---


## 零、背景

这次比赛不难，做完快 11:30 了，以为排名几百名之外了，没想到进入前百名，最终是第 64 名。  


本场题型概览如下。  
A 题：循环比较。  
B 题：数学计算或二分。  
C 题：DP。  
D 题：字符串hash与二分。  


## 一、检查相邻数字差


题意：给一个数组，问是否相邻数字之差至多为2。  


思路：循环判断即可。  


小技巧：提前定义一个满足条件的 pre 值，则不需要特殊判断，直接循环比较。  
如果要求的差不大于 X，可以定义 pre 值与第一个值相同。  
如果要求的差不小于 X，可以把 pre 值定义为无穷大或者无穷小。  


## 二、统计区间内的完全 K 次幂数量

题意：问区间 `[l,r]` 内有多少个数字，是 k 次幂，即存在一个整数 `x` 满足 `x^k` 在这个区间内。  


思路：数学计算或者二分


显然，数据范围太大，不能直接循环判断。  
如果可以快速计算出满足条件的最小 x 和最大 x，则左右边界即可得到满足条件的个数。  


其实，区间统计问题，往往可以转化为前缀和问题。  
故问题可以简化为 `f(r+1) - f(l)` 问题。  



怎么找到 `[1,r]` 内满足要求的个数呢？  


方法1：数学计算。  
直接对 r 开 k 次方，即可得到答案。  
为了避免精度导致答案错误，可以加一再判断一次。  


实际写代码时，为了避免精度问题，我的经验是使用循环多加几次。  


```cpp
ll x = floor(pow(r, 1.0 / k));
while (powl(x + 1 , k) <= r) x++;
```


方法2：二分。  
小于答案的都满足，大于答案的都不满足，典型的二分问题。  



注意事项：可能没有答案。  


## 三、矩阵中的局部最大值 II

题意：给一个矩阵，如果一个单元格的值是非零 x，则要求在上下左右距离 x 行 x 列的范围内，x 是最大值。  
特殊条件：不包含行距离和列距离恰好都为 x 的位置。  
数据范围：200  


思路：动态规划


如果暴力计算，思路为枚举每个单元格，以及枚举这个单元格的所有覆盖范围。  
此时复杂度为 `O(n^4)`，显然会超时。  


显然，如果可以预处理出每一行的任意区间的最大值，则可以少一次循环。  



状态定义：`dp[i][l][r]`  
含义：第 i 行区间 `[l,r]` 内的区间最大值。  


状态转移方程：  


```cpp
dp[i][l][r] = max(dp[i][l][r-1], nums[i][r])
```


对于特殊条件，进行特殊判断即可。  


```cpp
auto getMax = [&](int row, int col) -> int {
  const int x = matrix[row][col];
  int maxVal = -1;
  for (int i = row - x; i <= row + x; i++) {
    if (i < 0 || i >= n) continue;
    if (i == row - x || i == row + x) {
      int l = max(0, col - matrix[row][col] + 1);
      int r = min(m - 1, col + matrix[row][col] - 1);
      maxVal = max(maxVal, dp[i][l][r]);
    } else {
      int l = max(0, col - matrix[row][col]);
      int r = min(m - 1, col + matrix[row][col]);
      maxVal = max(maxVal, dp[i][l][r]);
    }
  }
  return maxVal;
};
```



复杂度：`O(n^3)`  


## 四、最短唯一子数组


题意：给一个数组，求一个最短的子数组，满足这个子数组在所有子数组中只出现一次。  



思路：字符串hash与二分  


如果换成字符串，则是经典的字符串问题，可以使用后缀自动机或者后缀数组。  


分析答案的性质，子数组只出现一次，且求最短的。  


如果一个子数组是答案，这个子数组往两边扩展，得到的更长的子数组肯定也都是答案。  
故答案满足二分的性质，长度小于答案时不存在只出现一次的子数组，长度大于等于答案时，至少存在一个子数组只出现一次。  


```cpp
int l = 1, r = n;
while (l < r) {  // [l, r)
  int mid = (l + r) / 2;
  if (Check(mid)) {
    r = mid;
  } else {
    l = mid + 1;
  }
}
return l;
```


假设子数组长度固定了，怎么判断是否存在只出现一次的子数组呢？  
典型的做法是滑动窗口+哈希统计。  


由于是整数 hash，为了避免哈希冲突，我采用了双hash。  
之前在文章《[字符串 hash](https://mp.weixin.qq.com/s/e5kPXWb989-Op3COSiPA5w)》介绍过这个算法。  


```cpp
H1.Init(nums, n);
H2.Init(nums, n);
auto Check = [&](int len) -> bool {
  unordered_map<ll, int> seen;
  for (int i = 0; i + len <= n; i++) {
    ll hash1 = H1.H(i, i + len - 1);
    ll hash2 = H2.H(i, i + len - 1);
    ll combinedHash = (hash1 << 32) | hash2;
    seen[combinedHash]++;
  }
  for (const auto& [hash, count] : seen) {
    if (count == 1) {
      return true;
    }
  }
  return false;
};
```


复杂度：`O(n log(n))`  



最后再贴一下我的字符串 hash 模板。  


```cpp
typedef long long ll;
const int mod1e7 = 1000000007, mod1e9 = 1000000009;
const int max3 = 2010, max4 = 20010, max5 = 100010, max6 = 2000010;

const ll BASE = 29, BASE1 = 100003, BASE2 = 100019;

class StringHash {
  ll h[max5];
  ll qpowCache[max5];
  const ll BASE;
  const ll MOD;

 public:
  StringHash(ll base, ll mod) : BASE(base), MOD(mod) {}
  ll H(int l, int r) { // [l,r], 0 base
    if (l == 0) return h[r];
    ll pre = h[l - 1] * qpowCache[r - l + 1] % MOD;
    return (h[r] - pre + MOD) % MOD;
  }

  void Init(const vector<int>& str, int n) {
    qpowCache[0] = 1;
    for (int i = 1; i <= n; i++) {
      qpowCache[i] = (qpowCache[i - 1] * BASE) % MOD;
    }

    ll pre = 0;
    for (int i = 0; i < n; i++) {
      pre = (pre * BASE + str[i]) % MOD;
      h[i] = pre;
    }
  }
  void Init(const string& str, int n) {
    qpowCache[0] = 1;
    for (int i = 1; i <= n; i++) {
      qpowCache[i] = (qpowCache[i - 1] * BASE) % MOD;
    }

    ll pre = 0;
    for (int i = 0; i < n; i++) {
      pre = (pre * BASE + str[i] - '0' + 1) % MOD;
      h[i] = pre;
    }
  }
};

StringHash H1(BASE1, mod1e7);
StringHash H2(BASE2, mod1e9);
```


## 五、最后  


这次比赛不难，都是基础算法。  
第二题数学计算或二分，第三题动态规划，第四题二分与字符串 hash。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
