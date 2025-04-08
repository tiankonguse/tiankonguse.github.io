---
layout: post  
title: 编程助手 copilot 几分钟做一个网站真的可以吗？    
description: 清明三天研究了一下 copilot ，分享下使用经验。  
keywords: 项目实践 
tags: [项目实践]  
categories: [项目实践]  
updateData: 2025-04-07 12:13:00
published: true  
---

## 零、背景  


很早之前，我就想做一个网站，依赖一个复杂的开源库（其实并不复杂），但一直没有动手。  


上上周末，我花了两天时间尝试实现这个网站。  
第一天，我在 GitHub 上阅读了关键技术开源库的所有文档和 Demo 样例，彻底理解了这个开源库的使用方法，并成功跑通了 Demo。  
第二天，我在 GitHub 上寻找基于这个开源库的 Web UI 开源项目，目标是找到一个功能符合我需求且代码简单的项目，这样我就可以稍作修改来支持我的需求。  


结果，我尝试了十几个项目，花费了一整天时间。虽然这些项目的功能组合起来基本符合预期，但它们的代码都比较复杂，最终我还是放弃了。  


清明前一天，我突然想到，现在 AI 辅助编程这么火热，为什么不试试让 Copilot 来直接帮我生成相关代码呢？  


## 一、首次使用


