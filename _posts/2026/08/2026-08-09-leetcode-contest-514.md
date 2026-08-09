---
layout: post  
title: leetcode 周赛 514 - 高级线段树  
description: 线段树复杂的节点值运算  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-08-09 12:13:00  
published: true  
---


## 零、背景


这次比赛最后一题涉及线段树的复杂计算，手速比较慢，比赛内没有通过最后一题。  


本场题型概览如下。  


A 题：贪心匹配。  
B 题：DFS。  
C 题：动态规划枚举。  
D 题：复杂值线段树。  


## 一、应用折扣后的最低总价


题意：给一些商品的价格，和一些优惠折扣，每个商品用一个优惠折扣，问怎么匹配，购买所有商品的价格才会最低。  


思路：贪心。  


显然，最贵的商品使用优惠力度最大的折扣。  
故都按逆序排序，逐个匹配即可。  


小技巧：可以使用 `rbegin` 和 `rend` 来逆序排序。  


```cpp
sort(prices.rbegin(), prices.rend());
sort(discounts.rbegin(), discounts.rend());
```


## 二、树的加权和


题意：给一个树，节点的权重为节点值与节点高度运算得到，公式 `nums[i] * (h - d + 1)`。  
求所有节点的权重之和。  


思路：递归。  


首先根据输入构造树的数据结构。  


```cpp
vector<vector<int>> tree(n);
for (int i = 1; i < n; i++) {
  int p = parent[i];
  tree[p].push_back(i);
}
```


然后递归计算每个节点的高度，与树的最大高度。  


```cpp
vector<ll> heights(n, 0);
ll maxHeight = 0;
auto DfsHeight = [&](auto&& self, int u, ll h) -> void {
  heights[u] = h;
  maxHeight = max(maxHeight, h);
  for (auto v : tree[u]) {
    self(self, v, h + 1);
  }
};
DfsHeight(DfsHeight, 0, 1);
```


最后，计算每个节点的权重，求和。  


```cpp
ll ans = 0;
for (int i = 0; i < n; i++) {
  ans += nums[i] * (maxHeight - heights[i] + 1);
}
return ans;
```


## 三、两个不重叠子正方形的最大面积


题意：给一个矩阵，需要划分出两个面积相等的不重叠的全 1 正方形。  
求可以划分的最大正方形的面积。  
数据范围：500。  


思路：动态规划。  


先考虑求一个最大的全 1 正方形，需要维护三个状态。  


状态 1：`col[i][j]` 在第 j 列，坐标 `(i,j)` 往上连续 1 的个数。  
状态 2：`row[i][j]` 在第 i 行，坐标 `(i,j)` 往左连续 1 的个数。  
状态 3：`dp[i][j]` 在坐标 `(i,j)` 为正方形右下角时可以组成的最大全 1 正方形的边长。  


状态转移方程：  


```cpp
int v = nums[i][j];
if(v > 0){
  col[i][j] = 1 + col(i-1, j);
  row[i][j] = 1 + row(i, j-1);
  dp[i][j] = max(dp(i-1,j-1), col(i-1, j), row(i, j-1));
}
```


复杂度：`O(n^2)`。  


现在是划分两个正方形，可以发现，两个正方形要么可以使用水平线划分，要么可以使用垂直线划分。  
所以，可以枚举分割线，然后分别求分割线一侧的最大正方形，两边再取最小值即可。  


```cpp
int ans = 0;
// 枚举水平分割线
for (int ni = 1; ni < n; ni++) {  // [0, ni) [ni, n)
  int tmp = min(GetRightDown(ni - 1, m - 1), GetLeftUp(ni, 0));
  ans = max(ans, tmp);
}
// 枚举垂直分割线
for (int mi = 0; mi < m; mi++) {  // [0, mi) [mi, m)
  int tmp = min(GetRightDown(n - 1, mi - 1), GetLeftUp(0, mi));
  ans = max(ans, tmp);
}
return ans * ans;
```


上面介绍了如何求右下角的最大正方形，同样的方法，求出四个角的最大正方形即可。  
复杂度：`O(n^3)`。  


优化：再新增一个状态 `dp2(i,j)` 为右下角 `(i,j)` 到左上角 `(0,0)` 所有全 1 正方形的最大边长。  
状态转移方程：  


```cpp
dp2(i,j) = max(dp2(i-1,j), dp2(i, j-1), dp(i,j));
```


此时，可以把复杂度降低到 `O(n^2)`。  


## 四、数组中的峰值 II


题意：给一个数组，当一个子数组中存在连续的三个数字，满足中间的数字大于两边的数字时，则把这个子数组称为峰值子数组。  
现在给一些修改操作，然后询问一个区间内存在多少个峰值子数组。  


思路：复杂值线段树。  


首先需要理解题意。  
一个子数组只要有一个峰值就是峰值子数组。  
假设区间内有一个峰值，峰值左边有 a 个数字，右边有 b 个数字，那么峰值子数组的个数为 `a*b`。  


故，若查询区间内有 m 个峰值，分别是 `p1,p2,...,pm`。  
我们需要不重复不遗漏地来统计子数组的个数。  


常见的策略是枚举右端点。  
此时可以发现，右端点在 `(p1,p2]` 的峰值子数组个数都是相同的，都是 `p1-L` 个。  
这些右端点的峰值子数组个数为 `(p2-p1)*(p1-L)`。  


同理，右端点在 `(p2,p3]` 的峰值子数组个数也是相同的，都是 `p2-L` 个。  
这些右端点的峰值子数组个数为 `(p3-p2)*(p2-L)`。  


