---
layout: post  
title: leetcode 第 429 场算法比赛  
description: 看错题了，翻车。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2024-12-22 12:13:00  
published: true  
---


## 零、背景  


这次比赛难度看错题了，然后后两题又一样，结果就是都没做出来。  


A: 重复判断  
B: 排序贪心  
C: 二分+DP  
D: 二分+贪心  


排名： 200+  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/429  


## 一、使数组元素互不相同所需的最少操作次数  


题意：给一个数组，从前到后每次删除3个元素，问至少删除多少次，才能使得剩下的元素各不相同。  


思路：重复判断。  


从后到前找到第一个重复的元素位置，这之前的都是需要删除的。  
由于每次删除 3 个，需要除以3 向上取整。  


重复判断的数据结构：hash 表  


## 二、执行操作后不同元素的最大数量  


题意：给一个数组，每个位置的元素只能操作一次，加上`[-k,k]`之间的一个值，问最终最多可以使得数组存在多少个互不相同的元素。  


思路：贪心  


显然，数组元素的顺序不影响答案，故可以从小到大排序。  


由于每一个元素都可以修改，显然，最小的元素修改的更小，答案才可能更优。  
故最小值需要加上 `-k`，记录为当前最小值 pre，独立元素记作一个。  


对于下一个元素，可以操作的值域值 `v-k, v+k`，显然操作后值需要大于当前最小值 pre。  
如果 `pre < v-k`，则下个元素就修改为最小值 `v-k`，记录为最新的最小值，独立元素记作一个。  
如果 `pre < v+k`，则下个元素就修改为 `pre+1`，记录为最新的最小值，独立元素记作一个。  
否则，当前元素不管怎么操作，都不会产生新的独立元素，忽略。  


## 三、字符相同的最短子字符串 I  


题意：给一个字符串，最多修改 k 次，问可以得到最短的像相同子字符串长度是多少。  


思路：求最值，一遍都满足，另一边都不满足，显然需要二分。  


故问题变成，最多修改K次，相同子串长度最多为 m 时，是否存在答案。  


这个时候就可以使用动态规划来做了。  


状态定义: `f(n, v)` 前 n 个元素最后一个元素值为 v 时，满足要求的最小修改数。  


状态转移方程：  


```cpp
f(n,v) = min(f(i-1, 1-v) + Diff(i,n, v))
```


方程含义：枚举后缀值都为 v 的长度，判断哪个长度需要的修改数最小。  


`Diff(i,n,v)` 是枚举长度时，与v不同的需要修改的次数，边枚举边统计即可。  


复杂度：`O(nm log(n))`  


## 四、字符相同的最短子字符串 II  


题意：给一个字符串，最多修改 k 次，问可以得到最短的像相同子字符串长度是多少。  


思路：二分+贪心。  


可以发现，第四题与第三题一样，数据范围变大了。  


如何快速判断最多修改K次，相同子串长度最多为 m 时，是否存在答案呢。  


其实可以贪心的。  


既然子串长度最多为 m， 那就左右到右循环，每 m 个一段，就修改下一个是不是就可以了呢？  


大部分情况下确实可以，但是存在几种特殊情况。  


特殊情况1：恰好有`m+1`个，修改第`m+1`个时，会与后面的相连，从而影响后面的答案。  


一种显然的兼容方法是：修改中间的元素，这样左右都满足不足 m 个。  
假设连续字符个数为 p，则可以得到修改次数为 `p/(m+1)`。  


特殊情况2：如果 m 为 1 或 2 时，不存在中间元素，贪心不成立。  
第三题我们已经有了 DP 的方法，可以 `O(nm)` 的复杂度判断一个 m 是否成立。  
那对于 `m=1` 和 `m=2` 我们使用动态规划来特殊处理即可。  


综合复杂度：`O(n log(n))`



## 五、最后  


```text
示例 1：
输入: s = "000001", numOps = 1
输出: 2
解释: 将 s[2] 改为 '1'，s 变为 "001001"。最长的所有字符相同的子串为 s[0..1] 和 s[3..4]。
```


第三题我看错题了。  
看样例1，看到了`s[0..1] 和 s[3..4]`，我理解为求两个相同子字符串匹配的最小长度。  


这样题目就分为两种情况。  


情况1：纯0和纯1的长度为 `k+1`的子串顶多出现一次，这样就存在两个长度为 `k` 的相同子串，答案是 k。  
情况2：纯0和纯1的长度为 `k`的子串可以出现任意多次，答案也是 k。  


可以发现，情况2就是原题的题意，我已经正确写出算法了。 
而情况1则需要另外一个动态规划方程来解决。  
这样敲完代码，第三题总是过不了，就这样结束比赛了。  


以后做比赛还是要认真读题，读错题是最致命的。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  