---
layout: post  
title: leetcode 第 431 场算法比赛，翻车了 
description: 不要自己写区间合并。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData: 2024-12-29 12:13:00  
published: true  
---


## 背景  


这次比赛有难度，比赛期间我手工进行区间合，结果各种特殊情况，最后也没合并出来，赛后使用二分查找，10分钟就过了。  


A: 找规律  
B: 循环匹配 
C: 区间合并、二分查找、线段树  
D: 离散化+动态规划  


排名：200以后  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## Q1. 最长乘积等价子数组  


题意：给一个数组，求最长的子数组，使得子数组的各元素乘积等于最小公倍数乘以最大公约数。  


思路1：暴力枚举  
值域是 `[1,10]`，最小公倍数就是 15120， 最大公约数是 10，合起来乘积最大是 151200。  
故可以枚举所有子数组，判断是否是答案，当前缀的乘积大于 151200 时，后面不可能是答案。  


思路2：找规律  
比赛看错题了，以为数据范围很大，所以就去分析有啥规律。  


显然，长度为2的的子数组肯定满足情况。  
对于长度大于 2 的子数组，如果所有元素互相互质，最大公约数是1，最小公倍数就是元素之积，显然满足。  
当存在两个元素非互质时，可以证明，肯定不满足。  


假设非互质的元素为 `a*b` 和 `a*c`，其他元素为 d，所有元素乘积为 `A=a*a*b*c*d`。  
如果`gcd(a,d)==1`，则最小公倍数为 `lcm=a*b*c*d`，显然小于 A。  
如果 `g=gcd(a,d)>1`，则最小公倍数为 `lcm=a*b*c*d/g/g`。 `lcm*gcd=a*b*c*d/g`，显然小于 A。  
证明结束。  


元素个数为 `1e2` 时，可以枚举所有子数组，然后判断是否互质。  
复杂度： `O(n^3)`  


元素个数为`1e3`时，可以预处理任意元素之间是否互质，以及左边首个非互质的位置。  
复杂度：`O(n^2)`  


元素个数大于`1e4`时，就需要使用筛法预处理每个元素的素数因子，从而利用前缀信息，计算出每个元素的左边首个非互质的位置。  
计算当前元素答案时，可以复用上一个元素的答案。  
预处理复杂度：`O(n log(n))`  
计算答案复杂度：`O(n)`  


```cpp
P[p] 含素数 p 因子的最大下标
L[i] = max(P[p]) 位置i左边首个非互质位置 
ans[i] = min(ans[i-1]+1, i-L[i]);
```

## Q2. 计算字符串的镜像分数  


题意：给一个字符串，两两匹配，求总匹配得分。  
匹配规则：字符 a 与 左边字符 `26-a` 进行匹配。  


思路：循环匹配即可，未匹配上时储存起来。  
复杂度：`O(n)`  



## Q3. 收集连续 K 个袋子可以获得的最多硬币数量


题意：给一个坐标轴，默认值都是0。  
现在将一些区间进行设置值，问长度为K的固定区间进行滑动，问覆盖的坐标点的最大和。  


思路1：滑动窗口。  
使用双写队维护线段列表。  


新的队列入队，分情况讨论。  

1）先计算队列从左边作为起始位置的和，更新答案。  
2）判断左边全删除，剩余的是否大于 K，大于了，删除，重新计算左边起点的答案。  
3）否则，左边保留部分，使得队列大小恰好为 K，更新答案。  


复杂度：`O(n)`  


思路2：二分查找  


显然，对与最优答案区间K，要么是与线段的左端点对齐，要么是与线段的右端点对齐。  
故可以枚举每个线段左端点 L 为起点，计算出区间K的右端点 R。  
然后二分查找右边界大于 R 的线段 P。  
显然，答案分为两部分：前面的完整线段，线段 P的左部分。  


前面的完整线段和，可以通过预处理前缀和，然后前缀和求差得到区间和。  
线段 P的左部分，根据 R 与 P 左端点的关系，计算出需要占用几个点即可。  



