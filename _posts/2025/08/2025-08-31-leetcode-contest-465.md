---
layout: post
title: leetcode 第 465 场算法比赛
description: 二进制子集最大值，容斥筛法，挺难的  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-08-31 12:13:00
published: true
---

## 零、背景


8月底回家了，所以没参加比赛。  
最近补做了一下这场比赛，感觉第三题和第四题都挺难的。  


A: hash  
B: 整数拆分    
C: 二进制子集DP  
D: 容斥筛法   


排名：无  
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、重排完成顺序  


题意：排名从前到后给出参赛者的ID，然后给你一个人员列表，请按排名输出这些参赛者。  

 
思路：hash  


题意有点绕，意思是筛选排名，只显示给定的人员列表。  
所以对人员列表创建 hash，扫描排名，只返回在 hash 表中的参赛者即可。  


## 二、K 因数分解 


题意：给你两个整数 n 和 k，将数字 n 恰好分割成 k 个正整数，使得这些整数的乘积等于 n。  
返回一个分割方案，使得这些数字中最大值和最小值之间的差值最小化。结果可以以任意顺序返回。  


思路：暴力枚举  


 n 的数量级为 `10^5`，k 的数量级为 5，可以理解为将 10 万以内的数字拆分为 5 个因子，使得因子差值最小。  


10 万进行质因数分解，质因子个数上限是 `log(10^5)`，此时都是因子 2，大概是 28 个。  


```cpp
vector<pair<int, int>> factors;
int m;  // 不同因子的个数
int k;
void Init(int n, int k) {
  this->k = k;
  for (int i = 0; i < K && n > 1; i++) {
    int p = prm[i];
    int cnt = 0;
    while (n % p == 0) {
      n /= p;
      cnt++;
    }
    if (cnt > 0) {
      factors.emplace_back(p, cnt);
    }
    // 剪枝
    if (n > 0 && is[n]) {
      factors.emplace_back(n, 1);
      n = 1;
      break;
    }
  }
  m = factors.size();
}
```


问题就转化为了 28 个不同的球放在 5 个盒子里，共有 `28^5` 种放法，大概是 `10^7`。  


相同球放入盒子时，复杂度会降低一个量级。  
另外有更大的因子时，总因子个数也会更少，复杂度会再降一个量级。  
两者结合起来，复杂度就是降低两个量级，大概为 `10^5`。  



因此可以递归枚举所有情况，暴力求最优值。  



```cpp
vector<int> vals;
vector<int> ansNums;
int ans;
void CheckAns() {
  int minVal = *min_element(vals.begin(), vals.end());
  int maxVal = *max_element(vals.begin(), vals.end());
  if (maxVal - minVal < ans) {
    ans = maxVal - minVal;
    ansNums = vals;
  }
}
// 第 mi 个因子，使用了 use 个，分给到第 ki 个数
void Dfs(int mi, int ki, int use) {
  if (mi == m) {
    CheckAns();
    return;
  }
  auto [p, cnt] = factors[mi];
  int leftNum = cnt - use;  // 第 mi 个因子还剩下多少个
  if (leftNum == 0) {
    Dfs(mi + 1, 0, 0);
    return;
  }
  if (ki + 1 == k) {  // 只剩最后一个选择了
    vals[ki] *= MyPow(p, leftNum);
    Dfs(mi + 1, 0, 0);
    vals[ki] /= MyPow(p, leftNum);
    return;
  }
  int base = 1;
  for (int i = 0; i <= leftNum; i++) {
    vals[ki] *= base;
    Dfs(mi, ki + 1, use + i);
    vals[ki] /= base;
    base *= p;
  }
}
```



## 三、没有公共位的整数最大乘积  


题意：给你一个整数数组 nums。  
请你找到两个不同的下标 i 和 j，使得 `nums[i] * nums[j]` 的乘积最大化，并且 `nums[i]` 和 `nums[j]` 的二进制表示中没有任何公共的置位 (set bit)。  
返回这样一对数的最大可能乘积。如果不存在这样的数对，则返回 0。  


思路：子集DP  


暴力枚举所有二元组，复杂度 `O(n^2)`，显然会超时。  
所以很容易想到，枚举一个位置，找到其他满足条件的位置里面的最大值。  
为了避免重复，我们枚举右端点，在前缀里面找到符合条件的最大值。  



假设枚举的值为 V，需要找到 v，使得 v 与 V 没有相同的 1 位，即在二进制上 v 是 `~V` 的子集。  


