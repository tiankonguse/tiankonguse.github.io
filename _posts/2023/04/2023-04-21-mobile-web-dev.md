---   
layout:  post  
title: 移动端网页调试方法    
description: 快来试试。   
keywords: 生活  
tags: [生活]    
categories: [生活]  
updateData:  2023-04-21 18:13:00  
published: true  
---  


## 一、背景  


前天提到，修复了《[免费体验 chatGPT无法输入](https://mp.weixin.qq.com/s/vG7w3bCW0WhW8KLtzPe0dQ)》的BUG。  


这个 BUG 是电脑上没问题，手机上偶先。  


本来想通过 chrome 来的模拟器来模拟手机端的。  


结果发现 chrmoe 上没有复现这个问题。  


所以我就有一个诉求：需要一种方法能够调试手机网页。  


网上搜索，Android 与 iPhone 的调试方法还不一样。  


我的手机是 iPhone，电脑是 Mac ，所以我选择了 iPhone + Mac 的调试方法。  



## 二、iPhone Safari 配置  


打开 Setting, 选择 Safari App  


![](https://res2023.tiankonguse.com/images/2023/04/21/001.png)


下拉选择 Advanced  


![](https://res2023.tiankonguse.com/images/2023/04/21/002.png)


开启 Web Inspector  


![](https://res2023.tiankonguse.com/images/2023/04/21/003.png)



手机的 Safari APP 打开要调试的网站。  


![](https://res2023.tiankonguse.com/images/2023/04/21/004.png)


## 三、Mac Safari 配置  


打开 Safari App。  


![](https://res2023.tiankonguse.com/images/2023/04/21/005.png)



左上角点击 Safari，下拉菜单中选择 Setting。  


![](https://res2023.tiankonguse.com/images/2023/04/21/006.png)


弹窗里，点击 Advanced，勾选 Show Develop menu in menu bar。  


![](https://res2023.tiankonguse.com/images/2023/04/21/007.png)


## 四、调试


手机先使用 Safari 打开对应的网页。  


Mac 的 Safari 选择 Develop -> 手机名 -> 对应的网页。  


![](https://res2023.tiankonguse.com/images/2023/04/21/008.png)


电脑上从而可以看到类似于 Chrome 的开发者工具。  


![](https://res2023.tiankonguse.com/images/2023/04/21/009.png)


选择对应的 dom，手机上也会高亮显示出来。  


![](https://res2023.tiankonguse.com/images/2023/04/21/010.png)


就这样我检查了下 dom 的层级是否正确、dom 的样式是否正确、dom 的事件是否正确。  


最终找到原因：整个页面都不能点击了。事件全部到达 html dom 就截止了。  


我的解决方案也很简单：当发现事件在 html 上时，就假设用户点击输入框了，触发一下输入框的点击事件，后续的点击就都恢复了。  


## 四、最后  


你有做过移动端前端调试吗？  
你都是怎么调试的？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

