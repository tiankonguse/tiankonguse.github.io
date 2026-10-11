---
layout: post  
title: leetcode 周赛 523  
description: 背包DP多关键字最优化  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-10-11 12:13:00  
published: true  
---


## 零、背景


这次比赛刚好在周末，做了一下四道题，比较简单。  
前三题分别是数学推导、贪心和模拟，第四题是背包 DP。  


本场题型概览如下。  


A 题：数学  
B 题：贪心  
C 题：模拟  
D 题：背包DP  


## 一、连续三项斐波那契数之和


题意：给你一个整数 n。  
斐波那契数列以 0 和 1 开始，之后的每个数都是前两个数之和，前几项为 0、1、1、2、3、5、8、13...  
如果 n 可以表示为斐波那契数列中连续三项之和，则返回 true；否则返回 false。  


数据范围：`1 <= n <= 10^9`  


思路：数学推导  


连续三项之和为 `f(i) + f(i+1) + f(i+2)`。  
由于斐波那契数列满足 `f(i) + f(i+1) = f(i+2)`，三项和可以化简为 `2 * f(i+2)`。  
所以 n 能表示为连续三项之和，等价于 n 是偶数，且 n/2 是某个斐波那契数（下标从 2 开始）。  


预处理时把所有不超过 `10^9` 的斐波那契数放入哈希表，然后判断 n/2 是否在表中即可。  
复杂度：预处理 `O(log n)`（1e9 范围内约 45 个数），每次查询 `O(1)`。  
 


```cpp
bool threeFibonacciSum(int n) {
  ll a = 0, b = 1;
  const ll maxVal = 1e9;
  unordered_set<ll> h;
  while (b <= maxVal) {
    b = a + b;
    a = b - a;
    h.insert(b);
  }
  if (n % 2 == 1) {
    return false;
  }
  n = n / 2;
  return h.count(n) == 1;
}
```
  


## 二、选择质数子集 I


题意：给你两个整数 n 和 s。  
考虑所有小于等于 n 的质数，从中选择一些质数，需要满足：所选质数的总和小于等于 s、数量最多、每个质数最多只能选择一次。  
返回一个包含所选质数的整数数组，并按递增顺序排列；如果存在多个最优选择，返回任意一个即可。  
如果无法选择任何质数，则返回一个空数组。  


数据范围：`1 <= n <= 10^6`，`1 <= s <= 10^9`。  


思路：贪心  


要选数量最多的质数，显然优先选最小的质数：任意 k 个质数的和一定不小于最小的 k 个质数之和。  
所以从小到大遍历质数，能放就放，得到的数量就是全局最优；  
由于质数严格递增，一旦当前质数超过剩余容量或超过 n，后续质数只会更大，直接终止。  


质数表 `prm` 与 `InitPrimes()` 为埃氏筛预处理（复杂度 `O(N log log N)`）；  
每次选择线性扫描，复杂度 `O(质数个数)`。  
 


```cpp
vector<int> maxPrimes(int n, int s) {
  InitPrimes();
  vector<int> ans;
  for (int i = 0; i < prmCnt; i++) {
    if (s >= prm[i] && prm[i] <= n) {
      ans.push_back(prm[i]);
      s -= prm[i];
    } else {
      break;
    }
  }
  return ans;
}
```


## 三、设计公交车座位预订系统


题意：设计一个公交车座位预订系统。  
公交车共有 n 排座位，每排四个座位，标记为 A、B、C、D；A 和 D 是靠窗座位，B 和 C 是中间座位，A 与 B 相邻，D 与 C 相邻。  
预订中间座位始终需要 1 秒；预订靠窗座位时，如果其相邻的中间座位尚未被预订需要 1 秒，否则需要 3 秒（额外 2 秒延迟）。  
实现 BusBooking 类：toggle(seat) 预订或释放一个座位；getTotalTime() 返回按照 toggle 调用顺序预订当前所有已订座位的总时间；getMinTime() 返回可以任意调整预订顺序的最小总时间。  
注意：一个座位的时间开销在其被预订时确定，之后再预订或释放其他座位，都不会改变已经预订座位的时间开销。  


数据范围：`1 <= n <= 10^5`；toggle、getTotalTime、getMinTime 的调用总次数不超过 `10^5`。  


思路：模拟  


每排只有四个座位，直接开数组记录每个座位的当前成本（0 表示未订，1 或 3 表示已订时的成本）。  
把列号按 0=A、1=B、2=C、3=D 编号，A 与 B、D 与 C 相邻。  
预订中间座位恒为 1 秒；预订靠窗座位时，只需看相邻中间座位的成本是否为 0：为 0 记 1 秒，否则记 3 秒。  
释放座位时，从累计总时间中减去该座位当初记录的成本并清零；  
题目规定已订座位的历史成本不再改变，所以释放时不需要关心相邻座位。 

 
getTotalTime 返回累计总时间。  
getMinTime 贪心：每对相邻座位先订靠窗再订中间，两个座位都只花 1 秒，最小时间就是已订座位数。  
复杂度：每次操作 `O(1)`。  
 


