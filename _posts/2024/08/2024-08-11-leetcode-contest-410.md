---
layout: post  
title: leetcode 第 410 场算法比赛  
description: 这次比赛比较简单，前缀和。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2024-08-12 12:13:00  
published: true  
---


## 零、背景  


这次比赛依旧没参加，四道题都不难。    


A: 模拟。   
B: DFS。   
C: 动态规划+前缀和优化。  
D: 动态规划+前缀和优化。  


排名：无   
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/410  


## 一、矩阵中的蛇  


题意：给一个矩阵、起始位置、移动指令，问最终的位置。  


思路：按题意模拟即可。  


## 二、统计好节点的数目  


题意：给一个树，问有多少个子树是好节点。  
好节点：所有子节点为根的子树的节点个数相等时，为好节点。  


思路：递归。  


递归算每个子树是不是好节点。  
计算的时候，顺便储存下每个子树的节点个数，从而可是计算父节点是否是父节点。  


复杂度：`O(n)`  


## 三、单调数组对的数目 I  


题意：给一个数组，求构造两个数组，一个是非递减的，一个是非递增的，两个数组相同位置的元素和等于输入数组对应位置的元素值。  
问共有多少种构造方法。  


思路：动态规划。  


状态定义：`f(i,v)`  
含义：第一个数组第i个位置值为v时，前i个位置的答案个数。  


状态转移方程：`f(i,v)=sum(i-1, V)， V<=v`  
含义：第i个位置值为v时，前一个位置的值只能是 `[0,v]`，这样才能保证非递减。  


对于输入元素，假设前一个元素值是 V0, 则两数组可能得值如下：  


```
第一个数组: 0  1 2 ... V0 
第二个数组: V0 ... 2 1 0
```


假设第二个元素值是 V1, 如果第一个数组选择 0，则第二个数组值为 V1。  
V1 是否满足第二个数组的性质依赖于与 V0 的大小关系。  


如果 V1 小于等于 V0， 则第二个数组满足非递增性质。  
此时第一个数组取值范围可以是 `[0,V1]`， 第二个数组都存在合法值。  
第一个数组值为 v 时，答案个数为 `sum[i-1][0,v]`。  


如果 V1 大于 V0，则第一个数组取值 0 时，第二个数组不存在合法值。  
第二个数组能接受的最大值是 V0, 此时第一个数组需要取值 `V1-V0`。  
之后的取值都存在和法治，故第一个数组取值范围为`[V1-V0,V1]`。  
第一个数组为 v 时，答案个数为 `sum[i-1][0,v-(V1-V0)]`  


对于 `sum[i-1][0,v]` 可以通过计算前缀和来快速计算出答案。  


## 四、单调数组对的数目 II  


题意：同第三题  


## 五、最后  


这次比赛比较简单，拼手速的时候到了。  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

