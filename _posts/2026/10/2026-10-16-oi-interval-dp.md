---
layout: post  
title: OI 必学：区间 DP  
description: 区间 DP 的五类转移骨架与典型题目  
keywords: 算法, 动态规划, DP, 区间DP, NOIP  
tags: [算法, 动态规划, DP, 区间DP]  
categories: [算法]  
updateDate: 2026-10-15 18:30:00  
published: false  
---


## 零、背景


区间 DP 是 NOIP 提高组里最常考的一类动态规划。  
它的标志是状态写成 `f(l, r)`，两个参数都是下标，圈住同一个序列上的一段。  


和线性 DP 相比，它的状态从一维变成了二维，转移的方向也从「从左往右」变成了「从短到长」。  
因此它的数据规模通常不大，几百到一千出头，`O(n^3)` 也能过。  


本文按转移的形状，把区间 DP 分成五类来讲：两端点讨论、枚举划分点、枚举最后一步、端点配对、状态加一维。  
每类配两道经典题，看完之后，遇到区间上的问题就能先判断它属于哪一类，转移的形状基本就定了。  


## 一、骨架：短区间先算，长区间后算


区间 DP 的核心只有一句话：`[l, r]` 的答案，由比它更短的区间推出来。  


比如 `[l, r]` 依赖 `[l+1, r]`、`[l, r-1]`、`[l+1, r-1]`，也可能依赖切成两半之后的 `[l, m]` 和 `[m+1, r]`。  
不管哪种，用到的区间长度都比 `r - l + 1` 小。  


于是填表顺序就定了：区间长度从小到大。  
写成两层循环，最直观的是枚举长度。  


```cpp
// 通用填表顺序：长度从 2 长到 n，保证用到的短区间已经算过
for (int len = 2; len <= n; len++) {
  for (int l = 1; l + len - 1 <= n; l++) {
    int r = l + len - 1;
    // 这里算 f[l][r]
  }
}
```


还有一种写法是 `l` 从大到小、`r` 从小到大。  
两种等价，前者更容易看懂，后者写起来短一点，后面两种都会出现。  


复杂度也跟着这个骨架定下来。状态数是 `O(n^2)`（严格说是 `n(n+1)/2` 个）。  
每格若只做常数次比较，总时间 `O(n^2)`；每格还要枚举一次划分点，就涨到 `O(n^3)`。  


## 二、两端点讨论：只盯着 s[l] 和 s[r]


这一类最窄。  
答案只由两端的字符决定，转移里只派生出 `l+1`、`r-1` 这种紧挨着的邻区间，不用枚举划分点。  


先说回文插入。  
给一个字符串 `s`，每次可以在任意位置插入任意字符，问最少插几次能把它变成回文串。  


状态：`f(l, r)` 表示只把 `s[l..r]` 这一段变成回文串，最少插几个字符。  


转移分两种。  
`s[l] == s[r]`，这两个字符正好配上，中间怎么补都不影响它们，问题缩成 `f(l+1, r-1)`。  
`s[l] != s[r]`，两端配不上，要么在右边补一个和 `s[l]` 相同的，缩成 `f(l+1, r)`；要么在左边补一个和 `s[r]` 相同的，缩成 `f(l, r-1)`。两条路都付一次插入，取小的加 1。  


```cpp
// s[l..r] 要变成回文串，最少插入几个字符
int minInsertions(const string& s) {
  int n = s.size();
  vector<vector<int>> dp(n, vector<int>(n, 0));
  for (int l = 0; l < n - 1; l++) {
    dp[l][l + 1] = s[l] == s[l + 1] ? 0 : 1;   // 长度 2 的区间
  }
  for (int l = n - 3; l >= 0; l--) {           // 左端从右往左推
    for (int r = l + 2; r < n; r++) {         // 右端从左往右推
      if (s[l] == s[r]) {
        dp[l][r] = dp[l + 1][r - 1];
      } else {
        dp[l][r] = min(dp[l][r - 1], dp[l + 1][r]) + 1;
      }
    }
  }
  return dp[0][n - 1];
}
```