```cpp
class BusBooking {
  int cnt;
  int cost;
  vector<vector<int>> g;

  pair<int, int> Parse(const string& s) {
    int c = s[0] - 'A';
    int no = 0;
    for (int i = 1; i < s.size(); i++) {
      no = no * 10 + (s[i] - '0');
    }
    return {c, no - 1};
  }

 public:
  BusBooking(int n_) {  //
    g.resize(n_, vector<int>(4, 0));
    cnt = 0;
    cost = 0;
  }

  void toggle(const string& seat) {  //
    const auto [c, no] = Parse(seat);
    const int C = c ^ 1;  // 奇偶相邻的位置
    const bool side = (c == 0 || c == 3);
    if (g[no][c]) {
      cost -= g[no][c];
      g[no][c] = 0;
      cnt--;
    } else {
      if (side && g[no][C]) {
        g[no][c] = 3;
      } else {
        g[no][c] += 1;
      }
      cost += g[no][c];
      cnt++;
    }
  }

  int getTotalTime() {  //
    return cost;
  }

  int getMinTime() {  //
    return cnt;       // 先订靠窗再订中间，每个座位都只花 1 秒
  }
};
```


## 四、选择质数子集 II


题意：给你两个整数 n 和 s。  
考虑所有小于等于 n 的质数，从中选择一个子集，每个质数最多只能选择一次。  
在所选质数总和不超过 s 的前提下使总和尽可能大；在总和最大的所有子集中，选择包含质数数量最少的子集；如果仍有多个满足条件的子集，则选择字典序最小的数组。  
返回按递增顺序排列的质数数组；如果不存在合法的非空子集，则返回空数组。  


数据范围：`1 <= n <= 1000`，`1 <= s <= 1000`；1000 以内质数最多 168 个。  


思路：背包DP（记忆化搜索）  


题目有三个优化目标，优先级依次是：总和最大、数量最少、字典序最小。  
在「总和不超过 s」的约束下从质数集合中选子集，每个质数选或不选，这是标准的 0/1 背包模型。  

定义状态 `Dfs(s, p)`：从第 p 个质数开始选择，剩余容量为 s，返回三元组（最大和、最少数量、第一个选中质数的下标）。  


状态转移方程：按是否选择当前质数，判断三元组哪个更优  


- 选当前质数：`{sum1 + prm[p], cnt1 + 1, p}`。  
- 不选当前质数：`{sum0, cnt0, index0}`。  


比较时按优先级：和越大越好；和相等时数量越少越好；再相等时选当前质数，因为 `prm[p]` 比任何后续质数都小，字典序更小。  


边界：p 超出质数表、当前质数大于 n、或剩余容量装不下当前质数时，返回空选择 `{0, 0, 0}`。  


得到 `Dfs(s, 0)` 后回溯构造答案：取出 `prm[index]`，再用剩余容量与下一个下标递归，直到和为 0。  
总复杂度与空间均为 `O(s * 质数个数)`。  
 


```cpp
class Solution {
  int N;
  // dp[s][p] 从第 p 个质数起，容量 s 时的 (最大和, 最少数量, 第一个选中下标)
  vector<vector<tuple<int, int, int>>> dp;
  tuple<int, int, int> Dfs(const int s, const int p) {
    if (p >= prmCnt || prm[p] > N || s < prm[p]) return {0, 0, 0};
    auto& [sum, cnt, index] = dp[s][p];
    if (sum != -1) {
      return dp[s][p];
    }
    sum = 0;
    cnt = 0;
    // 选择当前质数
    const auto [sum1, cnt1, index1] = Dfs(s - prm[p], p + 1);
    // 不选择当前质数
    const auto [sum0, cnt0, index0] = Dfs(s, p + 1);

    const tuple<int, int, int> ans1 = {sum1 + prm[p], cnt1 + 1, p};
    const tuple<int, int, int> ans0 = {sum0, cnt0, index0};

    if (sum1 + prm[p] > sum0) {
      return dp[s][p] = ans1;
    } else if (sum1 + prm[p] < sum0) {
      return dp[s][p] = ans0;
    } else {  // 和相等，比数量
      if (cnt1 + 1 < cnt0) {
        return dp[s][p] = ans1;
      } else if (cnt1 + 1 > cnt0) {
        return dp[s][p] = ans0;
      } else {  // 数量也相等，选当前质数，字典序更小
        return dp[s][p] = ans1;
      }
    }
  }

 public:
  vector<int> maxPrimeSubset(int n, int s) {
    N = n;
    InitPrimes();
    // dp 初始化为哨兵 -1，表示尚未计算
    dp.assign(s + 1, vector<tuple<int, int, int>>(prmCnt + 1, {-1, -1, -1}));
    auto [ansSum, ansCnt, ansIndex] = Dfs(s, 0);
    vector<int> ans;
    ans.reserve(ansCnt);
    int sum = ansSum, index = ansIndex;
    while (sum > 0) {
      ans.push_back(prm[index]);
      auto [ansSum, ansCnt, ansIndex] = Dfs(sum - prm[index], index + 1);
      sum = ansSum, index = ansIndex;
    }
    return ans;
  }
};
```




## 五、最后


这周赛整体比较简单，四道题都能一眼看出做法。  


A 题是数学推导，把连续三项和化简成中间项的两倍，转化为判断 n/2 是否为斐波那契数。  
B 题贪心，数量最多直接从小到大选最小的质数。  
C 题模拟，关键是释放座位不改变其他已订座位的成本，getMinTime 等于已订座位数。  
D 题是带三个关键字的 0/1 背包，核心是理清三个目标的优先级（和最大、数量最少、字典序最小），再套记忆化搜索模板即可。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
