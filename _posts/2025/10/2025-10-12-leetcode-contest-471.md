---
layout: post
title: leetcode 第 471 场算法比赛
description: 分类DP       
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-10-12 12:13:00
published: true
---

## 零、背景


这次比赛第四题比较简单，第三题我想的算法比较复杂，采用分类DP，分三种情况写了三个DP 通过的。    


A: 统计    
B: 枚举+统计    
C: 分类DP  
D: DFS     


排名: 200+
代码地址： https://github.com/tiankonguse/leetcode-solutions  


## 一、出现次数能被 K 整除的元素总和  


题意：给一个数组，问出现的元素个数能被 k 整除的元素总和。  


思路：统计元素个数，判断是否能被 k 整除。  


注意事项：一个元素次数出现 k 倍时，这个元素需要求和 k 倍次，不是一次。  


## 二、最长的平衡子串 I  

题意：给一个字符串，问有多少个子串满足出现的字符的频次相等。  


思路：枚举统计  


数据范围只有 1000，枚举所有子串是否满足要求。  


方法1：枚举时统计所有字符的频次，如果所有字符频次相等，则满足要求。  
复杂度：`O(26 * n^2)`  


```cpp
vector<int> freq(26, 0);
auto Check = [&](int maxVal) {
  for (auto v : freq) {
    if (v != 0 && v != maxVal) return false;
  }
  return true;
};

int ans = 1;
for (int i = 0; i < n; i++) {
  fill(freq.begin(), freq.end(), 0);
  for (int j = i; j < n; j++) {
    int v = s[j] - 'a';
    freq[v]++;
    if (Check(freq[v])) {
      ans = max(ans, j - i + 1);
    }
  }
}
```


方法2：统计频次时，实时统计频次的频次。  
复杂度：`O(n^2)`  


```cpp
vector<int> freq(26, 0);
unordered_map<int, int> counts;
auto AddAndCheck = [&](int v) -> bool {
  if (freq[v] > 0) {
    int c = freq[v];
    counts[c]--;
    if (counts[c] == 0) counts.erase(c);
  }
  freq[v]++;
  counts[freq[v]]++;
  return counts.size() == 1;
};
```

进一步优化：频次的频次当前使用哈希表统计，常数比较大。  
如果使用数组来统计，则需要维护一个计数器，来记录当前频次的频次的个数，会更复杂一些。  



方法3：数学公式校验  
枚举时有几个信息很重要，但是我们没有利用上。  
假设当前子串满足条件，假设子串长度为 L，子串出现的不同个数为 C，字符的最大频次是 M，则所有字符的频次都是 M，即满足 `L = C * M`。  
所以我们可以通过这个公式来校验是否满足条件。  
复杂度：`O(n^2)`  


```cpp
for (int i = 0; i < n; i++) {
  fill(freq.begin(), freq.end(), 0);
  int maxFreq = 0;
  int charCount = 0;
  for (int j = i; j < n; j++) {
    int v = s[j] - 'a';
    freq[v]++;
    if(freq[v] == 1) charCount++;
    maxFreq = max(maxFreq, freq[v]);
    if (maxFreq * charCount == (j - i + 1)) {
      ans = max(ans, j - i + 1);
    }
  }
}
```


## 三、最长的平衡子串 II  


题意：给一个只包含三个字符的字符串，问有多少个子串满足出现的字符的频次相等。  


思路：分类DP  


字符只有三个，突破口显然在字符的种类上，更多的话说明无法解决这个问题。  


这里按字符出现的种类来分类，分类讨论。  


如果只出现一个字符，那么相同字符连续出现的最长长度就是答案。  


```cpp
char pre = s[0];
int cnt = 0;
for (auto c : s) {
  if (c != pre) {
    pre = c;
    cnt = 0;
  }
  cnt++;
  ans = max(ans, cnt);
}
```


如果只出现两个字符，则可以一个加另一个减来统计前缀和，两个前缀和相等代表中间的子串满足条件。  


```cpp
unordered_map<int, int> mp;  // diff, idx
int diff = 0;  // a-b
char now = s[0];
auto Update = [&](int i) {
  if (mp.count(diff)) {
    ans = max(ans, i - mp[diff]);
  } else {
    mp[diff] = i;
  }
};
mp[0] = 0; // 全部消除，整个前缀都满足
for (int i = 1; i <= n; i++) {
  char c = s[i - 1];
  if (c == now) {
    diff++;
  } else  {
    diff--;
  }
  Update(i);
}
```


题目输入有 3 类字符，所以相邻的两类字符需要使用上面的算法。  
当遇到第三个字符时，需要进行回退，以及所有状态更新，情况比较复杂，稍后在来详细介绍。   



只出现三个字符时，可以维护一个二元组，分别记录前两个字符的计数，遇到第三个字符时，同时对二元组的两个元素都减一，从而可以利用前缀来找到满足条件的子串。  
可以发现，代码与上面的代码非常相似，只是一维变成二维。  