对于每个线段的右端点的答案，对所有线段进行镜像反转后，就是求左端点的答案了。  


复杂度：`O(n log(n))`



思路3：离散化线段树  
对线段进行离散化，直接求区间和接口。  
注：由于区间无相交，无需离散化。  


复杂度：`O(n log(n))`  


```cpp
sort(coins.begin(), coins.end());
segTree.Init(coins);
segTree.Build();
ll ans = 0;
for (auto& coin : coins) {
  int l = coin[0], r = coin[1];
  ans = max(ans, segTree.QuerySum(l, l + k - 1));
  ans = max(ans, segTree.QuerySum(r - k + 1, r));
}
return ans;
```


线段树可以直接使用离散化前的区间来进行查找。  


```cpp
ll QuerySum(ll L, ll R, int l = 1, int r = maxNM, int rt = 1) {
  const auto [PL, PR, PS] = sumVal[rt];
  if (L <= PL && PR <= R) {  // 包含
    return PS;
  }
  if (l == r) {  // 叶子不包含，部分相交
    const auto [PL, PR, PV] = str[l];
    if (L <= PL) {  // 前缀
      return PV * (min(R, PR) - PL + 1);
    } else {  // 非前缀, 包括后缀 与 包含
      return PV * (min(R, PR) - max(PL, L) + 1);
    }
  }
  int m = (l + r) >> 1;
  ll ret = 0;
  if (L <= get<1>(str[m])) {
    ret += QuerySum(L, R, lson);
  }
  if (get<1>(str[m]) < R) {
    ret += QuerySum(L, R, rson);
  }
  return ret;
}
```

## Q4. 不重叠区间的最大得分


题意：给一些带权重的区间，问选择1到4个不相交的区间，可以得到的最大权重和是多少。  


思路：离散化+动态规划。  


状态定义：`f(k,r)` r 之前选择 k 个不相交区间的最大权重。  
状态转移方程：  


```cpp
// [l,r,w]
f(k+1,r) = max(f(k+1,r), f(k+1,r-1))
f(k+1,r) = max(f(k+1,r), f(k, l-1) + w)
```


可以看到，计算`f(k+1, r)` 依赖 `f(k+1, r-1)`，故需要对区间按右端点进行排序。  


另外，由于坐标的数据范围很大，可以对坐标进行离散化。  
对于 `r-1` 和 `l-1` 需要二分查找，找到上个右端点。  
故复杂度为：`O(4n log(n))`  


```cpp
pair<ll, tuple<int, int, int, int>> ans = {0, {}};

for (int k = 0; k < 4; k++) {
  for (auto& node : nodes) {
    auto [r, l, w, p] = node;
    auto ri = lower_bound(nums.begin(), nums.end(), r) - nums.begin();
    if (k == 0) {
      pair<ll, tuple<int, int, int, int>> tmp = {w, {-p, INT_MIN, INT_MIN, INT_MIN}};
      dp[k][ri] = max(dp[k][ri], dp[k][ri - 1]);
      dp[k][ri] = max(dp[k][ri], tmp);
    } else {
      auto li = upper_bound(nums.begin(), nums.end(), l - 1) - nums.begin() - 1;
      auto [wl, vl] = dp[k - 1][li];
      pair<ll, tuple<int, int, int, int>> tmp = {wl + w, Merge(vl, -p)};
      dp[k][ri] = max(dp[k][ri], dp[k][ri - 1]);
      dp[k][ri] = max(dp[k][ri], tmp);
    }
    ans = max(ans, dp[k][ri]);
  }
}
```



## 五、最后  


这次比赛除了第二题，都比较有难度。  
第一题可以暴力枚举，但是数据范围变大后，就会比较难，需要使用筛法进行预处理，最后使用前缀信息快速求答案。  
第三题涉及区间合并，很多边界情况。但是使用二分查找或者线段树，就会简单很多。  
第四题是一个离散化的动态规划，当然，比赛的时候我使用线段树来做的。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  