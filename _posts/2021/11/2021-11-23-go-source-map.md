---   
layout:     post  
title: go 源码阅读之 map 底层实现 
description: map 的实现还算简单。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2021-11-23 21:30:00  
published: true  
---  


## 一、背景


上面文章《[go 源码阅读之 slice 底层实现](https://mp.weixin.qq.com/s/-hgCZXDE3rIxzFZYFaoXmQ)》记录了 slice 的源码实现。  


这篇文章来记录下 map 的源码实现。  


源码参考：https://github.com/golang/go  
版本：go1.17.3  
源码位置：src/runtime/map.go  


## 二、基本功能  


go 的 map 暴露的接口很简单，功能如下。  


四种创建 map 的方法  


```
var ages map[string]int   // 空指针

ages := make(map[string]int)  
ages := make(map[string]int, 100) 

ages := map[string]int{
    "alice":   31,
    "charlie": 34,
}
```

对于第一种声明式创建，默认是空指针。  
空指针可以正常的查找、删除、len、range，但是不能插入元素。  


第三种提前设置预期元素个数，避免插入元素时频繁扩容。  


map 插入元素  


再次强调，空指针 map 插入元素会 panic。  


```
ages["alice"] = 31
```

map 删除元素  


允许删除不存在的元素  


```
delete(ages, "bob") 
```

遍历 map  


遍历顺序是随机的，map 内容不变，每次遍历的结果顺序也不一样。  


```
for name, age := range ages {
    fmt.Printf("%s\t%d\n", name, age)
}
```


查找取值  


```
a := ages["carol"]
```


查找判空  


```
age, ok := ages["bob"]
```


自定义 key 可以转化为 string  


```
func h(v KeyType) string { return "xxx" }

var m = make(map[string]ValueType)
func Set(k KeyType, v ValueType)       { m[h(k)] = v }
func Get(k KeyType,) ValueType { return m[h(k)] }
```


## 三、数据结构  


golang 的 map 底层使用 hash table 实现的。  
首先有一个定长数组 hmap，称为  buckets ，使用 key 的 hash 低位选择。  
冲突进入相同 buckets 的元素，会再次在长度为 8 的 bmap 数组中，通过 key 的 hash 高位选择。  
再次冲突后，就使用链表连接起来。  


源码中两个结构如下  

```
// A header for a Go map.
type hmap struct {
    count     int                  // 元素个数
    flags     uint8
    B         uint8                // 扩容常量，len = 2^B
    noverflow uint16               // 溢出的bucket个数
    hash0     uint32               // hash seed

    buckets    unsafe.Pointer  
    oldbuckets unsafe.Pointer      
    nevacuate  uintptr             // 搬迁进度

    extra *mapextra                // 用于扩容的指针
}

// A bucket for a Go map.
type bmap struct {
    tophash [bucketCnt]uint8        // len为8的数组
}
```


编译之后，bmap 会被填充一些字段。  


```
type bmap struct {
  topbits  [8]uint8
  keys     [8]keytype
  values   [8]valuetype
  pad      uintptr
  overflow uintptr
}
```


## 四、初始化  


创建 map 时，编译器会转化为调用 makemap 函数。  


```
func makemap(t *maptype, hint int, h *hmap) *hmap  
```

对于 参数 `h *hmap` 我们可以忽略，那是编译器做的优化，直接在栈上申请的内存。  



第一步是参数检查，即内存不能超过限制。  


```
mem, overflow := math.MulUintptr(uintptr(hint), t.bucket.size)
if overflow || mem > maxAlloc {
    hint = 0
}
```


第二步创建一个空的 hash table。  


```
// initialize Hmap
if h == nil {
    h = new(hmap)
}
h.hash0 = fastrand()
```


第三步计算计算 B 因子。  


```
B := uint8(0)
for overLoadFactor(hint, B) {
    B++
}
h.B = B

func overLoadFactor(count int, B uint8) bool {
	return count > bucketCnt && uintptr(count) > loadFactorNum*(bucketShift(B)/loadFactorDen)
}
```


overLoadFactor 函数一堆常量，我们把常量替换一下就清晰了。  


```
func overLoadFactor(hint int, B uint8) bool {
	return hint > 8 && hint > 6.5 * 2^B
}
```


由此可以看出来，如果 hint 不大于 8， B 就是 0.  
否则 B 就是 `log(hint/6.5)` 左右。  


第四步，如果 B 大于 0，就进行扩容 hash table。  


```
if h.B != 0 {
    var nextOverflow *bmap
    h.buckets, nextOverflow = makeBucketArray(t, h.B, nil)
    if nextOverflow != nil {
        h.extra = new(mapextra)
        h.extra.nextOverflow = nextOverflow
    }
}
```

makeBucketArray 用来创建一个大小为 `2^B` 的定长数组。  


当然，实际上 makeBucketArray 做的更复杂。  
如果 B 大于等于 4 的时候，也就是 hint 大于 `6.5 * 2^4 = 106`时，会尝试多申请一些内存。  
具体申请内存大小是 `2^B + 2^(B-4)`， 大概是原计划的 1.0625 倍。  


多申请的内存数组会返回给 nextOverflow，然后储存在 extra 结构里面，用来备用。  


## 五、查找  


直接取值时，底层会调用 mapaccess1 函数，如果需要判空并查找时，底层会调用 mapaccess2 函数。  


第一步是判断是不是空的 map。  


```
if h == nil || h.count == 0 {
    if t.hashMightPanic() {
        t.hasher(key, 0) // see issue 23734
    }
    return unsafe.Pointer(&zeroVal[0])
}
```


第二步并发保护。  


```
if h.flags&hashWriting != 0 {
    throw("concurrent map read and map write")
}
```


第三步，选择 bucket。  


```
hash := t.hasher(key, uintptr(h.hash0))
m := bucketMask(h.B)
b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
if c := h.oldbuckets; c != nil {
    if !h.sameSizeGrow() {
        // There used to be half as many buckets; mask down one more power of two.
        m >>= 1
    }
    oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
    if !evacuated(oldb) {
        b = oldb
    }
}
top := tophash(hash)
```


`t.hasher` 是自带的 hash 函数，可以 hash 计算出一个 hash 值来。  
这里传参是 `h.hash0`，而这个变量初始化是随机数。  
这意味着每个 map 的初始随机种子都不同。  
更意味这个相同的数据，重复运行,map 中的位置都是不同的。  


bucketMask 函数会计算出 B 位的 mask，等价与 `1<<B - 1`。  


接着优先从 buckets 中找到 bucket 的指针位置。  
如果 oldbuckets 不为空，说明正在扩容中，则去检查是否应该去旧的 bucket 查找。  
检查前，需要先计算得到旧 buckets 的 mask（这个逻辑很多地方都有重复，应该提取为函数）。  
使用 mask 找到新的 bucket 后，在第一个 tophash 里面的 flag 来判断这个桶是否有数据。  


每个桶有一个 flag 代表是否有数据。  
这意味着数据迁移的时候，每个周期可以只迁移一个桶。  
这样可以将迁移的时间均摊开，防止进程卡主吧。  


最后的 tophash 获取最高 8 字节的值。  
当然这个值小于 5 时，会加上 5。  
假设所有值都是等概率的，则 5 ~ 9 的概率就会比其他值大一倍了。  


第四步就是去 bmap 中循环寻找数据了。  


```
bucketloop:
for ; b != nil; b = b.overflow(t) {
    for i := uintptr(0); i < bucketCnt; i++ {
        if b.tophash[i] != top {
            if b.tophash[i] == emptyRest {
                break bucketloop
            }
            continue
        }
        k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
        if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
        }
        if t.key.equal(key, k) {
            e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            if t.indirectelem() {
                e = *((*unsafe.Pointer)(e))
            }
            return e
        }
    }
}
return unsafe.Pointer(&zeroVal[0])
```


要看的上面这段代码，需要了解 bmap 的内存布局以及冲突的链表。  



![](https://res.tiankonguse.com/images/2021/11/22/001.png)  




如上图，首先在 buckets 中找到第一个 bmap 后，先顺序查找是否与 tophash 匹配。  
匹配了就找到了，未匹配就找下一个。  
如果找到最后一个，就去 overflow 看下是否需要去下一个 bmap 里查找。  
当然，这里也有一个小优化，如果没有下一个时，使用一个 emptyRest 标记，这样可以快速退出循环。  


匹配到 tophash 了，不代表找到了。  
还需要提取出 key，然后进行比较，匹配上了才算真实找到了。  


mapaccess1 与 mapaccess 的区别仅仅是返回值的区别，源码中竟然重新实现了一遍。  


当然，源码中还有一个 mapaccessK 函数用于同时返回 key 和 value。  
这样的话，我会统一封装为一个函数。  


```
func mapaccess(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, unsafe.Pointer, bool) {
    return key, value, ok
}
```

之后三个函数就可以都调用这一个函数了。  


```
func mapaccess1(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
    _, v, _ := mapaccess(t, h, key)
    return v
}

func mapaccess2(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, bool){
    _, v, ok := mapaccess(t, h, key)
    return v, ok
}

func mapaccessK(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, unsafe.Pointer) {
    k, v, ok := mapaccess(t, h, key)
    if !ok {
        return nil, nil
    }
    return k, v
}
```


对于这个优化，你怎么看呢？  



## 五、赋值操作  


看了查找操作，其实大概就可以推导出赋值操作的实现方式了。  


底层调用的是 mapassign 函数。  


第一步先进行参数检查与写保护。  


```
if h == nil {
    panic(plainError("assignment to entry in nil map"))
}

if h.flags&hashWriting != 0 {
    throw("concurrent map writes")
}
hash := t.hasher(key, uintptr(h.hash0))

// Set hashWriting after calling t.hasher, since t.hasher may panic,
// in which case we have not actually done a write.
h.flags ^= hashWriting
```


源码中可以看出来，要求 map 不能为 nil，不能并发写或者并发读写。  
而且 hasher 函数还可能会  pinic，所以先计算 hash 值再打上写标记。  


注意：这里其实会有并发问题。  
极端情况下两个线程可能同时打标记，从而两次异或变成无标记。  


第二步是找到对应的桶，判断是否在迁移数据，有了先将当前桶的数据迁移到新桶。  
另外，由于这里使用均摊算法来慢慢迁移数据了，所以每次写操作，也会触发一起进度迁移。  


```
bucket := hash & bucketMask(h.B)
if h.growing() {
    growWork(t, h, bucket)
}
b := (*bmap)(add(h.buckets, bucket*uintptr(t.bucketsize)))
top := tophash(hash)
```


第三步就与查找了，与上面的查找代码很类似。  



```
var inserti *uint8
var insertk unsafe.Pointer
var elem unsafe.Pointer
bucketloop:
for {
    for i := uintptr(0); i < bucketCnt; i++ {
        if b.tophash[i] != top {
            if isEmpty(b.tophash[i]) && inserti == nil {
                inserti = &b.tophash[i]
                insertk = add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
                elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            }
            if b.tophash[i] == emptyRest {
                break bucketloop
            }
            continue
        }
        k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
        if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
        }
        if !t.key.equal(key, k) {
            continue
        }
        // already have a mapping for key. Update it.
        if t.needkeyupdate() {
            typedmemmove(t.key, k, key)
        }
        elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
        goto done
    }
    ovf := b.overflow(t)
    if ovf == nil {
        break
    }
    b = ovf
}
```


区别主要是下面三点。  


1、循环过程中，遇到的第一个空位置会使用三个变量保存下来。  
2、如果找到了，记录下 value 的位置，进去 done 标记位置。  
3、否则就不断的查找，直到找到链表的末尾。  


第四步，如果没找到且需要触发迁移数据策略，就开始启动迁移数据。  


```
if !h.growing() && (overLoadFactor(h.count+1, h.B) || tooManyOverflowBuckets(h.noverflow, h.B)) {
    hashGrow(t, h)
    goto again // Growing the table invalidates everything, so try again
}
```


overLoadFactor 函数就是上面提到的 `6.5 * 2^B`，即与 map 的大小做比较。  
tooManyOverflowBuckets 函数是检查冲突 overflow 的个数是否大于 `2^B` 个。  


两个只要满足一个，就启动迁移数据。  


那新的 buckets 是多大呢？ 
这里是采用倍增大扩容的，即只扩大一倍。  



第五步，如果没找到空位置，说明恰好位于 overflow 的最后一个位置，链表尾部插入一个新的 overflow。  


```
if inserti == nil {
    newb := h.newoverflow(t, b)
    inserti = &newb.tophash[0]
    insertk = add(unsafe.Pointer(newb), dataOffset)
    elem = add(insertk, bucketCnt*uintptr(t.keysize))
}
```


第六步，为新找到的空位置设置默认值。  


```
if t.indirectkey() {
    kmem := newobject(t.key)
    *(*unsafe.Pointer)(insertk) = kmem
    insertk = kmem
}
if t.indirectelem() {
    vmem := newobject(t.elem)
    *(*unsafe.Pointer)(elem) = vmem
}
typedmemmove(t.key, insertk, key)
*inserti = top
h.count++
```


第七步，释放写 flag，返回值指针。  


```
done:
if h.flags&hashWriting == 0 {
    throw("concurrent map writes")
}
h.flags &^= hashWriting
if t.indirectelem() {
    elem = *((*unsafe.Pointer)(elem))
}
return elem
```


这里没有值赋值的步骤，甚至函数参数都没有值的参数。  
这是因为相关代码编译器会动态生成进行赋值。  



## 六、删除操作  


删除操作底层调用的是`mapdelete` 函数。  


大部分代码与赋值类似，先循环寻找。  


没找到万事大吉，啥都不需要做，释放 flag 即可。  


找到了，就调用 `memclrXXX` 函数把 key 和 value 都清空，并在 tophash 上标记节点为空。  


紧接着，还需要做一个特殊逻辑：判断这个节点是不是最后一个节点。  


```
b.tophash[i] = emptyOne

if i == bucketCnt-1 {
    if b.overflow(t) != nil && b.overflow(t).tophash[0] != emptyRest {
        goto notLast
    }
} else {
    if b.tophash[i+1] != emptyRest {
        goto notLast
    }
}
for {
    b.tophash[i] = emptyRest
    if i == 0 {
        if b == bOrig {
            break // beginning of initial bucket, we're done.
        }
        // Find previous bucket, continue at its last entry.
        c := b
        for b = bOrig; b.overflow(t) != c; b = b.overflow(t) {
        }
        i = bucketCnt - 1
    } else {
        i--
    }
    if b.tophash[i] != emptyOne {
        break
    }
}
```


如果是最后一个节点了，就需要标记 tophash 为 emptyRest。  


判断算法也不难。  
首先判断下一个节点是不是 emptyRest，不是了就结束了。  
如果下一个节点是 emptyRest，则逆序一个个向上判断。  


一个 bucket 内可以使用下标后推。  
对于链表中上一个 bucket，就暴力扫描链表，寻找到上一个 bucket。  


算法简单粗暴。  



对了，清理 flag 使用的是 `h.flags &^= hashWriting`。  
这个运算符是啥意思呢？  



## 七、迭代器  


对于 slice 的迭代，下标就直接实现了。  


那对于 map 的迭代器如何实现呢？  


这里还是在编译器层面实现的。  


迭代的索引数据都储存在 `hiter` 结构中，底层会调用`mapiterinit`进行初始化，调用 `mapiternext` 访问下一个。  


前面了解了 map 的储存结构，我们知道会有一个 buckets，每个 bucket 又会有 8 个 bmap，每个 bmap 又是一个链表。  


我们只需要初选当前处于哪个 bucket，以及处于链表的哪个节点 bmap，以及扫描到哪个偏移量，就可以正常遍历所有数据了。  



而对于扩容期间，则稍微复杂一些。   


```
if h.growing() && it.B == h.B {
    oldbucket := bucket & it.h.oldbucketmask()
    b = (*bmap)(add(h.oldbuckets, oldbucket*uintptr(t.bucketsize)))
    if !evacuated(b) {
        checkBucket = bucket
    } else {
        b = (*bmap)(add(it.buckets, bucket*uintptr(t.bucketsize)))
        checkBucket = noCheck
    }
} 
```

对于未迁移的数据，这里利用了一个性质。  


假设当前 bucket 是 `1010`  
如果数据没有迁移，则肯定在旧 bucket 内，此时新的 `bucket(01010)` 肯定没有数据，新的 `bucket(11010)` 也保证没数据。  
如果迁移数据了 数据要么在 `bucket(01010)` 内，要么在`bucket(11010)`内。  


这里很巧妙的就把新旧 hash 表的所有数据扫描完了，还不会漏。  


如果你理解了这个算法，就会发现这个扫描过程非常奇妙。  
随着 bucket 递增，一会会扫描旧的 buckets，一会会扫描新的 buckets。  
扫描哪一个完全看旧的 bucket 是否已经迁移数据。  


不知道有没有人把这个迭代过程组成动画，看起来会非常有趣吧。  



## 八、清空操作  

底层还提供了清空操作，实现就简单粗暴了。  
直接将旧的 buckets 设置为 Nil，新的 buckets 重新分配内存即可。  


```
h.oldbuckets = nil
h.nevacuate = 0
h.noverflow = 0
h.count = 0

h.hash0 = fastrand()

if h.extra != nil {
    *h.extra = mapextra{}
}

_, nextOverflow := makeBucketArray(t, h.B, h.buckets)
if nextOverflow != nil {
    h.extra.nextOverflow = nextOverflow
}
```


## 九、最后  


map 的代码完整看完后，发现有两个地方算法比较有趣。  


一个是双 buckets 进行数据迁移，一个是迭代器进行扫描双 buckets。  


而且根据迭代器的算法实现，迭代期间是允许进行删除操作的。  
如果迭代开始的时候没有扩容，之后进行了插入元素操作，则可能因为扩容而导致扫描不全、多扫描数据、漏数据。  
如果迭代的时候已经在扩容了，之后没有插入元素，之后修改操作，则可能导致重复扫描数据。  


当然，迭代器循环期间，还是不建议修改 map 的，尤其是插入元素，行为太不确定了。  


另外，可以发现当前的源码是不支持并发操作的，所以 map 不是并发安全的。  
如果要实现一个并发安全的 map，就需要自己封装一下，或者自己去实现 map 了。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

