---   
layout:     post  
title:  Leetcode 第138场比赛回顾  
description: 这次比赛偏简单，第一次一个小时内昨晚了。   
keywords: 算法  
tags: [算法]    
categories: [算法]  
updateDate: 2019-05-26 23:24   
published: true 
wxurl: https://mp.weixin.qq.com/s/sug6PgbKI1VN3j3PT_TyBQ  
---  


## 零、背景  


Leetcode 第 138 场比赛的题偏简单，而且两道题的题意也有问题。  
浪费我们不少时间，不过最终根据测试数据随机应变的话，也很容易找到正确的题意。  


![](https://res2019.tiankonguse.com/images/2019/05/26/001.png)  


## 一、身高检查  


题意：学生本应该按身高从低到高站成一队。  
有些学生调皮，插队了。  
问不在自己位置的学生的个数。  


思路：这道题描述的有问题。  
原文如下：  


```
Return the minimum number of students not standing in the right positions.  
This is the number of students that must move in order for all students to be standing in non-decreasing order of height.  
```


其中的`right positions`和`move`的含义其实非常不清晰。  


不过看看给的测试样例，可以发现忽略原文的第二句话就行了。  
直接对输入的数据排序，统计实际位置与当前位置身高不相等的个数。  


也就是只需要比较身高，必须要考虑其他的情况。  


## 二、发脾气的书店老板  


题意：书店老板营业卖书。营业了`N`天，每天有 `customers[i]`个顾客来买书。  
老板有个坏脾气，在指定的某些天，会发脾气。发脾气的时候，那天的顾客会对书店不满意，不发脾气时默认为满意。  


现在老板练了一个技能，能做到在 连续 `X` 天内不发脾气。  
问书店老板在哪天开始使用这个技能，才能使得总体满意度最高。  


思路：假设书店老板在第`i`天释放技能，则`1 ~ i-1，i+X ~ n`这些天正常卖书，`i ~ i+X-1`卖的书全部为满意。  
总满意度可以在`O(n)`的复杂度内计算得到。  
枚举计算每一天释放技能的总满意度，则可以在`O(n^2)`内求出答案。  
不过最终这道题会超时。  


看下第`i`天与第`i+1`天释放技能时总满意度的关系，可以发现只有两天的满意度可能发生变化。  
一个是第`i`天，本来在技能覆盖范围内，变成了正常卖书。  
一个是第`i+X`天，本来不在技能覆盖范围内，现在被技能覆盖。  


这两个可以使用`O(1)`的时间进行计算转移，这样就可以使用滑动窗口枚举计算所有情况即可。  
总体复杂度`O(n)`  


![](https://res2019.tiankonguse.com/images/2019/05/26/002.png)


## 三、一次交换得到下一个排列  


题意：给一个数列`A`，求选两个位置进行交换一次，使得新得到的数列字典序小于`A`，且是最大的数列。  


思路：求小于字典序且最大，那交换的两个位置就需要尽可能的靠后。  


由于是求小于字典中的序列，只需要从后到前，找到第一个非递减的序列。  
如`b[i] > b[i+1] <= b[i+2] <= ... <= b[n]`。  
如果`i`不存在，则说明整个数列就是最小的，返回原数列即可。  
否则在`b[i+1] ~ b[n]`里面挑一个小于 `b[i]`的数字进行交换。  


具体来说，由于为了使答案最大，也就是应该使`b[i]`最大，这里需要挑小于`b[i]`的最大数字。  


但是根据`Example 4`的数据可以知道，测试数据和题意冲突了，那只好修改代码来适配题意了。  
也就是如果小于`b[i]`的最大数字有多个时，使用最后一个交换。  
由此，这道题就做出来了。  


![](https://res2019.tiankonguse.com/images/2019/05/26/003.png)   


## 四、相邻不相等  


题意：给一个数组，求调整数组，使得数组相邻的两个元素值不同。  
任意返回一个答案。  


思路：由于题意已经说了一定存在答案，所以我们需要找一个构造方法，构造出答案来。  
首先对数字进行计数，储存在最大堆中（优先队列），不过看过`stl`源码的我更喜欢使用`map`来代替优先队列。  


我想的比较复杂，先分享出来，后面再介绍一种简单而且容易理解的构造方法。  


构造依据：


![](https://res2019.tiankonguse.com/images/2019/05/26/004.png)


假设给的数字的个数都相等，比如不同数字有`k`个，每个数字都是`N`个。  
我们可以依次按升序罗列这`K`个数字一次，问题就转化为了`k`个数字都是`N-1`个。  
再按照上面的规则进行一次，`N`就会继续减小，最后为`0`代表构造出答案来。  



例如，最大计数是`5`，值有`4`和`3`。  
对应的几何意义是数列中有`5`个`4`和`5`个`3`。  

执行策略1后，答案里会是`[3,4]`，而数列里面则变成了`4`个`4`和`4`和`3`。  
假设下一轮依旧执行的是策略1，依旧是`[3,4,3,4]`，相邻的位置位置不会相同。  


![](https://res2019.tiankonguse.com/images/2019/05/26/005.png)   


现在再考虑数字的个数分为几组，如个数是`N1`的有`k1`个，个数是`N2`的有`k2`个，且`N1 < N2`。  
那依旧按照上面的规则对`N2`进行几次后，数据就变成了个数`N1`的有`k1+k2`个。  
按照这个规则进行下去，最终也就构造出答案来了。  


这里有一个问题是，个数`k`为`1`时，会不满足在要求。  
而贪心的方法就是从次大计数里面随便找一个，然后这两个计数都减一。  


例如，最大计数是`5`个`4`，次大计数是`4`个`3`。  
执行策略后，答案里是`[4,3]`，数列变成了`4`个`4`和`3`个`3`。  
由于策略执行后，答案最后一个位置是`3`，而下一轮策略肯定是先输出计数为`4`的值，不可能输出计数为`3`的值，所以相邻位置不会冲突。  


综上，就可以构造出一个答案来了。  


当然，这种构造方法不容易理解，所以去搜索其他人的思路时，看到有人提到一种简单的构造方法。  


具体来说就是我们排列组合里面的插板法。  
既然相邻的不能相同，我们就可以优先在偶数位置隔一个设置一个值。  
当偶数位置全部设置完之后，剩下的数字随意的填充，相邻的位置肯定不会相同。  
就是这么简单，有木有？  


不过，搜索思路的时候，发现大多数都是和我的思路是一样的。  
看来我们的思路还是不够灵活呀。  


## 五、最后  


比赛的代码俺都上传到 github 上了，要参考源码的话就自己去取吧。  


另外，对于 leetcode 的开源协同项目，目前坚持参加的还有三个同学。  
果然不容易坚持呀。  


下面是大家提交代码的 可视化图形，如果参与的人多了，看着应该会很壮观的吧。  


![](https://res2019.tiankonguse.com/images/2019/05/26/006.png)   



-EOF-  



