---
layout: post  
title: leetcode 周赛 519（很难）  
description: 值域分治+单调栈+二分  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-09-13 12:13:00  
published: true  
---


## 零、背景


这次比赛比较难，第三题想复杂了，不然可以进入前百名  


本场题型概览如下。  


A 题：计算。  
B 题：预处理+二分。  
C 题：单调栈。  
D 题：值域分治+单调栈+二分  


## 一、行列循环移位


题意：给一个矩阵，先所有行向左循环移动 `R[i]` 位，接着所有列向上循环移动 `C[j]` 位，求得到的矩阵。  


思路：计算映射  


假设原先坐标是 `(i,j)`。  
先进行左循环移动，行不变，列移动，得到 `(i, j-R[i])`。  
接着所有列向上循环移动，列不变，行移动，得到 `(i-C[j-R[i]], j-R[i])`。  


提示：注意保证行与列不为负数。  


## 二、使每个元素变为回文数的最少操作次数


题意：给一个数组，每次可以对一个数字进行加2或者减2，问最少操作多少次，才能使所有数字都是回文数。  


思路：预处理+二分  


每个数独立，所以只需要求出每个数字变成回文数的最小操作次数，最终求和即可。  


一个数字可以不断加2，也可以不断减2，谁更优不清楚，所以都需要求出来，然后比大小。  


怎么找到左右最接近的回文数呢？  
直接构造计算比较复杂，而回文数不超过 `10*sqrt(N)` 个。  
故可以预处理所有回文数，然后二分查找。  


怎么预处理呢？  
由于是对称性，需要考虑奇偶性。  
如果长度是偶数，例如长度为 6，做左半部与右半部对称，左半部的值域是 `100 ~ 999`，即 `[10^2, 10^3-1]`。  
如果长度是奇数，对称轴也需要算上，例如长度是 7，则中间的数字自己与自己对称，左半部的值域是 `1000 ~ 9999`。  
此时，右半部的值需要去掉最高位，即 `Reverse(i) % mods[3]`。  


```cpp
set<ll> oddMp, evenMp;
int isInit = false;
void Init() {
  if (isInit) return;
  isInit = true;
  for (int w = 1; w <= 9; w++) {
    ll half = (w + 1) / 2;
    for (ll i = mods[half - 1]; i < mods[half]; i++) {
      ll ri = Reverse(i);
      ll v = 0;
      if (w % 2 == 0) {
        v = i * mods[half] + ri;
      } else {
        v = i * mods[half - 1] + (ri % mods[half - 1]);
      }
      if (v % 2 == 0) {
        evenMp.insert(v);
      } else {
        oddMp.insert(v);
      }
    }
  }
}
```


## 三、统计影子数对 I


题意：给一个数组，问存在多少二元组 `(i,j)`，满足 `nums[i]<nums[j]` 且不存在 `i < k < j` 使得 `nums[k] < nums[i] < nums[j]`。  


思路：单调栈  


寻找二元组的问题，经典的做法是枚举右，统计左。  


题目要求不能有一个 `k` 夹在二元组中间，使得 `nums[k]` 的值小于二元组。  


显然，`k` 前面，小于 `nums[k]` 的值都不能当做 `i`。  


故可以维护一个单调非递减栈，栈中的都是答案。  


但是有一个特殊的情况：如果栈中与 `nums[i]` 相等的不能当做答案。  


如何排除这部分元素呢？  


第一个方法是维护一个带计数的单调栈，以及元素总个数的计数器。  


```cpp
vector<pair<ll, ll>> sta;
ll sum = 0;
for (ll v : nums) {
  while (!sta.empty() && sta.back().first > v) {
    sum -= sta.back().second;
    sta.pop_back();
  }
  if (!sta.empty() && sta.back().first == v) {
    ans += sum - sta.back().second;
    sta.back().second++;
  } else {
    ans += sum;
    sta.push_back({v, 1});
  }
  sum++;
}
```


第二个方法是离散化，然后使用树状数组或线段树区间求和。  


比赛的时候，我是逆序处理，枚举左端点，统计右端点，使得问题非常复杂。  


枚举左端点时，就需要找到位置 i 右侧第一个小于 `nums[i]` 的位置 k。  
显然，k 右边的 j 都不可能是答案。  
故答案是 `(i,j)` 之间大于 `nums[i]` 的个数。  


如何找到第一个小于 `nums[i]` 的位置呢？  
树状数组/线段树+二分查找即可。  


```cpp
// 存在小于 v 的位置
int l = 1;
r = minVal.second;
while (l < r) {
  int m = (l + r) >> 1;
  if (segTree.QueryMin(1, m).first < v) {
    r = m;
  } else {
    l = m + 1;
  }
}
```


位置 k 确定后，如何计算区间内大于 `nums[i]` 的个数呢？  
区间的个数，可以转化为前缀差问题。  
故问题转化为了如何计算前缀中大于 `nums[i]` 的个数。  


```cpp
vector<tuple<ll, ll, ll>> tasks;
tasks.push_back({r - 1, v + 1, 1});  // 加上 [1, r) 的值都大于 v 的个数
if (i - 1 > 0) {
  tasks.push_back({i - 1, v + 1, -1});  // 减去 [1, i) 的值都大于 v 的个数
}
```


