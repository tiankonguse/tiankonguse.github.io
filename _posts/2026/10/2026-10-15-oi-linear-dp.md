---
layout: post  
title: OI 必学：线性 DP  
description: 线性 DP 的状态设计与六类常见转移  
keywords: 算法, 动态规划, DP, 线性DP, LIS, NOIP  
tags: [算法, 动态规划, DP, 线性DP]  
categories: [算法]  
updateDate: 2026-10-15 19:20:00  
published: false  
---


## 零、背景


线性 DP 是动态规划里最基础的一类，也是 NOIP 提高组里出现频率最高的一类。  
它的特点是状态只依赖一个下标，一般写成 `f(i)`。算 `f(i)` 的时候，只用到比 `i` 小的那些状态，所以从左到右算一遍就能得到答案。  


它能处理的数据量很大。状态 `O(n)` 个、每个状态算一次 `O(1)` 的题，`n` 到一百万也只要几毫秒；就算每个位置还要二分一次，`O(n log n)` 也能撑到十万的量级。  


下面把常见的线性 DP 题分成六类：给状态加限制、换个结构、一个量不够用、先算前后缀、先做转换、以及最长递增子序列的 `ends` 数组。  


## 一、递推，从左往右算


线性 DP 的状态一般写成 `f(i)`，计算它的时候只用到 `f(i-1)`、`f(i-2)` 这些已经算出来的值。  
所以代码上就是一层循环，从 `i = 1` 一直算到 `i = n-1`。  


```cpp
// 通用写法：i 从 1 走到 n-1，用到的状态下标都比 i 小
for (int i = 1; i < n; i++) {
  f[i] = ...;   // 只用到 f[i-1]、f[i-2] 这类更小的下标
}
```


定状态的时候要先回答一个问题：第 `i` 位是不是必须被选上。  


答案是「必须」时，`f(i)` 只记录那些选中了第 `i` 位的方案，常见的写法是「必须以 `i` 结尾」。  
好处是转移简单，不用再讨论「这一段在哪结束」。麻烦的是最优解不一定落在 `f(n-1)`，得把所有 `f(i)` 扫一遍取最大。  


答案是「不要求」时，`f(i)` 记录 `nums[0..i]` 这一段上能达到的最优值，最优方案可以在第 `i` 位收尾，也可以在更靠前的位置收尾。  
好处是答案就是 `f(n-1)`，不用再扫一遍。代价是转移时要自己把「选第 `i` 个」和「不选第 `i` 个」两种情况都写出来，漏一种结果就偏了。  


还有一件事跟上面这个是分开的：前面那些位置要按什么规矩选，必须连着、可以跳、还是有别的限制。  
最大子数组和是「必须以 `i` 结尾，而且必须连着」，`f(i)` 只能从 `f(i-1)` 接过来；最长递增子序列是「必须以 `i` 结尾，前面随便挑」，每个 `j < i` 都能接，所以要回头查一遍；打家劫舍是「不要求选中第 `i` 间，但相邻两间不能同时选」。  
这两个问题得分开回答，混在一起转移式就写乱了。  


两种定义还能互相换。定义里带「必须」的，只要再拿一个变量把扫描过程中见过的最大值记下来，就能当不带「必须」的用。最大子数组和里的 `ans`、翻转一次里的 `maxEnd`，都是这么一个变量。  


`f(i)` 一般只用到前面一两个值，所以可以用两个变量来回倒，不用开数组，空间是 `O(1)`。  
但有一种情况省不掉：后面要回头去查中间某个 `f(i)`。第六节的前后缀拼接就是这种，那时候整个数组都得留着。  


时间复杂度也不难算：一共 `O(n)` 个状态，每个算一次。每次是常数次比较，总时间就是 `O(n)`；每次还要二分一次，就是 `O(n log n)`。  


拿到一道新题，可以按下面几个问题依次问自己。  


1）能不能给状态加一个限制，让需要讨论的情况只剩一两条？  
2）转移时要用到的那个量，状态里记了没有？  
3）答案能不能分成左右两半？  
4）能不能先把它转换成一个等价的、做过的题？  


## 二、给状态加限制：必须以 i 结尾


先说最大子数组和。给一个整数数组，找一段连续元素让它们的和最大，这一段必须非空。  


`n = 100000` 时，子数组一共有 `n(n+1)/2 = 5000050000` 个，每个都从头加一遍，加法次数也是这个量级。  
换成动态规划跑同一个数组只要 `O(n)`，快了四个数量级，差别就在状态怎么定义。  


这里要给 dp 加一个限制：`dp[i]` 表示子数组必须以 `i` 位置的数做结尾，往左延伸多远都行，能拿到的最大累加和。  


加上这个限制后，以 `i` 结尾的子数组只有两种情况：一种是只有 `nums[i]` 一个数，另一种是「以 `i-1` 结尾的某个子数组」后面再接上 `nums[i]`。  
第二种情况里，前面那一段取到最大肯定不吃亏，所以转移式就一行。  


```cpp
// dp[i]：子数组必须以 i 位置的数做结尾，往左能延伸出来的最大累加和
int maxSubArray1(const vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> dp(n);
  dp[0] = nums[0];
  int ans = nums[0];
  for (int i = 1; i < n; i++) {
    dp[i] = max(nums[i], dp[i - 1] + nums[i]);
    ans = max(ans, dp[i]);
  }
  return ans;
}
```


算 `dp[i]` 时只用到 `dp[i-1]`，数组可以省掉，留两个变量就够。  


```cpp
// 空间压缩：dp[i] 只用得上 dp[i-1]
int maxSubArray2(const vector<int>& nums) {
  int n = (int)nums.size();
  int ans = nums[0];
  for (int i = 1, pre = nums[0]; i < n; i++) {
    pre = max(nums[i], pre + nums[i]);
    ans = max(ans, pre);
  }
  return ans;
}
```