在之前的文章《[代码生成实战：本地DeepSeek与云端大模型Copilot/Cousor/Gemini/通义/豆包](https://mp.weixin.qq.com/s/CSiZQO_VJQlCbeDEXOL2yQ)》 我已经安装了这些 AI 辅助编程工具，这里就不再重复安装了。  


稍微补充下 copilot 的四种功能：  


- Code Completion：即代码补全，按 TAB 键即可完成。  
- Editor Inline Chat：即行内代码编辑，选中代码后通过对话进行修改。  
- Copilot Chat：聊天功能，即通过侧栏直接与 AI 助手对话。  
- Copilot Editor/Agent：编辑模式，即通过侧栏对话直接修改代码，是最强大的模式。  



当时我主要使用的 code completion、editor inline Chat、Copilot chat 功能，并没有使用 Copilot editor/agent 功能，这次我就来尝试一下。   



首先是让助手帮忙生成项目环境。  


魔法咒语：请使用 conda 创建一个环境，环境名是项目目录名，python 版本是 3.11  


cursor 生成如下：  


![](https://res2025.tiankonguse.com/images/2025/04/07/004.png) 


github copilot 生成如下：  


![](https://res2025.tiankonguse.com/images/2025/04/07/002.png) 


之后，我先写了一个非常详细的 readme ，介绍清楚我的诉求：前端是纯静态页面，后端是 python Flask 框架，数据库是 Sqlite。  
随后介绍网站各个页面的功能、数据库表结构、图面储存方式、后端接口设计等。  



![](https://res2025.tiankonguse.com/images/2025/04/07/001.png) 


随后，传入魔法咒语：这个一个攀岩黑练墙自定义线路的网站，请遵循 readme 生成相关代码。  


cursor 生成如下：  


![](https://res2025.tiankonguse.com/images/2025/04/07/005.png) 
![](https://res2025.tiankonguse.com/images/2025/04/07/006.png) 


github copilot 生成如下：  


![](https://res2025.tiankonguse.com/images/2025/04/07/003.png) 


几分钟时间，项目就生成好了。  


cursor 果然比 github copilot 强大。  
github copilot 只生成了一个页面，而 cursor 生成了一个网站的所有页面与所有功能。  


不过项目运行起来，github copilot 的项目是可以直接使用的，而 cursor 生成的项目一直报错。  



cursor 第一次报错，说缺少 numpy 库。  


![](https://res2025.tiankonguse.com/images/2025/04/07/007.png) 



cursor 第二次报错，说缺少 flask-sqlalchemy 库。  


![](https://res2025.tiankonguse.com/images/2025/04/07/008.png) 



cursor 第二次报错，端口号冲突，被 github copilot 生成的项目占用了。  


![](https://res2025.tiankonguse.com/images/2025/04/07/009.png) 



于是让 AI助手 帮忙修改端口号。  
魔法咒语：你能帮忙修改下端口号吗  


![](https://res2025.tiankonguse.com/images/2025/04/07/010.png) 


这次网站竟然全部打开了，也可以上传图片。  


![](https://res2025.tiankonguse.com/images/2025/04/07/012.png) 


上传一张图片，又报错了。  


![](https://res2025.tiankonguse.com/images/2025/04/07/011.png) 


之后回到首页，发现首页没有正确显示上传的图片。  
魔法咒语：首页图片显示 404  


![](https://res2025.tiankonguse.com/images/2025/04/07/013.png) 


修复后，首页就可以看到图片了。  


![](https://res2025.tiankonguse.com/images/2025/04/07/014.png) 


就这样，2 个小时就过去了，AI 编程助手终于跑起来了。  


不过 AI 编程助手只生成了简单的网站：上传图片、展示列表。  
要实现完整的目标功能，就需要继续引导 AI 编程助手继续生成相关代码。  
就这样，三四天过去了，我搭建好一个网站。  


期间由于 AI 编程助手每次交互都需要等好久， github copilot 和 cursor 我是同时使用的。  
使用下来，github copilot 最先满足我的诉求， 所以我就没有继续使用 cursor 了。  


中途 github copilot 遇到不少问题，我也尝试过使用 cursor 的 Copilot editor 功能。  
但是由于 cursor 没用一会就提示触发了限流要求升级， 于是我就放弃 cursor 了。  


运动时，我思考该如何提高效率，一番分析得出结论升级为 copilot pro 效率是最高的 。  


做出这个决定是基于两个逻辑：  


1）速度：pro 的生成速度比免费快很多，  
2）准确率：pro 可以使用 claude 3.7 sonnet，可能上下文更大的缘故，生成的代码更准确。  


于是我开启了一个月的 copilot pro。  


## 二、相关问题 


在这期间，我遇到不少 copilot 的问题，这里我就简单总结下。  



问题1：DB 字段、接口字段、接口字段总是对不齐。  


具体表现是项目大了后，DB表字段生成后，接口会用另外一个字段去写DB，前端又会使用其他字段名去取值。  


解决方案：简单理解就是分层，每一层都要有一个文档，描述清楚每一层的功能。  


1）让 copilot 生成一个DB 表结构文档，当需要新增或调整后端接口与DB的交互时，让 copilot 根据这个文档去生成代码。  
2）让 copilot 生成详细的接口文档，包含接口每个入参与返回的说明，以及样例。前段调用后端接口时，需要参考后台接口文档。  
3) 前端、后端、DB 每一层也有分模块，也需要生成相应的文档。  


问题2：前端代码复用的坑。  


做两个页面时，用到相同功能，于是我引导 copilot 可以服用代码。  
在随后加功能时，前段样式就总是不符合预期，我和 copilot 拉扯了一个小时，都没有解决。  
最后只好自己去分析原因，然后告诉 copilot 为啥前端样式不符合预期，之后 copilot 才能解决。  


解决方案：前端每个页面使用不同的样式文件，避免样式冲突。  


问题3：一个对话随着对话速度越来越慢。  


不知道 github copilot 是不是每次还是把整个上下文传给模型，一个 agent 对话时间长了，速度就越来越慢。  


解决方案：单独的功能，来一个新的 agent 对话。  


问题4：agent 默认没有项目上下文，导致功能被重新实现。  


这个在开新 agent 窗口时，有时候会忘记加入项目 codebase。  
此时，agent 只会根据输入的要求重新实现对应的功能，而不是在原有的基础上进行修改。  


解决方案：每次开新 agent 窗口时，引用一次项目 codebase。  


问题5：谨慎全局重构。  


基本功能都符合预期后，我让 copilot 对整个项目进行重构。  
结果重构后是进行模块化了，但是相关功能都丢失了，对应的函数上都是注释 xxx 功能，代码没有重构过来。  


解决方案：每次仅限一个功能进行重构，明确说清楚不要修改其他功能。  



![](https://res2025.tiankonguse.com/images/2025/04/07/015.png) 


问题7：图片路径问题。  


一开始我没有对图片路径提出要求，copilot 生成的图片路径不统一，有些是相对路径，有些是绝对路径。  
随着项目的变大，经常发现图片 404 问题。  


解决方案：图片统一使用项目的绝对路径。  


问题8：支持一个功能时影响另外一个功能。  


随着项目的变大，发现 copilot 越来越笨拙，总是不能满足诉求。  
思考了一番，觉得还是项目太大了，上下文太多，导致 copilot 容易自由发挥，导致不符合预期。  


解决方案：架构设计、分层分模块，确定目标，拆分为一个个小的子功能，一个个实现。  



![](https://res2025.tiankonguse.com/images/2025/04/07/016.png) 



问题9：小问题 agent 模式太慢。  


由于 agent 太慢，在回答问题过程中，我把代码浏览了好几遍。  
对于大多数问题，我看到问题就大概知道原因在哪，一般只需要修改几行代码就可以了。  
但是，agent 会根据问题去猜测哪里出问题了，分析很多项目文件。   
最终结果可能是只需要修改一个文件的几行代码，，但 agent 也会编辑整个文件，生成速度非常慢。  


这时候突然发现，可以使用 inline Chat 功能会更简洁高效，选中对应的代码块，指出问题，瞬间就可以生成预期的代码了。  



问题10：agent 会遗漏功能。  


新加一个功能，涉及到前端、接口、DB。  
agent 经常只是修改前端就行了，即使有时新增了接口，也没有修改 DB。  


解决方案：明确告诉 agent 检查下相关模块。  



![](https://res2025.tiankonguse.com/images/2025/04/07/017.png) 


问题10：agent 经常误删功能。  


解决方案：定时备份，提交 git。  


![](https://res2025.tiankonguse.com/images/2025/04/07/018.png) 



## 三、总结


由于 agent 速度很慢，清明假期的4天里，我几乎全天都在使用 GitHub Copilot。  
每天早上，我会先给 Copilot 分配一个复杂的任务，然后去上厕所、洗漱。  
等回来后，查看 Copilot 生成的代码修改，调试通过后继续下一个任务。  
接着，我再给 Copilot 一个复杂的任务，然后趁机去买早餐。  
吃完早餐后，我开始大量使用 Copilot，但不到一个小时就触发了频控。  
作为尊贵的 Pro 月卡用户，居然还会触发频控，实在不可思议。  


![](https://res2025.tiankonguse.com/images/2025/04/07/019.png) 



好在清明假期只有第一天我有整天的时间，接下来的几天白天都在外面，只有晚上能抽出一两个小时来继续做这个系统。  


在整个过程中，我一直在思考如何提高 Copilot 的准确性。  
通过不断的猜想和验证，我发现 AI 辅助编程确实能显著提升效率。  


完成这个项目后，我对 Copilot 的看法如下：  


1）对于复杂的项目，Copilot 仍然无法完全胜任，仍需要有技术背景的人员参与。  
2）在 Copilot 的辅助下，人人都可以像全栈工程师一样完成一个产品。  
3）如果开发人员能够熟练使用 Copilot，效率确实可以翻倍，甚至提升数倍。  


基于以上经验，我打算每周末使用 Copilot 做一个小项目。  
这个月先使用 Copilot Pro，下个月再试用 Cursor Pro，最终决定选择哪个产品作为长期工具。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  