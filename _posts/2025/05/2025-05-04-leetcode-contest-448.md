---
layout: post
title: leetcode 第 448 场算法比赛 - 复杂DP 
description: 连续两道DP，都看错题了   
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateData: 2025-05-04 12:13:00
published: true
---

## 零、背景


这次比赛在假期，本来没时间打比赛的。  
老婆突然需要值班，一家就没出去玩，所以就有时间打比赛了。  
不过这次比赛后两题不断的看错题，最后紧急写代码把第三题通过，最终只有 76 名。  


A: 签到题    
B: 递归模拟    
C: 高级动态规划  
D: 高级动态规划  


排名：76    
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、两个数字的最大乘积  


题意：给一个数字，问任意两位数字相乘，求最大乘积。  


思路：数位转化为数组，排序，最高两位相乘即可。  


## 二、填充特殊网格  


题意：要求构造一个 `2^n * 2^n` 的矩阵，值分别为 `[0, 4^n)`。  
要求矩阵分为四个象限，且右上角数字最小、右下角次之、左上角次之、左下角最大。  
还要求每个象限也满足上述要求。  



思路：按题意递归模拟即可。  


```cpp
void Dfs(int x, int y, int N, int& offset) {
  if (N == 1) {
    ans[x][y] = offset;
    offset++;
    return;
  }
  // 右上，右下，左下，左上
  int n = N / 2;
  Dfs(x, y + n, n, offset);
  Dfs(x + n, y + n, n, offset);
  Dfs(x + n, y, n, offset);
  Dfs(x, y, n, offset);
}
```


## 三、合并得到最小旅行时间  


题意：数轴上给 n 个位置以及每个位置的速度，位置从小到大经过一个位置点时，速度更新为该位置的速度。  
现在可以删除恰好 k 个位置，问从 0 到 n 的最短时间。  
特殊要求：删除一个位置后，该位置的速度叠加到下个位置。  


思路：动态规划  


一开始没看到特殊要求，我在犹豫使用动态规划还是直接贪心，最终选择了贪心。  
做到一半发现正确题意，想着贪心不一定错误，于是就先敲完了，结果样例直接无法通过。  
于是只好老老实实来写动态规划。  


题意分析：删除一个位置 p 后，影响两个区间: `[p,p+1]` 继承位置 `p-1` 的速度，区间 `[p+1,p+2]`的速度需要叠加位置 p 的速度。  
数据分析：n 不大于 20， k 不大于 10， 叠加的时间 `sum(time)` 不大于 100。  


显然，叠加时间上限是突破口，需要使用叠加时间来当做状态的维度。  


状态定义：`f(p, sumv, k)` 区间 `[p, n)` 不删除 p 位置，且叠加速度 sumv 时，删除 k 个位置的最短时间。  


状态转移方程：  


```
f(p, sumv, k) = min(f(p+i, sumSpeed(p+1, p+i-1), k - i) + Cost(p,i));
Cost(p,i) = (nums[p+i+1] - nums[p]) * (speeds[p] + sumv)
```


方程解释： 枚举 p 之后连续删除的位置个数， 计算的答案取最小值。  

```
f(p, 当前叠加速度, k) = min(f(p+i, 下一次叠加速度, k - i) + 当前区间消耗时间);  
当前区间消耗时间 = 当前区间的距离 * 当前区间的速度  
```


完整代码如下：  


```cpp
int minTravelTime(int l, int n, int k, vector<int>& position, vector<int>& time) {
  vector<vector<vector<ll>>> dp(n + 1, vector<vector<ll>>(111, vector<ll>(k + 1, -1)));
  auto Right = [&](auto Right, const int p, const ll v, const int k) -> ll {
    ll& ret = dp[p][v][k];
    if (ret != -1) return ret;
    if (p == n - 1) {
      if (k < 0) {
        return ret = INT_MAX;
      }
      return ret = 0;  // 最后一个
    }
    if (n - 1 - p - 1 < k) {
      return ret = INT_MAX;  // 剪枝，没有答案
    }
    ret = INT_MAX;
    ll V = 0;
    for (int i = 0; i <= k && p + i < n - 1; i++) {
      ll nowDis = position[p + i + 1] - position[p];
      ll nowSpeed = time[p] + v;
      ll nowCost = nowDis * nowSpeed;
      if (i > 0) V += time[p + i];  // 删除第 i 个
      ret = min(ret, nowCost + Right(Right, p + i + 1, V, k - i));
    }
    return ret;
  };
  return Right(Right, 0, 0, k);
}
```


## 四、魔法序列的数组乘积之和  


题意：给n个数字，选择 m 个下标，如果各个下标的二进制幂之和有 k 个 1，则将这些下标对应的数字相乘，求所有满足要求的乘积的和。  


思路：看错题了很多次。  


第一个地方看成数组值的二进制幂，关于重复值我还做了很多处理逻辑，最后发现是下标的二进制幂。  
第二个地方看成下标之间没有顺序，即求满足要求的组合，最后发现是排列。  
第三个地方是看成每个下标只能选择一次，最后发现是可以多次。  


题意明确后，其实这道题不难，直接使用动态规划即可。  


先看乘积，可以提取前缀，从而把所有情况合并为一个乘法公式,子问题只关注子问题设计的元素的乘积。  


```cpp
  a0 * a1 * a2 + a0 * a1 * a3 + a0 + a2 * a3 
= a0 * (a1 * a2 + a1 * a3 + a2 * a3)
= a0 * (a1 * (a2 + a3) + a2 * a3) 
```


状态定义：`f(p, m, mask, k)` 区间 `[p,n)` 内选择 m 个下标，已选择的二进制幂为 mask，凑够 k 个 1 的答案。   


状态转移方程：  


```cpp
f(p, m, mask, k) = sum((f(p+1, m-i, NextMask(), NextK()) * C(m, i) * nums[p]^i);
```


解释：枚举当前位置 p 选择 i 个时的答案，相乘 `nums[p]^i` 累计求和。    
对于方案数，是 m 个位置，选择 i 个，有 `C(m, i)` 种选择。  



难点：最多有 30 个位置， mask 可能很大，储存不下。  
优化：对于下标 p， 只需要储存 `mask>>p` 的状态。  


下标从小到大枚举，则子问题的 mask 只会更新不低于下标的高位幂，不会更新低位幂。  
最多选择 30 个数字，则 mask 最大为 30。  


空间复杂度: `O(n*k*m^2)`  
时间复杂度： `O(n*k*m^3)`   



## 五、最后  


这次比赛后两题其实都挺难的。  
第三题父问题的选择会影响子问题，所以需要将影响抽象为一个状态，从而与子问题解耦。  
第四题读懂题就需要花费不少时间，读懂后需要想到 mask 太大储存不下的优化，想到了，就可以做这道题了。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
