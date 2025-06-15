---
layout: post  
title: leetcode 第 435 场算法比赛  
description: 第三题依旧偏难。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate: 2025-02-18 12:13:00  
published: true  
---


## 背景  


我多年来一直在坚持参加 leetcode 周赛，并发布题解。  
现在整理了一个[leetcode 周赛题解大全](https://mp.weixin.qq.com/s/64TblIROBAfZNim89kylHw),每月更新一次。  
地址为：https://mp.weixin.qq.com/s/64TblIROBAfZNim89kylHw  


春节后一周我请了几天假，周日还在路上，所以没有参加比赛。  
现在趁着周末，把比赛补一下。  


A: 统计  
B: 模拟+贪心  
C: DP+状压+排列数+贪心  
D: 枚举+滑动窗口+状态DP  


排名：未参加比赛  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  

## 一、奇偶频次间的最大差值 I  


题意：给一个字符串，问字符频次中奇数次减去偶数次，最大是多少。  


思路：差最大，显然是最大的奇数次减去最小的偶数次。  


统计各字符频次，计算出最大奇数次与最小偶数次即可。  


## 二、K 次修改后的最大曼哈顿距离  


题意：给一个网格，从原点上下左右走 N 步，问最多修改 K 步移动指令，任意时刻可以到达的最大曼哈顿距离。  


思路：模拟贪心。  


曼哈顿距离定义为坐标绝对值之和。  
假设当前坐标在第1象限，两个坐标都是正的，则所有向左(x坐标轴减一)和向下(y坐标轴减一)的移动都会降低向右和向上的距离，从而使得答案变小。  
所以对其方向取反，则坐标值可以翻倍（原先减一，现在不减一了，还加一，最终是加二）。  


故可以统计每个时刻上下左右分别走了多少步，以当前所属象限为目标，相反方向的移动取反，最多取反k次，即可得到当前的最优值。  



## 三、使数组包含目标值倍数的最少增量  


题意：给两个数组，第一个数组 nums 可以任意选择数字进行加一，问至少加多少次，才能使得第二个数组 target 的每个元素在第一个数组都可以找到倍数。  


思路：动态规划。  


方法1：状态压缩动态规划。  


状态压缩含义：有k个数字(一般较小)选择若干个，使用二进制表示，1代表选择，0代表未选择。  


状态定义：`f(i,MASK)`  前 i 个位置满足 MASK压缩状态时的最小操作次数。  


状态转移方程： `f(i,MASK) = min(f(i-1, MASK ^ mask) + Cost(i, mask))`  
解释：第 i 个元素满足 mask 压缩状态时，剩余的压缩状态由前 `i-1` 个元素满足时的答案。  


涉及技术：给一个数字，需要枚举数字的所有子集，模版如下。  


```cpp
for (int sub = mask; sub; sub = (sub - 1) & mask) {
    // sub 为 mask 的其中一个子集
}
```


另外，选择一个子集后，还需要求子集的最小公倍数，可以预处理得到。  


```cpp
const int M = 1 << m;
vector<ll> lcms(M);
lcms[0] = 1;
for (int i = 0; i < m; i++) {
  const int MASK = 1 << i;
  for (int mask = 0; mask < MASK; mask++) {
    lcms[MASK | mask] = Lcm(target[i], lcms[mask]);
  }
}
```

复杂度：`O(n * 2^m * 2^m )`  


方法2: 排列数+动态规划  


第二个数组只有 4 个数字，如果我们枚举所有组合，与第一个数组计算的时候就不需要枚举子集了。  


只看组合的话，大概分为 12 种情况。  


1）独立4个数字，共 1 种情况。  
2）2个数字组合，2个数字独立，`C(4,2)*C(2,2)`共6种情况。  
3）3个数字组合，1个数字独立，`C(4,3)*C(1,1)` 共4种情况。  
4）4个数字组合，1 种情况  


组合只是得到数字的个数，考虑匹配顺序，这里需要使用排列，来决定与第一个数组匹配的顺序。  
算上排列，情况就更多了，我们可以通过一个 dfs 来得到排列数。  
复杂度大概为：`O(4!)`  


```cpp
void Dfs(const ll pre = 0) {
  const int m = target.size();
  if (m == 0) { // 组合数结束
    Solver(pre);
    return;
  }
  for (int i = 0; i < m; i++) {  // 选择 i 与 pre 组合
    const ll selectVal = target[i];
    // 正常需要 flag 标记是否选择，这里使用其他方法代替
    swap(target[i], target.back());
    target.pop_back();
    Dfs(Lcm(pre, selectVal));
    target.push_back(selectVal);
    swap(target[i], target.back());
  }
  if (pre) { // 组合结束，开始新的组合
    buf.push_back(pre);
    Dfs(0);
    buf.pop_back();
  }
}
```


数字的顺序确定了，就可以使用动态规划来做了。  


状态定义：`f(i,j)` 前 i 个元素按顺序满足前 j 个组合数时的最优答案。  


状态转移方程：  
解释：选择第 i 个元素或不选择第 i 个元素。  


```cpp
f(i,j) = min(f(i-1,j) , f(i-1, j-1) + Cost(i, j))
```


复杂度：`O(m! * n*m)`  


方法3：贪心+排列数+动态规划  


对于一个组合数，我们显然会从第一个数组中去选择倍数最接近的数字，如果是倍数那就更高了。  
但是这种贪心可能存在反例，即最接近的让给其他组合数，选择次接近的，综合答案会更优。  
次接近的数字也可能需要让给其他数字。  


最多让几次呢？  
共4个数字，最多让3次，所以每个数字只需要保留最接近的3个数字即可。  


```cpp
vector<int> use(n, 0);
min_queue<tuple<ll, ll, ll>> que;
int m = buf.size();
int V = buf[i];

for (int j = 0; j < n; j++) {
  int v = nums[j];
  ll left = v % V;
  if (left == 0) left = V;
  que.push({left, v, j});
  if (que.size() > m) {
    que.pop();
  }
}

while (!que.empty()) {
  auto [left, v, j] = que.top();
  use[j] = 1; // 对于 V，选择第 j 个数字
  que.pop();
}
```


数字去重之后，剩下的与方法二类似。  
预处理，计算出所有组合数选择的 top 数字，复杂度 `O(2^m * n)`  
对于每个排列，合并选中的组合数，动态规划计算，复杂度：`O(m! * m^2)`  


## 四、奇偶频次间的最大差值 II  


题意：给一个字符串，问选择的长度至少为k的子串里，字符出现的奇数次减去出现的偶数次的最大差值。  


思路：枚举+滑动窗口+状态DP  


题目说只有5个字符，所以可以枚举奇数次字符与偶数次字符，问题就转化为了字符 a 出现奇数次，字符b出现偶数次的最大差值子串。  


另外，字符确定后，只关心奇偶性，我们可以通过状态矩阵维护一个位置所有前缀的奇偶性信息。  


```text
0 0 偶数减偶数的最优答案
0 1 偶数减奇数的最优答案
1 0 奇数减偶数的最优答案
1 1 奇数减奇数的最优答案
```


之后可以滑动窗口，不断的计算出某个位置为结束时所有前缀的状态矩阵。  


如果某个位置是第一个字符，则第一个字符的奇偶性需要翻转。  
如果是第二个字符，则第二个字符的奇偶性需要翻转。  
如果两个字符都不是，则状态矩阵不变。  


这里有个特殊事项：字符不存在是，会被计算为偶数，但是题目要求偶数必须是正数。  
所以这里我是使用三个状态来表示的：0、正奇数、正偶数。  


状态转移如下：  


```text
0 -> 正奇数
正奇数 -> 正偶数
正偶数 -> 正奇数
```

```cpp
int nextState[3] = {1, 2, 1};
// 添加大于 k 的子串
for (int A = 0; A < 3; A++) {
  for (int B = 0; B < 3; B++) {
    if (v == a) {
      UpdateMax(now[nextState[A]][B], pre[A][B] + 1);
    } else if (v == b) {
      UpdateMax(now[A][nextState[B]], pre[A][B] - 1);
    } else {
      UpdateMax(now[A][B], pre[A][B]);
    }
  }
}
// 添加 k 子串自身
UpdateMax(now[NumState(numA)][NumState(numB)], numA - numB);

//更新当前位置所有前缀子串的答案
UpdateMax(ansTmp, pre[1][2]);
```



## 五、最后  


这个比赛同样顺序出的不好，第三题和第四题难度是反的。  
第三题属于综合性比较难的题，又是状压压缩，又是枚举子集，或是排列组合，而第四题则是比较简单的动态规划。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  