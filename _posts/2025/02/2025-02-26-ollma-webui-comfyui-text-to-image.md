---
layout: post  
title: comfyui 本地无限制文生图        
description: 任何图片都可以生成，图片质量还非常高。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [AIGC]  
updateDate: 2025-02-26 12:13:00  
published: true  
---


## 背景  


之前我在《[推荐这样使用 Deepseek-R1 本地知识库](https://mp.weixin.qq.com/s/TYmYcyObrecJtVp_cvnibw)》中提到，自己搭建了本地 Deepseek-R1 知识库，过程中体验了 ollama、LM studio、Cherry Studio、AnythingLLM、Page Assist、Open-Webu。  


在体验 Open-Webui 的过程中，发现可以配置文生图，依赖于本地引擎 ComfyUI 。  


![](https://res2025.tiankonguse.com/images/2025/02/26/001.png) 


于是我便部署了一下 ComfyUI，发现这个文生图确实很强大，没有任何安全限制，可以生成任意词语的图片，而且图片质量还很高。  



## 一、部署安装  


最简单的事直接下载安装包，双击即可安装。  
下载地址： https://www.comfy.org/download  



我是源码安装的。  
第一步下载源代码。  


```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
```


第二步，创建虚拟环境，安装依赖。  


```bash
cd ComfyUI

# python 3.13 is supported but using 3.12 is recommended 
conda create -n ComfyUI python=3.12
conda activate ComfyUI

pip install torch torchvision torchaudio
pip install -r requirements.txt

python main.py 
```


如果生成图片报错 `RuntimeWarning: invalid value encountered in cast  img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))`，则需要加上特殊的参数。  
参考资料: https://github.com/comfyanonymous/ComfyUI/issues/4241  


```bash
python main.py --force-upcast-attention
```


启动成功后，就可以看到 `To see the GUI go to: http://127.0.0.1:8188` 提示语了。  


## 二、下载模型    


打开，http://127.0.0.1:8188 , 点击 Workflow ，选择 Browse Templates。  


![](https://res2025.tiankonguse.com/images/2025/02/26/002.png) 


可以看到四个模版，我们分别点击，如果提示需要下载模型文件，就点击下载。  


![](https://res2025.tiankonguse.com/images/2025/02/26/003.png) 


模型文件下载之后，放在 models/checkpoints 目录下。  


![](https://res2025.tiankonguse.com/images/2025/02/26/004.png) 


## 三、生成图片  


![](https://res2025.tiankonguse.com/images/2025/02/26/006.png) 


默认生成瓶子的模板，我们什么不动，点击生成等待 5 分钟，即可生成下面的图片。  


![](https://res2025.tiankonguse.com/images/2025/02/26/005.png) 


四个模板试下来，最后的 Flux Schnell 效果最佳，所以后面我都是使用这个来生成图片。  


之后，我使用《[3个免费AI 生成图片的方法](https://mp.weixin.qq.com/s/Ao2gFivhUcCEiJR326yN6w)》文章提到的 文生图 Prompts 来试了下，生成的图片非常令人惊艳。  



![](https://res2025.tiankonguse.com/images/2025/02/26/007.png) 


之后让 ChatGPT 随机修改下 prompts。  


![](https://res2025.tiankonguse.com/images/2025/02/26/008.png) 



生成图片如下，有种相机聚焦的感觉。  


![](https://res2025.tiankonguse.com/images/2025/02/26/009.png) 


之后让 ChatGPT 改动比例至少 30%：上面的 prompts 请进行大幅度修改，修改 30% 的语义，修改 30% 的场景，修改 30% 的背景。   


![](https://res2025.tiankonguse.com/images/2025/02/26/010.png) 


之后，图片的风格就变化比较大了。  


![](https://res2025.tiankonguse.com/images/2025/02/26/011.png) 


![](https://res2025.tiankonguse.com/images/2025/02/26/012.png) 


![](https://res2025.tiankonguse.com/images/2025/02/26/013.png) 


## 四、最后  


期间尝试加了一句不穿衣服，竟然真的把衣服脱了，还是高清无码的，不过发出来还是要打个码的。  


![](https://res2025.tiankonguse.com/images/2025/02/26/014.png) 


之前在《[微信公众号接入AI大模型](https://mp.weixin.qq.com/s/g2pDDvGxWAedbfXF6H7FqA)》提到，公众号对话框支持对话了。  
有人留言生成一个小狗的图片。  
我输入小狗，生成了下面的图片，又惊艳到我了。  


![](https://res2025.tiankonguse.com/images/2025/02/26/015.png) 


使用下来，有两个缺点。   
第一个缺点是慢，一张图需要5分钟才能出来。  
第二个缺点是非常慢，偶尔不知道什么原因，需要十几分钟甚至半个小时才出来。  



感兴趣的人可以下载尝试一下。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  