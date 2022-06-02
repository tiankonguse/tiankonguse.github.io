---   
layout: post  
title: tcmalloc 源码编译到放弃，malloc 库也在内卷        
description: 不知道为啥 google 的 tcmalloc 为啥这么难用。  
keywords: 程序人生  
tags: [程序人生]  
categories: [程序人生]  
updateData: 2022-06-02 18:13:00  
published: true  
---  


## 一、背景  


最近在做性能优化，已经通过框架参数调优、protobuf 开启 arena，至少提升了 100% 的性能了。  


这周开始，尝试使用 temalloc 与 jemalloc 来优化，看分别能提升多少性能，然后选择最优的那个。  


实施过程中，没想到 tcmalloc 这个项目竟然这么难用，浪费了非常多时间，最终放弃这个项目。  



## 二、jemalloc 编译三部曲


jemalloc 官方源码在 github 上。  
源码地址 https://github.com/jemalloc/jemalloc  


源码打开后，会发现 jemalloc 非常低调。  
readme 只有简单几句话，然后会引导你查看 INSTALL 文件。  
地址： https://github.com/jemalloc/jemalloc/blob/dev/INSTALL.md  


打开 INSTALL 后，就可以看到编译三部曲了。  


```
./autogen.sh
./configure --prefix=xxxx
make
make install
```


之后就可以在安装路径里找到 jemalloc 的 so 了。  


把 so 上传到压测服务目录，指定 jemalloc 的路径即可。  


```
export LD_PRELOAD=xxx/lib/libjemalloc.so.2 
```


压测分析，引入 jemalloc ，性能提升大概在 30%~35% 之间。  


## 三、 tcmalloc 编译到放弃  


tcmalloc 的源码也在 github 上。  
地址：https://github.com/google/tcmalloc  


tcmalloc 的宣传做的很好，做了很多子页面来让我们了解 tcmalloc。  



![](https://res2022.tiankonguse.com/images/2022/06/02/001.png) 


平台引导页面：介绍支持哪些平台。  
Quickstart 页面：介绍下载、安装、编译、测试等文档。  
Overview 页面：介绍 TCMalloc 的基本架构，以及配置的作用以及如何选择。  
Reference 页面：介绍 c 和 CPP 的 TCMalloc API。  
Tuning Guide 页面：配置的深入介绍，以及操作系统级别的优化介绍。  
Design Doc 页面：TCMalloc 的设计文档。  
Compatibility Guide 页面：使用注意实现，即那些可以做，那些不能做。  


我们最关注的就是 Quickstart 了。  


点击 [TCMalloc Quickstart](https://github.com/google/tcmalloc/blob/master/docs/quickstart.md) 可以看到编译命令。  


可是我们敲入 `bazel test //tcmalloc/...` 编译时，报错了。  
提示 ` no such attribute 'env' in 'cc_test' rule`。  



在 tcmalloc 的 issues 中可以找到答案。   
原因是 tcmalloc 依赖 Bazel 4 以上的版本。   
地址：https://bytemeta.vip/repo/google/tcmalloc/issues/79  


此时，我首先想到的是找一个低版本 tcmalloc 来编译。  
结果发现 tcmalloc 没有任何 tag ，也没有任何 release。  
tcmalloc 只有一个 master，不对外提供任何老的版本。  



于是，我只好去升级 bazel 了。  


bazel 的官方源码也在 github 上。  
地址： https://github.com/bazelbuild/bazel  


代码拉下来后，发现编译 bazel 依赖 bazel。  
而且最新源码依赖的 bazel 版本比较高，我开发机还编译不了。  


于是按照 bazel 文档的建议，先去下载一个最新版本的二进制 bazel。  
地址：https://github.com/bazelbuild/bazel/releases/tag/5.1.1  



然后使用下载的 bazel 二进制程序 来编译最新的 bazel 源码。  
编译很慢很慢。  


等待过程中，我突然自问：既然可以下载最新版本的 bazel 二进制，我为啥还去编译最新版本的 bazel。  


于是我就取消了 bazel 编译，选择去编译 tcmalloc。  


结果编译的时候，又失败了。  
看错误提示，是“GCC 9.2 or higher is required.”。  


我的开发机目前使用的是 GCC 8，难道又要去升级 GCC ？  


到这里，我放弃编译 tcmalloc 了。  



## 三、 tcmalloc 的 父亲 gperftools  


在放弃 tcmalloc 之际，我突然想起，tcmalloc 是 gperftools 的子集。  


于是去 gperftools 看了下，果然还支持 tcmalloc。  


源码地址： https://github.com/gperftools/gperftools  


查看 INSTALL 文档，使用编译三部曲，就可以编译出 tcmaloc 的目标文件了。  


但是，不得不说， gperftools 的文档写的好差。  


在 INSTALL 文档中，不是 step by step 的文档，而是一个小作文。  
需要自己理解小作文的含义，提取总结出编译三部曲的命令。  


还好，这个编译流程业界是通用的，我直接敲出对应的命令即可编译了。  


就这样，我终于得到 tcmalloc 的目标文件了。  

 


## 四、最后  


对比 tcmalloc 与 jemalloc 的性能，提升的性能差不多，都是 35%。  
甚至 tcmalloc 更高一些，这是我没想到的。  


多年前业界的技术文档里， 都在宣称 jemalloc 提升的性能比 tcmalloc 高的。  


但是 tcmalloc 这个项目一直在更新。  
既然之前 jemalloc 性能高， tcmalloc 必然会分析 jemalloc 为啥性能高，然后做对应的优化。  


这样看来，在 2022 年，两个库的性能应该都差不多了。  
甚至谁更新迭代的快，谁性能提升的就高吧。  


这个应该算是两个 malloc 库卷起来了吧。  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

