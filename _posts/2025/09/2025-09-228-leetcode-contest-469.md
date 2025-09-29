---
layout: post
title: leetcode 第 469 场算法比赛
description: 矩阵快速幂      
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-09-28 12:13:00
published: true
---

## 零、背景


这次比赛是国庆调休日，所以没参加比赛。  
晚上找时间做了一下比赛，发现比较简单，第四题是矩阵快速幂，模板题。  


A: 循环    
B: 前缀和+枚举或枚举    
C: 状态DP  
D: 状态DP+矩阵快速幂加速   


代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、计算十进制表示  


题意：给一个十进制数字，求各位非0数字，从大到小排列。  


思路：循环计算每一位数字即可  


## 二、分割数组得到最小绝对差  


题意：给一个数组，问是否可以恰好拆分为两个子数组，左边的严格递增，右边的严格递减。如果可以，如何拆分才能使两个子数组和的绝对值差值最小。  



思路：贪心或枚举  


可以证明，如果存在答案，则数组必然是先严格升序在严格降序。  
对于中间的最大值，可以归属于左边，也可以归属于右边，所以必然存在两个拆分。  


故可以贪心先找到最大值，然后判断两边是否满足升序和降序，不满足则没有答案。  
如果满足条件，分别求和并计算差值即可。  



当然，没发现上面的规律也没关系。  
可以预处理出前缀和，以及所有前缀是否满足严格升序与所有后缀是否满足严格降序。  
然后枚举所有拆分，并判断是否满足严格升序与降序，满足了，通过前缀和计算出子数组的区间和，最后求差值。  


## 三、锯齿形数组的总数 I  


题意：需要在区间 `[l,r]` 依次选择 n 个数字（可以重复），要求相邻数字不同，连续三个数字不严格递增或递减。  
问有多少种方案满足条件。  


思路：状态DP  


题目的条件是相邻三个元素的限制，故需要定义前两个元素关系的状态，从而可以找到满足条件的第三个元素。  


状态定义：`f(n, v, dir)` 第 n 个数字值为 v 且 前一个元素与当前元素的关系为 dir 时的方案数。   
dir 分为上升和下降，可以使用 `UP=0` 和 `DOWN=1` 表示。  


状态转移：  


```cpp
f(n, v, UP) = sum(f(n-1, i, DOWN)), i < v;
f(n, v, DOWN) = sum(f(n-1, i,UP)),  i > v
```


方程解释：当前状态为 UP 时，来源的数字值必须小于当前值 v，且来源状态必须是 DOWN。  
当前状态为 DOWN 时，来源的数字值则必须大于当前值 v，且来源状态必须是 UP。  


```cpp
n--;
while (n--) {
  fill(dp[UP].begin(), dp[UP].end(), 0);
  fill(dp[DOWN].begin(), dp[DOWN].end(), 0);
  // UP -> DOWN
  for (int i = 1; i <= R; i++) {
    dp[DOWN][i] += sum[UP][i - 1];
  }
  // DOWN -> UP
  for (int i = R - 1; i >= 0; i--) {
    dp[UP][i] += sum[DOWN][i + 1];
  }
  CalSUm();
}
```


由于使用到了小于某个值的方案和，所以每轮还需要处理出前缀和。  


```cpp
auto CalSUm = [&]() {
  fill(sum[UP].begin(), sum[UP].end(), 0);
  fill(sum[DOWN].begin(), sum[DOWN].end(), 0);
  sum[UP][0] = dp[UP][0] % mod;
  for (int i = 1; i <= R; i++) {
    sum[UP][i] = (sum[UP][i - 1] + dp[UP][i]) % mod;
  }
  sum[DOWN][R] = dp[DOWN][R] % mod;
  for (int i = R - 1; i >= 0; i--) {
    sum[DOWN][i] = (sum[DOWN][i + 1] + dp[DOWN][i]) % mod;
  }
};
```


对于初始化，所有数字值的所有方向默认都是1个，此时 `n=1` 需要特殊判断。  


```cpp
int R = r - l;
if (n == 1) {
  return R + 1;
}
vector<vector<ll>> dp(2, vector<ll>(R + 1, 0));
for (int i = 0; i <= R; i++) {
  dp[UP][i] = 1;
  dp[DOWN][i] = 1;
}
```


复杂度：`O(N*(R-L+1))`    


## 四、锯齿形数组的总数 II  


题意：与第三题一样，n 数据范围变为 `10^9`，值域缩小为 `75`。  



思路：矩阵幂加速  


观察第三题的状态转移方程，UP 状态来源于 DOWN 的一些状态的和， DOWN 的状态同样来源于 UP 的状态和，这些关系可以构造为矩阵后，通过矩阵乘来代替上面的循环即可。  


状态矩阵大小定义为 `2R`，例如上面一部分是 UP 的状态，下面一部分是 DOWN 的状态。  


```cpp
int R = r - l + 1;
int R2 = R * 2;
Matrix state(R2);
for (int i = 0; i < R; i++) {
  for (int j = 0; j < R; j++) {  // DOWN -> UP
    if (j > i) {
      state.a[i][R + j] = 1;
    }
  }
  for (int j = 0; j < R; j++) {
    if (j < i) {
      state.a[R + i][j] = 1;
    }
  }
}
```


由于矩阵满足结合律，因此可以使用快速幂来加速运算。  


```cpp
Matrix stateN = state.pow(n - 1);
ll ans = 0;
for (int i = 0; i < R2; i++) {
  for (int j = 0; j < R2; j++) {
    ans = (ans + stateN.a[i][j]) % mod;
  }
}
return ans;
```


复杂度：`R^3 * log(n)`  


## 五、最后  


这次比赛整体比较简单，前三题都属于基础知识，第四题如果之前没见过矩阵幂相关内容，那就做不出这道题了。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
