---  
layout: post  
title: leetcode 周赛 528 - 排名 101  
description: 树形DP、博弈DP与按位与边界二分  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-11-15 12:13:00  
published: true  
---  


## 零、背景  


这次比赛整体不难，四道题都有比较直接的思路。  
第一题按题意枚举子数组即可，第四题是它的数据加强版。  
第二题是树形DP，第三题是博弈DP，都不需要复杂的数据结构。  
最终排名第 101 名。  


本场题型概览如下。  


A 题：枚举  
B 题：树形DP  
C 题：博弈DP  
D 题：按最小值分组 + 二分  


## 一、统计一致子数组数目 I  


题意：给你一个整数数组 `nums`。  
如果一个子数组中所有元素的按位与运算结果等于该子数组的最小值，则称该子数组为一致子数组。  
返回 `nums` 中一致子数组的个数。  
子数组是数组中一个连续、非空的元素序列。  


数据范围：  
`1 <= nums.length <= 100`  
`0 <= nums[i] <= 100`  


思路：枚举左右端点 + 增量维护  


判断一个子数组是否一致，需要两个值：子数组的按位与、子数组的最小值。  
如果对每个子数组都重新算一遍，单次判断是 `O(n)`，共 `O(n^2)` 个子数组，整体就退化成 `O(n^3)`。  


基本思路是利用前缀和思想。  
固定左端点，往右追加一个元素时，利用上个子数组的按位与与最小值即可求出当前位置的按位与与最小值。  
单次判断复杂度降到 `O(1)`  


枚举左端点 `l`，令按位与和最小值的初值都取 `nums[l]`，右端点从 `l` 开始沿数组向右走。  
每走一步更新两个量，相等就计数加一。  
每个子数组恰好被检查一次，单次判断 `O(1)`。  


复杂度：`O(n^2)`。  


## 二、将子树置零后的最大得分  


题意：给你一个长度为 `n` 的整数数组 `parent`，表示一棵节点编号从 0 到 `n-1` 的有根树，`parent[i]` 是节点 `i` 的父节点，根为节点 0（`parent[0] = -1`）。  
另有两个长度均为 `n` 的数组 `op` 和 `score`，`op[i]` 决定节点 `i` 允许执行的操作，`score[i]` 是该节点的分数。  


你需要对每个非叶节点 `i` 恰好处理一次，处理顺序任意：  
若 `op[i] = 0`，可以选择 `i` 的至多一个子节点，把以它为根的整棵子树中所有节点的分数置零；  
若 `op[i] = 1`，必须选择恰好一个子节点做同样的事。  


返回执行完所有操作后，所有节点分数之和的最大可能值。  
注：叶节点没有子节点，因此不执行任何操作；


思路：树形DP  


目标是求节点和最大，显然，处理一个节点时，需要处理儿子节点，在处理父节点。  


操作0是最多选择一个儿子子树清零。
如果最小的儿子子树节点和大于等于0，不需要清理。  
否则把这个最小的儿子子树清零，值按 0 计算。  


操作1是恰好选择一个儿子子树清零。  
那直接选择最小的儿子子树清零即可。  


复杂度：`O(n)`  




```cpp
int n;
vector<vector<int>> tree;
vector<int> op;
vector<int> score;
int Dfs(int u) {
  if (tree[u].empty()) {
    return score[u];  // 叶节点不执行操作
  }
  int sum = score[u];
  int minVal = 0;
  bool first = true;
  for (int v : tree[u]) {
    int val = Dfs(v);
    sum += val;
    if (first) {
      minVal = val;
      first = false;
    } else {
      minVal = min(minVal, val);
    }
  }
  if (op[u] == 0) {
    if (minVal < 0) {
      // 至多清零一个，只有负收益才值得
      sum -= minVal;  
    }
  } else {
    // 恰好清零一个
    sum -= minVal;  
  }
  return sum;
}
```


## 三、取数游戏的最大分差  


题意：Alice 和 Bob 用一个整数数组 `nums` 玩游戏，Alice 先手。  
每个回合，当前玩家可以取走并移除最左边的一个元素，或者在至少还剩两个元素时取走并移除最左边的两个元素。  


本回合取走的元素之和决定接下来由谁行动：  
如果这个和能被 3 整除，则换另一位玩家行动；  
否则当前玩家继续行动。  


一位玩家的得分是他取走的所有元素之和。  
两位玩家都采用最优策略，各自最大化自己的得分。  
当所有元素被取走时游戏结束，返回 Alice 的得分减去 Bob 的得分。  


思路：博弈DP  


状态定义：`pair<ll, ll> dp[i]` 第 i 个位置开始，最优策略下，`dp[i].first`为先手的最大得分，`dp[i].second`为后手的最大得分。  


状态转移方程分两种情况。  


第一种是选择当前一个元素，然后根据是否模3，确定后续的先手。  


```cpp
// 选择一个：
pair<ll, ll> v1 = {dp[i + 1].second + nums[i], dp[i + 1].first};
if (nums[i] % 3 != 0) {
  v1 = {dp[i + 1].first + nums[i], dp[i + 1].second};
}
```

第二种是选择前来那个元素，然后根据是否模3，确定后续的先手。


```cpp
// 选择两个
ll sum = nums[i] + nums[i + 1];
pair<ll, ll> v2 = {sum + dp[i + 2].second, dp[i + 2].first};
if (sum % 3 != 0) {
  v2 = {sum + dp[i + 2].first, dp[i + 2].second};
}
```

