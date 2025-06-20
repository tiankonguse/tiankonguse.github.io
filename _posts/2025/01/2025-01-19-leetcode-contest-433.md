---
layout: post  
title: leetcode 第 433 场算法比赛，两道题算法一样  
description: 思维受限。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2025-01-19 12:13:00  
published: true  
---


## 背景  


这次比赛又翻车了，我第二题想复杂了，做了一个小时。  
其实如果你第二题会做，第四题就也会做，两个思路一样。  


A: 枚举、前缀和  
B: 贪心枚举最值、数学公式  
C: 动态规划  
D: 贪心枚举  


排名：196  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、变长子数组求和  


题意：给一个数组，求所有子数组 `nums[i - nums[i], i]` 之和的总和。  


思路1：枚举所有子数组，遍历求和。  
复杂度：`O(nm)`  


思路2：预处理前缀和，枚举所有子数组，根据前缀和快速计算子数组和。  
复杂度：`O(n)`  


## 二、最多 K 个元素的子序列的最值之和  


题意：给一个数组，返回所有长度最多为 k 的 子序列 中 最大值 与 最小值 之和的总和。  


预处理：子序列不关心顺序，先对数组排序。  
相等元素大小定义：右边的大于左边的。  


思路1：贪心枚举最值。  


分别枚举最大值和最小值为 `nums[i]` 的子序列个数，值乘以个数求和就是答案。  


对于最大值，子序列只能选择左边的元素，方案数为分别选择 `[0,k-1]`个。  
对于最小值，子序列只能选择右边的原则，方案数为分别选择 `[0,k-1]`个。  


```cpp
for (int i = 1; i <= n; i++) {
  ll v = nums[i - 1];
  for (int k = 1; k <= K; k++) {
    // 枚举最大值: [1, i-1]里面选择 k-1 个
    ans = (ans + v * C(i - 1, k-1)) % mod1e7;
    // 枚举最小值: [i+1, n] 里面选择 k-1个
    ans = (ans + v * C(n - (i + 1) + 1, k-1)) % mod1e7;
  }
}
```


思路2：数学公式  


比赛的时候，我是同时枚举最大值和最小值的，然后推导出一个很复杂的数学公式。  


假设最小值为 `nums[l]`, 最大值为 `nums[r]`，则我们可以在 `(l+1, r-1)` 里面分别选择 `[0,k-2]`个数字。  
假设选择 kk 个数字，则枚举的一个答案就是：  `(nums[l] + nums[r]) * C(r-l-1, kk)`  


l 固定，r 属于 `i=[l+1, n]` 展开，答案如下：  


```cpp
  sum((nums[l] + nums[i]) * C(i-l-1, kk))
= nums[l] * sum(C(i-l-1, kk)) +  sum(nums[i] * C(i-l-1, kk))
=  nums[l] * sum(C(j, kk))  // j = [0, n-l-1]
  +sum(nums[i] * C(i-l-1, kk))
```


其中 `nums[l] * sum(C(j, kk))` 是左边界相关的答案，可以通过预处理 `C(j, kk)`的前缀和，从而枚举左边界计算出答案。  
其实这个公式转换一下，就是上面思路1枚举最小值的公式。  
区别是，思路1是直接在右区间挑选 `k-1` 个数字，当前的公式是确定右边界，然后在区间内挑选`k-2`个数字，两个答案是等价的。  


右有半部分 `sum(nums[i] * C(i-l-1, kk))` 里面 `i` 与 `l` 耦合，我们需要对左边界 l 进行展开，然后基于 i 进行聚合，一通计算，推导出于左边界类似的公式。  


```cpp
  sum(nums[i] * C(i-l-1, kk)) // l=[1,n]
= nums[i] * sum(C(i-l-1, kk))
```

这个公式与左边界公式对称，是右边界公式，所以也可以通过前缀和优化快速解决。  
通过数学公式，我通过这道题时已经 11点40了。  


## 三、粉刷房子 IV  


题意：给一个长度为`2n`的数组，以及每个位置三个颜色的代价，问相邻位置以及中心对称位置颜色不同，完成染色时最低成本是多少。  


思路：动态规划。  


把数组当做是 `2*n` 的二维数组，则题意转化为了上下左右颜色都不能相同的最低颜色成本。  


状态定义：`f(n,a,b)` 第n个位置上面颜色为 a 下面颜色为 b 时，前面都完成染色的最低成本。  


状态转移方程：  `f(n,a,b) = cost(n,a,b) + min(f(n-1,aa,bb))`  



## 四、最多 K 个元素的子数组的最值之和   


题意：给一个数组，返回所有长度最多为 k 的 子数组 中 最大值 与 最小值 之和的总和。  


思路：与第二题的差异是子序列变成了子数组。  
我第二题的思路是枚举左右边界，此时再去枚举左右边界，发现无法推导出数学公式了。  


赛后我看了下大家第二题的思路，发现是枚举最大值与最小值，那显然，第四题是一模一样的。  



枚举最大值，则向左右找到最远的边界 L 与 R，使得区间 `[L, R]` 内当前值是最大值。  
假设做区间有 A 个元素，右区间有 B 个元素，如果 K 不做限制的话，显然方案有 `(1+A) * (1+B)` 个。  


这里 K 有限制，所以需要分情况讨论。  
显然，A 和 B 的个数最多为 `K-1`，超过了需要进行截断。  
左区间枚举`[0,A]`，看右半部最多有多少个。  
可以发现，右区间分为两部分：一开始由于`B<K-1`，所以最多都是可以选择 B 个。  
知道左边为 `k - (B + 1)` 个时，右边开始从 B 递减，递减到 `0` 或者 `k - (B + 1)-A`。  


总结一下就是，枚举左区间，右区间的方案书分为两部分，一部分都相等，一部分是递减连续数列，分别求和即可。  


如何根据一个位置找到左右边界呢？  
最简单的方法是维护一个单调栈，即可均摊复杂度 `O(1)` 找到边界。  
如果没想到单调栈的话，可以使用线段树+二分查找来找到边界。  



综合复杂度：  
单调栈 `O(n)`  
线段树 `O(n log(n) log(n))`  


## 五、最后  


这次比赛又想复杂了，导致只做出三道题。  
第二题与第四题在我看来是完全一样的，第二题能想到最大值与最小值分开处理，第四题也是一样的方法。  


总结下如下：  
1）谈到子序列，则不关心顺序，优先对数组排序。  
2）谈到求和，如果可以分别求和，则分别处理，会更简单。  
3）求最值覆盖的区间，可以使用单调栈。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  