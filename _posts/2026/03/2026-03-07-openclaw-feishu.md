---
layout: post
title: 10分钟免费搭建 OpenClaw 教程，飞书随时指导 AI干活
description: 想免费体验 OpenClaw 的朋友可以试试。
keywords: 项目实践
tags: [项目实践]
categories: [程序人生]
updateDate: 2026-03-07 12:13:00
published: true
---

## 一、背景


很多人都想体验下 OpenClaw，但是又不想花钱购买。  
我研究了下，发现确实可以免费搭建 OpenClaw，这里写一个详细的教程分享给大家。  


## 二、流程分析


想要搭建 OpenClaw，至少需要四个步骤：  


第一，需要一个电脑，比如前段时间被疯狂抢购的 mac mini。  
第二，需要一个大模型，比如 GPT 系列、gemini 系列、Claude 系列。  
第三，需要一个飞书账号。  
第四，安装 OpenClaw，打通大模型与飞书。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/001.png)


分析一下，之所以大家要买 Mac mini，是因为都说 OpenClaw 在个人电脑上不安全。  
但是现在，OpenClaw 已经加了很多安全措施，对于普通人使用个人电脑来体验一下变得可以接受了。  


另一个问题是需要购买大模型。  
其实体验的时候并不需要上来就使用 GPT/gemini/Claude 系列。  
可以先使用国内的大模型，注册账号一般会赠送非常多的免费 tokens。  


飞书账号可以不需要收费，只需要注册一个账号即可。  


三个依赖都准备好了，就可以开始安装 OpenClaw 了。  


## 三、免费的大模型


这里我使用的是 minimax 平台。  
新注册用户送 100万 tokens，足够使用。  


下面是我的邀请码，使用这个链接来注册，还会再赠送 100万 tokens。  


注册之后需要进行实名认证。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/002.png)


这里我们选择个人实名认证，并选择设备扫脸认证。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/003.png)


点击设备扫脸认证，会需要先填写姓名和身份证号。  
不要害怕，点击下一步后，你会发现实际是使用支付宝来扫脸认证的。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/004.png)


弹出支付宝的认证二维码后，支付宝进行扫描，然后按流程操作即可。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/005.png)


支付宝完成认证后，可以看到浏览器上就显示认证完成。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/006.png)


此时看下我们的余额，已经有 15 块钱了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/007.png)


然后我们点击【接口秘钥】，创建新的 API Key，填写 key 的名字，点击创建秘钥。  
点击后会弹出一个框，把秘钥存到本地记事本中，方便后续使用。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/008.png)


## 四、飞书


你可以先手机下载飞书，使用手机号，注册一个账号。  


然后电脑打开飞书开放平台，登录飞书账号。  
地址：https://open.feishu.cn/app?lang=zh-CN  


然后点击开发者后台，创建企业自建应用，输入机器人的名字和描述，上传一个机器人的头像，最后点击创建。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/009.png)


机器人创建好了，先左侧导航点击凭证与基础信息，右侧可以看到 "App ID" 和 "App Secret" 两个参数，分别点击右侧 "复制" 按钮，将其保存到个人记事本中，方便后续使用。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/010.png)


## 五、安装 OpenCLaw


命令行一键安装 OpenCLaw：`curl -fsSL https://openclaw.bot/install.sh | bash`。  


由于 OpenClaw 依赖 Node22+,所以会自动升级 Node.js 到 22+，会比较慢。  
多等一会，就可以自动安装好了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/011.png)


## 六、配置大模型


自动安装好之后，可以看到 OpenClaw 自动启动了，但是需要确认，键盘按左箭头键，选择 Yes，回车确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/012.png)


接着 Onboarding mode 选择 QuickStart 默认，也是默认的选项，直接回车。  


接着，可以看到 Model/auth provider，也就是选择大模型。  
按向下箭头键，选择 MiniMax，回车确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/013.png)


鉴权方式选择 MiniMax M2.5 (CN)，回车确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/014.png)


接下来需要输入 API key 了，就是之前保存的很长的 API key，粘贴进去。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/015.png)


对于默认模型，可以保持不变为 minimax-cn/MiniMax-M2.5。  


这样大模型就配置完成了。  


## 七、配置飞书机器人


接下来就可以看到 channel 的配置，也就是 IM 通讯工具的配置了，选择飞书。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/016.png)


之后，选择默认下载飞书插件 `Download from npm (@openclaw/feishu)`，回车确认。  


等一会插件安装好之后，选择 Enter App Secret。  
注意，是先输入 App Secret，再输入 App ID 的。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/017.png)


接下来是飞书的三个配置。  
Feishu connection mode 选择 WebSocket (default)，回车确认。  
Feishu domain 选择 Feishu (feishu.cn) - China，回车确认。  
Group chat policy 选择第二个 Open - respond in all groups (requires mention)，回车确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/018.png)


就这样，飞书暂时就配置完成了。  


## 八、安装技能


技能可以先安装 clawhub 和 mcporter，使用空格来选择，回车确认。  
安装方式选择默认的 npm。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/019.png)


之后的 API_KEY 可以全部选择 No。  


对于 hooks，可以都选择。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/020.png)


## 九、启动


接下来可以看到启动方式，选择默认的 Hatch，回车确认。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/021.png)


看到启动界面后，我们可以说一句话，告诉 OpenClaw 它的名字是什么。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/022.png)


## 十、飞书长连接


飞书开放平台界面，左侧导航栏点击添加应用能力，找到机器人，点击添加。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/023.png)


安装 OpenClaw 的飞书插件时，如果你细心的话，会发现需要配置几个权限。  
Enable required permissions: im:message, im:chat, contact:user.base:readonly  


点击左侧导航的权限管理，开通权限，分别输入 im:message, im:chat, contact:user.base:readonly。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/028.png)


出现的权限都开通权限，右下角确认开通权限。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/029.png)


顶部其实一直可以看到一个提示"应用发布后，当前配置方可生效"。  
现在可以先发布一次。  


版本填写 1.0.0。  
更新说明随便填。  
最后点击最下方的保存。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/026.png)


不知道是不是飞书为了大家方便接入 OpenClaw，发布都是免审批的。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/027.png)


然后在左侧导航里点击事件与回调，在事件配置里，打开长连接订阅。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/024.png)


![截图](https://res2026.tiankonguse.com/images/2026/03/07/025.png)


长连接打开了，点击右下角的添加事件，消息与群组里找到接收消息，勾选确认添加。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/031.png)


回调配置里也一样，开启长连接接收回调。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/030.png)


然后再按上面的流程发布一次。  


## 十一、手机使用飞书


手机飞书搜索我们的机器人名字，比如我的是 牛马。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/032.png)


对话随便说一句话，可以收到一个认证信息。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/033.png)


把最后的 `openclaw pairing approve feishu 9RH8VYPL` 复制出来。  
然后在 OpenClaw 里运行 `!openclaw pairing approve feishu 9RH8VYPL`。  


`!` 的意思是运行命令。  
OpenClaw 让我们授权运行这个命令，输入 Yes，然后就可以看到飞书认证成功了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/034.png)


这样就可以在飞书里远程控制 OpenClaw 这个牛马了。  


![截图](https://res2026.tiankonguse.com/images/2026/03/07/035.png)


## 十二、最后


OpenClaw 搭建好了，我们就可以给 OpenClaw 发送任务了。  


《完》


-EOF-

本文公众号：天空的代码世界
个人微信号：tiankonguse
公众号ID：tiankonguse-code
