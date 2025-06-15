---
layout: post  
title: 【算法讲解】字符串 hash 之逆元  
description:  算法比赛中一个基础的知识点。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2023-12-27 18:13:00  
published: true  
---


## 零、背景  


Leetcode 算法比赛的题解中，我经常提到一个字符串 hash 这个算法。  


上面文章《[【算法讲解】字符串 hash](https://mp.weixin.qq.com/s/e5kPXWb989-Op3COSiPA5w)》介绍了最初级的 hash 算法。  


这篇文章稍微介绍一个高级的字符串 hash， 逆元。  


## 一、模运算  


介绍 hash 算法之前，需要先介绍两个模运算的规则。  


逆元：如果存在一个 x, 使得 `(a * x) % p = 1`，则 x 称为 `a % p` 的逆元，记作`a^-1`  


大整数除法：假设 `a/b` 可以整除，但是 `a` 和 `b` 都是大整数，如何求 `(a/b)%p`的答案呢？  


```
 (a / b) % p
= (a / b) % p * 1
= (a / b) % p * (b * b^-1) % p
= ((a / b) *( b * b^-1)) % p
= (a * b^-1) % p
```

由此可以推导出下面的公式。  


```
(a / b) % p = (a * b^-1)%p
```



## 一、前缀 hash  



正常的 hash 左边是高位，右边是低位，如下：  


```
int pre = 0;
for(int i=1;i<=n;i++){
    int vi = Val[i] - '0;
    pre = (pre * 10 + vi) % mod;
    preHash[i] = pre;
}
```


如果左边是低位，右边是高危，则写法如下  


```
int pre = 0;
for(int i=0;i<n;i++){
    int vi = Val[i] - '0;
    pre = (pre + vi * pow(10, i, mod)) % mod;
    preHash[i] = pre;
}
```


## 二、区间 hash


如果我们想要计算字符串区间`val[3,5]`的 hash 值，根据上面的算法，可以推论出  


```
pre[5] = v0*10^0 +v1*10^1 + v2*10^2 + v3*10^3+ v4*10^4 + v5*10^5
preHash[5] = pre[5] % mod

pre[2] = v0*10^0 +v1*10^1 + v2*10^2
preHash[2] = pre[2] % mod


目标 = (v3*10^0+ v4*10^1 + v5*10^2) % mod
    = (pre[5] - pre[2]) / 10^3 % mod
    = ((pre[5] % mod) - (pre[2] % mod)) / 10^3 % mod
    = (preHash[5] - prehash[2]) / 10^3 % mod
```


从上面的公式中可以看到，只需要两个 hash 前缀可以直接相减，之后还需要进行左移若干次。  


PS：上面公式正确性很容易证明，先把 `10^3` 转化为逆元即可证明。  


假设一个数字的逆元记为`inv(a)`，则区间子串的 hash 算法如下  


```
ll RangeHash(int l, int r) { // [l, r]
  l--; //(l, r]
  const int lr = r - l;
  const ll R = preHash[r];
  const ll L = preHash[l];
  return (R - L ) * inv(10^lr) % mod;
}
```


## 三、逆元计算


根据费马小定理，可以知道 `a^(p-1) % p = 1`。  
对 `a^(p-1)` 拆出一个 `a`，即可得出结论 `a * a^(p-2) % p = 1`。  
即 `a` 的逆元是 `a^(p-2)`。  


故我们可以使用快速幂来计算逆元。  


```
ll qpow(ll x, ll v, ll mod) {
  x = x % mod;
  ll y = 1;
  while (v) {
    if (v & 1) y = y * x % mod;
    x = x * x % mod;
    v >>= 1;
  }
  return y;
}
ll inv(ll x, ll mod) { return qpow(x, mod - 2, mod); }
```


## 四、最后  


好了，字符串的两种区间 hash 都介绍完了。  


两种区间 hash 优化后时间复杂度其实是等价的，大家可以根据比赛的实际情况来选择。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

