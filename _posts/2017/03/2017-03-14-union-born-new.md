---
layout:     post
title:      每秒千万每天万亿级别服务之诞生
description: 每秒请求几十万扩散后几千万的union服务是什么?当初为什么要做这样一个服务呢?这个服务又面临着什么问题呢? 
keywords: 后台服务
tags: [后台服务]
categories: [程序人生]
updateDate:  09:10 2017/3/14
---


这是篇旧文[荒蛮时代诞生的union服务](http://mp.weixin.qq.com/s/1ppILe5J6zvrQAHGX5xaeQ)，这里申请原创保护，故重发一下。
这个系列共有四篇：[诞生篇](http://mp.weixin.qq.com/s/6taVob0DFx7K5QK-l4nmxQ)，[优化篇](http://mp.weixin.qq.com/s/6taVob0DFx7K5QK-l4nmxQ)，[架构篇](http://mp.weixin.qq.com/s/jNXR7ghcG8m1YOzr59EK1g)，[运营篇](http://mp.weixin.qq.com/s/tZ1jbEFskb9OQ_tDOEb7TQ)。  


## 零、无名者无名也

>  
>  大家都在等待, 等待物极必反, 等待, 默默的等待.  
>  


笔者是一个无名者, 无名也。  
13年下半年在腾讯微博实习，了解到部门解散前的一些战略。  
之后14年上半年来到腾讯视频实习见到同样的战略。  
还好14年下半年入职后发生变化，同时也见证了UNION服务的成长, 简单回忆一下.   




## 一、远古的荒蛮时代

>  
> 呵，沉默呵！不在沉默中爆发，就在沉默中灭亡。  
>  


几年前, 腾讯视频进化状态处于远古的荒蛮时代.  
所有的宫殿都是靠人使用蛮力建造起来的.  


比如, 有一天业务A需要的使用视频的标题,图片和播放量, 然后了解到后台组有标题和图片的数据, 数据组有播放量的数据.  
于是两个组对应的同事分别提供了接口给业务A.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/35393036.png)


后来, 产品说豆瓣现在很火, 我们需要把豆瓣评分展示出来.看优酷还有自己的一套好评评分, 我们也需要有自己的评分然后展示出来.
经过协调, 发现豆瓣评分在后台组已经自动抓取, 可以使用另外一个接口得到, 自己的好评评分由数据组计算, 也需要另外一个接口才能得到.  



![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2531288761.png)


这时候业务A抱怨:"后台组为什么不能提供一个接口呢? 数据组也是!"  
后台组回答:"因为API2接口很早就有了, 里面有豆瓣评分, 你们可以复用这个评分."  
数据组回答:"因为评分数据是另一个同事做的, 需要他单独提供一个接口输出他的数据."  
这样一听, 貌似都很合理, 但是大家心里都清楚, 这样迟早会出问题的,就看什么时候爆发.   


时代的大轮继续滚动着, 看着宫殿越来越宏伟了.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1185243817.png)


宏伟的宫殿的背后永远都需要体力劳动的付出, 大家一块砖一块砖建出宏伟建筑: "看, 我们的播放页和优酷一样有XX功能了"  
但是背后的砖数量越来越多了, 谁也分不清了, 谁也不敢动了, 生怕一不小心, 整个宫殿就坍塌了.  




于是有人站了出来, 我们需要做这样一套系统: <red>所有数据通过一个接口输出, 数据使用者不需要关心数据在谁那, 数据维护者不需要关心谁来拉数据.  
这个系统就叫UNION, 含义为统一数据接口</red>.   


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/346170203.png)


## 二、听说NOSQL很火?
 
>  
> 真正的NOSQL需要支持批量查询! 
>  
 

回头看看之前的接口, 发现确实有套路, 世界的数据可以抽象为关系型数据库  
数据可以分为几张表: 视频数据表, 专辑数据表(视频的一个集合, 如电视剧), 人名数据表, 直播数据表等等.  
对于每个数据表, 每一行都有唯一的主键: 视频ID, 专辑ID, 人名ID, 直播ID.  
我们可以根据表名和主键得到对应的字段.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/744357340.png)



根据上面的表, 我们也可以看出来, 业务需要来拉数据时需要提供三个信息: 什么类型, 谁的数据, 数据详情.  
具体含义如下:    


* 什么类型(table): 视频数据还是人名数据  
* 谁的数据(key): 人名的话是周杰伦的数据还是周星驰的数据  
* 数据详细(field): 拉取这个人的名字还是封面图  


>  
> 当然有人可能会说数据类型是多余的, 业务应该只传入数据主键就能自动识别出是什么类型的.  
> 这个问题我就不做解释了.   
>  


观望全世界, 听说NOSQL很火, 大家都热火朝天的宣传自己创建了一种NOSQL模型.  
而我们此时我们可以利用这些NOSQL搭建出我们的UNION, 更高层次的NOSQL模型. 


比如大家都熟悉的memcache吧, 传入字符串key, 返回字符串value.  
如果我们要把数据存在memcache中, 就需要把三个维度转换成一个维度: `table_key_field -> value`.  
这样看来我们完美的解决问题了, 业务请求传来`{table, key, field}`三元组, 我们返回对应的value. 
我们这一次专心做数据路由就行了.   


