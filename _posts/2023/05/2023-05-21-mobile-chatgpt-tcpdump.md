---   
layout:  post  
title: 移动端 ChatGPT App 抓包分析    
description: 移动端抓包后，ChatGPT App 马上就会开始大面积封杀 IP 了吧。          
keywords: 生活  
tags: [生活]    
categories: [生活]  
updateDate:  2023-05-21 18:13:00  
published: true  
---  


## 零、背景  


之前我在《[iPhone 上体验 chatGPT app](https://mp.weixin.qq.com/s/fKMrd81bYuD_46xHe8MyoQ)》，并在留言里预测：ChatGPT App 马上就会开始大面积封杀 IP 了。  


为啥这样说呢？  


因为 ChatGPT App 通信使用的是 Http 协议明文，大家可以直接在移动端抓包分析协议，从而进行破解。  


破解之后，chatGPT app 自然就会进行对抗，自然就是大量的封杀 IP 了。  


那移动端该怎么抓包呢？  


这篇文章简单分析一下原理。  


## 一、原理  


正常的 Http 通信是下面的样子。  


```
-> chatGPT app (http)
-> chatGPT web server (http)
```


不过现在是 2023 年了，大部分通信即使是 Http ，也都会开启 Https 的。  


```
-> chatGPT app (https)
-> chatGPT web server (https)
```


抓包一般是在电脑上进行的，所以需要写一个代理服务，支持流量转发。  


```
-> chatGPT app (https)
-> you proxy(纯转发)
-> chatGPT web server (https)
```


虽然加了代理，流量经过电脑了。  
但是我们无法看到 https 协议内的数据，因为数据被加密了，我们无法解密。  


怎么办呢？  
我们自己生成一个 SSL 证书，强制让 chatGPT app 信任我们的证书。  
这样我们的代理服务器就可以对数据解密了。  


```
-> chatGPT app (https+私有证书)
-> you proxy(私有证书解密)
-> you proxy(查看数据)
-> you proxy(正常证书加密)
-> you proxy(转发)
-> chatGPT web server (https)
```

## 二、实践  


http 协议一般用来 UI 来读写数据，属于前端的范畴。  
所以移动端抓包一般也都称为前端抓包工具。  


这类的抓包工具很多，我们随便找一个即可，大致步骤如下。   


0）手机和电脑处于同一个网络环境  
1）安装前端抓包代理工具
2）开启 proxy 代理服务。  
3）生成移动端证书，手机安装并信任证书。  
4）手机 WIFI 配置代理的服务器和端口。  
5）抓包工具录制流量  
6）移动端使用 APP。  
7）抓包工具查看抓到的数据。  


抓包之后，可以发现：  


移动端的域名是 ios.chat.openai.com  
背后的服务商依旧是 cloudflare  
移动端与WEB的部署是完全隔离的。  


![](https://res2023.tiankonguse.com/images/2023/05/21/000.png)


还可以发现，chatGPT 支持两个 model。  
一个是 text-davinci-002-render-sha-mobile，一个是 text-davinci-002-render-sha。  
移动端的 GPT-3.5 指向了 text-davinci-002-render-sha-mobile。  


![](https://res2023.tiankonguse.com/images/2023/05/21/001.png)


手机上我问一句英文的问题。  
PS：英文的抓包容易做区分，中文的话，全是编码后的数据，可读性就比较差了。  


![](https://res2023.tiankonguse.com/images/2023/05/21/002.png)


抓包可以看到对应的请求与返回。  
还是再熟悉不过的 event-stream http 包。  

![](https://res2023.tiankonguse.com/images/2023/05/21/003.png)


就这样，我们就轻松分析出 chatGPT app 的通信协议了。   


## 三、最后  


对于移动端的通信， chatGPT 其实可以对通信内容简单加密一下。  
随便加密一下，就很难被破解了。  


你怎么看这个？  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

