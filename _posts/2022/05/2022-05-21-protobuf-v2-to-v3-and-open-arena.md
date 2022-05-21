---   
layout:     post  
title: protobuf 升级到 v3，接入 Arena 性能提升 50% 
description: 默认值与内存优化很明显。 
keywords: 生活  
tags: [生活]    
categories: [生活]  
updateData:  2022-05-21 18:13:00  
published: true  
---  


## 一、背景  


最近一段时间我在做性能优化。  


性能优化充满不确定行。  


可能做了很多优化，效果也不明显。  
也可能仅仅是一个小改动，效果就炸天了。  


上周做了一个调参优化，是的，只修改了一个配置参数，性能提升 10~15%。  


接下来一步是进行 protobuf 优化。  


这里的优化分为两步，如标题所示，一个是升级 protobuf 版本，一个是接入 Arena。  


## 二、接入 Arena  


我的服务同时对外支持两个协议，新协议已经是 protobuf3 了，旧协议是 protobuf2。  



我的想法是：旧协议路径较长，先选择新协议快速尝试接入 Arena ，看下效果。  
效果好了，再花时间去改造旧协议，切换到 Protobuf3，再接入 Arena。  


接入 Arena 步骤如下:  


第一步：协议里增加 `option  cc_enable_arenas = true;`.  
第二步就是使用 arena 创建 message 对象了。  


```
#include <google/protobuf/arena.h>
{
  google::protobuf::Arena arena;
  MyMessage* message = google::protobuf::Arena::CreateMessage<MyMessage>(&arena);
  // ...
}
```


第三步，没有了。  


原理： arena 相当于自己管理一个线程安全的内存池，避免 message 内存的频繁申请与释放，从而提高性能。  


实测性能提升：新协议提升 10~15%  


副作用1：move 全部失效，变成深复制。  
副作用2：swap 可能失效，变成多次深复制。  
副作用3：`set_allocated_XXX/release_XXX` 很容易用错导致内存泄露。  


## 三、protobuf 升级到 v3  


服务对外的旧协议之前都是使用 protobuf v2 版本。  


虽说 v2 也支持 Arena，但升级一下保持一个版本，是个必要的选择。  


当我们把 `syntax = "proto2";` 修改为 `syntax = "proto3";` 时， 编译服务就会发现各种错误。  



错误1：optional 禁用了。  


```
Explicit 'optional' labels are disallowed in the Proto3 syntax. 
To define 'optional' fields in Proto3, simply remove the 'optional' label, as fields are 'optional' by default.
```

错误2：Required 禁用了。  


```
Required fields are not allowed in proto3.
```


错误3：默认值禁用了。  


```
Explicit default values are not allowed in proto3.
```


错误4：枚举值必须从 0 开始。  


```
The first enum value must be zero in proto3.
```


错误5：默认值不再打包到二进制中了。


这意味着，一个值为 0 的字段，之前 `has_xxx` 判断可以通过，现在可能无法通过了。  



解决上面 5 中错误后，进行性能压测。  


不敢相信，性能竟然提升了 50%。  



## 四、最后  



开启 arena 性能提高是符合预期的。  


因为目前服务使用的 gcc8，STL 的 string 性能很低，数据包的协议字段又深又复杂。  


自己管理内存后，就瞬间大大降低了内存的申请与释放。  




而旧协议性能提升比新协议高是预期之内的。  


主要是两方面原因。  


第一：逻辑都是用新协议实现的，旧协议存在一个协议转换逻辑。  
第二：协议升级版本后，压缩了默认值，减少了内存申请与释放。  



后面我会尝试降低 gcc 的版本，再对比性能，看哪些是 STL 带来的损耗，哪些是 arena 带来的提升。  


到时候测试完了，再写一篇 STL string 的文章。  



加油，搬砖人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

