---
layout: post
title: leetcode 周赛 478 - 莫队算法  
description: 竟然这么多人会莫队算法        
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-11-30 12:13:00
published: true
---

## 零、背景  


这次比赛最后一题是莫队算法模板题，由于我好多年没写过莫队了，现场去学习莫队算法，做出来时比赛已经结束了。  


A: 后缀和  
B: 去重  
C: 前缀和  
D: 前缀和/莫队+离散化+树状数组   


**最终排名**：156  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、统计合格元素的数目  


题意：给你一个长度为 n 的整数数组 nums 和一个整数 k。  
如果数组 nums 中的某个元素满足以下条件，则称其为 合格元素：存在 至少 k 个元素 严格大于 它。  
返回一个整数，表示数组 nums 中合格元素的总数。  


思路：后缀和  


根据合格元素的定义，需要查找大于一个值的元素个数。  


可以排序后从大到小遍历，同时记录个数，从而可以快速统计大于一个值的元素个数。  


```cpp
sort(nums.begin(), nums.end(), greater<int>());
int ans = 0;
unordered_map<int, int> se;
int K = 0;
for (auto v : nums) {
  if (K - se[v] >= k) {
    ans++;
  }
  se[v]++;
  K++;
}
```


当然，也可以使用二分查找来做。  


```cpp
sort(nums.begin(), nums.end());
int ans = 0;
for (auto v : nums) {
  int idx = upper_bound(nums.begin(), nums.end(), v) - nums.begin();
  if (n - idx >= k) {
    ans++;
  }
}
```


## 二、不同首字母的子字符串数目  


题意：给一个字符串，问可以拆分多少个子字符串，使得每个子字符串的首字母都不相同。  


思路：贪心  


贪心策略：遇到前面没出现的字母，就拆分。  
这不就是统计不同首字母的数目吗？  


```cpp
set<char> st(s.begin(), s.end());
return st.size();
```


## 三、镜像对之间最小绝对距离  


题意：给一个数组，问每个元素与前面的镜像对之间的最小绝对距离。  


思路：前缀和  


边遍历边记录前缀每个元素镜像值的最大下标，然后计算差值。  


```cpp
int ans = INT_MAX;
unordered_map<ll, int>  mpR;
int n = nums.size();
for (int i = 0; i < n; i++) {
  ll v = nums[i];
  ll V = Reverse(v);
  if (mpR.count(v)) {
    ans = min(ans, i - mpR[v]);
  }
  mpR[V] = i;
}
if (ans == INT_MAX) {
  ans = -1;
}
```

## 四、使数组元素相等的最小操作次数  


题意：给一个数组，每次可以对一个数字增加 K 或者减少 K。给若干次询问，问在每次询问中，使数组元素相等所需的最小操作次数。  


思路：前缀和或莫队算法  


首先有一个显然不存在答案的剪枝：如果区间内元素对 K 取模不一致，那么一定不存在答案。  
这个可以预处理出每个元素取模后相等的最大区间来快速判断。  


```cpp
// {a, b}, nums[i] = a * k + b
vector<pair<int, int>> AB(n, {0, 0});  
for (int i = 0; i < n; i++) {
  ll v = A[i];
  AB[i] = {v / k, v % k};
  A[i] = v / k;
}
vector<int> sameLeft(n, 0);
for (int i = 1; i < n; i++) {
  if (AB[i].second == AB[i - 1].second) {
    sameLeft[i] = sameLeft[i - 1];
  } else {
    sameLeft[i] = i;
  }
}
```


其次，对原数组加减 K 与对除以 K 之后的数组加减 1 是等价的。  
而加减 1 的最优答案在中位数。  


所以问题转化为：快速求一个区间的中位数，然后再计算出各个数字到中位数的距离之和。  
PS：加减 K 的答案是加减 1 的 K 倍。  



如何求一个区间的中位数？  
可以把值域储存在树状数组中，然后查询第 `n/2` 大的值即可。  


注：线段树也可以实现。  


```cpp
// 使用二分查找在 BIT 上定位
int find_kth(int k) {
  int low = 1, high = n;
  int median = n;

  // 经典二分查找
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (bit_query(mid) >= k) {
      median = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return median;
}
```


由于值域比较大，所以这里需要使用离散化。  


