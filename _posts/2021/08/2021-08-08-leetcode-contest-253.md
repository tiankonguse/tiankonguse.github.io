---   
layout:     post  
title: leetcode 第 253 场算法比赛  
description: 这次比赛题目都比较简单，排名非常靠后了。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛题目都比较简单。  


第四题一个 map WA 一次，就改成线段树了。  
十一点十分做完一看榜单，排名三百多名，那第四题肯定一个 map 就可以搞定的。   


## 一、检查字符串是否为数组前缀  


题意：给一个字符串 S 和 字符串数组。  
问字符串数组的某个前缀是否可以组成给的字符串 S。  


思路：记录偏移量，一次 cmp 即可。  
当然数据量不大，我直接把前缀逐个拼接起来，直接字符串比较。  


## 二、移除石子使总数最小  


题意：给一个整数数组代表每堆石子的数量。  
每次可以挑一堆石子，从中移除`floor(v / 2)` 个石子。  
问进行 k 次后，剩余的总石子最小数目。  


思路：想要剩余石子最少，每次操作肯定选择可以移除石子最多的堆数。  
那自然，移除石子最多的那一堆，石子移除前的数量也是最多的。  


所以维护一个最大堆即可做这道题了。  


##　三、使字符串平衡的最小交换次数  


题意：给一个长度为 n 的偶数长度字符串，其中包含 `n/2` 个左括号和 `n/2`个右括号。  
问最少交换几次字符串，可以使得字符串的括号是匹配的。  


思路：由于所有字符串的括号最终肯定是全部匹配的，那只需要从左到右贪心把不满足的右括号交换到最右边的左括号即可。  


由于需要找到最右边的左括号，可以预处理记录下来。  
从左扫描的时候，使用标准的栈判断即可（实际一个计数变量即可）。  


四、找出到每个位置为止最长的有效障碍赛跑路线  


题意：给一个障碍物数组，问每个障碍物前面的最长障碍物路线的长度。  
最长障碍物路线定义：最长的非递减子序列。  


思路：抽象一下，题目就是求每个位置为结尾的最长非递减子序列的长度。  


可以写出状态转移方程，如下  


```
dp(n) = max(dp(i) + 1), val[i] <= val[n]
```


含义：找到之前所有小于 `val[n]` 的位置的最大值。  


最简单的思路是使用线段树来维护。  
由于 `val` 的数据范围是`10^7`，可以先离散化到`10^5`，然后线段树处理即可。  


当然，也可以写出其他状态转移方程，比如：  


```
dp(n) = dp(max(val[i])) + 1,  val[i] <= val[n]
```


含义：找到第一个小于等于 `val[n]` 的值，对应的状态加一即可。  


对于这种状态转移方程，使用 map 的 `lower_bound` 即可解决。  


但是聪明的你很快会发现反例：如果一个比较小的 `val[i]` 长度更长时，`(val[i], val[n]]`之间的状态是无效的，选择了会得到错误的答案。  


所以，我们更新`dp(n)`时，需要将 `val[n]` 之后无效的状态进行清理。  
初步评估复杂度，清理的复杂度极端情况下可能是`O(n)`，这样综合复杂度就是`O(n^2)`了。  


但是再想一想，实际上不存在极端情况，如果每一步状态转移都保证不存在无效状态，则下一次清理顶多只需要清理一个，即清理的复杂度是 `O(1)`。  



代码：  


```
vector<int> longestObstacleCourseAtEachPosition(vector<int>& obstacles) {
    int n = obstacles.size();
    vector<int> ans(n, 0);
    map<int, int> m; // 维护一个递增的序列
    m[0] = 0; // 保证 begin 不为空

    int val = 0;
    for(int i = 1; i < n; i++) {
        int v = obstacles[i];
        auto it = m.lower_bound(v);

        if(it == m.begin() && it->first > v) {
            val = 1;
        } else if(it == m.end() || it->first > v){
            --it;
            val = it->second + 1;
        }else {
            val = it->second + 1;
        }

        ans[i] = m[v] = val;

        // 递增维护
        it = m.upper_bound(v);
        if(it != m.end() && it->second <= val) {
            m.erase(it++);
        }

    }
    return ans;
}
```


## 五、最后  


这次比赛的题比较简单，不过最后一题还是很有意思的。  


我这边赛前使用线段树做的，赛后改成维度一个递增的状态做的，你是怎么做的呢？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
