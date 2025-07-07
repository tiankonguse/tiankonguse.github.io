---
layout: post
title: leetcode 第 456 场算法比赛-比较简单
description: 太简单了
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-06-29 12:13:00
published: true
---

## 零、背景


这场比赛的时候我还在老家，当时正在走亲戚，所以就没参加比赛。    


现在回头做了一下，发现四道题都很简单。  


A: 模拟  
B: 前后缀  
C: 动态规划    
D: 二分+并查集  


排名：无
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、分割字符串  


![](https://res2025.tiankonguse.com/images/2025/06/29/001.png)  


题意：给一个字符串，按顺序得到最短的前面没出现的子串。输出最终得到的所有子串。  


思路：模拟  


已经得到的子串储存在 hash 表中，新的子串判断 hash 表中是否存在，存在了则增加子串的长度。  


```cpp
unordered_set<string> H;
vector<string> ans;
string buf;
for (auto c : s) {
  buf.push_back(c);
  if (!H.count(buf)) {
    H.insert(buf);
    ans.push_back(buf);
    buf.clear();
  }
}
return ans;
```

## 二、相邻字符串之间的最长公共前缀  


![](https://res2025.tiankonguse.com/images/2025/06/29/002.png) 



题意：给一个字符串数组，问删除第 i 个字符串后，剩余的字符串中相邻字符串的最长公共前缀。  


思路：前后缀  


第一步：预处理出相邻字符串的最长公共前缀。  


```cpp
vector<int> commonLen(n + 2, 0);
for (int i = 1; i < n; i++) {
  auto& s1 = words[i];
  auto& s2 = words[i - 1];
  commonLen[i] = Common(s1, s2);
}
```


第二步：预处理出数组前缀的最大公共前缀长度。  


```cpp
vector<int> leftMax(n + 2, 0);
for (int i = 1; i < n - 1; i++) {
  leftMax[i] = max(leftMax[i - 1], commonLen[i]);
}
```


第三步：预处理出数组后缀的最大公共前缀长度。  


```cpp
vector<int> rightMax(n + 2, 0);
for (int i = n - 1; i >= 0; i--) {
  rightMax[i] = max(rightMax[i + 1], commonLen[i + 1]);
}
```


第四步：枚举删除第i个字符串，模拟计算新的相邻子串的公共前缀，求最大值。    


```cpp
ans[0] = rightMax[1];
ans[n - 1] = leftMax[n - 2];
for (int i = 1; i + 1 < n; i++) {
  ans[i] = max(leftMax[i - 1], rightMax[i + 1]);
  auto& s1 = words[i + 1];
  auto& s2 = words[i - 1];
  ans[i] = max(ans[i], Common(s1, s2));
}
```

## 三、划分数组得到最小 XOR  


![](https://res2025.tiankonguse.com/images/2025/06/29/003.png) 


题意：给一个数组，求分割为k个子数组，每个子数组求异或值。   
问如何拆分，才能使得 k 个异或值的最大值最小。  


思路：动态规划  


求最大值的最小，第一时间想到的是二分。  
但是在枚举第一段子数组后，剩余的子数组存在大量的重复问题，需要使用动态规划来合并重复状态。  
而动态规划是可以直接储存答案的，这样就不需要二分了。  


状态定义：`f(n,k)`前 n 个元素拆分为 k 个子数组的所有方案中，异或值最大值的最小值。  


状态转移方程：  


```cpp
f(n,k) = min(max(f(n-i,k-1), xor(n-i+1, n)))
```


其中 `xor(l,r)` 代表求一个子数组的异或值，可以通过前缀异或值快速求差得到。  


```cpp
int Dfs(int n, int k) {
  int& ret = dp[n][k];
  if (ret != -1) return ret;
  if (k == 1) return ret = preXOR[n];
  ret = INT_MAX;
  for (int i = n; i >= k; i--) {
    ret = min(ret, max(preXOR[n] ^ preXOR[i - 1], Dfs(i - 1, k - 1)));
  }
  return ret;
}
```



## 四、升级后最大生成树稳定性  



![](https://res2025.tiankonguse.com/images/2025/06/29/003.png) 


题意：给一个无向有权图，部分边必选，部分可选的边允许权值翻倍一次，最多对k条边权值翻倍，问可以得到的生成树的最小边权的最大值是多少。  


思路：二分+并查集  


二分答案，判断是否可以构造最小边权不小于指定权值的生成树。  


```cpp
int l = 1, r = 1e5+10;
while (l < r) {
  int mid = (l + r) / 2;
  if (Check(mid)) {
    l = mid + 1;
  } else {
    r = mid;
  }
}
return r - 1;
```


判断方法需要使用并查集。  
首先，先加入所有必选的边，并判断必选的边是否满足要求(权值满足要求，不能有环)。  


```cpp
dsu.Init(n);
for (auto& e : edges) {
  int u = e[0], v = e[1], s = e[2], m = e[3];
  if (m == 0) continue;
  // 必须加入到生成树中
  if (s < minVal) {
    return false;
  }
  if (dsu.Find(u) == dsu.Find(v)) {
    return false;  // 形成环
  }
  dsu.Union(u, v);
}
```


之后，可选边从大到小枚举，判断是否可以加入进来，以及是否需要权值翻倍。  


```cpp
int K = k;
for (auto& e : edges) {
  int u = e[0], v = e[1], s = e[2], m = e[3];
  if (m == 1) continue;
  if (dsu.Find(u) == dsu.Find(v)) continue;
  if (s >= minVal) {
    dsu.Union(u, v);
  } else if (K > 0 && s * 2 >= minVal) {
    dsu.Union(u, v);
    K--;
  }
}
```


最后，判断并查集是否是连通的即可。  


```cpp
return dsu.GetBlock() == 1;
```


## 五、最后  


这次比赛整体比较简单。  
第一题模拟，第二题前后缀，第三题动态规划，第四题二分+并查集。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