有些题还要求返回这一段的开头和结尾。  
那就换一种算法：用 `pre` 记录「当前这一段 `[l, r]` 的累加和」，右端点 `r` 一直往右走，一旦发现「把前面吸收进来不划算」，就把开头挪到 `r` 自己。  


```cpp
// 附加问题：还要返回最大累加和子数组的开头 left、结尾 right
struct Seg { int left, right; long long sum; };
Seg extra(const vector<int>& nums) {
  int n = (int)nums.size();
  int left = 0, right = 0;
  long long sum = nums[0];
  int l = 0;
  long long pre = LLONG_MIN; // 保证第一轮一定走「换开头」
  for (int r = 0; r < n; r++) {
    if (pre >= 0) {
      pre += nums[r]; // 吸收前面的累加和有利可图，不换开头
    } else {
      pre = nums[r]; // 前面的累加和无利可图，从 r 重开
      l = r;
    }
    if (pre > sum) {
      sum = pre;
      left = l;
      right = r;
    }
  }
  return {left, right, sum};
}
```


换开头时的 `l = r` 这一行最容易漏。  
漏掉之后 `l` 永远停在 0，而随机样本里最优子数组不从 0 开始的能占到四成以上，这些样本全部会返回错误的左端点。  


判断条件写成 `pre >= 0` 还是 `pre > 0` 不影响累加和，只影响等于 0 的那段要不要挂在前面。  
`pre` 的初值取 `LLONG_MIN` 是有意的：它保证第一轮一定走「换开头」那条分支，让 `l` 落在 0，而且它从来不会被加进任何数里。  


这一节的三段代码，时间都是 `O(n)`，额外空间分别是 `O(n)`、`O(1)`、`O(1)`。  


## 三、换个结构：环形数组与子矩阵


上一节那个「以 `i` 结尾」的思路，放到另外两种结构上一样能用。  


把数组首尾接起来之后，答案可能绕过接口，多出一种情况。  
跨接口的那段子数组，剩下没选中的元素恰好也是一段连续区间：一段「不跨接口的最小子数组」。  


所以环形数组的答案，就是在下面两种里取大的那个。  


答案 = max(不跨接口的最大子数组, 全部元素之和 − 不跨接口的最小子数组)  


这两种情况一次循环就能同时算出来：维护 `maxpre` 和 `maxsum` 的同时，把同样的式子取 `min` 再跑一遍。  


```cpp
// 环形数组上的最大子数组累加和
long long maxSubarraySumCircular(const vector<int>& nums) {
  int n = (int)nums.size();
  long long all = nums[0], maxsum = nums[0], minsum = nums[0];
  long long maxpre = nums[0], minpre = nums[0];
  for (int i = 1; i < n; i++) {
    all += nums[i];
    maxpre = max((long long)nums[i], (long long)nums[i] + maxpre);
    maxsum = max(maxsum, maxpre);
    minpre = min((long long)nums[i], (long long)nums[i] + minpre);
    minsum = min(minsum, minpre);
  }
  // 环形答案 = max(不跨接口的最大子数组, all - 最小子数组)
  // all == minsum 说明整个数组都是最小子数组，减完剩空数组，此时只能取 maxsum
  return all == minsum ? maxsum : max(maxsum, all - minsum);
}
```


最后那行 `all == minsum` 的判断不能省。  
拿 `[-3, -2, -3]` 看：全部元素之和是 `-8`，最小子数组也是整个数组，`all - minsum = 0`，对应的是「一个元素都不选」。  
题面要求子数组非空，正确答案是 `-2`。整个数组自己就是最小子数组，当且仅当所有元素都拴在一条负链上，这种情况减完一定是空集。  


另一种结构是二维数组：选一个矩形区域，让里面所有数之和最大。  
暴力枚举上下左右四个边界是 `O(n^2 m^2)`，就算拿前缀和把每个矩形的求和降到 `O(1)`，矩形个数本身也还是这个量级。  


换个想法：先枚举矩形的上边界 `up` 和下边界 `down`。  
这两条边界之间夹着的若干行，可以按列求和压成一个一维数组 `nums`，`nums[j]` 就是 `up..down` 这些行在第 `j` 列的累加和。  
在这条压出来的数组上找「和最大的一段」，就是上一节那个带左右端点的附加问题。  


```cpp
// 子矩阵最大累加和：枚举行区间，把中间几行压成一行，套一维问题
struct Rect { int up, left, down, right; long long sum; };
Rect getMaxMatrix(const vector<vector<int>>& grid) {
  int n = (int)grid.size();
  int m = (int)grid[0].size();
  long long maxv = LLONG_MIN;
  int a = 0, b = 0, c = 0, d = 0;
  vector<long long> nums(m, 0);
  for (int up = 0; up < n; up++) {
    fill(nums.begin(), nums.end(), 0);   // 换 up 必须清零，否则上一组行的影响还在
    for (int down = up; down < n; down++) {
      int l = 0;
      long long pre = LLONG_MIN;
      for (int r = 0; r < m; r++) {
        nums[r] += grid[down][r];        // 先把新的一行加进去，再更新 pre
        if (pre >= 0) {
          pre += nums[r];
        } else {
          pre = nums[r];
          l = r;
        }
        if (pre > maxv) {
          maxv = pre;
          a = up; b = l; c = down; d = r;
        }
      }
    }
  }
  return {a, b, c, d, maxv};
}
```


把几行压成一维数组时，有两个地方要注意。  
换 `up` 时 `nums` 必须清零，漏掉清零的话上一组行的影响全留在里面，随机矩阵上大半的答案会直接错。  
还有一处顺序：先把 `nums[r]` 加上 `grid[down][r]`，再去更新 `pre`；反过来写的话，每一列用的都是「上一行加完」的旧值。  


算一下工作量：`n` 行方阵，`(up, down)` 的组合有 `n(n+1)/2` 个，每个组合扫一遍一维数组是 `O(n)`，加起来是 `O(n^3)`。  
直接枚举上下左右四个边界是 `O(n^4)`，省掉的正是枚举左右边界那一层。  


## 四、偷或不偷：不能选相邻元素


