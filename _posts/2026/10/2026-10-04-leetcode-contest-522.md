---
layout: post  
title: leetcode 周赛 522  
description: 矩阵快速幂加速计算 
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-10-04 12:13:00  
published: true  
---


## 零、背景


这次比赛处于国庆节，抽时间补了一下比赛。  
第三题递归很简单，递推很难。  
第四题矩阵快速幂是模板题。  


本场题型概览如下。  


A 题：模拟    
B 题：枚举  
C 题：递归DP    
D 题：矩阵快速幂  


## 一、拨号的最少旋转次数 I


题意：给你一个长度为 10、由数字组成的字符串 s。  
拨号盘上的数字 0 到 9 按顺序排列，且拨号盘是环形的，因此 0 和 9 相邻。  
指针最初指向 0。


要按顺序拨出 s 中的每个数字，需要旋转指针，直到它指向该数字。  
每次旋转都会将指针移动到一个相邻的数字，你可以向任一方向旋转。如果指针已经指向要拨出的数字，则无需旋转。


返回拨出 s 中所有数字所需的最少总旋转次数。


思路：模拟  


从前一个数字转到下一个数字，有两种转发：正着转与逆着转。  
两种转发，一种是数字差，一种是数字差与10的差。  


按题意来模拟计算答案即可。  
复杂度：`O(n)`  
 

```cpp
int minRotations(string s) {
  int ans = 0;
  int pre = 0;
  for (auto c : s) {
    int v = c - '0';
    int dis = abs(v - pre);
    ans += min(dis, 10 - dis);
    pre = v;
  }
  return ans;
}
```


## 二、拨号的最少旋转次数 II


题意：给你一个整数 n 和一个长度为 n、由数字组成的字符串 s。  
拨号盘上的数字 0 到 9 按顺序排列，且拨号盘是环形的，因此 0 和 9 相邻。  
指针最初指向 0。  


要按顺序拨出 s 中的每个数字，需要旋转指针，直到它指向该数字。  
每次旋转都会将指针移动到一个相邻的数字，你可以向任一方向旋转。如果指针已经指向要拨出的数字，则无需旋转。


在拨号之前，你可以执行以下操作至多一次：选择一个满足 `0 <= k < n` 的下标 k，并反转后缀 `s[k..n - 1]`。  


通过最优地选择是否执行该操作以及反转哪个后缀，返回拨出操作后的字符串所需的最少总旋转次数。  
字符串的后缀是从字符串中的任意位置开始、延伸到字符串末尾的连续字符序列。


思路：枚举  


枚举反转的起始下标 k，计算所有答案。  
每次翻转后计算，复杂度 `O(n^2)`  


分析一次反转后的计算过程：  
第一步：从下标 0 依次旋转到下标 `k-1`。  
第二步：从下标 `k-1` 的值旋转为下标 `n-1`的值。  
第三步：从下标 `n-1` 逆向旋转到下标 `k`。  


其中第一步是前缀操作，第二步是一次操作，第三步是后缀操作。  
故可以预处理前缀与后缀，然后枚举下标 `k`，从而可以快速计算出答案。  
预处理时间复杂度：`O(n)`  
枚举复杂度：`O(n)`  


后缀预处理如下，`suf[i]` 表示后缀 `s[i..n-1]` 内部的相邻转移代价之和（反转后相邻关系不变，代价相同）。  


```cpp
vector<int> suf(n + 1, 0);
int pre = s.back() - '0';
for (int i = n - 1; i >= 0; i--) {
  int v = s[i] - '0';
  int dis = abs(v - pre);
  int disCost = min(dis, 10 - dis);
  suf[i] = suf[i + 1] + disCost;
  pre = v;
}
```


然后枚举反转的起始位置 i，用前缀代价 + 一次跳转代价 + 后缀代价更新答案。  


```cpp
pre = 0;
const int last = s.back() - '0';
int preAns = 0;
for (int i = 0; i < n; i++) {
  int dis = abs(pre - last);
  int disCost = min(dis, 10 - dis);
  int curAns = preAns + disCost + suf[i];
  ans = min(ans, curAns);
  int v = s[i] - '0';
  dis = abs(v - pre);
  disCost = min(dis, 10 - dis);
  preAns += disCost;
  pre = s[i] - '0';
}
return ans;
```