最后一个区间右端点 `[pm,R)` 的峰值子数组个数也是相同的，都是 `pm-L` 个。  
对应的，这些右端点峰值子数组个数为 `(R-pm)*(pm-L)`。  


![](https://res2026.tiankonguse.com/images/2026/08/09/001.png)


所有的右端点峰值子数组个数求和，公式展开，可以发现右侧可以抵消为 `(R-p1)*L`。  
左侧除了最后一个区间，前面都满足 `(p[i+1]-p[i])*p[i]`。  


![](https://res2026.tiankonguse.com/images/2026/08/09/002.png)


故，我们需要使用线段树维护一些节点，每个节点的值为 `(p[i+1]-p[i])*p[i]`。  
这里定义线段树中第 pi 个峰值节点的值为 `(p[i+1]-p[i])*p[i]`。  


下面我们来看几个最难的地方。  


问题 1：如何找到相邻的峰值呢？  
可以存在 `set` 中，这样就可以通过二分查找找到下一个峰值的位置了。  


问题 2：变更一个值，该如何更新线段树呢？  
首先，更新一个值，例如位置 i，`i-1`、`i`、`i+1` 三个位置的峰值都可能发生变化。  


```cpp
vector<ll> ans;
ans.reserve(queries.size());
for (auto& qs : queries) {
  int op = qs[0];
  if (op == 1) {
    const int l = qs[1] + 1;
    const int r = qs[2] + 1;
    ans.push_back(Query(l, r));
  } else {
    const int index = qs[1] + 1;
    const int val = qs[2];
    Set(index, val);
    // 修改 index，影响 index-1, index, index+1
    Update(index - 1);
    Update(index);
    Update(index + 1);
  }
}
return ans;
```


其次，对于一个位置，如果是峰值，不仅需要更新自己的峰值，还需要更新前面一个峰值。  
因为每个峰值计算的结果依赖于下个峰值的位置。  


而一个位置不是峰值，可以假设是删除了峰值，此时前一个峰值的计算结果需要重新运算。  


```cpp
auto Update = [&](int i) {
  if (i <= 1 || i >= n) return;  // 不可能是峰值
  segTree.UpdateSet(i, 0);       // 先清空
  P.erase(i);
  if (Get(i) > Get(i - 1) && Get(i) > Get(i + 1)) {
    P.insert(i);
    auto it = P.lower_bound(i);
    if (it != P.begin()) {
      auto prev = it;
      prev--;
      segTree.UpdateSet(*it, F(*prev, *it));
    }
    auto next = it;
    next++;
    if (next != P.end()) {
      segTree.UpdateSet(*next, F(*it, *next));
    }
  } else {
    auto next = P.lower_bound(i);
    if (next != P.end() && next != P.begin()) {
      auto prev = next;
      prev--;
      segTree.UpdateSet(*next, F(*prev, *next));
    }
  }
};
```

查询时，按照推导的公式，加加减减即可。  


```cpp
auto Query = [&](ll l, ll r) -> ll {
  if (l + 1 >= r) return 0;  // 需要至少 3 个点
  auto itLeft = P.upper_bound(l);
  if (itLeft == P.end() || *itLeft >= r) return 0;
  // 此时，保证一定至少有一个峰值在 (l,r) 之间
  ll p1 = *itLeft;
  auto itRight = P.lower_bound(r);
  itRight--;
  ll p2 = *itRight;
  if (p1 == p2) {  // 只有一个峰值
    ll p = p1;
    return (p - l) * (r - p);
  }
  return segTree.QuerySum(p1 + 1, p2) + (r - p2) * p2 - (r - p1) * l;
};
```


处理正常的推导答案，还可以采取正难则反的思想。  
即先求出所有子数组，减去不满足情况的子数组。  


定义 `A(a,b)` 为求区间 `[a,b]` 内的子数组个数。  


不满足情况的子数组则是在与峰值无关的区间内选择子数组。  
故公式为 `A(L,R) - A(L,p1) - A(p1,p2) - ... - A(pm, R) + m`。  


![](https://res2026.tiankonguse.com/images/2026/08/09/003.png)


为啥要加 m 呢？  
因为相邻两个区间求子数组时，交点分别多计算一次，所以需要加回来。  


此时，定义线段树的节点 p1 的值为 `A(p1,p2)`。  
剩下的就与正推的逻辑一模一样了。  


```cpp
auto Query = [&](ll l, ll r) -> ll {
  if (l + 1 >= r) return 0;  // 需要至少 3 个点
  auto itLeft = P.upper_bound(l);
  if (itLeft == P.end() || *itLeft >= r) return 0;
  // 此时，保证一定至少有一个峰值在 (l,r) 之间
  ll p1 = *itLeft;
  auto itRight = P.lower_bound(r);
  itRight--;
  ll p2 = *itRight;
  if (p1 == p2) {  // 只有一个峰值
    ll p = p1;
    return (p - l) * (r - p);
  }
  ll all = F(l, r);  // 所有子数组个数
  ll leftPart = F(l, p1);
  ll rightPart = F(p2, r);
  ll midPart = segTree.QuerySum(p1 + 1, p2);
  ll m = segTree.QueryTop(p1, p2);  // 分割点分别多计算一次
  return all - leftPart - rightPart - midPart + m;
};
```


对了，如何统计一个区间峰值的个数呢？  
还是需要使用线段树来统计。  
这样看来，反着来也没简单多少。  


## 五、最后


这次比赛最后一题比较复杂，每个节点需要维护一个公式的值，而公式依赖相邻的峰值。  
这就导致很容易遗漏某个峰值的更新。  
最简单的方法是，对左右峰值都更新一下，只是常数复杂度，就可以确保不遗漏了。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
