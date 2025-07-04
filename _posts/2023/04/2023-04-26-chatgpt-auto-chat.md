---   
layout:  post  
title: 找工作福音，让 ChatGPT 教你如何面试与如何回答  
description: 自己提问，自己回答，学习两份知识。          
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2023-04-26 18:13:00  
published: true  
---  


## 零、背景  


之前在《[教你怎么向 ChatGPT 高效的提问](https://mp.weixin.qq.com/s/eGzO7XCaR9LIggOVXE3QSQ)》中提到， ChatGPT 很强大，但是如果我们提问的姿势不对，就很难得到想要的回答。  


今天给大家分享一个具体案例，而且是大家很关心的案例：求职面试。  


我们通过场景限制，让 ChatGPT 即当做面试官来提问问题，又让 ChatGPT 当做面试着来回答问题。  
这样我们可学习到面试官会问什么问题，面试者会回答什么问题。  


当然，为了防止面试官胡乱提问问题，也为了防止面试者胡乱回答问题，我们可以通过输入公司的招聘要求与面试者的简历来进行限制。  
这样，ChatGPT 就会围绕着招聘要求与面试者的简历经验，来回答问题了。  


这里我以告诉 ChatGPT 招聘要求(网上随便找一个招聘网站搜索的)，不告诉简历为例，介绍下如何使用。  



## 一、场景限制  


您的任务是在面试官(A)和面试者(B)之间切换。  
我会通过写A或B来指定您应该以面试官或面试者的身份提问问题或者回答问题。  
作为面试官，您尝试提出面试的问题，每次提问只问一个问题；作为面试者，您尝试回答面试官的问题。


公司的岗位职责是：。。。
面试的简历是：。。。


您作为面试官的任务是：“考察面试者是否满足公司后台开发的招聘要求”。  
现在以面试者的身份开始。



![](https://res2023.tiankonguse.com/images/2023/04/26/001.png)



## 二、面试  


A: 你好张三，很高兴见到你。首先，我注意到你有三年以上的Bnix/Linux操作系统下java/go/c++后台开发工作经验，请问你在这方面有哪些项目经验？  


![](https://res2023.tiankonguse.com/images/2023/04/26/002.png)



B: 感谢您的提问，我有几个项目经验：  


1、在公司的视频分发平台项目中，我负责后端的设计和开发，使用Java语言开发了分布式系统，使用了HBase和Redis作为数据存储，实现了高效的数据管理和访问。这个项目支持高并发、大规模的视频存储和分发，为公司带来了巨大的商业价值。  


2、在上一家公司，我参与了一个在线广告投放平台的开发，使用Go语言开发了一个高性能的广告系统，处理每天数十亿次的请求，支持高并发和负载均衡，并且使用了ElasticSearch作为广告数据的存储。  


3、我还参与了一个企业级SaaS平台的开发，使用C++语言开发了后端业务逻辑处理和存储，使用MongoDB和Redis作为数据存储，实现了高可用性、高性能、可扩展的系统。这个项目帮助客户在全国范围内管理和协作，为客户提供了高质量的服务。  


以上是我在后台开发方面的一些项目经验，我相信这些经验可以帮助我更好地胜任这个职位。  


![](https://res2023.tiankonguse.com/images/2023/04/26/003.png)



A：很棒，听起来你有丰富的后台开发经验。我想了解一下你对微服务架构的理解和使用经验，可以和我分享一下吗？  


![](https://res2023.tiankonguse.com/images/2023/04/26/004.png)



B：当然可以。微服务架构是一种将应用程序拆分成多个小服务的架构模式，每个服务可以独立部署、扩展和维护。每个服务都应该有自己的职责和边界，可以使用不同的编程语言、存储技术和通信协议。  


我在之前的项目中使用过微服务架构，我们使用Spring Boot和Docker来构建和部署服务，使用Kubernetes作为容器编排工具，通过RESTful API和消息队列来进行服务间的通信。这种架构能够有效地解耦服务，提高了可扩展性、可维护性和可测试性，同时也让开发人员更加专注于服务的实现，提高了开发效率。在实际项目中，我们也会根据实际情况来选择使用微服务架构或单体应用架构。  



![](https://res2023.tiankonguse.com/images/2023/04/26/005.png)


A：非常感谢您的分享。除此之外，我们希望我们的后台开发人员具备一定的Linux操作系统的能力，您能够介绍一下您在这方面的经验和技能吗？  


![](https://res2023.tiankonguse.com/images/2023/04/26/006.png)


B：当然可以。我对Linux操作系统比较熟悉，熟练掌握常用的Linux命令和脚本编写。在项目中，我会使用Linux来进行开发、测试和部署工作。我也能够使用Linux进行系统性能优化和故障排除，比如使用top、vmstat、sar等命令来查看系统状态和性能指标，使用strace、tcpdump、gdb等工具来分析程序的问题和性能瓶颈。此外，我也了解一些Linux的安全措施和防御措施，能够为公司的应用程序提供安全保障。  


![](https://res2023.tiankonguse.com/images/2023/04/26/007.png)


A：非常好，Linux操作系统的熟练掌握确实是后台开发的重要技能之一。我们公司的开发团队需要对大规模数据存储技术有一定的了解和使用经验，您在这方面有哪些经验和技能呢？  



![](https://res2023.tiankonguse.com/images/2023/04/26/008.png)


B：非常感谢您的提问。在大规模数据存储技术方面，我有一些实际经验。我熟悉HBase、MongoDB、Elasticsearch和Redis等多种大规模数据存储技术的使用和部署。在项目中，我经常使用这些技术来存储、查询和分析海量数据。我了解这些技术的特点和优缺点，能够根据实际需求来选择合适的存储技术。我也能够通过分布式部署和集群管理来实现数据的高可用性和高性能。同时，我也能够使用这些技术提供的API和工具来进行数据的读写和分析，以满足业务需求。  


![](https://res2023.tiankonguse.com/images/2023/04/26/009.png)



A：非常好，您对多种大规模数据存储技术的熟练掌握和实际经验确实符合我们公司的要求。接下来，我想了解一下您对微服务架构的理解和使用经验。  


![](https://res2023.tiankonguse.com/images/2023/04/26/010.png)


B：非常感谢您的提问。我对微服务架构比较了解，也有实际使用经验。在微服务架构下，服务被拆分为多个独立的小服务，每个服务都具有独立的部署、伸缩和运行能力。微服务架构的优点是提高了系统的可扩展性、灵活性和容错性，同时也能够降低开发和维护成本。  


在项目中，我经常使用微服务架构来实现复杂业务需求。我熟练掌握微服务框架和技术，如Spring Boot、Spring Cloud、Docker、Kubernetes等，能够根据实际需求来选择合适的微服务方案。同时，我也能够使用微服务架构下的服务注册、配置中心、服务发现和负载均衡等工具来管理和监控微服务。此外，我还了解微服务架构下的安全性和高可用性的解决方案，并在实际项目中应用。  


![](https://res2023.tiankonguse.com/images/2023/04/26/011.png)


A：非常好，您对微服务架构的理解和实际使用经验也非常符合我们公司的要求。接下来，我想了解一下您在Linux系统下的使用经验和问题定位能力。  


![](https://res2023.tiankonguse.com/images/2023/04/26/012.png)


B：非常感谢您的提问。我熟练掌握Linux操作系统，拥有多年的实际使用经验。在项目中，我经常使用Linux系统来搭建开发环境和部署应用程序。我能够熟练使用Linux系统的基本命令和工具，如文件管理、进程管理、网络配置等，并能够灵活运用这些命令和工具来完成各种任务。  



另外，我也有较强的问题定位和分析能力。在项目中，当出现问题时，我通常会通过分析日志和调试信息来定位问题，并使用相关工具和技术来解决问题。同时，我也熟悉性能优化和调试技术，并能够通过对系统进行优化和调整来提高系统的性能和可靠性。  


![](https://res2023.tiankonguse.com/images/2023/04/26/013.png)


A：很好，您的Linux使用经验和问题定位能力也符合我们公司的招聘要求。接下来，我想了解一下您的DevOps经验和工具使用情况。  


![](https://res2023.tiankonguse.com/images/2023/04/26/014.png)



B：非常感谢您的提问。我拥有一定的DevOps经验，并熟悉相关的工具和技术。在之前的项目中，我经常使用Docker等容器化技术来实现应用程序的部署和管理，并通过Kubernetes等容器编排工具来管理容器集群。同时，我也有使用Jenkins等CI/CD工具来实现自动化构建、测试和部署的经验，并能够根据需要配置和管理相关的工具和流程。  


另外，我也熟悉监控和日志分析工具，如Prometheus、Grafana、ELK等，并能够使用这些工具来监控和分析系统的运行情况和问题。我相信我可以在DevOps领域为公司做出贡献。  


![](https://res2023.tiankonguse.com/images/2023/04/26/015.png)


A：非常好，您的DevOps经验和熟悉的工具也很符合我们公司的需求。最后，我想问一下您对于抗压和沟通协作能力的看法，以及您在这方面的经验。  


![](https://res2023.tiankonguse.com/images/2023/04/26/016.png)


B：我认为在互联网公司中，抗压和沟通协作能力非常重要。在高压的工作环境下，我们需要有足够的心理素质和应对压力的能力，保持冷静和高效的工作状态。同时，我们也需要有良好的沟通协作能力，能够与同事和其他团队有效地合作，共同解决问题并推进项目进展。  


在之前的工作中，我曾经担任过一些领导和项目负责人的角色，负责管理团队并推进项目进展。在这个过程中，我积累了一些领导经验，能够在团队中提供指导和帮助。同时，我也非常注重团队沟通和协作，在项目中积极提出建议和想法，促进团队的进步和发展。我相信这些经验和能力可以帮助我在贵公司的团队中更好地工作和协作。  


![](https://res2023.tiankonguse.com/images/2023/04/26/017.png)


A：非常感谢您的回答。根据您的回答和之前的面试过程，我认为您的经验和能力非常符合我们公司的需求。如果您有兴趣加入我们的团队，我们会尽快与您联系。同时，如果您还有其他问题或者需要了解更多信息，请随时联系我们。非常感谢您的时间和回答。  


![](https://res2023.tiankonguse.com/images/2023/04/26/018.png)


B：非常感谢您的面试机会和耐心的提问，让我更好地了解了贵公司的招聘需求和岗位职责。如果我符合您公司的招聘要求，我非常愿意加入您的团队，并为公司的发展做出贡献。谢谢！  


![](https://res2023.tiankonguse.com/images/2023/04/26/019.png)


## 三、最后  


通过这个对话，可以看到，面试官一直在围绕着招聘要求进行面试。  
由于我们没有提供面试者的简历，面试者就在各种胡编乱造了。  


赶紧试试把你的简历内容以及要面试的岗位招聘要求都提供给 ChatGPT，然后看看 ChatGPT 都会如何提问以及如何回答。  


如果你无法打开 ChatGPT 网站，可以去这里免费体验 ChatGPT，地址如下：  
https://chat.tiankonguse.com/  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

