---   
layout:     post  
title:  【抽奖】开始使用 vscode 了
description: 我开始从 vim IDE 专项 vscode 了。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2019-11-04 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  



## 一、背景  

上篇文章《[9个命令入门操作 docker](https://mp.weixin.qq.com/s/CK2XFRgOQeiJXL7JAQBc3w)》介绍，开发环境切换到了 docker 里面。  
然后开发的时候，就面临一个问题：docker 内的 vim 版本很低，依赖的很多软件都没有。  


认识我的人都知道，我是一个 c++/python 开发者，c++ 使用 Eclipse IDE 开发， python 使用 notepad++。  


大概一年前的时候，我转型到 vim IDE了，现在也比较熟悉了。  


可是现在， docker 内的 vim 没法使用了。  
重新搭建一套 vim 环境当然没问题，但是后面 docker 死了的话，就可能需要重新搭建环境了。  


看看参与项目的文档，建议的是使用 vscode 远程到 linux docker 内来开发 。  


于是，我打算今天起，转型到 VScode IDE。  
那第一件事就是搭建环境了。  


## 二、VScode  简介


大概今年（2019）年中 五月份的时候，vscode 发布了最新版本，宣称支持全新的远程开发模式。  


据说 vscode 远程开发和本地开发体验完全一致，没有延迟、不需要同步代码、支持语法分析、依赖远程环境来进行智能代码提示语补全等等。  


![](http://res2019.tiankonguse.com/images/2019/11/04/001.png)  


当时的时候，我和另外一个同事都搭建了环境，后来不知什么原因，我们又迁回了 vim。  
之前有过一次经验，这次操作就快多了。  


## 三、安装配置  


第一步，Linux 服务端 修改 ssh 配置，重启 sshd。  


```
vim /etc/ssh/sshd_config
AllowTcpForwarding yes
vim /etc/ssh/sshd_config.l
AllowTcpForwarding yes
```


第二步，下载 vscode  windows 版本。  


地址： https://code.visualstudio.com/  


第三步：安装 windows 的 ssh client  


一般是通过安装 git 来安装 ssh client的。  
然后配置环境变量 `C:\Program Files\Git\usr\bin` 到 PATH 中。  
地址： https://git-scm.com/download/win  


第四步：安装 vscode 远程插件  


搜索并安装 remote-ssh插件 ，安装后修改下该插件的设置，允许 ssh 访问。  


![](http://res2019.tiankonguse.com/images/2019/11/04/002.png)  


第五步：添加远程机器信息  


![](http://res2019.tiankonguse.com/images/2019/11/04/003.png)  


![](http://res2019.tiankonguse.com/images/2019/11/04/004.png)  


按上图配置好，直接保存，如下图操作，按提示输入几次登录密码，就连上远端机了。  


第一次登录上，远端机器会做一些环境安装，等一会会提示 `Please do not close this terminal` 就代表成功了。  


第六步：安装插件到远端开发机  


直接在扩展这里安装插件，可以选择将插件安装到远端。  


![](http://res2019.tiankonguse.com/images/2019/11/04/005.png)  


## 四、插件安装失败  

安装 c++ 插件的时候，我这边报错，大概提示可能网络或者防火墙的缘故，下载失败了。  
建议我离线安装。  


```
 If you are working on a computer that does not have access to the Internet or is behind a strict firewall, you may need to use our platform-specific packages and install them by running VS Code's "Install from VSIX..." command. These "offline' packages are available at: https://github.com/Microsoft/vscode-cpptools/releases.
```


于是我去 vscode c++ 插件官网下载离线插件，，在搜索框搜索`Install from VSIX`，选择离线包即可安装。  


下载地址：https://github.com/Microsoft/vscode-cpptools/releases   


## 五、最后  

经过这一系列安装配置，我的 vscode 终于可以使用了。  


未来一段时间就是熟悉快捷键，不要刚玩熟了，微软就开始对 vscode 收费那就不好玩了。  


----


这两天我已经在樊登读书上读了7本书了，樊登读书送我我三张VIP赠送卡。  
当时看说明的时候，说可以送给自己，真实使用的时候发现只能给别人使用，自己使用不了。  


所以这里决定发起抽奖，将这个VIP赠送卡当做福利分享给公众号的朋友们。  


三张卡大概分三种形式赠送。  


第一张，我会在留言点赞最高的前三名中选择一个来赠送，选择标准不透漏。  


第二张，我发起了抽奖，大家可以参与抽奖。  


![](http://res2019.tiankonguse.com/images/2019/11/04/006.png)  


第三张，我送给朋友圈的朋友吧。  



-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

