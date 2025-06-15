---
layout: post  
title: leetcode 第 384 场算法比赛 
description:  最后一题还是使用 hash 代替 kmp。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateDate:  2024-02-11 18:13:00  
published: true  
---


## 零、背景  


今天大年初二，上午出门了，晚上回来做了下题，发现都比较简单。  


A: 模拟, 循环找列最大值。  
B: 枚举, 两层循环判断是否匹配。  
C: 贪心构造, 统计字符奇偶次数，按长度从小到大构造回文串。  
D: hash 或 kmp，判断是否匹配。  


## 一、修改矩阵  

题意：给一个矩阵，将 -1 替换为每列的最大值。  


思路：模拟，每列循环找最大值，再循环将 -1 替换。  


## 二、匹配模式数组的子数组数目 I  


题意：给一个数组和连续子数组的大小关系，问多少个子数组满足关系。  
大小关系分为三种情况：大于、等于、小于。  


思路：数据范围不大，枚举所有子数组，循环判断是否满足大小关系。  
复杂度：`O(n*m)`  


## 三、回文字符串的最大数量  


题意：给一个字符串数组，可以交换任意两个字符串的任意两个字符，问可以构造多少个回文字符串。  


思路：贪心构造。  


由于可以由于可以交于任意字符串的任意字符，显然优先构造字符串长度小的。  


预处理1：统计字符有多少个偶数，多少个奇数。  


```cpp
map<char, int> h;
for (auto& w : words) {
    for (auto c : w) {
    h[c]++;
    }
}
int one = 0, two = 0;
for (auto [k, v] : h) {
    two += v / 2;
    one += v % 2;
}
```

预处理2：统计字符串的各个长度，从小到大排序。  


```cpp
vector<int> nums;
nums.reserve(words.size());
for (auto& w : words) {
    nums.push_back(w.length());
}
sort(nums.begin(), nums.end());
```


构造：对于一个长度，分奇偶性处理。  
如果是偶数，判断统计的偶数字符是否够，够了即可构造。  


```cpp
if (v / 2 <= two) {
  ans++;
  two -= v / 2;
}
```


如果是奇数，先消耗一个奇数，再判断偶数字符是否够。  
如果没有统计的奇数，先消耗一个偶数，得到两个奇数，再做判断。  


```
if (one == 0 && two > 0) {
  one += 2;
  two -= 1;
}
if (v / 2 <= two && one > 0) {
  ans++;
  two -= v / 2;
  one--;
}
```


## 四、匹配模式数组的子数组数目 II  


题意：与第二题一模一样，数据范围变大。  


思路：子串的匹配仅仅判断大小关系，预处理出原数组的大小关系，就是寻找有多少个大小关系子数组与输入匹配。  


数组匹配基本的做法是 KMP，更简单的是 HASH 算法。  


```cpp
const ll patternHash = Hash(pattern);
int m = pattern.size();
Init(nums.data(), n);

int ans = 0;
for (int i = 0; i < n; i++) {
  if (i + m - 1 >= n - 1) break;
  if (Hash(nums, i, i + m - 1) == patternHash) {
    ans++;
  }
}
return ans;
```


## 五、最后  


这次比赛比较简单，但是最后一题我是使用字符串 HASH 解决的。  


后面有机会，研究下 KMP 算法和后缀数组，这些都使用经典的字符串算法做一次。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

