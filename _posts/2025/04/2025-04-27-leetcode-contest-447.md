---
layout: post
title: leetcode 第 447 场算法比赛 - 状压+倍增  
description: 上班日还这么多人参赛  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateData: 2025-04-27 12:13:00
published: true
---

## 零、背景


这次比赛是上班日，没有参加比赛。  
现在已经休假了，做一下比赛。  


A: 分组+二分查找    
B: 并查集  
C: 状态压缩动态规划  
D: 倍增动态规划  


排名：无  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、统计被覆盖的建筑  

题意：给若干坐标，问有哪些坐标，上下左右四个方向都有建筑。  


思路：分组+二分查找  


分别对 x 坐标和 y 坐标分组，排序。  
然后枚举每个坐标，在 x 坐标和 y 坐标里二分查找，看自身是否在中间。  


```cpp
unordered_map<int, vector<int>> hx, hy;
for (auto& building : buildings) {
  int x = building[0], y = building[1];
  hx[x].push_back(y);
  hy[y].push_back(x);
}
for (auto& [x, ys] : hx) {
  sort(ys.begin(), ys.end());
}
for (auto& [y, xs] : hy) {
  sort(xs.begin(), xs.end());
}
for (auto& building : buildings) {
  int x = building[0], y = building[1];
  auto& hxy = hx[x];
  auto& hyx = hy[y];
  if (y != hxy.front() && y != hxy.back() && x != hyx.front() && x != hyx.back()) {
    ans++;
  }
}
```

## 二、针对图的路径存在性查询 I  


题意：给n个点，如果两点距离小于等于d，则可以连通。问两点之间是否存在路径。  



思路：并查集  


技巧：一个点距离在 d 范围内的点有很多，直接遍历会超时， 只需要对相邻的点进行合并即可。  


贪心：如果合并的两个点是随机的，需要使用并查集。  
这道题对点排序后，是连续一段的点需要合并在一起，所以直接遍历合并，指向第一个点即可。  


```cpp
for (int i = 0; i < n; i++) {
  pre[i] = i;
}
for (int i = 1; i < n; i++) {
  if (abs(nums[i] - nums[i - 1]) <= maxDiff) {
    pre[i] = pre[i - 1];
  }
}
for (int i = 0; i < queries.size(); i++) {
  int l = queries[i][0], r = queries[i][1];
  if (pre[r] == pre[l]) {
    ans[i] = true;
  }
}
```


## 三、判断连接可整除性  


题意：给n个数字，求一个排列，使得所有数字按十进制拼接在一起后得到的数字能整除 k。  
如果存在多个，求字典序最小的排列。  


思路：状态压缩动态规划  


取模有一些性质。  


1）`(a + b) % k = (a % k + b % k) % k`  
2) `(a * b) % k = (a % k * b % k) % k`


故，多个数字拼接时，可以从前到后两两拼接取模。  


状态定义：`dp[pre][mask]` 已选择数字拼接的前缀取模为 pre，剩余数字为 mask 的情况下，是否存在可以整除 k。   


状态转移方程： 枚举下一个数字，更新状态。  


```
int dfs(const int pre, const int mask) {
  int& ret = dp[pre][mask];
  if (ret != -1) return ret;
  if (mask == 0) {
    return ret = (pre == 0);
  }
  for (int i = 0; i < nums.size(); ++i) { // 按字典序枚举
    if(!(mask & (1 << i))) continue; // 前面已选择
    int nextPre = (pre * pow10[bits[i]] + nums[i]) % k;
    int nextMask = mask ^ (1 << i);
    if (dfs(nextPre, nextMask)) {
      path[pre][mask] = i; // 记录最优路径
      return ret = 1;
    }
  }
  return ret = 0;
};
```

## 四、针对图的路径存在性查询 II  


题意：给n个点，如果两点距离小于等于d，则可以连通。问两点之间是否存在路径，如果存在，求最短路。  


思路：倍增算法  


基本思路与第二题类似，排序。  
由于是求最短路径，每个边向前跳时需要尽量跳的远一些，故需要二分找到第一跳最远可以到达的点。  


如果想要判断一个点是否可以到达另外一个点，需要不断的向前跳，如果能跳到目标点或者超过目标点，则可以到达。  


默认每次查询的复杂度：`O(n)`  


优化：预处理每个点向前跳`2^0`，`2^1`，`2^2`，...，`2^k` 次的位置，则可以通过 `log(n)` 的时间跳到离目标点足够近。  
每个点都通过这个方法向前跳，则一次查询的综合复杂度可以降低为 `O(log(n))`  



如何得到一个点的前 `2^k` 次跳跃位置？  
假设当前点向前跳 `2^(k-1)` 次的位置已经计算为 x，则 `p(i, 2^k) = p(x, 2^(k-1))`。  
基于这个思想，可以通过 `O(n log(n))`的复杂度预处理出所有点的前 `2^k` 次跳跃位置。  


倍增初始化如下。  


```cpp
vector<vector<int>> dp(m, vector<int>(20, 0));
for (int i = 0; i < m; i++) {
  dp[i][0] = lower_bound(datas.begin(), datas.end(), datas[i] - maxDiff) - datas.begin();
  for (int j = 1; j < 20; j++) {
    dp[i][j] = dp[dp[i][j - 1]][j - 1];
  }
}
```


查询的时候有几个注意事项：  


1）查询位置相同，则不需要跳跃。  
2）有可能一次跳跃超过目标点，这个与跳跃无数次超过目标点无法区分。  
故无法到达目标点时，需要特殊判断，这样在处理跳跃时，我们需要跳到目标点的前一个位置。   


代码如下，跳的位置永远在目标点之前 `dp[r][j] > l`，最后再加 1 即可。  


```cpp
if (dp[r][19] > l) {  // 不联通，没答案
  result.push_back(-1);
  continue;
}
int ans = 0;
for (int j = 19; l < r && j >= 0; j--) {
  if (dp[r][j] > l) {
    ans += (1 << j);
    r = dp[r][j];
  }
}
ans++;
```


## 五、最后  


这次比赛难度加大了，第一题数据范围就很大，第二题贪心或并查集，第三题状态压缩，第四题倍增。  
后两题都属于高级算法了。  





《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