再来看看业务的使用场景吧.  
电视剧详情页要增加个功能: 展示前100集视频的100个信息(标题,图片, 播放量等100个字段), 业务测已经有100个视频的key和100个字段了.  


业务说: 我们有这样的问题, 实现这个功能需要访问你们的接口1万次(一个table * 100个key * 100个field), 能不能支持批量: 传给你1个table, 100个key, 100个field, 你返回二维数组.这样只需要调用你的接口一次就行了. 

   
真正的NOSQL需要支持批量查询, UNION想要作为NOSQL的一员, 必须支持这个功能了.   
<red>本来是一万次的QPS, 就这样给UNION按一次QPS计算了, UNION的计算量却还是实实在在的1万次.</red>   
于是接口的最终形式就确定了, 服务还需要支持多维度批量查询了.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3035993532.png)  


## 三、UNION! 银弹?


>  
> 银弹只是解决当前时代问题的杀手锏, 但是时代在发展.   
>  


作为服务, 那么大的访问量不能直接访问关系型数据库的, 所以需要把数据同步到NOSQL中.  
于是评估一下, 把全世界的数据储存起来再考虑未来数据量的增长, 大概需要1万G的NOSQL储存, 于是找DBA申请, 果断被拒掉了.  


怎么办呢?  
有人提出提个想法: 谁的数据, 谁申请NOSQL.  
后台组说对于XX数据我们已经储存在REDIS了, 是hash结构的, 对于YY数据,我们在memcache中了, 没有的数据我同步到REDIS吧.  
数据组说对于XX数据我们在REDIS中有了, 是key-value个数, 对于YY数据,我们在TMEM中有了, 对于ZZ数据, 我们在TTC中有了.没有的数据我们同步到REDIS吧.  
基础组说我们数据量太大, 没有NOSQl, 你们直接来访问我们的服务吧, 给, 这是我们的私有协议.  
...  


经过一番沟通梳理, 所有数据都可以得到了, 虽然数据源五花八门的, 但是归类一下, 也就三类: redis的hash, 各种NOSQL的key-value, 以及那个私有服务.  
于是架构图就成下面的样子了.  



![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/433133307.png)



当时那个年代, 流行一套多线程网络编程模式, 于是聚合层服务就使用多线程网络模式实现了, 考虑到访问量比较大, 又实现了一个进程内存缓存.  
上线后威力巨大, 各种业务都称赞方便, 于是陆续都接进来了.  


银弹只是解决当前时代的杀手锏, 但是时代在发展.  
时代发展飞快, 优酷已经不再是往日的优酷, 爱奇艺却是今日的爱奇艺了, 视频行业的春天来临了.  
技术也飞快发展, 我们也都使用封装好的框架, 只需要关心业务加减乘除的逻辑, 不需要关心具体网络操作细节.  
那么曾经的UNION缺暴露出一系列问题来了.  


### 1. 问题之value

由于业务需要的数据可能不是字符串, 比如对于播放量是整数, 对于评分数小数, 对于主演是数组(一个电视剧可能有多个主演).  
于是value的类型需要丰富起来.  


但是旧table字段对应的类型已经固定了,加新字段容易让使用者分不清两者区别, 怎么办呢? 新增一个新的table吧.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1869786676.png)


### 2. 问题之命中率


对外1001和2001是两个table, 所以缓存的时候是两份数据.  
但是对内实际上是同一个数据, 只是转换形式不一样.  
如果按照底层的格式缓存数据的话, 只需要储存一份数据, 那命中率就能提升不少吧.  
于是聚合层改成按照底层数据源的方式缓存数据, 命中率有所改善.  


### 3. 问题之内存


由于服务是进程内缓存, 设计缓存的时候为了防止缓存中数据太多影响性能, 缓存维度是key维度的, 但是这样访问量大了冷数据也多了, key维度下的缓存的字段就越来越多, 内存膨胀的很厉害.  
虽然使用了LRU淘汰, 但是发现跑一段时间内存还是会满, 降低key维度个数命中率又会太低, 找不到平衡点.    
怎么办呢? 想到一个方案: 凌晨的时候定时重启.  


### 4. 问题之数据源


访问量越来越大, 虽然缓存可以挡住不少量, 但是透传下来的量很是很大.  
下层的各种NOSQL还是各个小组提供的, 访问量大了还需要分别找他们扩容, 并不是每个NOSQL都是可以及时扩容的.  


### 5. 问题之多线程模式

这个服务是曾经一个高手使用多线程模式, 但是访问量巨大的时候暴露出了很多问题.  
后来那个高手也走了, 维护成本很高.  


## 四、UNION重生?

访问量大了, 暴露了越来越多的问题, 于是我们不得不从整体上优化一下这个系统了.
下篇文章再来记录UNION已经进行了哪些的优化与未来规划吧.  


<hr>

长按图片关注公众号, 接受最新文章消息.

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/4224042967.jpg)