## 三、一次删除后的最大交替子数组和


题意：给你一个整数数组 nums。  
你最多可以从 nums 中删除一个元素，然后在剩下数组里选一个子数组。  
返回所选子数组的最大可能交替和。  


子数组是数组中连续的非空元素序列。  
数组的交替和是其偶数下标处元素之和减去奇数下标处元素之和。  
在计算其交替和之前，所选子数组会从 0 开始重新编下标。


思路：递归DP  


交替和可以理解为：子数组内每个元素依次赋予 `+ - + - ...` 的符号，符号由元素在子数组内的位置奇偶性决定。  


枚举子数组的结尾位置，可以定义状态 `DfsLeft(i, o)`：以 i 结尾的子数组的最大交替和，其中 i 在子数组内的位置奇偶性为 o（0 为偶数下标、符号为正，1 为奇数下标、符号为负）。  


- 如果 o 为偶数：可以只选 i 单独作为子数组，也可以从 i-1 扩展过来。  
- 如果 o 为奇数：子数组不可能从 i 开始（第一个元素一定是偶数下标），只能从 i-1 扩展过来。  


先实现记忆化搜索的初始化，memo 里使用哨兵值标记未计算的状态。  


```cpp
enum { EVEN = 0, ODD = 1 };
ll flag[2] = {1, -1};
ll DfsLeft(int i, int o) {
  ll& ret = memoLeft[o][i];
  if (ret != INT64_MIN / 2) return ret;
  ret = INT64_MIN / 4;
  if (o == EVEN) {
    ret = max(ret, nums[i] * flag[o]);
  }
  if (i > 0) {
    ret = max(ret, nums[i] * flag[o] + DfsLeft(i - 1, 1 - o));
  }
  return ret;
}
```


枚举子数组的开始位置，可以定义状态 `DfsRight(i, o)`：以 i 开始的子数组的最大交替和，其中 i 的奇偶性为 o。  
一定包含 i，之后可以选择是否继续向右扩展。  


```cpp
ll DfsRight(int i, int o) {
  ll& ret = memoRight[o][i];
  if (ret != INT64_MIN / 2) return ret;
  ret = nums[i] * flag[o];
  if (i + 1 < n) {
    ret = max(ret, nums[i] * flag[o] + DfsRight(i + 1, 1 - o));
  }
  return ret;
}
```


答案分两类统计。  


第一类：不删除元素。枚举子数组的结尾 i 取 `DfsLeft(i, *)` 的最大值，或枚举子数组的开头 i 取 `DfsRight(i, EVEN)` 的最大值，即可覆盖所有子数组。  


第二类：删除一个元素。如果删除的元素不在子数组内部，等价于不删除，已经被第一类覆盖。  
所以只需要考虑横跨删除点的子数组：左侧以 i-1 结尾，右侧以 i+1 开始。  
删除后 i-1 与 i+1 相邻，二者在子数组内的奇偶性必须相反：左侧为 li 时，右侧为 `1-li`。  
答案为 `DfsLeft(i-1, li) + DfsRight(i+1, 1-li)`。  


```cpp
ll ans = INT64_MIN;
for (int i = 0; i < n; i++) {
  ans = max(ans, DfsLeft(i, EVEN));
  ans = max(ans, DfsLeft(i, ODD));
  if (i > 0) {
    ans = max(ans, DfsRight(i, EVEN));
  }
}
for (int i = 1; i + 1 < n; i++) {
  for (int li = 0; li < 2; li++) {
    ll left = DfsLeft(i - 1, li);
    ll right = DfsRight(i + 1, 1 - li);
    ans = max(ans, left + right);
  }
}
return ans;
```


每个状态只计算一次。  
复杂度：`O(n)`，空间复杂度 `O(n)`  


## 四、统计好字符串数目


题意：给你一个整数 n。  
如果一个字符串仅由字符 `'a'` 和 `'b'` 组成，且满足以下条件之一，则该字符串被认为是好的：  