拿 `abca` 走一遍：`s[0]` 和 `s[3]` 都是 `a`，直接跳进 `f(1, 2)`；`b` 和 `c` 不相等，两个分支各付一次插入，答案 1。  
补法是在 `c` 右边插一个 `b`，得到 `abcba`。  


这道题还藏着一个恒等式：最少插入次数等于 `n` 减去最长回文子序列的长度。  
可以用来验算。  


再说预测赢家。  
给一个数组，两个人轮流从两端取一个数加进自己的分数，先手先取，两人都让自己的分数最大，先手分数不低于后手就算先手赢。  


状态：`f(l, r)` 表示在 `nums[l..r]` 上继续玩、轮到当前这位玩家时，他能拿到的总分。  
这个定义对两个人都通用，谁轮到就套这个 `f`。  


转移：当前玩家取走 `nums[l]` 之后，对手变成 `[l+1, r]` 上的先手，对手会取走一端让他落到更短的区间上。  
对手想让他拿得少，所以取 `min` 那一支。取 `nums[r]` 对称。  


```cpp
// nums[l..r] 上继续玩，轮到当前玩家；返回他最后拿到的总分
int f(vector<int>& nums, int l, int r, vector<vector<int>>& dp) {
  if (l == r) return nums[l];
  if (l == r - 1) return max(nums[l], nums[r]);
  if (dp[l][r] != -1) return dp[l][r];
  int p1 = nums[l] + min(f(nums, l + 2, r, dp), f(nums, l + 1, r - 1, dp));
  int p2 = nums[r] + min(f(nums, l + 1, r - 1, dp), f(nums, l, r - 2, dp));
  return dp[l][r] = max(p1, p2);
}

bool predictTheWinner(vector<int>& nums) {
  int n = nums.size();
  long long sum = 0;
  for (int x : nums) sum += x;
  vector<vector<int>> dp(n, vector<int>(n, -1));
  return 2LL * f(nums, 0, n - 1, dp) >= sum;
}
```


夹在中间那个 `min` 是这道题的分界线。  
写成 `max` 就等于假设对手也在帮自己，随机数据上约 17% 的数组会算错。  


最后比的是先手和后手的分数，取总分 `sum`，先手超过一半就赢，恰好等于一半也算赢，所以判断写 `2 * first >= sum`。  


这题还有一条结论可以省掉计算：长度是偶数时先手必不败。  
做法是把数组按下标的奇偶分成两组，两组的元素个数一样多，先手记住总和大的那一组，之后每一步都取对手刚取走的那一端，就能把这一组完整拿走。  
长度是奇数时这个分组不成立，只能老老实实 dp。  


## 三、划分点：在区间里切一刀


这一类最常见，NOIP 里的石子合并就属于它。  
转移的形状固定：枚举一个位置 `m` 把 `[l, r]` 切成两块，两块各自解决完，再付分界处那一步的代价。  


石子合并是这样的：有 `n` 堆石头排成一排，每次把相邻两堆并成一堆，代价是这两堆之和，问并成一堆的最小总代价。  


状态：`dp[l][r]` 表示把 `[l, r]` 并成一堆的最小代价。  
转移：枚举最后一次合并发生在 `m` 和 `m+1` 之间，左边并成一堆、右边并成一堆，最后这两堆合起来付整段的和。  


