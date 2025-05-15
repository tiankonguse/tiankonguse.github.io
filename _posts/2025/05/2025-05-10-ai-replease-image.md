---
layout: post  
title: 免费的 AI 图片网站，一键替换人脸            
description: 除了人物替换，还支持风格切换、附加新的 Prompt。  
keywords: AIGC 
tags: [AIGC]  
categories: [AIGC]  
updateData: 2025-05-10 12:13:00
published: true  
---

## 一、背景


之前推荐过三个小众的图片生成网站，记录在《[3个免费AI 生成图片的方法](https://mp.weixin.qq.com/s/Ao2gFivhUcCEiJR326yN6w)》。  
后来，我在本地部署了图片生产系统，记录在 《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》。  


这些说到底都是输入一段 prompt，然后独立生成一张图片。  



最近意外发现一个人脸 AI 替换网站，输入一个清晰的人脸图片 A，再输入一张要替换的图片 B，AI 就会把图片 A 里的人替换在图片 B 里。  
除了人脸替换，还有风格切换、加新的 Prompt 来丰富图片。  


下面来分别看下这些功能吧。  


## 二、人脸替换  


如下图，左侧上传一个人的图片，右边上传待替换的图片，点击 Submit ，10秒左右就可以完成替换。  


![](https://res2025.tiankonguse.com/images/2025/05/10/001.png) 


例如我上传一个自己的头像版，随便找一个图片，替换如下  


![](https://res2025.tiankonguse.com/images/2025/05/10/002.png)


![](https://res2025.tiankonguse.com/images/2025/05/10/007.png)



## 三、风格切换  


除了替换人脸，这里还支持选择切换风格。  
风格的本质是增加了一些 prompt  


![](https://res2025.tiankonguse.com/images/2025/05/10/013.png)


这里先使用 AI 生成的一个人脸头像，然后来体验下各个风格的效果。  


![](https://res2025.tiankonguse.com/images/2025/05/10/003.png)


Watercolor 风格的 prompt 是：watercolor painting, vibrant, beautiful, painterly, detailed, textural, artistic。  


中文含义: 水彩画，充满活力，美丽，绘画性强，细致，有质感，艺术性。  


![](https://res2025.tiankonguse.com/images/2025/05/10/004.png)


Neon 风格的 prompt 是： masterpiece painting, buildings in the backdrop, kaleidoscope, lilac orange blue cream fuchsia bright vivid gradient colors, the scene is cinematic,  emotional realism, double exposure, watercolor ink pencil, graded wash, color layering, magic realism, figurative painting, intricate motifs, organic tracery, polished.  


中文含义是：杰作绘画，背景中的建筑物，万花筒，淡紫色橙色蓝色奶油紫红色明亮生动的渐变色彩，场景是电影，情感现实主义，双重曝光，水彩墨水铅笔，渐变洗涤，色彩分层，魔幻现实主义，具象绘画，复杂的图案，有机窗饰，抛光。  


![](https://res2025.tiankonguse.com/images/2025/05/10/005.png)


Jungle 风格的 prompt 是： waist-up "in a Jungle" by Syd Mead, tangerine cold color palette, muted colors, detailed, 8k,photo r3al,dripping paint,3d toon style,3d style,Movie Still  


中文含义: 席德·米德 (Syd Mead) 的《丛林》半身像，橘色冷色调，柔和的色彩，细节丰富，8k，照片 r3al，滴漆，3D 卡通风格，3D 风格，电影剧照  


![](https://res2025.tiankonguse.com/images/2025/05/10/006.png)




Film Noir 风格的 prompt 是：film noir style, ink sketch，vector, highly detailed, sharp focus, ultra sharpness, monochrome, high contrast, dramatic shadows, 1940s style, mysterious, cinematic  


中文含义：黑色电影风格，水墨素描，矢量，高度详细，清晰对焦，超清晰，单色，高对比度，戏剧性阴影，20 世纪 40 年代风格，神秘，电影  


![](https://res2025.tiankonguse.com/images/2025/05/10/008.png)


## 四、附加 prompt  


既然风格替换是增加一些 prompt，自然，这个网站也支持传入自定义的 prompt。  


传入文章 《[comfyui 本地无限制高清文生图](https://mp.weixin.qq.com/s/qIDtQnraKUhh0qtQY1Q-MQ)》里面的 prompt，生成图片如下。  



![](https://res2025.tiankonguse.com/images/2025/05/10/009.png)


通过调整 prompt 里的参数，可以生成不同的图片，人物的基本特征都是保持不变的。  


![](https://res2025.tiankonguse.com/images/2025/05/10/010.png)



![](https://res2025.tiankonguse.com/images/2025/05/10/012.png)


## 五、最后  


这个网站的地址是 https://huggingface.co/spaces/InstantX/InstantID  
我生成了几十次图片后，发现无法生成图片了。  
原来每天提供 5 分钟的免费使用时间，而生成一张图片十秒左右，一天生成几十张足够使用了。  

![](https://res2025.tiankonguse.com/images/2025/05/10/011.png)



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  