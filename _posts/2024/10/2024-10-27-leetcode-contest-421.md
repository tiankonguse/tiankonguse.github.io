---
layout: post  
title: leetcode 第 421 场算法比赛  
description: 举个例子详解矩阵幂。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2024-10-27 12:13:00  
published: true  
---


## 零、背景  


这次比赛比较简单，最后一题卡了好久，做完排名 34.  


A: 枚举。   
B: 模拟。   
C: 动态规划。  
D: 矩阵幂。  


排名：34 
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/421  


## 一、数组的最大因子得分  

题意：给一个数组，问最多移除一个元素，剩余元素最小公倍数与最大公约数的乘积。  


思路：枚举不移除与移除一个，按题意计算。  
复杂度：`O(n^2)`  


优化：预处理前缀和后缀的最小公倍数与最大公约数。  
复杂度： `O(n)`  


## 二、字符串转换后的长度 I  


题意：给一个字符串，每次操作时每个字符替换为其他字符串，问t次操作后字符个数。  
替换规则：  
1）字母`z`替换为字符串`ab`。  
2）其他字母替换为下一个字母。  


思路：模拟。  


统计当前各字符个数，模拟计算出一轮操作后各字符的个数。  
操作t次即可。  
复杂度：`O(26 t)`  


## 三、最大公约数相等的子序列数量  


题意：给一个数组，问存在多少个非空子序列对，使得子序列对的 gcd 相等。  


思路：数据范围很小，使用动态规划。  


状态定义：`f(n,v1,v2)`  
含义：两个子序列后缀分别为 v1 和 v2 时，前 n 个元素任意组合后的答案数。  


状态转移方程：  


```
v = nums[n]

f(n,v1,v2) = 
+ f(n-1,         v1,         v2)  // 不选择 
+ f(n-1, gcd(v, v1),         v2)  // 加入第一个序列
+ f(n-1,          v1, gcd(v, v2)) // 加入第二个序列
```


复杂度：`O(n*v^2)`  


## 四、字符串转换后的长度 II  


题意：给一个字符串，每次操作时每个字符替换为其他字符串，问t次操作后字符个数。  
替换规则：字母 v 替换为 v 后面的 nums[v] 个字母。  
如果字母超过`z`，循环从 `a` 开始。  


思路：`10^9`次操作，典型的矩阵幂问题。  


根据替换规则，构造出规则矩阵，然后进行矩阵幂运算即可。  


什么是规则矩阵呢？  
具体来说，我们需要根据规则，构造出一个矩阵，使得矩阵相乘一次之后，每个位置的值就是规则操作一次后的值。  


举个栗子：  
假设字母表只有3个字母`abc`，`ab`分别替换为后面一个字符，`c`替换为后面两个字母，输入也是 `abc`。  


则当前结果数组为 `1*n` 的数组，值分别为 `[1,1,1]`。  


规则转化一下如下   


```
a -> b
b -> c
c -> a,b
```


站在统计的角度看结果，就是每个字母可以由哪些字母转换得到，则可以构造出下面的公式  


```
next[a] = now[c] 
next[b] = now[a] + now[c]
next[c] = now[b]
```


上面的统计公式转换一下如下  


```
next[a] = 0 * now[a] + 0 * now[b] + 1 * now[c] 
next[b] = 1 * now[a] + 0 * now[b] + 1 * now[c]
next[c] = 0 * now[a] + 1 * now[b] + 0 * now[c]
```


上面的公式恰好是`[1*3]`的矩阵 与 `[3*3]` 矩阵相乘的结果。  


`[1*3]`的矩阵就是 now 数组。  
而`[3*3]`矩阵 Matrix，则提取出来如下  


```
0 1 0
0 0 1
1 1 0
```


每操作一次就是乘一次矩阵，操作 t 次就是乘以 t 次矩阵。  
矩阵满足结合律，故可以使用快速率优化乘法。  


答案就是 `now * Matrix ^ t`。  


至于矩阵的具体构造，则是 a 可以到达 b， 则 `Matrix[a][b]` 就加1。  


复杂度：`26^3 log(t)`  


## 五、最后  


这次比赛第三题其实很容易想歪，而直接套用动态规划，就简单多了。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

