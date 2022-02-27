---   
layout:     post  
title: leetcode 第 256 场算法比赛  
description: 最后一题模板题，我看成后缀数组了，粗心大意。     
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-08-29 21:30:00  
published: true  
---  


## 零、背景  


这次比赛最后一题是动态规划题，但是我看错题，当成后缀数组题了。  


大家都知道，我不会后缀数组。   
之前我曾使用二分排序代替了tire树，突然发现使用二分排序也可以代替后缀数组。   
于是我就使用二分排序的方法去构造后缀数组。   


敲完时比赛差不多结束了，一运行代码，发现答案偏小，再一看题，求得是子序列，不是子串。  


这次比赛有翻车了，来看看四道题吧。  


## 一、学生分数的最小差值  


题意：给一个数组，求一个大小为 k 的子集合，使得集合里的最大值与最小值的差值最小。  


思路：排序后滑动窗口接口。  


## 二、找出数组中的第 K 大整数  


题意：给一个字符串大整数数组，求第 K 大整数。  


思路：一种是转化为整数，排序即可；更简单的是直接排序。   


```
string kthLargestNumber(vector<string>& nums, int k) {
    sort(nums.begin(), nums.end(), [](string&a, string& b){
        if(a.length() == b.length()) {
            return a > b;
        }else {
            return a.length() > b.length();
        }
    });
    return nums[k-1];
}
```


## 三、完成任务的最少工作时间段  


题意：给 n 个任务，以及最大时间段。  


-）条件1：工作时间超过最大时间段，需要休息一会。  
-）条件2：每个任务必须连续完成。  
-）条件3：如果一个任务完成，可以立马开始下个任务。  


求最少需要多少个时间段。  



根据条件2与条件1，可以推导出一个任务不能拆分的。  
对于不可拆分的任务，进行调度，那就是动态规划问题。  


考虑到数据量不大，直接使用状态压缩即可。  


由于需要枚举子集合，可以将枚举子集合的过程也状态化。  
状态定义：`dp[mask][left_buffer]`。  
状态解释： mask 任务加一个 `left_buffer` 时间最少可以使用多少个时间段完成任务。  


状态转移：枚举每一个任务，尝试分配到 `left_buffer` 时间内，然后递归即可。  
如果 `left_buffer` 不够了，就重新分配一个新的 left_buffer 时间段。   
复杂度：`O(2^n * n)`


```
int dp[2<<14][16];
int Dfs(const int mask, const int left_time){
    if(dp[mask][left_time] != -1) {
        return dp[mask][left_time];
    }
    if(mask == 0) {
        return dp[mask][left_time] = 0; // 出口
    }

    int ans = inf;
    for(int i=0;i<n;i++) {
        int maski = 1<<i;
        if((maski & mask) == 0) continue;
        if(tasks[i] > left_time) continue;
        ans = min(ans, Dfs(mask^maski, left_time - tasks[i]));
    }
    
    if(ans == inf) {
        ans = 1 + Dfs(mask, sessionTime); // 分配一个新的时间段
    }
    return dp[mask][left_time] = ans;
}
```


一种优化思路：写题解的时候，想到了背包问题。  
状态压缩相当于枚举了所有的背包状态，显然有不少浪费，毕竟很多状态不是最优的。  


所以能不能使用背包的思路来优化这道题呢？  
大家可以思考下。  



## 四、不同的好子序列数目  


题意：给一个二进制字符串，问不同的非0前缀非空子序列的个数。  


思路：比赛的时候我看错题了，看成求不同子串，然后去研究后缀数组去了。  


大家都知道，我不会后缀数组。   
之前我曾使用二分排序代替了tire树，突然发现使用二分排序也可以代替后缀数组的倍增算法。   
于是我就使用二分排序去构造后缀数组了。   


敲完时比赛差不多结束了，一运行代码，发现答案偏小，再一看题，求得是子序列，不是子串。  


既然是求不同的子序列，典型的动态规划题，之前的原题了。  


假设所有的元素值都不同，就等价与求所有的子序列。  
状态转移方程是`dp[i] = dp[i-1] * 2`。  
即选择或不选择的问题。  


那现在有相同的值，选择当前元素时，可能有若干个重复序列。  
那有多少个重复序列呢？ 或者重复的序列有什么特征呢？  


假设选择当前元素，且值是 `val[i]`。  
重复的序列肯定也都是以 `val[i]` 结尾。   


假设之前最后一次出现值 `val[i]` 的位置是 j，即 `val[i]=val[j]`  
由此可以发现， `j` 为结尾的所有子序列，都会与 `i` 为结尾的子序列重复。  
而且反过来也成立， `val[i]` 为结尾且重复的子序列，肯定也都是以 `val[j]` 结尾的。  


假设 `j` 之前有 `dp[j-1]` 个不同子序列。  
则选择 `i` 时，会新增`dp[j-1]` 个重复的子序列。  
因此需要减去这些重复的子序列。  


综合可以得到状态转移方程：  


```
dp[i] = dp[i - 1] * 2 - dp[j - 1]
```


这道题还要求不能有前缀`0`，所以需要从后到前处理，遇到`1`时再统计答案。  


注意实现：由于存在减法，可能会得到负数，需要进行修正。  



```
int numberOfUniqueGoodSubsequences(string& str) {
    int n = str.length();
    ll ans = 0;
    bool hash_zero = false;
    
    ll pre_val_ans[2] = {0, 0};
    ll pre_ans = 1;
    
    for(int i = n - 1; i >= 0; i--) {
        int v = str[i] - '0';
        
        ll add = (pre_ans - pre_val_ans[v] + mod) % mod;
        pre_val_ans[v] = pre_ans;
        pre_ans = (pre_ans + add) % mod;
      
        if(v == 1) {
            ans = (ans + add) % mod;
        } else {
            hash_zero = true;
        }
    }
    
    if(hash_zero) {
        ans = (ans + 1) % mod;
    }
    return  ans;
}
```


## 五、最后  


这次比赛整体都不难，但是最后一题我看错题了。  


当然，其实我不看错题我也不会做，因为之前没做过。  
但是我会去网上搜模板，看懂模板后就可以通过了。  



思考题：第三题你是怎么做的？能不使用状态压缩而使用背包解决吗？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

