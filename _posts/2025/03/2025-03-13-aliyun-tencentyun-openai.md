---
layout: post  
title: 黑心的阿里云，良心的腾讯云，我选择 chatgpt  
description: 阿里云免费的午餐不要吃。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG]  
categories: [大模型]  
updateDate: 2025-03-13 12:13:00
published: true  
---

## 背景  


之前我都是使用 openai 的 付费 api 来做大模型。  


前段时间 DeepSeek 火了之后，各家云厂商都推出了免费的活动。  
阿里云和腾讯云推出了满血版 DeepSeek R1 和 V3 免费 API 调用。


我也第一时间申请接入了，体验下来，发现阿里云很黑心，腾讯云很良心。  


## 一、腾讯云  


2025年2月12日，我了解到腾讯云可以免费使用 DeepSeek V3 API，于是申请了。  


申请的时候我最担心的一个事情是：会不会突然哪天不免费了，但我不知道，然后腾讯云就给我开一个天价的账单。  


结果 2025年2月25日，腾讯云的 DeepSeek API 突然不能使用了，原来是免费活动到期了，没有我想的那个问题。  


具体查看官方文档，写的很清楚：未开通后付费，正式计费后将无法使用该服务。  


这个很良心。  



![](https://res2025.tiankonguse.com/images/2025/03/13/001.png) 



## 二、阿里云  



2025年2月25日，腾讯云的 DeepSeek API 不免费后，我就去搜索 阿里云是否有类似的免费活动。  


原来阿里云也送了 100万的 免费 Token,180 天内有效。  


![](https://res2025.tiankonguse.com/images/2025/03/13/002.png) 



一开始使用起来，阿里云的速度非常快，体验很好。  



但是到了 3 月份，阿里云的 API 就经常超时,超时率有 12.5%。  


![](https://res2025.tiankonguse.com/images/2025/03/13/003.png) 



到了 3月6日之后，超时率甚至达到 88%，第一次必然超时。  


![](https://res2025.tiankonguse.com/images/2025/03/13/004.png) 


如果仅仅是超时，我还能接受，点击一下重试就行了。  
但阿里云的 api 还经常死循环输出相同内容，特别消耗 token。  


3月11日，突然收到阿里云的短信，说大模型欠费了，欠费0.02元，预计当天晚上就会停服。  


我感到诧异，免费体验怎么还会扣费呢？  
还好不多，停服就停服吧。  


![](https://res2025.tiankonguse.com/images/2025/03/13/005.png) 


结果 3月12日，又收到一个短信，欠费的更多了。  


![](https://res2025.tiankonguse.com/images/2025/03/13/006.png) 



欠的虽然不多，但是阿里云这种行为让人感觉很不爽。  


赶紧去查看一下阿里云的文档，文档上竟然说：您无法限制或关闭超出免费额度的自动扣费。  


这个产品策略就很黑心了，阿里云免费的午餐建议大家不要吃，是一个陷阱。  


![](https://res2025.tiankonguse.com/images/2025/03/13/007.png) 


## 三、总结  


腾讯云的免费额度用完了，阿里云的免费午餐是一个陷阱。  
所以我还是打算回到 Openai 的 API。  


虽然是收费的，但选择小而美的 gpt-4o-mini 模型，用好久一天也不到 0.01美元。  


![](https://res2025.tiankonguse.com/images/2025/03/13/008.png) 





《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  