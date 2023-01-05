---   
layout:  post  
title: 升级到gcc8，服务数据出错了，怎么回事?     
description: 要设计一个不强依赖编译器的系统。        
keywords: 生活 
tags: [生活]    
categories: [生活]  
updateData:  2023-01-05 18:13:00  
published: true  
---  


## 零、背景  


最近团队新加入一个小伙伴，他和我们一起维护项目组里的最核心服务。  


这个小伙伴还在熟悉系统代码的时候，我收到这位小伙伴向 master 提交 MR 的消息提醒，其中一个功能是把 gcc 版本从 gcc7 升级到 gcc8。  


我看到后震惊，提了一个 Comment ,如下：  


建议先在测试环境运行，尤其是功能需要测试通过。  
另外，这个服务使用了大量的自研编解码技术，可能存在gcc编译环境不兼容问题。  


其实这里不是可能存在不兼容问题，是一定存在不兼容问题。  
因为在一年前，这个服务的原负责人曾经尝试过升级 gcc8，结果遇到了问题，就又回滚了。  
当时问为什么也没问出具体原因来，项目比较忙，这事就没下文了。  


现在，既然我提出有这样的问题，就需要指出具体是什么问题，以及解决方案是什么。  
这样才能给评估升级 gcc 的方案与成本，并在未来排期改造系统，从而能够升级 gcc 版本。  


## 一、协议      


如果一个服务与上下游服务(包括储存)的通信协议与数据协议都是完备的，那就可以任意的升级编译版本，而不会产生兼容问题。  


通信协议是 RPC 协议，设计协议时会考虑到通信的另一端可能是任何语言任何版本生成的程序。  
所以通信协议的设计一般是完备的，使用方按照协议的规范即可正常的序列化与反序列化，不会产生啥问题。  


数据协议的制定就因人而异了。  
比如我，数据协议一般都使用 protobuf，一般也不会遇到编译系统导致的问题。  
但也有人喜欢自定义协议，如果考虑不周全，就可能导致出现编译系统不兼容问题。  


