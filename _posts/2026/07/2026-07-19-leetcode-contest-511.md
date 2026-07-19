---
layout: post  
title: leetcode 周赛 511 - 最小循环表示法  
description: 竟然这么多人都会最小循环表示法  
keywords: 算法, leetcode, 算法比赛  
tags: [算法, leetcode, 算法比赛]  
categories: [算法]  
updateDate: 2026-07-19 12:13:00  
published: true  
---


## 零、背景


这次比赛我个人认为挺难的，没想到这么多人都做完了四道题。  


本场题型概览如下。  
A 题：搜索。  
B 题：递归。  
C 题：贪心。  
D 题：最小表示法。  




## 一、偶数次骑士移动


题意：给一个棋盘，问一个骑士是否可以经过偶数步从一个点到达另外一个点。  


思路：搜索  


状态定义：`dp[i][j][flag]` 使用奇偶性为 `flag` 步是否可以到达点 `(i,j)`。  



使用 BFS 搜索，每个状态只能到达一次。  
状态个数：`O(2*8*8)`  



```cpp
grids[sx][sy][0] = 1;
queue<tuple<int, int, int>> q;
q.push({sx, sy, 0});
while (!q.empty()) {
  auto [x, y, step] = q.front();
  q.pop();
  if (x == tx && y == ty) return step % 2 == 0;
  for (int i = 0; i < 8; i++) {
    int nx = x + dir[i][0], ny = y + dir[i][1];
    int nstep = (step + 1) % 2;
    if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8) continue;
    if (grids[nx][ny][nstep] != 0) continue;
    grids[nx][ny][nstep] = 1;
    q.push({nx, ny, nstep});
  }
}
return false;
```


## 二、统计二叉树中支配节点的数量


题意：给一个二叉树，问支配点的个数。  
支配点定义：一个节点的值等于这个节点子树的最大值。  


思路：递归  


递归计算子树的支配节点数量与子树最大值即可。  


```cpp
 // 返回 <支配数量, 子树最大值>
pair<int, int> Dfs(TreeNode* root) { 
  if (root == nullptr) return {0, 0};
  auto [leftCount, leftMax] = Dfs(root->left);
  auto [rightCount, rightMax] = Dfs(root->right);
  int currentMax = max({leftMax, rightMax, root->val});
  int currentCount = leftCount + rightCount;
  if (root->val == currentMax) currentCount++;
  return {currentCount, currentMax};
}
```


## 三、使用子序列排序转换二进制字符串


题意：给一个 01 字符串 S，可以分别对任意子序列进行排序，问是否可以得到新的字符串。  
询问目标字符串：某些位置是问号，可以是任意值。   


思路：贪心  


分析可以得到几个结论。  


结论1：排序，意味着会将后面的 0 移动到前面，前面的 1 会移动到后面。  
结论2：子序列任意次排序，意味着每次可以只选择两个位置来交换。  



结论3：目标字符串有问号，显然，前面的问号都是 0，后面的问号都是 1。  
证明：假设存在一个答案，使得两个问号，前面设置为 1，后面设置为 0。  
则可以对这两个位置进行一次排序，则前面就是 0，后面是 1。  



基于这三个结论，可以统计原串与目标串 01 的个数。  
如果原串 0 或 1 的个数比目标还少，显然没有答案。  
否则按结论3进行贪心问号替换，从而得到两个 01 串，问是否原串可以多次排序得到目标串。  



此时可以贪心匹配。  
即按顺序比较 0 的位置，原串更靠后，则可以进行交换，否则没有答案。  
判断复杂度：`O(n)`  



```cpp
bool Check(const string& s, const string& str) {
  auto [s0, s1] = Count(s);
  auto [str0, str1] = Count(str);
  if (str0 > s0 || str1 > s1) {
    return false;
  }
  int need0 = s0 - str0;
  int i = 0, j = 0;
  while (i < n && j < n) {
    while (i < n && s[i] == '1') i++;
    while (j < n && (str[j] == '1' || (str[j] == '?' && need0 == 0))) j++;
    if (i == n || j == n) break;
    if (str[j] == '?') need0--;
    if (i < j) return false;
    i++, j++;
  }
  return true;
}
```


## 四、字符串变换后的最少分组数


题意：给多个字符串，将等价的字符串进行分组，问至少可以分多少个分组。  
等价定义：一个字符串的奇数或偶数位置进行循环移动，得到的就是等价字符串。  
数据范围：累计字符个数 `10^5`  


思路：最小循环表示法  


由于数据量巨大，显然需要依赖前缀来快速判断是否有等价字符串，以便合并计数。  



这就要求所有等价字符串有一个唯一的表示法。  
这有一个专业名称，叫做最小循环表示法。  



有了最小循环串，通过 hash 进行去重，就是最小分组数。  



通过 Booth Algorithm ，可以 `O(n)` 的复杂度得到最小循环表示的起始位置。  



这个算法类似于 KMP，假设有两个位置比较了 k 个位置都相等，下个位置不相等了，可以直接跳过 K 个位置，从下个位置开始比较。  
由此，最多比较 `O(N)` 次。  



```cpp
int minRotation(const string& s) {
  int n = s.size();
  if (n == 0) return 0;
  string ss = s + s;
  int i = 0, j = 1;
  while (i < n && j < n) {
    int k = 0;
    while (k < n && ss[i + k] == ss[j + k]) ++k;
    if (k == n) break;
    if (ss[i + k] > ss[j + k]) {
      i += k + 1;
      if (i == j) ++i;
    } else {
      j += k + 1;
      if (i == j) ++j;
    }
  }
  return min(i, j);
}
```


证明也很简单。  
后面有时间单独写一篇文章来介绍这个算法。  
综合复杂度：`O(5*10^5)`  


## 五、最后


这次比赛其实挺难的，第三题贪心不容易想，第四题最小循环表示法比较少见，也属于比较难得算法。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
