---   
layout:     post  
title: leetcode 第 249 场算法比赛  
description: 思路不清晰，比赛结束后12分钟才通过最后一题。   
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2021-07-11 21:30:00  
published: true  
---  


## 零、背景  


这次比赛的题有技术含量，代码量都有点大，最后一题比赛结束后 12 分钟才通过。  


还是自己思路不清晰导致，后面还是要先在纸上画画，思路明确了再敲代码。  


## 一、数组串联  


题意：给一个数组，数组自己与自己拼接后的结果。  


思路：循环追加即可。  



## 二、长度为 3 的不同回文子序列  


题意：给一个小写字母组成的字符串，求所有长度为 3 的不同的回文子序列。  


思路：原字符串长度是 `10^5`，暴力枚举的复杂度是 `n^3`，显然会超时。  


考虑到回文串长度只有 3，去重后，答案最多是 `26 * 26` 个。  
所以，判断每个答案是否存在就不会超时。  


那怎么判断一个答案是否存在呢？  
这就需要预处理出每个字符的位置列表。  


然后分两种情况：  


情况 1、回文串的三个字符全部相等。  
此时只要字符的个数大于等于 3 个，就存在。  


情况 2、回文串的三个字符不同，则中间一个字符，两边的字符相等。  
假设中间字符位置列表是`1,3,5,7,9`，两边字符的位置列表是`2,4,6,8`
中间的字符可能有很多，只要有一个位置处于两边字符的中间，则认为存在答案。  
那显然，两边字符的位置肯定取两个边界`2,8`。  


由于中间字符的位置列表已经是有序的，可以直接二分查找第一个大于两边字符的左边界。  
如果找到，且小于右边界，则存在答案，否则不存在。  


具体代码可以参考我录制的比赛视频。  


## 三、用三种不同颜色为网格涂色


题意：给一个矩阵和三个颜色，进行染色。要求相邻位置颜色不能相同，求染色的方案数。  


思路：经典的状态压缩动态规划。 


列数最多 5 个，3 个颜色使用两个比特位即可标示，这样每列有 `2^5` 种状态，即 1024 种状态。  


对于状态压缩，一般有三种方法。  


方法一：行扫描循环计算法。  


这个方法也是最简单的状态压缩方法。  
每次处理一行，求出所有的状态以及状态对应的答案数。  
然后迭代的方式计算出下一行的所有状态。  


难点：每个状态到下个状态的转移方程比较复杂，需要使用程序自动推导出来。  


复杂度：`O(n * 8^m)`  


方法2：矩阵幂优化  


一旦状态转移方程预处理出来。其实上是一个矩阵状态。  
每行到下一行的计算只与输入与矩阵状态有关系，即不断的乘以矩阵状态。  
所以矩阵相乘可以使用矩阵幂进行优化。  


复杂度：`O(log(n) * 8^m)`  
一般 n 非常大的时候，才使用矩阵幂。  


方法3：方格扫描法  

行状态的难点是状态太多，转移难于推导。  
所以就有了方格扫描法，即每次只转移一个方格，而不是一行。  


这样，一个方格转移到下个方格时，只需要关心左边和上边的状态值即可。  
而对于第一列的方格，只需要关心上边的状态，这时候特殊处理即可（从 1 开始，则不需要特殊处理）。  


复杂度：`O(n * m * 4^m)`  



代码较长，可以参考我录制的比赛视频（B站）。  


## 四、合并多棵二叉搜索树  


题意：给若干二叉树，每个二叉树节点不超过 3 个。  
现在需要根据二叉树叶子节点的值与其他二叉树的根匹配相连。  
问最终能否恰好可以连成一个二叉搜索树。  


思路：这道题其实不难，只是需要处理的步骤比较多。  


步骤1、连图，根据题意，构造出一个图来。  
异常：构造的时候，如果发现某个根是另外两个根的儿子，则非法。  
复杂度：`O(N)`  


步骤2、找根  
异常：如果找到多个根或没找到，则非法  
复杂度：`O(N)`   


步骤3、递归判断搜索树完整性 以及统计遍历的根的个数  
异常：不满足搜索树性质，则非法  
复杂度：`O(N)`  


步骤4、判断搜索树的连通性
异常：遍历节点不足 N 个，则非法  
复杂度：`O(1)`  



代码参考B站录制的视频，我是比赛后 12 分钟才提交过的，之前思路不清晰，浪费不少时间。  




## 五、最后  


这次比赛的题的难度挺不错的，最后一题你是怎么做的呢？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

