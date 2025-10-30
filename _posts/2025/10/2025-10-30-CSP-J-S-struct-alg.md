---
layout: post
title: CSP-J/S 备考总结之常见数据结构
description: 前缀和、差分数组、优先队列、并查集、哈希表等
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-10-30 20:13:00
published: true
---



## 零、背景


CSP-J/S 是从 2019 年开始举办的。  


之前已经在《[近 6 年 CSP-J 算法题型分析](https://mp.weixin.qq.com/s/MkE5yfMLioAxGtiFKz1-cg)》和《[历年 CSP-S 算法题型分析](https://mp.weixin.qq.com/s/meOv7fuSQaXEYU3mlOdb8w)》两篇文章里总结了 CSP-J 和 CSP-S 的题型。  


接下来我的规划分两部分：  


**第一部分**：介绍常见算法如何实现，以及在历年真题中是如何应用的。  
**第二部分**：介绍面对比赛时，使用什么样的策略，才能尽可能拿到更高的分数。  


第一部分已经分享了[二分](https://mp.weixin.qq.com/s/Wi8Bb1fAvQ7BEAwSUZXLdw)、[线段树](https://mp.weixin.qq.com/s/KKgBp_AhWvoKS_wVoKX_Rg)、[状态最短路](https://mp.weixin.qq.com/s/bU5DlFIjXsJiJkNekr6Efg)、[动态规划](https://mp.weixin.qq.com/s/73dXl-dP2LcaYpd7j-0-wg)、《[数学](https://mp.weixin.qq.com/s/fBrkJfeb3GQZSGYpE0BxqQ)》。  
第二部分已经分享了[得分技巧](https://mp.weixin.qq.com/s/6RIMRGRTvcZujhSJzlHfjQ)、[环境准备](https://mp.weixin.qq.com/s/2CJBXOxT5lXoN_jNqDhaKQ)。  



这篇文章属于第一部分第六篇，聚焦比赛中高频出现的基础数据结构与套路。  





## 一、双指针与滑动窗口  


对于一些需要在数组/字符串中寻找满足某种条件的子区间问题，双指针与滑动窗口是常用的技巧。    
例如：寻找和为定值的最长子数组、寻找包含某些字符的最短子串等。  


针对这类问题，通常可以使用两个指针（left 和 right）来表示当前的子区间。  
通过移动 right 指针扩展区间，移动 left 指针缩小区间，从而找到满足条件的子区间。  



常见的题型有定长滑动窗口、变长滑动窗口等。  


定长滑动窗口：窗口大小固定，通常用于计算每个子区间的某种属性（如和、最大值、最小值等）。  



```cpp
// 固定长度为 k 的最大子数组和
long long sum = 0, maxSum = LLONG_MIN;
int n = nums.size();
for (int i = 0; i < n; i++) {
  int l = i - k + 1; // 左指针位置
  sum += nums[i];    // 加入右端元素
  if (l < 0) {       // 不够 k 个，继续扩张
    continue;
  }
  maxSum = max(maxSum, sum);   // 更新答案
  sum -= nums[l];               // 左指针右移 1 位
}
return maxSum;
```


对于循环数组，可以使用取模运算来处理指针的移动。  


```cpp
// 循环数组上的固定窗口（长度 k）的最小子数组和
long long best = LLONG_MAX;
long long sum = 0;
for (int i = 0; i < n + k; i++) {
  int l = i - k + 1;        // 左指针位置
  sum += nums[i % n];       // 加入右端元素
  if (i < k - 1) {          // 未形成完整窗口
    continue;
  }
  best = min(best, sum);    // 更新答案
  sum -= nums[(l % n + n) % n]; // 左指针右移 1 位（注意取模防负值）
}
return best;
```


不定长滑动窗口：窗口大小可变，通常用于寻找满足某种条件的最小/最大子区间，或者某种特定性质的子区间个数。  



```cpp
int l = 0, r = 0;
int ans = 0;
auto addRight = [&](const auto& v) { /* 更新窗口状态 */ };
auto removeLeft = [&](const auto& v) { /* 回滚窗口状态 */ };
auto shouldShrink = [&]() -> bool { return false; /* 根据状态判断是否需要收缩 */ };
while (r < n) {
  addRight(nums[r]); // 1) 右指针扩张
  ++r;

  while (l < r && shouldShrink()) { // 2) 必要时左指针收缩
    removeLeft(nums[l]);
    ++l;
  }

  ans = max(ans, r - l); // 3) 更新答案（如最大长度）
}
return ans;
```


小结与易错点：  


- 固定窗口通常只需“右进左出”，变量类型用 `long long` 更安全。  
- 循环数组注意下标取模和可能的负值，建议写成 `((x % n) + n) % n`。  
- 变长窗口的核心是“保持窗口合法”，思路是“先右扩、再按需左缩、最后更新答案”。  


## 二、前缀和  



前缀和是一种常用的数据结构，用于快速计算数组某个区间的和。  
通过预处理前缀和数组，可以在 `O(1)` 时间内计算任意区间的和。  


如果区间包含下标 0，直接做差会不方便。  
所以前缀和数组通常多开一个元素，令 `prefixSum[0] = 0`，这样 `prefixSum[i]` 表示“前 i 个元素”的和。  
为了对齐下标，建议所有地方都使用 `1-based` 下标。  



```cpp
vector<long long> prefixSum(n + 1, 0);
for (int i = 1; i <= n; i++) {
  prefixSum[i] = prefixSum[i - 1] + nums[i - 1];
}

// 计算区间 [l, r] 的和（1-based）
long long rangeSum = prefixSum[r] - prefixSum[l - 1];
```
  
复杂度：

- 预处理 `O(n)`，区间查询 `O(1)`。  
- 易错点：下标统一用 `1-based`；数据范围大时用 `long long`。  



**前缀和与哈希表**  


更多的时候，前缀和会和哈希表结合使用，用于解决一些子数组和问题。  
例如：寻找和为定值的子数组个数。  


## 三、差分数组  


差分是前缀和的逆操作。  


对于一个数组 `nums`（下标 `0…n-1`），其差分数组 `diff`（用 `1-based`）可定义为：`diff[1] = nums[0]`，`diff[i] = nums[i-1] - nums[i-2] (i >= 2)`。  


```cpp
// 构造差分（1-based），多开一位方便做 r+1 操作
vector<long long> diff(n + 2, 0);
diff[1] = nums[0];
for (int i = 2; i <= n; i++) {
  diff[i] = nums[i - 1] - nums[i - 2];
}
```


例如我们想对数组的某个区间 `[l, r]` 进行加法操作 `addVal`，可以通过更新差分数组来实现，即平常所说的**左加右减**。  
这样本来需要`O(n)`的操作，就可以降到`O(1)`。  


```cpp
// 区间加法：对 [l, r] 全部加上 addVal（1-based）
void rangeAdd(vector<long long>& diff, int l, int r, long long addVal) {
  diff[l] += addVal;
  diff[r + 1] -= addVal; // 需保证 diff 至少开到 n+2
}

// 还原原数组：对 diff 做一次前缀和
vector<long long> a(n + 1, 0);
for (int i = 1; i <= n; i++) {
  a[i] = a[i - 1] + diff[i];
}
```

复杂度与易错点：  


- 每次区间加是 O(1)，最终一次前缀和 O(n) 还原。  
- 常见错误：`diff` 开小导致 `r+1` 越界；0/1-based 混用；还原时忘记做前缀和。  



## 四、栈、队列、单调栈/队列  


栈的特点是后进先出（LIFO），一般直接使用 STL 的 `stack` 即可。  


```cpp
// 栈的操作
stack<int> stk;
stk.push(x);    // 入栈
stk.pop();      // 出栈
int top = stk.top(); // 访问栈顶元素
bool isEmpty = stk.empty(); // 判断栈是否为空
int size = stk.size(); // 栈的大小
```



队列的特点是先进先出（FIFO），一般直接使用 STL 的 `queue` 即可。  


```cpp
// 队列的操作
queue<int> q;
q.push(x);    // 入队
q.pop();      // 出队
int front = q.front(); // 访问队首元素
int back = q.back();   // 访问队尾元素
bool isEmpty = q.empty(); // 判断队列是否为空
int size = q.size(); // 队列的大小
```


单调栈/队列是一种保证“出入过程中单调性不被破坏”的数据结构，栈/队列中的元素按照某种顺序（递增或递减）维护。  
单调栈是一种特殊的栈，还是使用 STL 的 `stack` 来实现。  
单调队列需要两端进出，所以使用 STL 的 `deque` 来实现。  



```cpp
// 双向队列的操作
deque<int> dq;
dq.push_back(x);    // 队尾入队
dq.push_front(x);   // 队首入队
dq.pop_back();      // 队尾出队
dq.pop_front();     // 队首出队
int front = dq.front(); // 访问队首元素
int back = dq.back();   // 访问队尾元素
bool isEmpty = dq.empty(); // 判断队列是否为空
int size = dq.size(); // 队列的大小
```



## 五、堆与优先队列  


堆分为最大堆和最小堆。  
最大堆中每个节点的值都大于等于其子节点的值，最小堆中每个节点的值都小于等于其子节点的值。  
堆通常用数组来实现，父节点和子节点之间的关系可以通过下标计算得出。  


通过“对顶堆”（一小一大两个堆）可以在线维护中位数或第 K 小/大的元素。  


不过，STL 已经有现成的堆实现，可以直接使用 `priority_queue`。  


```cpp
// 最大堆
priority_queue<int> maxHeap;
maxHeap.push(x); // 插入元素
maxHeap.pop();   // 删除堆顶元素
int top = maxHeap.top(); // 访问堆顶元素
bool isEmpty = maxHeap.empty(); // 判断堆是否为空
int size = maxHeap.size(); // 堆的大小


// 最小堆
priority_queue<int, vector<int>, greater<int>> minHeap;
minHeap.push(x); // 插入元素
minHeap.pop();   // 删除堆顶元素
int top = minHeap.top(); // 访问堆顶元素
bool isEmpty = minHeap.empty(); // 判断堆是否为空
int size = minHeap.size(); // 堆的大小
```


## 六、哈希表  


哈希表是一种通过哈希函数将键映射到值的数据结构，支持快速的插入、删除和查找操作。  
STL 中的 `unordered_map` 和 `unordered_set` 提供了哈希表的实现。  


```cpp
// 哈希映射（unordered_map）
unordered_map<string, int> mp;
mp["key"] = 42;                  // 插入或更新
int v1 = mp["key"];              // 访问（若 key 不存在会插入默认值 0）
auto it = mp.find("key");        // 查询但不插入
bool exists = (it != mp.end());
if (exists) {
  int v2 = it->second;           // 安全读取
}
mp.erase("key");                 // 删除
int sz = (int)mp.size();
bool empty = mp.empty();

// 哈希集合（unordered_set）
unordered_set<int> st;
st.insert(x);
st.erase(x);
bool has = (st.find(x) != st.end());
int ssize = (int)st.size();
bool sempty = st.empty();
```

提示：查询时优先用 `find/at` 避免 `operator[]` 的“默认插入”副作用；当键是复合类型（如 pair）时需自定义哈希函数。  



## 七、并查集  


并查集（Disjoint Set Union, DSU）是一种用于处理不交集的数据结构，支持合并和查找操作。  
并查集通常用于解决连通性问题，例如判断两个元素是否属于同一集合、求最小生成树。  


```cpp
// 并查集（DSU）：路径压缩 + 按秩合并
class DSU {
  vector<int> fa, rk, sz; // 父节点、秩、所在集合大小

 public:
  DSU(int n = 0) { init(n); }

  void init(int n) {
    fa.resize(n);
    rk.assign(n, 0);
    sz.assign(n, 1);
    iota(fa.begin(), fa.end(), 0);
  }

  int find(int x) {
    return fa[x] == x ? x : fa[x] = find(fa[x]);
  }

  // 合并两个集合，返回是否发生了合并
  bool unite(int x, int y) {
    x = find(x); y = find(y);
    if (x == y) return false;
    if (rk[x] < rk[y]) swap(x, y);
    fa[y] = x;
    sz[x] += sz[y];
    if (rk[x] == rk[y]) rk[x]++;
    return true;
  }

  bool same(int x, int y) { return find(x) == find(y); }
  int size(int x) { return sz[find(x)]; }
};
```

复杂度：近似 O(α(n))，可视为常数；常用于连通性判定、最小生成树（Kruskal）等。  


## 八、最后  


常见的还有 Trie 字典树、树状数组、线段树、ST 表、分块等。  
线段树我已在前文给出专篇；其余结构在 CSP 中也会考到，但实现量稍大，本文不展开。  



另外，图论与字符串也是高频大类，后续我会单独写文详解。  


比赛将至，祝大家备考顺利、稳定发挥。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
