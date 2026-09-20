---
layout: post  
title: leetcode 周赛 520  
description: 贪心构造  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-09-21 12:13:00  
published: true  
---


## 零、背景


这次比赛中秋调休加班，所以没有参加比赛。  
赛后做了一下，都不难。  


本场题型概览如下。  


A 题：暴力。  
B 题：线段树。  
C 题：特殊的最小子数组和。  
D 题：构造+链表。  


## 一、统计相交区间对 I  


题意：给若干区间，问有多少个区间二元组，区间存在交集。  
数据范围：100  


思路：暴力判断。  


判断小技巧：先保证第一个区间的左端点不大于第二个区间的左端点，之后只需要判断第一个区间的右端点是否大于第二个区间的左端点。  


## 二、统计相交区间对 II  


题意：同第一题。  
数据范围：`10^5`  


思路：线段树。  


根据第一题提到的小技巧，假设已经保证前面区间的左端点都不大于后面区间的左端点。  
那么对于一个区间，问题就转化为前面的区间中，有多少右端点大于等于当前区间的左端点。  


区间查询问题，使用线段树区间求和即可。  
复杂度：`O(n log(n))`  


如何保证左端点满足要求呢？  
按左端点排序即可。  


```cpp
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {  //
  return a[0] < b[0];
});
```


端点的数据范围很大怎么处理呢？  
离散化即可。  


```cpp
vector<int> points;
points.reserve(n * 2);
for (auto& v : intervals) {
  points.push_back(v[0]);
  points.push_back(v[1]);
}
sort(points.begin(), points.end());
points.erase(unique(points.begin(), points.end()), points.end());
unordered_map<int, int> mp;
int m = points.size();
for (int i = 0; i < m; i++) {
  mp[points[i]] = i + 1;
}
```


如何查询大于等于的个数呢？  
查询到最后一个数字即可。  


```cpp
segTree.Init(m);
segTree.Build();
ll ans = 0;
for (auto& v : intervals) {
  int l = mp[v[0]];
  int r = mp[v[1]];
  ans += segTree.QuerySum(l, m);
  segTree.Update(r, 1);
}
return ans;
```


## 三、一个子数组循环移动后的最大脉冲值  


题意：给一个数组，奇数位置是加法，偶数位置是减法。  
现在可以选择一个子数组，循环左移一位。  
问最多操作一次，可以得到的最大数组和。  


思路：区间最小和。  


分析循环左移一位，可以发现如果子数组长度是奇数，则去掉第一个位置，使得剩余的子数组为偶数后，答案不变。  
故可以要求选择的子数组长度都为偶数。  


假设一个子数组是最优答案，显然，最左边的两个之和肯定是负数，否则去掉这两个数字的子数组会更优。  
此时就可以发现，需要把相邻的元素两两组合。  


但是组合的第一个数字算奇数位置还是偶数位置呢？  
由于不知道谁是最优答案，枚举两种情况。  


```cpp
ll minVal = min(MinValue(nums, 0), MinValue(nums, 1));
```


之后，按两两组合计算最小子数组和。  


```cpp
ll MinValue(vector<int>& nums, int offset) {
  int n = nums.size();
  ll minVal = 0;
  ll preSum = 0;
  ll flag = offset == 0 ? 1 : -1;
  for (int i = offset; i + 1 < n; i += 2) {
    ll v1 = nums[i] * flag;
    ll v2 = nums[i + 1] * (-flag);
    preSum += v1 + v2;
    minVal = min(minVal, preSum);
    if (preSum > 0) {
      preSum = 0;
    }
  }
  return minVal;
}
```


得到的最小数字和肯定是负数，翻转后得到正整数。  
因此最终的和会翻两倍。  


```cpp
ll sum = 0;
int flag = 1;
for (ll v : nums) {
  v *= flag;
  flag = -flag;
  sum += v;
}
ll minVal = min(MinValue(nums, 0), MinValue(nums, 1));
return sum - minVal * 2;
```


