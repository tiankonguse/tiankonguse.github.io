---
layout: post
title: 微信支持 OpenClaw 了，一分钟完成接入
description: 一分钟完成接入。
keywords: 项目实践
tags: [项目实践]
categories: [程序人生]
updateDate: 2026-03-22 12:13:00
published: true
---


今天看到消息微信支持接入 OpenClaw 了，于是第一时间体验了一下，接入真方便。  


首先手机升级微信到最新版本。  


然后在手机微信上点击"我的 -> 设置 -> 插件"，就可以看到微信 ClawBot 了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/001.png)


点击详情，就可以看到安装命令。  


```bash
npx -y @tencent-weixin/openclaw-weixin-cli@latest install
```

![截图](https://res2026.tiankonguse.com/images/2026/03/22/002.png)


在已经安装 OpenClaw 的电脑上运行这条命令，等十几秒就会显示一个二维码。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/003.png)


用手机微信扫描二维码，进行确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/005.png)


再等待几秒，就会提示接入成功了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/004.png)


接入成功后，我们就可以在微信上进行对话了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/007.png)


例如问当前系统负载情况。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/006.png)


例如记录一个笔记。  


![截图](https://res2026.tiankonguse.com/images/2026/03/22/008.png)


之前飞书和 QQ 也支持接入 OpenClaw，但使用频率非常低，还是微信用着方便一些。  
微信支持 OpenClaw 后，飞书和 QQ 就可以卸载了。  




《完》


-EOF-

本文公众号：天空的代码世界
个人微信号：tiankonguse
公众号ID：tiankonguse-code
