---   
layout:  post  
title: leetcode 第 370 场算法比赛  
description: 动态开点线段树？转化为离散化线段树      
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2023-11-05 18:13:00  
published: true  
---  


## 零、背景  


这次比赛最后一题有点难度，突然发现我还没有动态开点线段树模板，后面需要整理一个，很有必要。  



## 一、找到冠军 I  


题意：给一个`n*n`的矩阵，`i`队伍比`j`队伍强时，`grid[i][j]`值为1，`grid[j][i]`值为0。  
求最强队伍。  


思路：题目保证队伍之间强弱不存在环，所以只会有一个最强队伍。  
此时队伍 `i`的那一行，除了`grid[i][i]`是0，其他位置都是1。  
找到这样一行即可。  


## 二、找到冠军 II  


题意：告诉你部分队伍之间的强弱关系，问是否存在一个最强队伍。  


思路：最强队伍没有入度，所以入度为0的队伍只有一个时，就有答案。  
统计入度即可。  


## 三、在树上执行操作以后得到的最大分数  


题意：给一个有根无向树，一次操作可以将一个节点的值设置为0，但需要保证根到叶子的路径和不为0，求树的最小权值和。  


思路：典型的树形DP。  


对于祖先，分两种情况：一种是已经有非0节点，一种是全是0值节点。  
祖先有非0节点时，所有子孙都可以清零。  
祖先都是0时，可以将当前子树根保留，子孙都清零，或者当前子树根清零，子孙递归。  


特殊情况：叶子没有子孙，需特殊判断。  


## 四、平衡子序列的最大和  


题意：给一个数组，求一个子序列，假设序列中有两个值来自原数组的下标`i`和`j`，且`i>j`，则需要满足`nums[i] - nums[j] >= i - j`。  
求满足条件的子序列里面的最大元素和。  


思路：高级的动态规划。  


下标的大小公式可以调整下，转化为只和自身有关系。  


```
nums[i] - nums[j] >= i - j
nums[i] - i >= nums[j] - j
```


即子序列需要满足 元素值与下标的差呈现非递减关系（可以相等的递增）。  
可以预处理出差值数组 `vals[i] = nums[i] - i`  


状态定义：`dp[i]` 以 i 为结尾的、元素和最大的、非递减子序列。  


状态转移方程：  


```
dp[i] = nums[i] + max(dp[j])
1) j<i
2) vals[j]<=vals[i]
```

复杂度：`O(n^2)`  


优化：  


如何找到前面满足条件的 `vals[j]` ，然后找到里面最大的 `dp[j]`呢？  


第一个想到的是动态开点线段树。    
`vals[j]`的值很大，且是动态插入的，动态开点插入线段树，即可区间求`dp[j]`的最大值。  
但是线段树动态开点我还没模板。  


第二个想到的是离散化线段树。  
`vals[j]`的值是很大，但是值是固定的，可以预处理计算出来。  
预处后，就可以离散化为了连续的下标，从而可以使用线段树模板。  
由于是单点更新，我使用的树状数组来求前缀最大值。  



## 五、最后  


这次比赛最后一题很有意思。  
求元素和最大的递增子序列，通过离散化处理，转化为了线段树区间最大值问题。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

