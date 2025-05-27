---
layout: post  
title: 【comfyUI】本地使用混元模型生成高质量图片  
description: 生成高质量图片的关键。  
keywords: AIGC  
tags: [AIGC]  
categories: [AIGC]  
updateData: 2025-05-27 12:13:00  
published: true  
---


![](https://res2025.tiankonguse.com/images/2025/05/27/015.png) 

## 零、背景


之前在《[AI生成动漫图片，国内比国外更懂动漫](https://mp.weixin.qq.com/s/7_aAuGjJd0cjptD9W0BXfw)》提到，豆包和元宝画的动漫自拍图很露骨，其他自拍图很像真实的自拍图。   


后来在《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》分享了本地部署了文生图软件，可以无限制生成任何想要的图片。  



今天我们就来尝试本地部署混元文生图模型，来本地生成无限制的自拍图。  


本地下载混元文生图模型，主要是因为这个模型支持中文，不需要去翻译 prompt 了。  


PS：本文所有图片全部都是使用混元文生图本地模型生成的。  


## 一、模型下载  


下载 hunyuan_dit_1.2.safetensors 并将其放在您的 ComfyUI/models/checkpoints 目录中。


下载地址:  https://huggingface.co/comfyanonymous/hunyuan_dit_comfyui/blob/main/hunyuan_dit_1.2.safetensors


![](https://res2025.tiankonguse.com/images/2025/05/27/001.png)  


## 二、中文效果  


prompt: 一张平白无奇的自拍照片，没有明确的构图感，随手一拍。室内打光不均导致的轻微曝光，整体呈现出一种刻意的平庸感，像是从口袋拿出手机随便一张自拍。人物未将五官完全遮住的美女，穿着还原生活角色(不要重复)的装扮，着重体现出腿部和身材，姿势要自然符合现实自拍逻辑，身材比例不用过于夸张，手机要体现出真实，更加还原真实女性皮肤质感，照片略带运动模糊。


![](https://res2025.tiankonguse.com/images/2025/05/27/002.png)  


果然很模糊。  
那就需要修改下提示词，我们需要的是清晰的图片。  


prompt: 随手一拍，整体呈现出一种美感，像是从口袋拿出手机随便一张自拍。人物未将五官完全遮住的美女，穿着还原生活角色(不要重复)的装扮，着重体现出腿部和身材，姿势要自然符合现实自拍逻辑，身材比例不用过于夸张，手机要体现出真实，更加还原真实女性皮肤质感。

![](https://res2025.tiankonguse.com/images/2025/05/27/003.png)  



![](https://res2025.tiankonguse.com/images/2025/05/27/004.png) 



这样生成的图片就正常多了。  


大家都知道，文生图是没有语义的，只需要关键词语，所以可以继续删除一些词语。  
再次简化下描述，删除无关的词语。  


prompt: 自拍，美感，美女，还原生活角色的装扮，着重体现出腿部和身材，姿势自然符合现实自拍逻辑，手机体现出真实，真实女性皮肤质感。



![](https://res2025.tiankonguse.com/images/2025/05/27/006.png) 



生活角色修改成动漫角色。  


prompt: 自拍，美感，美女，还原动漫角色的装扮，着重体现出腿部和身材，姿势自然符合现实自拍逻辑，手机体现出真实，真实女性皮肤质感。


![](https://res2025.tiankonguse.com/images/2025/05/27/005.png) 



## 三、英文效果  


中文 prompt 画的图片质量非常不稳定，我突发奇想，使用英文会怎么样呢。  


这里使用 英文 prompt 来看下效果。  



prompt: An East Asian woman, beautiful, Slender legs, Full,  Convex, young, (looking directly at viewer:1.1),Bulging, delicate features,(flawless glowing skin:1.1),  (masterpiece:1.1), best quality, 8k uhd, high detail


![](https://res2025.tiankonguse.com/images/2025/05/27/007.png) 




![](https://res2025.tiankonguse.com/images/2025/05/27/008.png) 




![](https://res2025.tiankonguse.com/images/2025/05/27/009.png) 





## 四、再次使用中文  


英文生成的图片非常清晰。


对比英文与中文的 prompt，发现中文缺少了图片质量的关键词，这个是图片质量不高的原因。  


所以我们需要加上关键词：最佳品质，8k uhd，高细节，清晰的焦点，复杂的细节，微妙的胶片颗粒。    


这些词语加上后，中文 prompt 生成的图片质量就高多了。  


![](https://res2025.tiankonguse.com/images/2025/05/27/010.png) 


![](https://res2025.tiankonguse.com/images/2025/05/27/011.png) 



![](https://res2025.tiankonguse.com/images/2025/05/27/012.png) 



加上动漫关键词，生成的图片就有动漫画风了。  


![](https://res2025.tiankonguse.com/images/2025/05/27/013.png) 



![](https://res2025.tiankonguse.com/images/2025/05/27/014.png) 



## 四、最后  


试玩混元的本地文生图模型，本来想使用中文的，关键还是在 prompt，加上一些图片清晰度的关键词，就可以画出高质量的图片。  




《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  