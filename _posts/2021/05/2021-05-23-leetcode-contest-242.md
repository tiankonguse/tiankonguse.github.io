---   
layout:     post  
title: leetcode 第 242 场算法比赛  
description: 被第二题浮点数坑了。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-05-23 21:30:00  
published: true  
---  


## 零、背景  


这次比赛最难的是第二题吧，被浮点数坑了。  


第二题做了一个小时，还好其他题都是很快过的，最终所有题都在比赛结束前过了。  



## 一、哪种连续子字符串更长  


题意：给一个 `01` 字符串，问最长的连续 1 和最长的连续 0 谁更长。  


思路：基础的动态规划题。  


分别求最长的连续 1 和最长的连续 0 ，比较即可。  


```
class Solution {
  int Get(const string& s, char c) {
    int ans = 0;
    int num = 0;
    for (auto v : s) {
      if (v == c) {
        num++;
        ans = max(ans, num);
      } else {
        num = 0;
      }
    }

    return ans;
  }

 public:
  bool checkZeroOnes(const string& s) {  //
    return Get(s, '1') > Get(s, '0');
  }
};
```

## 二、准时到达的列车最小时速  


题意：给 n 趟整点出发的客车的路程距离，以及最大时间限制。  
问能否可以选择一个速度，使得在限制时间内完成路程。  
如果可以，输出满足要求的最小速度。  


思路：  


首先原题的题意就很难理解，我读了好久，甚至怀疑翻译问题去读了英文的题目。  
结果发现题目没问题，就是这么的。  


确定题意后，发现是找一个速度，来判断是否可以完成车程。  
由于涉及的浮点数与整除问题，没法直接求出答案，只能二分速度来做这道题。  


由于涉及到时间精度问题，我写了两个浮点数判断大小的函数，然后就是直接在浮点数上二分。  
十几分钟敲完代码后，样例通过后，提交奖励了一个`Wrong Answer`，还给出了具体的样例。  


打印下二分过程，发现被`eps = 1e-7`卡精度了。  


再次阅读题意，发现虽然是浮点数，但是输入的浮点数最多只有两位。  
那一种方法显然是浮点数扩大一百倍，除法转乘法，使用整数来比大小。  


一顿修改后，发现不行，打印日志发现`2.01 * 100` 转整数后得到的是`200`。  


看到这个后，马上意识到是浮点数储存的问题，便修改为 `(2.01 + exp) * 100`。  
之后便通过这道题。  


```
class Solution {
  double CheckSpeed(vector<int>& dist, ll maxSpeed, double hour) {
    ll hourEx = (hour + eps) * 100;
    ll preTime = 0;

    for (int i = 0; i + 1 < dist.size(); i++) {
      auto v = dist[i];
      if (v % maxSpeed == 0) {
        preTime += v / maxSpeed;
      } else {
        preTime += v / maxSpeed + 1;
      }
    }

    if (preTime * 100 > hourEx) {
      return true;
    }

    ll leftTime = hourEx - preTime * 100;
    return dist.back() * 100 > leftTime * maxSpeed;
  }

 public:
  int minSpeedOnTime(vector<int>& dist, double hour) {
    if (CheckSpeed(dist, MAX_ANS, hour)) {
      return -1;
    }

    int left = 1, right = MAX_ANS;
    while (left < right) {
      int mid = (left + right) / 2;
      if (CheckSpeed(dist, mid, hour)) {  // 速度太小了，时间超过了
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return right;
  }
};
```



赛后，再次分析数据，速度最大为`1e7`， 路程最小为 1，则所有精度最小为 `10e-9`。  
 

所以，将精度修改为 `10e-9` 也能通过这道题。  
当时我发现精度问题后，不信任精度了，便转向转整数的方法去了。  
如果打印下日志，应该几分钟就可以通过这道题。  


```
speed = 5000000 minTime=2.0200000000
speed = 7500000 minTime=2.0133333333
speed = 8750000 minTime=2.0114285714
speed = 9375000 minTime=2.0106666667
speed = 9687500 minTime=2.0103225806
speed = 9843750 minTime=2.0101587302
speed = 9921875 minTime=2.0100787402
speed = 9960938 minTime=2.0100392152
speed = 9980469 minTime=2.0100195692
speed = 9990235 minTime=2.0100097745
speed = 9995118 minTime=2.0100048844
speed = 9997559 minTime=2.0100024416
speed = 9998780 minTime=2.0100012201
speed = 9999390 minTime=2.0100006100
speed = 9999695 minTime=2.0100003050
speed = 9999848 minTime=2.0100001520
speed = 9999924 minTime=2.0100000760
speed = 9999962 minTime=2.0100000380
speed = 9999981 minTime=2.0100000190
speed = 9999991 minTime=2.0100000090
speed = 9999996 minTime=2.0100000040
speed = 9999998 minTime=2.0100000020
speed = 9999999 minTime=2.0100000010
```


## 三、跳跃游戏 VII  


题意：给一个 `01` 字符串，起点是第一个字符，终点是最后一个字符。  
给一个跳跃的最小距离和最大距离，每次只能调到值为 `0` 的位置。  
问能否调到终点。  


思路：

方法一、暴力枚举  


最基本的方法是维护一个可以到达的点集合。  
对于每个可以到达的点，枚举下一步可以到达的区间，判断是否有新的点加入这个集合。  
如果最终最后一个字符也加进来了，那就有答案。  


复杂度：`O(n^2)`  


方法二、双指针  


对于每个字符为 0 的位置，只存在是否能到达。 


由于所有下标向后跳跃的最小距离和最大距离是相等的。  
从左到右扫描过程中，前一个字符扫描过的位置区间就不需要扫描了。  


