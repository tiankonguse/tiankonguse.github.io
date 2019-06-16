---   
layout:     post  
title:  万能的方法远程也可以定位问题  
description: 再分享一下我的处理问题的方法，虽然很抽象，但是很万能。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2019-06-03 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/WyU9lAzilCDF6t-037cGtw  
---  


## 一、背景  


之前，我曾写过一篇《[忐忑的解决了一个别人的问题](https://mp.weixin.qq.com/s/3RXfkmoU3JQ14o15EzqRUQ)》文章，来介绍一个实际的项目问题。  
里面也介绍了整理架构的数据流转流程。  


![](http://res.tiankonguse.com/images/2019/05/17/001.png)  


这周六，又出现问题了。  
我通过三个问答就分析判断出问题所在，时候觉得这个思考问题的过程很不错，这里记录一下分享给大家。  


## 二、第一问发现不是普通的问题    


大概周六上午十一点的时候，就有人发现问题了。  
大概十二点的时候，我被拉近一个微信群，他们怀疑是 UNION 系统的问题。  


![](http://res.tiankonguse.com/images/2019/06/03/001.png)  


而我看到他们发的截图后，果断的下了一个结论：还是上次出问题的那个同步程序出问题了。  


![](http://res.tiankonguse.com/images/2019/06/03/002.png)  


不过这里也可以看到，服务正常，数据没有挤压，手动修改数据的变更时间，结果数据没按照预期的写进来。  


那这说明不是普通的问题，应该是很少发生的问题发生了。  


## 三、第二问排除自己的问题  


上面我果断的回答了：同步程序有问题吧。  
这个回答的前提是正常情况下，应该是这个结论。  


现在他们说同步程序正常（至少没发现异常），那就不能按常规的思路来思考问题了。  
既然不能按常规的思路来看待问题，我的回答就不是那么准确了。  


于是我问了第二个问题：UNION 的播放set是否正常？  


![](http://res.tiankonguse.com/images/2019/06/03/003.png)  


之所以问这个问题，是因为对于我的系统，只有一种可能发生问题，那就是主从 REDIS 不一致。  
而现在他们已经查询了，主 REDIS 也没数据。  


所以，此时我 100% 确定，我的系统没有问题，肯定是底层的某一个系统有问题。  


## 四、第三问找到问题  


对于 UNION 系统，极端情况下是 REDIS 主从不一致。  


其实，到这一步，已经确定是底层系统的问题了。  
而底层系统，他们比我更了解，我只是大概知道有哪些流程，细节完全不了解。  


不过，对于定位问题，这个了解其实已经可以提高足够多的信息了。  
比如对于底层的同步程序，是从数据库读数据的，那会不会是 MYSQL 主从不一致呢？  


所以我问出了第三个问题：看看是不是 同步程序读的 MYSQL 主从不一致。  


![](http://res.tiankonguse.com/images/2019/06/03/004.png)  


当然，此时他们在确认信息之前就回答了我的问题。  
而对于他们的附加问题，我则可以使用简单的逻辑回答：  


```
UNION 有变更流水吗？有。  
什么时候才会有流水？变更的时候才会有。  
UNION中数据有变更吗？没有。  
所以查询 UNION 变更流水是没用的，查不到变更流水。  
```


其实，因为他们回答的数据库没问题，我还问了下一个问题，但是在得到答案之前，他们发现确实是 MYSQL 主从不一致问题。  
自此，找到问题的原因。  


![](http://res.tiankonguse.com/images/2019/06/03/005.png)  


## 五、逻辑能力很重要  


到这里，很多问题都可以使用基本的 **逻辑推理** 得到解释了。  


为啥 UNION 数据不对？  
因为同步程序没写进来。  


为啥同步程序没写进来？  
因为数据库主从不一致，同步程序读的从库。  


为啥使用新 SET 手动同步数据不能解决问题？  
因为新SET 也读的 MYSQL 从库，读的旧数据。  


有两类数据都不对，一类已经经过复杂的方法切主库修复了，另一类切主库后为啥依旧不一致？  
因为另一类切主库后，少做了步骤，切主库没有生效。  


那该如何解决这个问题呢？  
需要分几步来做，大概如下。  


![](http://res.tiankonguse.com/images/2019/06/03/005.png)  


当然，那天我有点事情，只是远程的通过问答来辅助他们定位问题。  
如果我在现场的话，应该可以很快找打原因吧，这远程交互，问题的猜测验证周期也加长了，信息的可靠性也大大降低了。  


## 六、如何解决问题  


另外，再分享一下我的处理问题的方法，虽然很抽象，但是很万能。  
这么多年来，我遇到的很多问题，都是通过这个方法快速解决的，现在分享出来。  



大家面对问题时，应该多去思考问题可能发生的原因是什么，然后去验证自己猜测的是否正确。    
就像做算法题一样，明明思路对了，就是过不了，最后发现总是有各种边界情况没考虑到。  


在我看来，解决问题就是收集信息，并利用现有的信息猜测最有可能出问题的几个原因。  
到这里才是最关键的地方，不要猜测完了告诉别人可能是这里的问题就没完事了（很多人是这样）。  
而是应该猜测，并去验证猜测，验证发现猜测对了，再告诉别人才是个靠谱的人。  


猜测正确，OK，找到原因，根据实际原因去思考解决方案。  
猜测不正确，那就将验证的结果当做已知的信息，综合以前的信息，作出新的猜测。  


通过这样几轮收集信息、猜测可能原因、验证猜测，一般可以解决所有的问题。  
尤其是进行到最后，一些不可能发生的事情，也会变得可能了。  


比如有一次帮一同事定位问题：  


一个参数明明设置了，但是最终发出去的数据就是没这个参数。  
那可以确定，肯定是设置参数到发出数据这个过程中，哪里出问题了。  
但是这个过程只是调用一个公共库，于是我大概的猜测公共库有 BUG，没设置这个参数。  
一经我的猜测提醒，另一个同事想起这个公共库确实有这样的问题，于是这个问题就找到原因了。  



## 六、最后  
 

总结一下，解决问题的万能方法就是：收集信息、提出最有可能的猜测、验证猜测、验证结果当做信息收集起来。  
这个方法虽然很有效，但是还是很依赖个人经验。  


比如这次的 REDIS 主从不一致和 MYSQL 数据不一致，如果我们不知道这些数据库还会不一致，自然就不会提出这样的猜测。  
参数不对那个问题也是，如果我们不知道公共库也可能有错，那就不会提出那个公共库有问题。  


然后，我们就会得得出一个矛盾的结论：这个问题不可能发生，但是发生了。  
这个其实是逻辑思维有问题，这个矛盾的结论其实还可以继续推理下去。  
这个问题不可能发生，但是发生了，那么肯定是你认为不可能出问题的地方出问题了。  


想起一段往事。  
在上大学的时候，我教一个学妹编程。  
我告诉她：程序是程序、编译器也是程序、操作系统也是程序，是程序就可能出问题的，不要把那些编译器和操作系统想的很神圣。  
结果后来她写程序的时候，一旦结果不符合预期或者程序跑挂了，她跑来问我是不是编译器出 BUG了，是不是操作系统出 BUG了。  
后来我实在忍受不了，补充了一句：虽然编译器和操作系统都是程序，但是我们写的程序，几乎不可能遇到编译器和操作系统的BUG。如果遇到问题，那肯定就是自己代码的问题，自己找找就行了。  
自此，那个学妹再也不问我问题了。  



-EOF-  
