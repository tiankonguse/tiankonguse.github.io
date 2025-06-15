---   
layout:     post  
title: leetcode 第 233 场算法比赛  
description: 这次比赛有技术含量。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-03-21 21:30:00  
published: true  
---  


## 零、背景  


这次比赛有技术含量，第一题就是动态规划，第二题是最大堆最小堆，第三题是二分、第四题是字典树，有点意思。  


比赛代码：https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/2/233  



## 一、最大升序子数组和 


题意：给一个数组，在所有满足升序的子数组中，求最大和。  


思路：简单的动态规划。  


子数组是连续的，那就与最大区间和的算法一模一样了。  


最大区间和的分界点是遇到负数，当前前缀和变为0。  
升序子数组的分界点就是遇到非升序数字，当前前缀和也变为0。  


```
int maxAscendingSum(vector<int>& nums) {
    int ans = nums[0];

    int sum = ans;
    for(int i=1;i<nums.size();i++){
        if(nums[i] > nums[i-1]){
            sum += nums[i];
        }else{
            sum = nums[i];
        }
        ans = max(ans, sum);
    }

    return ans;
}
```


## 二、积压订单中的订单总数  


题意：给一堆订单，有些是买入订单，有些是卖出订单，按照顺序依次处理订单。  
如果订单无法处理，就被当做堆积订单。  
对于当前的买入订单，从堆积订单中找到最便宜的小于当前买入价格的卖出订单，然后买入。  
对于当前的卖出订单，从堆积订单中找到最贵的大于当前卖出价格的卖出订单，然后卖出。  
如果当前订单无法交易，则放在堆积订单里面。    
问最终堆积订单的个数。  


思路：关键是要读懂题，读懂了就会发现就是应用最大堆最小堆的题型。  


堆积的卖出订单使用最小堆储存。  
堆积的买入订单使用最大堆储存。  
然后循环处理即可。  


注意事项1：每次给了一组订单，是可以拆分的。  
注意事项2：对于当前的订单，可以在堆积订单里面，使用多个不同价格的订单交易。  



```
min_queue<pll> sell_que;
max_queue<pll> buy_que;

for(auto& v : orders){
    ll price = v[0], amount = v[1], orderType = v[2];

    if(orderType == 0){ // buy
        while(amount > 0 && !sell_que.empty() && sell_que.top().first <= price){
            auto p = sell_que.top(); sell_que.pop();
            if(p.second > amount){
                p.second -= amount;
                amount = 0;
                sell_que.push(p);
            }else if(p.second <= amount){
                amount -= p.second;
            }
        }

        if(amount > 0){
            buy_que.push({price, amount});
        }
    }else if(orderType == 1){ // sell

        while(amount > 0 && !buy_que.empty() && buy_que.top().first >= price){
            auto p = buy_que.top(); buy_que.pop();
            if(p.second > amount){
                p.second -= amount;
                amount = 0;
                buy_que.push(p);
            }else if(p.second <= amount){
                amount -= p.second;
            }
        }

        if(amount > 0){
            sell_que.push({price, amount});
        }
    }
}
```


## 三、有界数组中指定下标处的最大值  


题意：给一个规则和三个数字 n, index, maxSum，求构造出满足要求的最大目标。  


规则1：构造一个长度为 n 的数组。  
规则2：数组的数字都是正整数。  
规则3：数组中相邻的绝对值不大于 1。  
规则4：数组里所有数字之和不大于 maxSum。  
规则5：尽量使数组中第 Index 个数字值最大。  


目标：输出第 Index 个数字的最大值。  


思路：简单分析之后，发现肯定可以构造出这样的数组。  
比如所有位置的值都设置为 1，就满足要求。  


这里想要使得目标最大，那目标之外的位置的值就应该尽量的小，按照规则就是严格递减直到值为 1。  


假设目标位置的值是 val，两侧严格递减，可以得到的最小数组和也就确定了。  
如果这个最小数组和不大于 maxSum，则 val 满足前四个规则。  


由此，我们可以二分 val 的值，找到最大的满足要求的答案。  


注意事项1：数字的值至少是 1，不是 0。  


```
typedef long long ll;
class Solution {
    // 最大值是 value，严格递减，长度为 n，满足要求的最小数组和
    ll GetSum(int n, ll value){
        if(value >= n){
            ll firstVal = value - n + 1;
            return  (firstVal + value) * n / 2;
        }else{
            return (value + 1) * value / 2 + (n - value);
        }
    }
    bool check(ll n, ll index, ll maxSum, ll value){
        return GetSum(index+1, value) + GetSum(n-index, value) - value <= maxSum;
    }
public:
    int maxValue(int n, int index, int maxSum) {
        ll low = 1, high =  maxSum + 1;
        while(low < high){
            ll mid = (low + high + 1) / 2;
            if(check(n, index, maxSum, mid)){
                low = mid;
            }else{
                high = mid - 1;
            }
        }
        return low;
    }
};
```


## 四、 统计异或值在范围内的数对有多少  


题意：给一个数组，问任意组合 `(i,j)` 满足异或值在区间`[low,high]`内的个数。  



思路：暴力显然会超时，我试了一发，果然超时了。  


由于是位操作，求满足的个数，显然需要使用字典树。  


字典树能够加速查找的原因是，对于某个子树的所有节点，如果确定全部满足或者全部不满足，就可以直接得到子树满足要求的个数。  


我写了一个字典树区间查找的 query，结果还是超时了。  


赛后，发现使用区间判断的话，确实可以构造出需要遍历所有叶子节点的样例来。  


所以区间问题需要转化一下，转化为前缀差或者后缀差问题。  
大概是 `q(l, h) = q(h) - q(l-1)`  


这样转化之后，就不会超时了。  
 


```
int Query(const int val, const int high, const int index, const int pre, const int p) {
    if(index == -1){ // 叶子节点
        if( pre <= high){
            return word[p];
        }else{
            return 0;
        }
    }
    
    if(pre > high) return 0; // 剪枝，都不满足
    if(pre + (1 << (1+index)) - 1 <= high) { //剪枝，都满足
        return word[p];
    }
    
    int bit = (val >> index) & 1;
    int ans = 0;
    for(int i = 0; i < kKind; i++){
        if(!tire[p][i]) continue;
        int nextPre = pre;
        if(i ^ bit){
            nextPre += 1 << index;
        }
        ans += Query(val, high, index - 1, nextPre, tire[p][i]);
    }
    
    return ans;
}


class Solution {
public:
    int countPairs(vector<int>& nums, int low, int high) {
        int ans = 0;
        
        Init();
        
        for(auto v: nums){
            Insert(v);
            ans += Query(v, high, 15, 0, 0) - Query(v, low-1, 15, 0, 0);
        }
        
        return ans;
    }
};
```


## 五、最后  


这次比赛四道题都挺不错的。  
前三道题动态规划、最大堆最小堆、二分题型都可以拿来当做面试题，挺不错的。  


扩展思考1：第三题二分那道题，不是求 Index 的最大值，而是求最大值情况下可以构造的数组个数，该怎么做呢？  
扩展思考2：还是第三题二分那道题，不求最大值，直接求满足前四个规则的数组个数，该怎么做呢？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

