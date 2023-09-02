---   
layout:  post  
title: batchGet 转化为 multiget 会更好吗？   
description: batchGet 并没有那么差，multiget 也没有那么好。  
keywords: 技术  
tags: [技术]    
categories: [技术]  
updateData:  2023-09-02 18:13:00  
published: true  
---  


本来想写一篇文章，介绍一下 缓存系统 mget 带来的无底洞(multiget hole)问题。  

准备引用以前的文章时，发现对于缓存系统的问题，以前的文章都介绍过了。  


例如下面这些问题以前都记录过，等依旧有时间了，再全面汇总一下。  


- 数据量问题，单机 VS 分布式  
- 分片问题，路由表 VS 一致性HASH  
- 一致性HASH算法  
- 热key问题，单分片瓶颈，副本解决  
- multiget hole问题 - 网络瓶颈，副本解决  
- batchGet 与耗时的关系  
- multiget 与耗时的关系  


这里简单讨论下 batch get 与 multi get 之间的关系。  



![](https://res2023.tiankonguse.com/images/2023/09/02/001.png)


基础数据：A 服务请求 B 服务，A 的来源流量是 1W qps, A 需要从 B 服务读取 1000 个数据。  
B 服务获取一条数据耗时 0.01ms。  


1. 实现方式  


![](https://res2023.tiankonguse.com/images/2023/09/02/002.png)


batch get，即并发多个网络去拉数据，B 服务的QPS 是 50W。   


multi get，即一个网络连接，一包数据把请求全部发给下游，B 服务的 QPS 是 1W。  


2. 问题  


![](https://res2023.tiankonguse.com/images/2023/09/02/003.png)


batch get，多个网络，网络连接变多（端口数存在上限），增加额外的内存与CPU来维护网络开销。  


multi get，流量到达一个节点，B 服务一次处理 1000 个数据，耗时至少 10 ms。  


3. 解决方案  


![](https://res2023.tiankonguse.com/images/2023/09/02/004.png)


batch get，转化为 multi get 请求，降低网络开销。  


multi get，降低一次网络请求的数据个数，B 服务多副本计算，均摊耗时开销。  


4. 矛盾  


![](https://res2023.tiankonguse.com/images/2023/09/02/005.png)



可以看到，batch get的问题可以通过 multi get 缓解，multi get 的问题可以通过 batch get 缓解。  


如果你看到这里结论这个问题是无解的，那说明你的思想太极端了。  


世界不是矛盾的，而是可以共存的，两个极端的中间还有无数个存在，即所有方案都是可以权衡的。  


具体来说，即不能一个网络拉一个数据全部 batch，也不能只发一个网络全部 multi，需要进行折中。  


具体要怎么折中，就需要看你的实际数据模型了，建议进行压测验证，例如拆分为 30个包，每个包33个数据。  


![](https://res2023.tiankonguse.com/images/2023/09/02/006.png)


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

