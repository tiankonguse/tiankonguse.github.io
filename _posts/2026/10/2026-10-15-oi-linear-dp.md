---
layout: post
title: OI 必学：线性 DP
description: OI 必学的动态规划
keywords: 算法, 算法比赛, NOIP, 动态规划, DP, 线性DP
tags: [算法, 算法比赛, NOIP, 动态规划, DP, 线性DP]
categories: [算法]
updateDate: 2026-10-16 00:03:00
published: false
---

## 零、背景

在 OI 比赛中，序列上的最优解问题几乎每场都会出现。  


动态规划是解决这类问题的核心工具，而线性 DP 是其中出现频率最高、也最基础的一类。  


之前在《[近 6 年 CSP-J/S 题型总结之动态规划](https://mp.weixin.qq.com/s/73dXl-dP2LcaYpd7j-0-wg)》里把动态规划分成了很多类，线性 DP 是几乎所有教材都会先讲的那一类。  


这篇文章基于几个经典问题，来学习与认识线性 DP。   


## 一、最大子数组和


先看最经典的问题：给一个整数数组，找出一段非空的连续元素，让它们的和最大。  


长度为 n 的数组，子数组个数是 `n (n + 1) / 2` 个。  
逐个枚举子数组再求和复杂度是 `O(n³)`。  



![](https://res2026.tiankonguse.com/images/2026/10/16/001.png)


对于连续子数组这类问题，需要给状态加一个限制。  
状态定义：`dp[i]` 表示子数组必须以 i 位置结尾，往左随意延伸，能拿到的最大累加和。  


加上这个限制之后，以 i 结尾的子数组只有两种形态：  
要么只有 `nums[i]` 一个数，  
要么是「以 `i - 1` 结尾的某个子数组」再接上 `nums[i]`。  


于是状态转移方程就一行：  


```cpp
dp[i] = max(nums[i], dp[i - 1] + nums[i])  
```


这里有个注意事项：答案不是 `dp[n - 1]`。  


`dp[n - 1]` 是以最后一个数结尾的那些子数组的最优值。  
所有子数组中，最优的一段可能停在中间任何位置。  
故答案要在所有 `dp[i]` 里取最大值。  


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


观察状态转移方程，计算 `dp[i]` 时，只依赖上个状态 `dp[i-1]`。  
故可以使用一个变量代替数组。  


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


第二个注意事项就就是 ans 的初始值是第一个状态，而不是 0。  
因为数据可能都是负数，此时最优值是最大的负数，而不是空数组 0。  


题目有时候还需要返回最优子数组的区间范围 `[l,r]`。  
这时候，就需要新增四个变量：两个答案变量 `[ansL,ansR]`，两个当前状态的变量`[curL,curR]`。  


首先更新当前状态。  


```cpp
if (pre >= 0) {
    pre += nums[i];
    curR = i;
} else {
    pre = nums[i];
    curL = curR = i;
}
```


然后更新答案。  


```cpp
if (pre > sum) {
    sum = pre;
    left = curL;
    right = curR;
}
```

  

## 二、环形数组


现在把问题转换一下，数组改成环形的，求一段非空的连续元素，让它们的和最大
  

下标 0 和 `n - 1` 连在一起之后，最优答案就多了一种情况：一段是原始数组的后缀，一段是原始数组的前缀，两个合起来和最大。
原始数组的和不变，答案最大了，剩余的元素和就最小。  
此时，剩余的元素恰好是一个连续的子数组。  


所以，对于环形数组的答案分两种情况：


1）没有跨越边界：最大子数组。  
2）跨越边界：全部元素和 减去 最小子数组。  


使用相同的方法分别求出最大子数组与最小子数组，即可求出环形子数组的答案。  


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
  // 环形答案 = max(最大子数组, all - 最小子数组)
  return all == minsum ? maxsum : max(maxsum, all - minsum);
}
```


这里也有一个注意事项：数组都是负数时，最小子数组就是整个数组。  
此时使用全部元素和减去最小子数组得到的是空数组。  



![](https://res2026.tiankonguse.com/images/2026/10/16/002.png)


## 三、二维矩阵  


接下来，把数组换成二维矩阵，选一个矩形区域，让里面所有数之和最大。  



暴力做法是枚举上下左右四个边界，复杂度为 `O(n²m²)`。  
就算拿前缀和把每个矩形的求和降到 `O(1)`，矩形个数本身也是` n²m²` 个。  


换个思路：先枚举矩形的上边界 up 和下边界 down。  
这两条边界之间夹着的若干行，可以按列求和得到一维数组 `nums[j]`。  
在这个一维数组上求「和最大的一段」，就转化为了最基本的最大子数组问题。  



```cpp
// 子矩阵最大累加和：枚举行区间，把中间几行压成一行
long long getMaxMatrix(const vector<vector<int>>& grid) {
  int n = (int)grid.size();
  int m = (int)grid[0].size();
  long long maxv = grid[0][0];
  vector<long long> nums(m, 0);
  for (int up = 0; up < n; up++) {
    fill(nums.begin(), nums.end(), 0);   // 换 up 必须清零，否则上一组行的影响还在
    for (int down = up; down < n; down++) {
      long long pre = LLONG_MIN;
      for (int r = 0; r < m; r++) {
        nums[r] += grid[down][r];        // 先把新的一行加进去，再更新 pre
        if (pre >= 0) {
          pre += nums[r];
        } else {
          pre = nums[r];
        }
        if (pre > maxv) {
          maxv = pre;
        }
      }
    }
  }
  return maxv;
}
```


这里有一个优化技巧。  
up 固定后，down 往下走时，复用了之前列的和。  
down 加一后，只需要往 `nums[j]` 上累加元素，即可计算每一列的元素和。  


![](https://res2026.tiankonguse.com/images/2026/10/16/003.png)


n 行的方阵，`(up, down)` 对有 `n (n + 1) / 2` 个，每一对做一次 `O(n)` 的一维扫描，复杂度合计 `O(n³)`。  


## 四、选与不选


前面都是连续子数组的问题。  
接下来看子序列的问题，即允许不连续。  


问题是从数组里挑一些数加起来，要求任何两个被选中的数在原数组里都不相邻，问最大能拿多少。  


状态定义：`dp[i]` 截止到位置 i，选择的数得到的最大和。  


对于位置 i，只有两种选择。  
选它，那么第 `i - 1` 间必须空着，前面的最优解是 `dp[i - 2]`；  
不选它，最优解就是 `dp[i - 1`]。  


故动态转移方程如下：  


```cpp
dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])  
```


此时，答案就是 `dp[n-1]`  


```cpp
// nums 非负，不能选相邻数字，最大累加和
long long rob2(const vector<long long>& nums) {
  int n = (int)nums.size();
  if (n == 1) return nums[0];
  if (n == 2) return max(nums[0], nums[1]);
  long long prepre = nums[0];
  long long pre = max(nums[0], nums[1]);
  for (int i = 2; i < n; i++) {
    long long cur = max(pre, max(nums[i], prepre + nums[i]));
    prepre = pre;
    pre = cur;
  }
  return pre;
}
```


---


问题转化一下，假设是环形数组。  
首尾相连之后，第 0 个位置和第 `n - 1` 个位置不能同时选，这恰好把问题拆成两个互斥的问题。  


先看选择第 0 个位置，第 1 个位置和第 `n-1` 个位置必须为空，中间剩下的 `nums[2..n-2]` 随便选，最后加上 `nums[0]`。
情况比较复杂。  


调整一个视角。  
分析不选择的情况，问题就简单多了。


不选择第 0 个位置，`nums[1..n-1]` 任意选择，变成普通的问题。  
不选择第 `n-1` 个位置，`nums[0..n-2]` 任意选择，变成普通的问题。  


两个答案取大的那个。  


```cpp
// nums[l..r] 范围上，没有环形的概念，返回不能选相邻数字时的最大累加和
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
  return max(best(nums, 1, n - 1), best(nums, 0, n - 2));
}
```


---


这道题还有一个复杂的变体：选择的元素值不能超过 V，问至少选 k 个不相邻的位置，V 最小是多少。  


最大和问题，转化为了最小满足要求的问题。  
求最值问题，当没有啥想法时，就需要去分析答案是否单调性，即是否可以使用二分。  


显然，V 越大，能选择的数字就越多，选择的不相邻的元素也会越多。  
故，可以二分答案 V。  


由于只关心选择的个数，相当于是一串 0 与 1，要求不能相邻。  
那显然可以直接贪心比较。  


```cpp
int mostRobGreedy(const vector<int>& nums, int V) {
  int k = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (nums[i] <= V) {
      k++;
      i++; // 选完第一个数字直接跳过一个数字
    }
  }
  return k;
}
``` 

二分的框架和常见写法一样，唯一要注意的是判断写成 >= k：  

```cpp
// 二分答案：能力越大越容易偷够
int minCapability(const vector<int>& nums, int k) {
  int n = (int)nums.size();
  int l = nums[0], r = nums[0];
  for (int i = 1; i < n; i++) {
    l = min(l, nums[i]);
    r = max(r, nums[i]);
  }
  int ans = 0;
  while (l <= r) { // [l,r]
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
  

## 五、乘积


最大子数组累加和只要一个状态：以 i 结尾的最大累加和。  
把加法换成乘法，问题就变复杂了。  


例如对于这个case: `[-2, 3, -4]`。  
还是用原先的状态转移方程来做，如下  


```cpp
dp[0] =  -2
dp[1] = max(3, -2 × 3) = 3
dp[2] = max(-4, 3 × (-4)) = -4
```

三个位置中最大值是 3。 
而正确答案实际是 24。  

`-2 × 3 = -6` 是这一段里最小的乘积，正好被下一个 `-4` 翻成了 24。    


故，这里需要维护两个状态：以 i 结尾的最大乘积 mx 与最小乘积 mn。  


`nums[i]` 是负数时，最大乘积为 `mn * nums[i]`；  
是正数时，最大乘积为 `mx * nums[i]`；  
是 0 时两个都归零。  


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


注意事项：curmin 和 curmax 要用同一轮旧的 mn、mx 算，不能先更新 mn 再算 curmax。  
这个和滚动数组是同一类问题，需要想清楚依赖的是更新前的值还是更新后的值。  


## 六、余数


问题：给定一个非负数组，随便挑数字组成子序列（不要求连续），要求挑出来的累加和是 7 的倍数，问这个累加和最大是多少。  


累加和会很大没有上界，塞不进状态里，能塞进去的是它除以 7 的余数，只有 7 种取值。  


定义 `dp[i][j]`：在 `nums[0..i-1]` 上随便选，能做到`累加和 % 7 == j`时，最大的那个累加和是多少；做不到就记 -1。  


答案在 `dp[n][0]`。  


转移时当前数要选或不选。  
不选，直接继承 `dp[i - 1][j]`；  
选它，记 `cur = nums[i - 1] % 7`，那前 `i - 1` 个数得先做出余数 need，满足 `(need + cur) % 7 == j`。  


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


need 这个减法是全题唯一的机关，写反成 `(cur - j + 7) % 7` 就错了。  


哨兵必须是 -1，不能图省事用 0。  
dp 里存的是最大累加和，0 是个合法值：什么都不选，余数 0、累加和 0。  
拿 0 当「做不到」会把空集和真答案混在一起。  


空间上第 i 行只读第 `i - 1` 行，留两行就够。  
完整表要开 n 行 × 7 列，滚动版只留两行 14 个数。  


## 七、两个卷轴与三个子数组


有一类题的答案天然分成左右两半，两半各要一个「这一段上做某件事的最优值」，中间再枚举一个划分点拼起来。  


两遍扫描把 prefix、suffix 先算好，拼的时候就是 `O(1)` 一次加法。  


第一题叫魔法卷轴。  


数组里可能有正、负、0，每个卷轴能把连续一段全变成 0，一共 2 个卷轴，用不用随意，要让数组整体累加和尽量大。  


卷轴最多用两个，所以答案只有三种形态：一个都不用，就是数组总和；整段上用一次；左右各用一次，取三者最大。  


后两种都需要 prefix 数组。  
`prefix[i]` 是 `nums[0..i]` 上一定要用一次卷轴时，这段剩下的最大累加和。  


填它时看卷轴有没有盖到第 i 位。  
盖到了，第 i 位被抹掉，前面留一段前缀，取历史里最大的那个前缀和；  
没盖到，第 i 位留下，接在 `prefix[i - 1]` 后面。  


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


两个高频笔误：递推第二项写成当前前缀和 sum 而不是历史最大 maxPresum；压根不算第三种形态，只用一次卷轴。  


暴力参考是枚举两个卷轴的起止位置，复杂度 `O(n³)`；正式方法是 `O(n)`。  


第二题是三个无重叠子数组。  


给一个非负数组和 k，找三个长度都是 k、互不重叠的子数组，让三个的和最大，有多个答案时返回字典序最小的起点数组。  


第一步用滑动窗口算出 `sums[i]`：以 i 开头、长度 k 的子数组的累加和。  


这套 prefix 和 suffix 里存的东西换了一种。  
魔法卷轴存的是最优值，这题存的是最优值从哪个位置开头。  


最后枚举中间那段的开头 i，左边取 `prefix[i - 1]`、右边取 `suffix[i + k]`，三段和取最大。  


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


字典序那一档全在比较符号上。  


prefix 从左往右填，同样大时要留更靠左的，所以新值严格更大才换，用 `>`；  
suffix 从右往左填，新位置本来就在左边，同样大就该换过去，用 `>=`。  


最后一轮挑答案也用 `>`，保证先遇到的组合不被后来的平手替换。  


这个错细到官方样例就能抓：LeetCode 样例 [1, 2, 1, 2, 6, 7, 5, 1]、`k = 2` 的正确答案是 [0, 3, 5]，prefix 用 `>=` 会得到 [1, 3, 5]，和一样大但字典序不是最小。  


两题都要 `O(n)` 的数组，因为划分点枚举时要随机访问 `prefix[i - 1]` 与 `suffix[i]`，滚不动。  


## 八、翻转一次与删掉一个


这一节两道题都是「先把数组动一下，再问最大累加和」，两个都有 `O(n)` 的做法，关键都是先做翻译再动手。  


第一题：随意选一段翻转（逆序），翻转完之后整个数组的最大子数组累加和是多少。  


翻转一段看着要把 `n²` 种翻法都试一遍，但翻转只改变相邻关系。  
设翻转段是 `[l..r]`，翻完之后的最后一个数是原来的 `a[l]`，紧跟着它的是原来的 `a[r + 1]`。  


所以一段跨过翻转边界的子数组，形如「`0..r` 里的最大子数组」加上「从 `r + 1` 开始的最大子数组」，和跟顺序无关，两段各自取最大就行。  


于是枚举右端点 r，前一半是扫描过程中「到目前为止所有以某处结尾的子数组的最大值」，后一半要预先从右往左算好。  


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


`start[i]` 从右往左填：`start[i] = max(nums[i], nums[i] + start[i + 1])`，和最大子段和的递推是同一个式子，只是方向反过来。  


两个高频笔误：循环结束后忘了再取一次 `max(ans, maxEnd)`，最优解可能压根没跨过翻转边界；把 maxEnd 写成当前 end。  


暴力参考是枚举全部 `n (n + 1) / 2` 种翻转再各跑一次最大子段和，复杂度 `O(n³)`；正式方法是 `O(n)`。  


第二题：给定数组和 k，必须删掉一个数字，问删完之后新数组里长度 k 的子数组最大累加和是多少。  


删掉一个再取 k 个，等价于：在原数组里找一段连续的长度 `k + 1` 的窗口，从里面去掉一个最小的数。  


于是问题变成：枚举每个长度 `k + 1` 的窗口，算「窗口和 - 窗口最小值」，取最大。  


窗口和是滑动窗口一次加法一次减法；窗口最小值用单调队列，队列里存下标、对应的值单调递增，队头就是当前窗口的最小值。  


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


队列里存下标而不是值，是因为过期判定要比较位置：窗口左端划过 `i - k` 时，只有队头下标正好等于 `i - k` 才弹出，存值的话无从判断这个值还在不在窗口里。  


窗口大小写成 k（等价于只取 `k - 1` 个数）会直接错；队列存值不判过期，窗口滑过最小值时也会错。  


每个窗口重扫一遍求最小值是 `O(k)`，单调队列把这一步压成摊还 `O(1)`，窗口越宽优势越大。  


## 九、最长递增子序列


前面的问题状态都长在「以 i 结尾」上，这一节换一个记法：按长度记。  


问题是从数组里找一个子序列（下标递增即可，不要求连续），让它的值严格递增，问最长能有多长。  


最朴素的动态规划是 `O(n²)`，换个记法之后同一个答案变成 `O(n log n)`。  
两个做法算的是同一个东西，差别只在「中间记录下来什么」。  


最直接的思路还是给 dp 加限制。  
`dp[i]` 表示子序列一定以 `nums[i]` 做结尾时，最长能有多长，转移就是把前面所有比它小的位置扫一遍。  


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


答案是整张 dp 表的最大值，不是 `dp[n - 1]`，最长那条的结尾可以停在任何位置。  


代价全在那个内层循环上：每个 i 都要回头看 i 个 j，总比较次数是 `n (n - 1) / 2`。  


慢在哪？可以发现，`dp[i]` 只关心「前面各种长度的递增子序列，结尾最小是多少」这一件事，可代码却把每个 j 都重新问了一遍。  


把这些答案单独记下来，就能二分。  


`ends[i]` 记的是：长度为 `i + 1` 的递增子序列，它的结尾最小能小到多少。  


这个定义有两个立刻能用的性质：ends 数组本身严格递增；`ends[len - 1]` 越小越好，因为它后面还能接的数更多。  


扫描到新数 num 时只做一件事：在 ends 里找第一个 `>= num` 的位置。  
找到了就把它顶掉，因为同样长度下 num 是更小的结尾；  
找不到，说明 num 比所有结尾都大，长度可以加一。  


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


每次扫描一个 num 只花 `log₂(len)` 次比较。  


把题面换成「最长不下降子序列」，也就是允许相等，整套东西一行都不用改，只把二分里的比较符号从 `>=` 换成 `>`。  


道理很直接：用 `>=` 时，等于 num 的结尾会被顶掉，相等的两个数凑不到一条序列里，得到的就是严格递增；用 `>` 时，相等的结尾留着，num 顶掉的是第一个比它大的，相等的两个数就能挨着放。  


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


这个等号是本题最容易写反的地方，而且写反了不一定能被测出来。  
数据值域一大，两个写法几乎总给出同一个答案，交上去也能过，等到有人造一组重复值就挂了。  
所以别靠测，把符号和题面对着看一遍。  


这里还有个细节，很多人学完就顺手当结论用错了：ends 数组只有长度是对的，把它从头到尾读出来，往往并不是原数组的一个子序列。  


反例小到三个数就够：数组 [2, 3, 1]，ends 最后停在 [1, 3]。  
1 在下标 2，3 在下标 1，顺序是反的，原数组里根本不存在「先 1 后 3」这个子序列。  


长度 2 是对的（最长的确是 2），内容却是拼出来的，因为 ends 的各个位置来自不同时刻的更新，它们之间没有「同一次扫描里被一起选中」这层关系。  


题目只要长度，那就够用；真要把那条子序列打印出来，得另外记前驱。  


## 十、信封与数对链


俄罗斯套娃信封和最长数对链，题面里都是二维的东西，解法长得几乎一样：先排一次序，把二维压成一维，再跑上一节那个 ends 数组。  


真正要想清楚的只有两件事：按什么排，以及 ends 里存什么。  


先看信封。  


信封 `[w, h]` 能装进 `[w', h']`，条件是 `w < w' 且 h < h'`，两个方向都得严格小，不允许旋转。  


先看宽度这一维：把所有信封按宽度从小到大排，那么「能装」关系里宽度这一侧就自动满足了，问题只剩高度这一侧，在高度序列上找最长严格递增子序列就行。  


等等，这里有个坑：宽度相等的两个信封，谁也装不进谁。  
可按宽度排序后它们挨在一起，如果高度恰好也是升序，最长递增子序列就会把它们串成一条，答案凭空多出来。  


处理办法只有一行：排序时宽度升序，宽度一样时按高度降序排。  
同宽的几个信封高度倒着摆，高度序列在这一段上是下降的，严格递增子序列最多只能从中挑一个。  


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


这个坑写反了不一定能发现。  
值域一大，宽度撞车的机会就小，写反也能过，等到出一组宽高都小的数据就露馅。  


数对链：数对 `[a, b]` 后面能接 `[c, d]`，条件是 `b < c`，问最长能接多长。  


思路和信封一样，先按左端点升序排，左端这一侧就自动满足了。  


但这次 ends 里存的东西不一样：`ends[i]` 记长度为 `i + 1` 的数对链，结尾（也就是链上最后一个数对的右端点）最小能小到多少。  
链尾越小，后面能接的数对越多。  


处理一个数对 `[l, r]` 时，在 ends 里找第一个 `>= l` 的位置：  
找不到，说明所有链的尾巴都小于 l，这个数对能接在任何一条链后面，长度加一；  
找到了下标 f，说明有一条长度为 f 的链尾巴小于 l，可以接上这个数对，得到一条长度为 `f + 1`、结尾是 r 的链，原来 `ends[f]` 记的那个尾巴要和 r 取小。  


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


那个 min 不能省：`ends[f]` 记录的旧尾巴可能比 r 大，也可能比 r 小，两边都出现过。  


数对链其实还有个更短的写法：按右端点升序排，然后从头到尾扫，能接就接。  


为什么是对的？按右端点升序扫，每次遇到的数对都是「当前右端点最小」的那个候选：能接上就接，接不上说明它的左端点不大于当前链尾，而它的右端点又不比当前链尾小，留着它不会比留着当前链尾更好。  


这就是区间调度的贪心。  


```cpp
// 更省事的写法：按右端点升序，能接就接（活动选择的贪心）
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


差的那点时间是排序的比较函数不同带来的，复杂度同阶，写哪个都行。  


倒过来想：按左端点排序再贪心是错的。  


做这类题时先问一句「排序之后，相等的那部分会不会被串起来」，多数 bug 就躲在这一句里。  


## 十一、K 递增与一次修改机会


最后两道题都不是直接问最长递增子序列，ends 数组还是那个 ends 数组，只是用在了另外两个切面上：一个是分组，一个是前后缀。  


第一题：数组 arr 被称为 K 递增，条件是每个 `i >= k` 都满足 `arr[i - k] <= arr[i]`，一次操作可以把任意一个位置改成任意正整数，问最少改几个。  


这个条件只把下标差恰好为 k 的两个位置绑在一起，于是整个数组按下标模 k 分成 k 组，组内互相关，组间毫无关系。  


原问题就变成 k 个独立的小问题：每组各自要变成不下降的，把各组的最少修改次数加起来就行。  


某一组有 size 个数，要让它整体不下降，最少改几个？答案是 size - 最长不下降子序列长度。  


这个式子两头都要说清楚。  


先说为什么够：留下一条最长不下降子序列，其余那些位置每一个都改成「它前面留下来的那个数」，改完之后整组不下降，改的次数正好是 size 减去留下来的个数。  


再说为什么少不了：假设只改了 m 个位置，剩下 `size - m` 个位置原封不动，它们必须自己构成一条不下降子序列，所以 `size - m` 不会超过最长不下降子序列的长度。  


注意题目允许改成任意正整数，这个「任意」是上式成立的前提：要是只允许改成某个固定值，留下的序列和改出来的值之间还得再对齐，式子就不对了。  


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


组内要的是不下降，二分用 `>` 的那个版本（bs2），写成 `>=` 的 bs1 就变成求严格递增，答案只会偏大。  


第二题：长度 n 的数组，给定 k，只允许一次把连续的 k 个数全改成同一个值（这次机会也可以不用），问最长不下降子序列最长能有多长。  


那 k 个连续的数被改成一个值 v，它们一定全都相等，所以这一段自己贡献 k 长度是稳的。  


剩下的问题在前缀和后缀怎么接上去：前缀要接到 `<= v` 的位置，后缀要从 `>= v` 的位置开始。  


后缀这部分可以先预处理出来。  
定义：`right[j]` 为「一定以 `arr[j]` 做开头时，`arr[j...]` 上最长不下降子序列有多长」。  


怎么算？从右往左扫。  


倒着看的时候，「从 `arr[j]` 出发向右不下降」就变成了「从右往左走到 `arr[j]` 时不上升」，于是用一个降序的 ends 数组，找第一个 `< num` 的位置。  


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


right 数组一算出来，答案就是枚举被改的那一段。  


被改的区间长度恒为 k，设它是 `[i, j - 1]`，那么 `j = i + k`，随着 i 从 0 开始右移，j 也跟着右移。  


扫描过程中 ends 维护的是「前缀 `arr[0...i-1]` 上的最长不下降」那一套东西，轮到某个 j 时，需要知道前缀里能接在 `<= v` 位置的最长长度，也就是 ends 里不超过 v 的格子有几个。  


ends 是不降序的，找第一个 `> v` 的位置 find，答案段长度就是 find（`find = -1` 时是 len），这正是 bs2 干的事。  


v 取多少最好？v 取 `arr[j]` 恰好两边都不吃亏：前缀那边能用的格子数只增不减，后缀那边 `right[j]` 本身就是「以 `arr[j]` 开头」的长度。  


于是这一轮的答案就是 `left + k + right[j]`。  


```cpp
// 枚举被改的区间 [i, j-1]，长度恒为 k，改成某个值 v
// 前缀取到 <= v 的最长不下降，后缀从 arr[j] 起，v 取 arr[j] 最优
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


循环结束后还要补一句 `ans = max(ans, len + k)`。  
它对应「被改的那一段在数组最末尾」：此时没有后缀，前缀长度就是整个 ends 的有效长度 len。  
少了这一句，所有最优解落在尾部的数据都会答错。  


另外 `k >= n` 时整个数组都能改掉，直接返回 n。  


## 十二、最后


回顾整条主线：线性 DP 的第一步永远是状态怎么定义。  


最大子数组和靠「必须以 i 结尾」把转移压成一行；环形和子矩阵是换一个容器，把新问题翻译回这张表；选与不选是两条分支，环形版再把首尾冲突拆成两个线性问题。  


乘积和余数都是「一个量不够」：乘法里 mn、mx 必须成对推进，余数只有 7 种取值，塞进状态里当第二维，代价几乎白送。  


两个卷轴和三子数组是前后缀预处理，两遍扫描加一次枚举；翻转和删一先做翻译再动手，把 `n²` 种改法翻译成一次扫描。  


LIS 换记法之后，ends 数组加二分把 `O(n²)` 压到 `O(n log n)`；信封和数对链先排序把二维压成一维；K 递增和一次修改机会再把 ends 用在分组和前后缀上。  


这几类的坑大多长一个样：写反等号、漏掉 min、忘清零、队列存值不判过期……下次遇到同类题，直接对照着查一遍。  


以后写线性 DP，遇到新题先问三句：状态里记什么才够决策？要不要换一个容器？能不能先排序或先翻译？  


后面会继续分享其他类型的动态规划，再结合具体题目看这些套路的组合用法。  

《完》  

-EOF-  

本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
