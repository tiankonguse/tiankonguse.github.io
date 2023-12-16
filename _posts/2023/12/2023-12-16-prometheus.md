---   
layout:  post  
title: 认识 prometheus 云原生监控系统   
description: 很强大的一个监控系统。  
keywords: 项目实战  
tags: [项目实战]  
categories: [项目实战]  
updateData:  2023-12-16 18:13:00  
published: true  
---  


## 一、背景  


最近在使用 grafana 来制作监控系统的各种指标看板。  


前一篇文章简单介绍了《[PromQL 语言](https://mp.weixin.qq.com/s/xCUxSUqW2dYaYT2UWspFGg)》。  


接下来就是介绍 PromQL 语言背后的 prometheus 云原生监控系统了。  



## 二、 prometheus 是什么  


Prometheus 的最初定位是一个监控和警报系统。  


![](https://res2023.tiankonguse.com/images/2023/12/16/001.png)


为了实现这个功能，需要实现几个独立的子功能。  


1）Tracking 检测指标   
2）Collecting 收集指标  
3）Storing 储存指标  
4）Querying 查询指标  
5）Alerting 警报指标  


![](https://res2023.tiankonguse.com/images/2023/12/16/002.png)


如上图所示，每个子功能都是独立实现的，通过搭积木的方式，就可以实现一个功能复杂的监控告警系统。  


由于架构的简洁，通过查询指标这个功能，除了做 Alerting ，还很容易扩展实现 dashboarding 。  


由此，就形成了 Prometheus 系统的整体架构，如下图  


![](https://res2023.tiankonguse.com/images/2023/12/16/003.png)



## 三、METRICS 指标  


上面提到，一个监控系统需要检测指标、收集指标、储存指标、查询指标。  


那到底什么才是指标呢？    


指标(Metrics)是度量(measurement)目标的标准。  


比如对于一个高性能服务，访问量、访问耗时、服务器CPU负载、服务器内存使用率对应的数值都是指标。  


不同的指标都有自己的名字，称为指标名(metric name)。  
对于一个指标，例如访问量，往往也有自己的属性，比如哪个服务，机器IP，通过键/值对储存，称为标签(labels)。  
指标名和标签合起来，统称为标识符(identifier)。  


指标的结果由时间与值组成。  
这些指标的结果随着时间会变化，称为时间序列(time series)。  
储存指标的系统称为时序数据库。  


关于指标名、标签、时间、值的关系，见下图   


![](https://res2023.tiankonguse.com/images/2023/12/16/004.png)


## 四、METRICS类型  


根据实际诉求，指标分为计数(Counter)、测量(Gauge)、分布图(Histogram)、概况(Summary)。  



1）计数(Counter)  


计数器是一个只能增加或重置的度量值，即该值不能比之前的值减少。  
它可用于请求数量、错误数量等指标。  


![](https://res2023.tiankonguse.com/images/2023/12/16/005.png)


实践过程中，我们往往需要的是每秒的请求数量和错误数量。  
所以对于计数指标，需要使用 PromQL 中的`rate()` 函数获取一段时间内指标的历史记录，并计算该值每秒增加的值。  


当然，更普遍的方法是不适用计数这个指标，使用下一种指标。  



2）测量(Gauge)  


仪表是一个可以上升或下降的数字。  
一般用来衡量集群中容器数、CPU负载、内存使用率、每分钟访问量、平均耗时等。  



![](https://res2023.tiankonguse.com/images/2023/12/16/006.png)


有时候上报的数据不是连续的，画出的曲线会有空洞。  
我们可以使用文章《[PromQL 语言](https://mp.weixin.qq.com/s/xCUxSUqW2dYaYT2UWspFGg)》中介绍的方式，把即时向量转化为范围向量，然后进行聚合，消除曲线的空洞。  


![](https://res2023.tiankonguse.com/images/2023/12/16/007.png)




3）分布图(Histogram)  


分布图大家可能不理解是啥意思，举个例子大家就懂了。  


之前常说的 P99 耗时就是分布图。  


4）概况(Summary)  


Summary用于收集样本数据的统计信息，例如样本数量、总和、平均值、最小值和最大值等统计信息。  


5）命名  


不同指标的命名后缀不一样。  
计数(Counter)的后缀一般是 `_total`。  
分布图(Histogram)的后缀一般是`_bucket`。  
概况(Summary)的后缀一般是`_count`或`_sum`  
测量(Gauge)则不需要特殊的后缀。  



## 五、实战  

去官网，可以根据文档下载 prometheus，其实就是一个二进制可执行程序。  


https://prometheus.io/docs/


启动二进制程序，打开地址 http://localhost:9090/  


首先看到如下的界面。  


![](https://res2023.tiankonguse.com/images/2023/12/16/008.png)


Status 中的 Service Discovery 可以看到配置了两个数据来源。  


![](https://res2023.tiankonguse.com/images/2023/12/16/009.png)


Status 中的 Targets 中可以看到两个数据源的状态。  


![](https://res2023.tiankonguse.com/images/2023/12/16/010.png)


当然还有其他的功能，Alerts, Graph, Runtime & Build Information, TSDB Status, Command-Line Flags, Configuration,  Rules等。  


![](https://res2023.tiankonguse.com/images/2023/12/16/011.png)


## 六、最后  


了解 Prometheus 后，可以发现良好的系统设计真的很重要。  
各个组件之间进行解耦，仅通过标准化协议与接口进行交互，从而使得每个组件都可以拿出来独立使用。  
而且还可以扩展新增组件，从而使得系统的功能更强大。  


不仅系统要这样设计，代码也要这样设计，这样代码的 BUG 才会更少，也更容易阅读与扩展新功能。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