```cpp
map<pair<int, int>, int> mp;  // {a,b}, cnt
mp[{0, 0}] = 0;
pair<int, int> cnt = {0, 0};  // a,b
for (int i = 1; i <= n; i++) {
  char c = s[i - 1];
  if (c == 'a') {
    cnt.first++;
  } else if (c == 'b') {
    cnt.second++;
  } else {
    cnt.first--;
    cnt.second--;
  }
  if (mp.count(cnt)) {
    ans = max(ans, i - mp[cnt]);
  } else {
    mp[cnt] = i;  // 记录最早的位置
  }
}
```


最后再来看，如何处理只出现两个字符的状态切换。  


最简单的情况是三段连续字符，如 `aaabbbccc`。  
当只有 a 和 b 的时候，需要按两个字符 `ab` 来处理。  
当遇到 c 时，需要按 `bc` 来处理。  


这时，我们需要找到 c 前面所有连续的 b，然后从 b 的起始位置开始处理。  
找到连续 b 的起始位置，前一个就是 c 的最后位置，所以维护两个字符的最后位置即可计算出连续 b 的长度。  


代码如下，新字符属于两个字符时，正常的求前缀差，顺便计算每个字符最后出现的位置，并更新答案。  


```cpp
mp[0] = 0;
for (int i = 1; i <= n; i++) {
  const char c = s[i - 1];
  if (c != now && c != pre) {
    ReBack(i);
    continue;
  }
  if (c == now) {
    diff++;
    lastNow = i;
  } else {
    diff--;
    lastPre = i;
  }
  if (mp.count(diff)) {
    ans = max(ans, i - mp[diff]);
  } else {
    mp[diff] = i;
  }
}
```


当遇到新字符时，i 需要回退到最后一个字符连续出现的第一个位置，然后重新开始计算。  


```cpp
auto ReBack = [&](int& i) {
  const char c = s[i - 1];
  const char other = s[i - 2]; // 与 c 相邻的字符
  if (pre == other) {  // 相邻的时 pre
    i = lastNow;       // now now now pre pre pre c ...
  } else {             // 相邻的是 now
    i = lastPre;       // pre pre pre now now now c ...
  }
  now = other;
  pre = c;
  lastNow = lastPre = i;
  diff = 0;
  mp.clear();
  mp[0] = i;
};
```

复杂度：`O(n)`  


PS: 比赛的时候，我以为回退会导致复杂度退化为 `O(n^2)`，所以做了一个优化：不真实回退，对需要回退的区间做一个标记，结果导致代码特别复杂。  
赛后分析复杂度，每一段最多回退一次，复杂度不会变。  


看了榜单上其他人的代码，为了避免遇到新字符时而各种更新两个字符的状态，他们是直接枚举两个字符的组合，共三种情况。  
此时字符就固定了，遇到新字符时，直接清空即可。    


```cpp
int SolverTwo(const string& s, char now, char pre) {
  int ans = 0;
  unordered_map<int, int> mp;  // diff, idx
  int diff = 0;                // a-b
  mp[0] = 0;
  for (int i = 1; i <= n; i++) {
    const char c = s[i - 1];
    if (c != now && c != pre) {
      diff = 0;
      mp.clear();
      mp[0] = i;
      continue;
    }
    if (c == now) {
      diff++;
    } else if (c == pre) {
      diff--;
    }
    if (mp.count(diff)) {
      ans = max(ans, i - mp[diff]);
    } else {
      mp[diff] = i;
    }
  }
  MyPrintf("Solver2 ans=%d\n", ans);
  return ans;
}
// 字符为 2 个的场景
ans = max(ans, SolverTwo(s, 'a', 'b'));
ans = max(ans, SolverTwo(s, 'b', 'c'));
ans = max(ans, SolverTwo(s, 'c', 'a'));
```


## 四、完全平方数的祖先个数总和  


题意：给一个有根无向树，问每个节点的祖先中，有多少祖先与节点的乘积是平方数。  


思路：DFS  


首先预处理所有节点的值，消除平方因子，此时每个质因子只会出现一次。  
如果一个节点与祖先的乘积是平方数，则这个节点肯定和祖先的质因子完全相同，即等于祖先的值。  


基于上面的推论，DFS 时把祖先的值储存在哈希表中，判断有多少个相等即可。  


```cpp
void Dfs(int u, int pre) {
  ans += valFlag[nums[u]];
  valFlag[nums[u]]++;
  for (auto v : g[u]) {
    if (v == pre) continue;
    Dfs(v, u);
  }
  valFlag[nums[u]]--;
}
```


至于消除平方因子，可以枚举平方数的因子，判断是否存在平方因子。  


```cpp
for (auto& v : nums) {
  int sq = sqrt(v) + 1;
  for (int i = 2; i <= sq; i++) {
    while (v % (i * i) == 0) {
      v /= (i * i);
    }
  }
}
```


## 五、最后  


这次比赛第三题比较复杂，需要分三种情况来讨论。  
且对于第二种双字符的情况，再次枚举三种组合的情况来做会简单一些，否则需要自己维护组合变化时的状态更新，难度就加大不少。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