打家劫舍用的是不要求选中第 `i` 个的那种定义。从数组里挑一些数加起来，要求任何两个被选中的数在原数组里都不相邻。  
它和最大子数组正好相反：子数组必须连续，这里必须跳着选。  


走到第 `i` 间时只有两种选择。偷它，那么第 `i-1` 间必须空着，前面的最优解是 `dp[i-2]`；不偷它，最优解就是 `dp[i-1]`。  


`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`  


定义里 `dp[i]` 管的是 `nums[0..i]` 这一整段，最优解可以在任意位置收尾，所以答案就是 `dp[n-1]`，不用再扫一遍。  


```cpp
// nums 非负，不能选相邻数字，最大累加和
long long rob1(const vector<int>& nums) {
  int n = (int)nums.size();
  if (n == 1) return nums[0];
  if (n == 2) return max(nums[0], nums[1]);
  vector<long long> dp(n);
  dp[0] = nums[0];
  dp[1] = max(nums[0], nums[1]);
  for (int i = 2; i < n; i++) {
    dp[i] = max(dp[i - 1], max((long long)nums[i], dp[i - 2] + nums[i]));
  }
  return dp[n - 1];
}

// 空间压缩：只留 dp[i-2] 和 dp[i-1]
long long rob2(const vector<int>& nums) {
  int n = (int)nums.size();
  if (n == 1) return nums[0];
  if (n == 2) return max(nums[0], nums[1]);
  long long prepre = nums[0];
  long long pre = max(nums[0], nums[1]);
  for (int i = 2; i < n; i++) {
    long long cur = max(pre, max((long long)nums[i], prepre + nums[i]));
    prepre = pre;
    pre = cur;
  }
  return pre;
}
```


转移式里多了一层 `max(nums[i], ...)`。数据全是非负数时它不起作用，加上它是为了兼容数组里有负数的情况：那时候「前面都不偷、只偷第 `i` 间」可能是最优的。  


环形版本把首尾接起来之后，第 0 间和第 `n-1` 间不能同时偷。  
这恰好把问题劈成两个互斥的线性问题：偷第 0 间，那么第 1 间和第 `n-1` 间都得空着，中间剩下 `nums[2..n-2]`，按同样的规则做；不偷第 0 间，`nums[1..n-1]` 就是普通的线性问题。  


```cpp
// nums[l..r] 范围上，没有环形的概念
long long best(const vector<int>& nums, int l, int r) {
  if (l > r) return 0;
  if (l == r) return nums[l];
  if (l + 1 == r) return max(nums[l], nums[r]);
  long long prepre = nums[l];
  long long pre = max(nums[l], nums[l + 1]);
  for (int i = l + 2; i <= r; i++) {
    long long cur = max(pre, (long long)nums[i] + max(0LL, prepre));
    prepre = pre;
    pre = cur;
  }
  return pre;
}

// 环形：偷不偷第一间，拆成两个线性问题
long long robCircular(const vector<int>& nums) {
  int n = (int)nums.size();
  if (n == 1) return nums[0];
  return max(best(nums, 1, n - 1), (long long)nums[0] + best(nums, 2, n - 2));
}
```


这个拆分有两处容易写错。只算「不偷第 0 间」的那一半，随机样本里近四成答案偏小；偷了第 0 间却把右边界照抄成 `n-1`，忘了第 `n-1` 间已经和第 0 间相邻，出错率也是同一档。  


再看打家劫舍 IV：至少偷 `k` 间，单间金额不能超过「窃取能力」，问能力最小是多少。  
这一题求的是「能力值最小」，不是「钱数最大」，前面那个 dp 不能直接用。  


这里能用二分，是因为存在单调性：能力值越大，能偷的房子只会多、不会少。  
所以「能力值为 `x` 时能不能偷够 `k` 间」是随 `x` 单调变化的，可以二分答案。二分范围是数组里的最小值到最大值，值域 `10^9` 也只要 30 轮。  


二分的每一轮要判断「能力值为 `m` 时能不能偷够 `k` 间」。这个判断连 dp 都不用，贪心就行：从左往右扫，能偷就偷，偷完直接跳过下一间。  


```cpp
// 能力值为 ability 时，最多能偷多少间（房间数量，不是钱数）
int mostRobGreedy(const vector<int>& nums, int ability) {
  int ans = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] <= ability) {
      ans++;
      i++;           // 偷完下一间直接跳过去，漏掉这行就丢了「不能相邻」
    }
  }
  return ans;
}

// 二分答案：能力越大越容易偷够
int minCapability(const vector<int>& nums, int k) {
  int n = (int)nums.size();
  int l = nums[0], r = nums[0];
  for (int i = 1; i < n; i++) {
    l = min(l, nums[i]);
    r = max(r, nums[i]);
  }
  int ans = 0;
  while (l <= r) {
    int m = l + (r - l) / 2;
    if (mostRobGreedy(nums, m) >= k) {
      ans = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return ans;
}
```


贪心为什么是对的？一段连续可偷的房子长度为 `len` 时，最多能偷 `⌈len/2⌉` 间，而「能偷就偷、偷完跳一格」正好能拿满。  


二分那处判定写成 `>= k` 而不是 `> k`，写反的话绝大多数样本的答案会偏大。  


## 五、一个量不够：状态里多带一维


最大子数组累加和只要一个量：以 `i` 结尾的最大累加和。  
把加法换成乘法，负数会把最小的那个翻成最大的，一个量就不够用了。  


拿 `[-2, 3, -4]` 算一遍。只记「以 `i` 结尾的最大乘积」：`i=0` 是 `-2`，`i=1` 取 `max(3, -2×3)=3`，`i=2` 取 `max(-4, 3×(-4))=-4`，一路最大值是 3。  
正确答案是 24。`-2×3 = -6` 是这一段里最小的乘积，正好被下一个 `-4` 翻成了 24。只看最大值的写法把 `-6` 丢掉了，后面就翻不回来。  