- 它只包含一种字符，且其长度为奇数。  
- 它可以写成 `s = s1 + s2` 的形式，其中 s1 和 s2 是非空的好字符串，且 s1 的最后一个字符与 s2 的第一个字符不同。  


返回长度为 n 的好字符串的数量，模 `10^9 + 7`。  


思路：矩阵快速幂  


先推导递推公式。  


特征 1：好字符串等价于「每个相同字符连续块的长度都是奇数」。 


注意这里说的是「每个相同字符块」的长度，而不是整个字符串的长度；  
例如 "ab" 是好字符串，但长度为 2。  



沿条件二递归拆分 s。  
若 s 满足条件一，则 s 本身就是单字符、奇数长度的一个块；  
若 s 满足条件二，则拆成 `s1 + s2`，两个部分仍是更短的好字符串，继续递归拆分。  
由于长度严格递减，拆分必然终止，最终 s 被拆成若干个满足条件一的字符串，每个都是单字符、奇数长度。  


这些子字符串按原顺序拼接成 s，任意相邻两个子字符串的边界作为分隔符，都可以得到 S，故怎么拆分都是等价的。   


特征 2：只考虑最后一个相同字符块的长度，可以得到递推公式。  
- 如果最后一个块长度为 1：删除最后一个字符，剩余字符串依旧满足「每个块长度都是奇数」，对应长度为 n-1 的好字符串，数量为 `f(n-1)`。  
- 如果最后一个块长度大于等于 3：块长是奇数，删除最后 2 个字符后，最后一个块长度减少 2 依旧是奇数，对应长度为 n-2 的好字符串，数量为 `f(n-2)`。  


两类情况互不重叠且覆盖所有情况，所以递推公式为 `f(n) = f(n-1) + f(n-2)`。  
初始值：`f(1) = 2`（"a"、"b"），`f(2) = 2`（"ab"、"ba"）。  


n 最大为 `10^15`，直接递推会超时，使用矩阵快速幂加速即可。  


```cpp
const ll mod = 1e9 + 7;

struct Matrix {
  ll P;
  int sz;
  vector<vector<ll>> a;
  Matrix(int sz = 1) : sz(sz) { init(sz); }
  void init(int n, ll p = mod) {
    P = p;
    sz = n;
    a.clear();
    a.resize(n, vector<ll>(n, 0));
  }
  void _union() {
    int l = sz;
    while (l--) {
      a[l][l] = 1;
    }
  }
  Matrix operator*(const Matrix& B) const {
    Matrix ret(sz);
    for (int i = 0; i < sz; i++)
      for (int j = 0; j < sz; j++)
        for (int k = 0; k < sz; k++)
          ret.a[i][j] = (ret.a[i][j] + a[i][k] * B.a[k][j]) % P;
    return ret;
  }
  Matrix pow(ll k) const {
    Matrix ret(sz);
    Matrix A = *this;
    ret._union();
    while (k) {
      if (k & 1) ret = ret * A;
      A = A * A;
      k >>= 1;
    }
    return ret;
  }
};

int countGoodStrings(ll n) {
  // f(n) = f(n-1) + f(n-2)
  // f(0) = 0, f(1) = 2, f(2) = 2
  Matrix unit(2);
  unit.a[0][0] = 0;
  unit.a[0][1] = 1;
  unit.a[1][0] = 1;
  unit.a[1][1] = 1;
  Matrix ans = unit.pow(n);
  return (ans.a[0][1] * 2) % mod;
}
```


## 五、最后


这次比赛前两题是拨号盘模拟，属于送分题。  
第二题加了一个后缀反转操作，分析出反转后的拨号过程分为前缀、一次跳转、后缀三段，预处理前后缀后枚举即可。  
第三题是递归 DP，想清楚子数组内的奇偶性后代码很短；但若改用递推写，状态设计与边界处理会麻烦很多。  
第四题的关键是发现好字符串等价于每个字符块长度为奇数，从而得到斐波那契递推，之后套矩阵快速幂模板即可。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
