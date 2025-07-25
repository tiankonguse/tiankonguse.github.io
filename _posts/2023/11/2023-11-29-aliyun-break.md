---   
layout:  post  
title: 2023-11-12阿里云故障复盘与分析    
description: 阿里云11月12日出现大面积故障，简单分析下这起故障。          
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2023-11-29 18:13:00  
published: true  
---  


## 零、背景  


阿里云——阿里巴巴集团旗下公司，是全球领先的云计算及人工智能科技公司，在全球范围内提供可扩展，安全和可靠的云计算服务。  


阿里云宣称为全球30个地域、89个可用区的客户提供稳定性全球领先的产品技术。弹性计算单实例可用性SLA高达99.975%，数据存储设计可靠性高达12个9，提供稳如磐石的客户体验。  


2022年，阿里云占中国云市场份额的36%，排名第一。  


但就是这样一个高稳定平台，2023年11月12日发生故障，持续时长 100 分钟。  


所以这篇文章打算来分析下这起故障来自勉。  


## 一、故障处理过程


2023-11-12 18:14，阿里云官方发公告，17:44 阿里云监控发现云产品控制台访问及API调用出现异常，阿里云工程师正在紧急介入排查。  


点评：初步公布受影响的业务场景或功能，从故障到发布公告，耗时 30 分钟。  



2023-11-12 18:50 阿里云发公告 17:50 已确认故障原因与某个底层服务组件有关，工程师正在紧急处理中。  


点评：告诉大家知道故障模块了，从故障到确认故障模块耗时 6 分钟。  


2023-11-12 18:59 阿里云发公告 18:54 经过工程师处理，杭州、北京等地域控制台及API服务已恢复，其他地域控制台及API服务逐步恢复中。  


点评：告诉大家已经修复部分服务了，从故障到初步恢复耗时 70 分钟，从发现故障模块到找到解决方法，耗时 64 分钟。    


2023-11-12 19:21 阿里云发公告 19:20 工程师通过分批重启组件服务，绝大部分地域控制台及API服务已恢复。  


点评: 大部分功能恢复，耗时 97 分钟。  
从上次初步恢复，过去了 27 分钟。  
相比这期间阿里云的工程师一直在想如何自动修复问题，发现都不行，最后才不得已选择重启组件服务吧。  
果然重启大法是万能的。  

2023-11-12 20:05 阿里云发公告 19:43 异常管控服务组件均已完成重启，除个别云产品（如消息队列MQ、消息服务MNS）仍需处理，其余云产品控制台及API服务已恢复。  


点评：万能的重启大法重启了大部分服务，大部分功能都恢复了。  
可能对于MQ 和 MNS 服务，还在评估重启会产生什么影响，所以暂时没有重启。  


2023-11-12 20:24 阿里云发公告 20:12 北京、杭州等地域消息队列MQ已完成重启，其余地域逐步恢复中。   


点评：相比 19:43，已经过去 30 分钟，猜测大概率没有直接评估出结论来。  
最终尝试灰度的方式重启，验证发现可以解决问题，而且没有产生新的问题，故全部都进行重启。  


2023-11-12 21:13 阿里云发公告 21:11 受影响云产品均已恢复，因故障影响部分云产品的数据（如监控、账单等）可能存在延迟推送情况，不影响业务运行。  
 

点评：相比上次重启，又过了一个小时。  
可能阿里云设计的产品或功能太多，需要一个个去确认是否修复以及是否有遗漏，最终全部修复。  


故障受影响的服务列表：  


