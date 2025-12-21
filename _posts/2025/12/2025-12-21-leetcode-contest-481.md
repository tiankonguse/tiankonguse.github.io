---
layout: post
title: leetcode 周赛 481 - 树形DP
description: 树形DP出现的频率好高
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-12-21 12:13:00
published: true
---

## 零、背景


这次比赛最后一题是经典的树形DP，整体难度不算高，本篇主要记录四道题的解题思路。  


A: 简单计算  
B: 枚举统计  
C: 贪心+优先队列  
D: 树形DP  


下面按题号依次简单记录一下解题思路。  


**最终排名**：124  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、整数的镜像距离


题目：给一个数字，求 `abs(n - reverse(n))`。  


思路：按题意翻转与求差值的绝对值即可。  



## 二、使所有字符相等的最小删除代价


题意：字符串的每个字符有一个删除代价，问如何使用最小代价删除字符，使得所有字符相等。  


思路：枚举统计  


枚举剩余的字符，计算删除代价，取最小值。  


剩余的字符都相等，显然，与最后保留的字符相等的字符一个都不能删除。  
换言之，与最后保留字符不相等的字符都需要删除。  


计算方法是使用总代价减去剩余字符的代价，就是删除的代价。  


```cpp
vector<ll> stat(26, 0);
ll sum = 0;
for (int i = 0; i < n; i++) {
  stat[s[i] - 'a'] += cost[i];
  sum += cost[i];
}
ll ans = sum;
for (int i = 0; i < 26; i++) {
  ans = min(ans, sum - stat[i]);
}
return ans;
```


## 三、避免禁用值的最小交换次数


题意：给 n 个二元组，每次可以选择两个二元组交换第一个数字，问最少需要几次交换，使得所有二元组的两个数字都不相等。  


思路：贪心+优先队列  


首先，需要将二元组相等的数字进行统计，得到每个数字对应的二元组有多少个。  


```cpp
unordered_map<int, int> H1;
for (int i = 0; i < n; i++) {
  int a = A[i], b = B[i];
  if (a == b) {
    H1[a]++;
  }
}
if (H1.empty()) return 0;
```


贪心方法：优先选择二元组数量最多的两个数字进行交换。  


```cpp
max_queue<pair<int, int>> que;
for (auto [val, cnt] : H1) {
  que.push({cnt, val});
}

while (que.size() >= 2) {
  auto [cnt1, val1] = que.top();
  que.pop();
  auto [cnt2, val2] = que.top();
  que.pop();
  cnt1--;
  cnt2--;
  if (cnt1 > 0) que.push({cnt1, val1});
  if (cnt2 > 0) que.push({cnt2, val2});
  ans++;
}
if (que.empty()) return ans;
```


最后如果还有二元组 `lastCnt, lastVal`，再从不相等的二元组里面去尝试交换。  
这时候需要满足二元组的值都不等于 `lastVal`。  


```cpp
for (int i = 0; i < n; i++) {
  int a = A[i], b = B[i];
  if (a == b || a == lastVal || b == lastVal) continue;
  lastCnt--;
  ans++;
  if (lastCnt == 0) return ans;
}

return -1;
```


时间复杂度：`O(n log n)`  


优化：不同的数字两两抵消，如果最后还有剩余，肯定是原先次数最多的那个数字。  
所以不需要使用优先队列来模拟，直接根据计数判断是否可以全部抵消即可。  


什么时候可以全部抵消？  
当其他数字的个数大于等于次数最多数字的个数时，就可以全部抵消。  


```cpp
// 计算总个数与次数最多的数字的个数
int sameSum = 0;
int maxVal = 0;
int maxCnt = 0;
for (auto [val, cnt] : H1) {
  sameSum += cnt;
  if (cnt > maxCnt) {
    maxCnt = cnt;
    maxVal = val;
  }
}

// 可以两两消除
if (maxCnt <= sameSum - maxCnt) { 
  return (sameSum + 1) / 2;
}


ans += (sameSum - maxCnt);
maxCnt -= (sameSum - maxCnt);
```

时间复杂度：`O(n)`  


## 四、树上分组的交互代价总和


题意：给一棵无根树，每个节点属于一个分组。  
要求所有分组内，两两节点之间路径长度（边数）的总和。  


思路：树形 DP。  


如果枚举同一分组内的两两节点，二元组数量是 `O(n^2)`，再结合 `LCA` 计算距离，时间复杂度是 `O(n^2 * log n)`，显然无法通过。  
因此不能直接两两枚举，而是要把同一分组内的节点一起统计。  


先考虑固定一棵根树，求“根节点到所有同组节点的边数之和”。  
可以发现，这个量是递归可拆分的。  
即先自底向上计算每个儿子子树内，各分组的节点个数和到这些节点的边数之和；设除根节点外，同一分组的节点个数为 cnt，则儿子到根节点的那一条边会被走 cnt 次，需要把它累加进去。  


```cpp
vector<vector<pair<int, ll>>> gg;  // <cnt, sum>
void DfsInit(int u, int p) {
  gg[group[u]][u] = {1, 0};
  for (int v : g[u]) {
    if (v == p) continue;
    DfsInit(v, u);
    for (int i = 0; i < 20; i++) {  // u 为根的答案
      const auto [vCnt, vSum] = gg[i][v];
      auto& [uCnt, uSum] = gg[i][u];
      uCnt += vCnt;
      uSum += vSum + vCnt;
    }
  }
}
```

再考虑把根转移到其中一个儿子上。  
此时，需要把对应的儿子从根节点的答案中减去，然后把根节点当做儿子，来递归计算。  



```cpp
// pg 父节点作为子树的答案
void DfsDp(int u, int p, const vector<pair<int, ll>>& pg) {
  // 更新答案
  AddChild(gg[u], pg);
  ans += gg[u][group[u]].second;  // 计算 u 为根的答案
  for (int v : g[u]) {
    if (v == p) continue;
    RemoveChild(gg[u], gg[v]);
    DfsDp(v, u, gg[u]);
    AddChild(gg[u], gg[v]);
  }
  RemoveChild(gg[u], pg);
}
```



这里先把添加一个儿子和删除一个儿子的操作封装好，代码就简洁很多。  


```cpp
void AddChild(vector<pair<int, ll>>& ug, const vector<pair<int, ll>>& vg) {
  for (int i = 0; i < 20; i++) {  // u 为根，排除包括 v 的答案
    const auto [vCnt, vSum] = vg[i];
    auto& [ugCnt, ugSum] = ug[i];
    ugCnt = ugCnt + vCnt;
    ugSum = ugSum + vSum + vCnt;
  }
}
void RemoveChild(vector<pair<int, ll>>& ug, const vector<pair<int, ll>>& vg) {
  for (int i = 0; i < 20; i++) {  // u 为根，排除包括 v 的答案
    const auto [vCnt, vSum] = vg[i];
    auto& [ugCnt, ugSum] = ug[i];
    ugCnt = ugCnt - vCnt;
    ugSum = ugSum - vSum - vCnt;
  }
}
```


复杂度：`O(20 n)`  


## 五、最后


这次比赛整体都不算难，第四题是树形 DP，能过的人比我预期多。  
感觉现在树形 DP 已经有点烂大街了，大家好像都能写出来。  
总之，这场周赛对树形 DP 的掌握还是一次不错的巩固。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
