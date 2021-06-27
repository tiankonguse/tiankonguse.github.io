---   
layout:     post  
title: leetcode 第 247 场算法比赛  
description: 第三题学到新技能了。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛，继续录制视频了，并做成了一个 5 分钟的短视频上传到了 B 站。  
视频地址： https://www.bilibili.com/video/BV1S54y1H7tf?share_source=copy_web


![](http://res.tiankonguse.com/images/2021/06/27/001.png)


上图是频频的一个截图，可以看到，在屏幕下方做了一个进度条，我颇为满意。  



回到这次比赛，第一题签到题、第二题模拟题、第三题数学题、第四题搜索题。  


我第三题没做出来，赛后看了题解发现以前有类似的题型。  
这次遇到之后，下次应该就会做了吧。  


## 一、两个数对之间的最大乘积差  

题意：给一个数组，调四个位置的数字`a, b, c, d`，使得`(a * b) - (c * d)` 的结果最大。  


思路：数字都是正整数，那显然是最大的减去最小的结果最大。  



## 二、循环轮转矩阵  

题意：给一个长宽都为偶数的矩阵，如下图对矩阵进行分组，然后进行逆时针旋转 k 次，求最终的矩阵。  


![](http://res.tiankonguse.com/images/2021/06/27/002.png)


思路：按照题意模拟即可。  


另外，为了方便旋转与赋值，建议先把分组后的数字储存在临时数组中，这样旋转等价一个偏移量了。  


```
void Get(vector<vector<int>>& grid, int k){
    int up = k, down = n -  k - 1, left = k,  right = m - k - 1;
    // printf("k=%d up=%d down=%d left=%d right=%d\n", k, up, down, left, right);
    for(int i = left; i < right; i++) {
        tmp.push_back(grid[up][i]);
    }
    for(int i = up; i < down; i++) {
        tmp.push_back(grid[i][right]);
    }
    for(int i = right; i > left; i--) {
        tmp.push_back(grid[down][i]);
    }
    for(int i = down; i > up; i--) {
        tmp.push_back(grid[i][left]);
    }
}
```


## 三、最美子字符串的数目  


题意：给一个字符串，求最美子串的数量。  
最美字符串定义：如果字符串中至多一个字母出现奇数次，则成为最美字符串。  


思路：比赛的时候我理解错题意了，只想到了动态规划的方法。  


方法一：动态规划。  


状态 `f[i][state]` 定义：以第 `i` 位置结尾，状态为 `state` 的子字符串的个数。  
由于共有 10 个不同的字母，所以只考虑奇偶性，共有 `2^10` 种状态。  


状态转移：`f[i][state ^ (1 << v)] = f[i-1][state]`  
转移复杂度：`O(2^10)`  
综合复杂度：`O(n * 2^10)`  


方法二：前缀法  


假设所有前缀对应的状态已经计算得到了，状态为 `f(i)`，满足这个状态的前缀有 `F(i)`个。  
目标是找到当前位置 i 为结尾的最美子字符串个数。  


假设存在一个最美子字符串，起始位置为 j，则 `f(i) - f(j-1)` 肯定是 0 或者只有一位是 1。  
如果是 0，则代表前面有 `F(f(j-1))` 个状态满足答案。  
如果只有一位是 1，则枚举每个字符，可以分别找到前面有 `F(f(j-1) ^ (1<<c))`  个状态满足答案。  


```
long long wonderfulSubstrings(string& word) {
    int n = word.length();
    vector<long long> dp(1<<10, 0);
    long long ans = 0;
    int pre = 0;

    dp[0] = 1;
    for(auto c: word) {
        int v = 1 << (c - 'a');
        pre ^= v;
        ans += dp[pre];  // 相等，全部是偶数个
        for(int i=0;i<10;i++){
            ans += dp[pre ^ (1<<i)]; // 只有一个奇数
        }
        dp[pre]++;
    }

    return ans;
}
```


## 四、统计为蚁群构筑房间的不同顺序


题意：给一个有根树，从根部开始遍历这个树，问有多少种遍历方法。  
规则1：如果一个节点遍历过，则这个节点的所有儿子都可以准备被遍历。  
规则2：所有准备备遍历的节点中，可以任意选择一个来遍历。  


思路：如果一个节点被遍历，对于左右节点，选择是任意的。  


假设左子树有 a 个节点，又子树有 b 个节点，那么每次都可以从左边选择或者右边选择，所有共有 `C(a+b, a)` 种选择。  
如果有多个子节点，依次挑选即可，即`C(n, a) * C(n-a, b) * ...`。  


这样，就可以得到整棵树的选择种类了。  


```
int Dfs(const int pos){
    if(nextRoom[pos].size() == 0){
        return 1; // 没有儿子，只有一种选择
    }
    
    int sum = 0; // 先计算儿子，并统计到子孙的个数
    for(auto v: nextRoom[pos]) {
        childNum[v] = Dfs(v);
        sum += childNum[v];
    }
    int ret = sum;
    
    for(auto v: nextRoom[pos]) {
        int a = childNum[v];
        ans = (ans * C(sum, a)) % mod;
        sum -= a;
    }
    
    return ret + 1;
}
```


## 五、最后  


这次比赛，第二题模拟题，不少人没模拟出来。  
第三题是很巧妙的前缀求差题，之前还没遇到类似的题型，所以我没往这方面想，最终没做出来。  
第四题是递归+数学题，递归即可。  


这次比赛你做出了几道题呢？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

