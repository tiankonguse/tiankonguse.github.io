---   
layout:     post  
title:  leetcode 第185算法比赛  
description: 今天本来计划四十分钟结束比赛的，结果翻车了。  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2020-04-19 21:30:00  
published: true  
---  


## 零、背景  


今天 leetcode 的第185场算法比赛开始后，我先看了四道题型，发现都是简单题。  


心中有很大的把握四十分钟结束比赛，结果最后翻车了，竟然被卡住了，心塞。  


下面来看看这四道题吧。  


## 一、重新格式化字符串  


题意：给一个只包含小写字母和数字两种类型的字符串。  
我们需要对字符串的字符调整顺序，使得相邻位置的字母类型不能相同。  


思路：分别统计两种类型字符的个数。  


如果个数差为0或者1，则有答案，否则肯定没答案。  


如果差为0，依次取一个类型的字符即可。  
如果差为1，先去较多的那个类型。  


![](https://res2020.tiankonguse.com/images/2020/04/19/001.png)  


## 二、点菜展示表  


题意：告诉我们每个餐桌点了哪些菜。  
求输出一个菜单矩阵，第一行是所有的菜名，第一列是每个餐桌的编号，matrix[i][j] 代表第i个餐桌点了多少第j个菜。  


思路：题意比较绕，理解需要点时间。  
理解了发现就是一个统计题，map + set 即可解决。  


set 统计有哪些菜。  
map 统计每个餐桌点了哪些菜。  


![](https://res2020.tiankonguse.com/images/2020/04/19/002.png)  


## 三、数青蛙  


题意：青蛙完整的教一声会喊出五个单词`croak`。  
很多青蛙一起叫，单词混合在了一起。  
给一串字符串，问是否都是完整的青蛙叫声，如果是，最少需要几个青蛙来叫。  


完整叫声解释：完整的叫声意味着字符串可以分成m个`croak`子序列。  


最少解释：如果一个青蛙叫完最后一个单词`k`后，后面可以继续叫。  
比如`croakcroak` 一个青蛙叫两声就可以了，所以最少需要一个青蛙。  


思路：状态统计即可。  
对第一个字母和最后一个字母特殊判断，中间的进行状态转移即可。  


![](https://res2020.tiankonguse.com/images/2020/04/19/003.png)  


## 四、生成数组  


题意：对于数组找最大值的算法，最大值会被替换`search_cost`次。  
现在求构造一个长度为n的数组，数组可以选的数值是1~m，数组应用最大值算法时最大值需要被替换k次。  


思路：典型的动态规划题。  
状态转移公式`f(n,m,k)`代表题意。  


我们只需要枚举最大值和位置即可。  


我选择的是先枚举位置，从此走上了不归路。  


状态转移方程组大概如下：  


```
f(n,m,k)=sum(F(n,m,k,maxPos))  
F(n,m,k,maxPos) = sum(maxVal^(n-maxPos) * f(maxPos-1,maxVal-1,k-1))  
```


先枚举 maxPos，然后枚举 maxVal。  
枚举 maxVal 后，右边是随意填充数字的，左边则正常递归。  


当然，这个方程也没问题。  
但是我当时边界没处理好，最终写出来的时候比赛已经结束了。  


后来发现，先枚举最大值的时候，状态转移方程会变得特别简单。  


大概如下：  


```
f(n,m,k)=sum(F(n,maxVal,k))  
F(n,m,k)=m*F(n-1,m,k)+sum(F(m-1,maxVal,k-1))  
```


递归的只有F函数，分两种情况。  
第一种是最后一位不是最大值，则随意填充。  
第二种是最后一位是最大值，则枚举下一个最大值。  


![](https://res2020.tiankonguse.com/images/2020/04/19/004.png)  


## 五、最后  


这次比赛的题都比较简单，不过最后一题我犯了一个错误，从而翻车。  


这类动态规划其实就是排列组合类题。  
枚举位置会使状态变得很复杂，还需要求`a^b`等。  
而枚举最后一个位置，则可以通过循环加得到答案。  


谨记这次翻车，  


《完》


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

