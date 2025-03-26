---
layout: post  
title: iPhone 通过 siri 问 DeepSeek 问题    
description: 快捷咨询问题。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG]  
categories: [大模型]  
updateData: 2025-03-26 12:13:00
published: true  
---

## 背景  


很多年前，我也做了一些 快捷指令 工具，比如饮食一键记录、家里电脑一键打开常用软件、公司电脑一键打开常用软件、攀岩一键记录、健身一键记录等。  


![](https://res2025.tiankonguse.com/images/2025/03/26/001.png) 


不过我的这些快捷指令脚本，都是操作本地的软件，并没有调用远程的接口。  


年初的时候，在朋友圈看到有人使用 Siri 结合 DeepSeek 与 快捷指令，做了一些工具，我没有在意。  


有了 ChatGPT 或者 DeepSeek 之后，日常想到的任何问题，或者不懂的，或有疑问的问题，我都会去问 ChatGPT 或者 DeepSeek。  
每次都是需要打开对应的 APP，然后输入问题，然后等待结果。  


最近我突然想，能不能通过 Siri 直接语音来问 DeepSeek 问题呢？  


说干就干，于是就有了这篇文章。  


PS：了解这个网络技术后，我有很多有趣的想法，后面有时间了，我会做成一个很智能的工具，敬请期待吧。  


## 一、技术原理  


问 DeepSeek 怎么使用 Siri 接入 Deepseek。  


回答如下，第一步申请 Key，第二步配置网络请求。  


看到支持配置 POST HTTP 请求，我瞬间就理解了整个技术原理，一切都是可行的。  


![](https://res2025.tiankonguse.com/images/2025/03/26/002.png) 



![](https://res2025.tiankonguse.com/images/2025/03/26/003.png) 


## 三、创建快捷指令  


快捷指令其实就类似于儿童拖拽编程，通过一些固定工具的组合，来实现丰富的功能。  


关键技术是 http POST 的请求参数组装与返回数据提取。  
辅助技术是语音转文本、文本转语音，其余的就是固定值的传递了。  
除了 http 网络请求这个配置成本比较高，其他的都是拖转一下就好了，不需要编程。  


![](https://res2025.tiankonguse.com/images/2025/03/26/004.png) 


## 四、体验效果  


在手机锁屏的情况下，说：”Hi siri，我的助手“，就可以打开我的助手快捷指令。   


![](https://res2025.tiankonguse.com/images/2025/03/26/005.png) 


然后语音说出自己的问题，就会语音播报相关问题


![](https://res2025.tiankonguse.com/images/2025/03/26/006.png) 


## 五、最后  


我做的快捷指令也分享给大家，大家安装后，编辑这个快捷指令，文本里输入自己的 ChatGPT Key 就可以使用了。  
如果是国内平台的 key，还需要把网络请求的地址改成国内对应平台的。  


如果你没有 key，可以关注公众号，我这个周末我会找时间开发一个软件，对 key 做下限流，到时候会分享免费的 key 给大家使用。  




![](https://res2025.tiankonguse.com/images/2025/03/26/007.png) 


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  