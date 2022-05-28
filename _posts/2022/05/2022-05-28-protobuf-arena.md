---   
layout: post  
title: protobuf arena 的源码实现及注意实现  
description: 如何开启、源码实现、注意事项。  
keywords: protobuf  
tags: [程序人生]    
categories: [程序人生]  
updateData: 2022-05-28 18:13:00  
published: true  
---  


## 一、背景  


之前提到，我的项目[升级了 protobuf，并开启了 protobuf arena 功能，性能至少提升 20%](https://mp.weixin.qq.com/s/RAQkFkI9ln464tMnlem1wQ)。  



后来我对两个功能分别进行压测，发现升级到 protobuf3 和 arena 分别有不少性能提升，两个结合起来，性能提升实际上至少有 40%。  


关于 arena 的使用与注意实现，实际上在 protobuf 的官网文档上都有介绍。  


地址： https://developers.google.com/protocol-buffers/docs/reference/arenas  



所以，使用与注意实现这里只简单介绍下，重点介绍代码实现。  


## 二、使用最佳实践  


protobuf 2 和 protobuf 3 都支持 arena，都是加一行配置即可。  


配置如下：  


```
option  cc_enable_arenas = true;  
```


使用的时候，通过 arena 来分配 protobuf message 对象即可。  


```
#include <google/protobuf/arena.h>
google::protobuf::Arena arena;
MyMessage* message = google::protobuf::Arena::CreateMessage<MyMessage>(&arena);
```


当时，实际编码过程中，为了方便对比，我使用宏来控制使用开启 arena。  


```
  MyMessage* message = nullptr;
#if defined(PROTO_USE_ARENA)
  google::protobuf::Arena arena_message;
  message = google::protobuf::Arena::CreateMessage<MyMessage>(&arena_message);
#else
  MyMessage message_ex;
  message = &message_ex;
#endif
```


这样，只需要一个编译宏参数，就可以控制是否开启 arena 了。  



PS：如果看了下面的代码，会发现，使用 `CreateMaybeMessage` 会更简洁。   



## 三、代码实现与注意事项  


1、使用 CreateMessage 创建无 arena option 的 message，会编译失败。  


相关源码如下：  


```
template <typename T, typename... Args>
static T* CreateMessage(Arena* arena, Args&&... args) {
  static_assert(
      InternalHelper<T>::is_arena_constructable::value,
      "CreateMessage can only construct types that are ArenaConstructable");
  // We must delegate to CreateMaybeMessage() and NOT CreateMessageInternal()
  // because protobuf generated classes specialize CreateMaybeMessage() and we
  // need to use that specialization for code size reasons.
  return Arena::CreateMaybeMessage<T>(arena, std::forward<Args>(args)...);
}
```


`static_assert` 用于编译器判断是否符合预期， false 就触发编译失败。  
`InternalHelper<T>::is_arena_constructable::value` 用于判断协议是否开启 arena，没开启就返回 false，从而触发编译失败。  


`is_arena_constructable` 的实现依靠了 cpp 强大的模板技术，代码如下。  


首先定义两个只有声明的模板函数 `ArenaConstructable`。  
对于开启 arena 的 message，会内置一个 `InternalArenaConstructable_` 类型，从而命中返回值为 char 的模板函数。  
其他情况，会命中返回值是 `double` 的模板函数。  


```
template <typename T>
class InternalHelper {
  template <typename U>
  static char ArenaConstructable(const typename U::InternalArenaConstructable_*);
  
  template <typename U>
  static double ArenaConstructable(...);

  typedef std::integral_constant<bool, sizeof(ArenaConstructable<T>(
                                           static_cast<const T*>(0))) ==
                                           sizeof(char)>
    is_arena_constructable;  
}
```



不同的返回值类型会有不同的 sizeof，从而可以比较得到 true 与 false。  


最后通过 `std::integral_constant` 的 `value` 静态变量，把这个 true 或 false 返回出去的。  



2、外层 Message 开启 Arena，递归依赖的某个 Message 未开启 Arena，可以正常使用。  



协议里随便找一个内嵌的 Message，看代码可以发现调用的还是 `CreateMaybeMessage`。  


```
MessageInner * Message::mutable_inner() {
  if (inner_ == nullptr) {
    auto* p = CreateMaybeMessage<MessageInner>(GetArenaNoVirtual());
    inner = p;
  }
  return inner_;
}
```


查看 `CreateMaybeMessage` 源码，可以发现，开启 arena 会调用 `CreateMessageInternal` 函数，未开启则会调用 `CreateInternal` 函数  


```
// CreateMessage<T> requires that T supports arenas, but this private method
// works whether or not T supports arenas. These are not exposed to user code
// as it can cause confusing API usages, and end up having double free in
// user code. These are used only internally from LazyField and Repeated
// fields, since they are designed to work in all mode combinations.
template <typename Msg, typename... Args>
static Msg* DoCreateMaybeMessage(
    Arena* arena, std::true_type, Args&&... args) {
  return CreateMessageInternal<Msg>(arena, std::forward<Args>(args)...);
}
template <typename T, typename... Args>
static T* DoCreateMaybeMessage(
    Arena* arena, std::false_type, Args&&... args) {
  return CreateInternal<T>(arena, std::forward<Args>(args)...);
}
template <typename T, typename... Args>
static T* CreateMaybeMessage(
    Arena* arena, Args&&... args) {
  return DoCreateMaybeMessage<T>(arena, is_arena_constructable<T>(),
                                 std::forward<Args>(args)...);
}
```


一层层看下去，会发现调用路径如下：  


```
DoCreateMaybeMessage(arena)

// 开启 arena
CreateMessageInternal(arena)
arena->DoCreateMessage
AllocateInternal<T>
InternalHelper<T>::Construct

// 未开启 arena
CreateInternal(arena)
arena->DoCreate
AllocateInternal<T>
```


`AllocateInternal` 函数会在 arena 上申请内存。  
之后，内存进行初始化的时候，开启 arena 时，会调用 Message 的带 arena 的构造函数。  
未开启时，就调用普通的构造函数。  


待 arena 的构造函数如下  


```
MyMessage::MyMessage(::PROTOBUF_NAMESPACE_ID::Arena* arena)
  : ::PROTOBUF_NAMESPACE_ID::Message(),
  _internal_metadata_(arena){
  SharedCtor();
  RegisterArenaDtor(arena);
}
```


就这样，protobuf 的结构可以理解为一个树，从根节点开始， arena 可以一层层传下去。  
一旦某个节点没有开启 arena，这个节点作为根的子树就不会使用 arena。  
但是这个只影响性能，不影响正常使用。  



3、右值可能失效  


读代码可以发现，如果在同一个 Arena 上，会触发 swap，否则就是 copy 构造函数。  


```
Message(Message&& from) noexcept
  : Message() {
  *this = ::std::move(from);
}
Message& operator=(Message&& from) noexcept {
  if (GetArenaNoVirtual() == from.GetArenaNoVirtual()) {
    if (this != &from) InternalSwap(&from);
  } else {
    CopyFrom(from);
  }
  return *this;
}
```


4、swap 可能失效  


与右值复制一样，如果两个 arena 相同，就会触发连个 copy。  


```
void QueryReq::Swap(QueryReq* other) {
  if (other == this) return;
  if (GetArenaNoVirtual() == other->GetArenaNoVirtual()) {
    InternalSwap(other);
  } else {
    QueryReq* temp = New(GetArenaNoVirtual());
    temp->MergeFrom(*other);
    other->CopyFrom(*this);
    InternalSwap(temp);
    if (GetArenaNoVirtual() == nullptr) {
      delete temp;
    }
  }
}
```


## 四、arena 内存管理  


还记得我们上面定义的 Arena 对象吗？  


这个对象里有一个类型 `internal::ArenaImpl`，用于内存管理。  


简单看了 Arena 的代码，发现 Arena 的内存管理不像我们想象的 tcmalloc 那样是常驻内存。  


每定义一个 Arena ，就会独立申请一片内存。  
Arena 析构的时候，这片内存也全部释放。  


那 Arena 为啥可以提高性能呢？  
分析一下， Arena 主要解决了大量小内存频繁申请与释放内存导致的性能损耗。  


Arena 一次申请很大的连续的内存，用于给绑定在 Arena 对象的 Message 分配内存。  


具体来说，Arena 第一次会申请一个 256 大小的内存，称为 Block。  
当剩余的内存时不够时，就使用二倍法申请一个更大的内存，使用链表的形式串起来。  


这样做简单粗暴，但是解决了内存碎片问题。  


## 五、最后  


看了 protobuf 的 Arena 源码，项目中还是有收获的。  


起初还想把 Arena 的 CreateMessage 函数全部替换为 CreateMaybeMessage 函数，从而来兼容了未开启 arena 的 Message。  
现在看来，还是有内存浪费和适当的性能损耗的。  
所以代码还是保持为宏的形式比较好。  


几个版本迭代之后，线上验证功能稳定后，再修改为只保留 Arena 的形式就好了。  





加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

