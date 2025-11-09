---
layout: post
title: leetcode 周赛 475 - 环形动态规划
description: 最值截断法、单调队列、单调压缩     
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-11-09 12:13:00
published: true
---

## 零、背景


这次比赛最后一题卡住不少人，我卡在了第 1273 / 1274 个测试用例。  
我想到了最坏情况的数据样例，但是没去写代码，想通过剪枝水过去，结果到比赛结束都没过。  
赛后老老实实去处理最坏样例，啪的一下就过了。  
进入前 10 名的机会就这样没了。  


A: 哈希+前后缀预处理
B: 哈希+前后缀预处理  
C: 网格动态规划  
D: 环形动态规划      


排名：63  
代码地址： <https://github.com/tiankonguse/leetcode-solutions>  


## 一、三个相等元素之间的最小距离 I  


题意：给一个数组，找出三个相等元素之间的最小距离和。
距离和定义为：`d(i,j,k) = |i-j| + |j-k| + |k-i|`，其中 i,j,k 为三个相等元素的递增下标。  


思想：哈希+前后缀预处理  


显然，由于 `i < j < k`，距离公式可以展开为 `d(i,j,k) = (j-i) + (k-j) + (k-i) = 2 * (k-i)`。
可以推导出，`d(i,j,k) = 2 * |k-i|`。  


答案是求最小值，如果中间的 `j` 确定了，那么 `i` 和 `k` 一定是离 `j` 最近的两个相等元素。  
所以我们可以使用哈希表，预处理出每个元素之前最后一次出现的下标和之后第一次出现的下标。  


```cpp
vector<int> preLastIndex(n + 2, -1);
unordered_map<int, int> lastIndex;
for (int i = 1; i <= n; i++) {
  int num = nums[i - 1];
  if (lastIndex.count(num)) {
    preLastIndex[i] = lastIndex[num];
  }
  lastIndex[num] = i;
}
```

最后遍历数组，计算每个元素作为中间元素时的距离和，取最小值即可。    
 

```cpp
for (int i = 1; i <= n; i++) {
  if (preLastIndex[i] != -1 && suffFirstIndex[i] != -1) {
    ans = min(ans, (suffFirstIndex[i] - preLastIndex[i]) * 2);
  }
}
```


## 二、三个相等元素之间的最小距离 II 

与第一题一样。  


## 三、网格中得分最大的路径  


题意：给一个网格，每个格子有一个分数和代价，从左上角走到右下角，求代价不超过 k 时的最大得分路径。  


思路：网格动态规划  


状态定义：`dp[i][j][k]` 表示走到 `(i,j)` 位置时，代价不超过 `k` 的最大得分。  
状态转移：  


```cpp
cost = grid[i][j] > 0 ? 1 : 0
dp[i][j][k] = max(dp[i-1][j][k-cost], dp[i][j-1][k-cost]) + score[i][j]
```


时间复杂度：`O(m * n * K)`  


## 四、循环划分的最大得分  


题意：给一个数组，可以循环划分最多 K 段，每段的得分为该段最大值与最小值的差，求最大得分和。  


思路：环形动态规划  


环形问题首先需要断开环，变成线性问题。  


算法1：枚举断开点+区间DP    


最简单的枚举断开点 `i`，转化为区间DP `dp(i,j,k)` 问题。  
状态定义：`dp(i,j,k)` 表示在区间 `[i,j]` 上划分 `k` 段的最大得分和。  
状态转移：   


```text
dp(i,j,k) = max_{i<=m<j} (dp(i,m,k-1) + max(arr[m+1..j]) - min(arr[m+1..j]))
```


复杂度 `O(n^4 * K)`，会超时。  


算法2：枚举断开点+线性DP      


先不考虑环形，假设是一个数组，我们的DP状态肯定不会定义为 `dp(i,j,k)`。  
而会定义为 `dp(i,k)`，表示在前 `i` 个元素上划分 `k` 段的最大得分和。  


状态转移：  


```text
dp(i,k) = max_{0<=m<i} (dp(m,k-1) + max(arr[m+1..i]) - min(arr[m+1..i]))
```  

所以，枚举断开点后，我们可以得到一个新的线性数组，然后对其使用线性DP求解。  
复杂度 `O(n^3 * K)`，会超时。  


算法3：基于最大值断开    


