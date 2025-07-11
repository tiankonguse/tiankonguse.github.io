---   
layout:     post  
title:  初级算法实践之数组篇  
description: 数组的一些练习题，你可以看看。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate:  2019-06-20 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 一、背景  


之前曾写过《[从零开始学算法](https://mp.weixin.qq.com/s/i22rD_BuQK7ex1VrNvZHVg)》系列和《[算法就是这么简单](https://mp.weixin.qq.com/s/LiWtQsLKQRUrouQTmq_egA)》系列。  


《从零开始学算法》系列主要偏向于理论知识，《算法就是这么简单》系列则偏向于基础知识与对应的算法讲解。  


现在开始，会按照初级、中级、高级三个级别来分别介绍各种算法的实践题以及解题思路，以帮助大家对算法和数据结构有更深的理解。  


下面就看几道数组相关的算法题吧。  


## 二、买卖股票的最佳时机 II  


题意：假设我们可以预测一支股票每天的价格，我们可以进行无数次交易，但是在下次买之前必须卖掉手上的股票。问炒股最多可以赚多少钱？  


思路：对于股票，就是买低卖高。  
如果股票的曲线告诉你，我猜任何一个人都知道在什么时候卖，什么时候买。  



![](https://res2019.tiankonguse.com/images/2019/06/001.png)


比如上面这张图，肯定是在局部最低点买入，在局部最高点卖出。  
通过这样不断的做T，我们就可以赚最多的钱。  


那怎么定义局部最低点呢？  
之前在下降，未来要上涨的那一天就是局部最低点。  
局部最高点类似，之前上升未来下降的那一天就是局部最高点。  



我们先找到局部最低点，然后找到局部最高点，就可以赚一笔钱。  
不断的这样操作，就可以获得最多的钱。  


![](https://res2019.tiankonguse.com/images/2019/06/002.png)


## 三、两数之和  


题意：给一个数组和一个目标，问是否存在两个数的和等于目标，请输出对应的下标。  


思路：第一个方法是枚举两个数字，判断和是不是目标。  
复杂度`O(n^2)`。  


第二个方法是排序加二分。  
对数组进行排序，然后遍历数组，每个数字与目标求差，然后在数组里面二分查找，判断匹配的数字是否在数组里面。  
复杂度`O(n log(n))`  
不过又是排序，又是二分查找，实现较为复杂。  
当然，都有对应的`STL`库函数可以调用。  


第三个方法是使用`map`反向映射。  
使用`map`建立值到下标的反向映射，然后遍历数组，依次查找与之匹配的数字是否存在，也可以找到答案。  


这里有个问题是：如果答案是两个重复的数字，反向映射可能只会保留一个。  
比较不错的解决方案是一边遍历数组，一边对前面映射好的数据进行查找判断。  



![](https://res2019.tiankonguse.com/images/2019/06/003.png)


## 四、有效的数独  


题意：给一个九宫格数独，有些位置已经填写了数字。判断这个数独里的数字是不是合法的。  
一个合法的九宫格数独满足三个性质。  


1. 每行里面没有重复的数字。  
2. 每列里面没有重复的数字。  
3. `9`个`3*3`小正方形里面没有重复的数字。  


思路：这道题其实算是模拟题了。  
按照数独的定义进行合法性检查检查即可。  


第一种方法依次检查行、列、小正方形。具体检查的时候，可以使用`set`记录存在的数字，然后判断是否重复。  
一旦重复则为不合法的数独，结束检查。  


第二个方法是双层循环遍历这个`9*9`的九宫格，然后判断当前位置的元素是否合法。  
一个位置恰好属于某一行，也属于某一列，还属于某个小正方形。  
如果我们可以对这些行、列、正方形进行编号，则可以统一管理。  
比如对于行，编号为`10+行号`，对于列标号为`20+列号`，而对于小正方形，计算比较复杂，标号为`(行/3)*3 + 列/3`。  
统一管理的好处是每个编号对应一个`set`，代表当前规则里已经出现的数字，对于新加入的数字，需要是否已经存在，存在则不合法。  


具体见代码吧。  


![](https://res2019.tiankonguse.com/images/2019/06/004.png)


## 五、最后  


好了，数组的初级题已经讲完了。  


面对这个，大家可能会有两个疑问。  


疑问一、这篇文章介绍的太简单了。  


面对这个问题，其实很容易回答。  
这个是初级篇，所以涉及的题都比较简单。  
等初级篇介绍完后，后面就会介绍比较有挑战的题了。  


疑问二、这些题在哪里可以练习？  


对于练习题这个，我之前一直在想着怎么展现出来。  
直接罗列在文章里面，会使文章显得特别长，也影响美观。  
在评论里回答对应的题，也比较麻烦，也会经常忘记。  


面对这种困境，我发现还是维护一个题目分类比较好。  
所以我在 [tiankonguse/leetcode-solutions](https://github.com/tiankonguse/leetcode-solutions) 上维护了一份题目分类列表。  
想学习算法和数据结构的朋友，可以按照这个分类来专项练习。  


对于动手能力强的人，会直接去 `github` 搜 `tiankonguse` 然后找到这个项目。  
而对于有心的人，会点击原文，在打开的博客里面也可以找对应的链接地址。  


但是有时候，某些人可能不能打开原文链接。  
此时，你可以在公众号后台回复`leetcode`来获取`github`项目地址吧。  



-EOF-  