所以每个位置记两个数：以 `i` 结尾的最大乘积 `mx` 和最小乘积 `mn`，三个候选一起取 min 和 max。  


```cpp
// 乘积最大子数组：mn 与 mx 必须成对推进
long long maxProduct(const vector<int>& nums) {
  int n = (int)nums.size();
  long long ans = nums[0], mn = nums[0], mx = nums[0];
  for (int i = 1; i < n; i++) {
    long long x = nums[i];
    long long curmin = min(x, min(mn * x, mx * x));
    long long curmax = max(x, max(mn * x, mx * x));
    mn = curmin;
    mx = curmax;
    ans = max(ans, mx);
  }
  return ans;
}
```


这里有两个地方要注意。  
`curmin` 和 `curmax` 要用同一轮旧的 `mn`、`mx` 算，不能先更新 `mn` 再算 `curmax`，这个坑和「滚动数组覆盖前先存下来」是同一类。  
中间结果可能超出 `int`，`[-1000, -1000, -1000, 2, 2]` 的答案只有四百万，但第 4 步要算 `-2×10^9×2`，已经装不进 `int`，所以全程用 `long long`。  


第二题换个问法。给定一个非负数组，随便挑数字组成子序列，要求挑出来的累加和是 7 的倍数，问这个累加和最大是多少。  


累加和能有多大没有上界，塞不进状态里。能塞进去的是它除以 7 的余数，只有 7 种取值。  


定义 `dp[i][j]`：在 `nums[0..i-1]` 里挑若干个（不要求连续），能做到「累加和 `% 7 == j`」时最大的那个累加和，做不到就记 `-1`。答案在 `dp[n][0]`。  


```cpp
// 子序列累加和必须被 7 整除时的最大累加和，nums 非负
long long maxSumDiv7(const vector<int>& nums) {
  int n = (int)nums.size();
  vector<long long> pre(7, -1), cur(7, -1);
  pre[0] = 0;
  for (int i = 1; i <= n; i++) {
    long long x = nums[i - 1];
    int c = (int)(x % 7);
    for (int j = 0; j < 7; j++) {
      cur[j] = pre[j];                              // 不选 nums[i-1]
      int need = c <= j ? (j - c) : (j - c + 7);    // 选它，前 i-1 个要先做出余数 need
      if (pre[need] != -1) {
        cur[j] = max(cur[j], pre[need] + x);
      }
    }
    pre = cur;
  }
  return pre[0];
}
```


`need` 这个减法是全题最容易写错的一处：加上 `c` 之后要凑出余数 `j`，那前面得先凑出余数 `need`。  


哨兵必须是 `-1`，不能图省事用 0。dp 里存的是最大累加和，0 是个合法值——什么都不选，余数 0、累加和 0。  
拿 0 当「做不到」会把空集和真答案混在一起，随机样本上会大面积算错。  


空间上第 `i` 行只读第 `i-1` 行，留两行就够，从 `O(7n)` 压到 `O(7)`。  


这两题说的是同一件事：状态里记录的信息不够决定后面怎么选时，就再补一个量进去。  
补的量如果是余数、正负性、奇偶这种取值很少的东西，时间复杂度基本不变。  


## 六、前后缀：两遍扫描加一次枚举


有一类题的答案可以分成左右两半，左右各自要一个「这一段上的最优值」，中间再枚举一个分界点拼起来。  
两遍扫描把 `prefix`、`suffix` 先算好，拼的时候就是 `O(1)` 一次加法。  


先说魔法卷轴。数组里可能有正、负、0，每个卷轴能把连续一段全变成 0，一共 2 个卷轴，用不用随意，要让数组整体累加和尽量大。  


卷轴最多用两个，所以答案只有三种情况：一个都不用（`p1`，就是数组总和）、整段上用一次（`p2`）、左右各用一次（`p3`）。  


`p2` 需要 `prefix` 数组：`prefix[i]` 是 `nums[0..i]` 上一定要用一次卷轴时，这段剩下的最大累加和。  
算 `prefix[i]` 时，要看卷轴有没有盖到第 `i` 位：盖到了，第 `i` 位被抹掉，前面留一段前缀，取历史里最大的那个前缀和；没盖到，第 `i` 位留下，接在 `prefix[i-1]` 后面。`suffix` 是把同一个递推从右往左再做一遍。  


```cpp
// 魔法卷轴：每个卷轴把连续一段全变成 0，一共 2 个，用不用随意
long long maxSumScroll(const vector<int>& nums) {
  int n = (int)nums.size();
  if (n == 0) return 0;
  long long p1 = 0;                       // 一个卷轴都不用
  for (int x : nums) p1 += x;
  vector<long long> prefix(n, 0), suffix(n, 0);
  long long sum = nums[0];
  long long maxPresum = max(0LL, (long long)nums[0]);
  for (int i = 1; i < n; i++) {
    prefix[i] = max(prefix[i - 1] + nums[i], maxPresum);
    sum += nums[i];
    maxPresum = max(maxPresum, sum);
  }
  long long p2 = prefix[n - 1];           // 整段上正好用 1 次
  sum = nums[n - 1];
  maxPresum = max(0LL, (long long)nums[n - 1]);
  for (int i = n - 2; i >= 0; i--) {
    suffix[i] = max((long long)nums[i] + suffix[i + 1], maxPresum);
    sum += nums[i];
    maxPresum = max(maxPresum, sum);
  }
  long long p3 = LLONG_MIN;               // 左右各用 1 次，枚举分界点
  for (int i = 1; i < n; i++) {
    p3 = max(p3, prefix[i - 1] + suffix[i]);
  }
  return max(p1, max(p2, p3));
}
```


递推第二项必须是历史最大的前缀和 `maxPresum`，写成当前前缀和 `sum` 就错了：卷轴可以在任意位置收尾，不是只能在 `i` 前面那一位。  


第二题的思路一样，只是 `prefix` 里存的不是值，而是位置。  
给一个非负数组和 `k`，找三个长度都是 `k`、互不重叠的子数组，让三个的和最大，有多个答案时返回字典序最小的起点数组。  


