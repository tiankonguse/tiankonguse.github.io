---
layout: post
title: leetcode 第 452 场算法比赛-翻车了
description: 初始化被坑了  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateData: 2025-06-01 12:13:00
published: true
---



## 零、背景


这次比赛第三题状态定义的全局变量，初始化导致超时了，改成临时变量就火了。  
而对于最后一题，我想了好久，确实不会做，最后看了榜单的答案。  


![](https://res2025.tiankonguse.com/images/2025/06/01/001.png) 



A: 暴力枚举      
B: 暴力枚举    
C: bfs  
D: 线段树    


排名：200+    
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  



PS: 新的一月到了，参加的比赛记录已更新。  


![](https://res2025.tiankonguse.com/images/2025/06/01/002.png) 


## 一、等积子集的划分方案  


题意：给 n 个数组，问是否可以恰好分成两个组，使得两个组各自的乘积都等于 target。  


思路：n 不大，暴力枚举所有排列组合即可。  


复杂度：`O(2^n)`  


```cpp
bool dfs(ll A, ll B, int p) {
  if (A > target || B > target) {
    return false;
  }
  if (p == n) {
    return A == B && A == target;
  }
  ll v = nums[p];
  return dfs(A * v, B, p + 1) || dfs(A, B * v, p + 1);
}
```


## 二、子矩阵的最小绝对差  


题意：给一个大矩阵，问所有 `k*k`的小矩阵里面任意两个不相同的元素的最小差值是多少？  


思路：数据量不大，暴力枚举小矩阵，元素排序，求相邻差值即可。  


```cpp
for (int i = 0; i < n - k + 1; i++) {
  for (int j = 0; j < m - k + 1; j++) {
    vals.clear();
    for (int x = i; x < i + k; x++) {
      for (int y = j; y < j + k; y++) {
        vals.push_back(grid[x][y]);
      }
    }
    sort(vals.begin(), vals.end());
    int dis = INT_MAX;
    int pre = vals.front();
    for (auto v : vals) {
      if (v != pre) {
        dis = min(dis, v - pre);
      }
      pre = v;
    }
    if (dis != INT_MAX) {
      ans[i][j] = dis;
    }
  }
}
```

## 三、清理教室的最少移动  


题意：给一个矩阵，告诉你起点，上下左右移动一次算一步，要求经过所有目标点，问最小步数。  
条件：初始有 E 能量，走一步消耗1点能量，有若干位置可以把能量补充满。  


思路：bfs  


状态定义：`f(x,y,e,mask)` 到达`(x,y)`时能量为 e，经过 mask 目标点时的最小步数。  


搜索：上下左右搜索即可，每个状态只能到达一次。  


```cpp
vector dp(n, vector(m, vector(E + 1, vector(1 << maskNum, -1))));
queue<tuple<int, int, int, int>> que;

auto Add = [&](int x, int y, int energy, const int mask, int step) {
  if (dp[x][y][energy][mask] != -1) return;
  dp[x][y][energy][mask] = step;
  que.push({x, y, energy, mask});
};
Add(sx, sy, energy, (1 << maskNum) - 1, 0);

while (!que.empty()) {
  const auto [x, y, energy, mask] = que.front();
  que.pop();
  const int step = dp[x][y][energy][mask];
  for (auto [dx, dy] : dir4) {
    int nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
    if (classroom[nx][ny] == 'X') continue;
    int newEnergy = energy - 1;
    int newStep = step + 1;
    int newMask = mask;
    if (classroom[nx][ny] == 'R') {
      newEnergy = E;  // 能量重置
    } else if (classroom[nx][ny] == 'L') {
      int index = xyIndex[{nx, ny}];  // 目标点在 mask 中的位置
      if (newMask & (1 << index)) {
        newMask ^= (1 << index);
      }
      if (newMask == 0) {
        return newStep;
      }
    }
    if (newEnergy > 0) {
      Add(nx, ny, newEnergy, newMask, newStep);
    }
  }
}
return -1;
```


## 四、分割数组后不同质数的最大数目  


题意：给一个数组，现在可以任意修改某个位置的值，问修改后，如果将数组分割为左右两个子数组，两个数组可以各自计算自身不同质数的个数，然后两个个数求和，求最大和。  


思路：线段树  


修改后，可以对每个数字进行分析贡献度，分三种情况：  


情况1：不是质数，对答案贡献度为0，此时不影响答案。  
情况2：是质数，整个数组中只出现一次，不管怎么分割，对答案贡献度都是 1。  
情况3：是质数，整个数组中出现多次，如何分割线在中间，贡献度为2，否则为1。  


通过上面的分析，可以发现，情况1和情况2的答案是确定的，只有情况3与分割线的位置有关系。  


对于情况3，假设出现的最小位置是 `L`，最大位置是`R`，则分割线是 `[L,R)`时，贡献度为2，否则为1。  


回到这道题，情况1和情况2可以特殊统计，情况3至少加1，剩余的哪个1需要看分割线是否在区间内。  
即问题转化为了，有若干区间，求一个分割线，使得这个线经过的区间最可能的多。  


分析到这里，可以发现，这个是经典的区间最大值问题，使用裸的线段树最大值即可。  


首先，预处理出所有质数，以及质数的位置即可。  


```cpp
getprm();

int n = nums.size();
segTree.Init(n);
segTree.Build();
unordered_map<ll, set<int>> pos;
for (int i = 1; i <= n; i++) {
  int v = nums[i - 1];
  if (is[v]) {
    pos[v].insert(i);
  }
}
```


然后初始化线段树，由于分割后右边至少一个，所以是左闭右开，最大值需要减一。    


```cpp
for (auto& [v, ps] : pos) {
  if (ps.size() == 1) continue;
  int l = *ps.begin();
  int r = *ps.rbegin();
  segTree.Update(l, r - 1, 1);
}
```

接着就是按题意修改与查询答案。  


修改值可能从一个质数修改为另外一个质数。  
所以这里需要拆分为两个操作：删除质数操作与加入质数操作。  


```cpp
vector<int> ans;
ans.reserve(queries.size());
for (auto& q : queries) {
  int i = q[0] + 1;
  int oldVal = nums[i - 1];
  int newVal = q[1];
  if (is[oldVal]) {
    Update(i, oldVal, -1);  // 删除位置为 i 的质数
  }
  nums[i - 1] = newVal;
  if (is[newVal]) {
    Update(i, newVal, 1); // 位置 i 添加质数
  }
  ans.push_back(ansNum + segTree.QueryMax(1, n));
}
return ans;
```


更新一个区间时，一般是先删除，再添加。  


 
这里有一个注意事项：  
正常情况下，`pos.size()` 就是互不相同的质数个数。  
但是为了方面获取 pos 的位置列表，质数个数为0时，没有从 pos 中删除 map 的 key 值。  
故需要单独使用一个变量来记录互不相同的质数个数，并根据质数的位置列表是否为空，来更新这个计数器。  



```cpp
int ansNum = pos.size();
auto Update = [&](int p, int v, int flag) {
  auto& ps = pos[v];
  if (ps.size() > 1) { // 删除旧区间
    int l = *ps.begin();
    int r = *ps.rbegin();
    segTree.Update(l, r - 1, -1);
  }
  if (flag == 1) {
    if (ps.empty()) ansNum++;
    ps.insert(p);
  } else {
    ps.erase(p);  // 个数为0时不真实删除，故需要特殊判断
    if (ps.empty()) ansNum--;
  }
  if (ps.size() > 1) { // 加入新区间
    int l = *ps.begin();
    int r = *ps.rbegin();
    segTree.Update(l, r - 1, 1);
  }
};
```


## 五、最后  


这次比赛前三题都比较暴力，第三题由于初始化的原因，我被卡超时了。  
第四题我方向想歪了，没有想到线段树。  
赛后看了榜单才发现线段树的做法。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
