---
layout: post  
title: leetcode 第 426 场算法比赛  
description: 两道树形 DP。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2024-12-01 12:13:00  
published: true  
---


## 零、背景  


这次比赛最后一题树形DP就没意思了，第三题树形DP简化一下就是第四题的代码。  


A: bit位循环  
B: 枚举  
C: 树形DP  
D: 树形DP  


排名： 200+  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/4/426  


## 一、仅含置位位的最小整数  


题意：给一个整数，求有效bit位全部设置为1的值。  


思路：统计bit位个数 b，答案就是 `(1<<b)-1`。  


## 二、识别数组中的最大异常值  

题意：给一个数组，选出两个数字 a 和 b，使得其余的数字之和是 b，求最大的 a。  


思路：枚举  


预处理数组和 sum。  
枚举 a， 则 `b=(sum-a)/2`。  
如果存在这样的 a 和 b，则 a 是答案。  


注意事项：a 与 b 可能相等，此时 a 出现次数需要至少两次。  


## 三、连接两棵树后最大目标节点数目 I  


题意：给两个无根树，第二个树的任意一个节点连接到第一个树的节点 u 后，求 u 为中心, k 个边为半径覆盖的最大顶点数。  


思路：经典的树形DP。  


显然，需要求出第一个树任意一个节点半径为k覆盖的顶点数，以及第二个树半径为 `k-1`覆盖的最大顶点数。  
要求半径为`k-1`覆盖的最大顶点数，就需要求出任意一个节点半径为k覆盖的顶点数，然后取max。  


所以问题转化为了，求第一个树半径`k`的覆盖顶点数，第二个树半径`k-1`的覆盖顶点数。  
这个可以适当的封装一下，求任意一个树所有节点半径为`K`的覆盖顶点数。  


对于此类问题，需要分为两个步骤来处理。  


步骤1(子树)：递归求出以 0 为根，所有节点子树半径为 K 的覆盖顶点数。  
步骤2(换根)：递归求出所有节点为根，半径为 K 的覆盖顶点数。  


步骤1(子树)覆盖数状态定义：`child(u, k)`  
含义：u 为子树半径为 k 的覆盖顶点数。  


状态转移方程：  


```cpp
child(u, k) = 1 + sum(child(v, k-1))
```

伪代码如下：  


```cpp
void DfsChild(int u, int pre) {
  vector<int>& uChild = child[u];
  for (int i = 0; i < KK; i++) {
    uChild[i] = 1;  // 小于等于 i 的个数
  }
  for (auto& v : g[u]) {
    if (v == pre) continue;
    DfsChild(v, u, g, child);
    const vector<int>& vChild = child[v];
    for (int i = 0; i + 1 < KK; i++) {
      uChild[i + 1] += vChild[i];
    }
  }
}
```


步骤2(换根)节点为根的状态定义: `all(u,k)`  
含义：u 为树根，半径为 k 的覆盖顶点数。  


状态转移方程：  


```cpp
all(u, k) = child(u, k) + pre(u, pre, k-1)  
```


方程含义：如果 u 节点转换为根，原先的父节点会变成儿子节点。  
所以答案就是原先子树的 k 覆盖数，再加上父节点为树根但是不包含 u 节点的 `k-1` 覆盖数。  


怎么求`pre(u, pre, k-1)`呢，也就是父节点为树根但是不包含 u 节点的 `k-1` 覆盖数。  


假设父节点已经求出 `all(pre,k-1)` 了。  
则递归到子节点时，只需要减去子树为根的 `k-1`覆盖即可。  


```cpp
pre(u, pre, k-1)  = all(pre, k-1) - child(u, k-2)
```

两个方程合并一下就是  


```cpp
all(u, k) = child(u, k) + pre(u, pre, k-1)  
pre(u, pre, k-1)  = all(pre, k-1) - child(u, k-2)

all(u, k)= child(u, k) + all(pre, k-1) - child(u, k-2)
```

由方程可以看出，步骤1是由儿子计算出父节点，第二个步骤是由父节点计算出儿子。  


伪代码如下：  


```cpp
void DfsAll(int u, int pre) {
  const vector<int>& uChild = child[u];
  vector<int>& uAll = all[u];
  for (int i = 0; i < KK; i++) {
    uAll[i] = uChild[i];  // 复制子树
  }
  if (pre != -1) {  
    uAll[1] += all[pre][0]; // 循环从 k-2 开始，k-1 特殊处理
    for (int k_2 = 0; k_2 + 2 < KK; k_2++) {
      uAll[k_2 + 2] += all[pre][k_2 + 1] - uChild[k_2];  // 把父节点合并上来
    }
  }

  for (auto& v : g[u]) {
    if (v == pre) continue;
    DfsAll(v, u, g, child, all);
  }
}
```


复杂度：`O(kn)`  


## 四、连接两棵树后最大目标节点数目 II  


题意：给两个无根树，第二个树的任意一个节点连接到第一个树的节点 u 后，求 u 为中心,半径为偶数时覆盖的最大顶点数。  


思路：与第三题没区别，树形DP。  


只需要把 K 换成 `0/1` 奇偶数即可。  


```cpp
child(u, k) = 1 + sum(child(v, 1-k))
all(u, k) = child(u, k) + all(pre, 1-k) - child(u, k) 
all(u, k) = all(pre, 1-k)
```

是的，没看错，父节点的偶数答案就是子节点的奇数答案。  



复杂度：`O(n)`  


## 五、最后  


这次比赛最后一题出的很失败，比第三题还简单。  


不过第三题可以当做一个经典的树形DP来学习。  
通过预处理子树与换根，得到每个顶点为根的答案。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  