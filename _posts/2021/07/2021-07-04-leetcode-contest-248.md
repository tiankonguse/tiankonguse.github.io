---   
layout:     post  
title: leetcode 第 248 场算法比赛  
description: 后缀数组我还不会，有必要学习一下了。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-07-04 21:30:00  
published: true  
---  


## 零、背景  

这次比赛前三题非常简单，第四题是后缀数组模板题，，可是我还不会后缀数组，所以就没做出来了。  


## 一、基于排列构建数组  


题意：给一个排列`num`，求每个位置置换为`nums[nums[i]]`后的排列。  


思路：循环模拟即可。  


```
vector<int> buildArray(vector<int>& nums) {
    vector<int> ans(nums.size());
    for(int i=0;i<nums.size();i++){
        ans[i] = nums[nums[i]];
    }
    return ans;
}
```


## 二、消灭怪物的最大数量


题意：给若干怪物的位置与速度，每一分钟开始那一刻可以杀死任意一个怪物，问在怪物到达城市之前，最多可以杀死多少个怪物？  

边界：如果整点怪物到达，必须在整点之前的那一分钟杀死怪物。  


思路：预处理出所有怪物应该在哪一分钟杀死，然后扫描每一分钟并杀死一个可以杀死的怪物，然后判断是否有剩余，有了则代表怪物到达城市，游戏结束。  



```
int eliminateMaximum(vector<int>& dist, vector<int>& speed) {
    int n = dist.size();
    vector<int> times(n);
    for(int i=0;i<dist.size();i++){
        times[i] = dist[i] / speed[i] - (dist[i] % speed[i] == 0 ? 1 : 0);
    }
    sort(times.begin(), times.end());

    int ans = 0;
    for(int i=0;i<n;i++){
        if(i > times[i]){
            break;
        }
        ans++;
    }
    return ans;
}
```


## 三、统计好数字的数目  


题目：如果一个数字字符串的偶数位都是偶数，奇数位都是素数，则称为好数字。  
现在求所有 n 位数字字符串中，好数字的个数。  


边界：允许有前缀 0.  


思路：既然允许有前缀 0，每一位互相独立，偶数有 5 中选择，奇数有 4 中选择，全部相乘即可。  


```
class Solution {
    ll powMod(ll a, ll b, ll c){
        ll res = 1LL;
        while (b) {
            if(b & 1) res = res * a % c;
            a = a * a % c;
            b >>= 1;
        }
        return res;
    }
public:
    int countGoodNumbers(long long n) {
        ll odd = n/2;
        ll even = n - odd;
        return (powMod(5, even, mod) * powMod(4, odd, mod)) % mod;
    }
};
```


## 四、最长公共子路径  

题意：给 n 个整数数组，求最长公共子数组的长度。  


思路：显然是后缀数组模板题，可是我不会后缀数组，网上又没搜到现场的多字符串最长公共子数组模板，所以最后也没做出来。  


其实我之前自己也使用非后缀数组做过这类题。  


![](https://res.tiankonguse.com/images/2021/07/04/001.png)


不过现在我一看题型就想到后缀数组。  
思维形成定式，再去想其他方法，就总是被后缀数组思想干扰了。  


后面还是要学习下后缀数组才行，不然比赛就有点吃亏了。  


## 五、最后  


这次比赛最后一题你是怎么做的呢？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

