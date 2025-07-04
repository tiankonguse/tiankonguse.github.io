---   
layout:     post  
title:  均匀洗牌算法   
description: Leetcode 上有一道洗牌题，你敢来挑战吗。  
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate:  2019-07-06 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 一、背景  


给一个数组，每个值互相不同。  
求实现一个洗牌算法，把牌打乱，使得输出的牌足够随机。  


这里足够随机其实是一个模糊的概念，我们需要给出一个定义什么叫做足够随机。  


使用概率来定义足够随机，则是每个值最终在每个位置的概率是`1/n`。  


但是有时候，一个算法不容易计算想要的概率，此时就可以使用排列组合来枚举了。  


每个位置的概率是`1/n`  
那第一个位置就有`n`中情况  
第二个位置就有`n-1`中情况  
第三个位置就有`n-2`中情况  
依次递推，总共有`n*(n-1)*(n-2)...*1 = n! 种情况`。  
也就是一个算法足够随机的一个必要条件是恰好产生`n!`中排列。且每种排列出现的次数相等。  


接下来我们就看看常见的算法以及正确性吧。  


## 二、抽奖算法  


这个算法是大家都能想到的算法。  


具体如下：  
每次从数组`[0,n-1]`中随机的选一个数字，然后把这个数字移动到第一个位置。  
接下来从数组`[1,n-1]`中随机的选一个数字，再把这个数字移动到第二个位置。  
这样不断的进行下去，直到最后一个数字。  
这样总体复杂度是`O(n^2)`。  


在结果集里面，第一个数字是在第一次随机选中的，所以概率是`1/n`。  
而其他数字未来选中的概率是`(n-1)/n`。  

 
第二个数字是第二次随机选中的，所以概率是 `(n-1)/n * 1/(n-1) = 1/n`。  
后面的数字类似，经计算，所有位置的概率都是`1/n`。  


其实这个就和平常所见的抽奖类似。  
抽奖有先后，但是大家的概率却是相同的。  
对应的道理也可以使用上面的公式来解释。  



## 三、Fisher Yates算法   


对于上面的抽奖算法，确实可以做到比较均匀的将数组打乱。  
可是复杂度比较高。  


于是就想着对这个抽奖算法进行优化：每次不再移动元素，而是和第一个元素进行交换。  


具体如下：  
每次从数组`[0,n-1]`中随机的选一个数字，然后把这个数字与第一个元素交换。  
接下来从数组`[1,n-1]`中随机的选一个数字，再把这个数字与第二个元素交换。  
这样不断的进行下去，直到最后一个数字。  
这样总体复杂度是`O(n)`。  



那怎么证明这个算法是正确的呢？  
每一轮的时候（假设有k个数字），我们的目标是从这`k`个里面随机的选择一个。  
既然是随机，也就意味着这`k`个数字的顺序其实是无所谓的。  
不断怎么对这`k`个数字进行交换，每个数字被选择的概率都是`1/k`。  


而每一轮选中一个数字后，我们和第一个数字交换，相当于对下轮的数字进行了一下交换。  
而根据上面的理论，这个交换并不影响最终的概率，所以这个优化是正确的。    


## 四、顺序随机洗牌   


当然，还有人想出另外一个方法。  


第一次随机选择一个数字，和第一个位置的数字交换。  
第二次随机选择一个数字，和第二个位置的数字交换。  
依次递推，最终随机选择的数字和最后一个位置的数字交换。  


这个算法和抽奖算法的不同是，抽奖算法每次随机的数字集合是逐渐减小的，而这个算法的数字集合始终不变。  


那这个算法是否正确呢？  


这里概率还真不好计算。  
但是我们可以从排列组合的角度来看这个问题。  
每次可能有`n`种结果，进行了`n`次，那最终就是有`n^n`种结果。  


![](https://res2019.tiankonguse.com/images/2019/07/06/001.png)


而`n^n`种结果不是平均分布的，因为对于`n!`中排列，不是均匀的。  
根据上图可以看出，`132`多了一次，`213`结果多了两次，所以这个算法不是完全随机的。



## 五、最后  


上面的方法是常见的洗牌。  
实际上洗牌方法还有很多。  


1. 抽出顶部的牌，随机插入牌堆中任一位置。  
2、随机抽取两张牌，交换他们。  
3、随机抽取两张相邻的牌，交换他们。  
4、将牌随机分成两叠，交错放下。
5、从牌堆中随机抽出一叠，放置到整个牌堆上方。  


这些洗牌方法的概率不容易计算，使用排列的方法数据量有非常大。  
国外有很过论文研究这些，感兴趣的可以自己去了解下，听说水很深的。


Leetcode 上的题目地址是`384. Shuffle an Array`，感兴趣的可以来挑战一下。  


-EOF-  

