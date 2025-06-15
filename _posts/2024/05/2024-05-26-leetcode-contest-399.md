---
layout: post  
title: leetcode 第 399 场算法比赛 
description:  差一分钟就通过最后1题。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-05-26 18:13:00  
published: true  
---


## 零、背景  


这次比赛其实不难，不过我手速慢了点，最后1题差1分钟就通过了。   


A: 因数分解。   
B: 模拟统计。   
C: 因数分解。  
D: 线段树单点更新。  


排名：386  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/3/399  


## 一、优质数对的总数 I  


题意：两个数组分别选一个数字，问有多少对满足第一个数组的数字可以整除第二个数组数字。  


思路：对于每个数字 x，统计第一个数组中有多少个数字是 x 的倍数。  


预处理出第一个数组的所有因子，统计出每个因子有多少个倍数，复杂度 `O(n sqrt(n))` 
之后枚举数组2，当做因子，对倍数个数求和。  


优化：第二个数组需要乘以k, 反向的，第一个数组必须是k的倍数，否则不需要计算。  
此时，第一个数组满足要求的都除以 k，降低数据范围，从而降低复杂度的常数。  


优化2：数字因数分解有三个思路。  


思路1：暴力枚举，复杂度 `O(n)`  
思路2：枚举`sqrt(n)`个数字，复杂度`sqrt(n)`  
思路3：预处理素数表，计算出质因数与个数，然后排列组合求出所有因子，复杂度为因子的个数。  


因子的模块：https://github.com/tiankonguse/leetcode-solutions/blob/master/doc/math/factor.cpp


## 二、压缩字符串 III  


题意：给一个字符串，前缀相同字符可以压缩为 `nv`， 其中 n 为个数，v 为字符的值。  
问 n 最多不超过 9 时，压缩后的字符串是什么。  


思路：对于相同字符，统计出现的个数。  
一旦字符发生变化，前一个字符每9个一组生成答案即可。  


## 三、优质数对的总数 II  


题意：同第一题  


思路：同第一题  


## 四、不包含相邻元素的子序列的最大和  


题意：给一个数组，每次修改一个元素，问不包含相邻元素的最大子序列和。  


思路：不相邻的子序列和可以使用动态规划思路来做。  


方程如下  


```
f(l,r)=max(V[l] + f(l+2,r), f(l+1,r))
```


简单来说，就是分为是否选择第一个元素来得到子状态。  


这里存在单点修改，修改后，就需要计算受影响的所有状态了。  
受影响的状态个数为 `O((m-1) * (n-m-1))`  
直接更新素有状态，显然会超时。  


再看修改与查询，单点修改，区间查询，显然是线段树模版题。  


此时状态转移方程变成两个子区间的合并。  


先定义一个区间查询函数 `Query(l,r)`。  
对于完整的区间，最优值我们需要实现计算好，记录在 `sum[rt]` 内。  


完整区间的最优值计算如下：  

```
m = (l+r)/2;
f(l,r)=max(
  Query(l, m) + Query(l+2,r),
  Query(l, m-1) + Query(l+1,r),
)
```

对于区间最大值的查询，也是分情况处理  


```
Query(L,R,l,r,rt) = 
if (L == l && R == r) return f(l,r)
return max(
    Query(L, m, lson) + Query(m + 2, R, rson),
    Query(L, m - 1, lson) + Query(m + 1, R, rson)
);
```

我第一版代码就是这样实现的，提交后获得 TLE 超时，517 / 524 个通过的测试用例。  


原因也很简单，存在大量的边界加一减一的缘故，大部分查询都无法直接命中 `f(l,r)`，从而导致不断的递归重复运算，从而导致超时。  



既然是加一减一的边界，这里就不能值记录一个状态，需要记录 4 个状态。  


```
f_all(l,r) 完整区间的最优值
f_left(l,r) 不包含第一个元素的最优值  
f_right(l,r) 不包含最后一个元素的最优值
f_mid(l,r) 不包含第一个元素和最后一个元素的最优值  
```


有了四个状态，就可以通过子状态之间互相组合得到当前的状态。  


```
f_all(rt) = max(
    f_all[rt << 1] + f_left[rt << 1 | 1],
    f_right[rt << 1] + f_all[rt << 1 | 1]
)

f_left(rt)= max(
    f_left[rt << 1] + f_left[rt << 1 | 1]
    f_mid[rt << 1] + f_all[rt << 1 | 1]
)


f_right(rt) = max(
    f_all[rt << 1] + f_mid[rt << 1 | 1],
    f_right[rt << 1] + f_right[rt << 1 | 1]
)

f_mid(rt) = max(
    f_left[rt << 1] + f_mid[rt << 1 | 1],
    f_mid[rt << 1] + f_right[rt << 1 | 1]
)
```


而区间查询，则有 4 个出口了  


```
Query(L,R,l,r,rt) = 
if (L == l && R == r) return f_all(l,r)
if (L - 1 == l && R == r) return f_left(l,r)
if (L == l && R + 1 == r) return f_right(l,r)
if (L - 1 == l && R + 1 == r) return f_mid(l,r)
return max(
    Query(L, m, lson) + Query(m + 2, R, rson),
    Query(L, m - 1, lson) + Query(m + 1, R, rson)
);
```


有了上面的状态，线段树就是普通的实现了，从而可以 205 ms 通过这道题。  


我敲门上面的代码，已经是 11:59 了，跑了下样例通过了，提交是 WA 了。  
原因是有个地方写了，快速修改后，再次提交就通过了，但是此时比赛已经结束了。  


代码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/3/399/D.cpp  



## 五、最后  


这次比赛最后一题比较有创意，不是普通的线段树，而是与动态规划结合起来了，通过四个状态的互相转换，从而可以从下一层计算出上一层的答案。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