![](https://res2023.tiankonguse.com/images/2023/11/29/001.png)


## 二、故障报告  


问题影响范围：OSS、OTS、SLS、MNS等产品的部分服务受到影响，大部分产品如ECS、RDS、网络等运行不受影响；云产品控制台、管控API等功能受到影响  


问题影响时间：北京时间2023年11月12日17:39-19:20  


问题概况：北京时间2023年11月12日17:39起，阿里云云产品控制台访问及管控API调用出现异常、部分云产品服务访问异常，工程师排查故障原因与访问密钥服务（AK）异常有关。工程师修订白名单版本后，采取分批重启AK服务的措施，于18:35开始陆续恢复，19:20绝大部分Region产品控制台和管控API恢复。  


处理过程：2023年11月12日 略。  


问题原因：访问密钥服务（AK）在读取白名单数据时出现读取异常，因处理读取异常的代码存在逻辑缺陷，生成了一份不完整白名单，导致不在此白名单中的有效请求失败，影响云产品控制台及管控API服务出现异常，同时部分依赖AK服务的产品因不完整的白名单出现部分服务运行异常。  


改进措施：  
-）增加AK服务白名单生成结果的校验及告警拦截能力。  
-）增加AK服务白名单更新的灰度验证逻辑，提前发现异常。  
-）增加AK服务白名单的快速恢复能力。  
-）加强云产品侧的联动恢复能力。  


点评：故障报告比较完整，新闻六要素都有，即时间、地点、人物、事件的起因、经过、结果。  



![](https://res2023.tiankonguse.com/images/2023/11/29/002.png)


## 三、深入分析  


看完故障报告，总结下就是访问密钥服务（AK）存在产生脏数据，从而导致整个阿里云挂了。  


那访问密钥服务是什么呢？  
首先需要知道什么是密钥。  


比如我提供一个数据查询服务，不做区分对外开放。  
正常情况下所有人都可以调用，那谁调用多少次我就不清楚了，没办法对调用方区分，也没办法收费了。  
解决方案也很简单，增加一个访问标识。  


![](https://res2023.tiankonguse.com/images/2023/11/29/003.png)


问：加了访问标识，我们会遇到一个问题：访问标识泄漏了怎么办呢？或者黑客暴力遍历怎么办？    
比如我的访问标识是 tiankonguse，你直接用我的标识来读数据，也是可以读到的。  
答：解决方案是增加一个密码。  


![](https://res2023.tiankonguse.com/images/2023/11/29/004.png)



问：加了密码后，我们通过 http 或者 tcp 请求，可能会被黑客拦截，从而拦截获取到访问标识和密码。  
答：解决方法是网络中不传输密码，只传输访问标识以及密码对传输内容生产的签名。  
服务端收到数据后，对签名进行逆向解密，解开的数据匹配了，才能读取数据。  


![](https://res2023.tiankonguse.com/images/2023/11/29/005.png)


问：那服务端怎么对签名进行逆向解密呢？  
答：从访问密钥服务（AK）获取到访问标识对应的密码。  


![](https://res2023.tiankonguse.com/images/2023/11/29/006.png)


问: 所有产品都请求访问密钥服务（AK），撑不住怎么办？  
答：密钥数据全量或者分类分发到各产品。  



![](https://res2023.tiankonguse.com/images/2023/11/29/007.png)


问：访问密钥服务中的数据库里的数据不对了会怎样呢？  
对应的因为无法解开签名，从而认为是非法请求，拒绝对外服务。  

![](https://res2023.tiankonguse.com/images/2023/11/29/008.png)



由此可以看到，访问密钥服务（AK）是云上每个服务的一层防火墙，用于鉴别请求的合法性。  
这样一个服务出现故障，必然导致云大面积不可用。  



问：那如何规避访问密钥服务产生脏数据的问题呢？  
答：对密钥数据进行签名，下发签名数据库后，通过签名校验后才能使用。  


![](https://res2023.tiankonguse.com/images/2023/11/29/009.png)



另外，所有服务需要重启服务，这个也说明数据下发的控制逻辑有问题。  
按理说，访问秘钥服务读取最新数据后，按日常的策略，重新下发即可。  
现在却需要全量重新加载最新的秘钥数据，这里面应该还有其他的设计漏洞。  


## 四、最后  


阿里云的这次故障，影响蛮大的。  


年底了，出这么大的故障，我们其他的打工人都需要自勉。  


以后设计系统时，要多考虑异常情况，避免异常情况发生时，没有对应的应对措施，从而产生大故障。   


后面不知道会不会公布详细的原因，比如为啥需要重启服务才能修复服务，不能热修复吗？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

