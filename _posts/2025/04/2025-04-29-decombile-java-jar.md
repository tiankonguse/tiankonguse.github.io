---
layout: post  
title: 使用 JD-GUI 轻松反编译jar包         
description: 反编译后才能做出下一步决策。  
keywords: 项目实践 
tags: [项目实践]  
categories: [程序人生]  
updateDate: 2025-04-27 12:13:00
published: true  
---

## 一、背景


之前提到，团队内有一个 scala 语言编写的 spark 大数据任务，这么多年来都处于无人维护状态。  
这个任务每小时跑一次，经常被投诉任务失败或者超时，所以我就打算找个人把这个任务重构一下，从而能够维护起来，并修复任务超时的问题。  


在《[AI 2分钟生成项目文档与自动解决编译问题](https://mp.weixin.qq.com/s/9ItaV3qfEhz5AVFkHyFeyA)》中提到，项目评审时我发现优化方案里没有介绍这个任务的实现逻辑。  
所以我使用 AI 几分钟就生成了项目的逻辑、流程图、时序图、架构图等。  


项目评审前，我提到如果是重构服务，需要有方案来保障数据的正确性，即需要对比新旧服务的数据是否一致。  


后来，我在《[学习spark原理，任务性能提升13倍](https://mp.weixin.qq.com/s/dHGtNtsW5X2bNCL35BZd6Q)》提到代码编译通过后就上线了。  


这里面就有一个 gap: 为何项目评审时要求对比数据的一致性，后面却直接编译上线了呢？  


## 二、背后的逻辑  


项目评审前，我也没看这个任务的代码，当时做了三个最坏的打算。  


1）交接只有一个程序压缩包，没有git地址，大概率代码是编译不过的。  
2）任务逻辑应该很复杂，代码编译不过，只能进行重构，无法保障新旧任务的数据一致性。  
3）任务超时的根因可能是数据量太大，重构不一定解决问题，需要改成增量才行，这样对比数据的一致性就更有必要了。  


基于这些猜测，我要求必须进行数据一致性对比。  


但是项目评审时，我临时使用 AI 生成文档，发现代码逻辑好简单，只有三步步骤。  


步骤1：读 hbase。  
步骤2：hbase 的列式数据转化为表格数据。  
步骤3：表格数据写入到 hive 表。  


评审后，还得知一个消息：现有的代码不需要修改，配置下 pom.xml 就可以编译通过了。  


有了这两个信息，前两个猜测都不成立了，只剩下任务超时这一个因素了。  


周五确定只需要调整 hbase 分区就可以解决问题，周六确定先调整分区时，我心中只剩下一个顾虑：如何保障线上的代码与交接的代码是一致的。  


为此，我大模型有啥方法可以查看 jar 包的源代码。  
大模型给我推荐了 JD-GUI 反编译工具。  


我通过 JD-GUI 反编译工具查看了 jar 包的源代码，发现线上的代码与交接的代码是一致的。  


因此我才允许直接将编译后的代码发布上线的。  


## 三、安装 JD-GUI

JD-GUI is a standalone graphical utility that displays Java source codes of ".class" files.  
JD-GUI 是一款独立的图形化实用程序，可显示“.class”文件的 Java 源代码。  



下载地址：https://java-decompiler.github.io/  
源码： https://github.com/java-decompiler/jd-gui  



我是 Mac 电脑，本来已经搭建了 java 环境的，但是鼠标右键打开运行，提示没有 java 环境。  


报错显示如下：  


```
ERROR launching 'JD-GUI'

No suitable Java version found on your system!
This program requires Java 1.8+
Make sure you install the required Java version.
```


我折腾了好久的，最后网上一搜，发现源码的 issue 里有人提到，需要使用命令行启动。  


解决方案: try open it in terminal like : open /Applications/JD-GUI.app  
参考: https://github.com/java-decompiler/jd-gui/issues/391  


## 四、使用 JD-GUI  


打开后，可以点击目录图标选择 jar 包，或者直接拖拽 jar 包到 JD-GUI 窗口中。  


![](https://res2025.tiankonguse.com/images/2025/04/29/002.png)   



打开后，根据我们的包路径，可以看到源码，还是比较清晰的。  


![](https://res2025.tiankonguse.com/images/2025/04/29/001.png)  



对比源码与 jar 包的代码，发现只有 2 个区别。  


1）scala 语法转化为 java 语法了。  
2）所有的名字都扩展添加了完整的包前缀。   


![](https://res2025.tiankonguse.com/images/2025/04/29/004.png)  


![](https://res2025.tiankonguse.com/images/2025/04/29/003.png)  


业务核心代码也一样,都可以阅读清楚，只是代码包前缀都展开了，可读性变得很差。  


![](https://res2025.tiankonguse.com/images/2025/04/29/005.png)  


## 五、确保代码一致  


jar 包是反编译了，初步浏览了一遍反编译的代码，核心逻辑代码确实都是一致的。  
但是我该如何保证这个代码就是和交接的源码是一模一样的呢？  


反编译的代码是没办法与交接的代码直接进行比较。  
不过我可以把交接的代码也编译成 jar 包，然后使用 JD-GUI 反编译。  
这样就可以逐行对比反编译的代码与交接的源码，确保它们的一致性。  


通过对比，发现只有2行配置相关的代码顺序不一致，而配置的值都是一样的。  
这样，就确实可以证明，线上的代码与交接的代码是一致的。  



![](https://res2025.tiankonguse.com/images/2025/04/29/006.png)  



## 六、最后  


JD-GUI 反编译工具太强大了，jar 包反编译的代码竟然和源代码几乎一致，强烈推荐给大家。  




《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  