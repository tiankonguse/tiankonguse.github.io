---
layout: post  
title: 本地 AI 文生图：LoRA 切换风格    
description: LoRA 是文生图变换风格的利器。  
keywords: AIGC  
tags: [AIGC]  
categories: [AIGC]  
updateData: 2025-05-21 12:13:00  
published: true  
---



## 零、背景


之前在《[3个免费AI 生成图片的方法](https://mp.weixin.qq.com/s/Ao2gFivhUcCEiJR326yN6w)》分享了在线生成图片的网站。   
后来在《[本地 AI 局部擦除、局部替换、动态换衣服](https://mp.weixin.qq.com/s/00SzvrXGJchex7FfLX6lLg)》介绍了局部编辑图片。  


今天来看下文生图变换风格的重要功能：LoRA。  


考虑到之前及几篇文章没有人获取工作流，这里就不在c详细介绍如何下载模型与配置工作流。  
主要展现与对比下 LoRA 下的图片效果。  


## 一、LoRA 原理  


以前，想要得到某个风格的图片，需要先使用对应风格的图片训练对应的模型，成本非常高。  


后来，研究发现，在预训练模型中，只需调整部分参数，而无需重新训练整个模型，从而以较低的计算成本实现针对特定任务的优化。  


LoRA 模型体积更小，更易于训练，成为现在文生图必不可少的一部分。  


## 二、选择 LoRA 


我这里下载了四个风格的 LoRA。  


blindbox，该模型融合了 PVC 材质的质感，适合生成具有可爱、卡通风格的角色形象。  


animeoutline，旨在生成具有日本漫画风格的黑白线稿图像。  


`leosamsFilmgirlUltra_velvia`，旨在模拟富士胶片 Velvia 的色彩风格，生成具有浓郁色彩和胶片质感的人像摄影作品。  


MoXin，旨在生成具有中国传统水墨画风格的图像。  



## 三、单个 LoRA  


DreamShaper 基于 Stable Diffusion 1.5 专门训练过的，这里我们使用  SD 原生模型来看下效果。  


prompt: shot, 1girl,solo,long hairs, happy, looking at viewers, best quality, highres, delicate details,  


含义: 拍摄，1女孩，独奏，长发，快乐，看着观众，最佳质量，高分辨率，精致的细节，  


![](https://res2025.tiankonguse.com/images/2025/05/21/005.png) 



Stable Diffusion 基础模型，追加卡通风格 blindbox ，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/006.png) 




Stable Diffusion 基础模型，追加中国传统水墨画风格 MoXin ，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/007.png) 


Stable Diffusion 基础模型，追加日本漫画风格的 animeoutline ，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/008.png) 



Stable Diffusion 基础模型，追加人像摄影风格 ，效果如下：  



![](https://res2025.tiankonguse.com/images/2025/05/21/009.png) 



Stable Diffusion 基础模型，追加线条风格 ，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/010.png) 



一个原始文生图与5个LoRA文生图整体对比如下，可以发现，完全一样的输入，只修改LoRA，人物的基本特征没有大的变化，但是风格发生了很大的变化。  


![](https://res2025.tiankonguse.com/images/2025/05/21/011.png) 


## 四、多个 LoRA   


LoRA 是可以叠加使用的，只需要按顺序连起来即可，这里看下效果。  


prompt: masterpiece, best quality, ultra-detailed, 8K, RAW photo, intricate details, stunning visuals,highly detailed, smooth skin, realistic lighting, beautiful Chinese girl, solo,elegant, cinematic lighting, soft focus  


含义：杰作，最佳品质，超详细，8K，RAW照片，复杂的细节，令人惊叹的视觉效果，高度详细，光滑的皮肤，逼真的灯光，美丽的中国女孩，独奏，优雅，电影灯光，柔焦  


基础模型选择的是 dreamshaper，生成图片如下。  


![](https://res2025.tiankonguse.com/images/2025/05/21/001.png) 


dreamshaper 模型，追加卡通风格的 LoRA blindbox，效果图如下  



![](https://res2025.tiankonguse.com/images/2025/05/21/002.png) 



dreamshaper 模型，追加中国传统水墨画风格的 LoRA MoXin，效果图如下  


![](https://res2025.tiankonguse.com/images/2025/05/21/003.png) 


最后，dreamshaper 模型，结合卡通风格的 LoRA blindbox和中国传统水墨画风格的 LoRA MoXin，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/004.png) 


2个LoRA，开启与不开启共四种组合，效果图对比如下：  



![](https://res2025.tiankonguse.com/images/2025/05/21/012.png) 


## 五、最后 


文生图 + LoRA, 就可以把我们之前生成的很多照片，在人物基本特征不变的情况下，把图片切换为不同的风格，非常有用。  


例如我下载了海贼王的 LoRA，生成照片如下：  


![](https://res2025.tiankonguse.com/images/2025/05/21/013.png) 



《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  