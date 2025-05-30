---
layout: post  
title: 【comfyUI】精确生成指定姿势的图片    
description: controlnet pose 技术。  
keywords: AIGC  
tags: [AIGC]  
categories: [AIGC]  
updateData: 2025-05-20 12:13:00  
published: true  
---


![](https://res2025.tiankonguse.com/images/2025/05/30/014.png) 


## 零、背景


之前在《[AI生成动漫图片，国内比国外更懂动漫](https://mp.weixin.qq.com/s/7_aAuGjJd0cjptD9W0BXfw)》提到，豆包和元宝画的动漫自拍图很露骨，其他自拍图很像真实的自拍图。   


后来在《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》分享了本地部署了文生图软件，可以无限制生成任何想要的图片。  



今天我们就来尝试本地模型获取一个图片的动作姿势或者物品的轮廓线，然后基于这些轮廓线生成新的图片。  


PS：本文所有图片全部都是使用混元文生图本地模型生成的。  


## 一、模型下载  


工作流：公众号后台回复“ComfyUI-工作流”获取，导入工作流，自动安装相关依赖节点。  


需要下载姿势 pose 相关的 controlnet 模型，放在  `ComfyUI/models/controlnet` 目录下。 


下载地址:  https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_openpose_fp16.safetensors?download=true

 


下载两个模型 majicmixRealistic_v7.safetensors 和 japaneseStyleRealistic_v20.safetensors, 放在  `ComfyUI/models/checkpoints` 目录下。 


下载地址1:  https://civitai.com/api/download/models/176425?type=Model&format=SafeTensor&size=pruned&fp=fp16
下载地址2： https://civitai.com/api/download/models/85426?type=Model&format=SafeTensor&size=pruned&fp=fp16


最后还需要下载一个专用的 vae-ft-mse-840000-ema-pruned.safetensors，放在 `ComfyUI/models/vae` 目录下 。  


下载地址：https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors?download=true  





## 二、单个姿势  


prompt: 


```text
A serene portrait of a young Asian woman is captured in this photograph, set against a soft, diffused background. The subject's face is delicately illuminated by a subtle, natural light source, which accentuates the gentle curves of her features and imbues her skin with a warm, luminous glow. The lighting is carefully calibrated to minimize harsh shadows, resulting in a softly nuanced and realistic representation of the subject's complexion

The camera is positioned at a slight angle, providing a subtle, three-quarter view of the subject's face. This perspective allows the viewer to appreciate the intricate details of her facial structure, while also creating a sense of intimacy and closeness

The subject's dark hair cascades down her back, framing her face and adding depth to the composition. A bouquet of delicate, pale purple flowers is positioned in the foreground, their slender stems and petals artfully arranged to create a sense of movement and dynamism

Throughout the image, the photographer's attention to detail and mastery of lighting techniques are evident, resulting in a captivating and beautifully rendered portrait that invites the viewer to linger and explore the subject's serene, enigmatic expression
```


pos 图片：  



![](https://res2025.tiankonguse.com/images/2025/05/30/001.png) 



效果图：  



![](https://res2025.tiankonguse.com/images/2025/05/30/002.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/003.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/004.png) 



## 三、多个姿势


我们还可以将多个 controlnet 的姿势结合起来，从而生成多个指定姿势的图片。  



例如下面的两个姿势，一个是人，一个是猫在画板上。


![](https://res2025.tiankonguse.com/images/2025/05/30/005.png) 


效果图：  



![](https://res2025.tiankonguse.com/images/2025/05/30/006.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/007.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/008.png) 



## 四、图像识别姿势  


一般情况下我们没有姿势图片，此时可以通过上传的图片自动生成姿势。  



![](https://res2025.tiankonguse.com/images/2025/05/30/009.png) 


例如之前我在本地生成的雨中跳舞的图片，就可以识别为下面的姿势。  


![](https://res2025.tiankonguse.com/images/2025/05/30/010.png) 



再结合我们的 prompt，就可以生成这个姿势的图片了。  


![](https://res2025.tiankonguse.com/images/2025/05/30/011.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/012.png) 


![](https://res2025.tiankonguse.com/images/2025/05/30/013.png) 



## 五、最后  


controlnet 是一个很实用的扩展，通过这个组件，我们可以生成各种姿势的人物照片。  








《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  