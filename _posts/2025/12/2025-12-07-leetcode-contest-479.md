---
layout: post
title: leetcode 周赛 479 - 换根DP
description: 学习换根DP的经典题目
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-12-07 12:13:00
published: true
---

## 零、背景


这次比赛最后一题是经典的换根 DP，整体难度不算高，本篇主要记录四道题的解题思路。  


A: 排序    
B: 打素数表    
C: 带删除的优先队列    
D: 换根DP     


**最终排名**：79  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、二进制反射排序


题目：给一个数组，按每个数二进制反转后的值升序排序；如果两个数反转后的值相等，则按它们在原数组中的顺序排序。  


思路：排序  


按题意预处理出每个数的二进制反转值，组成二元组，然后排序即可。  


翻转代码如下：  


```cpp
ll v2 = 0;
ll V = v;
while (V) {
  v2 = (v2 << 1) | (V & 1);
  V >>= 1;
}
```

## 二、可表示为连续质数和的最大质数


题意：给一个整数 n，求不大于 n 的最大特殊质数。  
特殊质数定义：可以表示为从 2 开始的连续质数之和。  


思路：打表  


先预处理出数据范围内的素数表。  
然后预处理出所有特殊质数表。  
最后二分查找即可。    


## 三、探索地牢的得分


题意：有一个闯关游戏，初始血量为 Hp，每一关会消耗 d 点血量，消耗后若当前血量大于等于该关的阈值 r，则得一分。  
闯关不会结束，直到最后一关。  
现在问分别从某一关开始闯关，合起来能得多少分。  


思路：  


暴力模拟，复杂度 `O(n^2)`。  
所以需要思考，怎么将这一批分数快速计算出来。  


一种思路是分别计算每个起始位置的分数，然后求和。  
另一种思路是分别求每一关的分数，然后求和。  


算法1：枚举起始位置。  


对于每个起始位置，需要判断每一关的剩余血量是否大于当前关的得分血量。  
不同关的得分血量不同，比较的基线不一样，复杂度 `O(n)`。  


如果对齐基线，剩余血量减去当前关得分血量，然后判断是否大于等于 0，就可以维护一个队列来快速计数了。  


```cpp
vector<ll> leftHp(n + 1); // 第一关剩余的血量
map<ll, ll> mp;
leftHp[0] = hp;
for (int i = 1; i <= n; i++) {
  ll d = damage[i - 1];
  ll r = requirement[i - 1];
  leftHp[i] = leftHp[i - 1] - d;
  mp[leftHp[i] - r]++;
}
```


观察相邻起始位置，发现每一关剩余血量会上升相同的值。  
这个相当于队列中的血量整体向上平移，大于 0 的血量会更多。  
整体平移可以使用延迟标记来降低复杂度。  


另外，起始位置移动后，上一个关卡需要从队列中删除，所以需要支持带删除的优先队列。  
`map` 就是一个标准的带删除的优先队列。  


复杂度分析：每个元素至多从 `map` 中删除 1 次，所以复杂度 `O(n log(n))`。  


```cpp
ll ans = 0;
ll okNum = 0;  // 当前剩余关卡得分的个数
ll add = 0;
for (int i = 1; i <= n; i++) {
  const ll d = damage[i - 1];
  const ll r = requirement[i - 1];
  // 第一步：计算从第 i 关开始的得分
  while (!mp.empty()) {
    auto it = mp.end();
    it--;
    if (it->first + add < 0) {
      break;
    }
    okNum += it->second;  // 大于关卡分数的个数
    mp.erase(it);
  }
  ans += okNum;
  
  // 第二步：删除第 i 关
  if (leftHp[i] - r + add >= 0) {
    okNum--;  // 这个关卡已经得分了，不在队里中
  } else {
    mp[leftHp[i] - r]--;  // 一定在队列中，减少计数，统计得分时再出队
  }
  // 第三步：延迟标记，后续的血量都上升 d
  add += d;
}
```


算法2：枚举每一关  



换一个思路，看每个起始位置在每一关有什么特征。  
例如起始位置从 1 到 n，最后一关的剩余血量是递增的，我们要找大于最后一关得分血量的个数。  
直接二分查找即可。  


```cpp
vector<ll> leftHp(n + 1);
leftHp[n] = hp; // 增加桩，方便计算
for (int i = n - 1; i >= 0; i--) {
  ll d = damage[i];
  leftHp[i] = leftHp[i + 1] - d;
}
leftHp.pop_back(); // 删除桩
```


最后一关转移到倒数第二关，有什么关系呢？  


第一，最后一关起始位置的剩余血量需要从数组中删除，这个恰好是最大值。  
第二，剩余血量都加上最后一关的伤害值。  



对于第一个，直接数组大小减一即可。  
对于第二个，都加上一个值 d，相当于关卡的得分血量降低了 d。  
从而可以`O(1)` 转移，使用二分查找找到答案。  


```cpp
ll ans = 0;
ll sum = 0;
for (int i = n - 1; i >= 0; i--) {
  ll d = damage[i];
  ll v = requirement[i] - sum;
  // 查询大于等于 v 的个数
  ll cnt = leftHp.end() - lower_bound(leftHp.begin(), leftHp.end(), v);
  ans += cnt;
  sum += d;
  leftHp.pop_back();
}
```


复杂度：`O(n log(n))`  
由于这个只有二分查找，所以常数会小很多。  


## 四、子图的最大得分


题意：给一个树，有些节点权值是 1，有些是 -1。  
求每个节点当做根的最大子图权值和。  


思路：换根DP  


先预处理，坏节点权值修改成 -1。  


```cpp
for (auto& v : good) {
  if (v == 0) v = -1;
}
```


有根树天然存在最优子结构。  
即如果一个儿子子树中存在权值和大于 0 的子图，就可以给父节点贡献这部分权值，否则贡献为 0。  
对于一个有根树，父节点的最优解，就是所有儿子的贡献之和加上自身的权值。  


```cpp
vector<int> childsScore;
int Dfs(const int u, const int p) {
  childsScore[u] = good[u];
  for (const auto v : g[u]) {
    if (v == p) continue;
    int ret = Dfs(v, u);
    if (ret > 0) {
      childsScore[u] += ret;
    }
  }
  return childsScore[u];
}
```


如果把某个儿子节点当作新的根，它的子树最优结构不变，只是原来的父节点要作为它的一个儿子重新参与贡献。  
所以换根的时候，需要把父节点给儿子的贡献计算出来。  


怎么计算呢？  
父节点的最优解减去儿子的贡献，就是父节点对儿子的贡献。  


```cpp
void DfsDP(const int u, const int p, const int preScore) {
  ans[u] = preScore + childsScore[u];
  for (const auto v : g[u]) {
    if (v == p) continue;
    if (childsScore[v] > 0) {
      DfsDP(v, u, max(ans[u] - childsScore[v], 0));
    } else {
      DfsDP(v, u, max(ans[u], 0));
    }
  }
}
```


复杂度：`O(n)`  


## 五、最后


这次比赛第四题是标准的换根DP，比较简单。  
第三题则比较有意思，既可以枚举每一个起始位置的得分，也可以枚举每一关本身能带来的得分。  
不管枚举哪一类，都用到了“整个区间同时加上同一个值，相当于都不加”的技巧，用一个标记位来统一记录即可。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
