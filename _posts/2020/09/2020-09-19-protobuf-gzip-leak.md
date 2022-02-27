---   
layout:     post  
title: protobuf 压缩功能的设计缺陷  
description: 怪不得网上那么多人反馈跑不通  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-09-19 21:30:00  
published: true  
---  


## 一、背景  


之前，我在文章《[protobuf 启用 GZIP 压缩功能](https://mp.weixin.qq.com/s/EC2eNcH7EKr38M4cBA9Esw)》里面介绍了一种方法来启用 protobuf 的 Gzip 压缩功能。  


那篇文章中还列出了网上的样例，即使用 ofstream 与 OstreamOutputStream 来实现压缩功能。  


其实最初我看到 ofstream 的时候，我便想可以使用 stringstream 来操作内存。  
结果测试没通过。  


最后只好看源码，使用 string 与 StringOutputStream 实现这个功能了。  


今天我又看了下源码，找到为啥 stringstream 没调通的原因了。  
所以这里解释一下原因，以及怎么使用 stringstream 来实现压缩功能。  


这里也不卖关子了，直接说原因：protobuf 的设计缺陷。  


## 二、代码回顾  


先来看看 Protobuf 压缩序列化 与 解压缩反序列化的代码。  


![](https://res2020.tiankonguse.com/images/2020/09/19/001.png)  


压缩序列化需要四个步骤，解压缩反序列化需要三步个步骤。  
逻辑也算比较清晰。  


下面就来看看 protobuf 压缩部分的源代码吧。  


## 三、Gzip 压缩对象  


压缩对象 GzipOutputStream 代码如下，可以看到这个对象是闭环的。  


![](https://res2020.tiankonguse.com/images/2020/09/19/002.png)  


可以看到，初始化指定 Option参数。  
Netx、BackUp、ByteCount 是流压缩需要。  
Flush 和 Close 是数据刷新到流中的方法，背后都调用了 Deflate 方法，算是等价的。  
GzipOutputStream 析构函数也是调用了 Close 方法。  


为啥说这个 Gzip 对象是闭环的呢？  
因为这个对象可以主动调用 Flush 数据。  


为啥这么说呢，看看下一小节大家就懂了。  
前几年大家过于崇拜 面向对象 和 RAII，被用烂了的缘故，便使得设计存在缺陷了。  


## 四、Ostream 对象  


前几年流行面向对象 和 RAII，很多对象只能在析构函数中进行资源回收的 。  
这也就导致引入不少 BUG 缺陷，害人害己。  


比如 Ostream 对象就是一个血淋漓的教训。  
网上有无数相关的问题，说 protobuf 的压缩功能无效不能使用，大部分都是这个原因导致的。  


先来看看这个对象对外提供的函数。  


![](https://res2020.tiankonguse.com/images/2020/09/19/003.png)  


可以看到，与 Gzip 相比，只有 流压缩的函数，而没有了 Flush 函数。  
为啥没有呢？ 因为使用了 RAII 技术，在析构函数里自动 Flush 的。  


网上的使用样例都是这样子，实际上都是不能正确运行的。  


![](https://res2020.tiankonguse.com/images/2020/09/19/004.png)  


找找 protobuf 内部是怎么使用这个 Ostream，果然与自己预期的一致。  
需要加一个大括号，提前释放 Ostream 的资源，从而能够触发 Flush 把数据写到 流里面。  


![](https://res2020.tiankonguse.com/images/2020/09/19/005.png)  


看看 Ostream 的单元测试，也是一样的蹩脚。  
所有地方用到 Ostream  都需要加个大括号。  


![](https://res2020.tiankonguse.com/images/2020/09/19/006.png)  


## 五、其他对象  


上面两个关键对象介绍完了，我们来快速浏览一下 protobuf 提供的各种 stream 对象。  

```
ArrayInputStream 数组流
ArrayOutputStream 数组流
StringOutputStream 字符串流
FileInputStream  FD流
FileOutputStream FD流
IstreamInputStream 对象流
OstreamOutputStream 对象流
ConcatenatingInputStream 多个流
LimitingInputStream 限制字节流
ZeroCopyInputStream 基类流
ZeroCopyOutputStream 基类流
```


可以看到  
对于普通的数组内存，可以使用数组流。  
对于字符串内存，可以使用字符串流。  
对于文件描述符 FD 的操作，可以使用 FD 流。  
对于面向对象 stream 的操作，可以使用对象流。  
多个流则是按数组顺序依次读，限制字节流只读指定字节个数的数据。  


## 六、流与内存


在文章《[protobuf 启用 GZIP 压缩功能](https://mp.weixin.qq.com/s/EC2eNcH7EKr38M4cBA9Esw)》提到，网上所有样例都是使用的文件流 ofstream。  


当时我给朋友的介绍是把文件流 ofstream 换成内存流就行了。  


![](https://res2020.tiankonguse.com/images/2020/09/19/007.png)  


然后我还提供了具体使用那个内存流对象，以及对应的文档地址。  


![](https://res2020.tiankonguse.com/images/2020/09/19/008.png)  


从相关文档中可以看到，ostream 有三种实现，我们要使用的就是  ostringstream。  


![](https://res2020.tiankonguse.com/images/2020/09/19/009.png)  


其实与 ostringstream 相比，还有一个万能的内存流 stringstream，用着特别爽。  


![](https://res2020.tiankonguse.com/images/2020/09/19/010.png)  


那为啥昨天我的文章没介绍这个方法呢？  


因为我换成 ostringstream 后，被 StringOutputStream 对象的 RAII 功能坑了。  
怎么调试，输出的 string 中都是空的。  


后来看源码，换成 StringOutputStream 后，不存在缓冲区 Flush 问题，所以就一下跑通了。  


现在回头看看，其实使用 ostringstream  也是可以的，只需要加一个大括号触发 RAII 进行 Flush 就行了。  


代码与文件流差不多，只需要换个名字，再加个大括号即可。  


```
std::stringstream outputWrap;
{
google::protobuf::io::OstreamOutputStream outputStream(&outputWrap);
google::protobuf::io::GzipOutputStream gzipStream(&outputStream, options);
person.SerializeToZeroCopyStream(&gzipStream);
}
output = outputWrap.str();

person.Clear();
std::stringstream inputWrap(output);
google::protobuf::io::IstreamInputStream inputStream(&inputWrap);
google::protobuf::io::GzipInputStream gzipStream(&inputStream);
person.ParseFromZeroCopyStream(&gzipStream);
```


##七、最后  


看到这里，我们终于使用 stringstream  也实现了 protobuf 的压缩序列化功能  


不过也可以感受到 protobuf 中 OstreamOutputStream 对象的设计缺陷。  
使用 RAII  进行资源释放没问题，但是很有必要对外提供一种主动释放资源的接口。    


我要不要去给 protobuf 提交一个 MR 呢？提供一个主动 Flush 的函数。  


思考题：你怎么看待 protobuf 的这个设计缺陷呢？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

