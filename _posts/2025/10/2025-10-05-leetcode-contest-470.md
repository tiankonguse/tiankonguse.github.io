---
layout: post
title: leetcode 第 470 场算法比赛
description: 多维数位 DP       
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-10-05 12:13:00
published: true
---

## 零、背景


这次比赛是国庆期间，那天正在重庆金佛山爬山，所以没参加比赛。   
国庆后做了一下题目，发现这次比赛比较简单。    


A: 循环    
B: 贪心    
C: 栈  
D: 数位DP     


代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、计算交替和  


题意：给一个数组，求偶数位数字之和减去奇数位数字之和。  


思路：循环处理，偶数加奇数减即可。  


## 二、按位异或非零的最长子序列  


题意：给一个数组，求最长的子序列的长度，使得子序列的元素异或值非0。  


思路：贪心。  


题目只要求最长的异或非 0 子序列，并不要求最大的异或值。  


异或的性质为相同元素异或得0，不同元素异或得非0。  


将所有元素当做选择的子序列，进行异或。  
如果非 0，则找到最长的子序列，就是数组的长度。  
如果为 0，且存在非 0 元素 v，则去掉 v 后剩下的元素异或值为 v，满足非 0，此时最长的子序列长度为数组长度减一。  
如果为 0，没找到非 0 元素，说明所有元素都为 0，不存在子序列，答案就是 0。  



所以这里除了对所有元素求异或外，还需要判断是否存在非0元素。  


```cpp
l sum = 0;
ll num = 0;
for (ll v : nums) {
  sum ^= v;
  if (v != 0) {
    num = 1;
  }
}

int n = nums.size();
if (sum != 0) {
  return n;
}
if (num == 1) {
  return n - 1;
}
return 0;
```


## 三、移除K-平衡子字符串  


题意：给一个括号序列，连续 k 个左括号与右括号可以消除掉。问不断进行消除，最终剩余哪些字符。  


思路：栈  


如果是 1 个匹配的括号进行消除，是典型的栈匹配问题。  
如果是 k 个匹配的括号，则需要使用带计数的栈。  


当遇到 k 个右括号时，尝试去判断上个括号的个数是否大于等于 k 个。  



```cpp
vector<pair<char, int>> nums;
nums.reserve(n);
for (auto c : s) {
  // 更新计数栈
  if (nums.empty() || nums.back().first != c) {
    nums.emplace_back(c, 1);
  } else {
    nums.back().second++;
  }
  // 尝试匹配
  const int sz = nums.size();
  if (sz >= 2) {
    auto [rightC, rightCount] = nums[sz - 1];
    auto [leftC, leftCount] = nums[sz - 2];
    if (rightC == ')' && leftC == '(' && rightCount == k && leftCount >= k) {
      nums.pop_back();
      nums.pop_back();
      if (leftCount > k) {
        nums.emplace_back(leftC, leftCount - k);
      }
    }
  }
}
```


最后计数栈转化为字符串。  


```cpp
string ans;
ans.reserve(n);
for (auto [c, count] : nums) {
  ans.append(count, c);
}
return ans;
```


## 四、统计和为 N 的无零数对  


题意：给一个数字 n，问存在多少二元组 `(a,b)`，满足 `a+b=n`。  
要求 a 和 b 的 10 进制数字里面不存在 0。  


思路：数位DP  


n 很多，所有没法枚举所有二元组。  


不过也很容易发现，每一位的答案只与相邻两位有关。  


上一位关系：当前位可能进位，上一位需要减一。  
下一位关系：下一位可能进位，当前位需要减一。  



故可以定义状态 `f(i, flag)` 代表上一位进位状态为 flag 时，i 位之后的数字的答案数。  


状态转移方程：枚举 a 和 b 的所有可能，判断考虑进位的情况下，求和是否等于当前数字。  


```cpp
const int v = s[p] - '0';
ll& ans = dp[flag][p];
ans = 0;
for (int i = 1; i <= 9; i++) {
  for (int j = 1; j <= 9; j++) {
    // 情况1： 下一位不进位
    if (i + j == v + flag * 10) {
      ans += Dfs(p + 1, 0);
    }
    // 情况2： 下一位进位
    if (i + j == v + flag * 10 - 1) {
      ans += Dfs(p + 1, 1);
    }
  }
}
```


这个代码会发现第三个样例无法通过。  
分析原因，当前代码没有考虑前导0, 即要求 a 和 b 的位数与 n 完全相等。  


考虑前导 0 的情况，需要再增加一个维度来标识 a 或 b 当前是否处于前导 0 状态。  


状态定义：`f(i, flag, mask)` 代表上一位进位状态为 flag，a 和 b 的前导 0 状态为 mask 时，i 位之后的数字的答案数。  


mask 的值分为四种情况：0 表示都是前导 0，3 表示都没有前导 0，1 和 2 分别代表一个有前导 0，一个没有前导 0。  


此时，a 和 b 需要从 0 开始枚举，需要根据 mask 与枚举值，决定当前是否合法。  
合法了，计算出新的 mask，传递给子状态。  


```cpp
const int v = s[p] - '0';
ll& ans = dp[flag][p][mask];
ans = 0;
for (int i = 0; i <= 9; i++) {
  for (int j = 0; j <= 9; j++) {
    int newMask = mask;
    if (i != 0) newMask |= 1;
    if (j != 0) newMask |= 2;
    // 情况1： 下一位不进位
    if (i + j == v + flag * 10 && Check(i, j, mask)) {
      ans += Dfs(p + 1, 0, newMask);
    }
    // 情况2： 下一位进位
    if (i + j == v + flag * 10 - 1 && Check(i, j, mask)) {
      ans += Dfs(p + 1, 1, newMask);
    }
  }
}
```

只有两种情况不合法：当一个数字已经不处于前导 0 状态时，选择了 0，其他情况都是合法的。  


```cpp
bool Check(int i, int j, int mask) {
  int iMask = mask & 1;
  int jMask = (mask >> 1) & 1;
  if (iMask == 1 && i == 0) return false;
  if (jMask == 1 && j == 0) return false;
  return true;
}
```


## 五、最后  


这次比赛整体比较简单，第二题是贪心，第三题是计数栈，第四题是数位 DP，都属于基础题。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