## 四、字典序最大的答案数组  


题意：给一个数组，依次统计每个二进制位上，从第一个数字开始，最多连续二进制 1 的个数，从而得到一个长度为位数的计数数组。  
现在可以对数组任意的排列组合，问计数数组字典序最大是多少。  


思路：构造+链表。  


想要字典序最大，显然第一个数字越大越好。  
故需要对元素数组分成两组，第一组最高位全是1，对应计数答案，第二组最高位全是0。  
显然，后续第二组的元素不能在第一组的前面。  


对于下一位，分几种情况。  
如果第一组内都是0，则这一位的计数为 0。  
如果第一组内部分是 1，部分是 0，则需要拆分两个子分组，前面的全是1，对应计数答案，后面的全是 0。  
如果第一组内都是1，则还需要看第二个分组，逻辑是递归的，从而累计计算计数答案。  


有了上面的分情况讨论，可以发现存在一个分组分裂为两个分组的情况。  
这就需要维护一个链表了。  


```cpp
struct Link {
  int left = 0, right = 0;
  int next = -1;
} links[20];
int linkOffset = 0;
int Alloc() { return linkOffset++; }
```


还需要封装一个分裂函数。  


```cpp
// [left, mid) [ mid, right)
int Split(int id, int mid) {
  int newId = Alloc();
  links[newId] = links[id];
  links[id].right = mid;
  links[id].next = newId;
  links[newId].left = mid;
  return newId;
}
```


之后，按题目要求，从高位到低位计算答案，边计算，边分裂区间。  


```cpp
int n = nums.size();
vector<int> ans(15);
int root = Alloc();
links[root].left = 0;
links[root].right = n;
for (int i = 0; i < 15; i++) {
  const int b = 14 - i;
  ans[i] = Count(root, b, nums);
}
return ans;
```


计数过程就是上面的分情况讨论。  
先对分组内的元素排序，然后判断要不要分裂。  


```cpp
bool HasBit(int v, int b) { return (v & (1 << b)) != 0; }
int Count(int root, const int b, vector<int>& nums) {  //
  int cnt = 0;
  while (root != -1) {
    // 属于一个 block，高位全部相同
    int left = links[root].left;
    int right = links[root].right;
    sort(nums.begin() + left, nums.begin() + right, [&b](int A, int B) {  //
      A = A & (1 << b);
      B = B & (1 << b);
      return A > B;
    });
    if (!HasBit(nums[left], b)) {
      // 第一个就不是 1，不需要拆分
      break;
    }
    if (!HasBit(nums[right - 1], b)) {
      // 最后一个不是 1，需要拆分
      // 可以二分，但都排序了，这里枚举也不过分
      for (int i = left; i < right; i++) {
        int v = nums[i] & (1 << b);
        if (v == 0) {
          Split(root, i);
          return cnt;
        }
        cnt++;
      }
    } else {
      cnt += right - left;
      root = links[root].next;
    }
  }
  return cnt;
}
```


复杂度：`O(n log(n) log(n))`  


错误的贪心1：每个元素的高位其实已经可以做到隔离性。  
故直接按高位排序即可。  


```cpp
sort(nums.begin(), nums.end(), [&b](int A, int B) {  //
  A = (A >> b) << b;
  B = (B >> b) << b;
  return A >= B;
});
```


错误的贪心2：依次从低位到高位排序。  


```cpp
for (int i = 0; i < 15; i++) {
  stable_sort(nums.begin(), nums.end(), [&](int a, int b) {
    a = a & (1 << i);
    b = b & (1 << i);
    return a > b;
  });
}
```


反例：`[2,11,4]`。  


## 五、最后  


这次比赛最后一题很容易想到两种错误的贪心，从而被卡住。  
因为贪心无法保证分裂的各组互相隔离这个性质。  


看榜单过四道题的不超过100人，应该都是被错误贪心卡住了。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
