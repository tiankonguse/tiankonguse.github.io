---   
layout:     post  
title: go 源码阅读之 slice 底层实现 
description: slice 实现也是很简单的。         
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2021-11-22 21:30:00  
published: true  
---  


## 一、背景


之前在《[谈谈 go slice中的不确定性](https://mp.weixin.qq.com/s/1mro4fVYyXiPFpVE7DnnXQ)》 介绍了 slice 的基本用法与实现猜测。  


这里我阅读了 go 语言中 slice 的源码，对上篇文章进行部分修正，并深入解析 slice 的原理具体如何实现的。  


源码参考：https://github.com/golang/go  
版本：go1.17.3  



## 二、结构  


上篇文章我对 slice 的结构猜想是下面的样子（cpp语言风格）。  


```
struct Slice{
    int* address
    int offset 
    int len
    int cap
};
```


其实，对于 go 的 slice 当时我少说一个性质：slice 指向一个内存的时候，切片只能向后切，不能向前切。  


这个性质也决定了 slice 的实现不是我猜想的那样。  


如果储存一个 offset，就可以向前切了，所以这里不需要 offset 了。  


由此，这个性质决定了 slice 的结构是下面的样子（cpp语言风格）。  


```
struct Slice{
    int* address
    int len
    int cap
};
```


slice 的源码中的结构和猜想的差不多，具体如下（go 源码）：  


```
type slice struct {
	array unsafe.Pointer
	len   int
	cap   int
}
```


源码文件：src\runtime\slice.go  


## 三、创建


通过 make 创建切片的时候，会调用 `makeslice` 函数，完整源码如下。  


```
func makeslice(et *_type, len, cap int) unsafe.Pointer {
	mem, overflow := math.MulUintptr(et.size, uintptr(cap))
	if overflow || mem > maxAlloc || len < 0 || len > cap {
		mem, overflow := math.MulUintptr(et.size, uintptr(len))
		if overflow || mem > maxAlloc || len < 0 {
			panicmakeslicelen()
		}
		panicmakeslicecap()
	}

	return mallocgc(mem, et, true)
}
```


源码只有两个逻辑：先进行合法性检查，通过了就调用`mallocgc`申请内存。  


申请内存的逻辑这里就不展开讲了。  
以后看内存管理时，应该会介绍到这个函数。  



## 四、扩容  


对切片 `append` 插入元素后，就可能涉及容量满了，需要扩容的问题。  
底层源码调用的是 `growslice` 函数。  


这个函数比较大，我们分段来看。  



第一段是各种 enabled 开关检查。  


```
if raceenabled {
    callerpc := getcallerpc()
    racereadrangepc(old.array, ...
}
if msanenabled {
    msanread(old.array, uintptr(old.len*int(et.size)))
}
if asanenabled {
    asanread(old.array, uintptr(old.len*int(et.size)))
}
```


enabled 都为 false 也不影响流程，所以可以先忽略这段代码。  



第二段是参数检查。  


```
if cap < old.cap {
    panic(errorString("growslice: cap out of range"))
}

if et.size == 0 {
    return slice{unsafe.Pointer(&zerobase), old.len, cap}
}
```


如果新的 cap 变小了，显然非法的，直接 panic.  
如果切片类型的大小为 0，那么构造一个不需要长度的切片。  




第三段是扩容算法的核心部分。  


```
newcap := old.cap
doublecap := newcap + newcap
if cap > doublecap {
    newcap = cap
} else {
    if old.cap < 1024 {
        newcap = doublecap
    } else {
        // Check 0 < newcap to detect overflow
        // and prevent an infinite loop.
        for 0 < newcap && newcap < cap {
            newcap += newcap / 4
        }
        // Set newcap to the requested cap when
        // the newcap calculation overflowed.
        if newcap <= 0 {
            newcap = cap
        }
    }
}
```

有四个分支，所以分四种情况。  


-）如果新扩容大小大于当前容量的2倍，则按新的容量进行计算。  
-）如果旧的容量小于 1024 （新容量小于 2048 ），则使用倍增法扩容。  
-）如果旧容量大于等于 1024，则不断的按 1.25 倍的速率循环扩容，直到大于或等于目标容量。  
-）如果初始容量为 0，则直接按目标容量扩容。  


其实从 codereview 的角度来看，这段代码写的并不好。  


首先，这段代码应该独立为为一个函数，返回 newcap 即可。  
抽象为函数后，就可以快速返回结果了。  




第四段逻辑是进行内存对齐（switch 语法挺怪的）。  


```
var overflow bool
var lenmem, newlenmem, capmem uintptr
// Specialize for common values of et.size.
// For 1 we don't need any division/multiplication.
// For sys.PtrSize, compiler will optimize division/multiplication into a shift by a constant.
// For powers of 2, use a variable shift.
switch {
case et.size == 1:
    lenmem = uintptr(old.len)
    newlenmem = uintptr(cap)
    capmem = roundupsize(uintptr(newcap))
    overflow = uintptr(newcap) > maxAlloc
    newcap = int(capmem)
case et.size == sys.PtrSize: 
    lenmem = uintptr(old.len) * sys.PtrSize
    newlenmem = uintptr(cap) * sys.PtrSize
    capmem = roundupsize(uintptr(newcap) * sys.PtrSize)
    overflow = uintptr(newcap) > maxAlloc/sys.PtrSize
    newcap = int(capmem / sys.PtrSize)
case isPowerOfTwo(et.size): 
    var shift uintptr
    if sys.PtrSize == 8 {
        // Mask shift for better code generation.
        shift = uintptr(sys.Ctz64(uint64(et.size))) & 63
    } else {
        shift = uintptr(sys.Ctz32(uint32(et.size))) & 31
    }
    lenmem = uintptr(old.len) << shift
    newlenmem = uintptr(cap) << shift
    capmem = roundupsize(uintptr(newcap) << shift)
    overflow = uintptr(newcap) > (maxAlloc >> shift)
    newcap = int(capmem >> shift)
default:
    lenmem = uintptr(old.len) * et.size
    newlenmem = uintptr(cap) * et.size
    capmem, overflow = math.MulUintptr(et.size, uintptr(newcap))
    capmem = roundupsize(capmem)
    newcap = int(capmem / et.size)
}

if overflow || capmem > maxAlloc {
    panic(errorString("growslice: cap out of range"))
}
```


第一个是 1，乘除运算可以忽略。  
第二个是系统指针大小（32位是4，64位是8），乘除时系统会自动优化为位操作。  
第三个是其他完整的幂数，通过位操作来代替乘除运算。  
第四个是其他情况，只能暴力的乘除运算了。  


看完第四个分支，发现与前三个不一样，算是 go 的逻辑缺陷？  
前三个都有判断内存是否大于 maxAlloc ，第四个竟然没有了，逻辑不统一呀，重大设计缺陷。  


继续往下看，发现又重新对对齐后的内存进行了判断，检查是否大于 maxAlloc。  
这样的话，前面对对齐前的内存做了一堆判断，判断了个寂寞。  


在 corereview 上看，这段代码也是有很大的问题。  




而对于 roundupsize 函数，则是内存对齐的函数，这里也不展开细讲了。  



第五段代码是申请新的内存，不展开说明了。  


```
var p unsafe.Pointer
if et.ptrdata == 0 {
    p = mallocgc(capmem, nil, false)
    memclrNoHeapPointers(add(p, newlenmem), capmem-newlenmem)
} else {
    p = mallocgc(capmem, et, true)
    if lenmem > 0 && writeBarrier.enabled {
        bulkBarrierPreWriteSrcOnly(uintptr(p), uintptr(old.array), lenmem-et.size+et.ptrdata)
    }
}
```



第六段代码是复制内存，返回新的 slice ，比较简单。  


```
memmove(p, old.array, lenmem)

return slice{p, old.len, newcap}
```



总的来看，这个扩容过程还是比较简单的，使用算法计算新的大小、对齐内存、申请内存、复制数据、返回新的结构。  



## 五、复制 


默认 slice 的复制是浅复制，想要深复制，就需要调用系统自带的 slicecopy 函数了。  


```
// slicecopy is used to copy from a string or slice of pointerless elements into a slice.
func slicecopy(toPtr unsafe.Pointer, toLen int, fromPtr unsafe.Pointer, fromLen int, width uintptr) int;
```


第一步是参数检查，如果来源 slice 长度或目标 slice 长度为0，，就不复制。  


```
if fromLen == 0 || toLen == 0 {
    return 0
}
```



第二步是容量检查，复制的长度不超过目标的长度（敲黑板，深复制前需要预先申请内存）。  


```
n := fromLen
if toLen < n {
    n = toLen
}
```


第三步检查数据大小，如果大小为 0 的数据，就不需要复制了，直接返回复制成功。  


```
if width == 0 {
    return n
}
size := uintptr(n) * width
```


第四步是一些 enabled 检查，我也不知道是干啥的，与算法无关，就不说了。  


```
if raceenabled {
    callerpc := getcallerpc()
    pc := funcPC(slicecopy)
    racereadrangepc(fromPtr, size, callerpc, pc)
    racewriterangepc(toPtr, size, callerpc, pc)
}
if msanenabled {
    msanread(fromPtr, size)
    msanwrite(toPtr, size)
}
```


第五步是真实的复制。  
如果大小为一字节，则转化为 byte 指针进行复制。  
否则就调用 memmove 进行复制。  


```
if size == 1 { // common case worth about 2x to do here
    // TODO: is this still worth it with new memmove impl?
    *(*byte)(toPtr) = *(*byte)(fromPtr) // known to be a byte pointer
} else {
    memmove(toPtr, fromPtr, size)
}
return n
```


对于最后一步，我有很大的疑问的。  


大小为一字节的时候，直接使用 byte 赋值，复制的长度是多少？  
会不会超过 toLen？  
超过了复制多了，就算 BUG 了吧？  



另外，复制的名字是 memmove 也很怪，不应该是 memcopy 吗？  
其实扩容里也遇到这个问题了，忘记提了。  



## 六、最后  


slice 源码中对外暴露了扩容和复制两个函数功能。  


看完后，codereview 汇总如下：  


-）byte 赋值可能算是 BUG？
-）memmove 命名不好，实际是 memcopy。  
-）一堆 enabled 开关，即使搜索调用的函数，也没找到相关注释（怀疑是并发保护或越界保护吧）。  
-）一个函数实现了太多的功能，比如enable 判断、扩容算法、内存对齐算法，都可以拆分出去。   
-）对齐算法实现不统一，竟然漏判断一个。  
-）对齐算法重复判断是否越界，前面判断意义反而不大了。  


目前看到了这么多问题，你还发现什么问题，或者对这些问题有什么看法吗？  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