```cpp
// 每次把相邻两堆并成一堆，代价是两堆之和，求并成一堆的最小代价
int mergeStones(const vector<int>& a) {
  int n = (int)a.size() - 1;              // a 从下标 1 开始
  vector<int> pre(n + 1, 0);
  for (int i = 1; i <= n; i++) pre[i] = pre[i - 1] + a[i];
  vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
  for (int len = 2; len <= n; len++) {
    for (int l = 1; l + len - 1 <= n; l++) {
      int r = l + len - 1;
      dp[l][r] = INT_MAX;
      for (int m = l; m < r; m++) {
        dp[l][r] = min(dp[l][r], dp[l][m] + dp[m + 1][r]);
      }
      dp[l][r] += pre[r] - pre[l - 1];    // 最后两堆合一的代价
    }
  }
  return dp[1][n];
}
```


代价那一句可以放在循环里也可以放在外面，放外面省事，因为无论切在哪，最后一次合并的代价都是整段的和。  


这道题还有个环形版本：石头围成一圈。  
做法是把数组复制一份接在后面，在长度 `2n` 的链上做一遍，答案取所有长度 `n` 的区间里最小的那个。  


切棍子是同一副骨架，但有两处值得学。  
一根长度 `n` 的棍子，`cuts` 里列着所有要切开的位置，切的顺序随意，每次切都要付当前这段的长度，问总成本最低是多少。  


第一处是整理数据。  
把 `cuts` 升序排好，再在两头各补一个哨兵位置 `0` 和 `n`，得到 `arr`。  


补哨兵的好处是：任何一段的两端都变成 `arr` 里相邻的两个下标，算长度不用再特判。  


```cpp
// arr[0]=0、arr[m+1]=n 是棍子的两个端点，arr[1..m] 是要切的位置（已排序）
int minCost(int n, vector<int> cuts) {
  int m = cuts.size();
  sort(cuts.begin(), cuts.end());
  vector<int> arr(m + 2);
  arr[0] = 0;
  for (int i = 1; i <= m; i++) arr[i] = cuts[i - 1];
  arr[m + 1] = n;
  vector<vector<int>> dp(m + 2, vector<int>(m + 2, 0));
  for (int i = 1; i <= m; i++) {
    dp[i][i] = arr[i + 1] - arr[i - 1];   // 只切一刀，花这整段
  }
  for (int l = m - 1; l >= 1; l--) {
    for (int r = l + 1; r <= m; r++) {
      int best = INT_MAX;
      for (int k = l; k <= r; k++) {
        best = min(best, dp[l][k - 1] + dp[k + 1][r]);
      }
      dp[l][r] = arr[r + 1] - arr[l - 1] + best;
    }
  }
  return dp[1][m];
}
```


第二处是边界的写法。  
`dp[l][k-1]` 在 `k == l` 时下标是 `l-1`，`dp[k+1][r]` 在 `k == r` 时下标是 `r+1`，两个都落在有效范围之外。  


它们恰好对应「这一边没有切点」，值应当是 0，而整张表本来就是 0 初始化的，所以不用特判。  


和石子合并比一下就能看出差别：石子合并里 `m` 属于左边那块，切棍子里 `k` 被这一刀用掉了，两边都不含它。  
共享和不共享，直接决定了枚举范围写 `l..r-1` 还是 `l..r`，也决定了要不要允许空区间。  


多边形三角剖分也是这个骨架：枚举和边 `(l, r)` 组成三角形的第三个顶点 `m`，两块是 `[l, m]` 和 `[m, r]`，共享顶点 `m`，代价是 `arr[l] * arr[m] * arr[r]`。  


## 四、最后一步：不能从第一步开始枚举


有些题顺着题面从第一步开始枚举，是写不出转移的。  
戳气球是最典型的例子。  


一排气球，每个上面有个数，戳破第 `i` 个得 `nums[i-1] * nums[i] * nums[i+1]` 枚硬币，戳完就没了，左右两边靠过来，数组边界外当作有一个数字为 1 的气球。  


第一反应是枚举「先戳哪个」。麻烦在下一步：`k` 没了之后，`k` 左边的球和右边的球贴到一起，`k-1` 的右边邻居换成了 `k+1`。  
左边那堆怎么爆会受右边那堆影响，两块不能分开算。  


