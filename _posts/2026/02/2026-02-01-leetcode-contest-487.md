---
layout: post
title: leetcode 周赛 487 - 第 47 名
description: 博弈论说简单也简单，说难也难
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2026-02-01 12:13:00
published: true
---


## 零、背景



这次比赛第二题是博弈论，难倒不少人。  



A 题：统计  
B 题：博弈论  
C 题：正反查索引  
D 题：前缀和  



**最终排名**：47 名  
**代码仓库**：详见 <https://github.com/tiankonguse/leetcode-solutions>  



## 一、Q1. 统计单比特整数



题意：给一个数字 n，问区间 `[0,n]` 内「二进制各位都相同」的数字有多少个。  



思路：统计  



一个数字二进制各位都相同，要么全是 0（也就是 0），要么全是 1（形如 `1`、`11`、`111`）。  
满足要求的正整数加上 1，会变成一个 1 后面全是 0，也就是一个 2 的幂。  



所以答案等价于统计不超过 `n+1` 的幂数个数。



## 二、Q2. 删除子数组后的最终元素




题意：给一个数组，A 和 B 轮流删除一个连续子数组，直到剩余一个元素。  
A 的目标是让最终剩余元素最大，B 的目标是让最终剩余元素最小；A 先手，问最终剩余的元素值是多少。  



思路：博弈论  



设数组第一个元素是 `a1`，最后一个元素是 `an`。不妨先假设 `a1 > an`。  



显然，A 可以直接删除后缀子数组 `[2,n]`，让数组只剩下一个元素 `a1`。  
如果 A 不选这个策略，要么从中间删除一段子数组（删掉一段连续区间），要么删掉一段前缀/后缀但不至于只剩一个元素。  



假设 A 选择删除中间一段子数组，那么剩余数组仍然以 `a1` 开头、以 `an` 结尾。  
此时 B 可以删除前缀，只保留 `an`，使得最终结果小于 `a1`。  
因此 A 不会选择这种走法。  



同理，假设 A 删除后缀，剩下的是前缀 `[a1, ..., ak]`，且若 `ak < a1`，B 依旧可以删除前缀只保留 `ak`，让结果小于 `a1`。  
所以在 A 选择保留前缀的前提下，必须保证收尾的值不劣于 `a1`；而 B 为了把结果压低，会在有机会时直接删掉后缀 `[2,k]`，只保留 `a1`。  
如果 B 不这么做，A 就有机会通过再删一段前缀/后缀，让最终留下的元素大于 `a1`。  


因此，最终答案答案肯定是 a1。  


而对于 `a1=an` 的情况，也是一样的逻辑，答案是 a1。  


因此，最终答案就是 `max(a1, an)`。  



## 三、Q3. 设计共享出行系统



题意：设计一个系统，提供四个接口。  
接口 1：加入一个用户。  
接口 2：加入一个司机。  
接口 3：取消一个用户。  
接口 4：匹配一组用户与司机。  



思路：时间线正反查索引  



由于匹配时按先到先得的规则进行匹配，所以需要维护两个队列。  


又由于存在取消操作，所以队列需要支持“按 id 删除”。  



这种情况下，一般是维护一个全局时间线（时间戳递增），并维护时间戳与用户/司机之间的正反向映射关系。  
根据时间线就可以按时间顺序有序得到用户和司机，从而完成匹配。  



当需要删除时，先拿到该用户（或司机）对应的时间戳，再从时间线索引中删除即可。  



```cpp
unordered_map<int, int> driverFlag;
unordered_map<int, int> riderFlag;
map<int, int> drivers;
map<int, int> riders;
int t = 0;

void addRider(int riderId) {
  t++;
  riderFlag[riderId] = t;
  riders[t] = riderId;
}
vector<int> matchDriverWithRider() {
  if (drivers.empty() || riders.empty()) {
    return {-1, -1};
  }
  int driver = drivers.begin()->second;
  int rider = riders.begin()->second;
  cancelRider(rider);
  cancelDriver(driver);
  return {driver, rider};
}
```



## 四、Q4. 移除至多一个元素后的最长交替子数组



题意：给一个数组，移除至多一个元素后，求最长交替子数组长度。  
交替定义：相邻元素值在“严格大于”和“严格小于”之间交替出现。  



思路：前缀和  



新增两个定义：  

上升交替：最后一个元素严格大于前一个元素。  
下降交替：最后一个元素严格小于前一个元素。  



预处理出每个位置的前缀最长上升/下降交替长度，以及后缀最长上升/下降交替长度。  



```cpp
 for (int i = 2; i <= n; i++) {
   int nowVal = nums[i - 1];
   int preVal = nums[i - 2];
   if (nowVal > preVal) {
     pre[i][UP] = pre[i - 1][DOWN] + 1;
   } else if (nowVal < preVal) {
     pre[i][DOWN] = pre[i - 1][UP] + 1;
   }
   ans = max(ans, max(pre[i][UP], pre[i][DOWN]));
 }
```



然后枚举删除一个位置，根据左右元素的大小关系，计算拼接后的最长交替。  



```cpp
for (int i = 2; i < n; i++) {
  int preVal = nums[i - 2];
  int sufVal = nums[i];
  if (preVal > sufVal) {
    ans = max(ans, pre[i - 1][UP] + suf[i + 1][DOWN]);
  } else if (preVal < sufVal) {
    ans = max(ans, pre[i - 1][DOWN] + suf[i + 1][UP]);
  }
}
```



## 五、最后



这次比赛第二题很多人可能没见过，会有一定难度。  
第三题不少人看到题目说每个用户和司机只出现一次，可能会偷懒不维护正反查索引，直接使用队列，进而在取消场景下遇到 bad case。  



也正是这两个因素，我才有机会进到前 50 名吧。  



《完》  



-EOF-  



本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code  
