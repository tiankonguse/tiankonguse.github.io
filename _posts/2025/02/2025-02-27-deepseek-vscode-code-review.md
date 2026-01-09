---
layout: post  
title: vscode+DeepSeek，轻松进行代码解释、找BUG、重构        
description:  DeepSeek 本地部署后，就可以和日常开发结合起来了。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [AIGC]  
updateDate: 2025-02-27 12:13:00  
published: true  
---


## 零、背景  



之前我搭建了本地的 DeepSeek，记录在《[推荐这样使用 Deepseek-R1 本地知识库](https://mp.weixin.qq.com/s/TYmYcyObrecJtVp_cvnibw)》文章里，里面有多种搭建方案。  



后来，我常去的攀岩馆的网站打不开了，我通过腾讯云自带的 DeepSeek 大模型助手轻松解决，记录在《[云平台接入大模型，效率飞起](https://mp.weixin.qq.com/s/bWqkQpTfpysNoWuREaCzbg)》。   


从而得出了一个很重要的结论：元宝、豆包、kimi等这些产品没有未来的。  
因为以前处理问题，是去搜索引擎或者 ChatGPT 问答，现在是直接在相关应用里边问大模型，边处理问题，不需要频繁切换窗口，效率直接起飞了。  


基于这个逻辑，我就想，我是否可以把 DeepSeek 和日常开发结合起来呢？   


日常我都是使用 vscode 来开发的，即代码在 vscode 里写，命令行在 vscode 里敲。  
如果 vscode 的一侧有一个对话框，可以供我实时对话，那对可以提升不少开发效率可，  


## 一、安装插件  


vscode 插件市场有非常多 ChatGPT 与 DeepSeek 相关的插件。  
经过大量尝试，最终我选择了 DeepSeek R1 这个插件。  


![](https://res2025.tiankonguse.com/images/2025/02/27/001.png)  


安装命令如下，为了避免搜索到无关的插件，这里使用精确搜索。  


第一步：快捷键打开命令面板。  
Windows/Linux 是 Ctrl + Shift + P  
Mac 是 Command + Shift + P


第二步：删除 `>` 符号，输入 `ext install colourafredi.vscode-deepseek` 回车。  


第三步：安装搜索出来的插件  


## 二、配置插件  


还是安装界面，点击齿轮，打开配置选项。  


![](https://res2025.tiankonguse.com/images/2025/02/27/002.png)  



配置上地址、模型，key 留空就行。  


地址配置为 DeepSeek 本地模型的服务API地址：http://localhost:11434  
模型按需选择，我的电脑配置选择 8b 最合适，所以配置为 deepseek-r1:8b


![](https://res2025.tiankonguse.com/images/2025/02/27/003.png)  


## 三、咨询技术问题  


平常执行一些命令，我都是在 vscode 里操作的。  


![](https://res2025.tiankonguse.com/images/2025/02/27/004.png)  


日常安装开源程序，我是在 vscode 里运行的。  
例如上篇文章《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》,操作如下：  


![](https://res2025.tiankonguse.com/images/2025/02/27/014.png)  


这里涉及到通过 python 的 conda 来创建与切换虚拟环境。  
在左侧对话框里输入“conda 环境管理”，就可以看到推理过程与最终回答。  
由于这个插件还没支持推理过程的 think 标签，所以是直接当做普通文本显示出来的。  


![](https://res2025.tiankonguse.com/images/2025/02/27/006.png)  


回答非常完善，环境的创建、激活、环境列表、环境删除等。  


![](https://res2025.tiankonguse.com/images/2025/02/27/007.png)  


## 四、代码查错、解释、重构


DeepSeek 还可以用来代码查错、代码解释、代码重构等。  


![](https://res2025.tiankonguse.com/images/2025/02/27/008.png)  


代码查错  


比如我们选择 Leetcoode 第 867 题的代码，进行代码查错。  
prompts: 检查下面代码是否有BUG并给出修复建议  
DeepSeek 找到一个错误，代码没有处理输入矩阵为空的情况。如果输入矩阵为空，那么会导致未定义行为，甚至可能引发程序崩溃。  


![](https://res2025.tiankonguse.com/images/2025/02/27/009.png)  


不仅是指出错误，DeepSeek 还给出了修复后的代码，以及相关解释。  
最后，DeepSeek 还给出了测试用例，代码复制出来就可以直接运行。  


![](https://res2025.tiankonguse.com/images/2025/02/27/010.png)  



代码解释  


prompts: 详细讲解下面代码  
回答会解释输入参数、初始化、双重循环、返回结果、注意事项。  


![](https://res2025.tiankonguse.com/images/2025/02/27/011.png)  


代码重构  


prompts: 重构下面代码并告诉我你改动了哪里  
重构的时候，竟然发现了一个新的问题：矩阵内层循环没检查是否边界。  


![](https://res2025.tiankonguse.com/images/2025/02/27/012.png)   


函数测试  


prompts: 为下面的代码添加测试  
生成的不是标准的单元测试，只是在 main 函数里增加了两个 case。  
原因是默认 prompts 只写的测试，我们可以自定义 prompts, 要求增加单元测试。   



![](https://res2025.tiankonguse.com/images/2025/02/27/013.png)   


## 五、最后  


目前 vscode 可以直接对话、代码review、代码解释、代码重构等。  
只是当前的 UI 做的还不够友好，文字非常密集。  


后面有时间我去=下载下源码，优化下 UI。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  