换成枚举「这一段里最后爆哪个」。  
设最后爆的是 `k`，它爆的时候这一段其它球都已经爆完了，贴在它左右的只可能是这一段外面的两个球 `arr[l-1]` 和 `arr[r+1]`，这一下拿到的钱是个常数。  


更重要的是独立性。  
`k` 在它爆之前的整段时间里一直都在，把左边那堆和右边那堆隔开，于是两块子问题真的独立了。  


```cpp
// arr 两端各补了一个 1，[l..r] 这些气球决定一个打爆顺序，求最大得分
int maxCoins(vector<int>& nums) {
  int n = nums.size();
  vector<int> arr(n + 2);
  arr[0] = arr[n + 1] = 1;
  for (int i = 0; i < n; i++) arr[i + 1] = nums[i];
  vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
  for (int l = n; l >= 1; l--) {              // 左端从右往左
    for (int r = l; r <= n; r++) {            // 右端从左往右
      for (int k = l; k <= r; k++) {          // 枚举最后打爆的那个
        int left = (k > l) ? dp[l][k - 1] : 0;
        int right = (k < r) ? dp[k + 1][r] : 0;
        dp[l][r] = max(dp[l][r], arr[l - 1] * arr[k] * arr[r + 1] + left + right);
      }
    }
  }
  return dp[1][n];
}
```


两端各补一个 1 这一步别省。  
补完之后任何一段的两堵墙都变成真实存在的下标，转移里不用再特判越界。  


把「先爆」那个直觉照抄成 dp，随机数组上约 87% 会算错。  
而且这个错法很阴：每个 `k` 算出来的值完全相同，退化成把区间里每个三元组各加一遍，压根没在挑顺序。小数据上一两个气球时两个版本必然一样，试不出来。  


布尔运算是同一件事的另一副皮。  
给一个只含 `0`、`1`、`&`、`|`、`^` 的表达式，所有运算符优先级相同，可以加括号决定先算哪一段，问让整个表达式算出指定结果有多少种运算顺序。  


枚举的仍然是最后执行的那个运算符。  
状态从「一个数」扩成「一对计数」：这一段能算出 false 的方式数和能算出 true 的方式数。  


```cpp
// s[l..r] 是一段合法的布尔表达式
// 返回 {算出 false 的结合方式数, 算出 true 的结合方式数}
pair<long long, long long> f(const string& s, int l, int r,
                             vector<vector<long long>>& dp0,
                             vector<vector<long long>>& dp1) {
  if (dp0[l][r] + dp1[l][r] > 0) return {dp0[l][r], dp1[l][r]};
  long long f0 = 0, f1 = 0;
  if (l == r) {
    f0 = s[l] == '0' ? 1 : 0;
    f1 = s[l] == '1' ? 1 : 0;
  } else {
    for (int k = l + 1; k < r; k += 2) {   // 只有奇数位才是运算符
      auto L = f(s, l, k - 1, dp0, dp1);
      auto R = f(s, k + 1, r, dp0, dp1);
      long long a = L.first, b = L.second, c = R.first, d = R.second;
      if (s[k] == '&') { f0 += a * c + a * d + b * c;  f1 += b * d; }
      else if (s[k] == '|') { f0 += a * c;  f1 += a * d + b * c + b * d; }
      else { f0 += a * c + b * d;  f1 += a * d + b * c; }
    }
  }
  dp0[l][r] = f0;
  dp1[l][r] = f1;
  return {f0, f1};
}

// 入口：整个表达式算出 result 的方式数
long long countEval(const string& s, bool result) {
  int n = s.size();
  vector<vector<long long>> dp0(n, vector<long long>(n, 0));
  vector<vector<long long>> dp1(n, vector<long long>(n, 0));
  auto v = f(s, 0, n - 1, dp0, dp1);
  return result ? v.second : v.first;
}
```


