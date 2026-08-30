---
layout: post  
title: leetcode 周赛 517 - 分组背包  
description: 分组背包  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-08-30 12:13:00  
published: true  
---


## 零、背景


这次比赛比较简单，最后两道题还一模一样，核心算法不变，输入的构造调整下就可以通过了。  


本场题型概览如下。  


A 题：统计。  
B 题：快速幂。  
C 题：背包。  
D 题：BFS+背包。  


## 一、统计特殊整数个数


题意：给一个数组，问哪些数字在数组中的位置是连续的。  


思路：统计  


分别统计每个值出现的个数、左边界、右边界。  
然后计算左右边界内的数字是否等于出现的个数。  


```cpp
for (int i = 0; i < n; i++) {
  cnt[nums[i]]++;
  if (leftPos.find(nums[i]) == leftPos.end()) {
    leftPos[nums[i]] = i;
  }
  rightPos[nums[i]] = i;
}
int ans = 0;
for (auto [v, c] : cnt) {
  int l = leftPos[v];
  int r = rightPos[v];
  if (r - l + 1 == c) {
    ans++;
  }
}
return ans;
```


## 二、解码值之和


题意：给一个数组，每个值都是二元组 `(x,y)` 编码后的值。  
编码规则：假设数组的值为 v，最低位为宽度 `w=v%10`，其余位为 `d=floor(v / 10)`。  
x 的值为 d 的前 w 个数字，即 `x = d[0:w]`。  
y 的值为 d 的其余数字，即 `y=d[w:]`。  
求解码后所有 `x^y` 的之和。  


思路：快速幂  


按题意解码出 x 与 y，然后计算快速幂。  


```cpp
const ll w = v % 10;
const ll d = floor(v / 10);
const string s = to_string(d);
ll bit = s.size();
ll x = 0; // [0,w)
for (int i = 0; i < w; i++) {
  x = x * 10 + (s[i] - '0');
}
ll y = 0; // [w,bit)
for (int i = w; i < bit; i++) {
  y = y * 10 + (s[i] - '0');
}
ll V = qpow(x, y, mod);
ans = (ans + V) % mod;
```


## 三、构造子集和的最少操作次数 I


题意：给一个数组，每个数字可以操作变为其他数字，问最少操作多少次才能使得数组的一个子集之和等于 sum。  


操作：
1）选择一个数字乘以2。  
2）选择一个数字除2取整。  


要求：对于同一个位置，如果有乘法与除法，乘法必须在前面。  


数据范围：  
数组大小：100  
值大小：500  
sum 大小：5000  



思路：分组背包  


首先注意要求，乘法在除法前面，乘与除抵消，意味着只能乘或者只能除，从而扩展出所有数字。  
故，一个数字最多可以扩展出 `log(V)` 个数字。  


```cpp
g.resize(n);
for (int i = 0; i < n; i++) {
  const int v = nums[i];
  g[i].push_back({v, 0});
  for (int V = v * 2, t = 1; V <= sum; V *= 2, t++) {
    g[i].push_back({V, t});
  }
  for (int V = v / 2, t = 1; V > 0; V /= 2, t++) {
    g[i].push_back({V, t});
  }
  sort(g[i].begin(), g[i].end());
}
```


之后就是经典的分组背包了。  
背包大小为 sum，每个数字一个分组，分组内有 `log(V)` 个数字。  


状态定义：`dp[i][sum]`  
含义：前 i 个分组，得到 sum 的最少操作次数。  


状态转移方程：  


```cpp
dp(i,sum) = min(dp(i-1,sum), dp(i-1, sum - vj) + tj);  
```

解释：这个分组最多选择一个，所以分为不选择与选择某一个。  
不选择就是 `dp(i-1, sum)`。  
选择一个 `(vj, tj)`，其中 vj 是数字，tj 是得到这个数字的操作次数，则只能从上个状态 `dp(i-1, sum-vj)` 转移过来。  


复杂度：`O(n*sum*log(V))`  


```cpp
vector<vector<int>> dp;
vector<vector<pair<int, int>>> g;  // <val, times>
// dp[0][0] = 0;

int Dfs(int i, int sum) {
  int& ret = dp[i][sum];
  if (ret != -1) return ret;
  ret = MaxVal;
  if (i == 0) {
    return ret;  // 只有 dp[0][0] 合法
  }
  // 不选择
  ret = min(ret, Dfs(i - 1, sum));
  for (auto [v, t] : g[i - 1]) {
    if (v > sum) break;
    ret = min(ret, Dfs(i - 1, sum - v) + t);
  }
  return ret;
}
```


## 四、构造子集和的最少操作次数 II


题意：同第三题，没有乘法在除法前面的限制。  


思路：BFS + 分组背包。  


可以发现，解除限制后，只是得到每组数字的方法变了。  
原先数字是向上乘2与向下除2，得到的是一条链。  


解除限制后，奇数向下除二后再向上乘二可以得到新的数字。  
所以不断扩展，得到的是一个树。  



![](https://res2026.tiankonguse.com/images/2026/08/30/001.png)


要得到这些数字，并计算每个数字的最小操作次数，最简单的方法是使用 BFS 来搜索。  


```cpp
int maxVal;
void Bfs(const int i, const int v, const int sum) {
  queue<pair<int, int>> que;
  auto Add = [&](int V, int t) {
    if (V == 0 || V > maxVal) return;
    if (lastPos[V] == i) return;
    lastPos[V] = i;
    g[i].push_back({V, t});
    que.push({V, t});
  };
  Add(v, 0);
  while (!que.empty()) {
    auto [v, t] = que.front();
    que.pop();
    Add(v * 2, t + 1);
    Add(v / 2, t + 1);
  }
}
```

实际上，根据这个图，我们也可以直接不重不漏的构造出所有数字。  
即向下除2时，判断是否是奇数，是奇数了，乘2就可以得到新的分支。  


```cpp
void Add(int i, int v, int sum, int t) {
  if (v == 0) return;
  for (int V = v; V <= sum; V *= 2, t++) {
    g[i].push_back({V, t});
  }
}
for (int i = 0; i < n; i++) {
  const int v = nums[i];
  Add(i, v * 2, sum, 1);
  for (int V = v, t = 0; V > 0; V /= 2, t++) {
    g[i].push_back({V, t});
    if (V % 2 == 1) {
      Add(i, V / 2 * 2, sum, t + 2);
    }
  }
  sort(g[i].begin(), g[i].end());
}
```


## 五、最后


这次比赛题目比较简单，最后两道题算法还一样，算是只有三道题了。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
