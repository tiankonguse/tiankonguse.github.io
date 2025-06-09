---
layout: post
title: leetcode 第 453 场算法比赛-排名63
description: 第二题差点翻车  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateData: 2025-06-08 12:13:00
published: true
---



## 零、背景


这次比赛其实不难，比赛开始后我这边始终登录不上，折腾了10分钟。  
第一题敲错一个地方，导致调试十分钟。  
第二题一开始想复杂了，浪费20分钟敲完后样例无法通过，一看榜单过了三四百人，那肯定想复杂了，然后重新读题随后通过。    
还好第三第四题对我来说不难，赶紧通过，做完后没想到还进前百名了。  


A: 枚举贪心扫描      
B: 数学公式    
C: 二分+线段树+动态规划  
D: 简单动态规划    


排名：63    
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、数组元素相等转换  


题意：给一个开关数组，每次操作可以翻转相邻开关，问是否可以在 k次操作内把所有开关翻转为一样状态。  


思路：枚举+贪心扫描  


首先枚举最终状态，然后从前到后扫描，遇到不一致的就进行翻转。  
最后判断是否状态一致，且翻转次数不超过限制。  


```cpp
if (n == 1) return true;
auto Check = [&](int V) {
  int cnt = 0;
  int flag = 0;
  for (auto v : nums) {
    if (flag) {
      v = -v;
      flag = 0;
    }
    if (v == V) continue;
    flag = 1;
    cnt++;
  }
  if (cnt > k) return false;
  return flag == 0;
};
return Check(1) || Check(-1);
```

## 二、统计计算机解锁顺序排列数  


题意：给一个全部加锁的序列数字，第一个数字已经解锁。  
如果一个未解锁数字的前面有小于自己且解锁的数字，则这个未解锁的数字也可以解锁。  
问最终有多少种解锁排列方案，可以把所有数字都解锁。  


思路：数学公式  


想要所有数字都解锁。所有数字都需要小于第一个数字。  
故可以快速判断是否有答案。  


当有答案时，由于所有数字都可以被第一个数字解锁，所以所有数字都可以随时解锁，即所有数字在任意时刻都可以被选择来解锁。  
所以答案是所有数字的排列数。  


```cpp
for (int i = 1; i < n; i++) {
  if (complexity[i] <= complexity[0]) {
    return 0;
  }
}
ll ans = 1;
for (int i = 1; i < n; i++) {
  ans *= i;
  ans %= mod;
}
return ans;
```


## 三、统计极差最大为 K 的分割方式数  


题意：给你一个数组，可以把数组分割为若干段，要求每段内最大值与最小值的差值不超过k，问有多少种分割方案。  


思路：二分+线段树  


很容易想到暴力的动态规划。  


状态定义：`dp(i)` 前 i 个元素的分割方案。  
状态转移方程：`dp(i) = sum(dp(j-1)*Check(j,i))`  


方程解释：枚举所有后缀`[j,i]`如果可以分割，则算一种分割方法，这种分割方法的方案数等于剩余的前缀的分割方案数。  
复杂度：`O(n^3)`  


很容易发现，对于所有后缀 `[j,i]`，`Check`的结果分为两段，后半段都满足，前半段都不满足。  
对于满足的是第一个连续后缀，即 `dp(i)`对应一个连续后缀的区间和。  
所以这个可以先来找到分割点，然后求区间和即可。  



怎么判断一个区间是否满足呢？  
如果可以快速得到一个区间的最大值和最小值，则可以判断是否满足。  
这个可以使用线段树来做。  
复杂度：`O(log(n))`  


```cpp
segTree.Init(nums);
segTree.Build();
ll maxVal = segTree.QueryMax(mid, i).first;
ll minVal = segTree.QueryMin(mid, i).first;
```



怎么找到分割点边界？  
左半段都不满足，右半段都满足，典型的二分。  
复杂度：`O(log(n))`  


```cpp
dp[0] = 1;
sum[0] = 1;
int preMinLeft = 1;
for (int i = 1; i <= n; i++) {
  int l = preMinLeft, r = i;  // (l, r]
  while (l < r) {
    int mid = (l + r) >> 1;
    ll maxVal = segTree.QueryMax(mid, i).first;
    ll minVal = segTree.QueryMin(mid, i).first;
    if (maxVal - minVal <= k) {
      r = mid;  // 说明 mid 也满足条件
    } else {
      l = mid + 1;  // mid 不满足条件
    }
  }
  // preMinLeft = r;
  // [r, i] 都满足条件, 可以拆分为 r-1,[r,i] 以及 i-1,[i,i]
  dp[i] = RangeSum(r - 1, i - 1);  // [r, i] 的个数
  sum[i] = (sum[i - 1] + dp[i]) % mod;
}
```