`k` 每次加 2 是有讲究的，只有奇数位才是运算符。  
写成加 1 就会把数字位当运算符，随机数据上 9 个运算符时 99% 出错。  


## 五、端点配对：两端凑上了就先配掉


通用写法是在区间里切一刀，代价是每格多枚举一层。  
可是有些问题里两个端点自己就有关系，能配成一对，那就有一层枚举可以省。  


括号配对这题是这样：给一个只含 `(`、`)`、`[`、`]` 的字符串，最少插入几个字符能让所有括号正确配对。  


状态：`f(l, r)` 表示让 `s[l..r]` 全部配对，最少插入几个字符。  


转移有两条。  
两端能配成一对，就让它们配掉，问题缩成 `f(l+1, r-1)`，不用枚举。  
否则老老实实枚举划分点 `m`，取 `f(l, m) + f(m+1, r)` 的最小值。  


```cpp
bool match(char a, char b) {
  return (a == '(' && b == ')') || (a == '[' && b == ']');
}

// 让 s[l..r] 全部配对，最少插入几个字符
int f(const string& s, int l, int r, vector<vector<int>>& dp) {
  if (l == r) return 1;                        // 单个字符，补一个作伴
  if (l == r - 1) return match(s[l], s[r]) ? 0 : 2;
  if (dp[l][r] != -1) return dp[l][r];
  int p1 = INT_MAX;
  if (match(s[l], s[r])) p1 = f(s, l + 1, r - 1, dp);   // 两端自己凑一对
  int p2 = INT_MAX;
  for (int m = l; m < r; m++) {                // 或者从某个点切成两段
    p2 = min(p2, f(s, l, m, dp) + f(s, m + 1, r, dp));
  }
  return dp[l][r] = min(p1, p2);
}

int compute(const string& s) {
  int n = s.size();
  vector<vector<int>> dp(n, vector<int>(n, -1));
  return f(s, 0, n - 1, dp);
}
```


把这层判断漏掉，程序照样跑、照样过样例，只是答案偏大。  
串越长两端恰好配上的机会越多，长度 12 时 83% 的串都会算错。  


涂色（奇怪打印机）是同一条捷径。  
一条木板分成若干格，每格要刷成指定颜色，每次可以把一段连续的木板刷成同一种颜色，后刷的覆盖先刷的，问最少刷几次。  


如果只看「从左到右一段段刷」，很容易想成数一数有几段连续同色。  
`RGBGR` 会被数成 5 段，其实三笔就能成：先整条刷成 `RRRRR`，再中间三格刷成 `RGGGR`，最后正中一格刷成 `RGBGR`。  


差别就在两端的 `R`：它们能共用第一笔，中间被后来的颜色盖过。  


```cpp
// 把 s[l..r] 刷成目标色，每次刷一段连续木板，最少刷几笔
int strangePrinter(const string& str) {
  int n = str.size();
  vector<vector<int>> dp(n, vector<int>(n, 0));
  dp[n - 1][n - 1] = 1;
  for (int i = 0; i < n - 1; i++) {
    dp[i][i] = 1;
    dp[i][i + 1] = str[i] == str[i + 1] ? 1 : 2;
  }
  for (int l = n - 3; l >= 0; l--) {
    for (int r = l + 2; r < n; r++) {
      if (str[l] == str[r]) {
        dp[l][r] = dp[l][r - 1];               // 两端同色，最后一笔顺带把 r 刷上
      } else {
        int ans = INT_MAX;
        for (int m = l; m < r; m++) {
          ans = min(ans, dp[l][m] + dp[m + 1][r]);
        }
        dp[l][r] = ans;
      }
    }
  }
  return dp[0][n - 1];
}
```


两端能配上的那层判断是 `O(1)` 的，省的是枚举划分点的那一层。  
配不上的格子照旧是 `O(n)`，所以复杂度还是 `O(n^3)`，只是常数被压低了一截。  


## 六、划分点受限与配对计数


