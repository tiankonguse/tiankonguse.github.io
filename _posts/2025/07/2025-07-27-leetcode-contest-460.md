---
layout: post
title: leetcode 第 470 场算法比赛-排名62
description: 线性基，从来没听过 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-07-27 12:13:00
published: true
---

## 零、背景


这次比赛前三题不难，第四题涉及到我完全没听过的算法——线性基，初步学习了一下，后面有机会单独分享记录一下。  


A: 贪心    
B: 简单动态规划+前后缀   
C: 质因数分解+BFS    
D: 线性基    


排名：62 
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、中位数之和的最大值  


![](https://res2025.tiankonguse.com/images/2025/07/27/001.png)  


题意：给一个数组，每次可以任意删除3个元素，得分是3个元素的中位数。问怎么删除，最终得分最大。  


思路：贪心  


由于是任意删除3个元素，可以先对数组进行排序。  


先看第一次删除，最大值无法得分，所以需要想办法得到次大值的得分。  
此时，第三个最小元素可以是任意值，显然越小越好，因为后续的选择起始分数就更高了。  


故贪心策略明确：每次删除最大的两个数字和最小的数字。  


```cpp
sort(nums.begin(), nums.end());
ll ans = 0;
int l = 0, r = nums.size() - 1;
while (l < r) {
  r--;
  ans += nums[r];
  r--;
  l++;
}
return ans;
```


## 二、插入一个字母的最大子序列数  


![](https://res2025.tiankonguse.com/images/2025/07/27/002.png)  



题意：给一个字符串，现在可以任意选择一个位置插入一个任意字符，问如何插入，才能使得新字符串的“LCT”子序列最多。  


思路：动态规划  


显然，需要枚举每个插入位置，求子序列个数。  



假设插入的是位置 `i`，则需要求出下面几种组合的个数。  


1、不含插入字符，LCT 的个数。  
2、如果插入 `L`，则可以与后缀`CT`组合，新增 CT 个。  
3、如果插入`C`，则可以和前缀`L`与后缀`T`组合，新增`L*T`个。  
4、如果插入`T`，则可以和前缀`LC`组合，新增 LC 个。  


```cpp
const ll base = pre[n][LCT];  // 不含插入字符 LCT 的个数
ll ans = base;
for (int i = 1; i <= n + 1; i++) {                   // 在 i 之前插入 LCT 其中一个字符
  ans = max(ans, base + suf[i][CT]);                 // 插入 L
  ans = max(ans, base + pre[i - 1][L] * suf[i][T]);  // 插入 C
  ans = max(ans, base + pre[i - 1][LC]);             // 插入 T
}
return ans;
```



如何求前缀的这些信息呢？  
这个就是简单的状态动态规划了。  


状态定义：`f(i, S)` 前 i 个字符的序列状态 S 的个数  


假设第 i 个字符值是 v，则状态转移方程：  


```CPP
f(i, L) = f(i-1, L) + 1 && (v == 'L')  
f(i, LC) = f(i-1, LC) +  f(i-1, L) && (v == 'C') 
f(i, LCT) = f(i-1, LCT) + f(i-1, LC) && (v == 'T')
```


后缀与前缀完成对称，这里不再介绍。  


```cpp
vector<vector<ll>> pre(n + 2, vector<ll>(3, 0));
for (int i = 1; i <= n; i++) {
  const char c = s[i - 1];
  pre[i] = pre[i - 1];
  if (c == 'L') {
    pre[i][L]++;
  } else if (c == 'C') {
    pre[i][LC] += pre[i - 1][L];
  } else if (c == 'T') {
    pre[i][LCT] += pre[i - 1][LC];
  } else {
    // do nothing
  }
}
```

## 三、通过质数传送到达终点的最少跳跃次数  


![](https://res2025.tiankonguse.com/images/2025/07/27/003.png)


题意：给一个数组，开始在第一个位置，按规则跳动，目标是最后一个位置，求最小跳动次数。  


规则1：向左或者向右跳动一步。  
规则2：如果当前位置数质数 p，则可以跳到值为 p 的倍数的位置。  



思路：质因数分解+BFS  


规则2可以跳到所有质数的倍数，所以需要对所有数字进行质因数分解，储存每个质数可以到达哪些位置。  


```cpp
unordered_map<int, vector<int>> prmIndexs;  // 922 / 932 个通过的测试用例
vector<vector<int>> prmIndexs;  
void Split(const int index, int v) {
  for (int i = 0; i < K && v > 1; i++) {
    if (v % prm[i] == 0) {
      prmIndexs[prm[i]].push_back(index);
      while (v % prm[i] == 0) {
        v /= prm[i];
      }
    }
    if (v > 1 && is[v]) {
      prmIndexs[v].push_back(index);
      break;
    }
  }
}
```


答案时求最小值，显然需要 BFS 搜索，直接搜即可。  


```cpp
vector<int> flag(n, -1);
queue<int> que;
auto Add = [&](int i, int step) {
  if (i < 0 || i >= n || flag[i] != -1) return;
  flag[i] = step;
  que.push(i);
};
Add(0, 0);
while (!que.empty()) {
  int i = que.front();
  que.pop();
  int step = flag[i] + 1;
  Add(i + 1, step);
  Add(i - 1, step);
  if (is[nums[i]]) {
    for (auto j : prmIndexs[nums[i]]) {
      Add(j, step);
    }
  }
  if (flag[n - 1] != -1) break;
}
return flag[n - 1];
```


注意事项：储存质数的所有倍数位置的关系时，需要使用 数组，不能使用 hash 表，否则会超时。  


## 四、划分数组得到最大异或运算和与运算之和  


![](https://res2025.tiankonguse.com/images/2025/07/27/004.png)


题意：将一些数组分成三组 A、B、C，求公式 `XOR(A) + AND(B) + XOR(C)`的最大值。  


思路：线性基  


暴力枚举，枚举一次子集复杂度是 `2^n`，子集里再枚举子集，复杂度是 `3^n`，显然会超时。  
所以，这里只能枚举一次子集，之后需要使用某种数据结构直接求出答案。  


A 和 C 的运算规则相同，很容易想到，先枚举 B，然后求出`XOR(A) + XOR(C)`的最大值即可。  


B 是与运算，集合越大，答案越小。  
故初始值需要是全 1 的bit位，但集合为空时需要特殊判断。  


```cpp
ll totalXor = 0;
for (auto value : nums) {
  totalXor ^= value;
}

const ll MaxVal = (1LL << 32) - 1;
for (int mask = 0; mask < N; mask++) {  // 枚举 B
  ll andB = mask > 0 ? MaxVal : 0;
  ll xorAC = totalXor;  // AC集合的异或
  for (int i = 0; i < n; i++) {
    if (mask & (1 << i)) {
      andB &= nums[i];
      xorAC ^= nums[i];
    }
  }
}
```


接下来就是求`XOR(A) + XOR(C)`了。  


需要先分析每一位，来看下有哪些性质。  



性质1：如果某一位共有奇数个1，则两个集合不管如何划分，一个集合是奇数，另一个必然是偶数，答案必然是1。  
故，对于1是奇数个的位置，可以确定求和后答案就是 1，而这个值就是集合的异或值。  


```cpp
XOR(奇数) + XOR(偶数) = 1
```


性质2：如果某一位共有偶数个1,一种划分是两个集合都是偶数，一种划分是两个集合都是奇数。  
不管哪种划分，两个集合的奇偶性相同，故两个集合对应位置的值也相等。  


```cpp
XOR(奇数) = XOR(奇数)
XOR(偶数) = XOR(偶数)
```


也就是说，假设所有1都是偶数时，两个集合不管如何划分都相等，即`XOR(A) = XOR(C)`， 故答案时`2 * XOR(A)`。  


```cpp
andB + xorAC + 2 * Max(XOR(AC))
```



现在问题转化为了，给若干数字，求一个子集，使得子集的异或值最大。  
这个问题可以使用线性基来做。  


线性基是线性代数中的概念，N 维空间里找到一组向量，使得N维空间的任意向量都可以由这一组向量组合得到，此时这组向量就称为线性基。  
找到线性基后，就可以用来计算N维空间的最大值、最小值、指定值的构造集合。  


回到这道题，对于异或运算，对应线性代数中的异或线性基。  


假设有 n 个数字，可以使用 `O(n log(n))`的复杂度构造出线性基，然后再使用 `log(n)`的复杂度计算出最大值即可。  



构造线性基时需要排除奇数1的位数，然后求最大值即可。  


```cpp
// xorAC bit位为 1 的代表 AC 集合对一个的位有奇数个1，其他位有偶数个1
// 性质1：奇数个1，不论如何选择，A 与 C 一个是奇数个1，一个是偶数个1，最终异或后求和还是 1
// 性质2：偶数个1，不管怎么选择，xor(A) 与 xor(C) 都相等，故需要求出最大的 xor(A)
const ll xorACEven = MaxVal ^ xorAC;
linearBasis.Init();
for (int i = 0; i < n; i++) {  // 枚举 A
  if (!(mask & (1 << i))) {
    linearBasis.InsertNumber(nums[i] & xorACEven);
  }
}
ans = max(ans, andB + xorAC + 2 * linearBasis.getMax());
```


## 五、最后  


这次比赛前三题比较简单，最后一题推导出两个性质已经很难了，结果最后还需要使用线性基来求性质2的答案，这个再次遇到我的知识盲区了，第一次听说线性基。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
