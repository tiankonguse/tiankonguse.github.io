---   
layout:     post  
title: leetcode 第 286 场算法比赛  
description: 思路不清晰，确实很难进去前百名。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2022-03-27 12:13:00  
published: true  
---  


## 零、背景  


这次比赛第三题一看就是一个数位动态规划题，果断先做第四题，简单的动态规划题。  


就这样，第四题做完的时候，比赛才过去 23 分钟。  


看了第三题，也不难，就是普通的数位 DP。  


但是我在下标从 0 开始还是从 1 开始上纠结了好久，最终代码一半逻辑是从 0 开始，一半逻辑是从 1 开始，调试好久好久。  


最终虽然过了所有题，但是排名就很靠后了。  



## 一、找出两数组的不同  


题意：给两个数组，互相求出存在当前数组，不再另外一个数组的集合。  


思路：将数组转化为集合，然后判断是否存在即可。  


## 二、美化数组的最少删除数  

题意：求删除最少的元素，使数组称为美化数组。  


美化数组定义：长度为偶数，相邻两两一组，不能相同。  


思路：循环尝试两两分组。  


第一个数字，直接进入分组。  
第二个数字，遇到相同的，删除直到找到不同的。  


最后在判断分组是不是匹配了一半，是的话，说明还有一个，也删除。  


```
int flag = 0, pre = 0;
for (auto v : nums) {
  if (flag == 0) {
    flag = 1;
    pre = v;
  } else {
    if (pre == v) {
      ans++;
    } else {
      flag = 0;
    }
  }
}
if (flag) ans++;
```


## 三、找到指定长度的回文数  


题意：求第 x 个长度为 n 的回文串。  


思路：原题意是多个询问，我们每个询问单独处理即可。  


首先先判断 x 是不是大于上限，大于了直接没答案。  
否则使用数位 DP 来构造答案。  


数位DP 大概如下：


对于第一位，由于不能有前导零，那只能是 1~9。  
根据 1~9 将所有回文串分为 9 组，每组都相等。  


每组的长度是 K，则每组有 `X = 10^(K-2)` 个。  
假设询问的是第 Q 个，则可以计算出第一位的值，即 `V = Q/X + 1`。  


之后，对于内部的数位 DP，则允许有前导 0。  
故内部的数位 DP，第一位的值是 `V= Q/X`。  



```
// 有前缀 0, pos 从 0 开始
ll Dfs2(ll pos, ll len, ll add = 0) {
  if (len == 1) {
    return pos;
  }
  if (len == 2) {
    return pos * 10 + pos;
  }
  ll mid = F[len - 2];
  ll i = pos / mid;
  ll v = i + add;
  ll midAns = Dfs2(pos - i * mid, len - 2);
  return v * f10[len - 1] + midAns * 10 + v;
}

// 无前缀 0，pos 从 1 开始
ll Dfs1(ll pos, ll len) {
  if (len == 1) {
    return pos;
  }
  if (len == 2) {
    return pos * 10 + pos;
  }
  return Dfs2(pos - 1, len, 1);
}
```


## 四、从栈中取出 K 个硬币的最大面值和  


题意：给 n 个栈（只能从一个方向取数字），最多取 K 个数字，问数字之和最大是多少。  


思路：栈最多有 1000 个，K最多不超过 2000，所以可以无脑动态规划做。  


状态：`f(n, k)` 前 n 个栈取 K 个数字的最优值。  


状态转移方程：下个栈枚举个数。  


```
i <= k
f(n, k) = preSum[i] + f(n-1, k-i)
```

当然，可以看到，当前栈的答案只依赖上一个栈的答案。  
所以也可以只开一个一维数组，通过滚动计算来求答案。  



## 五、最后 


这次比赛题目其实都不难，数位DP 我自己的问题，花费了大量时间。  



赛后看了下题解，第三题原来自己想复杂了。  


不考虑第一位，中间所有回文串只看前一半，其实就是一个从 0 到 `10^(k/2) - 1` 的递增整数序列。  


那求 第 X 个回文串，前一半就对应 X 数字，再考虑奇偶性，通过翻转得到后一半的数字即可。  





加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

