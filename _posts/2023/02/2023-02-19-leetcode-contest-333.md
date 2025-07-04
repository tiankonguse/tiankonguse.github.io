---   
layout:  post  
title: leetcode 第 333 场算法比赛  
description: 这次比赛题目质量挺高的。        
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2023-02-19 18:13:00  
published: true  
---  


## 零、背景  


这次比赛质量挺高的，我错误好几次比赛快结束才做完所有题，排名竟然在一百名附近。  



## 一、合并两个二维数组 - 求和法  


题意：给两个 kv 数组，相同 key 的 value 求和，求最终按升序输出 kv。  


思路：kv 先放入到 map 中求和，最后转化为数组即可。  


## 二、将整数减少到零需要的最少操作数  


题意：给一个数字，每次可以加或减一个 2 的某次幂，问最少几次操作能够将数字变为 0。  


思路：原先我想搜索，但是一计算复杂度，可能会超时。  


然后分析题意，在什么时候加或减会最优，什么时候显然不是最优答案。  


由此找到突破口。  
如果要进行加法操作，只能选择二进制中连续 1 中首次出现的位置。  
如果要进行减法操作，只能选择二进制中单独的 1，即左边和右边都是 0 才行。  


由此推论出贪心算法：扫描二进制，如果是单个 1，用减法，否则加法。  


代码比较优雅，分享出来。  


```
while (n) {
  int v = (n ^ (n - 1)) & n;
  if (n & (v<<1)) {  // 连续两个 1
    n += v;
  } else {
    n -= v;
  }
  ans++;
}
```


## 三、无平方子集计数  


题意：给若干数字，问有多少个子集的数字的乘积是无平方因子数。  
无平方因子数：无法被除 1 之外任何平方数整除的数字。  


思路：无平方因子数，说白了就是所有质因数只有一个。  


了解到质因数只能有一个，问题就简单了。  
数字最大值是 30，这个取值范围之内恰好有 10 个质数。  


显然需要使用状态压缩代表 10 个质数的乘积组合。  


定义状态：`f(n,mask)` 代表前 n 个数字子集中无平方因子数状态压缩为 mask 的答案数。  


对于 `n+1` 的数字，如果自身出现多个相同的质因数，则不能选择这个数字。  
否则分为选择与不选择这个数字。  
不选择，答案复制一遍。   
选择，需要与上个数字的状态没有交集，  


```
for (int i = 0; i < nums.size(); i++) {
  int mask = GetMsk(nums[i]);
  if (mask == -1) continue;
  next = pre;
  for (int j = 0; j < (1 << k); j++) {
    if ((j & mask) == 0) {
      next[j | mask] = (next[j | mask] + pre[j]) % mod;
    }
  }
  pre.swap(next);
}
```


## 四、找出对应 LCP 矩阵的字符串  


题意：有一个字符串 s 的矩阵，`lcp[i][j]` 代表 `s[i:n]` 与 `s[j:n]` 的最长公共前缀。  
问是否能够根据矩阵计算出字符串，如果可以输出字典序最小的字符串，否则输出空。  


思路：首先是粗粒度快速判断是不是没答案。  


条件1：矩阵必须对称。    
解释：`s[i:n]` 与 `s[j:n]`交换，答案不变。  


条件2：后缀矩阵的值不能大于后缀的长度。   
解释：与自己的公共前缀不能大于自己。  


条件3：正对角线上的值必须恰好是从 n 连续递减的。  
解释：自身与自身的公共前缀是自身。  


条件4：斜线大于 0 时，必须满足连续递减（条件3的扩展）。  
解释：`lcp(i, j)` 有大于 1 的答案，`lcp(i+1, j+1)` 肯定等于 `lcp[i][j]-1`。  


之后，我们就可以对矩阵进行并查集计算。  
默认复杂度是 `O(n^3)`  


但是有条件 4 的存在，对于斜线连续非 0 的情况，我们只需要处理第一个即可。  
这样复杂度就降低为 `O(n^2)`  


并查集创建好之后，再扫描一遍矩阵，检查`lcp(i,j)`的最大值是否是最大值。  
例如 `lcp(i,j)=k`，则检查 `(i+k,j+k)`在并查集里是否相等。    


到这一步，矩阵之间就完全没有冲突了。  


从前到后扫描字符串，从小到大分配字母即可。  


注意事项：字母最多分配 26 个，超过了也算没有答案处理。  


## 五、最后  


总的来看。第二题就贪心，第三题状态压缩动态规划，第四题并查集加一堆边界判断。  


这次比赛有点难度。  


你做出几道题，都是怎么做的呢？  
哪道题被卡主了？卡在哪里了？  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

