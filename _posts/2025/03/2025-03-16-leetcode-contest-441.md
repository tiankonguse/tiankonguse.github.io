---
layout: post
title: leetcode 第 441 场算法比赛
description: 会做，但是没做出来  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-03-16 12:13:00
published: true
---

## 背景

这次比赛题目都在我的能力范围之内，但是最后一题没想清楚，所以比赛之后才做出来。  


A: 贪心  
B: 分组+二分   
C: 二分+01背包   
D: 数位DP   


排名：200+   
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、删除后的最大子数组元素和  


题意：给一个数组，删除一些元素，问删除后选择一个非空子数组，使得子数组和最大。  


思路：贪心  


虽然题目说的是子数组，但是与子序列等价，因为子数组中无关的元素可以都删除了。  


对于子系列，显然需要选择所有的正整数。  
因此对数组排序，如果最大的元素是负数，则答案是最大的元素。  
否则，答案是所有正整数去重的和。  


复杂度：`O(n log(n))`  


## 二、距离最小相等元素查询  


题意：给一个元素和若干查询，对于每个查询，查找值相同位置不同的元素的最小距离。  


思路：分组+二分  


预处理：按值对下标进行分组。  
查询：值只出现一次是没答案，否则二分查找找到查询下标的位置。  
最短距离肯定是前一个和后一个，分别求出来距离，然后取最小值。  


注意事项：如果下标在边界，需要特殊处理。  
在最前面，前一个是最后一个。  
在最后面，后一个是第一个。  


复杂度：`O(q log(n))`


```cpp
ans[i] = INT_MAX;
auto it = lower_bound(vec.begin(), vec.end(), j); //肯定存在

auto nextIt = it;
nextIt++;
if (nextIt != vec.end()) {  // 下一个
  ans[i] = min(ans[i], Dis(j, *nextIt));
} else {
  ans[i] = min(ans[i], Dis(j, vec.front()));
}
if (it != vec.begin()) {  // 上一个
  auto preIt = it;
  preIt--;
  ans[i] = min(ans[i], Dis(j, *preIt));
} else {
  ans[i] = min(ans[i], Dis(j, vec.back()));
}
```


## 三、零数组变换 IV  


题意：给一个数组和一些操作，每个操作是对一个区间内的某些元素加上指定的值。  
问从前到后处理，最少需要多少次操作，使得数组中所有元素都为 0。  


思路：二分+01背包  


二分操作次数，然后判断是否可以满足。  


```cpp
int l = 0, r = q;
while (l < r) {
  int mid = (l + r) / 2;
  int ret = Check(mid);
  if (ret) {
    r = mid;
  } else {
    l = mid + 1;
  }
}
if (l == q) return -1;
return l + 1;
```


对于每个位置的元素，选出命中的区间的值，则问题转化为 01 背包问题。  


```cpp
auto Check = [&](int mid) -> bool {
  for (int i = 0; i < n; i++) {
    int v = nums[i];
    if (v == 0) continue;
    if (CheckV(i, v, mid)) continue;
    return false;
  }
  return true;
};
```

01 背包两层循环即可，V 需要从后到前循环。  


```cpp
vector<int> weights(q);
vector<int> dp(q * 10);
auto CheckV = [&](int p, int V, int mid) -> bool {  // 检查一个是否满足
  weights.clear();
  // queries 中选择前 mid 个区间
  for (int i = 0; i <= mid; i++) {
    auto& v = queries[i];
    int l = v[0], r = v[1], val = v[2];
    if (p < l || p > r || val > V) continue;
    if (val == V) return true;  // 剪枝
    weights.push_back(val);
  }
  //  01背包， V 需要刚好填满
  dp.clear();
  dp.resize(V + 1, 0);
  for (auto v : weights) {
    for (int i = V; i >= v; i--) { //01背包逆序，完全背包正序
      dp[i] = max(dp[i], dp[i - v] + v);
    }
  }
  return dp[V] == V;
};
```


