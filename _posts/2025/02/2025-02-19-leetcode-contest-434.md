---
layout: post  
title: leetcode 第 434 场算法比赛  
description: 据说最后一题非常难。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]  
categories: [算法]  
updateData: 2025-02-19 12:13:00  
published: true  
---


## 背景  


我多年来一直在坚持参加 leetcode 周赛，并发布题解。  
现在整理了一个[leetcode 周赛题解大全](https://mp.weixin.qq.com/s/64TblIROBAfZNim89kylHw),每月更新一次。  
地址为：https://mp.weixin.qq.com/s/64TblIROBAfZNim89kylHw  


春节后一周我请了几天假，周日还在路上，所以没有参加比赛。  
现在趁着周末，把比赛补一下，到目前为止缺少的3场比赛就全部补完了。  


A: 前缀和  
B: 模拟 
C: 枚举+前缀和
D: 枚举+拓扑排序    


排名：未参加比赛  
代码地址： https://github.com/tiankonguse/leetcode-solutions/tree/master/contest  


## 一、统计元素和差值为偶数的分区方案  


题意：给一个数组，拆分为两个数组，问有多少种拆法可以使得左边子数组和减去右边子数组和差值为偶数。  


思路：预处理前缀和后缀和，枚举分割线，两个子数组和求差，判断是否是偶数。  


## 二、统计用户被提及情况  


题意：有 n 个用户，m 个指令，问指令操作完之后，每个用户被通知多少次。  


4个操作如下：  
操作1：某时刻通知指定用户列表  
操作2: 某时刻通知所有用户  
操作3: 某时刻通知所有在线用户  
操作4：某时刻指定用户下线，60秒后自动上线。  


思路：  模拟  


操作4可以拆分为2个才做：指定用户下线与指定用户上线。  
然后对所有操作按时间排序，时间相同时，优先上线，其次下线，最后通知。  
最后，按时间线进行操作，累计计算每个用户被通知次数即可。  


## 三、子数组操作后的最大频率  


题意：给一个数组，可以选择一个子数组将值全部加x，问操作后数组中 k 出现的最大频率。  


思路：枚举。  


数组的值域只有50，可以枚举准备把子数组的哪个值加到 k。  
假设选择的值是 a，则问题就转化为了，选择一个子数组，把子数组中的 a 修改为 k，k修改为其他值，问最终数组有多少个 k。  


假设选择的子数组区间是 `[L,R]`，则使用答案如下：  


```cpp
ans = count(1,n, k) + count(L,R, a) - count(L,R, k)
    = count(1,n, k) + diff(L, R, a, k)
```

假设 R 固定，最优答案就是 `max(diff(i, R, a, k))`。  


假设 R 为结尾的所有前缀 `[i, R]` 的 diff 和最优答案都已经计算出来了，怎么才能计算出 `[i,R+1]`的所有 diff 与 最优答案呢？  
显然，对于 `i<R+1`时，多有的 `[i,R]` 追加上后缀 `nums[R+1]` 就是 `[i,R]`。  


基于 `nums[R+1]` 的值，分三种情况：  


1）等于 a，区间 `[i,R]` 的 diff 都加1。  
2）等于 k，区间 `[i,R]` 的 diff 都减1。  
3）等于其他，区间 `[i,R]` 的 diff 不变。  


另外，这里还会新增一个区间 `[R+1,R+1]`，根据`nums[R+1]`的值可以决定是-1、0、1。  



到目前为止，我们就可以使用线段树的区间操作来做这道题了。  


其实，可以发现，对于`[1,R]`是整体操作的，我们只需要记录最优值即可。  
加入 `[R+1]` 后，两个取 max 就是 `[1,R+1]`的最优值了。  


复杂度枚举 `O(50)`，计算最优值 `O(n)`  
综合复杂度`O(50n)`  


## 四、最短公共超序列的字母出现频率  


题意：给一个字符串数组，所有字符串长度为2，出现的字符集合大小为16。  
求一个最短的超序列，使得所有字符串都是超序列的子序列。  


思路：贪心枚举  


假设字符集合大小为 m，值域为 `[a,b]`，可以证明，超序列的长度不可能超过 `2m`。  
证明：可以构造字符串 `S=a...ba...b`，则对于任意一个长度为2的字符串，左半部选择对应字符，右半部选择对应字符，即可找到对应的子序列。  


另外还可以发现 S 字符串的特征：左半部的 `a..b` 顺序任意打散，不影响答案。  


根据这个特征，可以得出几个结论：  
1）如果一个字符出现两次，则这个字符肯定在超序列的两端。  
2）如果有多个字符出现两次，则所有的这些字符都出现在超序列的两端，且这些出现2次的字符的顺序不影响答案。  
3）所有的2字符都在两端，则所有出现1次的字符只能在中间。  


上面的结论汇总一下就是：出现2次的字符在两端不影响答案可以忽略，出现1次的字符是连续的，判断是否满足要求即可。  
忽略出现两次的字符后，出现1次的字符的字符串转化为有向图，问题就转化为了有向图是否可以进行拓扑排序。  


那怎么知道哪些字符只出现两次其他的只出现一次呢？  
枚举即可，共`O(2^16)`种情况。  
枚举确定哪些只出现一次后，再构造拓扑图，进行拓扑排序即可。  


```cpp
int nowAns = charNum * 2;
vector<int> ansList;
const int M = 1 << m;
for (int mask = 0; mask < M; mask++) {  // 枚举哪些字符出现1个
  const int oneNum = __builtin_popcount(mask);
  const int twoNum = charNum - oneNum;
  const int tmpAns = twoNum * 2 + oneNum;
  if (tmpAns > nowAns) continue;
  const bool ok = Check(mask);
  if (ok) {
    if (tmpAns < nowAns) {
      ansList.clear();
    }
    ansList.push_back(mask);
    nowAns = tmpAns;
  }
}
```


直接状态压缩枚举时，可以发现，会超时。  
分析原因，1越多，答案越小。  


所有我们需要先枚举数量多的1，依次减少，一旦找到答案，就不需要枚举更少的1了。  
这个可以通过 Bfs 来得到。  


```cpp
const int M = 1 << m;
vector<int> flag(M, 0);
queue<int> que;  // bfs 枚举所有1
que.push(M - 1);
flag[M - 1] = 1;

while (!que.empty()) {
  const int mask = que.front();
  que.pop();

  const int oneNum = __builtin_popcount(mask);
  const int twoNum = charNum - oneNum;
  const int tmpAns = twoNum * 2 + oneNum;
  if (tmpAns > nowAns) continue;  // 答案更大，说明后面的都会更大

  const bool ok = Check(mask);
  if (ok) {
    if (tmpAns < nowAns) {
      ansList.clear();
    }
    ansList.push_back(mask);
    nowAns = tmpAns;
  } else {  // 当前没有答案，加入所有的儿子
    for (int i = 0; i < m; i++) {
      if (mask & (1 << i)) {
        const int child = mask ^ (1 << i);
        if (flag[child] == 0) {
          que.push(child);
          flag[child] = 1;
        }
      }
    }
  }
}
```

枚举复杂度：`O(2^16)`  
拓扑排序复杂度：`O(E)`, E 为边的个数。  
 

## 五、最后  


这次比赛最后一题很难想，看榜单只有20个人做出四道题，我这水平，比赛的时候肯定也做不出来吧。  

《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  