考虑最大值 maxVal 所在的段，这一段的最大值肯定是 maxVal，不妨假设最小值是 minVal。  
如果最小值在 maxVal 的左侧，那 maxVal 的右侧就没有任何贡献，不需要加入这一段。  
最小值在右侧也是一样的道理。  


所以，可以基于最大值断开，分两种情况来计算即可。  
复杂度 `O(n^2 * K)`。  
测试结果：1252 / 1274 个通过的测试用例  


```cpp
ll Dfs(int p, int k) {
  if (p < 0 || k <= 0) return 0;
  ll& ret = dp[p][k];
  if (ret != -1) return ret;
  ret = 0;
  ll maxVal = nums2[p];
  ll minVal = nums2[p];
  for (int j = p; j >= 0; j--) {
    minVal = min(minVal, nums2[j]);
    maxVal = max(maxVal, nums2[j]);
    ret = max(ret, Dfs(j - 1, k - 1) + maxVal - minVal);
  }
  return ret;
}
```


算法4：选与不选问题    


其实，每个位置并不需要一直向前枚举所有位置。  
如果当前位置不是最大值或者最小值，那么它对当前段的得分没有任何贡献，可以直接跳过。  


所以，可以把状态转化为不选与选为最值问题。  


状态定义：`dp(i,k)` 表示在前 `i` 个元素上划分 `k` 段的最大得分和。  
状态转移：  


```cpp
dp(i,k) = max(
  dp(i-1,k), // 不选当前位置
  max_{0<=m<i} (dp(m,k-1) + arr[i] - min(arr[m+1..i-1])), // 选当前位置作为最大值
  max_{0<=m<i} (dp(m,k-1) + max(arr[m+1..i-1]) - arr[i])  // 选当前位置作为最小值
)
```

由于把当前位置当做最值，所以只要不满足最值条件的位置就可以跳过。  
复杂度 `O(n^2 * K)`。  
测试结果：1257 / 1274 个通过的测试用例  


```cpp
// 关键参考代码
ret = Dfs(p - 1, k);  // 不选当前点
// 当前位置当做最大值
ll minVal = nums2[p];
for (int j = p - 1; j >= 0; j--) {
  if (nums2[j] >= nums2[p]) {
    break;
  }
  minVal = min(minVal, nums2[j]);
  ret = max(ret, Dfs(j - 1, k - 1) + nums2[p] - minVal);
}
```


算法5：单调性优化  


考虑 `dp(i,k)` 选当前位置作为最大值的情况：  
前面小于当前位置的值很多，比如 a 和 b 都是前面满足要求的下标，但是向前是升序，如 `a < b && arr[a]>arr[b]`。  
`arr[i]-arr[b]` 显然大于 `arr[i]-arr[a]`， 而子问题 `dp(b-1,k-1)` 也是显然大于 `dp(a-1,k-1)` 的。  
所以 `a` 不会比 `b` 更优，可以直接处理丢弃。  


基于这个单调性，可以使用单调栈预处理出所有满足条件的位置。  
测试结果：1273 / 1274 个通过的测试用例  


```cpp
ll Dfs(int p, int k) {
  if (p < 0 || k <= 0) return 0;
  ll& ret = dp[p][k];
  if (ret != -1) return ret;
  ret = Dfs(p - 1, k);  // 不选当前点
  // 选最大值栈
  for (auto& [val, preIndex] : maxOrderStack[p]) {
    ret = max(ret, Dfs(preIndex - 1, k - 1) + val);
  }
  // 选最小值栈
  for (auto& [val, preIndex] : minOrderStack[p]) {
    ret = max(ret, Dfs(preIndex - 1, k - 1) + val);
  }
  return ret;
}
```


算法6：单调性压缩  


如果序列是波动的，单调性能够过滤掉掉不少位置。  
但是如果序列本身就是单调的，单调性优化就没有任何作用。  


但是反过来思考，如果一个区间是单调的，那这个区间中间的点都不会作为最值被选中，或者说当做最值选中后，不是最优的。  


由于递增与递减是等价的，所以这里只讨论递增的情况。  
假设区间 `a,b,...,c,d` 是递增的，那么 `arr[a] < arr[b] < arr[c] < arr[d]`。  
此时显然只划分一个区间时最优的，就是选择 `arr[d] - arr[a]`。  
划分更多的区间不可能得到更有的结果。  


