---   
layout:     post  
title: leetcode 第 250 场算法比赛  
description: 这次最后一题真的不会做，没见过这种题型。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 零、背景  


这次比赛，刚开始的时候 WIFI 连不上网。  
只好使用手机建立热点来打比赛。  


前三题还算顺利，很快就做完了。  
第四题一看，可以猜到使用 trie 树，但是完全没想法，只好弃疗，做了一道每日一题。  



![](http://res.tiankonguse.com/images/2021/07/18/001.png)


之前已经挖了一个坑来学习后缀数组，今天再次挖个坑学习树上的 trie 树。  


PS：由于文章贴代码阅读体验不好，后面如果代码超过 10 行，就不贴代码了。  
代码我都会上传到 github 上，也会录比赛的视频上传到 B 站上。  



## 一、可以输入的最大单词数  

题意：给一些句子和一些非法字母，问纯字母单词里面，有多少个单词不包含非法字母。  



思路：先将句子分隔为单词，然后判断是否包含非法字母即可。  



## 二、新增的最少台阶数  


题意：给一个数组，代表阶梯的高度。每次最高只能爬 dist 高度的阶梯，问需要插入多少个阶梯才能爬到楼顶。  


思路：原题意中阶梯还是严格递增的，这个条件没有意义。  
由于问题是求插入的阶梯个数，那我们只关心从当前高度到下个高度至少插入多少个阶梯，求总和即可。  


从一个高度到达下一个高度，每次最多上升 dist 单位，这个就是个除法问题，注意边界的加一减一问题即可。  


## 三、扣分后的最大得分  


题意：给一个矩阵，每一行需要选一个数字，代表得分。  
相邻两行选择的数字有个代价，代价为列数的距离。  
最终得分是每个的得分减去所有代价，求最大的得分。  


思路：矩阵总大小是`10^5`，假设是 n 行 m 列。  
可以发现，我们只关心相邻两行的数字和答案，使用经典的滚动数组即可保存答案。  


最简单的思路是求出每一行的最优值，最后一行的最大值就是答案。  
当前行的最优值到下一行的最优值，暴力算法的复杂度是`O(m^2)`  
求出所有行的最优值，综合复杂度就是`O(n*m^2)`。  


由于行和列的最大值不确定，这就导致可能有`10^5`行，也可能有`10^5`列。  
如果列数很大的话，暴力的方法肯定会超时。  


所以我们就需要找一个`O(m)`的状态转移方程。  


默认状态转移方程：`f(n, i) = max(f(n-1, j) + dis(i, j) + val(n, i))`  
含义为枚举上一行所有列，计算每一列与当前位置的临时最优值，从而得到最终最优值。  


由于存在相对距离这个概念，我们可以把状态转移方程拆分为两部分：左侧最优值与右侧最优值。  


```
f(n, i)     = max(Left(n, i), Right(n, i))

Left(n, i)  = max(f(n-1, j) - (i - j) + val(n, i))
            = max(f(n-1, j) + j + val(n, i) - i)
            = max(f(n-1, j) + j) + val(n, i) - i

Right(n, j) = max(f(n-1, j) - (j - i) + val(n, i))
            = max(f(n-1, j) - j + val(n, i) + i)
            = max(f(n-1, j) - j) + val(n, i) + i
```


可以发现，  `max(f(n-1, j) + j)` 是与 i 无关的一个值，可以预处理计算得到的。  
这样，我们就可以 `O(m)` 的复杂度计算出每一行的状态了。  


## 四、查询最大基因差  


题意：给一个编号为 `0~n-1`的有根树，以及若干询问。  
每个询问有两个值`node`和 `val`。  
问对于 编号 node 到达 根的路径节点中，求与 val 异或的最大值。    


思路：极端情况下是一个链，这样暴力计算的复杂度就是 `O(n*m)`，显然会超时。  


由于是异或最大值，可以猜到这道题需要使用 trie 树来做，但是我想好很久也没思路，便放弃了。  


比赛的时候，为了把自己的想法录制到视频中，我把分析思路写了下来。  


```
// 0：突破口：树的 node 编号是 0 到 n-1，这么有规律，建立的树是一个全的二叉树。
// 1：暴力：一个 Node 到根的路径有哪些 node，不访问一遍怎么知道？ 暴力超时
// 2：对 tree 建立 tire：怎么快速判断一个查询 node 是否存在与 更大的字典树分支中？
// 3：对 查询 Node 建 tire：从叶子节点扫描 tree，判断 tire 中哪些 查询 node 存在更大值。
```


分别猜测对树建 trie 树，或者对查询建 trie 树，发现都无法进一步处理。  


后面我找个时间学习一下这个算法，单独写篇文章出来吧。  


## 五、每日一题  


题意：给若干字符串，要求对字符串进行分组，含的字母集合相同时，需要划分到一个分组。  


思路：对每个字符串进行排序，排序后的结果当做 map 的 KEY 即可分组。  



## 六、最后  


这次比赛，最后一题这个算法之前没见过，完全没思路。  
你之前见过吗？  


加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
