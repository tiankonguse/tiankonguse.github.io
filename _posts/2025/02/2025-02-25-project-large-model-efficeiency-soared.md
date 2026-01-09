---
layout: post  
title: 云平台接入大模型，实战效率飞起  
description: 这样看来，我并不看好元宝、豆包、kimi等。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [AIGC]  
updateDate: 2025-02-25 12:13:00  
published: true  
---


## 零、背景  


最近利用大模型解决了一个实际问题，大模型大大提高了解决问题的消息。  


问题解决后，我意识到元宝、豆包、kimi等当前的模式没有未来的。  
当前大家因为临时兴趣，去使用这些产品，过段时间，就会时间，就会离开这些产品的。  
就像 ChatGPT，一开始很多人会问问题，一年后还去问问题的有多少人呢？  


我认为，未来必定是应用结合大模型让应用更强大高效，而不是大模型独立出一个应用。  


## 一、遇到问题  


最近攀岩馆的老板给我我发来一个消息：后台好像进不去了？？  


![](https://res2025.tiankonguse.com/images/2025/02/25/001.png) 


我问最近有动服务器吗？回答是没有。  


这就需要去分析下这个问题了。  


## 二、问题分析  


打开网站，尝试登录，弹窗”Error: Network Error“。  
打开开发者模式，发现登录接口报 CORS error 错误。  


这显然是由于跨域引起的，即网页域名和后台接口域名不同导致的。  


![](https://res2025.tiankonguse.com/images/2025/02/25/002.png) 


在文章《[为NC攀岩馆降本增效，降低成本70%](https://mp.weixin.qq.com/s/YRS3WSL1tUs85NKTgTpbHA)》中我提到，我 2024 年末帮攀岩馆老板进行了降本增效，简化了系统架构，还降低了成本。  


优化后的架构是域名直连后面的 nginx 系统，nginx 系统把流量转发给后台的 java 服务。  


所以，现在我们要做的配置下 nginx，支持两个域名的跨域请求。  


## 三、问题解决  



正常我应该是去 Google 搜索 nginx 配置文件在哪里，怎么修改支持跨域，怎么重启 nginx。  


而现在，我使用腾讯云登录服务器后，右上角有一个 OrcaTerm AI。  


![](https://res2025.tiankonguse.com/images/2025/02/25/003.png) 


点击打开，问 nginx 配置文件，就会详细的输出 nginx 的信息。  


![](https://res2025.tiankonguse.com/images/2025/02/25/004.png) 



甚至 AI 还告诉我一些注意事项。  


1）修改需要足够的权限，通常加 sudu。  
2）修改后务必进程测试再重启服务。  
3）修改前先备份配置文件。  


后两项的建议，属于项目经验，已经吊打职场 90% 的员工的经验了。  


![](https://res2025.tiankonguse.com/images/2025/02/25/005.png) 


接着问怎么修改配置支持域名，nginx 也详细的进行了回答。  


![](https://res2025.tiankonguse.com/images/2025/02/25/006.png) 


大模型 AI 不仅给出了详细的配置，还给出了每个配置参数的详细解释。  


1）Access-Control-Allow-Origin: 指定允许访问的域名，可以是具体的域名或 *（允许所有域名，但不推荐用于生产环境）。  
2）Access-Control-Allow-Methods: 指定允许的 HTTP 方法（如 GET, POST, OPTIONS）。  
3）Access-Control-Allow-Headers: 指定允许的请求头。  
4）Access-Control-Allow-Credentials: 指定是否允许携带凭证（如 cookies）。  
5）OPTIONS 请求处理：预检请求的处理，返回 204 No Content 状态码。  


![](https://res2025.tiankonguse.com/images/2025/02/25/007.png) 


修改完后，成功登录成功。  
不过又遇到了新的问题：后台接口提示请求没带 cookies 鉴权信息。  
于是接着问 AI，跨域怎么带 cookies信息。  


![](https://res2025.tiankonguse.com/images/2025/02/25/008.png) 


![](https://res2025.tiankonguse.com/images/2025/02/25/009.png) 



我问 AI 大模型，跨域请求一定要修改前端代码吗？  
AI 大模型回答是的，一定要设置 withCredentials 为 true。  


![](https://res2025.tiankonguse.com/images/2025/02/25/010.png) 



没办法，只好修改前端代码，加上这个了。  


把这个信息汇报给攀岩馆老板后，就去修改代码，最终修复问题。  


![](https://res2025.tiankonguse.com/images/2025/02/25/011.png) 


## 四、最后  


以前处理问题，是去搜索引擎或者 ChatGPT 问答，现在是边问大模型，边处理问题，不需要频繁切换窗口，效率直接起飞了。  


由此，我意识到元宝、豆包、kimi等这些产品没有未来的。  


大家日常使用某个应用，有问题需要使用大模型时，对应的应用肯定会提供相关的大模型快捷入口的，用户没有必要再切换 app 去其他地方反复粘贴复制问题与答案。  


总结下就是，大模型应该是给应用赋能提效的，而作为独立的产品存在时，就会因为缺乏根基而无法让大众用户留下来。  


当然，最终大模型应用也会留下来一些深度用户，这些用户贡献的利润无法让大模型活下去。  
大模型要活下去，最终还是要作为一个技术基座，供上层的业务使用。    





《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  