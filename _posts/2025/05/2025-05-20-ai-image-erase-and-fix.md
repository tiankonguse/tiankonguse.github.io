---
layout: post  
title: 本地 AI 局部擦除、局部替换、动态换衣服    
description: 相比文生图，图生图的应用更广一些。  
keywords: AIGC  
tags: [AIGC]  
categories: [AIGC]  
updateData: 2025-05-20 12:13:00  
published: true  
---

![](https://res2025.tiankonguse.com/images/2025/05/20/015.png) 



## 零、背景


之前在《[3个免费AI 生成图片的方法](https://mp.weixin.qq.com/s/Ao2gFivhUcCEiJR326yN6w)》分享了在线生成图片的网站。   
后来在《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》分享了本地部署了文生图软件，可以无限制生成任何想要的图片。  
再后来，在《[ComfyUI 学习 AI 生图原理，10秒一张](https://mp.weixin.qq.com/s/RquhGGF4RTjcfglbLQHGJw)》分享了文生图的基本原理，以及介绍了 comfyUI 工作流的含义。  


前面已经在《[手把手教你本地 AI 图生图](https://mp.weixin.qq.com/s/lzrQnLqMArejN4bHOi5yhQ)》介绍了基本的基于图片修改图片。  


这里来介绍如何删除图片中的部分内容、替换图片中的内容，常见的应用就是动态换衣服。  




## 一、模型 


下载模型 `512-inpainting-ema.safetensors`  放到 `ComfyUI/models/checkpoints` 目录。  


下载地址：https://huggingface.co/stabilityai/stable-diffusion-2-inpainting/blob/main/512-inpainting-ema.safetensors  
 


目录结构大概如下，下载完成后，建议重启下 comfyUI。  


```
ComfyUI/
├── models/
│   ├── checkpoints/
│   │   └── 512-inpainting-ema.safetensors
```


## 二、工作流  


工作流我已经上传到网盘了，公众号回复“工作流-修复图”获取图生图工作流下载地址。  


下载后，点击顶部菜单的 workflow 下的 Open，快捷键是 `ctrl+o`，选择下载的工作流 json 文件。  


![](https://res2025.tiankonguse.com/images/2025/05/19/001.png) 


加载工作流后，可以看到如下图所示的工作流。  


![](https://res2025.tiankonguse.com/images/2025/05/20/001.png) 




注：如果 Load Checkpoint 里的 `ckpt_name` 不是 `512-inpainting-ema.safetensors`，可以双击下拉切换为这个。  



## 三、擦除内容    



比如之前生成健身自拍图，左侧腰部多了一个手指，我们可以用来擦除。  



![](https://res2025.tiankonguse.com/images/2025/05/20/002.png) 




先点击 choose file to upload 来上传一个要修复的图片。  
然后在照片上右键，选择 Open in MaskEditor。  


![](https://res2025.tiankonguse.com/images/2025/05/20/003.png) 


打开的页面与 PS 页面很像，右侧可以调整画笔刷子的大小，然后把要擦除的位置擦除，最后在最上面点击保存。  


![](https://res2025.tiankonguse.com/images/2025/05/20/004.png) 



然后输入 prompt，点击 Run。    


由于我生成图片的 prompt 是运动自拍照，我就保持完全一样了。  


prompt: Portrait photography, daily snapshot style, not carefully composed or lit, a woman, beautiful, Japanese, yoga clothes, in a gym, standing in front of a floor-length mirror, using the iPhone rear camera to take a selfie, casual composition, awkward angles, not symmetrical or beautiful, with a sense of daily life and roughness  


对应中文是：人像摄影，日常抓拍风格，没有精心构图和光线，女性，漂亮，日本，瑜伽服，在健身房，站在落地镜前，用iPhone后置摄像头自拍，随意的构图，尴尬的角度，不对称也不美观，带有日常生活感和粗糙感  



![](https://res2025.tiankonguse.com/images/2025/05/20/005.png) 



当然，我们也可以擦除的部分多一点，这样手就放在后面了。  


![](https://res2025.tiankonguse.com/images/2025/05/20/006.png) 



左半部分都擦除，左边的 AI 就会自动脑补出对应的内容。  


![](https://res2025.tiankonguse.com/images/2025/05/20/007.png) 


## 四、替换内容  


先来看下换衣服吧，我们选择前一个步骤修复后的照片。  


依旧是 Open in MaskEditor， 我们可以使用画笔一点点把衣服标记下来。  
更快捷的方法是左侧选择最后一个颜色提取，然后就可以基于颜色来选择一个区域了，把整个衣服都标记起来。  


![](https://res2025.tiankonguse.com/images/2025/05/20/008.png) 


由于上面我们的提示词没有介绍衣服，所以可以直接运行几次生成，让 AI 自行脑补衣服。  


![](https://res2025.tiankonguse.com/images/2025/05/20/009.png) 


![](https://res2025.tiankonguse.com/images/2025/05/20/010.png) 



当然，我们也可以加上衣服的关键词，例如加上颜色 Pink clothe，就会生成粉红色的衣服。  


![](https://res2025.tiankonguse.com/images/2025/05/20/012.png) 


![](https://res2025.tiankonguse.com/images/2025/05/20/011.png) 




健身房自拍照，自然少不了腹肌，加上这个关键词,不过 AI 没有生成很明显的腹肌。    


![](https://res2025.tiankonguse.com/images/2025/05/20/013.png) 


![](https://res2025.tiankonguse.com/images/2025/05/20/014.png) 



## 五、最后  


AI 擦除内容与替换内容这个功能很有用。  


擦除内容可以让我们删除图片里不想要的内容。  
替换内容则可以让我们增加或者替换一些内容。  


目前所有的 AI 图片工具都具备这两个功能，就是这样实现的。  






《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  