所以维护一个最远的下标，每次从最远的下标开始扫描即可。  


复杂度：`O(n)`


注意事项：最远的下标不一定连续，即某些点永远无法到达。  



```
bool canReach(string s, int minJump, int maxJump) {
  queue<int> que;
  int n = s.size();
  int r = 0;

  que.push(0);

  while (!que.empty()) {
    int l = que.front();
    que.pop();

    r = max(r, l + minJump); // r 不一定连续，所以需要更新下一个最小的起点

    while (r < n && l + minJump <= r && r <= l + maxJump) {
      if (s[r] == '0') {
        if (r == n - 1) {
          return true;
        }
        que.push(r);
      }
      r++;
    }
  }
  return false;
}
```


## 四、石子游戏 VIII  


题意：现在 Alice 和 Bob 在玩石子游戏，Alice 先走。   
有一排石子共 n 个，每个石子有一个初始价值。  


游戏规则如下：  


1、如果只剩下一个石子，则游戏结束。  
2、选手可以从左边拿走 x 个石子，且 x 大于 1。  
3、选手拿走石子之后，得分是拿走石子的价值之和。  
4、选手拿走石子之后，会在最左边加入一个石子，价值也是拿走石子的价值之和。  


游戏结束时，两个人都有得分。  
得分之差定义为 Alice 的分数 减去 Bob 的分数。  
Alice 的目标是使两个人的得分之差最大。  
Bob 的目标是使两个人的得分值差最小。  


问双方都采用最优策略，最终两人的得分之差。  



思路：博弈里最难理解了，需要慢慢分析题意。   


分析一：问题的答案对齐  


原题：求最终两人的得分之差。  
由于 Alice 先走，问题的目标其实就是 Alice 的目标。  


分析二：两人的目标对齐  


原题：Alice 的目标是使分数之差最大，Bob 的目标是使分数之差最小。  
由于两个人的分数是相减的，所以两个人分别当做主角时，他们的目标其实是一样的。  
即自己操作时，都是希望自己的得分与下个人的得分的之差更大。  


分析三：拿走石子的价值  


由于每次拿走一个前缀石子后，又把前缀石子的总价值当做新的石子放在最左边了。  
所以，每次操作，得到的价值都是前缀和，定义为 `S(x)`。  


分析四：状态定义  


状态：`f(x)`   
定义：前 x 个石子已经拿走，第 x 个石子的价值是前 x 个石子的价值之和时，当前选手未来可以得到的最大分数之差。  


这里的未来是不考虑之前的得分，只计算之后的得分。  
因为历史行为是不确定的，但是 x 一旦固定，石子的序列就固定了，未来的最优值也固定了。


分析五、方程


假设当前选手 A 的状态是 `f(x)`，决定拿走 `[x, k]`的石子。  
当前选手 A 的得分是 `S(k)`。  
下个选手 B 的最优目标是 `f(k)`。  


则当前选手 A 的分数之差就是 `f(x) = S(k) - f(k)` 。  


证明：  
假设下个选手 B  `f(k)` 达到最优目标时，选手 B 的得分是 `B(k)`，选手A 的得分是 `A(k)`。  
则下个选手 B 的最优目标是 `f(k) = B(k) - A(k)`。  


当前选手 A 操作的得分是 `S(k)`，则总得分是 `S(k) + A(k)`。  
这样，当前选手的分数之差就是 `f(x) = S(k) + A(k) - B(k)`。  
由于 `f(k) = B(k) - A(k)`，所以`f(x) = S(k) - f(k)`。  


分析六：状态转移方程  


状态：`f(x)`  
对于 x， 可以选择的分别是 `[x+1, n]`。  
选择之后，得分是前缀和，然后减一下个选择的分数差，就是自己当前的分数差。 
证明：见分析五。 


最优目标则是所有选择里面的最大值。  
转移方程：`f(x) = max(S(i) - f(i))`  


  
方法一：暴力计算  


有了状态转移方程，就可以做这道题了。  
由于每个状态都要枚举到最后一个位置，复杂度较高。  
复杂度：`O(n^2)`  


方法二、利用上个状态的结果


在上次比赛《[leetcode 第 241 场算法比赛](https://mp.weixin.qq.com/s/UoLglB3bBxPkN2k3OHMbLQ)》的时候，我分享过动态规划的优化方法：  


面对动态规划，复杂度太高时，优化思路是对某些项提前做预处理，或者看某个循环的结果是否可以在下次循环时复用。


所以这里我们分析下方程，可以发现这里也可以利用上一个状态的答案。  


这样循环就可以转化为一个比大小了。  


优化：`f(x) = max(S(x+1) - f(x+1), f(x+1))`  


```
int stoneGameVIII(vector<int>& stones) {
  int n = stones.size();
  vector<int> sum(n + 1, 0);
  vector<int> ans(n + 1, 0);

  for (int i = 1; i <= n; i++) {
    sum[i] = sum[i - 1] + stones[i - 1];
  }

  int maxVal = sum[n]; // 可以全拿了
  for (int i = n - 1; i > 0; i--) {
    ans[i] = max(sum[i + 1] - ans[i + 1], maxVal);
    maxVal = max(maxVal, ans[i]);
  }
  return ans[1];
}
```

## 五、最后  


这次比赛被第二题坑了，其他题都算是基础算法知识。  


第一题：初级动态规划  
第二题：二分查找  
第三题：集合+双指针  
第四题：博弈+动态规划  


当然，第四题博弈题在 leetcode 上算是比较难的题型，因为分析题意，写出状态转移方程后才是基础的动态规划。  
而对于博弈题，最难的是理解题意，转换题意，推导公式。  


这里我也手把手的分析了题意，最终转化为了动态规划题。  


互动：最后一题你做出来了吗？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

