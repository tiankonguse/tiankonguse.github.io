---   
layout:     post  
title: leetcode 第 244 场算法比赛  
description: 这次比赛的题竟然卡超时，只能分别试一试了。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-06-06 21:30:00  
published: true  
---  


## 零、背景  


这次比赛最后一题相同的复杂度卡时间了，代码重新敲一遍就过了。  


其他题也有点意思，感兴趣的可以看下思路。  


## 一、判断矩阵经轮转后是否一致  


题意：给两个矩阵，问其中一个矩阵不断的旋转 90 度，是否可以与另一个矩阵相等。  


思路：按照题意，旋转四次，对比四次即可。  


```
class Solution {
    int n;
    vector<vector<int>> tmp;
    bool Check(vector<vector<int>>& a, vector<vector<int>>& b){
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if(a[i][j] != b[i][j]){
                    return false;
                }
            }
        }
        return true;
    }
    void Trans(vector<vector<int>>& a){
        vector<vector<int>>& b = tmp;
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                b[j][n-1-i] = a[i][j];
            }
        }
        
        b.swap(a);
    }
public:
    bool findRotation(vector<vector<int>>& a, vector<vector<int>>& b) {
        tmp = a; // 临时矩阵，只申请一次内存
        
        n = a.size();
        for(int i=0;i<4;i++){
            if(Check(a, b)){
                return true;
            }
            Trans(b);
        }
        return false;
    }
};
```


## 二、使数组元素相等的减少操作次数  


题意：给一个数组，每次操作可以将一个最大值修改为次大值。  
问多少次操作后数组所有值相等。  


思路：虽然题目要求最大值一次只能修改一个，但是分析一下就可以发现，有几个最大值，这个操作就需要操作几次。  


假设当前最大值有 a 个，次最大值有 b 个，则需要操作 a 次才能减少一个最大值。  
操作后，次最大值变成了最大值，个数是 a + b 个。  


所以，我们从大到小循环，每次消灭一个最大值，消灭到最后即可。  


复杂度：`O(n)`



```
int reductionOperations(vector<int>& nums) {
    int ans = 0;

    sort(nums.begin(), nums.end());

    int n = nums.size();
    int num = 0;
    int max_val = nums[n - 1] + 1;
    for(int i = n-1; i >= 0; i--){
        if(nums[i] < max_val){
            ans += num;
            max_val = nums[i];
        }
        num++;
    }

    return ans;
}
```


## 三、使二进制字符串字符交替的最少反转次数  


题意：给一个二进制字符串，有两个操作。  


操作1：左移一次字符串。  
操作2：翻转字符串中的一个字符，0 变 1，1 变 0。  


问操作2 至少进行多少次，可以使得二进制字符串变成交替字符串。  



思路：  


