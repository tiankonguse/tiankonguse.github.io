---   
layout:     post  
title: leetcode 第 221 场算法比赛  
description: 最后一题大的模拟题，没时间敲了。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


今天继续参加 leetcode 周赛，遇到一个大的模拟题，没有在比赛期间敲出来。  
赛后敲出来后，提交一把就通过了。  


相关源代码： 
https://github.com/tiankonguse/leetcode-solutions/tree/master/contest/221  


## 一、判断字符串的两半是否相似


题意：给一个长度为偶数的字符串，问前一半与后一半的元音字符个数是否相等。  


思路：按照题意判断即可。  


小技巧：元音包括大写和小写，可以提前放在 `set` 容器中，这样直接判断是不是元音即可。  



## 二、吃苹果的最大数目  


题意：每天给若干苹果，以及苹果的保质期。  你每天可以吃一个苹果，问最多可以吃多少个未过期的苹果。  


思路：一眼就可以看到需要使用滑动窗口或者双指针来做。  


左指针当前是第几天，右指针是吃到第几天了。  


聪明的你可能一下就发现，两个指针是相同的。  
所以我们只需要使用一个指针接口，代表当前吃到哪一天了。  


这道题的关键是怎么维护这个窗口。  
即知道某一天时，可以加入 x 个保质期为 y 的苹果。 
而再向后移动一天，之前收集的苹果的保质期都要减去一天。  


有经验的同学，很快就可以想到保存截止日期，就不需要每移动一天减一次了。  


对于收集的苹果，我们通过截止日期储存起来。  
每次优先吃快要过期的苹果。  


这样，就需要优先队列这个数据结构了。  
当然，我还是喜欢使用 map 来代替优先队列。  


就这样我们就可以做出这道题了。  
具体源码可以在第一部分的源代码链接里找到。  


当然，这道题作为第二题，我猜想我做复杂了。  
你们是怎么做的？  


## 三、球会落何处  


题意：给一个 `m*n` 的网格，有 n 个球放在每一列的最顶部。  
网格里面有个斜着的挡板，向左或者向右。  


问最终每个球会从哪一列出来，如果被卡主了，就输出 -1.  


思路：起初我以为要输出每一列要输出多少个球，敲完了发现读错题意了，浪费不少时间。  


看清一题后，发现这是一个小的模拟题。  
从上到下判断当前位置的球是否可以到下一行，可以了更新答案。  



## 四、与数组中元素的最大异或值  


题意：给一个数组，以及若干查询。  
每个查询给一组数字 m 和 x，问数组中，小于 m 的数字里面，与 x 异或的最大值是多少。  


思路：一看是异或求最大值，显然是字典树了。  
不过这个分两种情况，第一种是查找小于等于 m 的字典树分支，第二种是查找小于 m 的分支。  


查找小于等于的时候，又根据 m 的值分多种情况。  


状态1：`bit(m,i)=1`,1分支存在，0分支不存在  
此时，只能进入到 1 分支，条件依旧是小于等于。  


状态2：`bit(m,i)=1`,1分支存在，0分支存在  
此时，可以进入两个分支，1分支是小于等于，0分支是小于。  


状态3：`bit(m,i)=1`,1分支不存在，0分支存在
此时，只能进入分支 0，条件是小于。  


状态4：`bit(m,i)=1`,1分支不存在，0分支不存在  
误入歧途，应该不存在这种情况。  


状态5：`bit(m,i)=0`，0 分支存在  
此时只能进入 0 分支，条件是小于等于。  


状态6：`bit(m,i)=0`，0 分支不存在  
再次误入歧途，不存在这种情况。  


而对于小于的情况，则需要根据 x 的值分多钟情况讨论。  


状态7：`bit(x,i)=1` 0 分支存在。  
此时不管 1 分支，走 0 分支更优。  


状态8：`bit(x,i)=1` 0分支不存在，1 分支存在。 
此时只能走 1 分支


状态9：`bit(x,i)=1` 0 分支和 1 分支都不存在。 
不可能的情况。  


状态10：`bit(x,i)=0` 1 分支存在。
此时不管 0 分支是否存在，走 1 分支更优。  


状态11：`bit(x,i)=0` 1 分支不存在， 0 分支存在。
此时只能走 0 分支。  


状态12：`bit(x,i)=0` 0 分支和 1 分支都不存在。  
不可能的情况。  


枚举出者 12 种情况后，我们应该就可以通过这道题了。 


这算是一个大的模拟题了，我的手速在比赛时间内敲不过来。 
具体源码可以在第一部分的源代码链接里找到。  


## 五、最后  


这次比赛的题还不错，你都是怎么做的？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
