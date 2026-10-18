---
layout: post  
title: leetcode 周赛 524  
description: 分情况讨论与区间贪心  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-10-18 12:13:00  
published: true  
---


## 零、背景


这次比赛第三题是一个分情况讨论题，代码量比较大，在比赛前做出来了。  
另外三题分别是贪心、模拟和区间贪心，都比较简单。  


本场题型概览如下。  


A 题：贪心  
B 题：模拟  
C 题：分情况讨论  
D 题：区间贪心  


## 一、使相邻元素按位异或非零的最少删除次数


题意：给你一个整数数组 `nums`。  
可以删除任意数量的元素，剩余元素保持原有的相对顺序。  
如果结果数组 `a` 中每一对相邻元素的按位异或结果都不为 0（即 `a[i] XOR a[i+1] != 0`），则称数组 `a` 是相邻异或非零数组。  
长度不超过 1 的数组也被视为相邻异或非零数组。  
返回使 `nums` 变为相邻异或非零数组所需的最少删除次数。  


数据范围：  
`2 <= nums.length <= 100`  
`1 <= nums[i] <= 100`  


思路：贪心  


两个数异或为 0 当且仅当两个数相等，所以「相邻元素异或非零」等价于「相邻元素不同」。  
要使删除次数最少，即保留的元素尽量多：每个连续相同段只保留一个元素，其余全部删除。  
扫描数组，若当前元素等于上一个保留的元素，则删除（计数加一）；否则保留并更新。  


复杂度：`O(n)`  


```cpp
class Solution {
 public:
  int minDeletions(vector<int>& nums) {
    int pre = nums.front() - 1;
    int ans = 0;
    for (auto v : nums) {
      if (v == pre) {
        ans++;
      }
      pre = v;
    }
    return ans;
  }
};
```


## 二、有向网格中的最后访问单元格


题意：给你一个 `m x n` 的矩阵 `grid`，每个单元格包含 `'L'`、`'R'`、`'U'`、`'D'` 之一，分别表示向左、向右、向上、向下移动一格。  
从单元格 `(0, 0)` 出发，将其视为已访问。  
每一步按照当前单元格中的字符指示移动；  
如果下一步移动会离开网格，或者进入一个已经访问过的单元格，则移动过程结束（该次移动不会执行）。  
返回一个整数数组 `[r, c]`，表示最后一个访问的单元格的行下标和列下标。  


数据范围：  
`1 <= m == grid.length <= 10^5`  
`1 <= n == grid[i].length <= 10^5`  
`m * n <= 10^5`  


思路：模拟  


直接从起点按方向字符一步步走，用哈希表记录已经访问过的位置。  
每次先尝试移动到下一个位置，若出界或已访问则结束循环，返回上一个访问的位置。  


复杂度：`O(m*n)`   


```cpp
class Solution {
  const ll MN = 1e5;
  ll Hash(ll x, ll y) {
    return x * MN + y;  //
  }

 public:
  vector<int> lastVisitedCell(vector<vector<char>>& grid) {
    int n = grid.size();
    int m = grid[0].size();
    unordered_map<ll, int> H;
    int x = 0, y = 0;
    int X = x, Y = y;
    H[0] = 1;
    auto HasNext = [&]() -> bool {
      char c = grid[x][y];
      switch (c) {
        case 'L':
          y--;
          break;
        case 'R':
          y++;
          break;
        case 'U':
          x--;
          break;
        case 'D':
          x++;
          break;
      }
      if (x < 0 || x >= n || y < 0 || y >= m) {
        return false;
      }
      ll h = Hash(x, y);
      if (H.count(h)) {
        return false;
      }
      H[h] = 1;
      return true;
    };
    while (HasNext()) {
      X = x;
      Y = y;
    }
    return {X, Y};
  }
};
```


## 三、找到颜色树的根


题意：给你一棵含有 `n` 个节点的无向树，节点编号从 `0` 到 `n - 1`，用一个长度为 `n - 1` 的二维整数数组 `edges` 表示。  
同时给你一个长度为 `n` 的字符串 `colors`，其中 `colors[i]` 是 `'R'`、`'B'` 或 `'W'` 之一，表示节点 `i` 的颜色。  


选一个节点作为根，从根向外将树定向后，必须同时满足两个条件：  
1. 二叉树性质：每个节点最多有两个子节点。  
2. 分层颜色模式：相同深度的所有节点颜色相同，且深度从 0 开始的颜色遵循 `R → B → W` 的三色循环序列之一（起点可以是三种颜色中的任意一种）。  


返回任意一个满足条件的根节点下标；不存在则返回 -1。  
提示：每个节点的度最多为三。  


数据范围：  
`2 <= n <= 10^5`  
`edges.length == n - 1`  
每个节点的度最多为三  


