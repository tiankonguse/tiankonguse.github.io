---   
layout:     post  
title: leetcode 第 237 场算法比赛  
description: 对于这些常用的需要记忆的小知识，我都在顶部头文件区域整理了一个小笔记，这里分享给大家。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-04-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛四道题都很简单，可是依旧没有进前 50 名，复盘了下有两个原因。  


第一、第四题比第三题简单，我却在第三题花了很多时间而不是先去做第四题。  


面对这种情况，以后一道题敲代码之前，先评估代码量。  
稍微复杂点了，先去看看榜单以及看看下道题的题意。  
有可能下道题两分钟就写完通过了。  


第二、第三题优先队列排序函数花了一些时间来调试。  


其实，对于这些常用的需要记忆的小知识，我都在顶部头文件区域整理了一个小笔记。  
这里也分享给大家。  



```
// lower_bound 大于等于
// upper_bound 大于
// vector/array: upper_bound(vec.begin(), vec.end(), v)
// map: m.upper_bound(v)
// vector 预先分配内存 reserve 
// 反转 reverse(v.begin(), v.end())
// sum = accumulate(a.begin(), a.end(), 0);
// unordered_map / unordered_set
// 排序，小于是升序：[](auto&a, auto&b){ return a < b; })
// 优先队列 priority_queue<Node>：大于是升序 
// struct Node{
//     int t;
//     bool operator<(const Node & that)const { return this->t > that.t; }
// };
```


PS：前几天比赛的时候，看到一个评论，逻辑奇特，分享给大家，建议大家以后不要发出这样的评论。  
评论：XX 题出的有很严重的问题，题目描述中“bulabula”一句话，如果选手没看到那句话，就不可能做出那道题。   



## 一、判断句子是否为全字母句  


题意：给一个纯字母小写字符串，问是否包含26个字母。  


思路：统计即可。  


```
bool checkIfPangram(string& sentence) {
    unordered_set<char> s;
    for(auto c: sentence){
        s.insert(c);
    }
    return s.size() == 26;
}
```

## 二、雪糕的最大数量  


题意：给n个雪糕的价格，以及你带了多少钱，问最多可以买多少雪糕。  


思路：优先买最便宜的，即排序即可。  


```
int maxIceCream(vector<int>& costs, int coins) {
    int ans = 0;
    sort(costs.begin(), costs.end());

    for(auto c: costs){
        if(c > coins){
            break;
        }
        ans++;
        coins -= c;
    }

    return ans;
}
```


## 三、单线程 CPU  


题意：给 n 个任务的允许允许时间和允许时长，现在给一个单线程CPU，规则如下。  


1）如果CPU空闲，如果没有可以运行的任务，保持空闲。  
2）如果CPU空闲，有可以执行的任务，优先选择执行时间最短的任务，如果有多个，选择下标最小的任务。  
3）一旦 CPU 运行一个任务，就不能中断，直到运行完。  
4）CPU 运行完一个任务后，可以立马运行下一个任务。  


求任务的执行顺序。  



思路：题意很简单，按照规则去模拟即可。  


方法一：暴力模拟，每次循环找到可以执行的任务，按照规则找到优先级最高的任务。  
复杂度：`O(n^2)`  


方法二：排序加优先队列。  
对于可以执行的任务，有一个选择的规则，那将这个规则当做优先队列的排序函数，就可以快速找到优先级最高的任务了。  


```
struct Node{
    int index;
    long long inTime, t;
    bool operator<(const Node & that)const {
        if(this->t == that.t){
            return this->index > that.index;
        }else{
            return this->t > that.t;
        }
    }
};
vector<int> getOrder(vector<vector<int>>& tasks_) {
    int n = tasks_.size();
    vector<Node> tasks;
    tasks.reserve(n);

    for(int i=0;i<n;i++){
        auto& v = tasks_[i];
        tasks.push_back({i, v[0], v[1]});
    }
    sort(tasks.begin(), tasks.end(), [](auto&a, auto&b){
        return a.inTime < b.inTime;
    });


    long long now = 0;

    priority_queue<Node> que;
    vector<int> ans;
    ans.reserve(n);
    for(int i=0, j=0;i<n;i++){
        if(que.empty() && j < n){ // 有可能 CPU 空闲一会，需要找到下个起始时间
            now = max(now, tasks[j].inTime);
        }

        // 更新可运行的任务列表
        while(j < n && tasks[j].inTime <= now){
            que.push(tasks[j]);
            j++;
        }

        auto task = que.top();que.pop();
        ans.push_back(task.index);
        now += task.t;
    }
    return ans;
}
```


## 四、所有数对按位与结果的异或和  


题意：给两个数组，大小分别为 n 和 m。  
两个数组的任意两个数字`and`运算后，可以组成一个新的数组，大小是`n*m`。  
求新数组所有数组的异或值。  



思路：n和m 的数据范围是`10^5`，所以模拟来暴力计算必然超时。  


既然一个数组的任意一个数字都会和另外一个数组的所有数字进行运算，我们就看能不能使用结合律来降低复杂度。  
简单推理后，发现可以使用结合律。  
于是就可以先对一个数组求异或操作，然后和另一个数组分别进行`and`运算，最后再求异或即可。  
复杂度：`O(n+m)`  


```
int getXORSum(vector<int>& arr1, vector<int>& arr2) {
    int sum1 = 0;
    for(auto c: arr1){
        sum1 ^= c;
    }

    int ans = 0;
    for(auto c: arr2){
        ans ^= (sum1 & c);
    }
    return ans;
}
```


## 五、最后  


这次比赛的题目很简单，但是要先做第四题再做第三题的话，排名会靠前一些。  


另外就是，对于这些常用的需要记忆的小知识，这次都在顶部头文件区域整理好了，以后用起来就方便多了。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

