---   
layout:     post  
title:  简单了解 Nginx 中的内存池
description: Nginx 自己把所有的数据结构都自己造了一遍轮子，我们来看看内存池吧。  
keywords: 技术
tags: [程序人生]  
categories: [程序人生]  
updateDate: 2018-12-09 20:12 
published: true   
wxurl: https://mp.weixin.qq.com/s/hcnMA0h5BPsRJH9cnmq7hw  
---  

 


## 一、背景

之前在内部分享了一次 Nginx，并写了一篇文章《[一次 Nginx 分享](https://mp.weixin.qq.com/s/wGscVGR7Ytf8uMWzEwOjLQ)》。  
现在继续来看看 Nginx 里面有意思的代码吧。  
第一个就是 Nginx 造的一堆轮子：内存池。  


## 二、内存池  

Nginx 实现了一个简单的内存池，效率非常高，但是可用性非常差。  


内存池，顾名思义，就是预先从操作系统里申请好内存，程序实际需要内存的时候，直接在用户态分配即可。  


为啥要这样做呢？  
因为默认分配内存涉及到与操作系统打交道，比较慢。  
而自己管理内存则只需要第一次和操作系统打交道，之后都是在自己的数据上操作的，无非一些变量的加加减减，性能非常高。  

具体怎么实现呢？  
先申请一块比较大的内存，然后业务申请内存的时候，先保存可用内存的首地址，然后更新可用内存的偏移量。  
伪代码如下：  


```
void * ngx_palloc_s(ngx_pool_t* pool, size_t size){
    char* m = pool->d.last;
    p->d.last =  m + size;
    return m;
}
```


看了上面的代码，很多独立思考的人会有很多疑问。  
1.比如内存不够了怎么办？  
2.内存需要对齐怎么办？  
3.内存怎么回收？  


这三个问题也很容易回答。  


## 三、内存不够了怎么办？  


不够了创建新的内存池即可。  
也就是内存池是一个链表，这样就不存在不够的问题了。  


![](https://res2018.tiankonguse.com/images/2018/12/20181209212358.png)  


创建新内存池的代码也很简单。  
调用系统的申请内存函数，然后把新内存池挂在链表的最后面。  


这里面有一个优化，由于链表要在最后插入一个元素的时候，需要遍历链表。  
nginx就在每个内存池上加了一个计数器，如果一个内存池被遍历四次，就把当前内存池设置为current。  
这样就可以保证内存池有效链表节点的个数不会超过7个。  


![](https://res2018.tiankonguse.com/images/2018/12/20181209212707.png)  


## 四、内存需要对齐怎么办？  


那就先对齐内存，在分配空间。  


```
void * ngx_palloc_s(ngx_pool_t* pool, size_t size){
    char* m = pool->d.last;
    m = ngx_align(m);
    p->d.last =  m + size;
    return m;
}
```


可能有人会问：为什么要对齐内存？  
这个涉及到的学问就有意思了。  


第一个原因是为了性能。  
因为 CPU 读数据就是字节内存对齐的。  
假设分配的内存不对齐，我们的地址从`0x9`开始，要读`8`字节，则这个数据跨越了两个对齐的空间。  
CPU 要读这个数据就需要两次。  


第二个是为了方便计算地址。  
比如对于整数数组，我们使用下标偏移的时候，每次加的是`4`字节。  
换算为数学公式就是 `a[n] = a + n * 4`  
如果字节对齐的话，就可以使用位操作来快速计算 `a[n] = ((a>>2) + n) << 2;`  


第三是很多CPU只支持字节对齐的程序。  
这个就比较霸道了，硬件不支持不对齐的程序，那我们只好对齐了。  


具体可以参考这个地址吧， https://www.ibm.com/developerworks/library/pa-dalign/  


## 五、内存怎么回收？  


这个是最魔幻的地方。  
答案是业务自己回收，这里不提供回收函数。  
吐血。。。  


那随便找个使用内存池的代码，看看怎么回收的吧。  
以`array`数据结构为例。  


![](https://res2018.tiankonguse.com/images/2018/12/20181209210935.png)


代码中可以看到，回收的时候有个判断。  
回收的数据必须是内存池最后一个分配的内存才可以回收。  


这个就要求业务自己严格保证申请内存的顺序和回收内存的顺序完全相反了。  
一丁点都不能错，错一个就全部不能回收了。  


另外，再考虑我们分配内存的时候曾有过内存对齐操作。  
如果分配内存时进行了内存对齐，将永远也满足不了这个回收条件了，也就是永远也回收不了了。  


## 六、最后


看到这里， Nginx 的内存池就看完了。  
是不是实现的特别简单、性能特别高。  


但是也应了我上篇文章《[一次 Nginx 分享](https://mp.weixin.qq.com/s/wGscVGR7Ytf8uMWzEwOjLQ)》说的那句话:  


```
而 Nginx 为了提高性能，所有的功能都自己来实现了。  
比如 SLAB 内存管理，array、list、hash、红黑树、regex等等。  
自己实现的时候，仅仅实现自己需要的功能。  
这样做出来的功能没有那么通用，但是也没有冗余，自己使用时性能会更高。  
```


还有这句话：  

```
对于任何系统，不管如何高性能，都存在其局限性，都有对应的使用场景。  
越过了使用场景，可能就不是高性能了，或者良好的模块设计就不那么良好了。  
Nginx 是如此， Redis 依旧如此。  
```


最后了，插播一个事情。  


![](https://res2018.tiankonguse.com/images/2018/12/20181209213143.jpg)  

今天摔键盘的时候，摔出一本书来，于是我想：这些书不能浪费了。  
既然我不看，可以分享给大家看。  


今天分享一本内存相关的数，名字叫做《代码优化：有效使用内存》，公众号后台回复"代码优化"领取。  