复杂度：`O(log(k) * 10 * 10^3 * 10^3)`  

 
看榜单，前几名一大半都是使用 bitset 来做的。  


这道题是简化版的 01 背包，即容量与价值相等，目标是背包恰好装满。  


前 i 个物品已经选择了，则可以组合出 I 个容量。  
新加入一个物品后，不选择新物品，则依旧是之前的 I 个容量。选择新物品，则所有容量都加上新物品的容量。  
这个其实就求两个集合的并集。  


01 背包的做法是进行双层循环，进行两两组合，时间复杂度是 `O(n^2)`。  
如果使用 bitset，则只需要一层循环即可完成两两组合。  


```cpp
vector<bitset<1001>>dp(n);
for(int i=l; i<=r; i++){
  dp[i] = dp[i] | (dp[i]<<x);
}
```


不过使用 bitset 理解难度会增加，复杂度只是进行了常数优化，建议大家还是学一下 01 背包。  



## 四、统计美丽整数的数目  


题意：问一个区间内美丽数字的个数。  
美丽数字定义：每一位上的数字的乘积若可以被这些数字之和整除，则为美丽数字。  


思路：数位DP  
其实属于入门级别的数位DP。  


数位DP一般需要定义两个状态，一个是含边界的状态，一个是不含边界的状态。  
边界状态定义：`dpBound(pos, sum, num2, num3, num5, num7)`  
不含边界状态定义：`dpFull(pos, sum, num2, num3, num5, num7)`  


假设输入是 12345，pos 为 1， 剩余的值是 `x=2345`，最高位值是 `maxVal=2`。  
边界状态指的是第 `pos=1` 位只能选择 `[0,1,2]`，后续的最大值只能是 `234`，即值范围是 `[0, 234]`。  
不含边界状态指的是在之前已经选择了较小的值，后续的值任意选择都不会大于边界，值的范围是 `[0, 999]`。  


`dpBound` 边界状态转移方程分为几种情况：  


1）最高号位选择 0，后续任意选择，进入状态 dpFull
2）非最高位选择0，边界为0，后续都是答案，共 x 个 `x=2345`。  
3）非最高位选择0，边界非0，后续`[0,999]`都是答案，共 `10^3`个。  
4）遍历 `[1,maxVal)`, 后续任意选择，进入状态 dpFull  
5）选择 maxVal，后续已经有边界，进入子状态 dpBound  


其中第4步和第5步需要更新 `sum, num2, num3, num5, num7`。  
假设选择的值是 v，sum 直接相加。  
2,3,5,7 需要根据 v的质因数分解，累计个数。  


`dpFull` 不含边界状态转移方程简单一些。  


1）最高位选择0，后续任意选择，进入状态 dpFull  
2）非最高位选择0，后续`[0,999]`都是答案，共 `10^3`个。  
3）遍历 `[1,9]`, 后续任意选择，进入状态 dpFull  


如果直接这样做，会发现 num2 最多有32个，空间复杂度比较高。  
但是考虑到 sum 范围是 `[1,99]`，num2 最多只有 8 个(值为64)，num3 最多只有 4 个(只为81)，num5 最多有 2 个（只为25），num7 最多只有 2 个（值为49）。  
故压缩之后，只需要 `(1+8)*(1+4)*(1+2)*(1+2)=405` 个状态。  


```cpp
void MergeMul(int& V, const int base, int& num, const int maxNum) {
  while (V % base == 0) {
    if (num + 1 == maxNum) {
      break;
    }
    num++;
    V /= base;
  }
}

MergeMul(V, 2, tmp2, max2);
MergeMul(V, 3, tmp3, max3);
MergeMul(V, 5, tmp5, max5);
MergeMul(V, 7, tmp7, max7);
```


空间复杂度：`O(405*maxSum*maxLen)` ，数量级最高为 `4e5`。  
时间复杂度：状态转移有10次，也不大，数量级最高位 `4e5`  


## 四、最后  


这次比赛后两题都是动态规划，现在 leetcode 的动态规划题越来越多了，大家要加油了。  



《完》

-EOF-

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  

