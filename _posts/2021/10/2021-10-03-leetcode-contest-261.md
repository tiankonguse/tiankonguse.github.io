---   
layout:     post  
title: leetcode 第 261 场算法比赛  
description: 要去吃饭了，博弈题没有时间做了。     
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-10-03 21:30:00  
published: true  
---  


## 零、背景  


这次比赛很有意思，出了一道博弈题。  


由于要吃饭了，我就放弃比赛了。  


赛后一看榜单，震惊了，竟然进入前百名了。  


## 一、转换字符串的最少操作次数  


题意：给一个字符串，每次最多可以将三个连续字符串设置为固定字符，问把至少需要多少次才能把所有字符设置为固定字符。  


思路：循环找下个不是固定字符的位置，次数加一，位置加三即可。  


## 二、找出缺失的观测数据  


题意：有两个数组，值是 1 到 6 之内的数字。  
现在给出第一个数组的所有数组，以及第二个数组的大小，以及两个数组所有数字的平均数，问是否可以构造出第二个数组。  


思路：题目可以转化为给一个数组的和，求构造数组的数字。  


假设数组大小为 n，只要数组的和在 `[6, 6n]` 之间，则肯定可以构造出数组来。  


最简单的思路是枚举第一个数字，判断剩余的数字是否可以构造出数组。  
复杂度：`O(6n)`  


当然，我们也可以直接构造出这个答案。  
如果当前的和不小于`(n-1) + 6`，则当前这个数字可以选择 6。  
一旦不满足上面的情况，除了最后一个数字，其他数字都选择 1 即可。  
复杂度：`O(n)`


## 三、石子游戏 IX  


题意：有 n 堆石子，每堆石子有若干个石子。  
现在 Alice 和 Bob 开始玩游戏，Alice 先走。  


-）两个玩家轮流选择一堆石子。  
-）如果玩家选择一堆石子后，所有选择的石子个数为 3 的倍数，则当前玩家输掉游戏。  
-）如果玩到最后，没有人输，则判定为 Alice 输掉游戏。  


问 Alice 是否可以获胜。  


思路：首先可以发现，对于每堆石子，只需要关心模 3 之后的关系。  


所以预处理所有石子，分别得到取模 3 的结果，为 值0、值1、 值2 三种情况。  


对于 0 的石子，可以发现只关心奇偶性。  
因为 Alice 选择了这个，Bob 也可以选择这个，之后结果保持不变。  
所以可以理解为只有 0 个或者 1 个。  


对于 值1 的石子，只有选择 值0 或者 值1，选择值2 必输。  
对于 值2 的石子，只有选择 值1 或者 值2，选择值1 必输。  


由于 值0 只有一个，可以先不管，此时上面的选择策略都将为固定的。  


固定的含义是，对于当前累计和为值1时，只能选择值 1，状态转化为 值2。 
当前累计值为值2时，只能选择值 2，状态转化为值 1。  


如果值1 和值2都选择完了，则平局，再根据是谁，判处胜负。  



所以，这道题只需要预处理出值0 的奇偶性，值1的个数，值2的个数，递归暴力计算即可。  
复杂度：`O(n)`  



## 四、含特定字母的最小子序列  


题意：给一个字符串，求构造一个长度为 k 的子序列，这个子序列包含 repetition  个字母 letter 。  
题目保证存在这样的答案，求字典序最小的答案。  


思路：求字典序最小的，答案的第一个字母贪心选择最小的字母，如果选择后依旧可以构造出答案，那肯定需要选择了。  


有了这个贪心思路，问题就变得简单了。  


第一步需要能够快速找到枚举字母的第一个位置。  
可以预处理整个输入字符串，建立每个位置每个字母向后第一次出现的索引。  


找到当前字母后的位置后，再根据后缀字符串来快速判断是否可以构造答案。  


如果存在答案，需要满足三个条件。  


-）剩余的字符串与已选的字符串长度满足要求。  
-）剩余的特定字符与已选择的特定字符长度也满足要求。  
-）待选的字符串长度不小于待选的特定字符。  


剩余的特定字符可以预处理字符串后缀有多少个满足题目的字符串接口。  


PS：WA 两次，第一次是没考虑条件三，第二次是无符号与负数比较了，具体可以看我在B站录的视频。  


## 五、最后  


这次比赛做了三道题后，家里人就喊着去吃饭。  


于是只好放弃比赛，没想到还进入前百名了。  


想想自己，可能大家都是因为国庆在外或者串门，就没有参加比赛吧。  



PS：最后两道题有点技术含量，代码有点长，这里就不贴了。  
可以去 github 看源码 或者 B站（ID：tiankonguse）看现场录的视频吧。  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