现状问题转化为了求 `~V` 二进制子集的最大值。   


子集最大值是经典的动态规划问题，即 `f(n) = max(f(n & (1<<i)))`  
文字描述就是，枚举排除某一位后的答案，所有的合起来，就是当前答案。  
复杂度：`O(v log(v))`  


```cpp
const int MaxBitVal = 1 << maxBit;
fill_n(dp, MaxBitVal, 0);
for (auto v : nums) {
  dp[v] = v;
}
for (int i = 0; i < MaxBitVal; i++) {
  for (int j = 0; j < maxBit; j++) {
    dp[i | (1 << j)] = max(dp[i | (1 << j)], dp[i]);
  }
}
ll ans = 0;
for (ll v : nums) {
  int complement = (MaxBitVal - 1) ^ v;
  ans = max(ans, v * dp[complement]);
}
return ans;
```


## 四、子序列美丽值求和


题意：给你一个长度为 n 的整数数组 nums。  
对于每个正整数 g，定义 g 的美丽值为 g 与 nums 中符合要求的子序列数量的乘积，子序列需要严格递增且最大公约数（GCD）恰好为 g。  
请返回所有正整数 g 的美丽值之和。  


思路：容斥  


题意有点绕，转化一下就是找到所有的严格递增子序列，求这些子序列最大公约数的和。  


第一步是对所有数字进行因数分解，存储下因子为 v 的所有位置。  
复杂度：`O(n log(n))`  


```cpp
int n = nums.size();
int maxVal = *max_element(nums.begin(), nums.end());
vector<vector<int>> valLCM(maxVal + 1);
for (int i = 0; i < n; i++) {
  const int val = nums[i];
  for (int j = 1; j * j <= val; j++) {
    if (val % j == 0) {
      valLCM[j].push_back(val);
      if (j != val / j) {
        valLCM[val / j].push_back(val);
      }
    }
  }
}
```



第二步，如果不考虑最大公约数，只考虑约数，如何求出所有递增子序列呢？  
这是一个经典的动态规划问题。  


状态定义：`f(n)` 表示以 n 为结尾的递增子序列个数。  
方程：  


```cpp
f(n) = 1 + sum(f(i)) &&  V(i)<V(n)
```


前缀小于 V 的和，可以使用线段树或者树状数组来快速计算区间和。  



```cpp
treeArray.Init(maxVal + 1);
for (auto val : valLCM[v]) {
  const ll cnt = treeArray.Query(1, val - 1) + 1;
  treeArray.Add(val, cnt);
}
dp[v] = (dp[v] + treeArray.Query(1, maxVal)) % mod;
```


约数的个数为 `n log(n)` 个，每一个需要进行一次查询和一次添加，故综合复杂度为 `n log(n) log(n)`  


问题：每个约数都需要初始化一次树状数组，复杂度退化为 `O(n^2)`。  
解决方案：数据结构增加时间戳版本，时间戳不一致时按空处理。  


下面是添加操作的代码，访问容器时，先判断时间戳版本是否一致。  


```cpp
vector<ll> c;
vector<ll> times;
void Add(int x, ll v) {
  while (x <= n) {
    if (times[x] != tick) {
      times[x] = tick;
      c[x] = 0;
    }
    c[x] = (c[x] + v) % mod;
    x += Lowbit(x);
  }
}
```



另外上面的公式计算的有重复，假设约数是 v，我们不但统计了最大公约数为 v 的子序列，还统计了最大公约数为 `2v、3v、4v、...` 的子序列。  
所以需要减去这些子序列，才是最大公约数为 v 的子序列。  


```cpp
for (int mul = 2 * v; mul <= maxVal; mul += v) {
  dp[v] = (dp[v] - dp[mul] + mod) % mod;
}
ans = (ans + dp[v] * v) % mod;
```

这里复杂度不好计算。  
对于每个数字，计算所有倍数，复杂度为 `n/1+n/2+n/3+...+n/n`，这是一个调和级数，复杂度为 `n log n`。  


## 五、最后  


这次比赛三道题都挺难的。  
第二题整数拆分需要暴力枚举所有情况，如果对复杂度理解不深的话，很容易以为会超时。  
第三题二进制子集 DP，是很经典的动态规划。  
第四题比较综合，先质因数分解，然后动态规划求递增子序列个数，再用容斥减去重复数据，比较难想。  





《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
