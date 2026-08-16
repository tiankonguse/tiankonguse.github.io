---
layout: post  
title: leetcode 周赛 515 - 状态压缩  
description: 状态压缩动态规划  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-08-16 12:13:00  
published: true  
---


## 零、背景


这次比赛最后一题比较难，涉及状态压缩，比赛期间想复杂了，没有做出来。  


本场题型概览如下。  


A 题：枚举。  
B 题：贪心枚举。  
C 题：贪心枚举。  
D 题：状态压缩动态规划。  


## 一、最近的可用无人机


题意：给 n 个无人机，每个无人机有一个飞行范围。  
现在给一个坐标，问在无人机飞行范围之内的最近的无人机编号是多少。  
距离计算规则为曼哈顿距离。  


思路：枚举  


枚举每一个无人机，计算曼哈顿距离，如果在飞行范围内，判断是否更近。  


```cpp
int ans = -1;
int minDist = INT_MAX;
for(int i=0;i<n;i++){
  int x = drones[i][0], y = drones[i][1], d = drones[i][2];
  int dist = abs(x - tx) + abs(y - ty);
  if (dist <= d && dist < minDist) {
    ans = i;
    minDist = dist;
  }
}
return ans;
```


## 二、交通灯的最大等待时间

题意：有 n 个红绿灯都在第 0 秒变成绿灯，绿灯分别持续 `lights[i]` 秒，剩余的 `period-lights[i]` 秒为红灯时间。  
现在告诉你 m 个车经过的时间，只要有一个绿灯，车就可以过，问所有车中等红灯的最长时间。  


思路：贪心枚举  


由于只要有一个绿灯，车就可以过，所以只需要保留时间最长的绿灯。  


```cpp
ll maxLight = 0;
for (int i = 0; i < lights.size(); i++) {
  maxLight = max(maxLight, (ll)lights[i]);
}
```

然后计算所有车等红灯的时间，取最大值。  


```cpp
for (ll car : arrivalTime) {
  car %= period;
  if (car >= maxLight) {
    ans = max(ans, period - car);
  }
}
```


## 三、工位的最大间隔


题意：告诉你 n 个工人的技能，以及 m 个带某个技能属性的工位。  
工人按顺序选择技能匹配的工位，至少存在一种匹配方案。  
问怎么进行匹配，才能使得相邻工人的最大间隔值最大。  


思路：贪心枚举  


一开始读错题了，看成求最小间隔值最大。  
写了一个二分，样例没通过。  
再读题，发现是最大值最大。  


最大值最大，直接枚举贪心。  
假设最大的间隔是 工人 `[j,j+1]` 之间。  
则 j 左边的工人，需要尽可能的往左边匹配，`j+1`右边的工人，需要尽可能的往右边匹配。  


```
int ans = 0;
for (int i = 1; i < n; i++) {
  // 枚举 i-1 与 i 的距离
  ans = max(ans, rightPos[i] - leftPos[i - 1]);
}
return ans;
```


所以预处理左边贪心匹配的位置与右边贪心匹配的位置，然后枚举工人位置，计算间隔。  


```cpp
void GreedyLeft() {
  int ni = 0, mi = 0;
  leftPos.resize(n);
  while (ni < n && mi < m) {
    if (skill[ni] == station[mi]) {
      leftPos[ni] = mi;
      ni++;
      mi++;
    } else {
      mi++;
    }
  }
}
```

复杂度：`O(n)`  


## 四、电梯请求 III


题意：电梯在时刻 0 位于 start 楼层，然后告诉你 n 个请求的楼层和请求时间，问如何调度电梯，可以在最短时间内处理完所有请求。  
处理完成的定义：假设楼层 Li 在 t 时刻发出请求，电梯在 t 时刻或之后经过或到达 Li 即可。  
数据范围：楼层 `10^9`，时间 `10^9`，请求个数 16  


思路：状态压缩动态规划  


