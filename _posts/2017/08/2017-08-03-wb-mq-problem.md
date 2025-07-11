---  
layout:     post  
title:      记一次微博中转异常
description: 这几天休产假，中间突然有人反馈中转收不到消息，于是VPN看了下。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateDate:  19:55 2017/08/03
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/Cte5aGAGuwAQ5tmQXTPhGw)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。  
>   
>    
  

## 零、背景

微博中转配置过于复杂，一直都有配置同步时序性问题。  
这次休产假期间再一次很多同事反馈订阅的中转不能使用了。  
这里记录一下定位问题的经过。  


## 一、表面现象

反馈的几个人都说新订阅了消息收不到数据。  
问运维也说只是正常的审批，没进行什么特殊操作。  
于是我初步猜想是遇到类似于千年虫的问题，哪里到达极限了。  



## 二、agent定位

向那些反馈收不到消息的业务要root密码，结果从上午等到晚上，才有一个同事给到。  
使用GDB查看配置，新订阅的业务的配置都没有下发，且连接中心配置失败了。  
使用tcpdump抓和配置中心的包，发现会`ICMP`包了，显然配置中心有问题了。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/656918351.png)


## 三、配置中心定位

登录配置中心，发现进程一直在重启。  
gdb挂上去，发现在解析配置时新的生产者解析失败了。  
于是我直接去看DB配置，发现那个生产者的配置有问题，于是手动修复了，然后中转就正常了。


后来问了运维，他说遇到审批时异常的问题，于是让业务重新申请了一个，旧的不知道还有这个影响。  
其实，微博中转设计的还是很初级的，所有地方都是遇到不对就退出进程，监控进程进行毫秒拉起。  
这种通过重启的方法是可以规避掉上面说的配置同步时序性问题，不过对于其他问题，就是致命的了。  


## 四、总结

这种问题其实都可以监控到的，但是没有进行监控告警。  
所以对于异常的情况都需要上报，并监控起来。  
这样根据监控马上就可以知道哪里的问题了。  

  
对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](https://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](https://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  