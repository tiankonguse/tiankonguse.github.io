---
layout: post  
title: leetcode 第 424 场算法比赛  
description: 二分贪心。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData: 2024-11-17 12:13:00  
published: true  
---


## 零、背景  


这次比赛最后一题比较难，贪心思路不好想，但想到就会简单很多。   


A: 前缀和    
B: 区间加减    
C: 二分区间加减    
D: 二分贪心    


排名： 287   
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/424  
 

## 一、使数组元素等于零  


题意：给一个数组，找到所有的0值元素，进行移动可以使得数组的元素值都为0。  
移动规则：一个方向遇到非0值，对其减一，反向转向，直到走出边界。  


思路：前缀和。  


分析：移动每次可以使得当前方向的值减1。  
两个方向减的值最终要么相等，要么差1。  


故可以统计前缀和与后缀和，如果和相等或者差1，就代表有答案。  


## 二、零数组变换 I  


题意：给一个数组，N个区间操作，每次操作可以对区间内的某些元素减一，问最终是否可以把整个数组的元素值都修改为0.  


思路：区间加减。  


如果不是对区间内某些元素减一，而是对整个区间的所有元素减一。  
最后某些元素的值依旧大于0，则肯定没答案，否则存在答案。  


构造答案的一种方案：对于一个元素值，假设值为 v，只在覆盖这个元素的前 v 的区间里进行减一，之后的区间都不减一即可。  


算法1：线段树。  
一次进行区间减操作，最后判断每个元素的值是否大于0。  
复杂度：`O(n log(n))`  


算法2：左加右减。  
对于区间所有元素求和，可以通过左加右减来快速求出每个元素的值。  
复杂度：`O(n)`  


细节：定义累计数组 `flag`。  
对区间`[l,r]`加1时，对 `flag[l]++`，对`flag[r+1]--`。  
游标累计 flag 的前缀和，代表覆盖当前元素的区间个数。  


```cpp
 vector<ll> ops(n + 1, 0);
 for (auto& q : queries) {
   int l = q[0];
   int r = q[1];
   ops[l]--;
   ops[r + 1]++;
 }

 ll pre = 0;
 for (int i = 0; i < n; i++) {
   pre += ops[i];
   if (nums[i] + pre > 0) return false;
 }
 return true;
```


## 三、零数组变换 II  


题意：给一个数组，N个区间操作，每个区间可以对区间内的某些元素最好减去 val，问最少使用多少个操作，可以把数组的所有元素值都修改为0。  


思路：二分+区间加减。  


与第二题类似，二分操作的个数，判断是否有答案即可。  


线段树复杂度：`O(n log(n) log(n))`  
左加右减：`O(n log(n))`  



```cpp
vector<ll> ops;
auto Check = [&nums, &queries, &ops](int mid) {
  int n = nums.size();
  ops.clear();
  ops.resize(n + 1, 0);
  for (int i = 0; i <= mid; i++) {
    int l = queries[i][0];
    int r = queries[i][1];
    ll val = queries[i][2];
    ops[l] -= val;
    ops[r + 1] += val;
  }
  ll pre = 0;
  for (int i = 0; i < n; i++) {
    pre += ops[i];
    if (nums[i] + pre > 0) return false;
  }
  return true;
};
```


## 四、最小化相邻元素的最大差值  


题意：给一个数组，某些位置值是-1。  
现在选择两个数字x和y，某些值为-1的位置替换为x，某些值为-1的位置替换为y，问如何选择x和y，才能使得替换后相邻元素的绝对差值的最大值最小。  


思路：最大值的最小，典型的二分。  
二分答案，得到一个最大的绝对差值 k，判断是否可以构造出x和y。  


首先，对于相邻两个元素都不是-1的元素，差的绝对值是固定的，二分小于这些值时，显然没答案。  
所以需要找到所有固定的相邻差值，取最大值，当做二分的最小边界。  


对于存在值为-1的区间，分三种情况。  


情况1：只有一个-1，左右都是非-1，此时只能填入一个数字x或者y。  
情况2：至少两个连续的-1，再左右都是非-1,此时可以只填入一个数字，也可能填入两个数字。   
情况3：-1前缀与-1后缀，可以当做两边非-1数字相等，则等价与情况1，只需要填入一个数字。  


对于这些情况，可以使用两个数据结构储存：`vector<pair<int,int>> one, two`。  
one 中储存只需要一个数字的区间`[a,b]`，值是左右首个非-1数字。  
two 中储存需要至少两个数字的区间`[a,b]`，值是左右首个非-1数字。  


先看只有一个数字是该如何解决。  


如果只有一个数字x，最大绝对差值为 k 时，所有区间`[a,b]` 需要满足 `b-k<=x<=a+k`。   


如果有2个数字x和y时，情况就会变得复杂。  


对于所有的情况1，即所有区间中，每个区间要么满足x，要么满足y。     


```
b0-k<=x<=a0+k | b0-k<=y<=a0+k
b1-k<=x<=a1+k | b1-k<=y<=a1+k
...
bn-k<=x<=an+k | bn-k<=y<=an+k
```


例如 `2 -1 4 ... 100 -1 102`，x 是 3， y 是 101 ，绝对值差最优是 1。  


而对于情况2，则需要额外考虑一种情况：`a <=x<=y<=b`。  
例如 `2 -1 -1 5`, x 是 3，y 是 4时，差绝对值最优时1。  


所有边界情况都考虑清楚了，算法却不好想出来。  


这是因为我们每次都是单独看一个区间的。  
如果整理看所有区间，只看左边界x，则是  


```
x<=a0+k
x<=a1+k
...
x<=an+k
```

显然， x 不能大于 `min(ai+k)`，最优值其实就是`min(ai)+k`。  
同理，y 不能小于 `max(bi-k)`，最优值其实就是`max(bi)-k`。  


有了 x 和 y 的最优值，判断所有区间是否满足要求即可。  


复杂度：`O(n log(n))`  


```cpp
bool Check(ll k) {  // 取两个值, x 取最小值+k， y 取最大值-k
  ll minVal = INT_MAX;
  ll maxVal = 1;
  for (auto [a, b, num] : emptys) {
    minVal = min(minVal, a);
    maxVal = max(maxVal, b);
  }
  ll x = minVal + k;
  ll y = maxVal - k;
  for (auto [a, b, num] : emptys) {
    if (abs(a - x) <= k && abs(b - x) <= k) continue;
    if (abs(a - y) <= k && abs(b - y) <= k) continue;
    if (num == 1) return false;
    if (abs(a - x) <= k && abs(b - y) <= k && abs(x - y) <= k) {
      continue;
    }
    return false;
  }
  return true;
}
```


## 五、最后  


这次比赛最后一题可以直接贪心推导出x和y的值，我比赛中没有想到，比赛后也没有想到，看了题解才明白这个思路。  


想了想，再给我一次机会，我应该也想不出来这个贪心性质吧。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