```cpp
// 三个长度 k、互不重叠的子数组，和最大，字典序最小的起点
vector<int> maxSumOfThreeSubarrays(const vector<int>& nums, int k) {
  int n = (int)nums.size();
  vector<long long> sums(n, 0);           // sums[i]：以 i 开头、长度 k 的子数组累加和
  {
    long long sum = 0;
    int l = 0;
    for (int r = 0; r < n; r++) {
      sum += nums[r];
      if (r - l + 1 == k) {
        sums[l] = sum;
        sum -= nums[l];
        l++;
      }
    }
  }
  vector<int> prefix(n, 0), suffix(n, 0); // 存的是「和最大的那个从哪开始」
  for (int l = 1, r = k; r < n; l++, r++) {
    prefix[r] = sums[l] > sums[prefix[r - 1]] ? l : prefix[r - 1];  // 同样大留靠左
  }
  suffix[n - k] = n - k;
  for (int l = n - k - 1; l >= 0; l--) {
    suffix[l] = sums[l] >= sums[suffix[l + 1]] ? l : suffix[l + 1]; // 同样大换过去
  }
  int a = 0, b = 0, c = 0;
  long long mx = -1;
  for (int i = k, j = 2 * k - 1; j < n - k; i++, j++) {   // 枚举中间那段的开头
    int p = prefix[i - 1], s = suffix[j + 1];
    long long cur = sums[p] + sums[i] + sums[s];
    if (cur > mx) {
      mx = cur;
      a = p; b = i; c = s;
    }
  }
  return {a, b, c};
}
```


字典序这个要求，全靠比较符号来区分。  
`prefix` 从左往右填，同样大时要留更靠左的，所以新值严格更大才换（`>`）；`suffix` 从右往左填，新位置本来就在左边，同样大就该换过去，用 `>=`。最后一轮挑答案也用 `>`，保证先遇到的组合不被后来的平手替换。  


这个差别细到官方样例就能抓：`[1, 2, 1, 2, 6, 7, 5, 1]`、`k = 2` 的正确答案是 `[0, 3, 5]`，`prefix` 用 `>=` 会得到 `[1, 3, 5]`，和一样大但字典序不是最小。  


两题的 `prefix` 都得整个留着，因为枚举分界点时要回头查 `prefix[i-1]` 和 `suffix[i]`，用两个变量来回倒的办法行不通，`O(n)` 的空间省不掉。  


## 七、先翻译再动手：翻转一次与删掉一个


两道题都是「先把数组动一下，再问最大累加和」。  
翻转一段看着要把 `n^2` 种翻法都试一遍，删掉一个数字看着要把 `n` 个删法配 `n` 个窗口。两个都有 `O(n)` 的做法。  


先说翻转。给定数组，随意选一段翻转（逆序），问翻转完之后整个数组的最大子数组累加和是多少。  


设翻转段是 `[l..r]`，翻转之后新数组长成「前缀 + 反过来的中段 + 后缀」。  
反过来的中段的最后一个数是原来的 `a[l]`，紧跟着它的是原来的 `a[r+1]`。所以一段跨过翻转边界的子数组，形如「中段里挑 `a[l..t]` 这一段」加上「从 `r+1` 开始的一段」。  


和跟顺序无关，两段各自取最大就行。那就枚举 `r` 从 0 到 `n-2`，答案的候选值就是「`0..r` 范围内的最大子数组」加上「从 `r+1` 开始的最大子数组」。  


```cpp
// 可以翻转 1 次的情况下，子数组最大累加和
long long maxSumReverse(const vector<int>& nums) {
  int n = (int)nums.size();
  vector<long long> start(n, 0);          // start[i]：所有必须以 i 开头的子数组里，最大累加和
  start[n - 1] = nums[n - 1];
  for (int i = n - 2; i >= 0; i--) {
    start[i] = max((long long)nums[i], (long long)nums[i] + start[i + 1]);
  }
  long long ans = start[0];
  long long end = nums[0];                // 必须以 i 结尾的最大累加和
  long long maxEnd = nums[0];             // 0..i 里出现过的最大的 end
  for (int i = 1; i < n; i++) {           // 枚举翻转段的右端点 r = i - 1
    ans = max(ans, maxEnd + start[i]);
    end = max((long long)nums[i], end + nums[i]);
    maxEnd = max(maxEnd, end);
  }
  ans = max(ans, maxEnd);                 // 最优解可能压根没跨过翻转边界
  return ans;
}
```


这里有两个常见笔误：循环结束后忘了再取一次 `max(ans, maxEnd)`，因为最优解可以不跨过翻转边界；把 `maxEnd` 写成当前 `end`，只记「必须以 `i` 结尾」而不记历史最大。  


第二题：给定数组和 `k`，必须删掉一个数字，问删完之后新数组里长度 `k` 的子数组最大累加和是多少。  


删掉一个再取 `k` 个，等价于在原数组里找一段连续的长度 `k+1` 的窗口，从里面去掉一个最小的数。  
反过来也成立：删掉下标 `d` 之后取到的那 `k` 个数，一定是某个长度 `k+1` 的窗口去掉 `d` 得到的。  


问题就变成枚举每个长度 `k+1` 的窗口，算「窗口和 − 窗口最小值」。窗口和是滑动窗口一次加法一次减法，窗口最小值交给单调队列。  


```cpp
// 删掉 1 个数字后，长度 k 的子数组最大累加和
long long maxSumDeleteOne(const vector<int>& nums, int k) {
  int n = (int)nums.size();
  if (n <= k) return 0;
  vector<int> window(n, 0);               // 单调队列，存下标，值单调递增
  int l = 0, r = 0;
  long long sum = 0, ans = LLONG_MIN;
  for (int i = 0; i < n; i++) {
    while (l < r && nums[window[r - 1]] >= nums[i]) r--;
    window[r++] = i;
    sum += nums[i];
    if (i >= k) {                         // 窗口 nums[i-k .. i] 一共 k+1 个数
      ans = max(ans, sum - nums[window[l]]);
      if (window[l] == i - k) l++;        // 队头滑出窗口才弹
      sum -= nums[i - k];
    }
  }
  return ans;
}
```


