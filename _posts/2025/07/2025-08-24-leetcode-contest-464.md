---
layout: post
title: leetcode 第 464 场算法比赛
description: 单调栈 VS 线段树  
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-08-24 12:13:00
published: true
---

## 零、背景


这次比赛比较难，第三题一直想用贪心做，花了一个小时，最后一题比较简单但时间不够了。    


A: 计算  
B: 贪心或统计模拟  
C: 单调栈或线段树  
D: 动态规划  


排名：174  
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、奇数和与偶数和的最大公约数  


![](https://res2025.tiankonguse.com/images/2025/08/24/001.png)  



题意：求前n个奇数和与前n个偶数和的最大公约数。  


思路：计算  


前n个奇数和是 `1+(2*n-1)*n/2`。  
前n个偶数和是 `2+(2*n)*n/2`。  
直接求公约数即可。  


贪心：公式化简后，奇数和是`n*n`，偶数和是 `n*(n+1)`。  
相邻的数字互质，故公约数固定为 `n`。  


## 二、数组元素分组  


![](https://res2025.tiankonguse.com/images/2025/08/24/002.png)  


题意：将一些数字拆分为若干组，每个组恰好包含 k 个不同的元素，每个元素必须被分配到恰好一个组中。  
问是否存在这样的拆分。  


思路：贪心或统计模拟    


首先题意需要先明确，每个组恰好包含 k 个不同的元素的意思是数组大小为 K，值互不相同。  



明确了题意，第一种方法就是按题意来模拟，一组一组的进行选数字。  


由于每组内的值互不相同，显然，需要优先选择出现次数最多的数字。  
故统计每个数字的频次，然后再统计频次的频次，从高到底不断的选择k个最高频次的数字，看最后是否能都选完。  


```cpp
unordered_map<int, int> h;
for (auto x : nums) {
  h[x]++;
}
map<int, int> h2;
for (auto [k, v] : h) {
  h2[-v]++;
}
```


我这里使用 map 来统计频次的频次，默认是升序，所以需要使用负数频次。  
map 边遍历边修改会有副作用，所以需要先保存选择的 K 个频次，最后统一减一。  

```cpp
vector<int> buf;
buf.reserve(K);
while (!h2.empty()) {
  for (auto& [freq, count] : h2) {
    while (buf.size() < K && count > 0) {
      buf.push_back(freq);
      count--;
    }
    if (buf.size() == K) {
      break;
    }
  }
  if (buf.size() < K) return false;
  for (auto freq : buf) {
    if (h2.count(freq) != 0 && h2[freq] == 0) {
      h2.erase(freq);
    }
    if (freq + 1 != 0) {
      h2[freq + 1]++;
    }
  }
  buf.clear();
}
```


其实，这里是要选择最大的 K 个频次，直接使用最大堆会更容易实现和理解。  


```cpp
max_queue<int> que;
for (auto [k, v] : h) {
  que.push(v);
}
vector<int> buf;
buf.reserve(K);
while (!que.empty()) {
  while (buf.size() < K && !que.empty()) {
    buf.push_back(que.top());
    que.pop();
  }
  if (buf.size() < K) return false;
  for (auto freq : buf) {
    if (freq > 1) {
      que.push(freq - 1);
    }
  }
  buf.clear();
}
```


再进一步分析频次的划分，由于是恰好完成划分，所以不会有剩余，且分组数是确定的。  
当频次的最大值不大于分组数时，一定存在答案。  


构造方案：优先分配最大频次，然后分配次大频次，S 形式分配。  
对于每个频次，可以选择的位置总是小于最大分组，故永远可以完成划分。  


![](https://res2025.tiankonguse.com/images/2025/08/24/003.png) 



故直接判断是否可以整除与最大值是否大于组数即可。  
求最大频次，可以排序求最多连续重复数字，也可以使用hash表统计。  


```cpp
if (n % K != 0) return false;
const int D = n / K;
sort(nums.begin(), nums.end());
int pre = nums.front();
int num = 0;
for (auto x : nums) {
  if (pre != x) {
    pre = x;
    num = 0;
  }
  num++;
  if (num > D) {
    return false;
  }
}
```


## 三、跳跃游戏 9  

![](https://res2025.tiankonguse.com/images/2025/08/24/004.png) 


题意：给一个数组，每个下标可以跳到左边值更大的位置或右边值更小的位置。问每个下标可以跳到的最大值是多少。  


思路：单调栈线段树  


PS：比赛的时候一直想使用单调栈贪心，但是发现存在反例，浪费了一个小时，最后老老实实写线段树。  


结论1：左边更大，右边更小，意味着跳跃是可以来回的，即需要进行划分连通图，连通图中的所有坐标的答案都是相同的，就是连通图中的最大值。  


结论2：A 点可以向右跳到 B 点，则区间 `[A,B]` 内的所有点都是连通的。  
证明：区间内大于 A 点的值，B 点可以向左跳到，区间内小于 B 点的值，A 点可以向右跳到。  
故区间内的任何点都可以通过 A 或者 B 跳到，即区间内所有点都是连通的。  


基于结论2，我们就可以从第一个点开始，不断的扩大边界，直到不能扩大为止。  


假设当前已确定区间为 `[A,B]`,具体步骤如下：  


1）找到区间 `[A,B]`内的最大值。  
2）找到区间外 `(B,n]`内的最小值。  
3）如果最小值小于最大值，则可以跳跃过去，扩大区间，回到步骤1。  
4）区间内的所有值设置为区间的最大值。  


复杂度：`O(n log(n))`  



```cpp
int ansIndex = 1;
while (ansIndex <= n) {
  int l = ansIndex, r = ansIndex;
  // 不断递归，找到最右的边界
  while (r < n) {  // 可能可以继续向右扩展
    // 第一步，找到区间 [l,r] 内的最大值 maxVal
    auto [maxVal, maxIndex] = segTree.QueryMax(l, r);
    // 第二步：找到 [r+1, n] 区间内小于 maxVal 的最右边界
    int L = r + 1, R = n;  // [L,R)
    auto [minVal, minIndex] = segTree.QueryMin(L, R);
    if (minVal < maxVal) {  // 可以继续向右扩展
      r = minIndex;
    } else {
      break;
    }
  }
  auto [maxVal, maxIndex] = segTree.QueryMax(l, r);
  while (ansIndex <= r) {
    ans[ansIndex - 1] = maxVal;
    ansIndex++;
  }
}
```


其实，在看到这个区间扩展的步骤时，很容易想到单调栈。  


由于是递减可以跳跃，所以需要维护一个单调递增的栈，代表这些元素是分界线。  


```text
sta: p0 < p1 < p2 < p3 < ...
```

含义为：`[pi,pi+1)` 区间内的点可以互相到达。。  


但是这样的单调栈又会存在反例。  
例如如果 `[p1,p2)` 之间存在一个值小于 `p0`，则 `[p0,p2)`区间都是连通的。  


参考线段树的做法，需要维护两个信息，一个是左边界，一个是当前区间的最值。  



```text
sta: {p0, maxVal} < {p1, maxVal} < {p2, maxVal} < {p3, maxVal} < ...
```


当来一个较小的元素时，不仅仅是合并到栈顶，还需要合并到栈顶之前的元素，直到栈顶的元素小于当前元素。  


```cpp
vector<pair<int, int>> sta;  // [maxVal, leftIndex]
for (int i = 0; i < n; i++) {
  int v = nums[i];
  pair<int, int> p = {v, i};
  while (!sta.empty() && sta.back().first > v) {
    p.first = max(p.first, sta.back().first);  // 进行合并
    p.second = sta.back().second;              // 坐标是递减的，所以记录最左边的坐标即可
    sta.pop_back();
  }
  sta.push_back(p);
}
// 全部合并完了，开始计算答案
vector<int> ans(n, 0);
int R = n;  // 右边界
for (int i = sta.size() - 1; i >= 0; i--) {
  auto [maxVal, L] = sta[i];
  for(int j=L; j<R;j++){
    ans[j] = maxVal;
  }
  R = L;
}
```


## 四、可以被机器人摧毁的最大墙壁数目  


![](https://res2025.tiankonguse.com/images/2025/08/24/005.png) 


题意：一个坐标轴上有若干机器人和墙，机器人可以朝左或者朝右发射一个子弹，子弹行驶距离有限，可以穿过墙，但不能穿过机器人。问最多可以穿过多少墙。  


思路：动态规划。  


由于子弹无法穿过机器人，所以需要预处理计算出机器人的左右边界最大子弹距离。  


```cpp
vector<tuple<int, int, int>> robots(rn);  // [pos, leftDis, rightDis]
for (int i = 0; i < rn; i++) {
  robots[i] = {robots_[i], distance[i], distance[i]};
}
sort(robots.begin(), robots.end());
sort(walls.begin(), walls.end());
// 第一步：修复机器人的射程
for (int i = 0; i < rn; i++) {  // 射程不能打到下一个机器人
  auto& [pos, leftDis, rightDis] = robots[i];
  if (i > 0) {
    leftDis = min(leftDis, pos - get<0>(robots[i - 1]) - 1);
  }
  if (i + 1 < rn) {
    rightDis = min(rightDis, get<0>(robots[i + 1]) - pos - 1);
  }
}
```


由于下一个机器人朝左时，会影响前一个机器人朝右，故计算当前机器人的答案时需要考虑下一个机器人的方向。  


![](https://res2025.tiankonguse.com/images/2025/08/24/006.png) 


策略制定：如果两个机器人可以穿过同一面墙，则算作右边的机器人穿过的。  
状态定义：`dp(i,d)` 下个机器人方向是 d 时，前 i 个机器人的最大答案。  



如果当前机器人朝左发射子弹，则不关心 d 的值。  
如果当前机器人朝右发射子弹，则需要判断 d 的方向，如果方向相反，则部分墙可能已经被下个机器人消灭，需要减去相应的答案。  


```cpp
vector<vector<int>> dp(rn + 1, vector<int>(2, 0));  // dp[i][j] 下个机器人向 j 方向射击时，前 i 个机器人的最优解
// 第 0 个机器人射程设置为0
for (int i = 1; i <= rn; i++) {
  auto& [pos, leftDis, rightDis] = robots[i - 1];
  int nowRightAns = dp[i - 1][DIR_RIGHT] + ShotRange(pos, pos + rightDis);
  int nowLeftAns = dp[i - 1][DIR_LEFT] + ShotRange(pos - leftDis, pos);
  dp[i][DIR_RIGHT] = max(nowRightAns, nowLeftAns);

  int nowRightAns2 = dp[i - 1][DIR_RIGHT] + ShotRange(pos, pos + rightDis);  // 有交叉情况
  if (i < rn) {
    auto& [pos2, leftDis2, rightDis2] = robots[i];
    nowRightAns2 -= ShotRange(pos2 - leftDis2, pos + rightDis);
  }
  dp[i][DIR_LEFT] = max(nowRightAns2, nowLeftAns);
}
return max(dp[rn][DIR_LEFT], dp[rn][DIR_RIGHT]);
```


`ShotRange`封装的时一个函数，代表子弹穿过区间的墙的数量，直接二分相减即可。  


```cpp
auto ShotRange = [&walls](int l, int r) -> int {  // 区间内墙的数量
  if (l > r) return 0;
  return upper_bound(walls.begin(), walls.end(), r) - lower_bound(walls.begin(), walls.end(), l);
};
```


## 五、最后  


这次比赛第三题比较难，因为贪心会有反例，一开始我又不想用线段树暴力扩展区间，结果浪费了一个小时。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
