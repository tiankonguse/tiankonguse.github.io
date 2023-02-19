---   
layout:  post  
title: leetcode 第 330 场算法比赛 未参赛  
description: 祝大家新年快乐。        
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2023-01-29 18:13:00  
published: true  
---  


## 零、背景  

1 月 29 日，我在回深圳的路上，所以没有参加 leetcode 第 330 场周赛。  


这次比赛最后一题，话说有点难，尤其是直接看别人的题解，很难理解为啥那样写，只能自己独立推理出结果后能理解别人的题解。  


## 一、统计桌面上的不同数字  


题意：桌子上方一个正整数 n，按下面规则执行无数次后，问最终桌子上的不同数字个数。  
规则：桌子上任意选一个数字 v，可以将满足 `v%x==1` 且不大于 n 的 x 加入到桌子上。  


思路：取模为 1，代表新数字比选的数字小一。  
每操作一次新增的数字就是最小数字减一，直到最小数字 2 之后不再新增。  
所以桌子上的个数是 `n-1`个。  


注意事项：数字为 1 时，需要特殊处理。  


## 二、猴子碰撞的方法数  


题意：n 个猴子围城一个圆圈，每个猴子可以向左走或者向右走。问有多少中走法，使得至少一对猴子相遇。  


思路：总共有`2^n`种走法。  
只有猴子的方向完全相同时才不会相遇，故只有两种走法不会相遇。  
所以答案是 `2^n - 2`。  


## 三、将珠子放入背包中  


题意：给一个数组，值代表珠子的个数。现在需要将数组划分为 k 个子数组，得分是子数组两端数字的和。  
问最大总得分与最小总得分的差值是多少？  


思路：拆分为 k 个子数组，中间有 `k-1`个分隔线。  
任意一个划分，答案是数组首尾数字之和再加所有分隔线左右的数字求和。  


显然，最大总得分是从所有分隔线里面选择最大的 `k-1`个左右数字之和。  
最小总得分是从所有分隔线里面选择最小的 `k-1`个左右数字之和。  


可以预处理计算出数组的所有分隔线左右数字之和，排序，即可求出最大的和最小的`k-1`个得分之和。  


## 四、统计上升四元组  


题意：给1到n的一个排列。问存在多少四元组`(i, j, k, l)` 使得 `i < j < k < l < n` 且 `nums[i] < nums[k] < nums[j] < nums[l]`。  


思路：假设有一个递增的四元组，将中间两个数字交换就是题目要求的四元组。  


面对这道题，我想了很多方法，都没做出这道题。  
最终看题解，说需要枚举中间两个点，之后才做出这道题。  


枚举中间两个点，即 j 和 k 固定后，问题转化为求 j 坐标左边 小于 `nums[k]` 的个数以及 k 坐标右边大于 `nums[j]` 的个数，相乘就是当前枚举值的方案数。  


面对新的问题，暴力方案很容易想到。  


方法1：暴力统计。  
假设 j 的前缀集合我们已经得到，循环一遍就可以统计个数。  
复杂度：`O(n^3)`  


方法2：二分查找。  
如果集合使用有序数组来储存，通过二分查找也可以统计个数。  
复杂度：`O(n^2 log(n))`  
我使用这个方法，最后一组样例超时了。  


```
vector<ll> pre;
for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    if (nums[i] < nums[j]) continue;
    less[i][j] = upper_bound(pre.begin(), pre.end(), nums[j]) - pre.begin();
  }
  AppendSort(pre, nums[i]);
}
```


方法3：树状数组。  
集合内小于某个数的个数，也可以通过树状数组来统计。  
复杂度：`O(n^2 log(n))`  
我通过这个方法通过了这道题。  


```
treeArray.Init(n);
for (int j = 1; j <= n; j++) {
  int jv = nums[j - 1];
  for (int k = j + 1; k <= n; k++) {
    int kv = nums[k - 1];
    if (jv < kv) continue;
    leftLess[j][k] = treeArray.Query(1, kv);
  }
  treeArray.Add(jv, 1);
}
```


方法4：动态规划。  
对于二分查找和树状数组，可以看到内层循环都是直接固定的集合里查找答案的。  
如果调整内层循环的遍历模式，即可使用动态规划来做这道题。  


状态定义：`dp[i][v]` i 左边小于 v 的个数。  


题解中可以看到两个状态转移方程，我看了半天都没看懂，最终自己推导出一个很容易理解的状态转移方程来。  


状态转移方程：`dp[i][v+1] = dp[i][v] + Has(v)`  
方程含义：左边小于 `v` 的已经统计了，对于小于`v+1`的，只需要判断是否存在 `v` 即可复用之前计算的答案。  


```
vector<int> leftFlag(n + 1, 0);
for (int j = 1; j <= n; j++) {
  for (int v = 1; v <= n; v++) {
    leftLess[j][v] = leftLess[j][v - 1];
    if (leftFlag[v - 1]) {
      leftLess[j][v]++;
    }
  }
  leftFlag[nums[j - 1]] = 1;
}
```


## 五、最后  


这次比赛最后一题有难度，如果参加比赛，我可能做不出来。  


对于四点的枚举值，枚举中间两个点，然后求前后缀，算是套路了吧。  


第四题你做出来了吗？怎么做的？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