状态定义：`dp[i][mask]` 表示 mask 中的请求都处理完，且最后一个处理的是第 i 个请求时，所需的最短时间。  


状态转移方程：枚举下一个处理的请求  


```cpp
const auto [cost, ri, mask] = que.top();
que.pop();
if (dp[ri][mask] != cost) continue;  // 更优答案处理过了
auto floorRi = requests[ri].second;
for (int rj = 0; rj < rn; rj++) {
  if (mask & (1 << rj)) continue;
  auto [arrivalTimeRj, floorRj] = requests[rj];
  ll newCost = 0;
  if (arrivalTimeRj >= cost) {
    newCost = cost + max(abs(arrivalTimeRj - cost), abs(floorRj - floorRi));
  } else {
    newCost = cost + abs(floorRj - floorRi);
  }
  Add(rj, mask | (1 << rj), newCost);
}
```

这里我使用的优先队列来处理。  
理论上使用递推或者递归都可以。  


```cpp
vector<vector<ll>> dp(rn + 1, vector<ll>(1 << rn, LLONG_MAX));
min_queue<tuple<ll, int, int>> que;
ll ans = LLONG_MAX;
auto Add = [&](int ri, int mask, ll cost) {
  ll& ret = dp[ri][mask];
  if (cost < ret) {
    ret = cost;
    que.push({cost, ri, mask});
  }
  if (mask == (1 << rn) - 1) {
    ans = min(ans, cost);
  }
};
```


空间复杂度：`O(n * 2^n)`  
时间复杂度：`O(n^2 * 2^n)`  


PS：比赛期间我把最多 16 个请求，看成楼层也最多 16 个了。  
于是定义的状态是 `dp[ri][li][mask]`。  
含义为到达第 ri 个请求的时间，位于 li 层，此时前 ri 个请求还有 mask 个请求待处理的时间。  


可以发现，每个状态对应的时间是确定的，即第 ri 个请求的时间。  
上个请求位于 li，下个请求位于 lj，共经过了 `requests[ri] - requests[rj]` 秒时间。  
这个时间内，从 li 到 lj，还可以对 mask 这些待处理请求顺带处理了。  


这就需要分情况来讨论。  


对于下个请求 rj，如果与目标位置 lj 一致，则可以把这个最新请求一起处理了。  
否则只能等以后处理。  


```cpp
int extMask = (1 << nextFloor);
if (lj == nextFloor) {
  extMask = 0;
}
```


如果时间内可以处理完所有 mask，则只需要关心最新这个请求的 mask 了。  


```cpp
// 时间足够大，可以走遍所有 mask 的楼层
if (disTime >= 2 * (maxOffset - minOffset) - (tmpLj - tmpLi)) {
  Add(ri + 1, lj, extMask, nextArrivalTime);
  continue;
}
```

否则，只能枚举处理了哪些请求。  


```cpp
for (int offsetI = minOffset; offsetI <= tmpLi; offsetI++) {
  for (int offsetJ = tmpLj; offsetJ <= maxOffset; offsetJ++) {
    if (disTime >= 2 * (offsetJ - offsetI) - (tmpLj - tmpLi)) {
      // [offsetI, offsetJ] 中的 mask 都可以消除
      int eliminatedMask = rangeMask[offsetI][offsetJ];
      Add(ri + 1, lj, (mask & ~eliminatedMask) | extMask, nextArrivalTime);
    }
  }
}
```


空间复杂度：`O(n^2 * 2^n)`  
时间复杂度：`O(n^5 * 2^n)`  
虽然时间复杂度很大，但是由于贪心的存在，实际复杂度比较小。  


提交代码后，353 / 999 个通过的测试用例，剩下的触发 MLE 了。  
电梯楼层无限大后，状态中就只能有请求与 mask 了，其他的方法就都不行了。  


## 五、最后


这次比赛第三题和第四题都看错题了。  
第三题看错后，补救回来了。  
第四题看错后，代码量比较大，MLE 时快结束比赛了，所以来不及纠正了。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
