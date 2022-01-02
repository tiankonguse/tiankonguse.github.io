---   
layout:     post  
title: leetcode 第 240 场算法比赛  
description: 四道题，背后涉及 11个不同的算法，可以学到不少知识点。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-05-09 21:30:00  
published: true  
---  


## 零、背景  

这次五一调休加班，本来我以为是周日加班的。  
没想到是周六加班，周日休息。  
这样周日就可以正常的打比赛了。  


但是，最近有不少事情要处理，这就导致周日不能完整的打比赛了。  
做了几道题之后，就忙其他事情去了。  


赛后看下题，发现这次比赛的题难度还可以，都可以当做面试题来考察大家。  
建议大家把四道题都学习一下。  


## 一、人口最多的年份  


题意：给出每个人的出生年份与死亡年份。  
问人口最多的年份。  


思路：很容易想到，最优方法是左区间加一、右区间减一，扫描一遍即可。  
但是怎么储存与扫描是一个问题，需要去思考的。  


方法1、区间排序。  


起初我打算对区间排序，发现没啥用，左区间有序了，右区间还是乱序的，无法进一步处理。  


方法2、区间转数组。  


后来，我发现区间的数据量不大，就决定定义一个完整区间的数组，然后左边界加一、有边界减一。  
时间复杂度：`O(n)`  
空间复杂度：`O(V)`，V 是完整区间的大小。  


方法3、区间离散化。  


假设区间很大，区间转数组就面临存不下区间的问题。  
思考题：这时候又该如何做呢？  


由于区间个数只有 n 个，那区间边界顶多就是 `2n` 个。  
对区间边界进行离散化，就可以转化为数组了。  


方法4、区间转边界点，排序。  


方法1 对区间排序无法解决这道题的本质原因是，二维数据无法在一维上比大小。  


所以我们把二维数据转化为一维，再排序即可。  
一个区间`[l, r]` 拆分为两个点 `[l, +1]` 与 `[r, -1]`。  
然后排序扫描一遍即可。  


当然，喜欢 `map`的我当然直接使用 map 来代替排序了。  


```
int maximumPopulation(vector<vector<int>>& logs) {
  map<int, int> m;
  for (auto& v : logs) {
    m[v[0]]++;
    m[v[1]]--;
  }

  int maxYear = 0, maxNum = 0, sum = 0;
  for (auto& p : m) {
    sum += p.second;
    if (sum > maxNum) {
      maxNum = sum;
      maxYear = p.first;
    }
  }

  return maxYear;
}
```


## 二、下标对中的最大距离  


题意：给两个递减数组，分别取一个数字，假设下标是`(i, j)`，如果满足`i<=j` 且 `nums1[i]<=nums2[j]`，则认为存在有效距离，值为 `j-i`。  
求最大的有效距离，如果不存在，输出 0。  



思路：  

首先理解题意，递减数组代表是降序数组，当然，可能存在相等的值。  


方法1、二分查找。  


由于数组已经有序了，很容易想到枚举每个`j`，二分查找找到最远的 `i`，然后求最大值即可。  
复杂度：`n log(n)`  


方法2：双指针。  


由于两个数组都是降序。  
如果`nums1[i]<=nums2[j]`，那么可以确定对于所有的 `0<=k<=j`，都存在`nums1[i]<=nums2[k]`。  
因为 `nums2` 越靠前面的数字越大。  


反过来，假设一个`j`，已经得到最远的 `i`。  
那么对于`j+1`，最远的`i`只会更大，即在范围 `[i, j)` 内。  


利用这个性质，我们就可以使用双指针线性复杂度做这道题了。  
复杂度：`O(n)`  


```
int maxDistance(vector<int>& nums1, vector<int>& nums2) {
  int l = 0, r = 0;
  int n = nums1.size(), m = nums2.size();

  int ans = 0;
  for (r = 0; r < m; r++) {
    while (l < n && l <= r && nums1[l] > nums2[r]) {
      l++;
    }

    if (l == n) continue;
    ans = max(ans, r - l);
  }
  return ans;
}
```


## 三、子数组最小乘积的最大值  


题意：给一个数组，有很多子数组。  
对于一个子数组，最小值与数组和的乘积称之为最小乘积。  
所有子数组里面，求值最大的最小乘积。  


思路：  


方法1：暴力计算。  


枚举所有的子数组，并计算出最小乘积，最后取最优值。  
复杂度：`O(n^3)`  


优化：枚举过程中，就可以顺便计算出最小值和数组和。  
复杂度：`O(n^2)`  



方法2：二分查找下的线段树  


分析所有的子数组，发现很多子数组明显没有其他子数组更优。  


比如两个子数组有交集，最小值相等，那么两个子数组的并集的最小值不变，但是数组和可以更大。  


