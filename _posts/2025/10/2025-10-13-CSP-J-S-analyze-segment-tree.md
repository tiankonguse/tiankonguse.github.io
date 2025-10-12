---
layout: post
title: 历年 CSP-J CSP-S 题型总结之线段树
description: 二分、线段树、动态规划、最短路  
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-10-13 20:13:00
published: false
---



## 零、背景


CSP-J/S 是从 2019 年开始举办的。  


之前已经在《[近 6 年 CSP-J 算法题型分析](https://mp.weixin.qq.com/s/MkE5yfMLioAxGtiFKz1-cg)》和《[历年 CSP-S 算法题型分析](https://mp.weixin.qq.com/s/meOv7fuSQaXEYU3mlOdb8w)》两篇文章里总结了 CSP-J 和 CSP-S 的题型。  


接下来我的规划分两部分：  


规划1：介绍常见算法如何实现，以及历年的真题中是如何应用的。  
规划2：介绍面对比赛，使用什么样的策略，才能尽可能的得高分。  


规划1的第一篇文章是二分，之前已经在《[CSP-J/S 题型总结之二分](https://mp.weixin.qq.com/s/Wi8Bb1fAvQ7BEAwSUZXLdw)》分享过了。  


这里是规划1的第二篇文章，介绍线段树与历年真题解析。  


## 一、算法介绍  


NOI 大纲中，CSP-J 没有要求线段树，CSP-S 要求是掌握基础知识，即会单点更新与查询、区间更新与查询、延迟标记。  


区间操作必然需要延迟标记。  
而区间大小为 1 时就相等于单点操作。  
故只需要掌握区间更新的操作，就掌握了 CSP-J/S 大纲中的所有知识。  


本质上，线段树（Segment Tree）是一种基于分治思想的二叉树数据结构，从而能够将区间查询与区间更新的时间复杂度都降低到 `O(logn)`。  


线段树的每个节点都代表一个区间，通过将区间不断地二分，最终形成一棵完全二叉树。


例如每个节点代表一个区间 `[l, r]`。  
叶子节点对应原始数组的单个元素（区间长度为 1）。
非叶子节点存储子区间的聚合信息（如区间和、最值），其左子区间为 `[l, mid]`，右子区间为 `[mid+1, r]`，其中 `mid = (l+r)/2`。  


线段树的每个节点都有一个值，这个值代表这个区间的某种性质，比如区间和、区间最大值、区间最小值等。
每个节点的值可以通过合并左右子节点的值来计算得到。


```cpp
int maxNM;                     // 线段树区间 [1, maxNM]
vector<ll> sign;               // 延迟标记
vector<pair<ll, int>> minVal;  // 记录最值的位置
vector<pair<ll, int>> maxVal;  // 记录最值的位置
vector<ll> sumVal;             // 记录区间和
vector<pair<ll, ll>> ranges;   // 节点对应的区间
vector<ll> str;                // 原始数组的值，用于快速初始化

void Init(vector<int>& str_, const ll default_val = 0) {
  maxNM = str_.size() + 1;
  sign.resize(maxNM << 2, 0);
  minVal.resize(maxNM << 2);
  maxVal.resize(maxNM << 2);
  sumVal.resize(maxNM << 2);
  ranges.resize(maxNM << 2);
  str.clear();
  // default_val 初始值按需设置，一般是0，也可以按需设置为最大值或者最小值
  str.resize(maxNM + 1, default_val);
  for (int i = 0; i < str_.size(); i++) {
    str[i + 1] = str_[i];
  }
}
```


线段树的构建过程是自顶向下的，从根节点开始，递归地构建左右子树。
在构建过程中，每个节点的值都是通过合并左右子节点的值来计算得到的。


```cpp
  void Build(int l = 1, int r = maxNM, int rt = 1) {
    sign[rt] = 0;
    ranges[rt] = {l, r};
    if (l == r) {
      sumVal[rt] = str[l];  // 如果 str 没有复制一份，则需要注意边界是否越界
      minVal[rt] = maxVal[rt] = {str[l], l};
      return;
    }
    int m = (l + r) >> 1;
    Build(l, m, rt << 1);
    Build(m + 1, r, rt << 1 | 1);
    PushUp(rt, l, r);
  }
```


PushUp 用于更新当前节点的值，通常是通过合并左右子节点的值来计算得到的。  


```cpp
// 合并函数，按需进行合并
void PushUp(int rt, int l, int r) {
  minVal[rt] = min(minVal[rt << 1], minVal[rt << 1 | 1]);
  maxVal[rt] = max(maxVal[rt << 1], maxVal[rt << 1 | 1]);
  sumVal[rt] = sumVal[rt << 1] + sumVal[rt << 1 | 1];
}
```

更新时，从根节点开始，递归地更新左右子树，直到找到包含更新区间的叶子节点。  
更新区间覆盖当前节点的区间时，直接更新当前节点的值，并打上延迟标记。  
否则，先下推延迟标记，再递归地更新左右子树，最后更新当前节点的值。  


```cpp
int Num(pair<ll, ll> p) { return p.second - p.first + 1; }
void Update(int L, int R, ll add, int l = 1, int r = maxNM, int rt = 1) {
  if (L <= l && r <= R) {
    sign[rt] += add;          // 延迟标记整体加 add
    minVal[rt].first += add;
    maxVal[rt].first += add;
    sumVal[rt] += add * Num(ranges[rt]);
    return;
  }
  PushDown(rt);
  int m = (l + r) >> 1;
  if (L <= m) Update(L, R, add, l, m, rt << 1);
  if (R > m) Update(L, R, add, m + 1, r, rt << 1 | 1);
  PushUp(rt, l, r);
}
```

下推延迟标记的过程是将延迟标记的值传递给左右子节点，并将延迟标记清零。
下推延迟标记的目的是为了避免重复计算，从而提高效率。


```cpp
void PushDown(int rt) {
  if (sign[rt]) {
    sign[rt << 1] += sign[rt];
    sign[rt << 1 | 1] += sign[rt];
    minVal[rt << 1].first += sign[rt];
    minVal[rt << 1 | 1].first += sign[rt];
    maxVal[rt << 1].first += sign[rt];
    maxVal[rt << 1 | 1].first += sign[rt];
    sumVal[rt << 1] += sign[rt] * Num(ranges[rt << 1]);
    sumVal[rt << 1 | 1] += sign[rt] * Num(ranges[rt << 1 | 1]);
    sign[rt] = 0;
  }
}
```



查询时，从根节点开始，递归地查询左右子树，直到找到包含查询区间的叶子节点。  
下面是最大值的查询代码，最小值以及区间和的查询与下面的代码类似。  


```cpp
// L,R 查询的区间
// rt,l,r 线段树的节点编号与对应的区间
pair<ll, int> QueryMax(int L, int R, int l = 1, int r = maxNM, int rt = 1) {
  if (L <= l && r <= R) {
    return maxVal[rt];
  }
  PushDown(rt);
  int m = (l + r) >> 1;
  pair<ll, int> ret = {-1, 0};
  if (L <= m) {
    ret = max(ret, QueryMax(L, R, l, m, rt << 1));
  }
  if (m < R) {
    ret = max(ret, QueryMax(L, R, m + 1, r, rt << 1 | 1));
  }
  return ret;
}
```

使用时，先初始化，然后更新与查询即可。  


```cpp
SegTree segTree;
vector<int> nums; // 原始数据

segTree.Init(nums, 0);
segTree.Build();

segTree.QuerySum(1, p); // 区间查询

// 单点设置值，由于更新是添加值，如果需要单点设置值，先查询出值，然后计算出差值，再更新
int addVal = tergetVal - segTree.QuerySum(p, p);
segTree.Update(p, p, addVal); // 区间更新
```


## 二、真题解析  


如下图，是 CSP-J 历年真题的题型分布，其中有 3 道题可以使用基础算法解决，同时数据范围变大时，也可以使用线段树来解决。  



![](https://res2025.tiankonguse.com/images/2025/10/13/001.png)


下图是 CSP-S 历年真题的题型分布，其中有 2 道题可以使用线段树，同样其中一道可以使用基础算法优先队列代替线段树。


![](https://res2025.tiankonguse.com/images/2025/10/13/002.png)


合起来供 5 道题可以使用线段树，汇总如下。  
其中 4 道都是单点更新，也可以不使用线段树。  
最后 1 道必须使用线段树，且不是普通的区间最值，而属于高级线段树，求职时做特殊处理。  


![](https://res2025.tiankonguse.com/images/2025/10/13/003.png)


这里重点来看下最后一道题。  


2022-S-B 策略游戏。  
通过贪心策略后，需要求出指定区间的正数最值、是否有0值、负数最值。  


如果一个区间都是正数，显然没有负数最小值和负数最大值。  
即存在某个最值不存在的情况。  


正常情况下，叶子节点的最值就是自己。  
在这里，需要把最值初始化为相反的最值。  


例如负数最大值要取 max 操作，初始化为负数最小值；负数最小值要取 min 操作，初始化为正数最大值。  
同样，正数最大值要取 max 操作，初始化为负数最小值；正数最小值要取 min 操作，初始化为正数最大值。  



```cpp
const ll kMaxVal = 10e9 + 10;
const ll kMinVal = -kMaxVal;
struct Node {
  ll negMin = kMaxVal, negMax = kMinVal, posMin = kMaxVal, posMax = kMinVal, zero = 0;
};
```


初始化时，根据元素值的符号，初始化对应的最值。  


```cpp
void Build(int l = 1, int r = maxNM, int rt = 1) {
  if (l == r) {
    const ll& val = str[l];
    if (val > 0) {
      nodes[rt].posMin = min(nodes[rt].posMin, val);
      nodes[rt].posMax = max(nodes[rt].posMax, val);
    } else if (val < 0) {
      nodes[rt].negMin = min(nodes[rt].negMin, val);
      nodes[rt].negMax = max(nodes[rt].negMax, val);
    } else {
      nodes[rt].zero = 1;
    }
    return;
  }
  int m = (l + r) >> 1;
  Build(lson);
  Build(rson);
  PushUp(rt, l, r);
}
```

合并节点时，四个最值可以直接合并，0 值就需要加法 或者 或运算了。  


```cpp
Node merge(const Node& left, const Node& right) {
  Node cur;
  cur.negMin = min(left.negMin, right.negMin);
  cur.negMax = max(left.negMax, right.negMax);
  cur.posMin = min(left.posMin, right.posMin);
  cur.posMax = max(left.posMax, right.posMax);
  cur.zero = left.zero + right.zero;
  return cur;
}
// 合并函数，按需进行合并
void PushUp(int rt, int l, int r) {  //
  nodes[rt] = merge(nodes[rt << 1], nodes[rt << 1 | 1]);
}
```


由于这道题不存在更新，不需要延迟标记，查询直接合并左右子树即可。  


```cpp
Node Query(int L, int R, int l = 1, int r = maxNM, int rt = 1) {
  if (L <= l && r <= R) {
    return nodes[rt];
  }
  int m = (l + r) >> 1;
  Node node;
  if (L <= m) {
    node = merge(node, Query(L, R, lson));
  }
  if (m < R) {
    node = merge(node, Query(L, R, rson));
  }
  return node;
}
```



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
