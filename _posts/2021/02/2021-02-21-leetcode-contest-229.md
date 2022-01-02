---   
layout:     post  
title: leetcode 第 229 场算法比赛  
description: 递归写久了，以后要尝试使用递推写代码。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛的题很有意思，都是左右轮流操作，求最优值。  


第一题是左右交叉合并。  
第二题是左右移动。  
第三题是左右选择求最大值。  
第四题是左右选择求最大回文串。  


具体来看下面的四道题吧。  



源代码：

https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/2/229 



## 一、5685. 交替合并字符串  


题意：给两个字符串，从左到右轮流取一个字母，组成新的字符串。  


思路：按照题意左右取即可。  


```
string mergeAlternately(string s1, string s2) {
    string ans;
    
    int i = 0;
    for(;i < s1.size() && i < s2.size();i++){
        ans.push_back(s1[i]);
        ans.push_back(s2[i]);
    }
    if(i < s1.size()){
        ans.append(s1.substr(i));
    }
    if(i < s2.size()){
        ans.append(s2.substr(i));
    }
    
    return ans;
}
```

## 二、5686. 移动所有球到每个盒子所需的最小操作数  


题意：给一个 `0/1` 数组，每次操作数组的数字只能左右移动一格。  
问将所有数字移动到每个位置，最少需要多少个操作。  


思路：  


最暴力的方法是枚举。  
即对于每个位置，循环计算每个数字需要移动多少次。  
复杂度：`O(n^2)` 


比较优雅的方法是计算第一个位置的答案，之后的位置利用上前面位置的信息，`O(1)`计算出当前位置的答案。  
复杂度：`O(n)`  



```
vector<int> minOperations(string& s) {
    int n = s.size();
    vector<int> ans(n, 0);
    int l = 0, r = 0;

    int sum = 0;
    for(int i=0;i<n;i++){
        if(s[i] == '1'){
            r++;
            sum += i;
        }
    }

    for(int i=0;i<n;i++){ // (0,l) [r,n)
        ans[i] = sum;         
        if(s[i] == '1'){
            l++;
            r--;
        }
        sum -= r;
        sum += l;
    }
    
    return ans;
}
```

## 三、5687. 执行乘法运算的最大分数  


题意：给一个数组和操作因子。  
每次可以从数组的两端选择一端，取出一个数字，得分是数字的值乘以操作因子。  
求最大得分。  


思路：典型的动态规划题。  


状态转移方程大概是`f(l,r) = max(选左边，选右边)`  


这里的难点是，数组大小是`10^5`，创建不了这么多的状态空间。  
突破点则是操作只有`10^3`个，说明大部分状态是非法的。  


我的第一个方法是使用 `map<pair<l,r>, val>` 只储存有效状态，但是超时了。  


分析发现，每个状态其实有三个参数： 
left 左边界  
right 右边界  
index 操作次数    


这三个参数，知道任意两个，可以求出第三个。  


所以我们可以不选择左边界和右边界，而是选择左边界和操作数。  
这样就可以转换成`1000*1000` 大小的状态。  


即定义转态为 `f(l, index)` 代表操作 index 次，左边位置为 l 时的最优值。    


这样就可以定义二维数组来递归或者递推实现这道题了。  


```
int maximumScore(vector<int>& nums, vector<int>& muls) {
    int n = nums.size();
    int m = muls.size();
    vector<vector<int>> dp(m+1, vector<int>(m+1, 0)); // [left][index]
    
    int ans = 0;
    
    // 递推需要从后向前
    for(int index = m; index > 0; index--){
        for(int l = index; l > 0; l--){
            int r = l + n - index;
            
            if(index == m){ //只能取一个
                dp[l][index] = max(nums[l-1] * muls[index-1], nums[r-1] * muls[index-1]);
            }else{
                int leftVal = dp[l+1][index+1] + nums[l-1] * muls[index-1];
                int rightVal = dp[l][index+1] + nums[r-1] * muls[index-1];
                dp[l][index] = max(rightVal, leftVal);
            }
        }
    }
    
    return dp[1][1];
}
```


## 四、5688. 由子序列构造的最长回文串的长度  


题意：给两个字符串，分别取两个字符串的一个子序列，拼接合并后求最长回文子序列。  
问可以得到的最长回文子序列的长度。  


思路：和上一题很类似。  


可以直接拼接合并两个字符串，则题意转化为求一个最长回文串子序列。  
不过这里有一个限制，回文串需要至少有一个字母属于左半部的字符串，至少有一个字母属于右半部的字符串。  


假设没有限制，则状态转移方程可以求出一个`f(l,r)`最优值。  
状态转移方程由两组子状态组成。  


-）两端相等，`F(l,r) = 1 + f(l+1,r-1)`  
-）两端不相等，`F(l,r)=max(f(l+1, r), f(l, r+1))`  


有限制状态定义为`F(l,r)` ，一旦遇到一次左右两端相等，则限制解除进入无限制状态。  


状态转移方程也由两组子状态组成：  


-）两端相等，`f(l,r) = 1 + f(l+1,r-1)`  
-）两端不相等，`F(l,r)=max(F(l+1, r), F(l, r+1))`  


由此，我们就梳理出所有的状态与子状态。  


由于有限制的状态与没限制的状态类似，我们可以合并两个状态为`Ff(l,r,limit)`。  
这样定义一个三维数组就可以解决这道题了。  


```
int dfs(int l, int r, int limit){
    if(l > r) return 0;
    
    if(limit && (l >= mid || r < mid)){
        return 0; // 还没有相等的，不能越界
    }
    
    if(dp[limit][l][r] != -1){
        return dp[limit][l][r];
    }
    
    int ans = 0;
    
    if(s[l] == s[r]){
        ans = 2 + dfs(l+1, r-1, 0);  // 相等了，没有任何限制了
        if(l == r){
            ans--;
        }
    }else{
        ans = max(dfs(l, r - 1, limit), dfs(l + 1, r, limit));
    }
    
    return dp[limit][l][r] = ans;
}
```



## 五、最后  


这次比赛四道都是左右选择的题型，而第三第四题则是动态规划题。  


第三题考察点是构造一个可以储存下来的状态。  
第四题考察点是状态是三维的，或者有两个状态合并得到。  


看透了这两道题的这一点，你应该就可以做出这两道题了吧。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