与《[第 241 场算法比赛](https://mp.weixin.qq.com/s/UoLglB3bBxPkN2k3OHMbLQ)》的第二题几乎一样，不过多了一个操作1。  


如果字符串长度是偶数，可以发现无论如何左移，最优答案都不变。  
如果字符串长度是奇数，从中间分开，可能有最优答案。  


例如`011`，左移两次后不需要操作 2 就可以得到交替字符串。  


方法一：最笨的方法是枚举左移的所有可能，分别求最优值。  


分析一下左移后的字符串与字符换，会发现原字符串与答案相比，第一个字符最终与最后一个字符串值相反。  
这个是显然的，毕竟左移一次，第一个字符串就与最后一个字符串挨着了。  


所以我们可以定义两个状态。  


`pre(n, 0)` 左移 n 次，原字符串第一个字符最终值为 0 的最小操作 2 次数。  
`next(n+1, 1)` 左移 n 次，原字符串最后一个字符最终值为 1 的最小操作 2 次数。  


可以发现，左移 n 次的答案就是两个状态之和。  


`trans(n) = pre(n, 0) + next(n+1, 1)`。 


这样枚举左右左移的情况，计算出所有状态，就可以求出答案了。  
复杂度：`O(n^2)`  
这个方法应该会超时。  

 
方法二：优化


同样是在 《[第 241 场算法比赛](https://mp.weixin.qq.com/s/UoLglB3bBxPkN2k3OHMbLQ)》文章中，我介绍过状态复杂度太高的优化方法。  


```
面对动态规划，复杂度太高时，优化思路是对某些项提前做预处理，或者看某个循环的结果是否可以在下次循环时复用。
```


而分析左移 n 次 与 左移 `n+1` 次，可以发现状态之间确实是有关系的。  


因为第一个字符固定，所有前缀的答案都固定了，所以可以利用上上个前缀的结果。  


```
pre(n+1, 0) = pre(n, 0) + Eq(n+1, 0)
```


后缀也是相同的道理。  
就这样可以预处理计算出所有状态的答案，然后一边循环即可求出最优值。  
复杂度：`O(n)`  



```
const int max5 = 100100;
int pre[2][max5];
int next_val[2][max5];

class Solution {
public:
    int minFlips(string& s) {
        
        int n = s.size();
        if(n == 1){
            return 0;
        }
        
        // 前缀预处理
        for(int flag = 0; flag <= 1; flag++){
            int v = flag;
            pre[flag][0] = 0;
            for(int i = 1; i<= n; i++){
                if(s[i-1] != '0' + v){
                    pre[flag][i] = pre[flag][i-1] + 1;
                }else{
                    pre[flag][i] = pre[flag][i-1];
                }
                 v = 1 - v;
            }
        }
        
        // 后缀预处理
        for(int flag = 0; flag <= 1; flag++){
            int v = flag;
            next_val[flag][n+1] = 0;
            for(int i = n; i >= 1; i--){
                if(s[i-1] != '0' + v){
                    next_val[flag][i] = next_val[flag][i+1] + 1;
                }else{
                    next_val[flag][i] = next_val[flag][i+1];
                }
                v = 1 - v;
            }
        }
        
        // 找中界限
        int ans = n;
        for(int i = 0; i < n; i++){
            // (0, i], [i+1, n]
            ans = min(ans, pre[0][i] + next_val[1][i+1]);
            ans = min(ans, pre[1][i] + next_val[0][i+1]);
        }
        
        return ans;
    }
};
```


## 四、装包裹的最小浪费空间  


题意：给 n 个包裹，m 个供应商，每个供应商有若干尺寸的箱子。  
包裹只能放进大于等于自己尺寸的箱子。  
选择一个供应商后，某些包裹可能没有适合自己的箱子而只能选择大于自己的箱子，这就存在空间浪费。  
问选择哪个供应商可以使得总浪费最小。  


思路：思路很明确的一道题。  
供应商之间没有关系，所以需要枚举所有的供应商，分别计算出浪费的最小空间，然后选浪费的最小供应商即可。  


那怎么计算一个供应商的浪费空间呢？  


方法有两种。  


一种是枚举包裹，分别找到匹配的最小箱子，累计求差值。  
一个供应商的复杂度：`O(v log(n))`。  
综合复杂度：`O(sum(v) * log(n))`  



由于所有箱子的个数不超时`V = 10^5`，所以综合复杂度是`O(V log(n))`。  



另一种是枚举箱子，分别找到匹配的包裹，累计求差值。  
一个供应商的复杂度：`O(n log(v))`  
综合复杂度：`O(n sum(log(v)))`  


两个方法的理论时间复杂度都一样。  
但是空间复杂度不一样。  


方法一的每个供应商都需要申请内存，对箱子建立一个查找树。  
而方法二则只需要对包裹预处理一次，申请一次数组内存。  


我第一次提交代码时，选择的是方法一，超时了。  
使用方法二重新敲一遍，就通过了。  



```

const int max3 = 2100, max4 = 11100, max5 = 100100, max6 = 2000100;
typedef long long ll;
const int mod = 1e9 + 7;
ll sum[max5];

int minWastedSpace(vector<int>& packages, vector<vector<int>>& boxes) {
    int n = packages.size();
    sort(packages.begin(), packages.end());
    
    sum[0] = 0;
    for(int i=1;i <=n;i++){
        sum[i] = sum[i-1] + packages[i-1];
    }
    
    ll ans = -1;
    for(auto& box: boxes){
        sort(box.begin(), box.end());
        
        if(packages.back() > box.back()){
            continue; // 剪枝
        }
        
        ll tmp_ans = 0;
        int left = 0;
        
        for(auto b: box){
            if(b < packages.front()){
                continue; // 剪枝
            }
            
            auto it = upper_bound(packages.begin(), packages.end(), b);
            it--; // 剪枝后一定存在
            
            int pos = it - packages.begin();
            if(pos < left) continue; // 没用的箱子
            
            // [left, pos] 可以放在 b 中
            ll num = pos - left + 1;
            tmp_ans += num * b - (sum[pos+1] - sum[left]);
            
            left = pos + 1;
        }
        
        if(ans == -1){
            ans = tmp_ans;
        }else{
            ans = min(ans, tmp_ans);
        }
        
    }
    
    return ans % mod; // 记得取模
}
```


## 五、最后  


这次比赛题目还不错。  


不过第一题就来一个旋转矩阵，好像难度有点大。  


最后一题我优先选择代码实现比较简单的方法，结果超时了。  
看来以后有多种方法时，还是需要斟酌选择的，即使时间复杂度没问题，可能也会因为空间复杂度（内存的申请释放）而卡超时。  


你都是怎么做这些题的呢？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

