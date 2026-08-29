---
layout: post  
title: leetcode 周赛 516 - 分块莫队与子数组不同元素个数  
description: 求子数组不同元素个数，很有意思的构造思路  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-08-29 12:13:00  
published: true  
---


## 零、背景


这次比赛的那几天我请假回老家了，所以就没参加比赛。  
回来后，工作一直比较忙，所以直到周六才有时间把题目做了一遍。  


最近几周我一直有一个感受，Leetcode 最后一题的难度升高了。  
也许是我年纪大了，变菜了吧。  


本场题型概览如下。  


A 题：模拟。  
B 题：枚举、二分、双指针、贪心。  
C 题：分享两种滑动窗口与求质因子。  
D 题：哈希前缀和、莫队、树状数组、滑动窗口等。  


## 一、判断 ASCII 值回文


题意：给一个字符串，问把每个字符当做 ASCII 整数转化为 8 位的二进制，最终得到的字符串是否是回文串。  


思路：模拟判断  


按题意转为二进制字符串，前后双指针判断是否是回文串即可。  


```cpp
string ret;
ret.reserve(s.size() * 8);
for (int c : s) {
  for (int i = 0; i < 8; i++) {
    ret += (c & (1 << i)) ? '1' : '0';
  }
}
return CheckPalindromic(ret);
```


## 二、找到所有数组中消失的数字 II


题意：给一个数组，以及一个区间，问区间内的数字，有哪些不在数组内。  
最终按递增顺序返回缺失的连续区间列表。  
数据范围：`10^5`  


方法一：枚举  


数组存到哈希表中，然后从小到大枚举区间内的数字，判断是否存在。  
不存在的追加到连续区间列表中。  


```cpp
vector<vector<int>> ret;
for (; lower <= upper; lower++) {
  if (s.count(lower)) continue;
  if (!ret.empty() && ret.back().back() == lower - 1) {
    ret.back().back() = lower;
  } else {
    ret.push_back({lower, lower});
  }
}
return ret;
```


方法二：二分  


假设我们找到一个起始的缺失数字，如何找到这个区间有多大呢？  
直接进行二分，即可找到下个数字的位置。  
所以，可以不断压缩 lower，从而找到所有的缺失区间。  


复杂度：`O(n log(n))`  


```cpp
vector<vector<int>> ret;
while (lower <= upper) {
  auto it = lower_bound(nums.begin(), nums.end(), lower);
  if (it == nums.end() || *it > upper) {
    ret.push_back({lower, upper});
    break;
  } else {
    const int val = *it;
    if (val != lower) {
      ret.push_back({lower, val - 1});
    }
    lower = val + 1;
  }
}
return ret;
```


方法三：双指针  


方法二没有利用上次操作的结果，每次都是二分的。  
而查看整个过程，可以发现查询结果是按顺序查找到的。  


故可以维护一个游标，来代替二分。  


```cpp
sort(nums.begin(), nums.end());
vector<vector<int>> ret;
int n = nums.size();
int i = 0;
while (lower <= upper) {
  while (i < n && nums[i] < lower) i++;
  if (i == n || nums[i] > upper) {
    ret.push_back({lower, upper});
    break;
  } else {
    const int val = nums[i];
    if (val != lower) {
      ret.push_back({lower, val - 1});
    }
    lower = val + 1;
  }
}
return ret;
```


方法四：左右连续性判断  


假设没有区间的限制，直接问数组中空洞的区间有哪些，该怎么判断呢？  
显然是排序后，看相邻元素之差是否大于 1。  


有了区间限制后，区间的左右边界处理比较麻烦。  
此时可以在区间前和区间后加入一个桩，从而解决边界问题。  


