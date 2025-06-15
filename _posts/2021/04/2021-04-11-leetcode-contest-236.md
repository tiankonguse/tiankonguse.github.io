---   
layout:     post  
title: leetcode 第 236 场算法比赛  
description: 最后一题是个大模拟，浪费不少时间。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-04-11 21:30:00  
published: true  
---  


## 零、背景  


这次比赛的题都很简单，而且有道大的模拟题，考验敲代码速度的时候到了。  
第一题签到题，第二题模拟题或者公式题，第三题搜索题，第四题模拟题。  


## 一、数组元素积的符号  


题意：求所有数字乘积的符号。  


思路：由于只要符号，大于 1 按 1 处理，小于 -1 按 -1 处理即可。  


```
int arraySign(vector<int>& nums) {
    int ans = 1;
    for(auto v: nums){
        if(v > 1){
            v = 1;
        }else if(v < -1){
            v = -1;
        }
        ans *= v;
    }
    return ans;
}
```

## 二、找出游戏的获胜者  


题意：n 个人站一圈，从 1 开始顺时针每人计  1 个数，第 k 个人淘汰。  
问最后留下的是哪个人。  


思路：约瑟夫环问题。  


方法一、套公式。  
复杂度：`O(n)`  

```
int fun(int n, int m) {
    int ans = 0;
    for (int i = 2; i <= n; i++) ans = (ans + m) % i;
    return ans + 1;
}
```


方法二：建立链表，循环模拟。  
复杂度：`O(n^2)`  



## 三、最少侧跳次数  


题意：有三条赛道，赛道某些点有石头，青蛙要从起点跳到终点去。  
如果青蛙前方遇到石头，需要在同赛道上进行切换。  
问至少切换几次可以到达终点。  


思路：三个赛道的同一个位置顶多有一个石头，所以肯定存在答案。  


起初看到这道题，很容易想到使用动态规划做。  
但是会发现状态转移方程之间存在环。  


所以我们可以选择搜索来做这道题。  


为了避免相同两个位置来回切换，可以从后到前计算答案。  
复杂度：`O(n)`  



```
int nums[500010][3];
int minSideJumps(vector<int>& obstacles) {
    int n = obstacles.size();
    memset(nums, -1, sizeof(int) * 3 * n);

    n--;
    nums[n][0] = nums[n][1] = nums[n][2] = 0;
    for(int i = n - 1; i >= 0; i--){
        int pos = obstacles[i] - 1;

        int minNum = 500010;
        for(int j = 0; j < 3; j++){
            if(j == pos){
                nums[i][j] = -2; // 当前节点不可达
                continue;
            }
            if(nums[i + 1][j] >= 0){
                nums[i][j] = nums[i + 1][j];
                minNum = min(minNum, nums[i][j]);
            } else {
                nums[i][j] = -3; //前方有障碍物
            }
        }

        for(int j = 0; j < 3; j++){
            if(nums[i][j] == -3){
                nums[i][j] = minNum + 1;
            }
        }
    }
    return nums[0][1];
}
```

## 四、求出 MK 平均值  


题意：给两个数字 m 和 k，和一个数据流。  
求数据流最后 m 个数字里面，去掉 k 个最大值和 k 个最小值，剩余数字的平均值。  
平均值如果不能整除，


思路：维护三个数据结构和一个队列。  
一个储存最小的 k 个数字，一个储存最大的 k 个数字，一个储存中间的数字。  
需要始终保证三个数据结构数字个数不大于 M 个即可。  

 
流处理：新的数字直接加入数据结构，如果队列大于M个，删除最早的数字。  


增加数字：  
1）优先判断能否加入到大队列，可以了，可能需要淘汰出一个数字，否则结束。
2）其次判断能否加入到小队列，可以了，可能需要淘汰出一个数字，否则结束。  
3）如果执行到这里，加入到中间的队列。  


删除数字：  
1）查找是否在中间队列，在了，直接删除。  
2）判断是否在大队列，在了删除，并从中间队列删除一个最大值，加到大队列。  
3）判断是否在小队列，在了删除，并从中间对垒删除一个最小值，加到小队列。  


平均数：队列维护所有元素的和以及个数，直接相除即可。  


流复杂度：`O(log(n))`  
平均数复杂度：`O(1)`  

特殊的数据结构：由于要对某个元素增删改查，需要使用平衡树来操作。  
这里我使用 `map` 代替平衡树做到这些操作。  
另外维护一个`sum`和一个`num`即可。  


```
class MKAverage {
    int M,K;
    queue<ll> base_que;
    Que small_que, mid_que, big_que;
    
    void add(ll v){
        if(big_que.num < K){ //优先填充大队列
            big_que.add(v);
            return;
        }
        
        // 判断是否可以插入到大队列
        ll big_min_val = big_que.GetMinVal();
        if(big_min_val < v){ //需要插入到 big 队列
            big_que.add(v);
            big_que.del(big_min_val);
            v = big_min_val;
        }
        
        // 优先填充到小队列 
        if(small_que.num < K){
            small_que.add(v);
            return;
        }
        
        //判断是否可以插入到小队列
        ll small_max_val = small_que.GetMaxVal();
        if(small_max_val > v){
            small_que.add(v);
            small_que.del(small_max_val);
            v = small_max_val;
        }
        
        mid_que.add(v);
    }
    

    void del(ll v){
        // 优先从中间删除
        if(mid_que.que.count(v)){
            mid_que.del(v);
            return ;
        }
        
        //中间没找到，两边二选一
        
        
        //判断大队列
        if(v >= big_que.GetMinVal()){
            big_que.del(v);
            
            // 此时需要从中间补回来一个最大值
            v = mid_que.GetMaxVal();
            mid_que.del(v);
            big_que.add(v);
            return;
        }
        
        //此时肯定是小队列
        if(v <= small_que.GetMaxVal()){
            small_que.del(v);
            
            // 此时需要从中间补回来一个最大值
            v = mid_que.GetMinVal();
            mid_que.del(v);
            small_que.add(v);
            return;
        }
        
        
    }
    
public:
    MKAverage(int m, int k) {
        M = m, K = k;
    }
    
    void addElement(int num) {
        base_que.push(num);
        add(num);
        
        if(base_que.size() > M){
            num = base_que.front();
            base_que.pop();
            del(num);
        }
    }
    
    int calculateMKAverage() {
        if(base_que.size() < M){
            return -1;
        }else{
            return mid_que.sum / mid_que.num; 
        }
    }
};
```


## 五、最后  


这次比赛的题型分别是签到题、小模拟题、搜索题、大模拟题。  


其中搜索题使用动态规划题做时，就需要解决环的问题。  
你能使用动态规划解决第三题吗？  


提示：对于存在环的搜索图，一般会加一个跳数来消除环，从而可以使用动态规划做。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

