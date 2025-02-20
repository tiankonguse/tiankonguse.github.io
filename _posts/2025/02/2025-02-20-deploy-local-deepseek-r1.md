---
layout: post  
title: 对比多款本地 Deepseek-R1 知识库，哪款适合你呢      
description: 研究了 Deepseek 部署方法，搭建了几个知识库，对比下优缺点。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [大模型]  
updateData: 2025-02-20 12:13:00  
published: true  
---


## 背景  


现在网上有很多本地部署 DeepSeek 搭建知识库的教程，我大部分都尝试了一遍，现在来看下哪些好用吧。  


## 一、前言  


如果你要体验 DeepSeek，直接登录 DeepSeek 官网即可在线免费体验，支持深度思考 (R1) 与 联网搜索。  
体验地址： https://chat.deepseek.com/  


![](https://res2025.tiankonguse.com/images/2025/02/20/001.png)  



另外，腾讯云也号称部署了满血版 DeepSeek-R1，可以供大家免费在线使用。  
体验地址：https://lke.cloud.tencent.com/lke#/experience-center/home?origin=all  


![](https://res2025.tiankonguse.com/images/2025/02/20/002.png)  


当然，还有很多其他平台都在宣传接入了满血版 DeepSeek-R1，这里就不一一罗列了。  


## 二、原生使用  


部署与使用之前，我们需要先明白 Deepseek-R1 是什么，从 Deepseek 到使用涉及哪些环节。  


**第一个问题：Deepseek-R1是什么**。  


Deepseek-R1 是 Deepseek 公司训练的一个模型，大家的教程中的 Deepseek-R1 更准确的说应该是 DeepSeek-R1-Distill 模型，即降配的模型。  


为啥降配呢？  
因为大家的硬件资源较低，原生模型需要很高的硬件资源。  
降配后的 Distill 蒸馏模型，分为 1.5B、7B、8B、14B、32B、70B、671B等版本，数字越大，对电脑配置要求越高。  


首次尝试，建议大家都先使用 1.5B，能运行起来了，再去考虑更大的模型。  
这个从工程角度来看，是先通过快速敏捷的手段输出 MVP 版本验证可行性，可行性验证完了，再去投入资源扩容功能。  


PS：想想一下，你花费了几个小时终于下载完了 32B 模型，折腾半天，你的电脑跑不起来，你不就要抓狂了嘛。  


**第二个问题：模型文件从哪里下载**  


前面我们知道了 Deepseek-R1 是一个模型文件，那自然就需要有地方来下载这个文件。  
对于大模型来说，最大的平台是 huggingface。  


**第三个问题：怎么下载模型文件**  


有人可能会有疑问，下载文件谁不会呢。  
别说，对于大模型，下载文件还真不一样。  


huggingface 平台有多种下载方式，最推荐的事使用 huggingface-cli 来下载。  
当前，其他平台一般也提供对应的下载方法，后面单独讲解。  


**第四个问题：怎么运行大模型**  


毕竟大模型是一个文件，而不是可运行的程序。所以还需要一个程序来加载与运行大模型文件。   


对于开发人员，一般是自己开发 python 程序来加载与运行大模型。  


例如下面就是最简单的代码  


```python
from transformers import pipeline

messages = [
    {"role": "user", "content": "Who are you?"},
]
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
pipe(messages)
```


**第五个问题：怎么与大模型对话**  


可能会有人会有疑问，前面都加载运行大模型了，怎么还不能与大模型对话呢？  


对于部分工具，运行大模型后确实可以对话，但是这种对话是极其简单的命令行方式。  
如下图，运行大模型后，我们只能一个问题一个问题来问，且没有其他任何功能，所以还需要一个与大模型对话的工具，我们一般称为应用UI。  


![](https://res2025.tiankonguse.com/images/2025/02/20/003.png)  


**第六个问题：怎么使用知识库**  


这个问题目前比较难回答，后面介绍具体软件时，再结合着一起回答。  



**小总结**  


到这里，我们就明白整个链路了：DeepSeek 开源大模型文件，储存在大模型平台。我们通过下载工具从大模型平台下载大模型文件，然后使用运行工具加载大模型，最后使用UI应用工具来与大模型对话。  


![](https://res2025.tiankonguse.com/images/2025/02/20/004.png)  



## 二、工具链  


如果让大家使用原生的大模型进行下载、运行、应用，那将会是一件及其困难的事情。  


幸运的时，业界有很多开源工具，可以大大降低这个流程的使用成本。  


**LM studio**  


第一个工具是 LM studio，自带模型平台、下载工具、运行工具、UI交互全部打通。  
只需要下载这个软件，双击安装，搜索与下载模型，等待下载完成后即可对话。  


LM studio下载地址：https://lmstudio.ai/  


![](https://res2025.tiankonguse.com/images/2025/02/20/005.png)  


如上图，可以发现 LM studio 还支持上传 PDF、txt、doc 文件，即支持基于知识来对话。  


**RAG**

对于文件知识，这里并不是直接把文件传给大模型的。  
而是需要先通过额外的工具，读取出文件的数据。  


由于文件可能很大，大模型一次不支持传输这么大内容，所以需要对文件进行切片拆分。  
每次我们与大模型对话时，需要先使用一个外部的搜索引擎搜索出匹配的文件切片，这个搜索目前都是使用向量近似搜索的，所以文件切片需要先通过另外一个模型转化为向量。  
然后把这些切片向量以及我们的问题发送给大模型，大模型根据这些切片文件、问题，结合自己的知识，回答我们的问题。  
这么一套我们称为 RAG。  



![](https://res2025.tiankonguse.com/images/2025/02/20/006.png)  





**ollama**  


大家在尝试自己部署 DeepSeek 时，看到的最频繁的名词应该就是 ollama 了吧。  


ollama 是一个大模型运行工具，也自带下载功能，所以使用起来非常方便。  
ollama 下载地址： https://ollama.com/download  


安装也一样，官网下载软件，双击安装。  
安装后，使用 `ollama pull deepseek-r1:1.5b` 即可完成下载大模型。  



如果你眼神比较好，这时候你可能会发现我写的命令与大家写的不一样。  
大家写的都是 `ollama run deepseek-r1:1.5b` 来下载大模型。  


其实，run 是运行大模型，没找到就去自动下载。  
pull 才是下载大模型的正确指令。    


RAG 里提到需要把文本向量化时需要一个模型，所以这里可以一起下载了。  
命令为 `ollama pull bge-m3`。  



**Cherry Studio**  


下载完 ollama 后，我们还没发直接使用大模型来解读文件。  


这时候需要下载一些 UI 交互引擎，最常见的就是 Cherry Studio。  
下载地址：https://cherry-ai.com/  


双击安装软件，之后需要按下图关联上 ollama。  



![](https://res2025.tiankonguse.com/images/2025/02/20/007.png)  


之后就可以选择对应的模型，在对话框里聊天了。  



![](https://res2025.tiankonguse.com/images/2025/02/20/008.png)  



**知识库**  


如果只需要一个文件来问答，直接在聊天窗口上传文件来问答就可以了。  
如果自己有很多资料，就需要使用到知识库了。  


如下图，我们可以将知识打包上传到一个地方，称为知识库，可以理解为第一级目录。  


![](https://res2025.tiankonguse.com/images/2025/02/20/010.png)  


使用时，选择知识库，然后提出自己的问题即可。  


![](https://res2025.tiankonguse.com/images/2025/02/20/011.png)  



知识库背后的原理其实和传一个文件类似，这里文件提前进行了处理，并且支持对文件分类放在不同的文件夹里，文件夹名称叫做知识库。  


![](https://res2025.tiankonguse.com/images/2025/02/20/009.png)  




**AnythingLLM**  


使用体验上， AnythingLLM 也不错。  
并且什么都内置了，真正的做到了一个软件内安装即可使用。  


![](https://res2025.tiankonguse.com/images/2025/02/20/012.png)  


但是 AnythingLLM  使用起来，我个人认为没有 Cherry Studio 方便，因为  Cherry Studio 的分割上下文这个功能太好用了，一个聊天窗口就可以聊所有话题了 。  


**Page Assist**  


Page Assist 是一个浏览器插件，下载后选择模型就可以聊天了。  
这个插件的好处是支持联网，也支持简单的知识库，但是联网与知识库不能选择。  


![](https://res2025.tiankonguse.com/images/2025/02/20/013.png)  


Page Assist 另一个好处是可以直接把一个页面当做知识输入，来进行总结、翻译、分析等。  



如下图，网页上右键，点击打开 Copilot 进行聊天，右边弹出的页面勾选与当前页面聊天，即可总结这篇文章了。  


![](https://res2025.tiankonguse.com/images/2025/02/20/014.png)  


就像我上篇算法比赛题解，deepseek-r1 花费了 29 秒，回答了对哦文章的总结、核心思路总结、适应场景、优化建议等。  


![](https://res2025.tiankonguse.com/images/2025/02/20/015.png)  


**openwebui**  



还有人推荐 openwebui， openwebui是一个本地网站系统，使用下来，唯一的好处是可以同时跑多个模型，进行答案对比。  
下载地址：https://openwebui.com/  


![](https://res2025.tiankonguse.com/images/2025/02/20/016.png) 


## 三、最后



这里体验了 ollama、LM studio、Cherry Studio、AnythingLLM、Page Assist、Open-Webui 等，它们之间的关系如下图。  



![](https://res2025.tiankonguse.com/images/2025/02/20/017.png) 


大家最关心的是知识库管理是否方便，UI交互是否好用，如果可以联网搜索则是加分项。  


ollama: 运行本地大模型的根基，我会一直使用。  
LM studio：没有知识库，但是类似于 ollama 运行模型后可以供其他服务使用，于不懂命令行的玩家，可以当做一个模型管理工具。  
AnythingLLM：可以方便下载模型、有不错的知识库管理工具，甚至支持爬虫网站，可以把感兴趣的网站爬下来搜索问答。  
Cherry Studio: 知识库支持文件、本地目录、网页、网站地图、笔记，会成为我的核心本地知识库。   
Page Assist: 浏览器插件，用来分析总结文章，以及日常代替 chatGPT 来问答。  
Open-Webui: 使用成本比较高，不会使用。  


总结一下，我日常主要会使用 Cherry Studio 本管理本地知识、Page Assist 来进行页面分析以及网络搜索，ollama 是底层基础支撑工具。  


所以要推荐哪种方式搭建本地 Deepseek 知识库，我的回答是 ollama + Cherry Studio + Page Assist。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  