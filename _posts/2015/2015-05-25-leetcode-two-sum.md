---  
layout: post
title:  leetcode Two Sum 解题报告
category: [算法]
description: 最近在空闲的时候，会敲几道算法题，现在把Two Sum的思路简单的记录下来。    
tags: [leetcode, algorithms, 解题报告]
keywords: [leetcode, algorithms, 解题报告]
updateDate:   13:04 2015/5/25
---

## 题意

题目地址 [Two Sum](https://github.com/tiankonguse/leetcode-solutions/tree/master/two-sum)  
源代码见这里 [two-sum.cpp](https://github.com/tiankonguse/leetcode-solutions/blob/master/two-sum/two-sum.cpp)


大概意思是告诉你一堆数字和一个目标数， 问是否能在这堆数字中挑出两个数，使得他们的和是这个目标数。  


## 设计方案



### 暴力方法

最暴力的方法就是双层循环来做了， 两个数字相加后判断是否等于目标数字。  
这个方法的复杂度是 `O(n^2)`,  实际上可能会超时。  


### 二分查找

我们暴力方法中的第二层循环的目的实际上是判断是否存在一个数，这个数和第一层循环的那个数之和是目标数。  
如果我们先使用目标数减去第一层循环里的数字， 接下来的问题就是怎么快速判断我们想要的数字是否存在。  

这个查找问题，暴力方法的复杂度是`O(n)`, 如果能够二分查找就好了。  
怎么二分呢？ 先对数组排序，然后二分查找即可。  

对于会STL的同学肯定会说这个不需要二分了，使用map就可以了。  
确实如此， 这个map内部的实现机制也是二分，所以我们直接使用map吧。  
目标都是把查找复杂度将到了 `O(log(n))`了。  

### 细节问题

想到二分或者map, 问题已经不会超时了。  
但是题意要求我们输出数字的下标，这个在确定有答案时，再去扫描一遍数组也是可以得到下标的。  
当然也可以在map的时候或者排序的时候，把下标也保存起来， 这样就可以在确定有答案时，直接得到下标了。  


在算法的世界里，大家更倾向于把下标保存下来，但是这样做算法的各个步骤的耦合就变得比较大了，在项目中不太好。  
我们的目标需要设计成下面的样子。  

1. 预处理数组
2. 遍历数组，得到数组的一个数字
3. 目标数减去数组的这个数字，得到要查找的数字
4. 二分或者map查找，当数字存在时，存在返回位置
5. 判断找到的数字是否合法
6. 数字合法则找到数字的下标


这样做的话，每一步骤将会清晰明了，当某一步出问题了，我们只需要修改那一步即可，不会影响其他步骤。  

有了上面的步骤，大部分人都能写出正确的代码了。  

但是要注意一点，那就是在检查数字时候合法时， 需要特别注意了，一不小心就会遗漏一些边界的。  

比如下面这个情况:  

```
Input: numbers={3, 2, 4}, target=6
Output: index1=2, index2=3
```

有些人可能会跑出 `index1=1, index2=1` 的答案来的。  



《完》
