---   
layout:  post  
title: leetcode 第 374 场算法比赛  
description: 比赛有点难度，去练车了，没参加比赛。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2023-12-03 18:13:00  
published: true  
---  


## 零、背景  


周末早上我七点之前就出门去练车了，所以就没参加比赛。  


中午趁着天热回来休息的时间，做了一下比赛题，写一下题解。  


A: 循环签到题。  
B: 组合题型，循环一遍即可。  
C: 统计枚举题，循环枚举判断是不是答案。  
D: 排列组合题。  


总结：难度其实不大，但是最后一题竟然卡常数时间，vector 换成数组就过了。  


比赛代码:  
https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、找出峰值


题意：给一个数组，求所有山峰。  
山峰定义：严格大于左右相邻的数字。  


思路：循环判断即可。  


## 二、需要添加的硬币的最小数量  


题意：给一些硬币，问至少需要几个硬币，才能组成`[1,sum]`的所有金钱。  


思路：组合题。  


如果某些硬币可以组成`[1,x]`，来一个硬币`y`，则可以组成`[1,x] + [y,x+y]`。  
如果`y<=x+1`，两个区间可以合并，即组成区间`[1,x+y]`。  
如果`y>x+1`，从区间 `[1,x+1]`中新增一个硬币才能组合出 `x+1`，显然选择`x+1`组成的新区间是最大的，选择其他的都有浪费。  


另外，可以发现上面这个规则必须从小到大来算才行，否则答案也不是最优的。  


故先对硬币排序，然后按上面规则计算即可。  


注意事项：给的硬币都用完时，可能还不满足答案，需要继续循环添加新硬币，直到满足答案。  


## 三、统计完全子字符串  


题意：给一个字符串，问有多少个子串是完全字符串。  
完全字符串：出现的字符个数都是 k，且相邻字符的差值不大于2。  


思路：统计枚举题。  


枚举每个起始位置，枚举出现的字符个数，即可得到子串对应的区间，判断子串出现的字符是否满足答案。  
复杂度：`O(26^2 n)`  


剪枝1: 判断子串区间是否合法。  
剪枝2: 判断区间内是否都满足相邻字符差值的条件（差值算法）。  
剪枝3: 判断某个字符个数是否都大于 k。  


判断是否满足答案：枚举所有字符在区间内出现的次数，看是否都是 k 个。  
判断复杂度：`O(26)`  


差值算法:   
预处理：出所有不满足条件2的相邻对（储存左下标）。  
预处理复杂度: `O(n)`  


判断：二分查找子串内第一个不满足条件2的下标。  
判断复杂度：`log(n)`  


计算字符在区间内出现的次数  


预处理：预处理所有字符在所有前缀内出现的次数。  
预处理复杂度: `O(26 n)`  


区间次数：前缀求差值  
判断复杂度：`O(1)`  


综合复杂度：`O(26^2 n)`  
这样就可以通过了。  


优化：枚举起始位置后，可以快速推导出可能满足答案的子串。  


第一步：假设字符出现 a 个，子串长度为 `a*k`，并判断是否触发剪枝。  
第二步：未触发剪枝，判断长度为 `a*k` 的子串内出现的不同字符个数。  
如果个数小于 k，触发剪枝。  
如果大于 k，比如为 b 则回到第一步，令 `a=b` 计算。  
如果等于 k，判断是否是答案，之后回到第一步，令 `a=a+1`计算。  


子串内出现的不同字符个数：  
前缀差判断，复杂度`O(26)`  
线段树判断，复杂度`O(log(n))  


## 四、统计感冒序列的数目  


题意：n个人站在一排，有若干人感冒了。  
感冒的人会传染给相邻的人，但是每一秒只有一个人会被传染。  
问这些人被传染的顺序的组合个数。  



思路：排列组合题。    


假设一个连续区间有 k 个人。  
中间的一个连续区间，每一次可以从左边传染，也可以从右边传染，一个区间内的组合数是`2^(k-1)`中方案数。  
队首和队尾连续未生病的人只能从中间来传染，方案数为 `1` 个。  


假设共有 N 个人没生病。  
第一个连续区间有 k1 人，可能分配到 N 个位置，组合数为 `C(N,k1)`。  
第二个连续区间有 k2 人，可能分配到 `N-k1` 个位置，组合数为 `C(n-k1, k2)`，
其他的同理。  


故总方案数如下：  


```
  C(N, k1)  // 对首
* C(N-k1, k2) * 2^(k2-1)  
* C(N-k1-k2, k3) * 2^(k3-1)  
* ...  
* C(kn, kn) // 队尾，值为1，忽略  
```


由于`C(n,k)` 比较大，可以使用逆元模板来快速计算。  



## 五、最后  


这次比赛总结如下：  


第一题：签到题。  
第二题，简单构造题，需要一番逻辑推理与证明。  
第三题：两重枚举题，出的不好，复杂度有`O(26^2 n)`。    
第四题：排列组合题，属于排列组合里较为基础的题型。  


后两题你都是怎么做的呢？  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

