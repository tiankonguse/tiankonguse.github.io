---   
layout:  post  
title: leetcode 第 375 场算法比赛  
description: 第三题扩展一下，就变得比较难了。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData:  2023-12-10 18:13:00  
published: true  
---  


## 零、背景  


周末早上我七点之前就出门去练车了，所以就没参加比赛。  


中午趁着天热回来休息的时间，做了一下比赛题，写一下题解。  


A: 循环签到题。  
B: qpow模板题。  
C: 统计枚举题，枚举左边界，计算右边界。  
D: 区间合并题，扫描区间，扩充右边界。  


总结：难度不大，第三题扩展一下就变得比较难了。  


比赛代码:  
https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、统计已测试设备  


题意：遍历数组，如果值大于后，则后面所有数字的值减一。  
问共进行多少次减一。  


思路：记录前面减一的次数，循环判断是否还能减一即可。  


## 二、双模幂运算  


题意：给一个数组，问满足 `((a^b % 10)^c) % m == target` 的个数。  


思路：直接计算复杂度是`O(b * c * n)`  
使用快速幂`qpow`进行优化，复杂度可以降为 `O(n log(b) log(c))`  


快速幂：基于二进制思想进行优化。  


## 三、统计最大元素出现至少 K 次的子数组  


题意：给一个数组，问数组的最大值至少出现 k 次的子数组有多少个。  


思路：先循环计算出最大值，并循环统计最大值的位置。  
枚举子数组中最大值的左边界，统计有多少个后缀满足要求，累加即可。  


例如第一个样例数组是 `1,3,2,3,3`，k 是 2。  
预处理可以得到 最大值是 3，出现的下标是 `1, 3, 4`。  


枚举最大值的左边界分别为`1, 3, 4`的情况。  


左边界为下标 `1`，最少 2 个最大值时最小右边界为 `3`，所以`[1,3]`为满足要求的最小子数组。  
看下标`1`的左边，都小于最大值，有 `l=1` 个，加进来都满足要求。  
看下标`3`的右边，都不大于最大值，有 `r=1` 个，加进来都满足要求。  
左边右边组合加进来，共有`(l+1)*(r+1)`中 4 种方案。  


左边界为下标`3`，最少 2 个最大值时，最小的右边界为 `4`,所以`[3,4]`为满足要求的最小子数组。 
看下标`3`的左边，有 `l=1` 个数字小于最大值。  
看下标`3`的右边，有 `r=0` 个不大于最大值。  
左边右边组合加进来，共有`(l+1)*(r+1)`中 2 种方案。  


左边界为下标`4`，最少 2 个最大值时，最小的右边界不存在，故这个左边界没有满足要求的方案数。  


所有左边界的方案数求和，就是答案。  


## 四、统计好分割方案的数目  


题意：给一个数组，将数组分割成一个或多个 连续 子数组，如果不存在包含了相同数字的两个子数组，则认为是一种 好分割方案 。  
返回 数组 的 好分割方案 的 数目。  


思路：不存在包含相同数字的两个子数组，意味着相同数字必须在同一个子数组中。  
相同数字的左边界和有边界组成一个区间，就是求区间的合并。  


合并后，没有交集的区间个数为 n，则方案数为 `2^(n-1)`个。  


方案推导：假设 `n-1` 个区间的方案数为 `f(n-1)`。  
增加一个区间，可以选择与最后一个区间当做一个子数组，也可以单独当做子数组，故有`2*f(n-1)`种方案。  
推到展开，即为`2^(n-1)`种方案。  


区间合并：预处理每个数字的左右区间。  
第一个数字确定一个左右边界，枚举左右边界内的所有数字，判断是否可以得到更大的右边界。  
当枚举到右边界时，代表合并完成。  


```
int num = 0;
for (int i = 0; i < n;i++) {
  int l = i, r = MaxRight[nums[i]];
  while (l < r) {
    r = max(r, MaxRight[nums[l]]);
    l++;
  }
  i = r;
  num++;
}
return qpow(2, num-1, mod);
```


## 五、最后  


这次比赛都不难，第三题扩展一下，大家可以思考一下怎么做。  


原题：问数组的最大值至少出现 k 次的子数组有多少个。  
扩展：所有子数组中满足子数组的最大值至少出现k次的个数。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  
