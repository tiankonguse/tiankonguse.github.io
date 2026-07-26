---
layout: post  
title: leetcode 周赛 512 - 组合数学  
description: 组合数学，正难则反    
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-07-26 12:13:00  
published: true  
---



## 零、背景


这次比赛深圳刮台风，网络也出了问题，就没参加比赛。  


本场题型概览如下。  


A 题：贪心。  
B 题：双指针。  
C 题：组合数学，正难则反。  
D 题：网格动态规划。  



## 一、给定数位和的最大整数


题意：问是否可以构造出最长 n 位数字，数字之和为 s，求最大的数字。  


思路：贪心  


n 位数字最大全是 9，值是 `9*n`，再大就没答案。  
如果 s 为 0 时，答案只能是 0。  
否则可以构造出 n 位数字，贪心赋值 9，不够了全赋值，之后的都是 0。  


```cpp
if (n * 9 < s) return -1;
if (s == 0) return 0;
int ans = 0;
for (int i = 0; i < n; i++) {
  if (s >= 9) {
    ans = ans * 10 + 9;
    s -= 9;
  } else {
    ans = ans * 10 + s;
    s = 0;
  }
}
return ans;
```



## 二、聚合两个时间序列


题意：给两个序列二元组 `<t,v>`，其中 t 严格递增。  
如果中间时间有空洞，对于时间等于下个非空时间的值。  
最后一个时间后面的值都是 0。  
问两个序列按时间合并，对值求和，得到的新的二元组序列。  


思路：双指针  


由于序列已经保证严格递增，维护双指针比大小合并即可。  


```cpp
int i1 = 0;
int i2 = 0;
while (i1 < n1 && i2 < n2) {
  int t1 = series1[i1][0];
  int v1 = series1[i1][1];
  int t2 = series2[i2][0];
  int v2 = series2[i2][1];
  result.push_back({min(t1, t2), v1 + v2});
  if (t1 == t2) {
    i1++;
    i2++;
  } else if (t1 < t2) {
    i1++;
  } else {
    i2++;
  }
}
```



## 三、统计有效序列数目


题意：给一个正整数 n 和 k，构造一个长度为 k 的正整数序列，序列和为 n，序列的乘积为偶数。  
问可以构造多少个序列。  


思路：组合数学，正难则反  


这里分为几个步骤来看推导逻辑。  


步骤1：无限制的插板问题。  


如果不考虑乘积为偶数的限制，则是经典的组合数学插板问题。  
假设有 n 个球，分 k 组，则需要再 `n-1` 个中间空隙里选择 `k-1` 个位置插入隔板。  
故答案个数为 `C(n-1, k-1)`。  


步骤2：正难则反。  


现在乘积要求是偶数，意味着 k 个数字里至少有一个是偶数。  
至少一个不好计算，但是我们可以逆向思维，总的减去一个偶数都没有的，则是至少一个的。  


一个偶数都没有，代表 k 个数字都是奇数。  


问题转化为了，n 个球分 k 组，每个分组大小都是奇数，且插板每个位置都不为空。  


步骤3：限制为偶数，分组可以为空。  


k 个分组都预先分配一个球，问题就转化为了 `n-k`个球，分 k 组，每组可以为空，组数都为偶数的方案数。  


步骤4：无限制，分组可以为空  


既然组内都是偶数，则两两结合，就转化为了 `(n-k)/2` 个球，分 k 组，组数可以为空的方案数。  


对于这种，还是经典的插板法。  
可以为空时，极端情况都属于一组，所以需要增加 `k-1`个虚拟的球，从而可以插入 `k-1`个隔板。  
故方案数是 `C((n-k)/2+k-1, k-1)`。  


步骤5：综合  


上面全部综合，公式如下：  


```cpp
C(n-1, k-1) - C((n-k)/2+k-1, k-1)
```



聪明的你肯定发现，某些情况下`n-k` 可能无法整除 2。  
这时候就代表不存在这种情况，即答案就是 `C(n-1, k-1)`。  


```cpp
// n 个球按顺序分 k 组，不能空的方案数
ll F(ll n, ll k) { return C(n - 1, k - 1, mod); }

// n 个球按顺序分 k 组，可以为空的方案数，等价于 C(n+k-1, k-1)。
ll Q(ll n, ll k) { return C(n + k - 1, k - 1, mod); }

// n个球按顺序分k组，每组都为偶数(可以为空)的方案数。
ll P(ll n, ll k) {
  if (n & 1) return 0;
  return Q(n / 2, k);
}
// H(n,k)，n个球按顺序分k组，每组都为奇数的方案数。
ll H(ll n, ll k) { return P(n - k, k); }

// G(n,k)，n个球按顺序分k组，至少有一个偶数的方案数。
ll G(ll n, ll k) { return (F(n, k) - H(n, k) + mod) % mod; }
```


注意事项：答案为负数时，需要转化为正数。  


什么，你还不会求组合数的取模？  
这个可以使用逆元来计算。  


```cpp
ll C(ll n, ll r, ll mod) {
  if(n < r) return 0;
  ll Anr = A[n] * RA[n - r] % mod;
  return Anr * RA[r] % mod;
}
```



## 四、交替方向的最小路径代价 III


题意：给一个网格，进入单元格 `(x,y)` 的代价是 `(x+1)*(y+1)`。  
记录走的步数，奇数步可以朝右或者下移动，偶数步可以朝左或者上移动。  
另外，还有一些惩罚代价。  
待在原地`(x,y)`，奇数步朝左或者上，偶数步朝右或者下，都消耗一个步骤，惩罚代价为 `penalty[x][y]`。  
问从左上角到达右下角的最小代价。  


思路：网格动态规划


状态定义：`dp[x][y][flag]` 到达 `(x,y)`步数奇偶性为 `flag`的最小代价。  


状态转移方程：根据步数，计算等待、上下左右四个方向下一步的代价。  


由于每个状态可以到达很多其他的状态，状态之间存在环，目标是求最小值，故需要使用优先队列。  


小技巧：上下左右可以定义为数组，从而可以利用奇偶性判断是否需要加上惩罚代价。  


```cpp
int dir4[4][2] = { {0, 1}, {0, -1}, {1, 0}, {-1, 0}};

dp.assign(m, vector<vector<ll>>(n, vector<ll>(2, -1)));
min_queue<tuple<ll, int, int, int>> que;  // <cost, x, y, flag>
Add(CostXY(0, 0), 0, 0, 0);

while (!que.empty()) {
  const auto [cost, x, y, flag] = que.top();
  que.pop();
  if (x == m - 1 && y == n - 1) return cost;
  const int nextFlag = 1 - flag;
  // 等待
  Add(cost + penalty[x][y], x, y, nextFlag);
  // 上下左右
  for (int i = 0; i < 4; i++) {
    const int X = x + dir4[i][0];
    const int Y = y + dir4[i][1];
    if (X < 0 || X >= m || Y < 0 || Y >= n) continue;
    if (i % 2 != nextFlag) {
      Add(cost + CostXY(X, Y), X, Y, nextFlag);
    } else {
      Add(cost + CostXY(X, Y) + penalty[x][y], X, Y, nextFlag);
    }
  }
}
```



## 五、最后


这次比赛第三题稍微难一点，需要组合数学公式推导，其他题则都比较简单。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
