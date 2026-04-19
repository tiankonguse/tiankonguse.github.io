---
layout: post
title: leetcode 周赛 498
description: 数位DP
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2026-04-19 12:13:00
published: true
---


## 零、背景


这次比赛比较简单，第三题BFS，第四题数位DP。  


本场题型概览如下。  
A 题：前缀和。  
B 题：前缀和。  
C 题：BFS。  
D 题：数位DP。  


## 一、最小稳定下标 I


题意：给一个数组，前缀最大值减去后缀最大值如果小于等于K，则称为稳定值，求稳定值的最小下标。  


思路：前缀和  


预处理出前缀和与后缀和，然后计算出稳定值。  


## 二、最小稳定下标 II


与第一题一模一样。  


## 三、多源洪水灌溉


题意：给一个矩阵，若干位置有颜色值，每一秒有颜色值的位置会朝上下左右的空位置染色。  
如果同一个空位置同时被多个来源染色，则保留染色值最大的那一个。  
问最终矩阵各个位置的颜色值。  


思路：BFS  


染色的过程是逐层进行的，所以需要使用 BFS。  
数据结构：`queue<pair<x,y>>`  


```cpp
while (!q.empty()) {
  const auto [r, c] = q.front();
  q.pop();
  for (const auto& [dr, dc] : dirs) {
    const int nr = r + dr, nc = c + dc;
    if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
    if (ans[nr][nc] == 0) {  // 没有被染色过
      ans[nr][nc] = ans[r][c];
      q.emplace(nr, nc);
    }
  }
}
```


同时染色时需要保留最大的那个。  
故还需要记录一个层数，或者称为步长，或者称为时间戳。  
数据结构：`vector<vector<int>> steps;`


对于层数相同的染色，不能重复入队，只需要更新染色值。  


```cpp
// 没有被染色过
if (ans[nr][nc] == 0) {  
  ans[nr][nc] = ans[r][c];
  steps[nr][nc] = steps[r][c] + 1;
  q.emplace(nr, nc);
}
 // 同一时间被染色，选择颜色较大的
if (steps[nr][nc] == steps[r][c] + 1) { 
  ans[nr][nc] = max(ans[nr][nc], ans[r][c]);
}
```


## 四、统计网格路径中好整数的数目


题意：一个不大于`9*10^15`的数字，组成一个带前导零的16位数组，然后从高位开始每 4 位一行，组成一个 `4*4`的矩阵。  
然后告诉你三个向右与三个向下的方向，从而得到一个从左上角到右下角的路径。  
如果路径上的数字序列是非递减的，则称这个数字是好数字。  
问区间 `[l,r]` 内好数字的数量。  


思路：数位DP  


假设有一个函数 `f(x)` 可以求出 `[0,x]`的所有好数字。  
则区间 `[l,r]` 内的好数字等价于 `f(r) - f(l-1)`。  


题目中的路径是确定的，所以数字的位数也是确定的，且涉及 7 个位数，从高位到低位保持非递减。  
路径外的数字不需要遵循非递减这个性质。  


显然，可以从高位到低位枚举所有数字。  
枚举的过程中，如果在路径上，需要保持非递减的性质，如果不在路径上，则可以任意选择。  


下面是数位DP的模板。  


```cpp
string s;
ll cache[17][11][2];
ll Dfs(int pos, int preSelectVal, bool limit) {
  if (pos == 16) {
    return 1; // 出口
  }
  if (cache[pos][preSelectVal][limit] != -1) {
    return cache[pos][preSelectVal][limit];
  }
  int up = limit ? s[pos] - '0' : 9;
  ll ret = 0;
  for (int val = 0; val <= up; val++) {
    if (IsInpath[pos]) {
      // 路径上的点，必须大于等于前一个点的值
      if (val >= preSelectVal) {
        ret += Dfs(pos + 1, val, limit && val == up);
      }
    } else { 
      // 非路径上的点，都可以选择
      ret += Dfs(pos + 1, preSelectVal, limit && val == up);
    }
  }
  return cache[pos][preSelectVal][limit] = ret;
}
```


当然，上下界我们也可以一起实现。  


```cpp
string SL, SR;
ll cache[17][11][2][2];
ll Dfs(int pos, int preSelectVal, bool limitDown, bool limitUp) {
  if (pos == 16) {
    return 1;
  }
  if (cache[pos][preSelectVal][limitDown][limitUp] != -1) {
    return cache[pos][preSelectVal][limitDown][limitUp];
  }
  int down = limitDown ? SL[pos] - '0' : 0;
  int up = limitUp ? SR[pos] - '0' : 9;
  ll ret = 0;
  for (int val = down; val <= up; val++) {
    if (IsInpath[pos]) {
      if (val >= preSelectVal) {
        ret += Dfs(pos + 1, val, limitDown && val == down, limitUp && val == up);
      }
    } else {
      ret += Dfs(pos + 1, preSelectVal, limitDown && val == down, limitUp && val == up);
    }
  }
  return cache[pos][preSelectVal][limitDown][limitUp] = ret;
}
ll ans = Dfs(0, 0, true, true);
```


## 五、最后 


这次比赛题目比较简单，排名只有 92 名了。  
之前的比赛，每次我都是手动敲数位DP的。  
这次比赛我整理了自己的数位DP模板，下次应该就可以直接复制过来使用了吧。  


《完》。


-EOF-


本文公众号：天空的代码世界
个人微信号：tiankonguse
公众号 ID：tiankonguse-code
