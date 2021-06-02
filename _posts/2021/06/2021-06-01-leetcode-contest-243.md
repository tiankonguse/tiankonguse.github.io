---   
layout:     post  
title: leetcode 第 243 场算法比赛  
description: 动态规划，面临抉择了。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  

这次比赛有事回家了，没参加，补一下题解。  


其中最后一题很有意思，可以定义出两种状态，这就面临抉择了，抉择不好就很难做这道题了。  


## 一、检查某单词是否等于两单词之和  


题意：一个字符串可以解码得到一个数字。  
问两个字符串之和是否是第三个字符串的值。  


思路：由于字符串也是十进制的，直接就可以得到十进制字符串，然后判断即可。  


```
class Solution {
    int Cal(const std::string& str){
        int ans = 0;
        for(auto c: str){
            ans = ans * 10 + (c - 'a');
        }
        return ans;
    }
public:
    bool isSumEqual(string& a, string& b, string& c) {
        return Cal(a) + Cal(b) == Cal(c);
    }
};
```

## 二、插入后的最大值  


题意：给一个大整数数字字符串和一位的`1~9`数字，问把这个数字插入到字符串后，可以得到的合法的最大值。  


分析：对于正整数，某一位插入之后，其他位后移。  
如果这一位数字更大了，值显然更大。  
如果想让值最大，显然这个位数越高越好。  


方案：从高位到低位比大小是否可以更大，可以了插入即可。  


注意事项：对于负数，恰好相反，越小越好。  


```
enum FLAG {
    MIX_FLAG = 1,
    MAX_FLAG = 2
};

class Solution {
    string Cal(string str, char x, int flag){
        int n = str.length();
        for(int i=0;i<n;i++){
            if(flag == MIX_FLAG && str[i] > x){
                str.insert(str.begin()+i, x);
                return str;
            }
            if(flag == MAX_FLAG && str[i] < x){
                str.insert(str.begin()+i, x);
                return str;
            }
        }
        str.append(1, x);
        return str;
    }

public:
    string maxValue(string& n, int x) {
        char c = '0' + x;
        if(n[0] == '-'){
            return std::string("-") + Cal(n.substr(1), c, MIX_FLAG);
        }else{
            return Cal(n, c, MAX_FLAG);
        }
    }
};
```

## 三、使用服务器处理任务


题意：给 n 个 服务器 和 m 个任务。  
同一时间一个服务器只能运行一个任务。  


服务器有一个权重，运行任务时优先选择权重小的服务器，如果有相同权重的服务器，则选择编号最小的服务器。  
任务在某个时间点之后才能运行，每个任务的起始时间点就是下标对应的时间。  
如果任务到达起始时间，但有没有空闲服务器，任务就需要等待。  
当有空闲服务器时，如果有多个等待任务，优先选择下标较小的任务。  


求每个任务运行时，所在的服务器标号。  


分析：典型的任务调度问题，按照题意模拟即可。  


数据结构1：空闲服务器列表，最小堆实现。  
数据结构2：运行中的任务服务列表，最小堆实现。  
数据结构3：等待任务列表，最小堆或者队列实现。  


对于 m 个任务，有m 个连续的时间片。  
每个时间片需要做三个事情。  
1）去判断是否有任务运行完了，如果运行完了，就把服务器回收放回空闲服务器列表。  
2）之后去判断是否有新的任务需要运行，有了加入到等待任务列表。
3）最后判断是否有等待任务 与 空闲服务器，有了就可以完成一次任务分配。  


当时间片用完之后，可能依旧有任务在等待，此时通过最小堆可以找到下个时间片。  
由此可以快速处理完下个任务，从而得到一个空闲服务器。  
再之后就可以将等待的任务与空闲服务器进行一次任务匹配。  