关于协议的具体介绍，可以参考我 2017 年写的《[什么是协议](https://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)》，这里就不再展开了。  



## 二、TLV  


我们的系统是一个两级缓存系统。  
一级缓存使用共享内存，当时每次重启会清空内存(今年改为不清空了)，属于无状态缓存。  
二级缓存使用远程redis，这个属于持久化的缓存，服务重启后数据依旧存在。  


redis 的通信协议肯定是没问题的。  
所以产生不兼容的原因肯定是 redis 中的数据了。  


一般来说，协议的制定都需要遵循 TLV(type-length-value) 格式，这样协议就可以任意扩展了。  


而查看我们这个系统的协议设计，可能当初是为了节省几字节的内存，设计的是 TV(type-value) 格式。  


这时候可能就会有人问：我们怎么知道 Value 的长度呢？  
答案是如果 TLV 只有一个的的话，总长度减去 Type 的长度，我们就可以知道 Vaule 的长度了。  


如果协议真是这样设计，其实升级编译系统也没有问题。  


服务的另外一个设计使得这个系统彻底与编译系统绑死了。  


## 三、缺陷


服务在储存数据的时候，为了节省内存，定义了一个固定数组。  
各种数据的类型都储存在这个固定数组中。  


```
uint8_t type;
uint8_t buf[kMaxTypeLen];

int32_t v32 = 1;
memcpy(buf, &v32, sizeof(v32));


int64_t v64 = 1;
memcpy(buf, &v64, sizeof(v64));

double d;
memcpy(buf, &d, sizeof(d));
```


不考虑大小端问题，这样来储存数据也没问题。  


但是问题处在序列化与反序列化上。  


序列化的时候，我们需要分别判断类型，然后复制对应长度的数据。  


```
string val;

if (type == kTypeInt32) {
  val.resize(sizeof(uint8_t) + sizeof(int32_t));
  char* p = &val[0];
  memcpy(p, &type, sizeof(type));
  memcpy(p + sizeof(uint8_t), buf, sizeof(int32_t));
}


if (type == kTypeInt64) {
  val.resize(sizeof(uint8_t) + sizeof(int64_t));
  char* p = &val[0];
  memcpy(p, &type, sizeof(type));
  memcpy(p + sizeof(uint8_t), buf, sizeof(int64_t));
}
```


可以发现，我们有几个基本类型，上面的 `if/else` 就需要写几个。  


于是，为了偷懒与节省 0 值的内存，有缺陷的代码就产生了。  
可以发现，序列化的时候，直接将整个内存的 buf 都序列化进去了。  
PS: 0 值节省内存，非 0 值反倒是浪费内存了。  


```
string val;
if(!IsZero ()) { // 非 0，复制整个buf
  val.resize(sizeof(uint8_t) + kMaxTypeLen);
  char* p = &val[0];
  memcpy(p, &type, sizeof(type));
  memcpy(p + sizeof(uint8_t), buf, kMaxTypeLen);
}else{ // 0 值，只储存类型
  val.resize(sizeof(uint8_t));
  char* p = &val[0];
  memcpy(p, &type, sizeof(type));
}

```


反序列化就是一个逆的过程。  
由于有 0 值的特殊逻辑，反序列化也加了一个长度判断。  


```
// p 数据地址， len 数据长度
type = *(uint8_t*)p;

p += sizeof(uint8_t);
len -= sizeof(uint8_t);

if (len >= kMaxTypeLen) {
  memcpy(buf, p, kMaxTypeLen);
} else {
  memset(buf, 0, kMaxTypeLen);
}
```


## 四、问题  


问题的关键就在于序列化的时候，各种类型直接复制了整个 buf 的长度。  


而不同的编译系统，buf 的长度是不一样的。  


我在 gcc7 和 gcc8 下分别打印了基本类型的长度。  


```
// gcc version 7.3.1 20180303 (Red Hat 7.3.1-6) (GCC) 
sizeof string = 8
sizeof int64 = 8
sizeof double = 8
sizeof point = 8

//gcc version 8.3.1 20191121 (Red Hat 8.3.1-5) (GCC) 
sizeof string = 32
sizeof int64 = 8
sizeof double = 8
sizeof point = 8
```

可以看到，对于 string, gcc7 是 8 字节，而 gcc8 是 32 字节。  


长度的变化，就会导致序列化的时候，不同版本最终写入的 buf 长度不一样。  


这也导致两个系统写的数据不兼容。  


gcc8 上的服务写入 32 字节数据，gcc7 上的服务只会读前 8 字节数据，值被截断。  
gcc7 上的服务写入 8 字节数据，gcc8 上的服务发现长度太短，按 0 值处理。  



## 五、解决方案  


不能升级编译版本的原因清楚了，其实解决方案倒是很简单。  


第一步，由于旧版本已经写了固定长度的 Buf，类型相关的长度需要改成与类型无关，即以后任何版本都是固定的值。  


第二步，对于那些长度发生变化的类型，旧类型逻辑保持不变，再分配一个新的类型编号，通过其他方法编解码，但是这个新类型暂时不启用。  
这样把代码发布上线后，线上所有实例都支持两套类型，但是只运行了旧类型。  


第三步，升级编译系统，启用新类型，发布全量代码。  
发布过程中，旧类型在新的编译系统使用固定值兼容解析，没问题；
新类型是全新设计的，新旧编译系统也没问题。  


就这样，系统就可以升级到 gcc8。  


总结下就是：  


1、第一次升级系统，编译系统不同版本之间会变化的参数，先全部固定为低版本。  
2、第二次升级系统(可与第一步合并)，兼容低版本功能，增加新版本功能，但是新版本功能不启用。  
3、第三次升级系统，切换到新版本。  
4、第四次升级系统，下线旧版本功能。  


## 六、最后  


如果你细心看我测试的类型长度的话，会发现不兼容的是 string 类型。  


string 类型是非平凡(non-trivial)的，不支持直接复制地址下的内容。  
项目的实际代码中，对于 string 类型没有直接复制 buf。  


但是定长 Buf 的长度却是 string 导致的，所以实际修复方案有差异，但是流程差异不大。  



你有遇到升级版本导致的问题吗？都是什么问题？怎么解决的？  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