思路：分情况讨论  


先推导三个核心性质。  
性质一：任意一条边的两个端点颜色必须不同，否则相邻两层颜色相同，必然违反三色循环。  
性质二：三色循环中，相邻层颜色不同、隔一层（深度差 2）的颜色也必然不同；反过来，颜色只有三种，只要「相邻不同且隔层不同」，颜色序列就唯一确定是三色循环。  
性质三：度为 3 的节点不可能是根，否则它会有 3 个子节点，违反二叉树性质。  


然后按节点的最大度数分三类讨论。  
最大度为 1：树只有两个节点，颜色不同时，任意一个节点都可以作为根。  
最大度为 2：树是一条链。链中间的节点如果左右两个邻居颜色相同，则该节点必须是根；否则根只能是链的某个叶子节点。  
最大度为 3：度为 3 的节点有三个邻居，其中两个儿子位于同一层、颜色相同，父亲在不同层、颜色不同，由此可以唯一确定该节点三条边的方向；再从该节点沿着父亲方向不断向上推导，直到遇到度为 1 的节点或左右两个邻居颜色相同的度为 2 的节点，即得到根。  


根确定后，用 DFS 按性质一、性质二验证整棵树即可。  
复杂度：`O(n)`  


```cpp

class Solution {
  vector<vector<int>> g;
  int n;
  vector<int> degree;
  string colors;

  bool DfsCheck(int u, int pre) {
    char preColor = ' ';
    if (pre == -1) {
      if (degree[u] == 3) return false;  // 度为 3 的节点不可能是根
      if (degree[u] == 2 && colors[g[u][0]] != colors[g[u][1]]) {
        return false;  // 两个儿子节点颜色不同，不可能是根
      }
      if (colors[u] == 'R') {
        preColor = 'W';
      } else if (colors[u] == 'W') {
        preColor = 'B';
      } else {
        preColor = 'R';
      }
    } else {
      preColor = colors[pre];
    }
    for (auto v : g[u]) {
      if (v == pre) continue;
      if (colors[v] == preColor) return false;
      if (!DfsCheck(v, u)) return false;
    }
    return true;
  }

 public:
  int findColoredRoot(vector<vector<int>>& edges, string colors_) {
    colors.swap(colors_);
    n = colors.size();
    g.assign(n, vector<int>()); 
    degree.assign(n, 0);
    for (auto& e : edges) {
      int u = e[0], v = e[1];
      g[u].push_back(v);
      g[v].push_back(u);
      degree[u]++;
      degree[v]++;
      if (colors[v] == colors[u]) {
        return -1;  // 相邻节点颜色必须不同
      }
    }
    int maxDeg = 0, degIndex3 = -1;
    for (int i = 0; i < n; i++) {
      maxDeg = max(maxDeg, degree[i]);
      if (degree[i] == 3) {
        degIndex3 = i;
      }
    }

    if (maxDeg == 1) {
      // n = 2，颜色不同时任意节点都可以是根
      if (colors[0] != colors[1]) {
        for (int i = 0; i < 2; i++) {
          if (DfsCheck(i, -1)) {
            return i;
          }
        }
      }
    } else if (maxDeg == 2) {
      // 是一个链
      int cnt = 0, root = -1;
      vector<int> leafs;
      for (int i = 0; i < n; i++) {
        if (g[i].size() == 2) {
          if (colors[g[i][0]] == colors[g[i][1]]) {
            cnt++;  // 左右同色，i 必须是根
            root = i;
          }
        } else {
          leafs.push_back(i);
        }
      }
      if (cnt == 0) {
        for (auto root : leafs) {
          if (DfsCheck(root, -1)) {
            return root;
          }
        }
      } else if (cnt == 1) {
        if (DfsCheck(root, -1)) {
          return root;
        }
      }
    } else {
      // 度为 3 的树
      int faIndex = -1;
      for (int i = 0; i < 3; i++) {
        if (colors[g[degIndex3][(i + 1) % 3]] == colors[g[degIndex3][(i + 2) % 3]]) {
          faIndex = i;  // 颜色相同的两个节点是儿子，剩余的是父亲
        }
      }
      if (faIndex == -1) return -1;
      int fa = g[degIndex3][faIndex];
      int child = degIndex3;
      int root = -1;
      while (1) {
        if (degree[fa] == 3) {
          int fafa = -1, otherChild = -1;
          for (int i = 0; i < 3; i++) {
            if (g[fa][i] != child) {
              if (colors[g[fa][i]] != colors[child]) {
                fafa = g[fa][i];
              } else {
                otherChild = g[fa][i];
              }
            }
          }
          if (fafa == -1 || otherChild == -1) {
            return -1;
          }
          child = fa;
          fa = fafa;
        } else if (degree[fa] == 2) {
          if (colors[g[fa][0]] == colors[g[fa][1]]) {
            root = fa;  // 左右同色，只能作为根
            break;
          } else {
            // 不能作为根
            int fafa = -1;
            for (int i = 0; i < 2; i++) {
              if (g[fa][i] != child) {
                fafa = g[fa][i];
              }
            }
            child = fa;
            fa = fafa;
          }
        } else {
          root = fa;  // 度为 1，只能作为根
          break;
        }
      }
      if (DfsCheck(root, -1)) {
        return root;
      }
    }
    return -1;
  }
};
```


