---
layout: post
title: leetcode 周赛 482 - 数位DP
description: 好久没出数位DP题目了  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-12-28 12:13:00
published: true
---


## 零、背景


周六晚上睡得晚，周日计划跑步，所以就打算不吃早饭多睡一会。  
谁知闹钟定错了，醒来时已经十一点多了，就没参加比赛。  


A: 前缀和+枚举  
B: 贪心  
C: 模拟  
D: 数位DP  


下面按题号依次简单记录一下解题思路。  


**最终排名**：无  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、分割的最大得分  


题意：给一个数组，求一个分割线，使得前缀和与后缀最小值的差最大。  


思路：前缀和 + 枚举分割点  


预处理出每个位置的前缀和与后缀最小值，然后枚举分割点即可。  


```cpp
ll ans = INT64_MIN;
for (int i = 1; i < n; i++) {
  ll sum = prefixSum[i] - suffixMin[i + 1];
  if (sum > ans) ans = sum;
}
return ans;
```


## 二、采购的最小花费  


题意：有三种商品：商品 1 价格为 c1，可以得到 1 分的 A；商品 2 价格为 c2，可以得到 1 分的 B；商品 3 价格为 c3，可以同时得到 1 分的 A 和 1 分的 B。  
问至少得到 x 分 A 和 y 分 B 的最小花费。  


思路：贪心  


显然，如果 `c3 < c1 + c2`，那么优先购买商品 3，否则分别购买商品 1 和商品 2。  
但是也需要注意，当只剩下一个 A 或者 B 时，可能购买商品 3 会更便宜，所以需要特殊处理。  


小技巧：如果商品 1 的价格大于商品 3 的价格，就把商品 1 的价格降低为商品 3 的价格。  
商品 2 同理，这样就可以保证商品 1 和商品 2 的价格都不大于商品 3 的价格。  


```cpp
if (cost1 > costBoth) cost1 = costBoth;
if (cost2 > costBoth) cost2 = costBoth;
ll ans = 0;
if (costBoth < cost1 + cost2) {
  int min12 = min(need1, need2);
  ans += min12 * costBoth;
  need1 -= min12;
  need2 -= min12;
}
ans += need1 * cost1 + need2 * cost2;
return ans;
```


## 三、最小全 1 倍数  


题意：问是否存在全是 1 的十进制数字，是数字 k 的倍数。  
如果存在，输出最小的这样的数字的长度，否则输出 -1。  


思路：模拟  


首先可以剪枝：对于能被偶数 或 5 整除的 k，显然没答案，直接返回 -1。  
只剩下个位是 1、3、7、9 四种情况，每个数字的乘法表中，个位都可以得到任意的数字。  


```cpp
   0 1  2  3  4  5  6  7  8  9
1: 0 1  2  3  4  5  6  7  8  9
3: 0 3  6  9 12 15 18 21 24 27
7: 0 7 14 21 28 35 42 49 56 63
9: 0 9 18 27 36 45 54 63 72 81
```


k 是确定的，被除数的个位是确定的，所以商的个位也是确定的。  


```cpp
vector<int> mulTable(10);
for (int j = 0; j <= 9; j++) {
  mulTable[(k0 * j) % 10] = j;
}
```


假设当前被除数是 `111111 * 10^i + now`，我们需要找到一个商，使得被除数可以被 k 整除。  
假设 k 的个位是 7，now 的个位是 1，那么商的个位必须是 3。  


于是我们可以使用 `111111 * 10^i + now` 减去 `3 * k`，得到新的被除数，然后继续这个过程。  
如果有答案，那么最终会得到 0。  


如果没答案，那么会进入一个循环。  
这里把 now 的值存储在一个集合中，如果出现重复，说明进入循环，返回 -1。  


注意事项：now 是带前缀 0 的，例如 `1111*10^4 + 3` 与 `1111*10^3 + 3` 是不同的。  
所以还需要记录包含前缀 0 的长度。  


```cpp
int ans = 1;
int len = 1;
ll now = 1;
Add(len, now);
while (now) {
  const int lastDigit = now % 10;
  const ll lastMul = mulTable[lastDigit];
  const ll lastRes = k * lastMul;
  while (now < lastRes) {
    now = now + base10[len];
    len++;
    ans++;
  }
  if (now % k == 0) {
    return ans;
  }
  now = now - lastRes;
  now = now / 10;
  len--;
  if (!Add(len, now)) {
    break;
  }
}
return -1;
```


## 四、给定范围内平衡整数的数目  


题意：给定一个范围 `[low, high]`，求范围内平衡整数的个数。  
平衡整数定义为：偶数数字之和等于奇数数字之和。  


思路：数位DP  


假设 `F(n)` 可以求 `[0, n]` 范围内平衡整数的个数，那么答案就是 `F(high) - F(low - 1)`。  


对于 `F(n)`，我们可以使用数位 DP 来求解。  


定义状态 1：`F(p, dis)` 表示当前处理到第 p 位（从低位往高位数），高位已经与数字 n 对齐，此时奇数位与偶数位数字和的差为 dis，在不超过 n 的前提下，后续 `[0, p]` 位任意填充时得到的平衡整数个数。  


由于填充时不能大于 n，所以第 p 位可以填充的数字是 `[0, digit(p)]`。  
当第 p 位填充 `[0, digit(p) - 1]` 时，后续位可以任意填充。  
当第 p 位填充 `digit(p)` 时，后续位依然需要满足不大于 n 的限制，即自身需要递归。  


```cpp
ll DfsEq(int p, ll dis) {
  if (p < 0) return dis == 0 ? 1 : 0;
  ll ans = 0;
  const int V = sx[p] - '0';
  for (int i = 0; i < V; i++) {
    ans += DfsFull(p - 1, Cal(p, dis, i));
  }
  ans += DfsEq(p - 1, Cal(p, dis, V));
  return ans;
}
```


后续可以任意填充时，答案是固定的，所以可以定义一个新的状态，来避免重复计算。  
定义状态 2：`G(p, dis)` 代表后续 `[0, p]` 位数字任意填充时平衡整数的个数。  


```cpp
ll DfsFull(int p, int dis) {  // 前 p 位随便填充，使得前缀差为 dis 时的方案数
  pair<int, int> key = {p, dis};
  if (dp.count(key)) return dp[key];
  if (p < 0) return dis == 0 ? 1 : 0;
  ll& ans = dp[key];
  ans = 0;
  for (int i = 0; i < 10; i++) {
    ans += DfsFull(p - 1, Cal(p, dis, i));
  }
  return ans;
}
```


## 五、总结  


这次比赛四道题都不难，第三题是模拟搜索，第四题是数位 DP，都是比较经典的题型。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
