---
layout: post
title: OpenClaw 安装后，几句话完成视频草稿制作
description: docker 中搭建了 OpenClaw，并帮我生成了视频的草稿，太强大了。
keywords: 项目实践
tags: [项目实践]
categories: [程序人生]
updateDate: 2026-03-04 12:13:00
published: true
---


![截图](https://res2026.tiankonguse.com/images/2026/03/04/000.png)

## 一、背景

最近准备做一个《攀岩人在家训练指力板》的视频。  


由于没有提前准备草稿，录制视频过程中变得语无伦次。  
当时想着先把整个流程走一遍，之后再根据这个视频内容来完善草稿。  
所以我还是坚持录完了一个完整的视频。  


初稿视频有了，接下来的问题是：怎么提取出视频中的语音文字，然后根据我的规划来生成最终的视频草稿呢？  


我突然想到，最近 OpenClaw 很火，可以在本地搭建一个 OpenClaw，让它来提取视频中的语音文字，再结合我的规划来生成最终的视频草稿。  


## 二、安装 OpenClaw


安装 OpenClaw 前，我已经了解到，直接在个人电脑上安装 OpenClaw 非常不安全。  
因为 OpenClaw 拥有很高的权限（可以操作文件、执行 Shell），有可能直接把电脑上的文件给删除了。  


所以，我决定在 Docker 中安装与使用 OpenClaw，从而起到很好的隔离保护作用。  


**第一步：安装 Docker**  


Windows 系统用户，可以直接去 Docker 官网下载 Docker Desktop。  
下载地址：https://docs.docker.com/get-started/introduction/get-docker-desktop/  


Mac 系统用户，可以使用命令行来一键安装 Docker。  
安装命令：`brew install --cask docker`  


**第二步：创建 Linux 容器**  


先在电脑上创建一个 `openclaw_data` 目录，用来存放容器里 OpenClaw 的数据。  
然后创建一个 Ubuntu Linux 容器，提前映射 `openclaw gateway` 端口。  


```bash
podman run -it -d \
  --name my-openclaw \
  -p 18789:18789 \
  --add-host=host.containers.internal:host-gateway \
  -v ~/openclaw_data:/root/.openclaw \
  ubuntu:24.04
```

进入容器：`podman exec -it my-openclaw /bin/bash`  


**第三步：安装 Node.js**  


```bash
# 安装 Node.js 22 (OpenClaw 推荐版本)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# 验证版本
node -v  # 应显示 v22.x.x
```


**第四步：安装 OpenClaw**  


```bash
# 安装 OpenClaw CLI
npm install -g openclaw@latest

# 运行配置向导
openclaw onboard --install-daemon
```

OpenClaw 的配置比较长，按引导逐步选择自己购买的 LLM 与 API KEY 即可。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/003.png)


**第五步：启动 OpenClaw**  


需要先启动 Gateway，再启动 Node。  


```bash
nohup openclaw gateway run --bind lan --port 18789 > /root/gateway.log 2>&1 &
nohup openclaw node run > /root/node.log 2>&1 &
```


**第六步：认证 Gateway**  


电脑浏览器打开 `http://127.0.0.1:18789/`，会发现页面虽然打开了，但有一个红色的提示，大概如下：  


Gateway: local · ws://127.0.0.1:18789 (local loopback) · unreachable (connect failed: connect ECONNREFUSED 127.0.0.1:18789)  


这是因为 OpenClaw Gateway 有安全设置，需要先手动认证客户端。  


在容器内输入 `openclaw devices list` 命令，可以查看到待认证的客户端列表。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/001.png)


然后使用 `openclaw devices approve <device_id>` 来通过认证。  


最后，刷新浏览器页面，会看到页面正常打开了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/002.png)


## 三、项目实践


安装完成后，就可以开始使用 OpenClaw 了。  


我告诉 OpenClaw 自己的第一个诉求：我使用苹果手机录了几个视频，想使用开源工具提取出视频里的语音，并转化为文字。  


OpenClaw 给出了三个方案：  


方案一：Whisper。  
OpenAI Whisper 是目前效果最好的开源语音识别工具，支持中文，且可以免费本地运行。  


方案二：ffmpeg + 百度/讯飞 API。  


方案三：whisper.cpp（无 Python 环境推荐）。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/004.png)


由于我的电脑是 M3 芯片，选择方案一是最优的，所以我选择了方案一。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/005.png)


考虑到 Python 依赖比较复杂，我引导 OpenClaw 使用虚拟环境来运行代码，并选择最大的模型，先输出一份文档看看效果。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/006.png)


最后，我告诉 OpenClaw 视频在 videos 目录中，可以编写代码、下载模型、运行任务。  
OpenClaw 很聪明地先自动运行了一个视频，让我检查结果是否符合预期。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/007.png)


确认效果没问题后，我让 OpenClaw 更新文档。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/008.png)


差不多到午休时间了，我让 OpenClaw 把剩余的任务都跑了，然后我就去睡觉了。  
午休起来，发现全部跑完了，耗时 26 分钟。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/009.png)


初版视频的语音文字全部提取出来了。  
我把规划的大纲也告诉 OpenClaw，让它结合大纲和提取的语音文字，输出最终的视频草稿。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/010.png)


下面是最终效果，左边是我提前写的大纲，右边是 OpenClaw 输出的视频草稿，质量非常高。  


![截图](https://res2026.tiankonguse.com/images/2026/03/04/011.png)


## 四、复盘


回顾整个过程，我只提供了大纲和混乱的初版视频，全程没有写一行代码，只用了六七轮对话，就完成了整个项目。  
OpenClaw 太强大了。  


《完》


-EOF-

本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code
