---   
layout:     post  
title: 阅读 RapidJSON 官方文档，发现一个坑  
description: 有几个坑，你们踩到了吗   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 一、背景  


在文章《[高端的写 if 与 else](https://mp.weixin.qq.com/s/Ot4FgN-BQs07fLg7t8g-lQ)》中提到，我实现了一个小的流式引擎。  
其中每个图的配置是使用 json 的形式存储在 DB 中。  


这里就需要一个 json 库来解析这些 json 配置。  


我们内部有一个自研的 json 库，使用起来特别爽，已经跑了七八年了，久经考验。  
很早之前也听说业界有一个出名的 RapidJSON 库，号称性能第一。  


于是我打算使用这个 RapidJSON  解析我的 json 配置。  


结果使用的时候，发现 RapidJSON  的语法各种反人性，于是我花了几个小时把 RapidJSON  官方文档全部阅读了一下。  


文档全文阅读之后，了解到，原来是为了性能与架构设计的解耦，最终牺牲了使用体验。  


下面我们就来看看 RapidJSON  的相关知识吧。  


## 二、简介  


RapidJSON  是一个高效的 C++ JSON 解析／生成器，提供 SAX 及 DOM 风格 API。  


1.0 为最早版本，发布于 2015 年。  
1.1 为最新版本，发布于 2016 年。  


官网地址：http://rapidjson.org/  


## 三、序列化与反序列化 


1、字符串转 json  


```
const char* json = "{\"a\":\"1\",\"b\":2}";

Document d;
d.Parse(json);

if(d.HasParseError()){
    printf("ret=%d\n", d.GetParseError());
}
```


需要定义一个 Document 对象，通过 Parse 函数解析。  


需要注意的是，Parse 函数的参数不支持 `std::string`。  


2、json 转字符串  


```
StringBuffer buffer;
Writer<StringBuffer> writer(buffer);

d.Accept(writer);

printf("%d\n", buffer.GetSize());
printf("%s\n", buffer.GetString());
```


由于架构上设计的解耦，这里序列化比较麻烦。  


## 四、数据类型  


与 JSON RFC7159 标准一致，支持 字符串、整数、浮点数、true、false、数组、对象、NULL 等。  


可以通过 isXXX 来判断当前 value 是不是某个类型。  


![](http://rea.tiankongsue.com/images/2020/06/26/001.png)


对于每个 value，我们还可以通过 set/get 来取值与设置值。  


```
Value  a(1);

a = 2;

a.SetInt(3);
a.GetInt();

a.SetInt64(4);
a.SetBool(true);
a.SetNull();
```

## 五、字符串  


RapidJSON  为了高性能，默认所有操作都是引用或者 Move 操作。  


所以在赋值的时候需要特别注意了。  


比如对于字符串，设置值的时候，如果想要复制而不是引用，要显示的声明出来。  


```
Value author
char buffer[10] = "hello word";

// 常量字符串只储存指针
author.("hello word");

//下面这句会编译错误
author.(buffer);

//强制储存指针
author.(StringRef(buffer));

// 复制字符串
author.SetString(buffer, len, document.GetAllocator());
```


上面列举了常见的集中情况。  


对于常量字符串，可以确定整个生命周期都是安全的，所以直接储存指针。  
对于指针字符串，语法上就不能编译通过。
如果确定指针常量字符串，可以主动声明，从而避免复制。  
其他情况，只能主动声明需要申请内存了。  


## 六、数组  


数组的操作与 std::vector 类似。  
唯一的区别是需要自己传一个内存管理类，这点使得数组的语法非常丑陋。  


```
Value a(kArrayType);
Document::AllocatorType& allocator = document.GetAllocator();

a.Clear();
a.Reserve(10, allocator);
a.PushBack(1, allocator);
a.PopBack();
a.Erase(a.Begin());
```


另外 RapidJSON  支持 java 的 Fluent interface 功能。  


```
a.PushBack(1, allocator).PushBack(2, allocator);
```


另外，有三个方法来遍历数组。  


1、索引法  


```
const Value& a = document["a"];
assert(a.IsArray());
for (SizeType i = 0; i < a.Size(); i++) {
    printf("a[%d] = %d\n", i, a[i].GetInt())
}
```


2、迭代器法  


```
for (Value::ConstValueIterator itr = a.Begin(); itr != a.End(); ++itr)
    printf("%d ", itr->GetInt());
```


3、c++11 法  


其实就是迭代器的方法，只需要实现指定的几个迭代器方法接口。  


```
for (auto& v : a.GetArray())
    printf("%d ", v.GetInt());
```


## 七、对象  


对象与 std::map 类似。  


这里有一个大坑，Rapidjson 的对象查找复杂度是 O(n) 的，注意被坑。  


```
Value contact(kObject);
Document::AllocatorType& allocator = document.GetAllocator();

contact.AddMember("name", "tiankonguse", allocator);
contact.AddMember("sex", "male", allocator);
contact.AddMember("wx", "", allocator);
contact["wx"] = "tiankonguse-code";

contact.RemoveMember("name");

auto itr = d.FindMember("hello");
if(itr == d.MemberEnd()) {
    printf("no find\n");
}
```

前面提到，RapidJSON  的一切操作都是引用或者 move，那该如何 copy 呢？  


有点麻烦，我们需要先手动构造出 key 和 value。  


```
// 显式 copy，隐式 move
Value key("name", allocator );
Value val("tiankonguse", allocator );
contact.AddMember(key, val, allocator );

// 参数中进行 copy 与 move
contact.AddMember(
Value("sex", allocator).Move(), 
Value("male", allocator).Move(),
allocator);
```


遍历 对象也有两个方法。  


1、迭代器法 


STL 中，迭代器 key 的名字是 first，value 的名字是 second。  
RapidJSON 中，key 的名字是 name，value 的名字是 value。  


```
for (auto itr = d.MemberBegin(); itr != d.MemberEnd(); ++itr) {
    printf("name=%s, valyetype=%d\n", itr->name.GetString(), itr->value.GetType());
}
```


2、c++11法  


```
for (auto& m : d.GetObject())
    printf("Tname=%s valueType=%d\n", m.name.GetString(), m.value.GetType());
```


## 八、最后  


到这里 RapidJSON 的所有类型就都介绍完了。


有人问，我就是想深拷贝一个对象怎么办，那只能显示的调用深拷贝函数了。  


```
Value v1("foo");

Value v3;
// v1 数据不见了
v3 = v1;

//隐式深拷贝
Value v2(v1, allocator);

// 显示的深拷贝
v3.CopyFrom(v1, allocator);
```

看到到这里，你应该就能随意的使用 RapidJSON  了。  


总结一下潜在的坑，大概有下面几个。  


1、赋值是 move 操作。  
2、常量数组只储存了指针。  
3、map 使用数组实现，查询性能低。  
4、使用map的`[]`操作符时，对应的 key 必须存在，否则 coredump。  
5、语法复杂，一不小心就出错了。  


对了，阅读 RapidJSON 官方文档的时候，发现网站上的大部分链接都是 404 死链。  
有认识 RapidJSON 官方文档 负责人的可以修复一下，不然挺影响文档的查看的。  



思考题：你们团队使用 RapidJSON 吗？有什么坑吗？  




《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

