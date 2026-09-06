---
layout: post  
title: leetcode 周赛 518  
description: 网格DP  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-09-08 12:13:00  
published: true  
---


## 零、背景


这次比赛比较简单，但是我小错误比较多，没进去前百名。  


本场题型概览如下。  


A 题：模拟。  
B 题：前缀和。  
C 题：贪心。  
D 题：网格DP。  


## 一、恰好有 K 对相等相邻字符的循环移位数量


题意：给一个字符串，循环右移可以得到 n 个不同的字符串，问有多少个字符串恰好有 k 个相邻位置相等。  


思路：模拟  


按题意循环右移，然后暴力判断相邻位置相等的数量。  
复杂度：`O(n^2)`  


优化：复用上一次的信息。  


每次右移，只有最左边与最右边的相邻位置发生变化。  
具体来说，左边少了一个元素，可能会少一个相等的相邻位置。  
右边多了一个元素，可能会多一个相等的相邻位置。  
进行判断即可。  
复杂度：`O(n)`  


```cpp
int countRotations(string s, const int K) {
  int n = s.size();
  s = s + s;
  int k = 0;
  for (int i = 1; i < n; i++) {
    if (s[i] == s[i - 1]) k++;
  }
  int ans = 0;
  for (int i = 0; i < n; i++) {
    if (s[i] == s[i + 1]) k--;
    if (s[i + n] == s[i + n - 1]) k++;
    if (k == K) ans++;
  }
  return ans;
}
```


## 二、统计好循环移位的数量


题意：给一个数组，循环右移可以得到 n 个不同的数组，问有多少个数组左一半的元素和严格大于后一半的元素和。  


思路：前缀和  


与第一题一样，数组翻倍，计算出前缀和。  
然后枚举所有循环右移的数组，计算左右区间和，比较即可。  


```cpp
int ans = 0;
for (int i = 0; i < n; i++) {
  if (2 * (preSum[i + n / 2] - preSum[i]) > sum) ans++;
}
return ans;
```


## 三、统计机器人组数


题意：给 n 个机器人的起始位置和向右的速度，以及一个合并最大间距 D，问最后剩余几个机器人。  
合并条件：如果两个机器人距离小于等于 D，则进行合并，合并后位置和速度继承右侧的机器人。  
同时满足条件时，同时进行合并，没有先后顺序。  


思路：贪心  


同时满足条件时需要同时合并，从而可以推导出，合并必须从左到右进行。  
可以先按距离对初始条件合并一轮，剩下的机器人在第 0 时刻就不满足合并条件了。  


```cpp
vector<pair<ll, ll>> sta1;
for (int i = 0; i < n; i++) {
  const ll p = position[i];
  const ll s = speed[i];
  while (!sta1.empty() && sta1.back().first + D >= p) {
    sta1.pop_back();
  }
  sta1.push_back({p, s});
}
```


可以思考：对于剩下的机器人，什么时候两个机器人才会发生合并？  
答案是左边的机器人速度大于右边的机器人时，必然会触发合并。  
如果左边机器人的速度不大于右边机器人的速度，则永远无法触发合并。  


```cpp
vector<pair<ll, ll>> sta2;
for (const auto [p, s] : sta1) {
  while (!sta2.empty() && sta2.back().second > s) {
    sta2.pop_back();
  }
  sta2.push_back({p, s});
}
return sta2.size();
```


## 四、至多 K 次转向的最小路径代价


题意：给一个网格，最多转向 k 次，问从左上角到达右下角的最小代价。  
代价：路径之和，同一个位置经过多次时需叠加多次。  


思路：网格DP  


状态定义：`dp[x][y][k][dir]`  
含义：从左上角到达位置 `(x,y)` 累计转向了 k 次，当前方向为 dir 的最小代价。  


状态转移方程：枚举四个方向。  


```cpp
min_queue<tuple<int, int, int, int, int>> que;  // <cost, x, y, k, dir>
int ans = INT_MAX;
auto Add = [&](int cost, int x, int y, int k, int dir) {
  if (x < 0 || x >= n || y < 0 || y >= m || k > K) return;
  int& ret = flag[x][y][k][dir];
  cost += grid[x][y];
  if (ret != -1 && ret <= cost) return;
  ret = cost;
  que.push(make_tuple(ret, x, y, k, dir));
  if (x == n - 1 && y == m - 1) ans = min(ans, ret);
};
for (int i = 0; i < 4; i++) {
  Add(0, 0, 0, 0, i);
}
while (!que.empty()) {
  auto [cost, x, y, k, dir] = que.top();
  que.pop();
  for (int i = 0; i < 4; i++) {
    if (i == dir) {
      Add(cost, x + Next[i][0], y + Next[i][1], k, i);
    } else {
      Add(cost, x + Next[i][0], y + Next[i][1], k + 1, i);
    }
  }
}
if (ans == INT_MAX) ans = -1;
return ans;
```


## 五、最后


这次比赛比较简单，第三题贪心的特征很容易发现，第四题就是最初级的网格DP。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
