---   
layout:     post  
title: leetcode 第 267 场算法比赛  
description: 这次比赛没啥意思，面试题？     
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛没啥意思，三道模拟题，一个模板并查集，拼手速的时候到了。  


## 一、买票需要的时间  


题意：n 个人排队买票，每个人需要买若干张票。  
规定一个人买一张票后就要去队尾重新排队，问第 k 个人在什么时间才能买完所有票。  


思路：  

数据量不大，循环模拟即可。  
复杂度：`O(n * C)`  



优化：  


假设第 k 个人需要买 C 张票。  
则前面的人肯定也可以买到至少 C 张票或者买够自己的票。
后面的人至多只能买到 `C-1`张票或者买够自己的票。  


这样第 K 个人买完所有票的时候，前面的人和后面的人买多少票是固定的，那循环一遍计算累加即可。  
复杂度：`O(n)`  



## 二、反转偶数长度组的节点  


题意：给一个链表。  
现在将链表的元素按顺序进行分组，组的大小分别是 1、2、3、...  
最后一组不够时，剩余多少是多少。  
现在要求将分组大小为偶数的链表进行翻转，求翻转后的链表。  


思路：按题意进行分组翻转即可。  


小技巧：维护前一个分组的最后节点、当前分组的最后一个节点，即可快速翻转。  
复杂度：`O(n)`  


## 三、解码斜向换位密码  


题意：给一个字符串和行数固定的加密矩阵。  


加密规则如下：  
-）从第一行第一列开始，斜向右下依次填充字符。  
-）填充到最后一行时，再从第一行的下一列开始进行填充。  
-）整个字符串填充完之后，将最右边的连续空列都删除。  
-）剩余的矩阵，按行拼接为字符串。  


现在给你一个加密后的字符串，求计算加密前的字符串。  


思路：模拟题，字符串中的字符 与矩阵的位置是唯一映射的，按照映射计算出字符串即可。  



## 四、处理含限制条件的好友请求  


题意：有n个人，给一个好友限制列表，代表某些人两两不能成为朋友（间接也不行，即不能有连通）。  
现在有一个好友申请列表，问每个申请是否可以通过。  


通过的条件：通过后，所有人依旧满足好友限制列表，则可以通过。  



思路：典型的并查集问题。  


由于数据量不大，直接暴力计算即可。  
循环好友申请列表，暴力判断新的 cp 是否在好友限制列表中，没有了合并并查集即可。  


复杂度：`O(n^2)`  



## 五、最后  


最后一题还要找并查集模板，结果我找不到了。  


所以我计划在 leetcode 这个项目里创建一个目录，整理新的算法模板。  

整理的规则是做比赛的时候，遇到一个算法，就加入一个。  
禁止直接搜索所有代码模板放进去，那样太混乱了。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
