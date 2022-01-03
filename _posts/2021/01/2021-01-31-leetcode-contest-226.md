---   
layout:     post  
title: leetcode 第 226 场算法比赛  
description: 思路不顺，第一题写了十几分钟，排名依旧是一百名外摇摆。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-01-31 21:30:00  
published: true  
---  


## 零、背景  


这次比赛脑子总是卡壳，思路想着想着就不知道想到哪了，然后重新读题、重新思考。  


这难道就是年龄大了的缘故吗？  



看来不少人卡壳。   


![](//res.tiankonguse.com/images/2021/01/31/001.png)  


源代码：

https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/2/226  



## 一、盒子中小球的最大数量  


题意：给编号 `[lowLimit ,highLimit]`的小球，以及 `[1,infinity]`的盒子。  
一个小球可以放在小球编号上每位数字之和对应的盒子里。  
问小球数量最多的盒子里面，小球最多有多少个。  


思路：求放盒子的逻辑我不知怎么，一直没看懂，读了十分钟题目。  


看懂后，直接暴力计算每个小球应该放在哪个盒子里，然后遍历所有盒子求球的最大值即可。  


```
int countBalls(int lowLimit, int highLimit) {
    unordered_map<int, int> m;
    
    int ans = 0;
    for(int i=lowLimit;i<=highLimit;i++){
        int sum = 0;
        int tmp = i;
        while(tmp){
            sum += tmp%10;
            tmp /= 10;
        }
        
        m[sum]++;
        ans = max(ans, m[sum]);
    }
    
    return ans;
}
```


## 二、从相邻元素对还原数组  


题意：给 n 个互不相同的数字，现在不知道数字的顺序，但是知道相邻数字的关系。  
现在告诉你 `n-1`对数字关系，求数字的顺序（正序或反序都可以）。  


思路：可以当做图论题来做，找到入度为1 的起点，搜索即可。  


注意事项：中间的点度数都是 2，搜索的时候，对搜过的点左下标记即可。  
我是直接标记来源的父节点的，因为图是链，父节点是唯一的。  


```
int n = m.size();

vector<int> ans;
ans.reserve(n);

int preStart = start;
for(int i=0;i<n;i++){
    ans.push_back(start);
    
    auto& p = m[start];
    
    int newStart = start;
    for(auto v: p){
        if(v != preStart){
            newStart = v;
        }
    }
    preStart = start; // 更新父节点
    start = newStart; // 更新当前节点
}
return ans;
```

## 三、吃糖果  


题意：有 n 类糖果，每类有若干个。  
糖果每天至少需要吃一个，而且必须按类数的编号从小到大吃（可以同时吃多类糖果）。  
问在每天至多吃 cap 糖果的情况下，第 x 天是否可以吃到第 y 类糖果。  


思路：一看是看到题我是懵逼的。  
思考了一下发现就是个前缀和的问题。  


问题我们可以转化一下，问在每天至多吃 cap 的糖果下，都能在哪些天吃到第 y 类糖果。  


明显可以看出，答案是一个连续区间。  
最大的天数肯定是每天吃一个，最大天数就是 `sum[0~y]-1` 了。  
最小的天数则是每天吃 cap 个糖果，最小天数就是 `sum[0~y-1]/cap`了。  


处理好加一减一问题，得到天数区间，判断询问的天数是否在这个区间内即可。  



```
for(auto& p: queries){
    int type = p[0];
    ll day = p[1];
    ll cap = p[2];
    
    ll minDay = 0, maxDay = 0; // [minDay ,maxDay]
    if(type > 0){
        minDay = sum[type - 1]/cap;
    }
    maxDay = sum[type] - 1; 
    ans.push_back(day >= minDay && day <= maxDay);
}
```


## 四、回文串分割 IV  


题意：给一个字符串，问能否将字符串分隔为三个连续子串，每个子串都是回文串。  



思路：刚看到题，感觉会很难。  
但是一看数据范围，只有 2000，那果断暴力枚举了。  


使用`O(n^2)`的复杂度预处理出所有连续子串是否是回文子串。  
然后再使用 `O(n^2)`的复杂度枚举所有分隔情况是否是答案。  


```
n = s.length();
memset(dp, 0, sizeof(dp));

for(int i=0;i<n;i++){
    TryCenter(i, i);  // i 为中心
    TryCenter(i-1, i); // i-1~i 为中心
}

for(int l=1;l<n;l++){
    for(int r=l;r<n-1;r++){
        // [0, l-1], [l, r], [r+1, n-1]
        if(dp[0][l-1] && dp[l][r] && dp[r+1][n-1]){
            return true;
        }
    }
}
return false;
```


## 五、最后  


这次比赛题目没涉及复杂的算法，都是基本数据结构。  
剩下的就是注意边界问题以及练手速了。  





加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

