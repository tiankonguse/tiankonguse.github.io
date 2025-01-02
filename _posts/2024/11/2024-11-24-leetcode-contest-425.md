---
layout: post  
title: leetcode 第 425 场算法比赛  
description: 树形 DP ，后悔贪心。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData: 2024-11-24 12:13:00  
published: true  
---


## 零、背景  


这次比赛最后一题比较难， 树形DP上进行后悔贪心 ，不容易理解。  


A: 枚举  
B: 字符串hash  
C: 标准DP  
D: 树形DP+后悔贪心  


排名： 66  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/425  


## 一、最小正和子数组


题意：给一个数组，问存在子数组长度在 `[l,r]`之间且子数组和大于0时 ，最小和是多少。  


思路1 ：暴力枚举子数组， 求和。  
复杂度：`O(n^2)`  


思路2 ：双指针  
假设当前位置为 p, 维护下标为 `[p+l-1, p+r)` 的前缀和的集合。  
二分查找这个集合查找大于 `sum[p-1]` 的最小元素。  


数据结构：`map`  
位置 p 转移: 删除 `sum[l+p-1]`，插入 `sum[p+r]`。  
二分查找: `map.upper_bound`  


复杂度：`O(n log(n))`  



## 二、重排子字符串以形成目标字符串  


题意：给两个字符串，问第一个字符串拆分为 k 个等长的子字符串，重新排序后是否可以组成第二个字符串。  


思路： 字符串hash  


逻辑：字符串可以重新排序，说明与位置无关，只关心统计结果。  
故两个输入字符串可以按规则分别拆分出 k 个等长字符串，看统计是否一致。  


比较的方法一般有两个，如下  


方法1 ：子字符串排序。  
方法2 ： `unordered_map`统计字符串。  


优化： k 字符串性排序比较性能较差， 可以 hash 为数字。  


## 三、最小数组和  


题意：给一个整数数组，可以进行 op1 次操作 1 ， op2 次操作2 ，问如何操作才能使数组和最小。  
操作1 ：选择一个数字， 向上取整除2。  
操作2 ：如果数字不小于 K ，减去 K。  
规则：每个操作对于每个下标， 只能操作1次。  


思路：动态规划。  


状态定义：`f(n,op1,op2)`  
含义：前 n 个数组，至少进行 op1 次操作1 和 op2 次操作2 的最优答案。  


状态转移方程：  


```cpp
v = nums[n]
f(n,op1,op2) = max(
    vn + f(n-1,op1,op2),
    Op1(vn) + f(n-1,op1-1,op2),
    Op2(vn) + f(n-1,op1,op2-1),
    Op12(vn) + f(n-1,op1-1,op2-1),
    Op21(vn) + f(n-1,op1-1,op2-1)
)
```


复杂度：`O(n^3)`  
空间优化：只依赖上一个数字，可以递推复用数组。  


## 四、移除边之后的权重最大和  


题意：给一个无向树，需要删除一些边，使得每个顶点的边数最多不超过 K 条。  
问如何操作，才能使得剩余的边权重和最大，输出最大值。  


思路： 典型的树形DP。  



随便找一个顶点当做根，先递归处理所有儿子，然后在处理当前节点。  


这里先看其中一个儿子是怎么处理的。  


如果边的个数没有大于 K ，儿子不需要删除边。  
如果边的个数大于K ，多少个，就需要删除多少个。  
显然，为了让剩余的边和尽量大，需要贪心从最小的边删除。  
所以需要对所有边按权重从小到大排序。  


如果与父节点相连的边需要被删除，则父节点就不需要考虑这条边，即假设这条边不存在。  


如果与父节点的边没有被删除，父节点删除边时，可能会删除这条边。  
此时，儿子的贪心策略就不是最优的了，因为儿子可以少删除一条边，而且是删除的边里最大的那个不需要删除了。  
这种操作称为后悔贪心。  


假设父节点相连的边权重为 WP ，儿子删除的边中最大权重为 WC。  
显然，`WP>=WC`，此时儿子才会贪心删除 WC 而没有删除 WP。  


儿子贪心计算时，累计删除的边之和为 `ans += WC`。  
父亲后悔时，需要做的操作是 `ans += WP - WC`。  


如果有两个儿子， 只需要删除1个儿子时， 显然是删除小的那个，即`min(WP1-WC1, WP2-WC2)`。  
如果有很多儿子，要删除若干个，显然需要多所有的 `WP_i-WC_i` 从小到大排序。  


可以发现，父节点贪心计算时，父节点与儿子的边权重由 `WP_i` 变成了 `WP_i-WC_i`。  
所以儿子递归计算时，计算出 `WP_i-WC_i` 替换边权重即可。  


总结一下，父节点和儿子的边存在两种关系：  


1、儿子未删除， 边更新为 `WP_i-WC_i`。  
2、儿子已经删除 ， 父节点可以忽略，其实也可以更新为 `WP_i-WP_i` ， 即权重设置为0。  


代码如下，写的还是比较简洁的。  


```cpp
ll Dfs(const int u, const int pre, const ll W) {
  auto& childs = g[u];
  for (auto& [w, v] : childs) {
    if (v == pre) continue;
    w = Dfs(v, u, w);
  }
  if (int(childs.size()) <= k) {  // 不需要删除
    return W;
  }
  sort(childs.begin(), childs.end());
  childs.resize(childs.size() - k);  // 删除 [0, childNum-k)
  for (auto [w, v] : childs) {       //
    ans += w;
  }
  return max(W - childs.back().first, 0ll);
}
```


## 五、最后  


这次比赛最后一题有点难，直接贪心存在反例，所以在儿子贪心存在反例时，父亲需要对这个反例进行兼容，很有意思。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  