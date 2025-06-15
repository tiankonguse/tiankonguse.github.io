---   
layout:     post  
title: leetcode 第 251 场算法比赛  
description: 这次比赛题目都还算简单，但是有点事，差几分钟才做完。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-07-25 21:30:00  
published: true  
---  


## 零、背景  


这次比赛题目都还算简单，但是我有点事，浪费了不少时间，最后一题差几分钟才做完。  


## 一、字符串转化后的各位数字之和  


题意：给一个纯小写字母组成的字符串，问转化为大整数后，各位数字相加，得到的数字是多少？  


思路：按照题意模拟即可。  


注意实现：由于是大整数，字符串转化为大整数的时候可能会越界。  
所以第一次转化的时候可以直接把各位数字相加。  


## 二、子字符串突变后可能得到的最大整数  


题意：给一个大整数，再给一个数字的映射表。  
问对大整数的子串进行映射后，可以得到的最大数字是多少？  


思路：对于数字，有一个特点：如果高位可以更大，选择高位会更优。  
所以从高位开始判断，一旦可以更大，就找到了子串的起始位置。  
后面的都尝试进行映射转化，直到映射变小时子串结束。  



## 三、最大兼容性评分和  


题意：给一份试卷，有 n 道题，有 m 个学生参与考试，m 个教室参与判卷。  
由于每个教室有自己的答案列表，所以同一个学生分配到不同的教室，考试成绩可能会不一样。  
问学生与教室如何匹配，总成绩才会更高。  


思路：m 最大是 8，所以进行排列组合枚举所有情况，求最大值即可。  


排列组合的方法很多，我纠结使用哪种方法比较快。  
最终决定还是使用枚举 bit 位来做，以后都使用这种方法吧，简单高效。  


做这道题的时候，随手做了很多优化，分享一下。  



优化1：试卷的答案只有 0 或 1，每个学生和教室的答案可以压缩的 Bit 位里，使用一个数字表示。  


```
int mast = 0;
for(int i=0;i<n;i++){
    mast |= l[i]<<i;
}
```

优化2：枚举过程中，子状态可以使用记忆化来防止重复计算。 


```
int Dfs(const int mast, const int offset){
    if(offset == maxBit) return 0;
    if(dp[mast] != -1) return dp[mast];
    
    int ans = 0;
    // select one bit vs offset
    for(int bit = 0; bit < maxBit; bit++) {
        if((mast & (1<<bit)) == 0) continue;
        int nowScore = MatchScore(bit, offset);
        int childScore = Dfs(mast ^ (1<<bit), offset + 1);
        ans = max(ans, nowScore + childScore);
    }
    
    return dp[mast] = ans;
}
```


优化3：匹配一个学生和教室后，通过异或可以快速得到错误的答案，总分减去错误的就是正确的。  


```
int MatchScore(int bit, int offset){
    int val = students[bit] ^ mentors[offset];
    return n - __builtin_popcount(val);
}
```


## 四、删除系统中的重复文件夹  


题意：给若干个字符串数组组成的文件夹路径，如果文件夹中的子文件夹都相同，则成这两个文件夹是相同的。  
求将所有相同文件夹删除后剩余的文件夹路径。  


思路：文件夹路径可以转化为一个树，问题就转化为了删除相同的子树。  


对于一个子树，可以使用一个 hash 来代表，这道题就很简单了。  


注意事项：叶子节点由于没有子文件夹，不算相同文件夹。  



```
for(auto& p: paths) {
    AddPath(p);
}

DfsHash(&root, 0);

vector<string> tmp;
for(auto& p: root.sub_path){
    DfsAns(&p.second, tmp);
}

return ans;
```


## 五、最后  


这次比赛的题还算不错，只可惜我有事，最后一题差几分钟才过的，排名就比较落后了。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