```cpp
nums.push_back(lower - 1);
nums.push_back(upper + 1);
sort(nums.begin(), nums.end());

vector<vector<int>> ret;
auto l = lower_bound(nums.begin(), nums.end(), lower) - nums.begin();
auto r = lower_bound(nums.begin(), nums.end(), upper) - nums.begin();
for (auto i = l; i <= r; i++) {
  if (nums[i] - nums[i - 1] > 1) {
    ret.push_back({nums[i - 1] + 1, nums[i] - 1});
  }
}
return ret;
```


## 三、至多 K 个不同质因数集合的最长子数组


题意：给一个数组，求最长的子数组，使得子数组中所有元素的不同质因子个数不超过 K。  


思路：滑动窗口  


对于质因子，提前筛选素数表，然后循环判断即可。  


```cpp
vector<int> factPrimes;
void GetFactPrime(ll v) {
  factPrimes.clear();
  for (int i = 0; prm[i] * prm[i] <= v; i++) {
    if (v % prm[i] == 0) {
      const ll a = prm[i];
      factPrimes.push_back(a);
      while (v % a == 0) {
        v /= a;
      }
    }
  }
  if (is[v]) {  // 最后剩余一个质数不满足 prm[i] * prm[i] <= v
    factPrimes.push_back(v);
  }
}
```


对于滑动窗口，如果是求不大于，固定右区间，游标维护左区间代码会简洁一些。  


```cpp
InitPrimes();
int n = nums.size();
int l = 0;
int ans = 0;
for (int i = 0; i < n; i++) {
  Add(nums[i]);
  while (mp.size() > k) {
    Remove(nums[l]);
    l++;
  }
  ans = max(ans, i - l + 1);  // [l, i]
}
return ans;
```


如果固定左区间，游标为右区间，就需要特殊判断当前的游标是开区间还是闭区间，很容易被坑。  


```cpp
int ans = 0;
for (int i = 0; i < n; i++) {
  while (r < n && mp.size() <= k) {
    Add(nums[r]);
    r++;
  }
  if (mp.size() <= k) {
    ans = max(ans, r - i);
  } else {
    ans = max(ans, r - i - 1);
  }
  Remove(nums[i]);
}
return ans;
```


## 四、有效 K 个不同元素子数组 I


题意：给一个数组，问指定子数组是否恰好包含 k 个不同的数字，且每个数字出现的频率都是偶数个。  


思路：随机哈希、莫队、树状数组  


首先可以发现两个条件互相独立，所以可以分别来判断是否满足。  


先来看每个数字是否都出现偶数次。  


最容易想到的就是前缀异或。  
但是很容易构造出一些数据，来使得异或得到错误的答案。  
所以，需要对数据进行随机映射，之后就很难构造出 hack 数据了。  


所以，第一个解法是随机数+前缀异或。  
直接通过 `prefixXor[r] == prefixXor[l - 1]` 判断是否都是偶数。  


```cpp
ll Rand() {
  // 随机生成一个 64 位的随机数
  return rand() | ((ll)rand() << 32);
}
unordered_map<int, ll> mp;
vector<ll> prefixXor;
void InitXor(const vector<int>& nums) {
  const int n = nums.size();
  prefixXor.resize(n + 1);
  for (int i = 1; i <= n; i++) {
    const int v = nums[i - 1];
    if (mp.count(v) == 0) {
      mp[v] = Rand();
    }
    prefixXor[i] = prefixXor[i - 1] ^ mp[v];
  }
}
```


对于区间统计问题，如果没有其他高效算法，那就上离线莫队算法来暴力计算。  


莫队算法是对查询的区间进行排序，然后暴力对区间左边界或者右边界加减一次，直到与询问区间一致。  


这时候很容易怀疑，难道不会超时吗？  
这就需要使用分块的思想来排序，使得最坏情况下，复杂度依旧不超过 `n sqrt(n)`。  


具体来说，按其中一个边界来划分为 `B=sqrt(N)` 块，每个块内有 `sqrt(N)` 个元素。  


排序时，先按块排序，之后按另一个边界排序。  
这里不妨假设是按左边界分块，其次右边界排序。  


