---
layout: post  
title: leetcode 周赛 513 - 离散化线段树  
description: 前缀中小于N的个数，带计数的数据结构  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-08-02 12:13:00  
published: true  
---


## 零、背景

这次比赛题目不难，但是第二题与第四题一摸一样，我就把代码复制过来了，然后就被卡在第 599/601 个数据了。  
比赛期间调试半小时没找到原因，赛后发现第四题返回值是 long long，int 改 long long 就过了。  


本场题型概览如下。  


A 题：枚举二元组。  
B 题：枚举子数组。  
C 题：二分。  
D 题：离散化线段树。  


## 一、数对的最大强度

题意：给一个数组，问两个不同的下标组成二元组，计算出一个强度值，求最大强度值。  
数据范围：1000  


思路：枚举二元组  


```cpp
long long maxPairStrength(vector<int>& nums) {
  ll ans = 0;
  int n = nums.size();
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      ll a = nums[i];
      ll b = nums[j];
      ll g = gcd(a, b);
      ans = max(ans, a / g * b / g);
    }
  }
  return ans;
}
```

## 二、按奇偶比统计子数组 I

题意：给一个数组，问存在多少个子数组，满足奇数个数大于0，且偶数个数与奇数个数的比例不大于 `a/b`。  
要求：比例需要精确计算  


思路：枚举子数组  


精确计算，需要把除法转换为乘法。  
枚举子数组时，可以依靠前缀和来快速从前一个子数组的统计信息得到下个子数组的统计信息，转移复杂度 `O(1)`。  


```cpp
int countRatioSubarrays(vector<int>& nums, int a, int b) {
  int n = nums.size();
  ll ans = 0;
  for (int i = 0; i < n; i++) {
    int x = 0;  // 偶数的个数
    int y = 0;  // 奇数的个数
    for (int j = i; j < n; j++) {
      if (nums[j] % 2 == 0) {
        x++;
      } else {
        y++;
      }
      if (y > 0 && x * b <= y * a) {
        ans++;
      }
    }
  }
  return ans;
}
```

## 三、统计每个班次结束后的未完成任务数

题意：给一个任务数组与班次数组。  
任务数组含义是每个任务的所需时间。  
班次数组代表一个可用时长，只要时间可用，就可以不断的处理下个任务。  


任务处理规则如下：  
1）任务必须从左到右依次处理。  
2）如果一个任务在一个班次没有处理完，需要记录处理进度，在下个班次接着处理。  
3）如果一个班次完成了最后一个任务，则这个班次立刻结束。下个班次从第0个任务开始处理。  
问每个班次结束时，剩余多少个任务待完成。  


数据范围：  
任务个数： `10^5`  
班次个数：`10^5`  
任务时长：`10^9`  
班次时长：`10^9`  


思路：二分查找  


很容易想到模拟。  
但是一个班次的时长就很长，处理一个班次可能直接处理到最后一个任务。  
复杂度：`O(n^2)`  


优化：确定一个任务的剩余时长与班次，如何快速找到可以连续处理多少个任务了？  
如果知道后续每个任务到当前任务的前缀和，则可以二分查找找到这个边界。  


对于第一个任务比较特殊，可能上个班次已经处理了部分了。  
所以，对于第一个任务，可以特殊判断。  


剩余的就可以利用前缀和来二分查找，从而确定可以处理到第几个任务。  


```cpp
vector<int> ans(sn);  // 剩余未完成的任务数
int preTaskId = 0;
int preTaskLeftTime = tasks[0];
for (int i = 0; i < sn; i++) {
  ll shift = shifts[i];
  // preTaskId 可能不完整，单独计算
  if (shift < preTaskLeftTime) {
    preTaskLeftTime -= shift;
    ans[i] = tn - preTaskId;
  } else {
    shift -= preTaskLeftTime;
    ll findSum = taskPrefixSum[preTaskId] + shift;
    preTaskId = upper_bound(taskPrefixSum.begin(), taskPrefixSum.end(), findSum) - taskPrefixSum.begin();
    ans[i] = tn - preTaskId;
    if (preTaskId == tn) {
      preTaskId = 0;
      preTaskLeftTime = tasks[preTaskId];
    } else {
      preTaskLeftTime = taskPrefixSum[preTaskId] - findSum;
    }
  }
}
return ans;
```

## 四、按奇偶比统计子数组 II

题意：与第二题一摸一样。  
数据范围：`10^5`  


思路：离散化线段树  


数据范围很大，又是子数组统计，显然需要利用前缀和，快速判断有多少个前缀满足答案。  


假设第一个位置的奇偶个数为 `(x0,y0)`，第二个位置的奇偶个数为 `(x1,y1)`。  
则子数组的奇偶个数为 `(x1-x0, y1-y0)`。  


按照题目要求，需要满足 `y > 0 && x / y <= a / b`。  
代入得，如下：  


```cpp
y1-y0 > 0
(x1-x0) / (y1-y0) <= a / b
(x1-x0) * a <= (y1-y0) * b
x1 * a - x0 * a <= y1 * b - y0 * b
y0 * b - x0 * a  <= y1 * b - x1 * a 
```

可以发现，左右两边公式都一样，都是 `y*b-x*a`。  
故可以预处理前缀的 `y*b-x*a`, 判断前缀有多少个满足小于等于的关系。  


前缀小于等于的查询，需要使用带计数的平衡树，比较复杂。  
这时候，我们可以使用离散化线段树，把计数问题转化为前缀和求和。  


```cpp
ll countRatioSubarrays(vector<int>& nums, ll a, ll b) {
  Init(nums, a, b); // 离散化
  int n = nums.size();
  ll ans = 0;
  segTree.Init(n + 1);
  segTree.Build();
  ll val = 0;
  segTree.Add(H[0], 1); // 确保整个前缀也可以查询
  for (int i = 0; i < n; i++) {
    if (nums[i] % 2 == 0) {
      val -= b;
    } else {
      val += a;
    }
    ll offset = H[val];
    ans += segTree.QuerySum(1, offset);
    segTree.Add(offset, 1);
  }
  return ans;
}
```

思考：还需要满足 `y1-y0 > 0`，是否会导致把相等的情况计算在内。  
可以证明，不存在这样的情况。  


当 `y1 == y0`时，要满足 `- x0 * a  <= - x1 * a `，必须 `x1 <= x0`。  
而前缀中，x 是递增的，且 x0 永远小于 x1，只有相同点才会 x 与 y 同时相等。  


## 五、最后


这次比赛对我来说都不难，只看比赛的话，第三题二分，第四题离散化线段树，有点难度。  
而第四题我复制第二题的代码，导致返回值是 int，从而导致倒数第二组没有通过，被坑了。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
