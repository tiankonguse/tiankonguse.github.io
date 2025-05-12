---   
layout:  post  
title: 我的服务器被蹭流量了，于是增加了一层保护 
description: 流量蛮贵的。          
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2023-07-08 18:13:00  
published: true  
---  


## 零、背景  


上篇文章《[迁移 VPS 服务器记录](https://mp.weixin.qq.com/s/vP_QtBLqCiIC5L_qBx7b_A)》提到，我从 3 月份开始，购买了一个自己的服务器。  


端午节的时候，我除了发现服务器的耗时比较高，还发现服务器被其他人蹭流量了。  


结果就是，服务器的流量费用每天暴涨好多。  


这篇文章简单记录下相关数据，供自己日后查看。  


## 一、流量扣费模式  


购买服务器的时候，可以发现流量有两种模式：包月宽带和按流量计费。  



![](https://res2023.tiankonguse.com/images/2023/07/08/001.png)  



包月宽带适合流量稳定的场景，流量的费用计算方式是区间内的最大宽带乘以区间时间。  
按流量计费就是用了多少流量扣除多少费用。  
对于我们普通用户，偶尔才用一次服务器，所以选择按流量计费是最优的。  


![](https://res2023.tiankonguse.com/images/2023/07/08/002.png) 


可以看到，日常扣除的费用很少，一天才2 分钱，甚至不扣费。  


![](https://res2023.tiankonguse.com/images/2023/07/08/003.png) 


## 二、流量异常  


端午节的时候，突然发现账单每天扣除几块钱，一看明细，都是流量费用。  


![](https://res2023.tiankonguse.com/images/2023/07/08/004.png) 


查看代理日志，发现服务器的代理被其他人使用了。  


## 三、解决方案


代理设置密码比较麻烦，于是我就限制了来源IP，只把我的来源IP开放。  


![](https://res2023.tiankonguse.com/images/2023/07/08/006.png) 



限制来源IP之后，流量费用降的非常低，大部分时间没有扣费。  



![](https://res2023.tiankonguse.com/images/2023/07/08/005.png) 



## 四、最后  


服务器一月有接近一百块钱，接下来要找点事情做，把这个服务器利用起来。  


对于这个想法，你有啥建议呢?  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

