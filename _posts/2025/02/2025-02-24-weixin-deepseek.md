---
layout: post  
title: 微信公众号接入AI大模型  
description: 快来体验下怎么样。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [AIGC]  
updateDate: 2025-02-23 12:13:00  
published: true  
---


## 零、背景  


之前我本地搭建了 DeepSeek ，记录在文章《[推荐这样使用 Deepseek-R1 本地知识库](https://mp.weixin.qq.com/s/TYmYcyObrecJtVp_cvnibw)》。  


文章中提到，Cherry Studio 支持搭建网页知识库。  


所以我就尝试搭建一个我的公众号文章的知识库，顺便把微信公众号的大模型自动回答也打开了。  


## 一、本地知识库  



在写年度总结《[2024 年个人总结及2025年规划](https://mp.weixin.qq.com/s/cGtR-ZZz50G1-wIU9TdU_A)》时，我提到，我之前写了一个程序，可以爬虫微信公众号的所有文章、B站所有视频、小红书所有视频。  


![](https://res2025.tiankonguse.com/images/2025/02/24/001.png) 


所以我就可以使用这个程序，把我的微信公众号的文章链接爬下来，导入到 Cherry Studio， 构建一个本地的公众号知识库。  


![](https://res2025.tiankonguse.com/images/2025/02/24/002.png) 


当然，实际我也不需要这么麻烦。  


因为我的微信公众号文章页都有一个本地备份。  
Cherry Studio 还支持本地目录，我直接把本地备份的目录加入进来就行了。  


## 二、微信公众号开启自动回复  


搭建本地知识库只能自己使用，如果知识库能让大家一起使用，那就可以一起学习进步了。  



大家在公众号对话框里可以输入任何问题，现在都可以自动回答了。  


例如问：总结下最新一篇的文章，回答如下。  


最近我体验了几种搭建本地Deepseek知识库的方法，感觉各有优劣。  
首先，Deepseek-R是一个高效的模型，分为多个版本，初次尝试建议使用 1.5B版本，以免硬件资源不足。  
下载模型可以使用 huggingface-cli，安装 LM studio 则能简化整个流程，支持上传文件进行对话。


![](https://res2025.tiankonguse.com/images/2025/02/24/003.png) 



问：有哪些网站支持文生图，回答如下。  
1.ChatGPT:每天有一定的文生图额度，可以免费使用。  
2.通义千问 qwenlm:目前没有次数限制，用户可以随意生成图片。  
3.微信公众号:支持 AI生成文章封面图，并且可以切换不同的风格，比如清新日漫风格用户体验良好。  


![](https://res2025.tiankonguse.com/images/2025/02/24/004.png) 



问算法相关的，如并查集，介绍的非常详细。  
并查集(Union-Find)是一种用于处理不相交集合的数据结构主要用于解决动态连通性问题它支持两种主要操作:查找(Find)和合并(Union)。  


![](https://res2025.tiankonguse.com/images/2025/02/24/005.png) 



不仅算法，其他任何知识都可以问，例如数学。  
高级微积分是一个广泛的领域涵盖了比基础微积分更复杂的概念和技术。它主要包括以下几个方面:  


![](https://res2025.tiankonguse.com/images/2025/02/24/006.png) 


问题生活旅游，也可以详细的给你一个攻略。  
去上海旅游，我推荐以下几个必去的景点:  
首先，外滩是上海最具代表性的景点之一  
其次，东方明珠塔是上海的地标性建筑。  
还有豫园和上海城隍庙。  
如果喜欢文化氛围，可以去上海交通大学和复旦大学参观。  

![](https://res2025.tiankonguse.com/images/2025/02/24/007.png) 



## 三、最后  


公众号的这个大模型挺好用的，回答的内容非常准确。  
当然，这个不是我自己的本地大模型，而是平台支持的。  
感兴趣的可以后台回复”公众号大模型“，获取开启方法。  


![](https://res2025.tiankonguse.com/images/2025/02/24/008.png) 



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  