```cpp
vector<int> sorted_A;  // 不同值的有序列表，1-base
vector<int> B;         // 离散化后的值, 值是1-base,对应 sorted_A
// 离散化
vector<int> temp_A = A;
sort(temp_A.begin(), temp_A.end());
temp_A.erase(unique(temp_A.begin(), temp_A.end()), temp_A.end());
sorted_A.resize(temp_A.size() + 1, 0);
map<int, int> valToIdx;  // 值到下标，1-base
for (int i = 1; i <= temp_A.size(); ++i) {
  int v = temp_A[i - 1];
  valToIdx[v] = i;  // 离散化值从 1 开始
  sorted_A[i] = v;
}
B.resize(n);
for (int i = 1; i <= n; i++) {
  B[i - 1] = valToIdx[A[i - 1]];
}
```


确定了中位数，就需要计算出每个数字到中位数的距离之和了。  




第一个方案：莫队算法。  


莫队算法常用来计算多次区间查询的答案。  
通过离线查询，将区间按照左端点排序，然后依次计算每个区间内的答案。  
均摊复杂度为 `O(n sqrt(n))`。  


```cpp
int current_l = 0, current_r = -1;
for (auto& q : queries) {
  // L 移动
  while (current_l > q.l) {
    current_l--;
    Add(B[current_l]);
  }
  while (current_l < q.l) {
    Remove(B[current_l]);
    current_l++;
  }
  // R 移动
  while (current_r < q.r) {
    current_r++;
    Add(B[current_r]);
  }
  while (current_r > q.r) {
    Remove(B[current_r]);
    current_r--;
  }
  // 存储答案
  q.answer = total_ops;
}
```


插入一个元素后，先计算答案，然后计算中位数，并移动中位数来更新答案。  
删除一个元素类似，这里就不赘述了。  


```cpp
void Add(int x) {
  // 1. 更新总操作次数（基于旧中位数）
  long long raw_x = sorted_A[x];  // 离散化值 x 对应的原始值
  long long raw_c = sorted_A[median_val];

  total_ops += abs(raw_x - raw_c);
  current_size++;

  // 2. 更新 BIT
  FenwickTree::bit_update(x, 1);

  // 3. 检查中位数是否需要调整
  int rank = (current_size + 1) / 2;
  int new_median = FenwickTree::find_kth(rank, median_val);
  Update(new_median);
}
```


更新中位数时稍微复杂点，需要判断中位数是左移还是右移。  


```cpp

void Update(int new_c) {  // 预期只移动一次
  if (new_c == median_val) return;

  if (new_c > median_val) {  // 中位数向右 (增大)
    // C -> C+1 (在离散化值上)
    for (int c = median_val; c < new_c; ++c) {
      long long raw_x = sorted_A[c];  // 离散化值 x 对应的原始值
      long long raw_c = sorted_A[c + 1];

      long long less_equal_c = FenwickTree::bit_query(c);
      long long greater_c = current_size - less_equal_c;
      total_ops += (less_equal_c - greater_c) * (raw_c - raw_x);
    }
  } else {  // 中位数向左 (减小)
    // C -> C-1
    for (int c = median_val; c > new_c; --c) {
      long long raw_x = sorted_A[c];  // 离散化值 x 对应的原始值
      long long raw_c = sorted_A[c - 1];
      long long less_than_c = FenwickTree::bit_query(c - 1);
      long long greater_equal_c = current_size - less_than_c;
      total_ops += (greater_equal_c - less_than_c) * (raw_c - raw_x);
    }
  }
  median_val = new_c;
}
```


第二个思路是前缀和。  


假设插入的元素是 x，中位数是 c，且 c 大于 x，那么移动次数是 `c - x`。  
如果 c 前面有 n 个元素，那么所有移动次数就是 `sum(c - x[i])`。  


公式转化一下就是 `c * n - sum(x[i])`。  
`sum(x[i])` 可以用前缀和计算。  


同理，如果 c 小于 x，那么移动次数是 `x - c`，所有移动次数就是 `sum(x[i]) - c * n`。  


这里具体再展开一下。  
假设询问的是区间 `[L, R]`，假设中位数是 c， c 前面有 nl 个元素， c 后面有 nr 个元素。  
则答案是 `c * nl - sum(left) + sum(right) - c*nr`。  


前缀和可以通过另外一个树状数组来计算。  


## 五、最后  


这次比赛最后一题我又想复杂了。  
本来可以使用前缀和几行代码就搞定的，我第一时间想到的是莫队算法，然后就现场去复习莫队算法去了。  
不过这次我已经把莫队算法的模板整理好了，下次再遇到类似的问题，直接套用模板即可。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
