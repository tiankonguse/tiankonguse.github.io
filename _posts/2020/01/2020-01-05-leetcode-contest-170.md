---   
layout:     post  
title:  Leetcode 第 179 场比赛回顾 
description: 比赛  
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2020-01-05 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


这次比赛的题都是基础题，考察敲代码速度的时候到了。  


## 一、解密字符串  


题意：给一个字母到数字的加密规则，然后给一个加密后的字符串，求加密前的字符串。  


规则1：对于字母`a-i`，映射到`1-9`。  
规则2：对于字母`j-z`，映射到`10#-26#`。  


思路：简单来说，加密规则就是字母映射到以`1`开始计数的数字，对于两位数字，后面需要加一个`#`符号。  


那解密规则就是一个逆过程。  


但是这个加密不是一个好的加密算法，因为读第一个字符后，存在不确定性，即后面有多种可能。  
比如遇到字符`1`时，可能是字符`a`，也可能是字母`j`，也可能是`k`，这个情况有11中。  


所以我们需要向后探测这个具体是哪种情况。  


具体来说就是看有没有`#`符号，然后分情况判断。  



![](https://res2020.tiankonguse.com/images/2020/01/05/001.png)  


## 二、数组的区间异或查询  


题意：给一个数组，然后若干询问。  
每个询问是一个子数组区间，求这个子数组的异或结果。  


思路：最暴力的是按题意一个个的区间异或。  
复杂度：`n^2`  
按照 leetcode 的传统，这个方法不会超时。  


前缀优化：异或和求和类似，具有结合性的规律。  
具体来说就是，对于`a<b<c`，`f(a, c) = f(f(a,b-1), f(b,c))`。  
所有能够使用前缀和的公式都需要满足这个结合律。  



利用前缀的结合律，我们可以预先求出所有前缀的答案，询问时，通过相减即可找到答案。  
询问复杂度：`O(1)`  
综合复杂度：`O(n)`  



![](https://res2020.tiankonguse.com/images/2020/01/05/002.png)  


## 三、朋友在看哪些小视频  


题意：题意相当复杂。  
首先有`n`个人，每个人有一个自己看的小视频列表，每个人有一个朋友列表。  
`level`解释：最少需要经过`level`层才能认识的朋友。  
目标：查找某个人第`level`层转弯抹角的朋友看到小视频列表。  
输出规则：优先按小视频观看次数排序，一样了按小视频名字排序。  


思路：题意看懂了发现没什么难度。  

第一步找到`level`层的朋友列表。  
第二部统计这些朋友看的小视频，排序即可。  



![](https://res2020.tiankonguse.com/images/2020/01/05/003.png)  
![](https://res2020.tiankonguse.com/images/2020/01/05/004.png)  



## 四、最小修改回文串  


题意：给一个字符串，问最少插入多少个字符，能够使得字符串是回文串。  


思路：假设已经插入是回文串了，我们忽略哪些插入以及插入匹配的字符，剩余的字符肯定是原字符串中最长的对称相等序列。  
即寻找最长的回文子序列，剩余的就是需要插入匹配的。  


证明略。  


![](https://res2020.tiankonguse.com/images/2020/01/05/005.png)  



## 五、最后  


面对简单的题，我使用洪荒之力去敲键盘，可耐还是敲得太慢。  
看前百名里，第一名用了 8 分钟，最后一名用了 35 分钟，而我用了 45 分钟。  
还有很大的进步空间，准备每天练 10 分钟的打字，看看效果吧。  


PS：昨天注册了 B 站，发现 B 站需要答 100 道题才能发弹幕，果然是一个独特的公司，  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

