---
layout: post
title: CCF CSP-J 2023 第二轮比赛
description: 初级比赛难度较低      
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateData: 2025-06-11 12:13:00
published: true
---



## 零、背景


最近打算做一下 CSP-J 与 CSP-S 的比赛题。  
之前已经写了《[CSP-J 2024](https://mp.weixin.qq.com/s/-07O9hiNL1e9llPDsaPoWQ)》、《[CSP-S 2024](https://mp.weixin.qq.com/s/MVvztSH8LW13eP5lc7cHjg)》的题解，今天来看看 2023 CSP-J 的题解吧。  


A: 数学公式  
B: 后悔贪心  
C: 模拟  
D: 图论+动态规划  


代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/other/CSP-J/  


![](https://res2025.tiankonguse.com/images/2025/06/12/001.png)  


## 一、小苹果（apple）  


![](https://res2025.tiankonguse.com/images/2025/06/12/002.png) 


题意：n 个苹果编号为1到n，每天把位置为 `1+3k` 的苹果拿走，问总共几天可以走拿走，以及编号为n的评估是第几天拿走的。  


思路：数学公式  


每天拿走 1/3 个苹果， 约`log(n)`天拿完，可以模拟来精确计算出天数。  


编号为n的苹果为最后一个苹果，当剩余苹果个数为 `1+3k`时，会恰好把最后一个苹果拿走。  
故模拟每天拿苹果时，判断当前苹果个数是不是`1+3k`即可。  


```cpp
ll all_day = 0, n_day = 0;
while (n) {
  all_day++;
  ll choice = 1 + (n - 1) / 3;
  if (n_day == 0 && n % 3 == 1) {
    n_day = all_day;
  }
  n -= choice;
}
```


## 二、公路（road）  


![](https://res2025.tiankonguse.com/images/2025/06/12/003.png) 


题意：一条路上n个加油站，告诉你相邻加油站的距离，每个加油站的价格，问车油箱无限大时，从第一个加油站开到最后一个加油站，最少需要多少钱。  


思路：  


由于油箱无限大，如果要加油，需要选择前面价格最便宜的加油站提前加油。  


分析所有加油站的关系，最终选择的加油站是递减单调栈。  


假设单调栈是 `a0,a1,a2,...,ak`。  
性质1：`a0>a1>a2>...>ak`  
性质2：`[ai,ai+1)` 之间的加油站价格都高于 ai，从 ai 开到 `ai+1` 都需要从 ai 加油。  


如何快速找到单调栈呢？    
实际不需要找单调栈，直接按性质2循环计算即可。  
复杂度：`O(n)`  


注意事项：为了避免精度问题，可以统计已经走的总距离和加的总油量，从而算出消耗了多少油，需要买多少油。  



```cpp
ll ans = 0;
ll all_dis = 0;  // 总共需要跑的公里数
ll all_oil = 0;  // 加的总油
ll pre_min_price = a[0];
for (int i = 1; i < n; i++) {
  ll dis = v[i - 1];
  all_dis += dis;
  ll need_oil = (all_dis + d - 1) / d;
  if (all_oil < need_oil) {  // 油不够，需要买油
    ll buy_oil = need_oil - all_oil;
    ans += buy_oil * pre_min_price;
    all_oil += buy_oil;
  }
  pre_min_price = min(pre_min_price, a[i]);
}
```


逆向思考-后悔贪心  


苏格拉底与柏拉图稻草的故事：前面有一个又大又美的稻田,你只要往前走,一路走不能回头,选到一个你觉得最大最美的稻穗。  
如果可以回头，你会怎么做呢？  


起点先提前加满油，使得可以到达终点，并记录油的价格。  
到达一个位置后，如果油价更便宜，看还剩多少升油，后悔不买这些油，改成更便宜的油。  
复杂度：`O(n)`  


```cpp
ll now_dis = 0;                      // 总共需要跑的公里数
const ll all_oil = (all_dis + d - 1) / d;  // 加的总油
ll pre_min_price = a[0];
ll ans = all_oil * pre_min_price;
for (int i = 1; i < n; i++) {
  now_dis += v[i - 1];  // 到达 i 的时候，行驶的距离
  ll now_price = a[i];
  if (pre_min_price > now_price) {       // 更便宜了，剩余的油后悔贪心
    ll use_oil = (now_dis + d - 1) / d;  // 已经使用的油，向上取整
    ll left_oil = all_oil - use_oil;
    ans = ans - pre_min_price * left_oil + now_price * left_oil;  // 后悔贪心
    pre_min_price = now_price;
  }
}
```


## 三、一元二次方程（uqe）  


![](https://res2025.tiankonguse.com/images/2025/06/12/004.png) 


题意：给一个一元二次方程`ax^2 + bx + c = 0,(a != 0)`，如果有实数解，按要求格式输出实数解。  


思路：模拟  


1）求`d = b * b - 4 * a * c`,判断是否有解  
2）如果系数 a 的符号为负，所有系数符号翻转。  
3）求系数的最大公约数，进行化简。  
4）如果 `d` 为0，则有一个实数解，输出`-b / 2 * a`。  
5）如果`sq=sqrt(d)`可以开方，则有有理数解，输出 `-b + sq / 2 * a`。  
6）`b` 不为0，则可以确定左半部为 `-b / 2 * a`。  
7）提取`d`最大平方公约数`p^2`，进行开方提取出 `p`。  
8）提取的平方数与分母消除最大公倍数。  



## 四、旅游巴士（bus）

![](https://res2025.tiankonguse.com/images/2025/06/12/005.png) 


题意：给一个地图，部分路径有最早时间限制，起点p1时刻是k周期出发`(t1=a*k)`，
终点pn要求也是k周期时刻到达`(tn=b*k)`。  
问乘坐旅游巴士离开景区的时间尽量地早。  


思路：图论+动态规划  


1）不考虑任何限制：经典最短路。  


2）考虑起点周期k：如果一个点在 t 时刻可以到达，则可以在 `t+b*k`。  
时刻到达，故只需要储存最小的 t。  


3）考虑路径 `[u,v,a]` 开放时间：  
如果到达 u 时，时刻 `t<a`， 则等待若干 k 周期，使得时间满足 `t+bk>=a`，即找到最小的 `T=t+bk`, 使得 `T>=a`。  
也就是这个路径，在`T+bk`都是可以走的。  


对于同一个点，如果即可以在 `T+ak`到达，又可以在 `T+kb`到达，显然可以进行合并，只需要储存最小的即可，另一个可以通过若干个周期到达。  
合并后，每个点共有 `k` 个不同的最小值，分别是 `[0,k-1]+ak`。  


由此可以确定状态：`flag[N][K]`，到达节点 N 时，时间取模 k 为 K 时的最短时间。  


深度优先搜索如下，会触发超时：  


```cpp
vector<vector<pair<ll, ll>>> g;  // 图储存在 g 里面, 元素值为 {v, a}
vector<vector<ll>> flag;         // 标记每个位置 t%k 到达的最优时间

ll n, m, k;
void dfs(ll tu, ll u) {
  if (flag[tu % k][u] <= tu) return;  // 达到时间没有更优，不处理
  flag[tu % k][u] = tu;

  for (auto [v, a] : g[u]) {
    ll tv = tu;
    if (tv < a) {                   // 道路没开放，在门口等到 b 个 k
      ll b = (a - tv + k - 1) / k;  // 相差 a-tv 时间，等待 k 周期，需向上取整
      tv += b * k;
    }
    tv++;  // 通过这条道路，时间加1
    dfs(tv, v);
  }
}
```


会超时的原因是相同状态，时间是乱序访问的，后面可能遇到更小的时间，从而重复搜索。  


其实对于会乱序的求最小时间的题目，都需要使用优先队列搜索来剪枝，从而可以保障搜索的时间是递增的。  


```cpp
vector<vector<pair<ll, ll>>> g;  // g[u]{v, a}
min_queue<pair<ll, ll>> que;     // {cost, u}
vector<vector<ll>> dp;


dp[0][0] = 0;
que.push({0, 0});
while (!que.empty()) {
  auto [tu, u] = que.top();
  que.pop();
  // 剪枝，如果有更优解，使用更优解来 bfs
  if (dp[tu % k][u] < tu) {
    tu = dp[tu % k][u];
  }
  for (auto [v, a] : g[u]) {
    ll tv = tu;
    if (tv < a) {  // 道路没开放，在门口等到 num 个 k
      ll num = (a - tv + k - 1) / k;
      tv += num * k;
    }
    tv++;  // 通过这条道路，时间加1
    ll tvk = tv % k;
    if (tv < dp[tvk][v]) {  // 有更优解
      dp[tvk][v] = tv;
      que.push({tv, v});
    }
  }
}
if (dp[0][n - 1] == INF) {
  dp[0][n - 1] = -1;
}
printf("%lld\n", dp[0][n - 1]);
```


## 五、最后  


CSP 2023 的入门赛还是比较简单的，第三题模拟需要花费不少时间，第四题分析出求每个位置的最小的`T+kb`，然后正常的 bfs 搜索即可。  



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
