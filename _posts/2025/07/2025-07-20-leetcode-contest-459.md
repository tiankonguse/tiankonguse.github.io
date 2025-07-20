---
layout: post
title: leetcode 第 459 场算法比赛
description: 几何触发我的盲区了 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-07-20 12:13:00
published: true
---

## 零、背景


这次比赛应该不难，不过几何题触发我的算法盲区了，现场推导了怎么计算向量、直线计算、直线储存，和区分方法，推导完之后，一下就通过了。    


A: 简单数学    
B: 前缀和统计  
C: 线段树    
D: 简单几何    


排名：200+ 
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、判断整除性  



![](https://res2025.tiankonguse.com/images/2025/07/20/001.png)  


题意：给一个数字，问是否可以被各位之和与各位之积的和整除。  


思路：按题意计算即可。  


```cpp
ll a = 0, b = 1;
int nn = n;
while (nn) {
  ll c = nn % 10;
  a += c; // 各位之和
  b *= c; // 各位之积
  nn /= 10;
}
return n % (a + b) == 0;
```


## 二、统计梯形的数目 I  


![](https://res2025.tiankonguse.com/images/2025/07/20/002.png)  


题意：给n个坐标顶点，问可以组成多少个水平平行的梯形。  


思路：前缀和。  


水平平行，说明需要分别选两个相同的 y 坐标的顶点，但是两个水平线不能重合。  


故可以预先统计所有 y 坐标的顶点个数，然后枚举每个 y 坐标，计算与之前的 y 坐标可以组成多少个梯形。  


一个 y 坐标有 k 个顶点，则可以选择 `C(k,2)`个组合组成经过当前 y 坐标的水平线。  
如果之前共有 `pre` 个水平线，则可以组成 `pre * C(k,2)`个梯形。  


```cpp
ll ans = 0;
unordered_map<int, ll> H;
for (auto& p : points) {
  H[p[1]]++;
}
ll pre = 0;
for (auto [_, cnt] : H) {
  ll now = cnt * (cnt - 1) / 2 % mod;
  ans = (ans + pre * now) % mod;
  pre = (pre + now) % mod;
}
return ans;
```


## 三、位计数深度为 K 的整数数目 II  


![](https://res2025.tiankonguse.com/images/2025/07/20/003.png) 


题意：给一个支持修改的数组，问区间内有多少个数字的位计数深度等于 k。  
位计数深度：不断求数字中1的个数，直到值为1。  


思路：线段树  


可以发现，位计数深度不会超过 6，可以创建6个线段树，分别在对应的线段树中进行区间查询即可。  
在旧的线段树中删除，在新的线段树中更新即可。    


注意事项：`__builtin_popcount` 是求 `int32`整数1的个数，对于`int64`，需要使用 `__builtin_popcountll`。  



```cpp
for (auto& q : queries) {
  const ll t = q[0];
  if (t == 1) {
    const ll l = q[1] + 1, r = q[2] + 1, k = q[3];
    if (k >= maxDepth) {
      ans.push_back(0);
    } else {
      ans.push_back(segTree[k].QuerySum(l, r));
    }
  } else {
    const ll idx = q[1] + 1, newVal = q[2];
    const ll oldVal = nums[idx - 1];
    const int oldDepth = GetDepth(oldVal);
    const int newDepth = GetDepth(newVal);
    if (oldDepth < maxDepth) segTree[GetDepth(oldVal)].Update(idx, -1);
    if (newDepth < maxDepth) segTree[GetDepth(newVal)].Update(idx, 1);
    nums[idx - 1] = newVal;
  }
}
```


## 四、统计梯形的数目 II


![](https://res2025.tiankonguse.com/images/2025/07/20/004.png) 


题意：给n个坐标顶点，问可以组成多少个一对边平行的凸四边形。   


思路：简单几何  


与第二题的区别是平行对边可以是斜的。  


所以需要找到两个指标，一个代表斜率，从而找到所有平行线段，一个代表直线，排除掉在相同直线的线段。  


小技巧：可以找到直线方程`ax+by+c=0`，直接使用`(a,b)`二元组当做斜率，`(a,b,c)`当做直线。  



```cpp
for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    ll x1 = points[i][0], y1 = points[i][1];
    ll x2 = points[j][0], y2 = points[j][1];
    
    // 计算直线 ax+by+c=0, a>=0, gcd(a,b)=1
    const tuple<ll, ll, ll> line = {a, b, c};
    const tuple<ll, ll> parallelLine = {a, b};
    ans1 += parallelLines[parallelLine] - lines[line];
    parallelLines[parallelLine]++;
    lines[line]++;
  }
}
```


另外，可以发现平行四边形会重复计算一次答案，所有还需要计算出平行四边形的个数。  


平行四边形与梯形的区别在于，梯形不要求平行对边长度相等，而平行四边形要求对边长度相等。    
故需要三个指标：有长度的斜率、代表可能组成平行四边形的线段；有长度的直线，排除在相同直线上的线段。  


```cpp
for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    ll x1 = points[i][0], y1 = points[i][1];
    ll x2 = points[j][0], y2 = points[j][1];
    // 第一步，计算出向量
    const ll dx = x2 - x1, dy = y2 - y1;
    // 第二步：计算出向量的长度的平方
    const ll len2 = dx * dx + dy * dy;
    
    // 计算直线 ax+by+c=0, a>=0, gcd(a,b)=1
    // 计算平行四边形的个数
    const tuple<ll, ll, ll, ll> segment = {a, b, c, len2};
    const tuple<ll, ll, ll> parallelSegment = {a, b, len2};
    ans2 += parallelSegments[parallelSegment] - segments[segment];
    parallelSegments[parallelSegment]++;
    segments[segment]++;
  }
}
```

可以发现，平行四边形计算的答案也是重复的，刚好多计算一倍，所以需要除2。  


```cpp
return ans1 - ans2 / 2;
```


根据两点，怎么求直线呢？  
可以直接套用公式。   


```cpp
// 第一步，计算出向量
const ll dx = x2 - x1, dy = y2 - y1;
// 第二步：计算出向量的长度的平方
const ll len2 = dx * dx + dy * dy;
// 第三步：规范化向量，来代表斜率
const ll g = Gcd(abs(dx), abs(dy));
const ll nx = dx / g, ny = dy / g;
// 第四步：直线使用 ax + by + c = 0 来表示，其中 a,b,c 为整数，且 a,b 互质
const ll a = ny, b = -nx, c = nx * y1 - ny * x1;
```


## 五、最后  


这次比赛第三题被`__builtin_popcount`坑了，第四题是我第一次做计算几何题，一直在思考如何唯一标识一个斜率和直线。  
最后才意识到可以使用`ax+by+c=0`，不过那时候只剩下几分钟结束比赛了。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