根据这个特征，可以依次枚举每个下标元素是最小值，然后往两边寻找最远的距离，使得这个区间内的最小值就是枚举值。  


那怎么找到一个位置两边最远的都不小于当前值的边界呢？  


比如左边界，就是求枚举值左边最后一个值小于枚举值的位置。  
而对于右边界，则是求枚举值右边，第一个值小于枚举值的位置。  


面对这个问题，很容易想到使用二分查找加区间最值来解决。  
区间最值一般使用线段树实现，用于快速得到一个区间的最小值。  
二分查找用于快速找到最大的区间`[l, r]`，且这个区间的最小值都不小于枚举值。  


对于区间和，则使用线段树可以顺便求出来。  


复杂度：`O(n log(n) * log(n))`  


```
int maxSumMinProduct(vector<int>& nums) {
  n = nums.size();
  maxNM = n;

  memset(lineSegTree.str, 0, sizeof(int) * (n * 2 + 1));
  for (int i = 1; i <= n; i++) {
    lineSegTree.str[i] = nums[i - 1];
  }

  lineSegTree.bulid(1, n);

  ll ans = 0;

  for (int i = 1; i <= n; i++) {
    int v = nums[i - 1];
    int l = FindLeft(i, v);
    int r = FindRight(i, v);
    ll sum = lineSegTree.querySum(l, r, 1, n);
    ans = max(ans, sum * v);
  }

  return ans % mod;
}
```


方法3：预处理左右边界，线段树求区间和  


上面求最边界和右边界的时候，使用二分查找+区间最值解决的。  
分析一下，发现利用单调性预处理，使用 `O(n)`的复杂度得到所有边界。  


所以，我们可以预处理左右边界，然后使用线段树求区间和得到答案。  
复杂度：`O(n log(n))`  


方法4：预处理左右边界和区间和  


我们使用线段树的初衷是为了求左右边界，区间和只是顺便复用线段树而已。  
现在左右边界预处理了，那区间和也可以预处理，这样就不需要线段树了。  


复杂度：`O(n)`

```
int maxSumMinProduct(vector<int>& nums) {
  n = nums.size();

  InitLeft(nums);
  InitRight(nums);
  InitSum(nums);

  ll ans = 0;

  for (int i = 1; i <= n; i++) {
    int v = nums[i - 1];
    int l = leftPos[i];
    int r = rightPos[i];
    ll sum = sumPos[r] - sumPos[l - 1];
    ans = max(ans, sum * v);
  }

  return ans % mod;
}
```


## 四、有向图中最大颜色值  


题意：给一个有向有环图，每个节点有一个颜色。  
随便找一个路径，会有多个颜色在这个路径上，颜色最多的个数称为路径的颜色值。  
问所有路径中，最大的颜色值是多少。  
如果有环，直接输出 `-1`。  


思路：首先是判断是否有环。  


如果是树，直接 DFS 即可判断。  
对于拓扑图，需要通过删入度为0的点来判断是否有环。  
如果最后删完后，删除的顶点等于图的顶点，代表没有环。  


```
// 复杂度：O(m)
bool CheckOk() {
  stack<int> sta;
  for (auto v : zeroInDegNodes) {
    sta.push(v);
  }

  int delNodeNum = 0;

  // 找到入度为0 的边，依次删除
  while (!sta.empty()) {
    int from = sta.top();
    sta.pop();
    delNodeNum++;

    for (auto to : nextNodes[from]) {
      inDegs[to]--;
      if (inDegs[to] == 0) {
        sta.push(to);
      }
    }
  }

  return delNodeNum == n;
}
```

假设没有环了，接下来就是寻找一个算法来求最优答案了。  


考虑到颜色全部是小写字母，那只有 26 个，突破口显然是枚举所有颜色，分别寻找最优答案。  


```
int Dfs(int from, char c) {
  if (cache[from] != -1) return cache[from];

  int ans = 0;
  for (auto to : nextNodes[from]) {
    ans = max(ans, Dfs(to, c));
  }
  if (colors[from] == c) {
    ans++;
  }
  return cache[from] = ans;
}
int largestPathValue(string& colors_, vector<vector<int>>& edges) {
  colors.swap(colors_);

  Init(edges);

  if (!CheckOk()) {
    return -1;  // 有环
  }

  int ans = 0;
  for (char c = 'a'; c <= 'z'; c++) {
    cache.clear();
    cache.resize(n, -1);
    for (int from : zeroInDegNodes) {
      ans = max(ans, Dfs(from, c));
    }
  }
  return ans;
}
```


优化：实际上不需要枚举 26 个字母，只需要枚举图中出现的字母即可。  



## 五、最后  



这次比赛的题比较好。  


四道题，背后涉及 11个不同的算法，可以学到不少知识点。  


你还有其他解决思路吗？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

