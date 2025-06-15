---   
layout:     post  
title: cpp 单元测试总结  
description: 很基础的知识，花几分钟来回顾一下？   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2021-03-09 21:30:00  
published: true  
---  


## 零、背景 


2020 年 6 月份，我正式开始写单元测试，并在文章《[接入单元测试，真香](https://mp.weixin.qq.com/s/aWTQkK8U1wXRmMqf8SxVag)》中介绍了如何安装、编译、使用。  


2020 年 12 月份，那时我已经写单元测试半年了，在文章《[轻松理解单元测试中 mock](https://mp.weixin.qq.com/s/LC4DOHRpHO9gmyD1LVmDxw)》中介绍了基本的单元测试的基本用法。  


最近，我梳理总结了下单元测试常用的写法，感兴趣的可以花几分钟快速来看看，复习一下。  


## 一、基本检验测试  

单元测试的目的是测试一段代码的正确性。  
在程序里面，一段代码的调用往往使用函数来表示。  
所以，单元测试往往是测试一个函数的正确性。  


对于一个函数，往往有若干输入与若干输出，而且对于固定的输入有固定的输出（使用随机函数的除外）。  
所以单元测试就是使用固定的输入，来检验函数是否按照预期的方式，输出了固定的输出。  


检验手段很多，大概如下：  


```
TEST(Demo, demo) {
    EXPECT_TRUE(condition);  // 真值
    EXPECT_FALSE(condition); // 假值
    EXPECT_EQ(val1, val2);   // 相等
    EXPECT_NE(val1, val2);   // 不等
    EXPECT_LT(val1, val2);   // 小于
    EXPECT_LE(val1, val2);   // 小于等于
    EXPECT_GT(val1, val2);   // 大于
    EXPECT_GE(val1, val2);   // 大于等于
    EXPECT_STREQ(str1, str_2); // 字符串等于
    EXPECT_STRNE(str1, str2);  // 字符串不等
    EXPECT_STRCASEEQ(str1, str2); // 字符串忽略大小写等于
    EXPECT_STRCASENE(str1, str2); // 字符串忽略大小写不等
}
```

当然，除了`EXPECT_*` 前缀的检验宏函数外，还有`ASSERT_*`前缀的宏函数。  
前者代表预期判断，不管是否符合预期，都继续执行。  
后者代表断言判断，不符合预期就停止向下执行。  


## 二、解决依赖 MOCK

对于纯 CPU 函数，我们可以直接调用，然后来检查是否符合预期。  
但是函数有外部依赖时，我们就需要通过 MOCK 的方法来解除外部依赖。  


在 CPP 语言中，标准情况下，是通过虚函数的多态来解决依赖的。  
这也是为什么，我之前一直在强调，MOCK 的本质就是多态，当然，正常情况下是这样的。  


由于正常情况下使用多态来解决依赖，这就对依赖对象有两点要求。  


1）依赖的对象使用指针的方式调用。  
2）依赖的对象支持多态，即被调用的函数是虚函数。  
 

比如下面的样子，我们要对 类 RouteApi 的 Add 函数进行单元测试，`api_` 成员是支持多态的指针。    


```
class RouteApi{
     int Add(int a, int b){
         return api_->ExAdd(a, b);
     }
  RouteApiWrap* api_;
};
```

此时，我们就可以在单元测试文件里继承依赖对象，进行常规的 MOCK 了。  


```
class MockRouteApiWrap : public RouteApiWrap {
  public:
    virtual ~MockRouteApiWrap() {}
    MOCK_METHOD2(ExAdd, int(int, int));
};

TEST(Demo, demo) {
    MockRouteApiWrap wrap;

    // 下面这段代码是啥意思呢？ 下文会讲解  
    EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
    .WillOnce(testing::Return(2)))
    .WillRepeatedly([&](int a, int b) {
        return a + b;
    });

    RouteApi route_api;
    route_api.SetWrap(&wrap);

    EXPECT_EQ(2, route_api.Add(1, 1));
    EXPECT_EQ(3, route_api.Add(1, 2));
}
```


## 三、测试私有函数  


如果被测试的函数是私有函数，我们会发现没法直接调用这个函数。  


这个时候，就需要使用一个宏替换的方式，在编译阶段，通过宏替换的方式，把这个私有函数转变为公开函数。  


```
#define private public

#include "server.h"

TEST(Demo, demo){
    Server server; 
    // 这里可以直接调用 Server 的私有函数了
}
```


## 四、依赖是对象  


上面介绍了怎么测试私有函数，是为了让大家了解到，我们可以在编译阶段对代码进行替换。  


根据这个思路，我们还可以对类的成员变量进行替换，这样，我们就可以对非指针的成员变量进行 mock 了。  


比如下面的代码，是不可 mock 的。  


```
#ifdef DO_UNIT_TEST
#include "mock.h"
#endif // DO_UNIT_TEST

class RouteApi{
     int Add(int a, int b){
         return api_.ExAdd(a, b);
     }
  RouteApiWrap api_;
};
```

大家也许注意到了，我在上面的代码里面多加了一行头文件。  


这行头文件的作用是，我们进行单元测试时，这个头文件会生效，从而能够替换类里面的对象 api_。  


比如 `mock.h` 里面的代码如下，这样就完成了替换。  

```
#define RouteApiWrap MockRouteApiWrap

class MockRouteApiWrap {
    virtual ~MockRouteApiWrap() {}
    MOCK_METHOD2(ExAdd, int(int, int));
}
```

使用的时候，就可以直接对 `api_` 设置预期行为了。  


## 五、预期行为  


对于 MOCK 的函数，我们可以设置预期的行为，从而能够控制被测程序的行为。  


比如下面这段代码。  


```
EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
.WillOnce([&](int a, int b) {
    return a + b + 1;
})
.WillRepeatedly([&](int a, int b) {
    return a + b;
});
```


`EXPECT_CALL` 代表对 `wrap` 类的 `ExAdd` 函数设置预期行为。  
`ExAdd` 后面的两个 `::testing::_` 可以认为是这个函数的两个参数，这里代表任意值。  
`WillOnce` 代表后面的 lambda 表达式只执行一次。  
`WillRepeatedly` 代表后面的 lambda 表达式可以执行无数次。  


## 六、运行次数  


由于单元测试要求所有行为都在预期之内，所以每个函数被调用几次也应该是预期之内。  
因此，测试框架会严格检查预期行为的次数与实际执行次数是否完全相等。  


因此，上一小节里，`WillOnce`和`WillRepeatedly`就代表至少运行一次，向上次数无限制。  


这时就有人说，既然每个函数执行几次都是完全确定的。  
那能不能强制检查这个次数呢？而不是向上无限制。  


具体来说，就是使用 `Times` 函数来设置。  


```
EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
.Times(5)
.WillOnce([&](int a, int b) {
    return a + b + 1;
})
.WillRepeatedly([&](int a, int b) {
    return a + b;
});
```

还是上面那个代码，加上`Times(5)`就代表预期行为总共执行 5 次，即 `WillOnce` 执行一次，`WillRepeatedly` 执行 4 次。  



## 七、直接返回值  


上面可以看到，每个预期行为都要写一个 lambda 表达式。  


实际上，对于返回值固定的场景，可以直接构造一个返回值的。  
当然，这个方式是 Lambda 表达式的语法糖。  


```
EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
.WillOnce(::testing::Return(3));
```

如上图，通过`::testing::Return`来直接返回固定的值 3。  


那有时候，希望通过参数的形式返回值该怎么办呢？  


```
EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
.WillOnce(SetArgReferee<0>(11));
```


我们通过`SetArgReferee` 可以做到这点。  



那我们想要设置多个参数值，以及设置函数的返回值，该怎么做呢？  


```
EXPECT_CALL(wrap, ExAdd(::testing::_, ::testing::_))
.WillOnce(DoAll(SetArgReferee<0>(11), SetArgReferee<1>(22), Return(33)));
```


如上，可以使用`DoAll`将`SetArgReferee` 和 `Return` 包起来，这样就可以同时参数的值以及返回值了。  



## 八、参数匹配  


大家可以看到，`ExAdd(::testing::_, ::testing::_)` 里面的两个参数分别使用 `::testing::_` 代替了。  


实际上，这连个参数是用来匹配参数的，`_` 的意思是都匹配。  


这个有什么用呢？  
可以想象，我们的函数很复杂，会调用依赖接口很多次。  
而依赖接口的返回值很巧与第一次输入有关。


第一次输入是 10 了，接下里预期行为有好几个。  
第一次输入是 20 了，接下来的预期行为是另外好几个。  


面对这种场景，使用常规的方法，我们需要枚举所有的预期函数。  


但是我们使用参数匹配，就可以几行代码，轻松设置预期行为。  



```
EXPECT_CALL(wrap, ExAdd(30))
.Times(5)
.WillOnce(Return(31))
.WillRepeatedly(Return(32));

EXPECT_CALL(wrap, ExAdd(40))
.Times(7)
.WillOnce(Return(41))
.WillRepeatedly(Return(42));
```


如上图，请求参数是 30 的都会命中第一个，而请求参数是 40 的都会命中第二个。  


## 九、资源准备  


单侧的环境分三个级别：函数级别、类级别、全局级别。  


所以我们在运行三个级别的代码时，可以提前或者最后运行一段固定的代码，比如创建资源与回收资源。  


函数级别是`SetUp`和`TearDown`,每个测试用例都会执行一次。  


```
class RouteApiTest : public ::testing::Test {
    virtual void SetUp() {}
    virtual void TearDown() {}

}
TEST_F(RouteApiTest, RequiredTables) {
    //...
}
```


类级别是`SetUpTestCase`和`TearDownTestCase`。每个类都会执行一次。  


```
class RouteApiTest : public ::testing::Test {
    static void SetUpTestCase(){}
    static void TearDownTestCase(){}    
}
TEST_F(RouteApiTest, RequiredTables1) {
    //...
}
TEST_F(RouteApiTest, RequiredTables2) {
    //...
}
```


全局级别，则是整个程序只运行一次。  


```
class TestEnvironment : public ::testing::Environment {
public:
    // Initialise the timestamp in the environment setup.
    virtual void SetUp() {  }    
    virtual void TearDown() {  }
};

int _main(int argc, char* argv[]) {
    ::testing::InitGoogleTest(&argc, argv);
    // gtest takes ownership of the TestEnvironment ptr - we don't delete it.
    ::testing::AddGlobalTestEnvironment(new TestEnvironment);
    return RUN_ALL_TESTS();
}
```

## 十、最后  


好了，这里分享了九个知识点。  


分别是基础检验、依赖 MOCK、私有函数、替换不可MOCK对象、预期行为、运行次数、返回值、参数匹配，以及资源准备与释放。  


通过这九个知识点，你就可以轻松的写单元测试了。  



加油，技术人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