接着向前考虑一位，即存在 `a-1`，且 `arr[a-1]` 的值很大，远远大于大于 `arr[a]`。  
这时候，如果要在 `a ~ d` 之间选择一个最小值，那么 `arr[a]` 一定是最优的。  
即 `a ~ d` 如果要从左边端开，显然只会端开线段 `a ~ b`。  


同理，后面如果要端开，也只会断开 `c ~ d`。  


左边右边都端开，a 与左边的去运算，d 与右边的去运算，中间的肯定都不会端开，结果是 `c-b`。  


所以，如果一个递增区间长度超过 4 个，就可以进行压缩，保留最前面两个和最后两个元素。  


```cpp
void CheckAndFix() {
  int m = nums1.size();
  if (m < 5) return;
  // 预期：连续 5 个递增或递减，则删除最中间的一个
  bool inc = true;
  bool dec = true;
  for (int i = m - 5; i < m - 1; i++) {
    if (nums1[i] >= nums1[i + 1]) {
      inc = false;
    }
    if (nums1[i] <= nums1[i + 1]) {
      dec = false;
    }
  }
  if (inc) {
    nums1.erase(nums1.begin() + m - 3);
  }
  if (dec) {
    nums1.erase(nums1.begin() + m - 3);
  }
}
```


单调性压缩后，不加单调性栈，测试结果是 1253 / 1274 个通过的测试用例。  
单调压缩结合单调栈，就全部通过测试样例了。  


算法7：原题股票卖空  


之前的双周赛出过一道题，是 3573. 买卖股票的最佳时机 V。  
去掉环之后，其实就是这道题。  


状态定义：`dp(i,k,s)` 表示在前 `i` 个元素上最多划分 `k` 段，处于状态 S 时的最大得分和。  
状态S 三种：当前未持有、当前处于买入状态、当前处于卖出状态。  


状态转移：  


```text
dp(i,k,0) = max(dp(i-1,k,0), dp(i-1,k,1) - arr[i], dp(i-1,k,2) + arr[i]) // 未持有
dp(i,k,1) = max(dp(i-1,k,1), dp(i-1,k-1,0) + arr[i])          // 买入
dp(i,k,2) = max(dp(i-1,k,2), dp(i-1,k-1,1) - arr[i]) // 卖空
```

复杂度： `O(n * K)`  


```cpp
ll Dfs(int p, int k, int mode) {
  if (p < 0 || k <= 0) {
    if (mode != EMPTY) {
      return INT64_MIN / 2;  // 无效状态
    }
    return 0;
  }
  ll& ret = dp[p][k][mode];
  if (ret != INT64_MIN) return ret;
  if (mode == EMPTY) {
    ret = Dfs(p - 1, k, EMPTY);                          // 不选当前点
    ret = max(ret, Dfs(p - 1, k, BUY) - nums2[p]);   // 之前是买入，现在需要卖出
    ret = max(ret, Dfs(p - 1, k, SELL) + nums2[p]);  // 之前是卖出，现在需要买入
  } else if (mode == BUY) {
    ret = Dfs(p - 1, k, BUY);                             // 不选当前点，继续买入
    ret = max(ret, Dfs(p - 1, k - 1, EMPTY) + nums2[p]);  // 之前是空闲，现在买入
  } else {
    ret = Dfs(p - 1, k, SELL);                            // 不选当前点，继续卖出
    ret = max(ret, Dfs(p - 1, k - 1, EMPTY) - nums2[p]);  // 之前是空闲，现在卖出
  }
  return ret;
}
```


## 五、总结  

这次比赛最后一题确实比较难，环形动态规划本身就不太好处理。  
加上最值截断法就是普通线性规划问题了。  


不过再之后，我想到的状态转移方程依旧是 `O(n)` 转移的，所以一直在想建议优化。  
单调队列优化叠加单调压缩技巧就可以把这道题水过去了。  


不过再实现单调压缩之前，我在想另外一个剪枝优化：即存在 `/\/` 形状的特征时，也是可以直接停止向前枚举的。   
但实际这个剪枝浪费了我很多时间，导致比赛的时候一直没去实现单调压缩。  


当然，根本原因是没有想到 `O(1)` 的状态转移方程。  
即新增一个状态，代表当前是否有买卖股票，从而把 `O(n)`的转移降低为 `O(1)`。  


还是那句话，多练习多总结吧。  
 


《完》

-EOF-

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
