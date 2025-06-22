---
layout: post
title: leetcode 第 455 场算法比赛-bfs翻车了
description: 犯了最低级的错误
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-06-22 12:13:00
published: true
---

## 零、背景


![](https://res2025.tiankonguse.com/images/2025/06/22/000.png)


周六晚上还在做 CSP-S 2022,做到了半夜三点。  
睡觉时不知怎么，这晚空调也不给力，睡眠质量也不好。  
所以这次打比赛状态不是很好。  


优先队列题，我不知怎么地用了 DFS 来做，手动推导认为 DFS 可以代替 BFS，不会有反例，结果却被反例卡住了。  
赛后清醒过来，改成 bfs，一下就过了。  


A: 筛素数  
B: 完全背包  
C: 贪心    
D: 状压+bfs  


排名：100+  
代码地址： https://github.com/tiankonguse/leetcode-solutions  

## 一、检查元素频次是否为质数

![](https://res2025.tiankonguse.com/images/2025/06/22/001.png)


题意：给一个数组，问元素的频次是否存在素数，存在返回 true，否则返回 false。  


思路：筛素数  


分析题目，至少需要一个频次是素数，所以先筛素数，然后依次判断频次是不是素数即可。  


```cpp
getprm();
unordered_map<int, int> h;
for (auto v : nums) {
  h[v]++;
}
for (auto [k, v] : h) {
  if (is[v]) return true;
}
return false;
```

## 二、硬币面值还原

![](https://res2025.tiankonguse.com/images/2025/06/22/002.png)


题意：有一些固定面值的硬币，给一个数组，`nums[i]`代表不同面值硬币可以组成价格 i 的不同组成方案数。  
问有哪些固定面值的集合，如果无法构造出这样的集合，返回空数组。  


思路：完全背包  


对于每个价格 i，需要判断前面已经得到的面值硬币组成价格 i 的方案数，然后判断方案是否合法，以及是否应该加入新的面值 i。  


共分四种情况：  


1）`nums[i]`小于前面得到的方案数，非法。  
2）`nums[i]`等于前面得到的方案数，当前不是新的面值，继续下一个。  
3）`nums[i]`等于前面的方案数加一，当前是新的面值，加入固定面值集合，继续下一个。  
4）`nums[i]`大于前面的方案数加一，非法。  


```cpp
vector<int> ans;
for (int i = 1; i <= n; i++) {
  int v = numWays[i - 1];
  if (v < dp[i] || v > dp[i] + 1) {
    return {};
  }
  if (v == dp[i]) {
    continue;
  }
  Update(i); // 计算完全背包
  ans.push_back(i);
}
return ans;
```

怎么得到前面的方案数呢？  
这个其实就是完全背包的方案数。  
完全背包复杂度：`O(n^2)`。  


综合复杂度：`O(n^3)`。  


观察完全背包双层的循环形式,每个物体是互相独立的。  
故有新的面值时，不需要全部重新计算，只需要计算新增的面值即可。  
综合复杂度：`O(n^2)`。  


```cpp
const int W = 101;
vector<int> dp(101, 0);  // dp[i] i 之前的有效硬币可以组成价值为 i 的方案数
dp[0] = 1;
auto Update = [&dp, &W](const int v) {
  for (int l = v; l < W; l++) {
    dp[l] = dp[l] + dp[l - v]; // 每次只需要计算新的物品
  }
};
```


## 三、使叶子路径成本相等的最小增量  


![](https://res2025.tiankonguse.com/images/2025/06/22/003.png)


题意：给一个有根无向树，现在可以修改若干节点的权值，问至少修改多少个节点，才能是所有叶子节点到根节点的路径权值相等。  


思路：贪心  


显然，最终的路径和是叶子节点到根节点路径和里面的最大值。  
能想到的最简单方法是，最大值路径的那个叶子不动，其他叶子全部修改，即可满足路径和相等。  


但是这个可能不是最优答案。  
例如根节点到左儿子只有一个路径，且是最大路径和，右儿子下有很多路径，路径和都相等。  
此时只需要修改根的右儿子，即可使所有路径和都等于最大路径和。  


总结一下，就是每个节点只需要分析两个叶子与父节点的关系 `(pre, left, right)` 。  
如果两个儿子不相等，则需要修改小儿子，大儿子不需要修改。  


```cpp
ll Dfs(int u, int pre) {
  ll ans = 0;
  ll maxVal = 0;
  for (auto v : g[u]) {
    if (v == pre) continue;
    ans += Dfs(v, u); // 子树修改的节点个数
    maxVal = max(maxVal, maxChildPath[v]); // 所有儿子中的最大路径和
  }
  for (auto v : g[u]) {
    if (v == pre) continue;
    if (maxVal != maxChildPath[v]) {
      ans++; // 不是最大路径和的儿子都需要修改
    }
  }
  maxChildPath[u] = maxVal + cost[u];
  return ans;
}
```



## 四、所有人渡河所需的最短时间


![](https://res2025.tiankonguse.com/images/2025/06/22/004.png)  


题意：一群人要过河，只有一条船，每次船最多坐 k 个人。  
过河的时间为船上所有人中最慢的速度乘以水流影响因子。  
水流影响因子每过一次河，就会随时间变化一次`k=(k+costTime)%m`。  
由于所有人要过河，每次过河后，还需要一个人返回。  
问最终所有人过河最短需要多长时间。  



思路：最短时间，经典的 优先队列 搜索。  


```cpp
dp1.resize(MASK, vector<double>(m, 1e18));
dp2.resize(MASK, vector<double>(m, 1e18));

min_queue<tuple<double, int, int, int>> que;
que.push({0, 1, MASK - 1, 0});
dp1[MASK - 1][0] = 0;
double ans = 1e18;

while (!que.empty()) {
  const auto [t, type, mask, mi] = que.top();
  que.pop();
  if (type == 1) {
    // 尝试过河
  } else {
    // 尝试返回
  }
}
```


状态1：`left(mask,mi)` 船在左边尝试过河，有 mask 个人待过河，水流因子是 mi 时，首次遇到这个状态的时间。  
此时，需要枚举选择一个不超过k的子集，尝试过河。  


```cpp
if (t > dp1[mask][mi]) continue;
for (int sub = mask; sub; sub = (sub - 1) & mask) {
  auto [maxTime, subK] = maskVal[sub];
  if (subK > k) continue;  // 只要能过河，就都可以过河
  const double useTime = maxTime * mul[mi];
  const double T = t + useTime;
  const int goMi = nextLoop(mi, useTime);
  if (sub == mask) {  // 全过去了，得到一个答案
    ans = min(ans, T);
  } else {
    // 需要选择一个人回来
    const int maskBack = mask ^ sub;
    if (T < dp2[maskBack][goMi]) {
      dp2[maskBack][goMi] = T;
      que.push({T, 2, maskBack, goMi});
    }
  }
}
```


状态2: `right(mask,k)` 船在右边待返回，有 mask 个人待过河，水流因子是 k 时，首次遇到这个状态的时间。  
此时，需要枚举一个人带着船返回。  


```cpp
if (t > dp2[mask][mi]) continue;
for (int i = 0; i < n; i++) {
  // 挑一个不在 maskBack 中的人回去
  if ((mask & (1 << i)) == 0) {
    double returnTime = time[i] * mul[mi];
    const double returnT = t + returnTime;
    const int returnMi = nextLoop(mi, returnTime);
    const int maskReturn = mask | (1 << i);
    if (returnT < dp1[maskReturn][returnMi]) {
      dp1[maskReturn][returnMi] = returnT;
      que.push({returnT, 1, maskReturn, returnMi});
    }
  }
}
```


其实只有一种情况没有答案，就是船只能坐一个人，但待过河的人有多个。  
其他情况肯定可以得到答案。  


## 五、最后  


这次比赛没想到在 bfs 上翻车了，最基本的最优值问题，我竟然突发奇想使用 dfs 去做，实在是不应该。  


第一题筛素数加数值统计，签到题。  
第二题完全背包，没想到背包问题在 leetcode 已经是简单题了。  
第三题贪心不好想，很容易想会不会有反例。  
第四题就是基础的bfs搜索问题。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
