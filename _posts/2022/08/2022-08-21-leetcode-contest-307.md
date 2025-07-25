---   
layout:  post  
title: leetcode 第 307 场算法比赛
description: 请假回家了，比赛成绩不怎么样  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2022-08-21 18:13:00  
published: true  
---  


## 零、背景  


这次比赛最后一题有点难度，但是其实也不难，给大家分享两种方法。  


## 一、赢得比赛需要的最少训练时长  


题意：有 n 场比赛，每次比赛需要消耗指定的精力，之后会增加若干经验。  
参加一次比赛的前提是当前剩余的精力和经验都大于比赛要求的值。  
起始的精力和经验可能无法完成所有比赛，每花费一小时就可以给起始精力或者经验加一点。  
问至少需要花费多少小时，得到的起始精力和经验才能完成比赛。  



思路：精力是递减的，所有可以循环计算出至少需要多少精力。  
经验值是递增的，计算的方法比较多。  


方法一：枚举起始经验值，判断是否可以完成比赛。  


方法二：二分起始经验值。  


方法三：倒退依赖的经验值。  



注：由于数据量不大，枚举最简单。  



## 二、最大回文数字  


题意：给一个数字字符串，选择一些数字，求可以组成的最大回文串数字。  


思路：回文串分两类。  
一类长度是偶数，左右完全一样对称。  
一类长度是奇数，除了中间的，左右完全一样对称。  


面对这道题，可以预先统计所有数字的个数。  
从大到小得到完全对称的值，并标记最大的出现奇数次的数字。  


如果没出现奇数次的数字，答案就是长度为偶数的回文串。  
如果出现奇数次的数字，答案就是长度为奇数的回文串。  


注意实现：如果出现前缀 0，完成对称的数字都是0，此时需要特殊处理。  


## 三、感染二叉树需要的总时间  


题意：给一个有根二叉树，现在随便选择一个节点为根，求输的高度。  



思路：一个 DFS 搞定。  


递归的时候，如果子树没有选择的节点，则新的数里子树结构不变，返回当前树的高度。  


如果子树里有选择的节点，分三种情况。  


情况一：子树的根是选择的节点，返回高度 1，代表父节点到新的根的距离。  


情况二：选择的节点存在左子树里，则左子树会返回当前节点到达新根的距离。  
右子树的高度是右子树的最大高度加上当前子树根到达新根的距离，更新答案。  
最后，返回当前节点父节点到达新子树的距离，即左子树返回值加1。  


情况三：选择的节点存在右子树，逻辑情况二完全一样。  


## 四、找出数组的第 K 大和  


题意：给一个数组，求所有子序列中，第 k 大的子序列的和。  



方法一：一开始可能会没思路，但是一看数据范围，k 最多是 2000, 那就有思路了。  


可以先考虑只有正整数，子序列和最小的 k 个答案。  
求出最小的 k 个答案后，根据总和，就可以计算出最大的 k 个和。  


至于如何求最小的k个答案，也不难。  
对序列排序，然后通过一个优先队列就可以计算得到。  


一开始可能想不到如何维护这个优先队列。  
所以可以使用最暴力的方案。  
定义状态：`<sum, offset>`代表以 `offset-1` 偏移量结尾的和为 sum 的子序列。  


对于这个状态，我们可以得到 K 个状态，都入队，即：  


```
sum1 = sum + A[offset], offset+1
sum2 = sum + A[offset+1], offset+2
...
```


看到这里，你可能会说，这个复杂度会很大。  
是的，所以可以加一个优化：得到的 sum 个数等于 K 个后，之后只有更优的时候才能入队。  


这样复杂度就降为 `k log(k)` 了。  


证明如下：  


```
第一次状态转移： A[offset], A[offset+1],...,A[offset+k-1]
第二次转移：A[offset]+A[offset+1],A[offset]+A[offset+2],...,A[offset]+A[offset+k/2]
第三次转移：...,sum+A[offset+k/3]
```


第一次入队列的是 k 个数字。  
第二次最多入队 k/2 个数字。  
第三次最多入队 k/3 个数字。  
由此递推，入队列的数字个数是`k+k/2+k/3+...`。  
对于这个公式，约等于`k log(k)`。  



求出了正整数的最大 k 个和，我们需要考虑如何处理负数。  


负数如果特别小，有可能可以得到的和也排名前 K。  
那最多多少个负数子序列可能在最终的答案中进入 前 K 呢？  
显然，顶多 `k-1` 个负数子序列影响最终答案。  


所以，这里可以使用上面类似的算法，求出所有负数子序列中最大的 k 个子序列和。  


最后，非负数的 k 个最大的子序列和 与 负数的 k 个子序列和交叉组合，就可以得到任意整数的 k 个最大子序列和。  


最后交叉处理时，看起来是 `k^2` 的复杂度，其实剪枝后，类似于堆优化，每次挑选最大的，复杂度还是 `k log(k)`  


方法二：方法一的思路是把正数与负数拆分开，其实没这个必要。  


仔细看方法一里面求非负数最大 k 子序列的方法：先求最小的 k 个子序列，然后那和相减求出最大的 k 个子序列。  



既然是相减的，那对于负数，相加等价与相减，所以负数可以处理为非负数来处理即可。  



所以流程可以简化为：  


步骤1：求出正整数的和。  
步骤2：所有负数修改符号为正数。  
步骤3：求出最小的 k 个子序列和。  
步骤4：相减，求出最大的 k 个子序列和。  



另外，对于队列求最小的 k 个子序列，我使用的暴力方案枚举 k 个子状态。  


看榜单，前几名通过把 k 叉树转化为 2 叉树，从而只需要枚举 2 个子状态来降低复杂度。  
那种状态虽然看着简单，但是理解起来比较复杂，这里就不介绍了。  
感兴趣的可以自己去榜单看前几名的代码。  



## 五、最后  


这次比赛题目都比之前的难。  


前三题都需要花不少时间，第四题即使有想法，比赛那么短的时间内，可能没想清楚就导致敲不出代码来。  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

