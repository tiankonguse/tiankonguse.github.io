---   
layout:     post  
title: leetcode 第 224 场算法比赛  
description: 方向想错了，时间就不足了。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-01-17 21:30:00  
published: true  
---  


## 零、背景  


继续参加 leetcode 的周赛。  


这次比赛，终于出了一道 ACM 中的博弈题，国内只有 22 人通过，我也没通过。  


## 一、可以形成最大正方形的矩形数目  


题目：给若干矩阵，问边长最长的正方形的个数。  


思路：统计题。  


最简单的方法是第一次循环找到最大的边长，第二次循环查看个数。  


思路理解了，两层循环可以合并为一个循环，边循环边计数即可。  


```
int countGoodRectangles(vector<vector<int>>& rectangles) {
    int maxLen = 0, maxNum = 0;
    for(auto & v: rectangles){
        int len = min(v[0], v[1]);
        if(len == maxLen){
            maxNum++;
        }else if(len > maxLen){
            maxLen = len;
            maxNum = 1;
        }
    }
    return maxNum;
}
```


## 二、同积元组  


题意：给一个互不相同的数组，问存在多少个四元组，使得 前两个数字的乘积与后两个相同。  


思路：由于有互不相同这个限制，题目就简单多了。  


最简单的方法是先两层循环预处理出任意两个数字的乘积。  
再遍历所有乘积，每个乘积取`C(n,2)*8` 即可。  


为啥乘以 8 呢，因为四个数字位置不同算不同元素，一组数字可以拼出 8 组答案（第一组测试样例）。  


这个和第一题一样，理解原理了，可以直接两层循环计算出答案。  


合并的原理是 `C(n,2) = 1 + 2 + ...  + n`。  


```
int tupleSameProduct(vector<int>& nums) {
    unordered_map<int, int> m;
    int ans = 0;
    for(int i=0;i<nums.size();i++){
        for(int j=i+1;j<nums.size();j++){
            int sum = nums[i] * nums[j];
            if(m.count(sum) > 0){
                ans += m[sum] * 8;
            }
            m[sum]++;
        }
    }
    return ans;
}
```

## 三、重新排列后的最大子矩阵  


题意：给一个`0/1`矩阵，可以交换无数次矩阵的任意两列，问最大的全 1 矩阵。  


思路：由于只可以交换列，不能交换行，突破口就在列上了。  


可以从上到下依次求出以第 `i` 行为底的子矩阵的最优答案。  


对于每一个临时子矩阵，统计底部每一列连续的 1 的个数，排序，循环求出最优答案。  
每一行的复杂度：`m * log(m)`  



总共 n 行，总复杂度：`n * m * log(n)`。  



小技巧1：求子矩阵各列 1 的个数时，可以复用上一行的答案，即连续 1 时，个数加 1，否则个数为 0。  
小技巧2：计数可以储存为 `pair<pos, num>`。按 num 排序求出最优答案，再按 pos 排序恢复相对顺序。  


## 四、猫和老鼠 II


题意：给一个矩阵，墙不能通过，猫在一个位置，老鼠在一个位置，食物在一个位置。  
问老鼠是否会获胜。  


-）老鼠可以吃到食物，则老鼠胜。  
-）猫把老鼠吃了，猫胜。  
-）猫先到达食物，猫胜。  
-）形成死循环，1000次操作内无法到达食物，猫胜。  
-）猫可以朝一个方向走`[0,catJump]`  
-）老鼠可以朝一个方向走`[0,mouseJump]`  
-）只能上下左右走  


思路：普通的博弈题，状态是收敛的，可以直接记忆化搜索 dfs 解决。  


而这道题有环，就不能使用普通的 dfs 来解决了。  


还好，题目给出了一个限制，1000 步后算猫胜。  
搜索加一个操作层数，dfs 就可以收敛了。  


所以最简单的方法是按照题意，将涉及的所有数据，猫坐标、鼠坐标、当前操作者、操作层数四个维度全存下来，就可以做出这道题了。  
复杂度：`64 * 64 * 2 * 1000`，不会超时。  


优化：其实我做这道题的时候，把 1000 次操作上限那个条件忘记了。  


所以我直接从必败点、必胜点出发，逆向去做这道题了。  


猫先到达食物，猫必胜，老鼠必败。  
老鼠先到达食物，老鼠必胜，猫必败。  
猫与老鼠在一个坐标，猫必胜，老鼠必败。  


根据这三个必胜状态，逆向的去推出其他位置的状态。  


这里涉及一个必胜与必败知识点。  


必胜：只要有一个出度是必败，当前节点就可以必胜。  
必败：所有出度都是必胜，当前节点才是必败。  


这个也很容易理解。  


不过这道题的必败不像其他博弈题那么简单。  


因为这道题的状态存在环，一个必败点，必须等所有的下游都处理完了，出度为 0 了，才能得到当前的必败答案。  


所以我们需要预处理，统计出每个点的出度。  
当计算得到一个必胜点时，相连的节点的出度都减一。  
当某个节点的出度变为 0 时，就可以得到一个必败点了。  


原理大概是这样，不知道说否描述清楚。  


## 五、最后  


这次比赛的最后一题有点意思，好久没见过博弈题了。  


建议大家都练习一下这道题，尤其是优化的版本，很锻炼思维能力。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

