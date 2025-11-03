---
layout: post
title: leetcode 周赛 474
description: 二分、数位DP、反悔贪心 
keywords: 算法,leetcode,算法比赛
tags: [算法, leetcode, 算法比赛]
categories: [算法]
updateDate: 2025-11-02 12:13:00
published: true
---

## 零、背景

9点就起床了，本来要参与这次比赛的，但是想了想，先写 CSP-S 比赛的题解比较重要。  
于是花了一天时间将 CSP-S 的所有题目按数据范围分类并写完题解。  


现在找时间把 Leetcode 周赛的题目也做了一下，发现题目都比较简单。  


A: 排序遍历  
B: 贪心+最大值、次大值  
C: 二分+数学计算  
D: 数位DP+反悔贪心    


排名：无  
代码地址： <https://github.com/tiankonguse/leetcode-solutions>  


## 一、找出缺失的元素  


题意：给一个没有重复元素的数组，问最小值和最大值之间的数字中，哪些数字没有出现在数组中。  


思路：排序遍历。  


先排序找到最小值和最大值，然后定义一个变量 idx 从最小值开始遍历数组。  
对于每个数字 num，如果 idx 小于 num，则说明 idx 没有出现在数组中，加入答案，并将 idx 自增，直到 idx 等于 num。  


```cpp
int idx = minVal;
for (auto num : nums) {
  while (idx < num) {
    ans.push_back(idx);
    idx++;
  }
  idx++;
}
```


## 二、一次替换后的三元素最大乘积  


题意：给一个数组，可以任意替换一个元素为任意值，问替换后，数组中任意三个元素乘积的最大值是多少。  


思路：贪心+最大值、次大值。  


由于有一个元素可以替换，所以我们只需要先看两个元素的乘积最大值是多少。  
还是由于这个元素可以任意替换，对于两个元素为负数的情况，替换的元素也可以是负数，从而依旧可以得到一个正数的乘积。  


因此，我们不需要关心数字的符号，直接求绝对值的最大值和次大值即可。  


```cpp
const ll maxVal = 1e5;
sort(nums.begin(), nums.end(), [](int a, int b) { return abs(a) > abs(b); });
ll a = abs(nums[0]);
ll b = abs(nums[1]);
return a * b * maxVal;
```


优化：如果不想排序的话，可以维护一个大小为 2 的最小堆。  


```cpp
// 只保存两个绝对值最大的元素
priority_queue<ll, vector<ll>, greater<ll>> que;
for (ll v : nums) {
  v = llabs(v);
  que.push(v);
  if (que.size() > 2) {
    que.pop();
  }
}
```

## 三、完成所有送货任务的最少时间  


题意：有两个无人机，分别需要送 D1 和 D2 个货物，每次消耗一小时。  
第一个无人机每 R1小时时需要休息一小时，第二个无人机每 R2 小时需要休息一小时。  
问最少需要多少小时可以完成所有送货任务。  


思路：二分+数学计算。  


首先明确题意，休息是周期的，每 R1 小时休息一小时指的是 `[1, R1-1]` 期间不休息，第 R1 小时休息一小时。  


很容易发现，这个是两个数字的容斥问题。  


第一个无人机休息时，第二个无人机可以继续送货。  
第二个无人机休息时，第一个无人机可以继续送货。    
两个无人机都休息时，没人送货。  


那到底需要多少小时呢？  
这个确实不好计算，但是如果先给一个时间 T 后，我们就可以根据容斥原理快速判断能不能完成任务。  


例如给定一个 T，可以得到四个时间：  


1）都休息的时间：`t12=T/LCM`  
2）第一个无人机休息的时间：`t1=T/R1 - t12`     
3）第二个无人机休息的时间：`t2=T/R2 - t12`    
4）都不休息的时间：`t0=T - t1 - t2 - t12`  


那对于每个无人机，优先在对方休息时区运送货物，不够了，再在都不休息的时间区运送货物。  
这样就可以判断在 T 时间内，是否能完成任务。  


```cpp
// 注意：变量名在文中用大写 R1/R2，这里示例代码使用小写 r1/r2/r1/r2 以匹配常见实现。
const long long lcm = r1 / __gcd(r1, r2) * r2;
auto OK = [&](long long mid) -> bool {
  long long x12 = mid / lcm;                // 两者同时休息的小时
  long long x1 = mid / r1 - x12;            // 仅第一个无人机休息的小时
  long long x2 = mid / r2 - x12;            // 仅第二个无人机休息的小时
  long long x0 = mid - x1 - x2 - x12;       // 都不休息的小时
  long long leftR1 = max(d1 - x2, 0ll);    // 第1号无人机需要在非x2时间里完成的任务
  long long leftR2 = max(d2 - x1, 0ll);    // 第2号无人机需要在非x1时间里完成的任务
  return x0 >= leftR1 + leftR2;
};
```

注意事项：对方休息的时间可能大于自己的任务量，所以要取 max 避免负数。  


给定时间能够判断能否完成任务后，就可以用二分法来求最小的 T。  


```cpp
ll L = 0, R = 1e18;
while (L < R) {
  ll mid = L + (R - L) / 2;  // [1, mid]
  if (OK(mid)) {
    R = mid;
  } else {
    L = mid + 1;
  }
}
return L;
```

## 四、大于目标字符串的最小字典序回文排列  


题意：给一个字符串 s 和一个目标字符串 target，问 s 的字典序最小的回文排列中，大于 target 的字符串是什么。  


思路：贪心数位DP。  


这道题出现过很多次了，记得在上次或上上次的比赛中也出现过一模一样的题目。  


先排除不是回文串以及最大回文串都不满足的情况。  


```cpp
// 先判断 s 的字符能否组成回文（最多一个字符出现奇数次）
if (!CanFormPalindrome(charCount)) {
  return "";
}
// 再判断字典序最小的回文排列是否都不大于 target，若最大回文也不满足条件可直接返回
if (!HasAns(target)) {
  return "";
}
```


之后，优先构造和 target 相同前缀的回文串。  
当无法继续相同时，选择下一个更大的字符，之后选择最小的字符完成回文串。  


这里有一个细节，就是当选择下一个更大的字符时，可能会导致无法构造回文串。  
此时需要回溯到上一个字符，尝试其他可能性，这个过程是递归的。  



```cpp
bool Dfs(int l, int r, const string& target) {
  if (l >= r) {
    return ans > target;
  }
  const int cIdx = target[l] - 'a';
  if (charCount[cIdx] > 0) {
    charCount[cIdx] -= 2;
    ans[l] = ans[r] = target[l];
    if (Dfs(l + 1, r - 1, target)) {
      return true;
    }
    charCount[cIdx] += 2;
  }
  
  // 尝试设置为大于 target[l] 的最小字符
  for (int i = cIdx + 1; i < 26; i++) {
    if (charCount[i] == 0) continue;
    // 找到了一个比 target[l] 更大的字符，放上后用最小字典序补齐剩余位置
    charCount[i] -= 2;
    ans[l] = ans[r] = 'a' + i;
    return BuildMinAns(l + 1, r - 1);
  }
  return false; // 无法构造,需要回溯
}
```


小技巧：对于奇数长度的回文串，中间字符可以提前处理掉，这样就可以统一成偶数长度的回文串来处理。  


```cpp
ans.resize(n, oddVal);
if (oddVal != ' ') {
  // ans[n / 2] = oddVal;
  charCount[oddVal - 'a']--;
}
```

## 五、最后  


这次比赛总体不难，第三题二分，第四题数位DP与反悔贪心，都是比较经典的题型。  




《完》

-EOF-

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号 ID： tiankonguse-code
