---   
layout:     post  
title: leetcode 第 232 场算法比赛  
description: 我这手速，30 多分钟竟然敲完了。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-03-14 21:30:00  
published: true  
---  


## 零、背景  


不知道是不是上次的比赛太难了，这次比赛就放水了。  


我这手速，30 分钟就敲完了比赛，花几分钟来看下这些题吧。  


比赛代码：https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/2/232  



## 一、仅执行一次字符串交换能否使两个字符串相等  


题意：给两个字符串，问是否可以对其中一个字符串某两个位置进行交换，使得两个字符串相等。  



思路：题目歧义很大，是两个字符串都可以交换一次，还是这个道题最多只能交换一次呢？  


我切换到英文，发现是`at most one string swap on exactly one of the strings`，确定是这道题只能交换一次。  


那就简单了，先统计重排序后两个字符串是否相等。  


不相等了怎么交换都不可能相等的。  
相等了，统计相同位置值不同的个数，小于等于两个就可以满足，否则不可以。  


PS：赛后一看标题，标题也说明是只交换一次。。。  


## 二、找出星型图的中心节点  


题意：给一个星型的树，求找到树的中心，保证只有一个。  


思路：这道题通用歧义很大。  


如果是只有一个中心，其他点度数都是 1 的话，统计度数为 2 的点即可。  
如果存在长链的话，则需要优先统计度数大于 2 的点（只有一个），没找到，就返回度数为 2 的点（特殊情况）。  


不知道是否存在长链，为了保险起见，我选择存在长链的题意来做这道题。  



## 三、最大平均通过率  


题意：给 n 个班级以及每个班级考试通过的人数。   
现在给一些必定可以通过考试的转校生，问怎么分配这些转校生，可以使得学校的整体通过率最高。  


学校的整体通过率定义：每个班级的通过率之和除以班级个数。  


思路： 最直接的思路是使用班级的通过率来排序，然后贪心。  
但是这个思路无法证明其正确的，我心中简单推算了下，估计是不正确的。   



第二个思路是假设加入一个转校生，分析整体通过率的变化情况。  
可以发现，未加入转校生的班级通过率不会变化，仅仅是加入转校生的那个班级的通过率有所增加。  
由于班级的个数不变，所以加入转校生那个班级增加的通过率与学校整体通过率成正比例的。  


因此，我们可以对增加的通过率进行贪心选择，每次选择增加通过率最大的那个班级。  


这个时候就需要使用最大堆来维护每个班级的增加通过率了。  
由于找到这个通过率后，还需要找到对应的班级，堆里就需要把班级的坐标存下来。  


小技巧：由于增加通过率可能非常小，为了防止遇到精度问题，我给每个增加通过率乘以一个很大的系数，比如`1e10+7`。  


```
double maxAverageRatio(vector<vector<int>>& classes, int m) {
    max_queue<pair<double, int>> que;
    for(int i=0;i<classes.size();i++){
        int a = classes[i][0], n = classes[i][1];
        double rate = mod * (n-a) / (1.0 * n * (n+1));
        que.push({rate, i});
    }

    while(m--){
        auto p = que.top(); que.pop();
        int i = p.second;
        int& a = classes[i][0];
        int& n = classes[i][1];
        a++, n++;

        double rate = mod * (n-a) / (1.0 * n * (n+1));
        que.push({rate, i});
    }

    double sum = 0;
    for(int i=0;i<classes.size();i++){
        int a = classes[0], n = classes[1];
        sum += 1.0 * a / n;
    }

    return sum/classes.size();
}
```


## 四、好子数组的最大分数  


题意：给一个数组，子数组的分数是子数组内的最小值与子数组长度的乘积。  
现在要求子数组必须包含下标 `k`，问可能得到的最大子数组分数。  


思路：很容易发现，很多子数组显然不是最优值的，即可以得到两个性质。  


性质一：假设子数组`[l,r]` 的最小值是 `minVal`， 如果 `l-1` 或者 `r+1` 的值不比最小值小，那我们可以得到一个更优的子数组。  


性质二：如果 `l-1` 和 `r+1` 的值都小于 `minVal`, 增大子数组的长度时，显然应该选择值更大的那一侧（证明见性质一）。  


根据这两个性质，我们就可以从其实的位置`[k,k]`不断增大子数组的长度，并更新得到的分数。  


```
int maximumScore(vector<int>& nums, int k) {
    int n = nums.size();
    int minVal = nums[k], len  = 1;
    int ans = minVal * len;
    int l = k - 1, r = k + 1;

    while(l >= 0 || r < n){
        len++;

        int i = 0;
        if(l < 0){
            i = r,  r++;
        }else if(r == n){
            i = l, l--;
        }else if(nums[l] < nums[r]){
            i = r, r++;
        }else{
            i = l, l--;
        }

        minVal = min(minVal, nums[i]);

        int tmpAns = minVal * len;
        if(tmpAns > ans){
            ans = tmpAns;
        }
    }
    return ans;
}
```


## 五、最后  

这次比赛的前两道题有很大的歧义，不过我也是一次通过了。  
第三题和第四题都属于贪心题，分析出题目的性质，然后贪心即可。  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

