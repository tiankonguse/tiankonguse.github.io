---   
layout:     post  
title:  制作了电子书《从零开始学算法》
description: 之前写过从零开始学算法这个系列，现在只做为电子书送给了。  
keywords: 程序人生  
tags: [程序人生]  
categories: [程序人生]  
updateData:  2019-07-12 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 一、背景  


如果你关注我超过半年，并经常看我的文章的话，就知道我之前写过很多系列的文章。  
那些系列文章算是我的个人知识沉淀总结。  


个人掌握的知识总是会迭代更新的。  
即使是同一个知识，随着认识的越来越长久，理解也会完全不一样的。  


但是文章作为知识的载体，就会有一个很大的问题：文章写完后就很少修改了。  
这样，多年后，这篇文章的内容只能代表多年前你对这个知识的认知，而不能代表现在的。  


所以我计划换一种形式来记录这些系列知识。  
是的，你猜对了，那就是整理成小册子，电子书。  


这样后面可以随时修复错别字，调整逻辑不顺的地方，甚至新增一些最新的思考。  
自此，这个知识体系就变的活了，可以持续不断的刷新。  


## 二、工具选择  


对于专业人士，制作电子书，首选是 Tex 了。  


如果你下载过我的 ACM模板 的话，会发现这个模板很特别。  
是的，我的那个模板就是使用 Tex 制作的。  
大学的时候我经常玩 Tex，毕业论文也是用 Tex 制作的，记得当时我还制作了一个 Tex 论文模板。  


但是， Tex 是面向专业人士的，我四五年为接触了，已经没有动力去折腾了。  
所以我放弃了 Tex，而是选择面向大众的 GitBook 来制作电子书。  


## 三、安装 gitbook  


GitBook 是一个机遇 Node.js 的命令行工具。  
所以使用 GitBook 之前，我们需要搭建 Node.js 环境。  


Node.js 官网有对应的下载地址，对于 Windows 来说就是一个软件，双击下一步到底即安装完成。  
之后就可以使用 Nodejs 的 `npm`命令来安装 gitbook 了。  


```
$ node -v
v7.7.1

$npm install gitbook-cli -g

$ gitbook -V
CLI version: 2.3.2
GitBook version: 3.2.3
```


## 四、制作电子书  


gitbook 常用的有两个命令：`gitbook init`和`gitbook serve`。  


init 命令用来创建一个电子书项目。  
会生成 README.md 和 SUMMARY.md 两个文件。  
其中 README.md 是书籍的介绍，SUMMARY.md 是书籍的目录索引。  


目录结构如下：  


![](//res2019.tiankonguse.com/images/2019/07/12/001.png)


之后，我们就是写书了，使用 markdown 的语法编写各个章节的文字。  


最后执行 `gitbook serve` 就可以生成一个 html 小网站。  


大家可以访问这个地址体验： http://lafz.tiankonguse.com/  



## 六、制作 PDF  


制作 PDF 需要安装另外一个 Nodejs 模块。  


安装命令：  


```
npm install gitbook-pdf -g
```


安装后执行`gitbook pdf`即可生成`book.pdf`的文件。  


当然，第一次你会遇到`EbookError: Error during ebook generation: 'ebook-convert'`的错误。  
这是因为依赖的另外一个命令不存在，大家搜索 calibre 安装即可。  


## 七、最后  


电子书效果如下。  


![](//res2019.tiankonguse.com/images/2019/07/12/002.png)


世上没有免费的午餐，所以这本书准备收费了。  


第一版处于初稿，价格你们根据自己的评估来支付吧。  
支付方式：文章底部的赞赏。  
支付后我有一次回复你消息的机会，会把电子书发给你。  


-EOF-  