队列里存下标而不是值，是因为过期判定要比较位置：窗口左端划过 `i-k` 时，只有队头下标正好等于 `i-k` 才弹出。  
存值的话无从判断这个值还在不在窗口里。  


`i >= k` 这个条件对应窗口大小是 `k+1`。写成 `i >= k-1`，就变成只取 `k-1` 个数，一测就错。  


这两题的共同点是：先把它转换成一个等价的、更好算的形式，再动手。转换对了，剩下的就是做过的题；转换不对，再怎么折腾也没用。  


## 八、ends 数组：把「以谁结尾」换成「长度多少」


最长递增子序列。给一个数组，找出一个子序列（下标递增即可，不要求连续），让它的值严格递增，问最长能有多长。  


最直接的思路还是给 dp 加一个限制：`dp[i]` 表示子序列一定以 `nums[i]` 做结尾时，最长能有多长。转移就是把前面所有比它小的位置扫一遍。  


```cpp
// 朴素做法：dp[i] 表示「一定以 nums[i] 结尾」的最长递增子序列长度，O(n^2)
int lisN2(const vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> dp(n, 1);
  int ans = 0;
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
    }
    ans = max(ans, dp[i]);               // 答案是整张表的最大值，不是 dp[n-1]
  }
  return ans;
}
```


慢就慢在那个内层循环。实测（g++ -O2）`n = 100000` 时这版要跑 9634 毫秒，换记法之后同一个答案是 1.6 毫秒。  


慢的原因是重复计算。`dp[i]` 真正想知道的是「前面各个长度的递增子序列，结尾最小是多少」，可代码为了找它，把每个 `j` 都重新看了一遍。  
如果把这个信息单独记下来，查找的时候二分就行。  


换个记法：用 `ends[i]` 记录「长度为 `i+1` 的递增子序列，结尾最小能小到多少」。  


这么记有两个性质可以直接用。第一，`ends` 数组本身严格递增：长度更长的子序列，结尾不可能比长度更短的那个还小，否则把长序列砍掉尾上多出来的元素，就得到一个更短的序列且结尾更小，矛盾。第二，`ends[len-1]` 越小越好，因为它后面还能接的数更多。  


扫描到新数 `num` 时只做一件事：在 `ends` 里找第一个 `>= num` 的位置。找到了就把它顶掉，因为同样长度下 `num` 是更小的结尾；找不到说明 `num` 比所有结尾都大，长度可以加一。  


```cpp
// ends[0..len-1] 严格升序，找 >= num 的最左位置，不存在返回 -1
int bs1(const vector<int>& ends, int len, int num) {
  int l = 0, r = len - 1, m, ans = -1;
  while (l <= r) {
    m = (l + r) / 2;
    if (ends[m] >= num) {
      ans = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return ans;
}

// ends[i]：长度为 i+1 的递增子序列，结尾最小能小到多少。答案就是 len
int lengthOfLIS(const vector<int>& nums) {
  int n = (int)nums.size();
  vector<int> ends(n);
  int len = 0;
  for (int i = 0; i < n; i++) {
    int find = bs1(ends, len, nums[i]);
    if (find == -1) {
      ends[len++] = nums[i];             // 比所有结尾都大，长度 +1
    } else {
      ends[find] = nums[i];              // 顶掉第一个 >= 它的结尾
    }
  }
  return len;
}
```


严格递增和不下降只差一个等号。把二分里的 `>=` 换成 `>`，其余一行不动，就得到最长不下降子序列。  


```cpp
// ends[0..len-1] 不降序，找 > num 的最左位置，不存在返回 -1
int bs2(const vector<int>& ends, int len, int num) {
  int l = 0, r = len - 1, m, ans = -1;
  while (l <= r) {
    m = (l + r) / 2;
    if (ends[m] > num) {
      ans = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return ans;
}
```


道理不复杂：用 `>=` 时，等于 `num` 的结尾会被顶掉，相等的两个数凑不到一条序列里，得到的就是严格递增；用 `>` 时，相等的结尾留着，`num` 顶掉的是第一个比它大的，相等的两个数就能挨着放。  


这个等号是本题最容易写反的地方，而且写反了不一定测得出来。值域越小、重复值越多，两个写法的答案差得越多；值域一大，两个写法几乎总给出同一个答案，交上去也能过，等到有人造一组重复值就挂了。所以别靠测，把符号和题面对着看一遍。  


还有一点要注意：`ends` 数组里只有长度是对的，把它从头到尾读出来，往往并不是原数组的一个子序列。  


三个数就能看出问题。数组 `[2, 3, 1]`，`ends` 最后停在 `[1, 3]`：1 在下标 2，3 在下标 1，顺序是反的，原数组里根本不存在「先 1 后 3」这个子序列。  
长度 2 是对的，内容却是拼出来的。原因是 `ends` 的各个位置来自不同时刻的更新，它们之间没有「同一次扫描里被一起选中」这层关系。  


时间从 `O(n^2)` 降到 `O(n log n)`，空间还是 `O(n)`：`ends` 的有效长度就是答案，最坏情况（整个数组严格递增）它就是 `n`，得按 `n` 开。  


## 九、先排序再压成一维：信封与数对链


俄罗斯套娃信封和最长数对链，题面里都是二维的东西：一个信封有宽和高，一个数对有左端和右端。  
两道题的解法长得几乎一样，都是先排一次序，把二维压成一维，再跑上一节那个 `ends` 数组。  


信封 `[w, h]` 能装进 `[w', h']`，条件是 `w < w'` 且 `h < h'`，两个方向都得严格小。  


先看宽度这一维。把所有信封按宽度从小到大排，那么「能装」关系里宽度这一侧就自动满足了：排在后面的信封宽度不小于前面的。这样就只需要考虑高度这一侧了。  