怎么求区间和呢？  
区间和可以通过前缀和求差得到。  
复杂度：`O(1)`  


```
auto RangeSum = [&](int l, int r) {
  if (l == 0) return sum[r];
  return (sum[r] - sum[l - 1] + mod) % mod;
};
```


综合复杂度：`O(n log(n) log(n))`  


这样写完，没想到竟然超时了，873 \/ 878 个通过的测试用例。  


于是我做了三个优化。  


1）线段树删除无关的内存，例如区间和 sum。  
2）状态和前缀和定义为全局数组。  


```
const int N = 5e4+10;
ll dp[N], sum[N];
```

3）滑动窗口：二分时记录上次的左边界，下次不需要从 1 开始二分，直接从左边界二分。  


```cpp
dp[0] = 1;
sum[0] = 1;
int preMinLeft = 1;
for (int i = 1; i <= n; i++) {
  int l = preMinLeft, r = i;  // (l, r]
  while (l < r) {
    // ... 二分 
  }
  preMinLeft = r;
}
```

通过这三个优化，就通过了这道题。  


## 四、字符串转换需要的最小操作数  


题意：给两个字符串，问对第一个字符串拆分若干段，然后每段进行若干操作，最少需要多少个操作才能使得两个字符串相等。  
操作1：修改一个字符为任意值。  
操作2：交换两个位置的字符。  
操作3：翻转整个字符。  


思路：简单动态规划。  


状态定义：  
`dpOne(i)` 前 i 个字符的最优答案。  
`dpRange(i,j)` 子串`[i,j]`当做一段的最优答案。  


```cpp
int minOperations(string word1_, string word2_) {
  word1.swap(word1_);
  word2.swap(word2_);
  n = word1.size();
  dp.resize(n + 1, -1);
  dpRange.resize(n + 1, vector<int>(n + 1, -1));
  if (word1 == word2) return 0;
  return Dfs(n);
}
```


状态转移方程： `dpOne(i) = min(dpOne(j-1) + dpRange(i,j))`  
方程解释：枚举后缀当做一段求最少操作，剩余的前缀求最优答案。  


```cpp
int Dfs(int p) {
  if (p == 0) return 0;
  if (dp[p] != -1) return dp[p];
  int& ret = dp[p];
  if (p == 1) {
    return ret = word1[0] != word2[0];
  }
  // 枚举后缀长度
  ret = DfsRange(1, p);
  for (int i = 1; i < p; i++) {  // [1, i] [i+1, p]
    ret = min(ret, Dfs(i) + DfsRange(i + 1, p));
  }
  return ret;
}
```


现在问题转化为了，给两个字符串，有三个操作，如何才能操作最少使得两个字符串相等。  


分析三个操作，可以发现分别有一些性质。  


先看操作3：如果翻转2次等于没翻转，所以只能是翻转和不翻转。  


在没有操作3的情况下，对于可以交换位置的两个位置，肯定只需要交换一次，之后值相等了，不需要再交换了。  


最后看操作1，每个位置值不符合目标时，也是只需要操作1次，操作更多次没有意义。  


结合操作1与操作2，如果能进行操作2，就可以少进行一次操作1，故可以先把所有的操作2进行操作，剩余的进行操作1。    


总结：枚举操作3，之后按操作2贪心，剩余的进行操作1。  


```cpp
int DfsRange(int l, int r) {
  if (dpRange[l][r] != -1) return dpRange[l][r];
  int& ret = dpRange[l][r];
  int lr = r - l + 1;
  ret = Solver(l, r);  // 尝试不翻转
  // 先尝试翻转
  std::reverse(word1.begin() + l - 1, word1.begin() + r);
  ret = min(ret, Solver(l, r) + 1);
  std::reverse(word1.begin() + l - 1, word1.begin() + r);
  return ret;
}
```


具体该如何选择操作2呢？  
这个可以使用统计法，正向反向都存在了，就可以进行一次操作2。  
例如使用 `map<pair<char,char>, int>` 来记数。  


```cpp
int dict[26][26];
int Solver(int l, int r) {
  memset(dict, 0, sizeof(dict));
  int swapNum = 0;
  int diffNum = 0;
  for (int i = l; i <= r; i++) {
    int c1 = word1[i - 1] - 'a';
    int c2 = word2[i - 1] - 'a';
    if (c1 == c2) {
      continue;
    }
    diffNum++;
    dict[c1][c2]++;
    if (dict[c2][c1]) {
      swapNum++;  // 交换
      dict[c1][c2]--;
      dict[c2][c1]--;
    }
  }
  return diffNum - swapNum;
}
```


## 五、最后  


回顾这次比赛，第二题用了 23 分钟，第三题用了21分钟，第四题用了 22 分钟。  


看来我的做题速度和题的难度没关系，思考1分钟，敲代码20分钟，敲代码的速度确实是瓶颈。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