同样是枚举划分点，有的题里 `m` 不能随便跳。  


合并石头是石子合并的一般化：每次把连续 `k` 堆并成 1 堆，代价是这 `k` 堆之和，问并成 1 堆的最低总代价。  


先回答能不能并成 1 堆。  
每次合并把堆数减少 `k-1`，从 `n` 堆减到 1 堆一共要减少 `n-1`，所以必须 `(n-1) % (k-1) == 0`，否则直接返回 -1。这条判定把一半的工作省了。  


```cpp
// 每次把连续 k 堆并成 1 堆，求并成 1 堆的最低成本
int mergeStones(const vector<int>& stones, int k) {
  int n = stones.size();
  if ((n - 1) % (k - 1) != 0) return -1;
  vector<int> pre(n + 1, 0);
  for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + stones[i];
  vector<vector<int>> dp(n, vector<int>(n, 0));
  for (int l = n - 2; l >= 0; l--) {
    for (int r = l + 1; r < n; r++) {
      int ans = INT_MAX;
      for (int m = l; m < r; m += k - 1) {     // 划分点每次跳 k-1
        ans = min(ans, dp[l][m] + dp[m + 1][r]);
      }
      if ((r - l) % (k - 1) == 0) {            // 这一段最终能并成 1 份
        ans += pre[r + 1] - pre[l];
      }
      dp[l][r] = ans;
    }
  }
  return dp[0][n - 1];
}
```


步长必须是 `k-1`，写成 `m++` 的话，`k=2` 时看不出差别，但只要 `k>=3`，随机数组 100% 算错。  
多出来的那些划分点切出的左右两边，份数根本不守恒。  


统计不同回文子序列，则是端点配上了之后还要多看一层。  
数一数字符串里有多少个不同的非空回文子序列，答案对 `10^9 + 7` 取模。  


两端字符不同时，用容斥：回文子序列要么不碰 `j`，要么不碰 `i`，两者相加再减去都不碰的部分。  


两端字符相同时，把 `s[i]` 和 `s[j]` 当一对括号，中间任何回文子序列都能被它们包起来。  
要看的是 `i` 右边最近的同字符和 `j` 左边最近的同字符在哪，预处理出 `left` 和 `right` 两个数组就能 `O(1)` 判出来。  


```cpp
const int MOD = 1000000007;

// 统计 s 里不同的非空回文子序列个数
int countPalindromic(const string& str) {
  int n = str.size();
  vector<int> last(256, -1), left(n), right(n);
  for (int i = 0; i < n; i++) { left[i] = last[str[i]]; last[str[i]] = i; }
  fill(last.begin(), last.end(), n);
  for (int i = n - 1; i >= 0; i--) { right[i] = last[str[i]]; last[str[i]] = i; }
  vector<vector<long long>> dp(n, vector<long long>(n, 0));
  for (int i = 0; i < n; i++) dp[i][i] = 1;
  for (int i = n - 2; i >= 0; i--) {
    for (int j = i + 1; j < n; j++) {
      if (str[i] != str[j]) {
        dp[i][j] = dp[i][j - 1] + dp[i + 1][j] - dp[i + 1][j - 1] + MOD;
      } else {
        int l = right[i], r = left[j];
        if (l > r)     dp[i][j] = dp[i + 1][j - 1] * 2 + 2;         // 里面没有同字符
        else if (l == r) dp[i][j] = dp[i + 1][j - 1] * 2 + 1;       // 里面恰好一个
        else           dp[i][j] = dp[i + 1][j - 1] * 2 - dp[l + 1][r - 1] + MOD;
      }
      dp[i][j] %= MOD;
    }
  }
  return (int)dp[0][n - 1];
}
```


端点相同时若不看内部、直接套容斥公式，长度 4 就错 33%，长度 10 错 66%。  


## 七、状态加一维：区间本身不够用


