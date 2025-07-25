---   
layout:     post  
title:  Leetcode 第 168 场比赛回顾  
description: 鼠标坏了，严重影响比赛效率。    
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate:  2019-12-22 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


leetcode 的这次比赛已经没什么技术含量，拼的是打字速度与电脑操作的速度。  


然后，我的鼠标坏了，复制个变量总是选不中，复制个测试用例也复制不了。  
鼠标我肯定会买一个的。  


但是由这个问题，也看出 leetcode 的一个设计缺陷。  


leetcode 题目上给了三四个测试用例，测试运行时，输入却只提供一个，而不能给一个选择快速测试所有的。  
写完代码，稳重期间一般都会把提供的所有测试用例跑通过才会提交。


由此，所有做题的人都在重复做一件事情：将所有的测试用例从题目中提取出来，粘贴进输入框，点击运行。  
如果 leetcode 直接提供一个多选框，选择跑那些测试用户，将会给做题的人节省很多时间。  


leetcode 的工作人员看见了，可以优化一下。  


接下来看看这四道题吧。  


## 一、位数为偶数的数字个数  


题意：给若干数字，问十进制位数是偶数的数字有多少个。  


思路：一个个求十进制长度，然后判断即可。  


![](https://res2019.tiankonguse.com/images/2019/12/22/001.png)  


## 二、数组划分为连续K个数字  


题意：给若干数字，问能否将数组划分为若干子数组，子数组是连续递增且长度为 K。  


思路：贪心即可。  
不断的从最小值找一个满足条件的子数组，刚好找完则存在，否则不存在。  


优化：直接使用数组查找的话，复杂度很高。  
可以使用 map 来进行数字统计，这样 map 的 key 是天然有序的，就直接迭代即可找到后面的 k 个数字了。  


![](https://res2019.tiankonguse.com/images/2019/12/22/002.png)  


## 三、出现次数最多的次数  


题意：给一个字符串，求出现次数最多的那个子串出现的次数。  


这个问题比较绕。  
首先是所有子串中出现的最多次数。  


比如`A`子串出现`5`次，其他子串出现不超过`5`次。  
那出现次数最多的子串就是`A`，然后`A`出现的次数是`5`。  
所以出现次数最多的次数就是`5`。  


当然，这个子串还有三个限制，比如子串长度最小是多少，最大是多少，去重后的字母个数不大于多少。  


思路：考虑到可能任何子串都可能是答案，所以遍历所有子串是在所难免的了。  


不过，根据子串的三个限制，对于相同起始位置的子串，可以进行一个剪枝，使得需要遍历的子串数量大大减少。  
具体来说，就是相同起始位置的子串，一旦某个长度不满足最大长度了，那后面的都不满足。  


![](https://res2019.tiankonguse.com/images/2019/12/22/003.png)  


## 四、最多的糖果  


题意：题意相当复杂，听我慢慢描述。  


首先有 `n` 个盒子，每个盒子可能会上锁，上锁的话需要钥匙才能打开。
当然，盒子也不在身边，也就是盒子和钥匙同时在手上才能打开盒子获得盒子里的宝物。  
打开盒子后，里面会有糖果、钥匙、其他盒子。  


最开始给你一些已经解锁的盒子，问通过不断的打开可以打开的盒子，最多能获取多少个糖果。  



思路：主要是题目复杂，只要理解了题目，就可以发现，直接`BFS`或者`DFS`搜索即可。  


大概搜索思路就是，根据现有的解锁盒子，全部打开，然后就得到一些新盒子和新钥匙。  
新盒子如果没上锁，就可以递归再次打开。  
新盒子如果上锁了，可以看看自己有没有钥匙，有了，就打开。  
新钥匙可以看看自己是不是已经有没打开的盒子，有了，也可以打开。  
其他情况就把新盒子和新钥匙保存起来。  


![](https://res2019.tiankonguse.com/images/2019/12/22/004.png)  


## 五、最后  


这次比赛最后一题再 `ACM` 中属于模拟题，一般只要读懂题意就可以做出来。  
而第三题，有没有更优的方法我还不知道，你认为有更优的方法吗？  



-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

