---   
layout:     post  
title: leetcode 第 252 场算法比赛  
description: 这次比赛题目都比较简单，做第一题时还没睡醒，错了一次。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  

这次比赛题目都比较简单。  


做第一题时我错了一次，老婆说你还没睡醒吧。  


所以做后面三道题的时候，提交前都反复确认思考，都是一次通过的。  


## 一、三除数  


题意：给一个正整数，问是否恰好三个正约数。  


思路：由于 1 和 自身都是约数，所以第三个肯定是开方得到的。  
又由于要求只能是三个，第三个开方后必须是素数。  


还要大素数表蛮麻烦的，我就直接循环暴力取模判断了。  


## 二、你可以工作的最大周数  


题意：给一个任务数组，下标是任务的编号，值是任务的个数。  
要求相同编号任务的任务不能放在一起，最长可以调度多少任务。  


思路：显然任务需要交叉调度，我们只需要看最长的任务。  
如果最长的任务个数远远大于其他任务总个数，显然最长的任务有一部分任务无法全部调度。  
如果最长的任务个数不大于其他任务总个数时，我们就可以用最长的任务与其他任务交叉调度即可。  


```
long long numberOfWeeks(vector<int>& milestones) {
    long long sum = 0;
    long long max_val = milestones[0];
    for(auto v: milestones) {
        sum += v;
        max_val = max(max_val, static_cast<long long >(v));
    }
    long long left_val = sum - max_val;
    if(left_val >= max_val - 1) {
        return sum;
    } else {
        return left_val * 2 + 1;
    }
}
```



## 三、收集足够苹果的最小花园周长  


题意：给一个无限的坐标轴，每个坐标点有一颗苹果数，苹果树上的苹果个数是坐标绝对值之和（`|i| + |j|`）。    
现在我们可以从中心坐标建一个正方形土地，问需要得到 neededApples  个评估时，正方形土地的最小周长是多少。  



思路：周长等价与一个象限的边长，所以我们只需要求一个象限的边长即可。  


纸上简单画一下可以推导出边长每增加 1 时，增加苹果的个数（`12 * n * n`）。  
那可以大概苹果出，苹果总个数与边长是三次方的关系。  


输入数据最大是 `10^15`，开三次方就是 `10^5`，暴力循环即可找到答案。  


```
ll minimumPerimeter(ll neededApples) {
    ll n = 0;
    ll sum = 0;
    while(sum < neededApples) {
        n++;
        sum += 12 * n * n;
    }
    return n * 8;
}
```


## 四、统计特殊子序列的数目


题意：给一个由 `0,1,2` 组成的数组，问有多少个特殊序列。  
特殊序列定义：分前缀 0、中缀 1、后缀 2 三部分，且每部分都至少有一个数字。  


思路：典型的动态规划。  


假设第 i 个位置已经计算出最后一个数字分别为 012 的序列答案个数，则可以计算出第 `i+1` 的状态答案。  



定义状态为 `dp[i][k]`，对于每个数字 k ，状态转移都分三种情况：  


-）不选择当前数字，状态值保持不变 `dp[i+1][k] += dp[i][k]`
-）当前数字之前已存在，当前只是重复选择 `dp[i+1][k] += dp[i][k]`  
-）当前数字之前不存在，第一次选择 `dp[i+1][k] += dp[i][k-1]`  


三种状态合并就是： `dp[i+1][k] = dp[i][k] * 2 + dp[i][k-1]`。  


对于状态 0，由于不存在上一个数字，所以第一次选择是答案加 1。  
为了保持计算统一，下标可以从 1 开始，所有`dp[i][0]`的值都设置为 1 即可保持一致。  


另外，可以发现，状态 `dp[i+1]` 只与 `dp[i]` 有关，所以可以使用滚动数组甚至一个数组上迭代计算。  



```
int countSpecialSubsequences(vector<int>& nums) {
    ll dp[4] = {1, 0, 0, 0};
    for(auto v: nums){
        v++;
        dp[v] = (dp[v] * 2 + dp[v-1]) % mod;
    }
    return dp[3];
}
```


## 五、最后  


这次题都比较简单，不过还是有不少失误的。  


老婆提醒我后，每次提交我都反复确认了几次，最后都是一次提交通过的，排名终于进了前一百名。  


不容易。  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