答案就是两个选择中较大的那个。  


```cpp
dp[i] = max(v1, v2);
```



换成差值状态后，转移可以写得更短。  


```cpp
typedef long long ll;

class Solution {
 public:
  ll maxDifference(vector<int>& nums) {
    int n = nums.size();
    vector<ll> f(n + 1, 0);  // f[i]：后缀 i 开始，当前行动者得分减对手得分的最大值
    for (int i = n - 1; i >= 0; i--) {
      ll s1 = nums[i];
      ll best = (s1 % 3 == 0) ? s1 - f[i + 1] : s1 + f[i + 1];
      if (i + 1 < n) {
        ll s2 = (ll)nums[i] + (ll)nums[i + 1];
        ll cand = (s2 % 3 == 0) ? s2 - f[i + 2] : s2 + f[i + 2];
        best = max(best, cand);
      }
      f[i] = best;
    }
    return f[0];
  }
};
```


## 四、统计一致子数组数目 II  


题意：同第一题。  
给你一个整数数组 `nums`，如果一个子数组中所有元素的按位与运算结果等于该子数组的最小值，则称它为一致子数组，返回一致子数组的个数。  



思路：枚举 + 二分  



与第一题一样，数据范围变大了，不能暴力枚举了。  


由于子数组与最小值有关，显然需要维护枚举最小值，判断有多少个子数组覆盖这个最小值，且满足条件。  


暴力做法是从枚举位置 p 向左右扩展，分别找到最远的左右边界 `[L,R]`。  
则覆盖当前枚举位置 p 的子数组个数是 `(p - L + 1) * (R - p + 1)`。  
暴力复杂度：`O(n^2)`  


显然，可以发现，预处理出每一位1的个数的前缀和后，就可以二分查找左右边界。  
复杂度：`O(B * n log(n))`  
其中 B 是值域的位数。  



代码写完后，可以发现第二组测试样例没有通过。  
原因是相同的最小值，重复统计子数组了。  


如下图，`[L,R]` 区间内如果有多个与位置 p 相同的值，就会重复统计子数组。  


![](https://res2026.tiankonguse.com/images/2026/11/15/001.png)


解决方案是对子数组进行分组，例如按左边界进行分组。  
第一个位置 p1，左边界最多到 p1。  
所以对于第二个位置 p2，不能从 `L` 统计左边界，而应该从 `p1+1` 开始统计。  


由此推导出解法：记录每个值当前的左边界。  
下个相同值的左边界就是当前值的左边界加1。    


```cpp
unordered_map<ll, ll> mp;
ll leftPos = 1;
if (mp.count(v) && mp[v] > leftPos) {
  leftPos = mp[v];
}
```

复杂度：不变，依旧是 `O(B * n log(n))`    



```cpp
typedef long long ll;
const int B = 21;  // nums[i] <= 10^6，20 位就够

class Solution {
  int n;
  vector<vector<int>> bits;  // bits[i][b]：前 i 个元素中第 b 位为 1 的个数
  unordered_map<ll, ll> mp;  // 每个值上一次出现位置的下一个位置

  int SearchLeft(int L, int p, int b) {
    int l = L, r = p;  // 找最左的 x，使 [x, p] 这段第 b 位全为 1
    while (l < r) {
      int mid = (l + r) / 2;
      if (bits[p][b] - bits[mid - 1][b] == p - mid + 1) {
        r = mid;
      } else {
        l = mid + 1;
      }
    }
    return l;
  }

  int SearchRight(int p, int R, int b) {
    int l = p, r = R;  // 找最右的 x，使 [p, x] 这段第 b 位全为 1
    while (l < r) {
      int mid = (l + r) / 2;
      if (bits[mid][b] - bits[p - 1][b] == mid - p + 1) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    return l - 1;
  }

  ll Solver(int p, ll v) {
    ll leftPos = 1;
    if (mp.count(v) && mp[v] > leftPos) {
      leftPos = mp[v];  // 去重：左边界不能越过上一个同值位置
    }
    ll rightPos = n;
    for (int i = 0; i < B; i++) {
      if ((v >> i) & 1) {
        leftPos = max(leftPos, (ll)SearchLeft(leftPos, p, i));
        rightPos = min(rightPos, (ll)SearchRight(p, rightPos + 1, i));
      }
    }
    mp[v] = p + 1;
    return (p - leftPos + 1) * (rightPos - p + 1);
  }

 public:
  ll countConsistent(vector<int>& nums) {
    n = nums.size();
    bits.assign(n + 1, vector<int>(B, 0));
    for (int i = 1; i <= n; i++) {
      for (int j = 0; j < B; j++) {
        bits[i][j] = bits[i - 1][j] + ((nums[i - 1] >> j) & 1);
      }
    }
    ll ans = 0;
    for (int i = 1; i <= n; i++) {
      ans += Solver(i, nums[i - 1]);
    }
    return ans;
  }
};
```


## 五、最后  


四道题都不算难，考点集中在三处。  


第一题是纯枚举，关键是注意到按位与和最小值都随区间扩张单调不增，可以增量维护。  
第二题是树形DP，核心是确认父节点依赖儿子的最优答案，节点清零的收益就是 `-val`。  
第三题是博弈DP，典型的枚举各种情况，选择最优值。  
第四题是第一题的加强版，核心是从「枚举子数组」换成「按最小值分桶」，再用「1 位连续段」的前缀和加二分求边界，最后按最左出现位置去重。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