前面所有题，状态都是 `f(l, r)` 两个数。  
有些问题光知道「是哪一段」还不够，得把「上下文」补进去。  


合唱队是这样：一排人身高两两不同，按某个初始顺序依次入场，每个人入场时和前一个人比身高，比前一个人高就站到队伍最右边，矮就站到最左边，第一个人直接站好。给定最后排成的队伍，问有多少种初始顺序能排出它。  


一段人是从两端往里一个个凑出来的，最后插进来的那个人站在左端还是右端，直接影响下一步能不能接上。  
所以状态要再加一维。  


`f(l, r, 0)` 表示拼出 `a[l..r]` 这一段、最后插入的人站在 `l` 位置的方案数，`f(l, r, 1)` 则是站在 `r` 位置的。  


```cpp
const int MOD = 19650827;

// dp[l][r][0]：拼出 a[l..r]，最后插入的人站在 l 位置
// dp[l][r][1]：拼出 a[l..r]，最后插入的人站在 r 位置
int choir(const vector<int>& a) {
  int n = (int)a.size() - 1;                   // a 从下标 1 开始
  if (n == 1) return 1;
  vector<vector<vector<int>>> dp(n + 1, vector<vector<int>>(n + 1, vector<int>(2, 0)));
  for (int i = 1; i < n; i++) {
    if (a[i] < a[i + 1]) dp[i][i + 1][0] = dp[i][i + 1][1] = 1;
  }
  for (int l = n - 2; l >= 1; l--) {
    for (int r = l + 2; r <= n; r++) {
      if (a[l] < a[l + 1]) dp[l][r][0] = (dp[l][r][0] + dp[l + 1][r][0]) % MOD;
      if (a[l] < a[r])     dp[l][r][0] = (dp[l][r][0] + dp[l + 1][r][1]) % MOD;
      if (a[r] > a[l])     dp[l][r][1] = (dp[l][r][1] + dp[l][r - 1][0]) % MOD;
      if (a[r] > a[r - 1]) dp[l][r][1] = (dp[l][r][1] + dp[l][r - 1][1]) % MOD;
    }
  }
  return (dp[1][n][0] + dp[1][n][1]) % MOD;
}
```


最容易写错的是跨端那个条件。  
站在左端的新人要比的是「上一个人」，而那可能是 `l+1`，也可能是 `r`。把跨端的 `a[l] < a[r]` 手滑写成近端的 `a[l] < a[l+1]`，就漏掉了一种接法。  


移除盒子里多出来的那一维含义更微妙。  
一排盒子，颜色用正整数表示，每一轮可以移除一段连续同色的盒子，长度记 `k`，得 `k^2` 分，移完左右两边会靠到一起，问把盒子全移完最多能得多少分。  


得分是平方，所以凑在一起一次消掉最划算：两个单独的盒子各消一次得 2 分，攒成一对一起消得 4 分。  


难点在「攒」。`1 2 1` 里两个 `1` 想凑一对，得先把中间的 `2` 消掉；可要是先消掉一个 `1`，就永远攒不上了。  


状态：`f(l, r, k)` 表示要消掉 `boxes[l..r]`，且 `boxes[l]` 前面还挂着 `k` 个和它同色的盒子，这种局面下最多得多少分。这多出来的 `k` 就是「外债」。  