由于左边界是按分块排序的，这导致块内的左边界是乱序的。  
所以，块内 `sqrt(N)` 个元素每次对齐左边界都最多移动 `sqrt(N)` 次，综合移动 `N` 次。  
对于右边界，由于是有序的，累计也是最多移动 `N` 次。  
综合起来，一个块最多移动 `2*N` 次。  


总共分了 `sqrt(N)` 块，故综合复杂度为 `N sqrt(N)`。  


```cpp
for (auto v : nums) mp[v] = 0;
int current_cnt = 0;  // 元素偶数个的个数
auto Add = [&](int v) {
  mp[v]++;
  if (mp[v] % 2 == 0) {
    current_cnt++;  // 变成偶数
  } else {
    current_cnt--;  // 变成奇数
  }
};
auto Remove = [&](int v) {
  mp[v]--;
  if (mp[v] % 2 == 0) {
    current_cnt++;  // 变成偶数
  } else {
    current_cnt--;  // 变成奇数
  }
};
moQueAns.resize(queries.size());
int current_l = 0, current_r = -1;  // [left, right]
for (auto& [left, right, index] : sortedQueries) {
  while (current_l > left) Add(nums[--current_l]);
  while (current_l < left) Remove(nums[current_l++]);
  while (current_r < right) Add(nums[++current_r]);
  while (current_r > right) Remove(nums[current_r--]);
  moQueAns[index] = current_cnt == 0;
}
```


接下来看另一个条件，恰好包含 k 个不同的数字。  


由于 k 固定，最容易想到的方法是滑动窗口。  
预处理出每个右边界恰好包含 k 个不同数字的左边界区间，然后询问时直接判断是否在区间内。  


这就和上一题很相似了，找到包含 k 个不同数字的最小数组，以及包含 `k+1` 个不同数字的最小数组，合起来就是目标区间。  


```cpp
vector<int> InitRange(const vector<int>& nums, const int K) {
  int n = nums.size();
  mp.clear();
  vector<int> left(n);
  int l = 0;
  for (int i = 0; i < n; i++) {
    mp[nums[i]]++;
    while (mp.size() >= K) {
      mp[nums[l]]--;
      if (mp[nums[l]] == 0) {
        mp.erase(nums[l]);
      }
      l++;
    }
    left[i] = l;
  }
  return left;
}
```


另一种思路则是构造出一种特殊的数据结构，从而可以统计区间内不同数字的个数。  


例如，固定右区间时，定义每个数字最后一次出现的位置值为 1，之前出现的位置值为 0。  
则求区间和，就可以统计出这个区间内有多少个数字。  
对于区间和，可以使用线段树或者树状数组来实现。  


```cpp
auto Update = [&](const int i) {
  const int v = nums[i - 1];
  if (mp[v] != 0) {
    const int idx = mp[v];
    FenwickTree::bit_update(idx, -1);
  }
  mp[v] = i;
  FenwickTree::bit_update(i, 1);
};
```


由于固定了右区间，所以需要离线处理所有查询，按右区间排序。  
这种算法还可以做到任意 k 都可以查询判断。  


```cpp
int offset = 0;
FenwickTree::bit_init(n);
for (int i = 1; i <= n && offset < Q; i++) {
  Update(i);
  while (offset < Q && get<0>(sortedQueries[offset]) == i) {
    const auto [right, left, idx] = sortedQueries[offset];
    const int k = FenwickTree::bit_query(right) - FenwickTree::bit_query(left - 1);
    if (k == K && prefixXor[right] == prefixXor[left - 1]) {
      ans[idx] = true;
    }
    offset++;
  }
}
```


## 五、最后


这次比赛最后一题其实比较难。  
统计区间内不同数字出现次数，需要用到莫队算法。  
统计区间内不同数字的个数，需要特殊构造，然后使用线段树或树状数组来解决。  
这种构造法挺有意思的。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