## 四、覆盖目标区间的最少区间


题意：给你两个二维整数数组 `availableIntervals` 和 `targetIntervals`，每个数组都表示一系列闭区间。  
从 `availableIntervals` 中选择一个子集，使得 `targetIntervals` 中任何区间包含的每一个实数点都属于至少一个被选中的区间。  


目标区间之外的点不需要被覆盖；选中的区间可以相互重叠，也可以延伸到目标区间之外。  
返回需要选择的最小区间数量；如果无法覆盖所有的目标区间，返回 -1。  


数据范围：  
`1 <= availableIntervals.length <= 5 * 10^4`  
`1 <= targetIntervals.length <= 5 * 10^4`  
`1 <= l <= r <= 10^5`  


思路：区间贪心  


这是经典的最少区间覆盖问题，先处理两个细节。  
其一，目标区间可能有重叠，先排序并合并，得到若干互不相交的目标区间。  
其二，覆盖的是实数点，区间端点是连续的：选中区间 `[L, R]` 后，下一个待覆盖的左端点是 `R`， 不能加一。  


贪心过程：维护当前需要覆盖的起点 `p0`。  


每次在所有「左端点不超过 `p0`」的可用区间中，选择右端点最大的区间，答案加一，并把 `p1` 更新为该右端点，代表选择一个区间，可以覆盖到 `[p0,p1]`。  
然后跳过所有右端点不超过 `p1` 的目标区间；  


如果下一个目标区间的左端点大于 `p0`（目标区间之间存在空隙），把 `p0` 更新为它的左端点。  
若某一步找不到左端点不超过 `p0` 的可用区间，说明中间有空隙无法覆盖，返回 -1。  


复杂度：  
排序 `O(N log (N) + M log (M))`  
贪心扫描 `O(N+M)`  


```cpp
class Solution {
 public:
  int minSelection(vector<vector<int>>& availableIntervals,
                   vector<vector<int>>& targetIntervals) {
    // 第一步：合并目标区间
    sort(targetIntervals.begin(), targetIntervals.end(),
         [](vector<int>& a, vector<int>& b) { return a[0] < b[0]; });
    vector<pair<int, int>> targets;
    targets.push_back({targetIntervals[0][0], targetIntervals[0][1]});
    for (auto& target : targetIntervals) {
      int l = target[0], r = target[1];
      if (targets.back().second < l) {
        targets.push_back({l, r});
      } else {
        targets.back().second = max(targets.back().second, r);
      }
    }

    // 第二步：贪心求答案
    sort(availableIntervals.begin(), availableIntervals.end(),
         [](vector<int>& a, vector<int>& b) { return a[0] < b[0]; });
    int p = targets.front().first;
    int ai = 0;
    int ti = 0;
    int an = availableIntervals.size();
    int tn = targets.size();
    int ans = 0;
    while (ti < tn) {
      // 选择 L <= p 且右端点最大的区间
      int maxR = -1;
      while (ai < an && availableIntervals[ai][0] <= p) {
        maxR = max(maxR, availableIntervals[ai][1]);
        ai++;
      }
      if (maxR == -1) {
        return -1;  // 没有答案
      }
      ans++;
      p = maxR;
      while (ti < tn && targets[ti].second <= p) {
        ti++;  // 这些目标区间都已被覆盖
      }
      if (ti < tn && p < targets[ti].first) {
        p = targets[ti].first;  // 目标区间之间存在空隙，跳到下一个起点
      }
    }
    return ans;
  }
};
```


## 五、最后


这周赛整体比较简单，前两题是送分题，第四题是经典区间贪心。  
A 题把异或非零转化为相邻元素不同，贪心保留每个连续相同段的第一个元素。  
B 题直接模拟移动，用哈希表判断是否访问过。  
C 题是分情况讨论题，核心是三个性质（相邻颜色不同、隔层颜色不同、度为 3 的节点不能是根），再按最大度分类定向推导根。  
D 题先合并目标区间，再贪心选择右端点最大的区间，注意覆盖的是实数点、区间端点连续衔接。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
