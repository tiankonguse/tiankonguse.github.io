---
layout: post
title: leetcode 第 458 场算法比赛-前百名
description: 敲错不少地方 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-07-13 12:13:00
published: true
---

## 零、背景


这次比赛比较简单，不过敲错不少地方，最后调试好久。   


A: 模拟    
B: 并查集  
C: 离线逆向模拟    
D: 状态压缩动态规划    


排名：85  
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、用特殊操作处理字符串 I


![](https://res2025.tiankonguse.com/images/2025/07/13/001.png)  



题意：给一个空字符串，按下述规则构造新的字符串。  
规则1）追加一个字符。  
规则2）删除最后一个字符。  
规则3）字符串翻倍。  
规则4：字符串反转。  


思路：数据范围不大，按照规则模拟即可。  


```cpp
for (auto c : s) {
  if ('a' <= c && c <= 'z') {
    ans.push_back(c);
  } else if (c == '*') {
    if (!ans.empty()) ans.pop_back();
  } else if (c == '#') {
    ans += ans;
  } else if (c == '%') {
    reverse(ans.begin(), ans.end());
  }
}
```


## 二、最小化连通分量的最大成本


![](https://res2025.tiankonguse.com/images/2025/07/13/002.png) 


题意：给一个带权无向图，问删除一些边，使得连通分量最多K个。  
问如何删除，才能使所有连通分量中的最大成本达到最小可能值。   



思路：并查集  


虽然是求最大值的最小，但是可以直接并查集贪心求最优值。  


显然，边权从小到大排序，依次加入到图中，直到连通分量个数大于K停止。  
连通分量的个数可以使用并查集来维护计算。  


```cpp
for (auto& e : edges) {
  int u = e[0], v = e[1], w = e[2];
  if (dsu.GetBlock() > k) {
    dsu.Union(u, v);
    ans = w;
  } else {
    break;
  }
}
```


## 三、用特殊操作处理字符串 II



![](https://res2025.tiankonguse.com/images/2025/07/13/003.png) 


题意：与第一题类似，给一个空字符串，按下述规则构造新的字符串，问最终字符串的第 K 个字符是什么。  
规则1）追增一个字符。  
规则2）删除最后一个字符。  
规则3）字符串翻倍。  
规则4：字符串反转。  


思路：离线逆向模拟  


由于只求一个字符，可以维护一个指针，按逆向顺序和逆向规则来计算答案。  


逆向运算时需要知道当前字符串的长度，因此需要先正向运算一遍，存储每一步的字符串长度。  


```cpp
for (int i = 1; i <= n; i++) {
  char c = s[i - 1];
  if ('a' <= c && c <= 'z') {
    len++;
  } else if (c == '*') {
    len = max(len - 1, 0LL);
  } else if (c == '#') {
    len += len;
  } else if (c == '%') {
    // do nothing
  }
  nums[i] = len;
}
```


假设对于某一步规则之后字符串长度是 L，询问的位置是 K。  


逆向规则4：翻转，询问位置已修正为 `L-1-K` 。  
逆向规则3：翻倍，如果询问的位置大于等于 `L/2`，则修正为`K-L/2`，否则保持不变。  
逆向规则2：删除，无需处理  
逆向规则1：增加，如果询问的是最后一个位置，则找到答案，否则无需处理。  


```cpp
if (k >= len) return '.';
for (int i = n; i >= 1; i--) {  //
  ll l = nums[i];
  char c = s[i - 1];
  if ('a' <= c && c <= 'z') {
    if (k == l - 1) return c;
  } else if (c == '*') {
    // do nothing
  } else if (c == '#') {
    if (k >= l / 2) {
      k -= l / 2;
    }
  } else if (c == '%') {
    k = l - 1 - k;  // 翻转
  }
}
```


## 四、图中的最长回文路径


![](https://res2025.tiankonguse.com/images/2025/07/13/004.png) 



题意：给一个带权无向图，问是否存在一条路径，使得路径上的点的权值可以组成回文串。  



思路：状态压缩动态规划  


数据范围不大，只有14个点，显然是可以使用状态压缩来解决。  


状态定义：`f(u,v,mask)` 表示从 u 到 v ，路径上的点都在 mask 集合里最长路径。  


状态转移方程：  


```cpp
f(u,v,mask) = 2 // g[u][v] = 1
f(u,v,mask) = 3 // g[u][i] = g[v][i] = 1
f(u,v,mask) = max(f(i,j,mask ^ (1 << i) ^ (1 << j))) 
```


复杂度：`O(n^4 * 2^n)`  
实际不会这么大。  


完整代码如下，需要做很多判断，枚举出相邻且值相等的边。  


```cpp
int Dfs(int u, int v, const int mask) {
  int& ret = dp[u][v][mask];
  if (ret != -1) return ret;
  ret = 0;
  if (g[u][v]) ret = 2;
  for (int i = 0; i < n; i++) {
    if (g[u][i] && g[i][v] && (mask & (1 << i))) {
      ret = 3;
    }
  }
  for (int i = 0; i < n; i++) {
    if (!(mask & (1 << i))) continue;
    if (!g[u][i]) continue;
    for (int j = 0; j < n; j++) {
      if (i == j) continue;
      if (!(mask & (1 << j))) continue;
      if (!g[v][j]) continue;
      if (label[i] != label[j]) continue;
      ret = max(ret, 2 + Dfs(i, j, mask ^ (1 << i) ^ (1 << j)));
    }
  }
  return ret;
}
```


优化：每个状态枚举相同的相邻边时有 `O(n^2)`的复杂度。  
一种优化是预处理计算出每个字符的相邻边的顶点集合，这样两个状态压缩的集合与运算后，得到的点就全是满足条件的点。  



## 五、最后  


这次比赛比较简单，第二题并查集与上次比赛几乎一模一样。  
第三题逆向离线运算也算是很经典的题目。  
第四题状态压缩，一开始以为会超时，想着先提交试试，结果却过了。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