```
typedef pair<int, int> PII;
template <class T>
using min_queue = priority_queue<T, vector<T>, greater<T>>;

class Solution {
    min_queue<PII> free_svr; // 空闲服务器列表
    min_queue<PII> running_svr; // 运行中的服务器列表
    min_queue<PII> pendding_task; // 等待处理的任务列表
    vector<int> ans;
    int n;
    vector<int> servers;
    vector<int> tasks;
public:

    void Init(){
        // 初始化
        for(int i = 0; i < servers.size(); i++){
            free_svr.push({servers[i], i});
        }

        n = tasks.size();
        ans.resize(n, 0);
    }

    void CheckFinish(int now){
        while(!running_svr.empty()){
            auto p  = running_svr.top();
            if(p.first > now){ // 所有任务都在运行中
                return;
            }
            
            running_svr.pop();

            int svr_id = p.second;
            free_svr.push({servers[svr_id], svr_id});
        }
    }

    void AddPenddingTask(int index, int t){
        pendding_task.push({index, t});
    }

    void TryRunTask(int now){
        CheckFinish(now);
        while(!pendding_task.empty() && !free_svr.empty()){
            const auto [task_id, run_time] = pendding_task.top(); 
            pendding_task.pop();
            
            const auto [svr_weight, svr_id] = free_svr.top(); 
            free_svr.pop();

            running_svr.push({now + run_time, svr_id});
            ans[task_id] = svr_id;
        }
    }

    vector<int> assignTasks(vector<int>& servers_, vector<int>& tasks_) {
        servers.swap(servers_);
        tasks.swap(tasks_);

        Init();

        for(int i=0;i<n;i++){
            AddPenddingTask(i, tasks[i]);
            TryRunTask(i);
        }

        while(!pendding_task.empty()){
            TryRunTask(running_svr.top().first);
        }
        return ans;
    }
};
```


## 四、准时抵达会议现场的最小跳过休息次数  


题意：给出 n 条路径的记录，以及一个前进速度 与 最大时间限制。  


默认每走完一个路径就需要休息一次，休息时间为到达小时级别的整点（如果恰好走完就是整点，则不需要休息）。
考虑到休息可能导致超过时间限制，允许在某些路径上跳过休息，这样就不需要等待到整点时刻。  


如果可以达到终点，输出最小跳过的次数。 
如果不可以，输出 -1。  


分析：典型的二分加动态规划题。  


二分最小跳数，判断是否可以在限制时间内完成路径。  
跳数固定就，问题就转化为了 n 条路径 m 跳的最短时间。  


状态定义 `dp[n][m]`。  


一种状态定义为前 n 个道路，跳过 m 次的最小耗时。  
另一种状态定义为前 n 个道路，休息 m 次的最小耗时。  
当然，这两种状态是等价的。  


为了方便理解题意，我第一份代码采用了第二种状态定义来做这道题。  


对于最后一个道路，要么选择休息，要么选择不休息。  
休息的话，`dp[n-1][m-1]` 的答案是一个整数，没啥问题。  
不休息的话，`dp[n-1][m]`的答案就是一个浮点数了，可能存在精度问题。  


为了避免浮点数，我想到一个特殊的状态：枚举上次休息的道路，那得到的前缀耗时肯定是整数。  


这个时候，状态的边界肯定是休息的，耗时就都是整数了。  
此时状态含义为 前 n 个路径且第 n 个路径休息时，前面休息 m 次的最小耗时。  


故状态转移方程为  


```
f(n, m) = min( f(i, m-1) + sum[i+1,n]/speed )
```


敲完代码后，一分析复杂度，是`O(n^3 log(n))`。  
提交一发，果然超时了。  


代码： https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/2/243/D_dp_O3.cc  


分析原先的状态，之所以有浮点数，是因为路程除以速度。  
如果把答案乘以速度，得到的就都是整数状态值了。  


那整除问题就需要特殊处理，即向上取整除以速度，再乘以速度，得到对齐后的整数值。  


公式：`div(val) = (val + speed - 1) / speed * speed`



状态定义：`f(n,m)` 前 n 个道路跳过 m 次的最小耗时。  
状态转移方程：只看最后一个路径，跳过与不跳过。  


跳过，意味着不休息，是连续的，前面的状态不需要向上取整。  


```
f(n, m) = f(n-1, k-1) + div(dist[m - 1])
```


不跳过，意味着休息，非连续，前面的状态需要向上取整。  


```
f(n, m) = div(f(n-1, k-1)) + div(dist[m - 1])
```

这样，这道题就可以 `O(n^2 log(n))`来通过了。  


代码：https://github.com/tiankonguse/leetcode-solutions/blob/master/contest/2/243/D.cc  


## 五、最后  


这次比赛第三题调度题，第四题动态规划都比较有意思。  


你第四题通过了吗？  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

