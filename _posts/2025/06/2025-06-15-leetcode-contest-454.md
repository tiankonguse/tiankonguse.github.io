---
layout: post
title: leetcode 第 454 场算法比赛-树上倍增翻车了
description: 复用二分代码是万恶之源  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-06-15 12:13:00
published: true
---



## 零、背景


这次比赛最后一题是树上倍增，进入前百名的机会来了，可是需要写两个二分，我一直想通过回调函数复用一个二分，到比赛结束样例都没通过。  
比赛结束后老老实实写两个二分，一下就过了。  


A: 模拟      
B: 统计    
C: 滑动窗口  
D: 树上倍增+二分    


排名：200+    
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  

## 一、为视频标题生成标签  


![](https://res2025.tiankonguse.com/images/2025/06/15/001.png)  



题意：给一个视频标题，需要按规则转化为标签。  
规则：  
1）所有单词按驼峰命名，即首字母大写，其他字母都需要小写，但第一个单词的首字母需要小写。  
2）移除所有非字母字符。  
3）第一个字符为 `#`  
4）最长100个字符。  


思路：模拟  


按题意，第一步标题拆分为若干个字符串，拆分过程中把所有非字母字符移除。  
第二步，把每个单词的首字母大写，其他小写。  
第三步，把所有单词拼接起来，第一个单词的首字母小写。  
第四步，添加 `#` 号。  
第五步，判断长度是否超过 100，超过则截断。  



```cpp
string ans;
ans.push_back('#');
bool isFirstWord = true;
SplitWord(caption);
for (auto& word : words) {
  if (isFirstWord) {
    isFirstWord = false;
  } else {
    word[0] = word[0] - 'a' + 'A';
  }
  ans.append(word);
}
if (ans.size() > 100) {
  ans.resize(100);
}
return ans;
```

## 二、统计特殊三元组  


![](https://res2025.tiankonguse.com/images/2025/06/15/002.png)  


题意：给一个数组，问有多少个三元组满足两边的数字是中间的二倍。  


思路：统计。  


对于第 i 个数字，假设我们已经统计得到前面所有二元组的答案，只需要看有多少个二元组满足 `nums[j] == 2 * nums[i]` 即可。  


所以我们需要预处理出所有二元组的答案。  
对于二元组也一样，对于第 i 个数字，我们只需要看有多少个数字满足 `2 * nums[j] == nums[i]` 即可。


```cpp
ll ans = 0;
unordered_map<ll, ll> m1;
unordered_map<ll, ll> m2;
// 2v -> v -> 2v
for (ll v2 : nums) {
  // 计算答案
  if (v2 % 2 == 0) {
    ll v = v2 / 2;
    if (m2.count(v)) {
      ans = (ans + m2[v]) % mod;
    }
  }
  // 计算 m2
  if (m1.count(v2 * 2)) {
    m2[v2] = (m2[v2] + m1[v2 * 2]) % mod;
  }
  // 计算 m1
  m1[v2]++;
}
return ans;
```

## 三、子序列首尾元素的最大乘积  


![](https://res2025.tiankonguse.com/images/2025/06/15/003.png)  


题意：给一个数组，求一个长度为 m 的子序列，使得首尾元素的乘积最大。  


思路：滑动窗口  


由于是首尾乘积，所以中间的值都无所谓。  
由于是子序列，所以两个位置的距离只要不小于 m，都可以当做首尾来计算答案。  


所以我们可以维护一个长度为 m 的滑动窗口 `[L,R]`，窗口`R`当做首部元素，窗口 `L` 前的元素都是尾部元素。  


由于是求最值，不同符号最值不一样，所以需要按符号分类储存。  
分别储存三个最值：负数最值、正数最值、是否有 0。  
为了简单起见，这里直接用 set 来储存。  


```cpp
ll ans = ll(nums[0]) * ll(nums[k - 1]);
set<ll> pre_1, pre_0, pre1;
for (int i = 0; i < n; i++) {
  int l = i - k + 1;
  if (l < 0) {  // 不够 k 个，跳过
    continue;
  }
  ll rightVal = nums[i];  // 右指针
  ll leftVal = nums[l];   // 左指针
  if (leftVal < 0) {
    pre_1.insert(leftVal);
  } else if (leftVal == 0) {
    pre_0.insert(leftVal);
  } else {
    pre1.insert(leftVal);
  }
  if (!pre_1.empty()) {
    ans = max(ans, *pre_1.begin() * rightVal);
    ans = max(ans, *pre_1.rbegin() * rightVal);
  }
  if (!pre_0.empty()) {
    ans = max(ans, *pre_0.begin() * rightVal);
    ans = max(ans, *pre_0.rbegin() * rightVal);
  }
  if (!pre1.empty()) {
    ans = max(ans, *pre1.begin() * rightVal);
    ans = max(ans, *pre1.rbegin() * rightVal);
  }
}
return ans;
```


优化：可以看到，每个符号只关心最新，所以可以使用几个变量来储存最值。  


为了避免出错，从工程角度来看，建议遵循职责单一原则。  
具体来说，每个变量的含义是固定的，不要使用变量的特殊值来做特殊判断。  
这里每个符号我都定义了最大值、最小值、是否有值。  
最大值和最小值默认定义为值域外的值，这样在进行 max 与 min 时可以保证一定不会出错。 

```cpp
ll leftMin = 0, leftMax = *min_element(nums.begin(), nums.end()) - 1, haveLeft = 0;
ll rightMin = *max_element(nums.begin(), nums.end()) + 1, rightMax = 0, haveRight = 0;
ll haveMid = 0;

// 更新最值
if (leftVal < 0) {
  haveLeft = 1;
  leftMin = min(leftMin, leftVal);
  leftMax = max(leftMax, leftVal);
} else if (leftVal == 0) {
  haveMid = 1;
} else {
  haveRight = 1;
  rightMin = min(rightMin, leftVal);
  rightMax = max(rightMax, leftVal);
}

// 计算答案
if (haveLeft) {
  ans = max(ans, leftMin * rightVal);
  ans = max(ans, leftMax * rightVal);
}
if (haveMid) {
  ans = max(ans, 0 * rightVal);
}
if (haveRight) {
  ans = max(ans, rightMin * rightVal);
  ans = max(ans, rightMax * rightVal);
}
```

## 四、树中找到带权中位节点  



![](https://res2025.tiankonguse.com/images/2025/06/15/004.png) 



题意：给一个无向带权树，给你两个节点，求这个节点组成的有向路径的中位节点。  
有向路径中位节点定义：路径上距离起点最近的节点，且满足到起点的距离大于等于路径总距离的一半。  



思路：树上倍增+二分  


如果你会树上倍增的话，可以发现这道题就是一个树上倍增+二分即可解决。  


第一步，使用 RMQ 初始化树上倍增，顺便计算每个节点到根节点的距离。  


```cpp
const int maxn = 100005;
const int maxn_log = 20;
vector<pair<int, ll>> g[maxn];
ll f[maxn][maxn_log], dep[maxn], preDis[maxn];

void DfsRMQ(int u, int pre) {
  for (auto [v, w] : g[u]) {
    if (v == pre) continue;
    preDis[v] = preDis[u] + w;
    dep[v] = dep[u] + 1;
    // 初始化：第 2^0 = 1 个祖先就是它的父亲节点，dep 也比父亲节点多 1。
    f[v][0] = u;
    // 初始化：其他的祖先节点：第 2^i 的祖先节点是第 2^(i-1) 的祖先节点的第 2^(i-1) 的祖先节点。
    for (int i = 1; i < maxn_log; i++) {
      f[v][i] = f[f[v][i - 1]][i - 1];
    }
    DfsRMQ(v, u);
  }
}
```


第二步，是一个倍增计算第 k 个父节点的函数。  


```cpp
// u 向上跳 k 步，返回跳到的节点编号
int PreKthAncestor(int u, int k) {
  for (int i = maxn_log - 1; k && i >= 0; i--) {
    if (k & (1 << i)) {
      u = f[u][i];
      k = k ^ (1 << i);
    }
  }
  return u;
}
```

第三步，是倍增查询最近公共祖先。  


```cpp
int Lca(int u, int v) {
  if (dep[u] < dep[v]) swap(u, v);
  u = PreKthAncestor(u, dep[u] - dep[v]);
  if (u == v) return u;
  for (int i = maxn_log - 1; i >= 0; i--) {
    if (f[u][i] != f[v][i]) {
      u = f[u][i];
      v = f[v][i];
    }
  }
  return f[u][0];
}
```


第四步，在路径上二分第K个父节点，判断是否是答案。  


LCA 共分四种情况，决定了是向下搜索还是向上搜索。  


1）u 是 v 的祖先，需要从上到下搜索。  
2）v 是 u 的祖先，需要从下到上搜索。  
3）u 和 v 之间有一个公共祖先，答案在 u 这一侧，需要从下往上搜索。  
4）u 和 v 之间有一个公共祖先，答案在 v 这一侧，需要从上往下搜索。  


从 u 节点开始搜索时，需要找到一个节点 P，使得 `dis(u, p) >= targetVal`  
从 v 节点开始搜索时，需要找到一个节点 P，使得 `dis(v, p) <= targetVal`


```cpp
vector<int> ans;
ans.reserve(queries.size());
for (auto& q : queries) {
  int u = q[0], v = q[1];
  if (u == v) {
    ans.push_back(u);
    continue;
  }
  int lca = Lca(u, v);
  ll dis = preDis[u] + preDis[v] - 2 * preDis[lca];
  ll uhalf = (dis + 1) / 2;
  ll vhalf = dis - uhalf;
  if (lca == u) {  // u 是 v 的祖先
    ans.push_back(SolverV(v, lca, [&vhalf](ll sum) { return sum <= vhalf; }));
  } else if (lca == v) {  // v 是 u 的祖先
    ans.push_back(SolverU(u, lca, [&uhalf](ll sum) { return sum >= uhalf; }));
  } else {  // u 和 v 之间有一个公共祖先
    ll disu = preDis[u] - preDis[lca];
    if (disu >= uhalf) {
      ans.push_back(SolverU(u, lca, [&uhalf](ll sum) { return sum >= uhalf; }));
    } else {
      ans.push_back(SolverV(v, lca, [&vhalf](ll sum) { return sum <= vhalf; }));
    }
  }
}
```


可以发现，两种二分搜索的条件不同。  


答案在 u 这一半时，是从首部开始搜索的，二分的结果是 `000...111`，即大于某个位置后，都满足。  


```cpp
int SolverU(const int u, const int pre, function<int(ll)> checkCallback) {
  int l = 0, r = dep[u] - dep[pre];
  while (l < r) {
    int mid = (l + r) / 2;
    // 在 RMQ 中找到 u 的第 mid 个祖先
    int p = PreKthAncestor(u, mid);
    ll sum = preDis[u] - preDis[p];
    if (checkCallback(sum)) {  
      // 满足条件，说明 p 是一个候选答案，但是还有更小的
      r = mid;
    } else {  
      // 不满足条件，说明 p 不是一个候选答案，需要更大
      l = mid + 1;
    }
  }
  return PreKthAncestor(u, r);
}
```


答案在 v 这一侧时，是从尾部开始搜索的，二分的结果是 `111...000`，即大于某个位置后，都不满足，所以答案需要减一。  


```cpp
int SolverV(const int u, const int pre, function<int(ll)> checkCallback) {
  int l = 0, r = dep[u] - dep[pre];
  while (l < r) {
    int mid = (l + r) / 2;
    // 在 RMQ 中找到 u 的第 mid 个祖先
    int p = PreKthAncestor(u, mid);
    ll sum = preDis[u] - preDis[p];
    if (checkCallback(sum)) {
      // 满足条件，说明 p 是一个候选答案，但是还有大小的
      l = mid + 1;
    } else {
      // 不满足条件，说明 p 不是一个候选答案，需要更大
      r = mid;
    }
  }
  return PreKthAncestor(u, r - 1);
}
```

## 五、最后


这次比赛最后一题是树上倍增，对我来说其实不难，进入前百名的机会来了。  


可以二分的时候，偷了个懒，两个不同的二分，我通过回调函数复用了一个代码，导致样例都没通过。  


后面意识到，两个二分的目标不一样，是无法复用的，只能分别写两个二分了。  


总结一下就是，二分的目标不一样，是无法复用代码的，复用二分代码是万恶之源。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