这类问题需要离线处理，把下标问题转化为值域问题。  
从而可以使用线段树计算 `[nums[i], maxVal]` 内的区间和。  


```cpp
sort(tasks.begin(), tasks.end());
int taskIdx = 0;
for (int i = 1; i <= n; i++) {
  segTree.Add(nums[i - 1], 1);
  while (taskIdx < maxTask && get<0>(tasks[taskIdx]) == i) {
    const auto [_, v, flag] = tasks[taskIdx];
    ll num = segTree.QuerySum(v, n + 1);
    ans += num * flag;
    taskIdx++;
  }
}
```


复杂度：`O(n log(n) log(n))`  
比赛期间我写了两个线段树，从而在第 993 个样例上超时了。  


优化：计算第一个小于 `nums[i]` 的位置，其实可以利用单调性。  
显然，前面遇到一个更小的数字时，后面的较大数字永远都不可能是答案。  
故维护单调栈，然后二分查找即可。  


```cpp
// 求位置 i 右侧第一个小于 v 的位置
int r = n + 1;
auto it = lower_bound(orderedQue.begin(), orderedQue.end(), make_pair(v, 0));
if (it != orderedQue.begin()) {  // 存在小于 v 的位置
  it--;
  r = it->second;
}
if (i + 1 == r) { 
  return;  // 剪枝
}
```


复杂度：`O(n log(n))`  


## 四、统计影子数对 II


题意：给一个数组，问存在多少二元组 `(i,j)`，满足 `nums[i]<nums[j]` 且不存在 `i < k < j` 使得 `nums[i] < nums[k] < nums[j]`。  


思路：值域分治+单调栈+二分  


一开始我比较了好久，看和第三题到底有啥区别。  
最后发现这里要求 `nums[k]` 不能夹在二元组中间，即不能是递增关系。  


这里枚举左端点与右端点都无法构造出合适的数据结构来解决这道题。  
最后发现需要使用值分治来解决。  


由于是值域分治，需要先进行离散化。  


```cpp
// 离散化，值域离散化到 [1,m]
int m;
void Init(vector<int>& nums) {
  unordered_map<int, int> mp;
  vector<int> sorted_nums = nums;
  sort(sorted_nums.begin(), sorted_nums.end());
  sorted_nums.erase(unique(sorted_nums.begin(), sorted_nums.end()), sorted_nums.end());
  m = sorted_nums.size();
  for (int i = 1; i <= m; i++) {
    int v = sorted_nums[i - 1];
    mp[v] = i;
  }
  for (auto& v : nums) {
    v = mp[v];
  }
}
```


然后将数组元素依次按值域划分为两部分，分情况讨论。  


```cpp
void Dfs(vector<int>& nums, int lowVal, int highVal) {
  int n = nums.size();
  if (n < 2 || lowVal == highVal) return;
  int mid = (lowVal + highVal) / 2;
  vector<int> left, right;
  for (int r = 0; r < n; r++) {
    const int v = nums[r];
    if (v <= mid) {
      left.push_back(v);
    } else {
      right.push_back(v);
      // solver(v)
    }
  }
  Dfs(left, lowVal, mid);
  Dfs(right, mid + 1, highVal);
}
```


显然，两个端点都在左半部或都在右半部的情况，可以递归处理。  
我们只需要处理左端点在左半部，右端点在右半部的情况。  
即，遇到一个右半部的端点时，计算答案。  


显然，左半部的端点都小于右半部，但需要排除 `k` 夹在中间的情况。  
故左半部的答案集合需要是单调递减的。  


```cpp
if (v <= mid) {
  while (!lowSta.empty() && nums[lowSta.back()] < v) {
    lowSta.pop_back();
  }
  lowSta.push_back(i);
  left.push_back(v);
}
```


对于右半部，需要找到小于 `nums[r]` 的最接近 r 的位置，称为 `p`。  
则 `[1,p]` 之间的左半部点都不可能是答案，因为满足 `nums[l] < nums[p] < nums[r]`。  


如何在右半部找到小于 `nums[r]` 的第一个位置呢？  
同样维护一个单调递增栈即可。  


```cpp
if (v <= mid) {
} else {
  while (!highSta.empty() && nums[highSta.back()] >= v) {
    highSta.pop_back();
  }
  if (highSta.empty()) {
    // 不存在比 v 小的元素夹在 lowSta 与 v 之间
    ans += lowSta.size(); 
  } else {
    int p = highSta.back();
    // 计算 [p,r] 区间的答案
  }
  highSta.push_back(r);
  right.push_back(v);
}
```


如何计算 `[p,r]` 区间有多少个元素在左半部呢？  
正常需要树状数组/线段树转化为值域区间和来计算。  


分析 `lowSta` 的性质，它本身是位置单调递增的。  
那直接在 `lowSta` 上二分 p 即可找到答案。  


```cpp
if (highSta.empty()) {
  // 不存在比 v 小的元素夹在 lowSta 与 v 之间
  ans += lowSta.size();  
} else {
  int p = highSta.back();
  ans += lowSta.end() - upper_bound(lowSta.begin(), lowSta.end(), p);
}
```


复杂度：`O(n log(n) log(n))`  


## 五、最后


这次比赛第四题比较难，值域分治的方法是第一次遇到。  
即使告诉你要值域分治，还涉及到两个单调栈与单调栈的二分，难度还是比较大的。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
