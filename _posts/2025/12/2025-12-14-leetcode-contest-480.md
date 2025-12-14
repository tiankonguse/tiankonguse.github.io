---
layout: post
title: leetcode 周赛 480 - 高级线段树
description: 高级线段树，建议大家都学习一下
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-12-13 12:13:00
published: true
---

## 零、背景


这次比赛最后一题是经典的高级线段树，整体难度不算高，本篇主要记录四道题的解题思路。  


A: 排序  
B: 模拟  
C: 贪心  
D: 高级线段树  


**最终排名**：95  
**代码仓库**：<https://github.com/tiankonguse/leetcode-solutions>  


## 一、最大和最小 K 个元素的绝对差


题意：给一个数组，问最大 K 个数之和与最小 K 个数之和的绝对差。  


思路：排序，然后枚举最大和最小的 K 个数，求和，求差。  


```cpp
sort(nums.begin(), nums.end());
int ans = 0;
for (int i = 0; i < k; i++) {
  ans += nums[n - 1 - i] - nums[i];
}
```


## 二、反转元音数相同的单词


题意：给一个字符串，空格分隔单词。对于后续的单词，如果元音字母个数与第一个单词相同，则反转。  


思路：模拟  


思路1：首先字符串分割为单词列表，然后遍历单词列表，统计元音字母个数，如果与第一个单词相同，则反转。  


思路2：通过左右指针边分割单词，边在原地翻转。  


```cpp
int firstCnt = 0;
int vowelCnt = 0;
int l = 0;
for (int r = 0; r < n; r++) {
  if (s[r] == ' ') {
    if (l == 0) {
      firstCnt = vowelCnt;  // 记录第一个单词的元音数量
    } else {
      if (firstCnt == vowelCnt) {
        reverse(s.begin() + l, s.begin() + r);
      }
    }
    l = r + 1;
    vowelCnt = 0;
  } else {
    if (h.count(s[r])) vowelCnt++;
  }
}
if (firstCnt == vowelCnt) {
  reverse(s.begin() + l, s.end());
}
```

## 三、使循环数组余额非负的最少移动次数


题意：给一个循环数组，每次可以对相邻元素操作一次，其中一个元素加一，一个元素减一。  
问最少多少次操作可以使数组余额非负。  
限制：最多只有一个元素为负。  


思路：贪心  


如果元素和为负，显然没有答案。  


如果所有元素都为非负，那么显然不需要操作，答案就是 0。  


当有一个位置为负时，以该位置为起点，向两边扩散，把路径上的值移动到当前位置，直到当前位置为 0。  
移动的操作次数等于值乘以距离。  


注意事项1：数组是循环的，左右指针可能越界，越界后需要修正后取值。  
注意事项2：最后一次操作，不需要把对应位置的所有值都移动到当前位置，剩多少就移动多少，即取最小值。  
注意事项3：值乘以距离时，使用 int64，避免 int32 越界。  


```cpp
ll ans = 0;
int leftNum = -balance[pos];
for (int r = 1; leftNum > 0; r++) {
  int L = (pos - r + n) % n;
  int R = (pos + r) % n;
  ans += min(leftNum, balance[L]) * ll(r);
  leftNum -= min(leftNum, balance[L]);
  ans += min(leftNum, balance[R]) * ll(r);
  leftNum -= min(leftNum, balance[R]);
}
return ans;
```

## 四、使子字符串变交替的最少删除次数


题意：给一个 01 字符串，有修改和询问操作。  
修改：对一个位置的值进行翻转。  
询问：问一个区间内最少删除多少个字符，可以使该区间内的 01 交替。  


思路：高级线段树  


先来看询问操作：给定一个区间字符串，问最少删除多少个字符，使其满足 01 交替。  

显然，删除的字符是由于相邻的字符相等，不满足 01 交替。  
所以，最少删除的字符就是区间内相邻字符相等的数量。  
即等价于问区间内相邻字符相等的数量。  


单点更新，区间查询，典型的线段树问题。  


```cpp
SegTree segTree;
segTree.Init(nums);
segTree.Build();

vector<int> ans;
ans.reserve(queries.size());
for (auto& q : queries) {
  int op = q[0];
  if (op == 1) {
    int l = q[1] + 1;
    nums[l - 1] = 1 - nums[l - 1];  // 翻转
    segTree.Update(l, nums[l - 1]);
  } else {
    int l = q[1] + 1, r = q[2] + 1;
    auto [sum, left, right] = segTree.Query(l, r);
    ans.push_back(sum);
  }
}
return ans;
```


所以来看，线段树需要维护什么信息？  


第一：需要存储区间内相邻字符相等的数量。  
第二：两个区间合并时需要判断合并的边界是否相等，所以需要存左右边界的值。  


由此，线段树需要维护的信息是：区间内相邻字符相等的数量，区间左右边界值。  


```cpp
vector<ll> sumVal;    // 区间内，相邻相等的个数
vector<ll> leftVal;   // 区间内，最左边的值
vector<ll> rightVal;  // 区间内，最右边的值
```


区间合并时，根据三个信息的定义，分别进行更新即可。  


```cpp
// 合并函数，按需进行合并
void PushUp(int rt, int l, int r) {
  leftVal[rt] = leftVal[rt << 1];
  rightVal[rt] = rightVal[rt << 1 | 1];
  sumVal[rt] = sumVal[rt << 1] + sumVal[rt << 1 | 1];
  if (rightVal[rt << 1] == leftVal[rt << 1 | 1]) {
    sumVal[rt]++;
  }
}
```


询问时，需要返回三个信息，方便合并左右两个区间。  


```cpp
// 返回区间内 sum, leftVal, rightVal
tuple<ll, ll, ll> Query(int L, int R, int l = 1, int r = maxNM, int rt = 1) {
  if (L <= l && r <= R) {
    return {sumVal[rt], leftVal[rt], rightVal[rt]};
  }
  int m = (l + r) >> 1;
  if (R <= m) {  // 区间都在左边
    return Query(L, R, l, m, rt << 1);
  } else if (m < L) {  // 区间都在右边
    return Query(L, R, m + 1, r, rt << 1 | 1);
  } else {  // 区间跨左右
    auto [leftSum, leftLeft, leftRight] = Query(L, R, l, m, rt << 1);
    auto [rightSum, rightLeft, rightRight] = Query(L, R, m + 1, r, rt << 1 | 1);
    return {leftSum + rightSum + (leftRight == rightLeft), leftLeft, rightRight};
  }
}
```


## 五、最后


这次比赛第三题有点坑，一开始没看到只有一个负数，想了好久好久，发现挺难的。  
再一看题目难度等级，是中等的，所以继续读题，发现只有一个负数，直接贪心扫描即可。  


第四题是经典的高级线段树的最基本用法，左右区间合并时有依赖，所以需要存下依赖信息，合并时根据依赖信息进行合并。  


《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
