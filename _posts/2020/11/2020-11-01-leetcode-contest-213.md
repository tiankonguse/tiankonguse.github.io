---   
layout:     post  
title: leetcode 第 213 场算法比赛  
description: 这次题比较简单，只是我没睡好，卡壳了  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2020-11-01 21:30:00  
published: true  
---  


## 零、背景  


今天这次比赛题目都很简单，都是基础题。  


下面我们来看看下面四道题吧。  


## 一、能否连接形成数组  


题意：给一个原始数组与若干个子数组，问子数组能否通过某种顺序拼出原始数组。  


分析：如果只看题目，这道题就是 hard 难度级别的，因为涉及到前缀匹配的问题。  
但是题目又补充了一句：原始数组的元素互不相等。  


看到互不相等，这道题就可以直接贪心做了。  


思路：遍历原始数组，然后在子数组中判断第一个元素是否等于当前元素。  
找到一个后，比较子数组与原始数组能否匹配上。  
如果可以匹配，不断的进行这样的匹配。  
最后应该恰好遍历完原始数组。  


复杂度：`O(n^2)`  


优化：由于所有值互不相等，对子数组第一个元组建立一个 hash 映射。  
这样就可以 `O(1)` 找到第一个元素相等的子数组了。  


![](https://res2020.tiankonguse.com/images/2020/11/01/001.png)  


## 二、统计字典序元音字符串的数目  


题意：给一个数字 n，求使用元音`aeiou` 组成的字典序排列字符串的个数。  


字典序排列字符串定义：字符串中的字母前面的不大于后面的。  


思路：动态规划即可，选与不选的问题。  


![](https://res2020.tiankonguse.com/images/2020/11/01/002.png)  


## 三、可以到达的最远建筑  


题意：给一堆建筑的高度，若干砖头和若干梯子。  
从左到右来爬建筑物，如果是向下的，可以直接跳下去。  
如果是向上的，高度的差值可以使用对应个数的砖头垫脚上去，也可以直接使用梯子上去  
问能到达的最远建筑物的编号。  


思路：贪心题。  


1、优先使用砖头前进。  
2、砖头不够了，就只能使用梯子了。  
3、使用梯子的时候，如果之前某个步骤用的砖头大于当前高度，可以进行交换，进而节省一些砖头。  


![](https://res2020.tiankonguse.com/images/2020/11/01/003.png)  


## 四、第 K 条最小指令  


题意：有一个矩阵，从左上角走到右下角会有一个路线。  
横着走标记为`H`,竖着走标记为`V`，路线就是`HV`组成的一个字符串。  
在所有合法路线中，求字典序排第 k 的路线。  


思路：典型的动态规划题。  


预先计算出所有状态的路线数。  
然后判断当前状态选择横着走是否满足 k 个，满足了答案就在横着走里面。
否则答案在竖着走里面，k 需要减去跟着走的路线数。  
此后递归即可。  


![](https://res2020.tiankonguse.com/images/2020/11/01/004.png)  


## 五、最后  


这次比赛的题比较简单。  
不过我敲错一个地方导致 WA 了一次。  
还因为脑子里的逻辑没清晰就敲代码，浪费了点时间。  
最终排名一百名之外了。  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