等等，这里有个坑：宽度相等的两个信封，谁也装不进谁。可按宽度排序后它们挨在一起，如果高度恰好也是升序，最长递增子序列就会把它们算进同一条链，答案凭空多出来。  


办法是在排序时补一条：宽度升序，宽度相同时按高度降序排。  
同宽的几个信封高度倒着摆，高度序列在这一段上是下降的，严格递增子序列最多只能从中挑一个。宽度这一侧的约束被排序拿掉了，高度这一侧用倒序补回来。  


```cpp
// 俄罗斯套娃信封：宽度升序，同宽时高度降序，再对高度做最长递增子序列
int maxEnvelopes(vector<pair<int, int>> env) {
  sort(env.begin(), env.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.first != b.first ? a.first < b.first : a.second > b.second;
  });
  int n = (int)env.size();
  vector<int> ends(n);
  int len = 0;
  for (int i = 0; i < n; i++) {
    int find = bs1(ends, len, env[i].second);
    if (find == -1) {
      ends[len++] = env[i].second;
    } else {
      ends[find] = env[i].second;
    }
  }
  return len;
}
```


数对 `[a, b]` 后面能接 `[c, d]`，条件是 `b < c`，问最长能接多长。  


思路一样：先按左端点升序排，左端这一侧就自动满足了。但这次 `ends` 里存的东西不一样：`ends[i]` 记长度为 `i+1` 的数对链，结尾（链上最后一个数对的右端点）最小能小到多少。  


处理一个数对 `[l, r]` 时，在 `ends` 里找第一个 `>= l` 的位置。找不到，说明所有链的尾巴都小于 `l`，这个数对能接在任何一条链后面，长度加一；找到了下标 `find`，就用 `r` 去更新 `ends[find]`。  


```cpp
// 最长数对链：按左端点升序，ends 里存右端点
int findLongestChain(vector<pair<int, int>> pr) {
  sort(pr.begin(), pr.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.first < b.first;
  });
  int n = (int)pr.size();
  vector<int> ends(n);
  int len = 0;
  for (int i = 0; i < n; i++) {
    int find = bs1(ends, len, pr[i].first);   // 第一个结尾 >= 左端点的链
    if (find == -1) {
      ends[len++] = pr[i].second;
    } else {
      ends[find] = min(ends[find], pr[i].second);   // 这个 min 不能省
    }
  }
  return len;
}
```


那个 `min` 不能省。`ends[find]` 记录的旧尾巴可能比 `r` 大，也可能比 `r` 小，两边都出现过：新数对右端点很大时旧尾巴更小，右端点很小时新尾巴更小。随机对拍里去掉 `min` 的出错率超过一半。  


这题还有个更短的写法：按右端点升序排，然后从头到尾扫，能接就接。  


为什么是对的？按右端点升序扫，每次遇到的数对都是「当前右端点最小」的那个候选。能接上就接，接不上说明它的左端点不大于当前链尾，而它的右端点又不比当前链尾小，留着它不会比留着当前链尾更好。这就是区间调度的贪心。  


```cpp
// 更省事的写法：按右端点升序，能接就接
int findLongestChain2(vector<pair<int, int>> pr) {
  sort(pr.begin(), pr.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.second < b.second;
  });
  int pre = INT_MIN, ans = 0;
  for (auto& p : pr) {
    if (pre < p.first) {
      pre = p.second;
      ans++;
    }
  }
  return ans;
}
```


反过来按左端点排序再贪心是不对的，随机样本里三分之一的答案都错了。  


判断排序方式对不对有个简单的办法：想想「第一维相同的两个元素」会不会被算进同一条链。如果会，第二维就得倒着排。  


## 十、分组与前后缀：K 递增与一次修改机会


最后两道题表面上不是求最长递增子序列，得先转换一下，才能用上 `ends` 数组。  


第一道要先把数组按下标模 `k` 切开。数组 `arr` 被称为 K 递增，条件是每个 `i >= k` 都满足 `arr[i-k] <= arr[i]`。一次操作可以把任意一个位置改成任意正整数，问最少改几个。  


先看这个条件在说什么。它只把下标差恰好为 `k` 的两个位置绑在一起，所以整个数组可以按下标模 `k` 分成 `k` 组，组内互相有关，组间毫无关系。原问题就变成 `k` 个独立的小问题。  


某一组有 `size` 个数，要让它整体不下降，最少改几个？答案是 `size - 最长不下降子序列长度`。  


这个式子要从两方面说明。先看为什么改这么多次就够了：留下一条最长不下降子序列，其余那些位置每一个都改成「它前面留下来的那个数」。改完之后整组不下降，被改的位置又都等于前一个留下的数，改的次数正好是 `size` 减去留下来的个数。  


再看为什么少改不了：假设只改了 `m` 个位置，那么剩下 `size - m` 个位置原封不动，它们必须自己构成一条不下降子序列，所以 `size - m` 不会超过最长不下降子序列的长度，`m` 也就不会小于 `size` 减它。  


```cpp
// 使数组 K 递增：按下标模 k 分成 k 组，每组改掉「不在最长不下降子序列里」的数
int kIncreasing(const vector<int>& arr, int k) {
  int n = (int)arr.size();
  vector<int> nums(n), ends(n);
  int ans = 0;
  for (int i = 0; i < k; i++) {
    int size = 0;
    for (int j = i; j < n; j += k) nums[size++] = arr[j];
    int len = 0;
    for (int t = 0; t < size; t++) {
      int find = bs2(ends, len, nums[t]);   // 不下降，用 bs2
      if (find == -1) {
        ends[len++] = nums[t];
      } else {
        ends[find] = nums[t];
      }
    }
    ans += size - len;
  }
  return ans;
}
```


二分用的是 `>` 的那个版本，因为组内要的是不下降。写成 `>=` 就变成求严格递增，答案只会偏大。  


