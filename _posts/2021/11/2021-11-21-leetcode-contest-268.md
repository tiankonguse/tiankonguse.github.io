---   
layout:     post  
title: leetcode 第 268 场算法比赛  
description: 最后一题打表题，犹豫了一会，排名就到一百名之后了。       
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2021-11-21 21:30:00  
published: true  
---  


## 零、背景  


这次比赛最后一题有点意思，我代码敲完了，怕超时，又改成打表了，结果排名就在一百名之后了。  


## 一、两栋颜色不同且距离最远的房子  


题意：给一排 n 个房子，每个房子有一个颜色，问不同颜色房子最远相差多少。  


思路：由于是求最远，答案有两种可能。  
一种是与第一个房子不同颜色的最远距离。  
另一种是与最后一个房子不同颜色的最远距离。  
分别计算求最大值即可。  


## 二、给植物浇水  


题意：给一排植物与需要的水分。  
现在我们拿着一个水壶顺序给植物浇水。  
水龙头在第一个之前前面。  


浇水规则如下：  

-）必须按顺序给植物浇水。  
-）给当前植物浇水之后，没有足够的水满足下个植物时，需要回到水龙头灌满水。  
-）如果可以满足下个植物时，不能提前返回水龙头。  


问给所有植物都浇水后，移动距离是多少？  


思路：按照题意模拟即可。  


如果可以给下个植物浇水，移动距离加一。  
如果不能给下个植物浇水，则上个植物位置先回到水龙头，然后再移动到下个植物。  


PS：做这道题的时候看错题了，看成如果下个植物不满足时，有多少水就必须先用多少水。  



## 三、区间内查询数字的频率  


题意：给一个固定数组，不断的询问指定子数组中某个元素出现的频率。  


思路：由于没有修改值，预先预处理数组，统计每个元素都在哪些位置出现过。  
询问的时候，使用二分查找即可。  


提示：区间询问，等价与前缀询问，求差值即可。  


## 四、k 镜像数字的和  


题意：k 镜像数字指的是 10 进制的数字自身是对称的，且转化为 k 进制后依旧是对称的。  
求最小的 n 个 k 镜像数字之和。  


思路：k 只有 `[2, 9]`， n 最大 30， 如果可以本地预处理跑出来，就可以打表了。  


我最开始使用暴力循环做，第一组 k 为 2 就跑不出答案来。  


于是我想了想，大部分循环是无效的，因为大部分数字不是 10 进制对称的。  
所以我优化了算法，不再是枚举所有自然数，而是从小到大枚举所有对称的10进制数字，结果所有答案瞬间就跑出来了。  


之后我就犹豫了：既然这么快，是直接提交代码实时计算呢，还是把答案放在数组里，直接求答案呢。  
犹豫了一会，我怕代码实时计算超时，就选择打表了。  


打表需要整理所有情况的答案，浪费了不少时间。  
当通过这道题时，一看排名，一百名多一点，又没进前百名。  



话说回来，如何从小到大枚举对称十进制呢？  


这就需要遵循数字的两个性质即可。  


性质1：长度小的数字值肯定也小于长度大的数字（废话，但是很重要）。  
所以，使用数字的长度依次枚举即可。  


性质2：相同长度的数字，由于对称性，只需要看前一半的数字。  
此时，可以发现，前一半的数字是连续递增的数字。  


例如长度为 5 的数字，前一半就是三位。  
连续递增的数字就是 `100 ~ 999`。  
所以长度为 5 的对称数字有 `999 - 100 + 1` 个。  


利用这两个性质，这道题就可以瞬间求出答案了。  


## 五、最后  


这次比赛难度不大，只要想到直接构造枚举对称数字，就可以做出最后一题吧。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  
