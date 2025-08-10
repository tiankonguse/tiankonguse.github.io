---
layout: post
title: leetcode 第 462 场算法比赛
description: 数位DP 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-08-10 12:13:00
published: false
---

## 零、背景


这次比赛最后一题是数位DP，我想直接贪心做，结果越写越复杂，最后在比赛前没通过比赛。  
赛后老老实实写数位DP，就通过了。    


A: 模拟  
B: 贪心  
C: 贪心  
D: 数位DP  


排名：158  
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、垂直翻转子矩阵  


![](https://res2025.tiankonguse.com/images/2025/08/10/001.png) 


题意：给一个矩阵，对指定的子矩阵进行上下翻转。  

思路：模拟


```cpp
for (int j = y; j < y + k; j++) {
  for (int i0 = x, i1 = x + k - 1; i0 < i1; i0++, i1--) {
    swap(grid[i0][j], grid[i1][j]);
  }
}
```

## 二、排序排列  


![](https://res2025.tiankonguse.com/images/2025/08/10/002.png) 


题意：给一个数组，求选择一个k，可以对任意两个与运算等于k的位置进行交换。  
求最小的k，使得通过交换最终可以使得数组有序。  


思路：贪心  


分析可以得到下面几个结论：


1）下标和值不相等的值，都是需要交换的。
2）一个待交换的元素某一位是 0，则 k 这一位也是 0。  
3）所有待交换的元素与运算，就是最小的 k。  
4）用这个最小的 K，循环交换，就可以将数组变成有序。  


```cpp
int ans = ~0;
for (int i = 0; i < nums.size(); i++) {
  if (nums[i] != i) {
    ans = ans & i;
  }
}
if (ans == ~0) ans = 0;
return ans;
```




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