还有一点要注意：题目允许改成任意正整数，这个「任意」是上面那个式子成立的前提。要是只允许改成某个固定值，留下的序列和改出来的值之间还得再对齐，式子就不对了。  


第二道：长度 `n` 的数组 `arr`，给定 `k`，只允许一次把连续的 `k` 个数全改成同一个值（这次机会也可以不用），问最长不下降子序列最长能有多长。  


那 `k` 个连续的数被改成一个值 `v`，它们一定全都相等，所以这一段自己贡献 `k` 长度是稳的。剩下的问题在前缀和后缀怎么接上去：前缀要接到 `<= v` 的位置，后缀要从 `>= v` 的位置开始。  


后缀这部分可以先预处理出来。定义 `right[i]`：一定以 `arr[i]` 做开头时，`arr[i...]` 上最长不下降子序列有多长。  


怎么算？从右往左扫。倒着看的时候，「从 `arr[i]` 出发向右不下降」就变成了「从右往左走到 `arr[i]` 时不上升」，所以改用一个降序的 `ends` 数组，找第一个 `< num` 的位置。  


```cpp
// ends[0..len-1] 降序，找 < num 的最左位置，不存在返回 -1
int bsDesc(const vector<int>& ends, int len, int num) {
  int l = 0, r = len - 1, m, ans = -1;
  while (l <= r) {
    m = (l + r) / 2;
    if (ends[m] < num) {
      ans = m;
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return ans;
}

// right[i]：一定以 arr[i] 做开头时，arr[i...] 上最长不下降子序列的长度
vector<int> buildRight(const vector<int>& arr) {
  int n = (int)arr.size();
  vector<int> ends(n), right(n);
  int len = 0;
  for (int i = n - 1; i >= 0; i--) {
    int find = bsDesc(ends, len, arr[i]);
    if (find == -1) {
      ends[len++] = arr[i];
      right[i] = len;
    } else {
      ends[find] = arr[i];
      right[i] = find + 1;
    }
  }
  return right;
}
```


`right` 一算出来，剩下的就是从左到右枚举被改的那一段。  


被改的区间长度恒为 `k`，设它是 `[i, j-1]`，那么 `j = i + k`。扫描过程中 `ends` 维护的是前缀 `arr[0..i-1]` 上的最长不下降那一套东西。轮到某个 `j` 时，需要知道前缀里能接在 `<= v` 位置的最长长度，也就是 `ends` 里不超过 `v` 的格子有几个——`ends` 是不降序的，找第一个 `> v` 的位置，正是 `bs2` 干的事。  


`v` 取多少最好？前缀要求 `<= v`，后缀要求 `>= v`，`v` 取 `arr[j]` 恰好两边都不吃亏。所以这一轮的答案就是 `left + k + right[j]`。  


```cpp
// 枚举被改的区间 [i, j-1]，长度恒为 k，改成某个值 v
int compute(const vector<int>& arr, int k) {
  int n = (int)arr.size();
  if (k >= n) return n;                  // 整个数组都能改掉
  vector<int> right = buildRight(arr);
  vector<int> ends(n);
  int len = 0, ans = 0;
  for (int i = 0, j = k; j < n; i++, j++) {
    int find = bs2(ends, len, arr[j]);
    int left = find == -1 ? len : find;  // 前缀里 <= arr[j] 的最长长度
    ans = max(ans, left + k + right[j]);
    find = bs2(ends, len, arr[i]);       // 把 arr[i] 收进前缀
    if (find == -1) {
      ends[len++] = arr[i];
    } else {
      ends[find] = arr[i];
    }
  }
  ans = max(ans, len + k);               // 被改的那一段在最末尾
  return ans;
}
```


循环结束后那句 `ans = max(ans, len + k)` 不能漏。它对应的是「被改的那一段在数组最末尾」：此时没有后缀，前缀长度就是整个 `ends` 的有效长度。少了这一句，所有最优解落在尾部的数据都会答错。  


两道题的时间都是 `O(n log n)`，主导项是二分；空间 `O(n)`。`K` 递增只需要一个 `ends` 数组，一次修改机会要额外开一个 `right`。  


## 十一、最后


各题的时间空间汇总如下。  


| 问题 | 时间 | 额外空间 |
| --- | --- | --- |
| 最大子数组和（滚动变量） | `O(n)` | `O(1)` |
| 环形最大子数组 | `O(n)` | `O(1)` |
| 子矩阵最大累加和（n×n） | `O(n^3)` | `O(n)` |
| 打家劫舍（线性 / 环形） | `O(n)` | `O(1)` |
| 打家劫舍 IV（二分 + 贪心） | `O(n log V)` | `O(1)` |
| 乘积最大子数组 | `O(n)` | `O(1)` |
| 被 7 整除的最大子序列和 | `O(7n)` | `O(7)` |
| 魔法卷轴 / 三个无重叠子数组 | `O(n)` | `O(n)` |
| 翻转一次 / 删掉一个 | `O(n)` | `O(n)` |
| 最长递增子序列（ends + 二分） | `O(n log n)` | `O(n)` |
| 信封 / 数对链 | `O(n log n)` | `O(n)` |
| K 递增 / 一次修改机会 | `O(n log n)` | `O(n)` |


想练手的话，可以按这个顺序做：最大子数组和 → 打家劫舍 → 乘积最大子数组 → 魔法卷轴 → 最长递增子序列 → 信封问题。  
前三道练的是状态怎么定义，第四道练前后缀拼接，最后两道练「先排序再压成一维」。  


做题时可以记住这三个判断。  
第一，转移式写不出来时，试着给状态加一个限制条件，需要讨论的情况就少了。  
第二，转移要用到的信息状态里没记，就补一个量进去，余数、正负性这种取值很少的量补起来几乎不花时间。  
第三，遇到「先动一下数组、再问最优值」的题，先把它转换成等价的、好算的形式，别急着去枚举所有改法。  


再往后是背包、区间 DP、树形 DP，那些都是在这个基础上加维度，或者改变计算顺序。  
先把一维的情况练熟，后面学这些会快很多。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