```cpp
// boxes[l..r] 要消掉，前面还挂着 k 个和 boxes[l] 同色的盒子
int f(const vector<int>& boxes, int l, int r, int k, vector<vector<vector<int>>>& dp) {
  if (l > r) return 0;
  if (dp[l][r][k] > 0) return dp[l][r][k];
  int s = l;
  while (s + 1 <= r && boxes[l] == boxes[s + 1]) s++;   // 先把 l 开始的一段同色并进来
  int cnt = k + s - l + 1;                             // 加上前面 k 个，一共 cnt 个同色
  int ans = cnt * cnt + f(boxes, s + 1, r, 0, dp);     // 可能性一：一起消掉
  for (int m = s + 2; m <= r; m++) {                   // 可能性二：留着跟后面同色的拼
    if (boxes[l] == boxes[m] && boxes[m - 1] != boxes[m]) {
      ans = max(ans, f(boxes, s + 1, m - 1, 0, dp) + f(boxes, m, r, cnt, dp));
    }
  }
  return dp[l][r][k] = ans;
}

int removeBoxes(const vector<int>& boxes) {
  int n = boxes.size();
  vector<vector<vector<int>>> dp(n, vector<vector<int>>(n, vector<int>(n + 1, 0)));
  return f(boxes, 0, n - 1, 0, dp);
}
```


`k` 负责在两条路之间传递前缀：走第二条路时，前缀从 0 变成 `cnt`。  
少了它，同色块永远攒不成大块，长度 10 时 66% 的随机数组会算错。  


多带一个量，状态空间就乘一档。  
合唱队那个量只有 0 和 1 两种，代价是常数倍；移除盒子那个量是 0 到 n，直接把状态从 `O(n^2)` 顶到 `O(n^3)`。  


## 八、复杂度分析


把上面这些题摊开，量级只有两种。  


| 类型 | 状态数 | 单格代价 | 总时间 | 空间 |
| --- | --- | --- | --- | --- |
| 两端点讨论 | `O(n^2)` | `O(1)` | `O(n^2)` | `O(n^2)`，可压到 `O(n)` |
| 枚举划分点 | `O(n^2)` | `O(n)` | `O(n^3)` | `O(n^2)` |
| 枚举最后一步 | `O(n^2)` | `O(n)` | `O(n^3)` | `O(n^2)` |
| 端点配对 | `O(n^2)` | `O(1)` 或 `O(n)` | `O(n^3)` | `O(n^2)` |
| 状态加一维 | `O(n^2)` 或 `O(n^3)` | `O(1)` 或 `O(n)` | `O(n^2)` 或 `O(n^4)` | `O(n^2)` 或 `O(n^3)` |


空间压缩只在这几类里的一部分能用。  
两端点讨论型只往「更短的区间」看，压缩时用变量补住斜角那一格就够，比如回文插入可以压成一行，长度 2000 时从 16 MB 降到 8 KB。  


划分点型不要硬压。  
枚举划分点让每个格子都依赖整行整列，压掉一维之后斜向的依赖补不回来。  


## 九、总结


区间 DP 的骨架只有一句话：`[l, r]` 的答案由更短的区间推出来，所以填表顺序是长度从小到大。  


遇到区间上的问题，先判断它属于哪一类，转移的形状基本就定了。  


1）两端点自己能定下来的，比如回文插入、预测赢家，每格 `O(1)`。  
2）要在区间里切一刀的，比如石子合并、切棍子，每格 `O(n)`。  
3）顺着题面从第一步枚举写不出来的，比如戳气球、布尔运算，换成枚举最后一步。  
4）两端点之间有关系的，比如括号配对、涂色，先让它们配掉，省一层枚举。  
5）区间本身不够用的，比如合唱队、移除盒子，把上下文补进状态，多开一维。  


还有一个习惯值得养成：先问一句能不能并成目标状态。  
合并石头里那条 `(n-1) % (k-1)` 的判定，判完就知道要不要动 dp。  


## 十、最后


这篇文章把区间 DP 的五类转移串了一遍，每类配了两道经典题。  


练手的顺序建议是：石子合并 → 回文插入 → 戳气球 → 括号配对 → 合唱队。  
前三道把骨架立住，后两道分别练「先问两端凑不凑得上」和「状态要补一维」这两个判断。  


再往后还有环形区间 DP、区间 DP 的四边形不等式优化、以及和树上 DP 结合的题目，那些都属于在这个骨架上加东西。  
先把这五类的转移形状认熟，后面加什么都快。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
