---  
layout:     post  
title:      一个数的最近回文数
description: 偷懒了这道题就是一道字符串贪心题，不偷懒了就是字符串模拟大整数题。         
keywords: 后台服务  
tags: [后台服务]  
categories: [算法]  
updateDate:  19:28 2017/5/1  
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景

最近两周在看书，看完了两本书《腾讯传》和《白鹿原》，然后算法分享就延后了。  
这周规划一下自己的时间，尽量合理分配。  

这里分享一下一周前在小密圈分享的一道回文串的题。  
对于算法题，我的个人建议是自己理解一下，然后自己实现一下。
不然到后面面对大项目或者复杂算法题的时候，你会发现这些基础算法也是需要很多技巧的。  

>  
>  PS: 分享的算法题，一般是英文题，这是由于标准的ACM比赛的题目都是英文题。  
>  


## 一、题意


告诉你一个大整数，求离这个数最近的回文数（不包含自身）。  

然后有两个提示。

1. 当最近的回文数存在多个时，取最小的回文数。  
2. 输入的大整数位数不超过18位。  


## 二、边界

1. 个位数都算回文数  
2. 部分数字的长度和答案的长度可能不同。（10的幂数）  
3. 最近回文数有多个时，取最小的那个。  


## 三、算法思路  


1. 拆解：先得到小于该数字的最大回文串和大于该数字的最小回文串。  
2. 转化：拆解1 - 小于该数字的最大回文串等价于小于等于该数字减一的最大回文串。  
3. 贪心：拆解1 - 假设某位为数字'a'有解，则该位为['0','a'-1]的解都不没有'a'更优，故每一位从'9'到'0'迭代。  
4. 同理：对于拆解2，和拆解1相反的做法。  
5. 合并：两个局部最优解和当前数字求差值，差值小的为最优解。  


由于这里有一个大整数不超过18位的提示，所以我们就可以使用int64来代替大整数运算了。  
当然，自己使用字符串实现大整数运算也没啥难度的，这里就不实现了。  



## 四、数学思路


1. 拆解：先得到小于该数字的最大回文串和大于该数字的最小回文串 - O(1) 
2. 转化：拆解1 - 小于该数字的最大回文串等价于小于等于该数字减一的最大回文串 - O(1)
3. 边界：拆解1 - 保证后续大于一位数且答案的位数不变 O(1)
4. 判断：拆解1 - 字符串高位对称覆盖低位是否可行，不可行则减1，肯定可行，且减少的最少，即值最大。 O(1)
5. 同理：对于拆解2，和拆解1相反的做法。  
6. 合并：两个局部最优解和当前数字求差值，差值小的为最优解。

判断 拆解1举例：

例1：输入 123454322，高位覆盖低位可行，于是答案是 123454321。
例2：输入 123454320，高位覆盖低位可行，于是高位减1，答案是 123444321。
例3：输入 120000011，高位覆盖低位可行，于是高位减1，答案是 119999911。

## 五、本质

对于数学思路， 能够发现高半部变化的值越小，最终答案的变化也就越小。
所以本质是高半部加一减一问题了。
其实只要没有位数不一致这个问题， 其他的都好办。 所以我对位数不一致特殊处理就简单多了



## 六、代码

见[github](https://github.com/tiankonguse/leetcode-solutions/tree/master/problemset/find-the-closest-palindrome)




## 七、结语


好了，看到这里就结束了。根据上面的思路可以看出来这道题属于大整数题和贪心题了。    
不多说了，希望这些可以帮助到你们。  



对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  


![](https://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](https://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  
  
