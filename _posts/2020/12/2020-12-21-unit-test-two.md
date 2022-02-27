---   
layout:     post  
title: 理解单元测试中 mock, 覆盖率轻松 100% 
description: 最近在写单元测试，理解了 mock 的本质，覆盖率轻松到达 100%。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-12-21 21:30:00  
published: true  
---  


## 零、背景  


最近在加班赶项目，所以这周就没参加 leetcode 的周赛和其他比赛。  


现在有点时间，总结下我对单元测试中 mock 的一些理解。  


## 一、入门  


大概一年前，我写了单侧的入门文章：《[三十分钟接入单元测试，真香](https://mp.weixin.qq.com/s/aWTQkK8U1wXRmMqf8SxVag)》。


上篇文章总结一下，单侧就是运行编写的一个代码块（一般是函数或者类的方法），通过各种输入验证这个代码块的正确性。  


如果代码块是纯的 CPU 计算，没有外部依赖（读DB等网络操作），那就可以直接运行来测试代码块的正确性。  
如果代码块需要进行网络操作，很多人就比较困惑了，该如何才能进行测试呢？  


下面我们来看看解决外部依赖的方法。  


## 二、解除外部依赖   


不同语言或不同框架对解除外部依赖的名字叫法都不一样，我们姑且统一叫做 mock 。  


mock 的含义是，自己实现的代码块把外部依赖对象的代码块替换掉。  
当需要运行外部依赖对象的代码块时，运行自己实现的代码块。  


对于解释型语言(python、js)或者半解释型语言(java)，mock 的方法比较多，既可以使用面向对象的方法 mock ，也可以运行时通过黑科技手段来 Mock。  


而对于编译型语言(cpp, go)，则只能使用面向对象的方法来 mock 了。  


面向对象 mock 的本质就是多态.
具体实现方法是一种设计模式，叫做依赖注入。



## 三、自己实现 mock 


日常开发中，我们写的类经常会一个方法调用另外同一个类中的其他方法。  

例如下面的 `Server` 类的 `IncEx` 方法会调用 `Inc` 方法。  


```
class Server {
 public:
  virtual ~Server() {}
  virtual int Inc(int* a) {
    (*a)++;
    return 0;
  }
  virtual int IncEx(int* a) {
    int ret = 0;
    ret = Inc(a);
    if (ret != 0) {
      return ret;
    }
    *a = *a * 2;
    return ret;
  }
};
```

我们对 `IncEx` 进行单侧时会发现依赖 `Inc` 函数。  
有时候需要构造`Inc` 函数的各种返回值来测试 `IncEx` 函数。  


这个时候，就需要对 `Inc` 进行 mock 了。  


前面提到， mock 的本质就是多态，所以我们需要继承这个类，然后实现需要 Mock 的函数。  


```
class MockServer : public Server {
 public:
  virtual ~MockServer() {}

  int Inc(int* a) override {
    if (*a == 1) {
      return 1;
    }
    (*a)++;
    return 0;
  }
};

TEST(Server, IncEx) {
  MockServer mockServer;
  int a = 1;
  EXPECT_EQ(mockServer.IncEx(&a), 1);
  EXPECT_EQ(a, 1);

  a = 2;
  EXPECT_EQ(mockServer.IncEx(&a), 0);
  EXPECT_EQ(a, 6);
}
```


大概像上面的 `MockServer`，我们成功对 `Inc` 进行了 mock，并测试了`IncEx` 函数。  

如果我们想要动态控制 `Inc` 的逻辑，通过动态 `lamba` 表达式也可以做到。


```
class MockServer : public Server {
 public:
  virtual ~MockServer() {}

  typedef std::function<int(int*)> IncFun;

  void SetInc(IncFun inc_fun){
    inc_fun_ = inc_fun;
  }
  int Inc(int* a) override {
    return inc_fun_(a);
  }
  IncFun inc_fun_;
};

TEST(Server, IncEx) {
  MockServer mockServer;

  int a = 1;
  mockServer.SetInc([](int* a){ return 1; });
  EXPECT_EQ(mockServer.IncEx(&a), 1);
  EXPECT_EQ(a, 1);

  a = 2;
  mockServer.SetInc([](int* a){ (*a)++; return 0;});
  EXPECT_EQ(mockServer.IncEx(&a), 0);
  EXPECT_EQ(a, 6);
}
```


而如果要做更复杂的控制，比如第几次调用 `Inc` 函数返回什么值得时候，就需要保存一个 `lamba` 表达式的列表，每个 `lamba` 还有一个附加参数，来控制运行几次，满足什么条件来运行等等。 


## 三、google mock 


上面实现的基本功能，以及想象的更复杂的控制功能，google mock 已经都封装好了，我们直接来拿来用就行了，没必要自己造一个轮子。


google mock 使用也很简单，就像下面的样子。  


```
class MockServer : public Server {
 public:
  virtual ~MockServer() {}

  MOCK_METHOD1(SetInc, bool(int* a));
};

TEST(Server, IncEx) {
  MockServer mockServer;

  EXPECT_CALL(mockServer, SetInc(::testing::_))
      .WillOnce(testing::Return(1))
      .WillRepeatedly([](int* a) { (*a)++; return 0; });

  int a = 1;
  EXPECT_EQ(mockServer.IncEx(&a), 1);
  EXPECT_EQ(a, 1);
  a = 2;
  EXPECT_EQ(mockServer.IncEx(&a), 0);
  EXPECT_EQ(a, 6);
}
```


可以发现，在 `MockServer` 中，只有一行代码。  


最前面的 `MOCK_METHOD1` 代表要 mock 一个函数，后缀上的数字代表这个函数的参数个数。  
括号里左边就是要 Mock 的函数名字，右边是函数的声明签名。  


不要小看这行代码，背后宏展开后，做了很多事情，其中就做我们上面定义的 lamba 表达式的管理。  


在 `TEST` 中，我们需要先定义具体 `MockServer` 的实例，可以解释下具体含义。  


`EXPECT_CALL` 声明一个调用期待，就是要具体 Mock 的对象和方法。  
`mockServer` 要 Mock 的对象。  
`SetInc(::testing::_)` 要 Mock 对象的方法，初级使用时就将所有参数写成 `::testing::_` 即可。  
`WillOnce`  表示括号里的 lamba 表达式只能执行一次。  
`testing::Return` lamba 表达式的语法糖，如果希望直接返回固定的返回值，可以使用这个直接构造。  
`WillRepeatedly` 表示括号里的 lamba 表达式执行无数次。  


当然，还有几个其他的函数，我们这里就不展开讲了。  


这个 google mock 的功能有上面我们自己实现的 mock 是等价的。  


## 四、解除外部依赖


如果没有外部依赖，我们已经学会怎么轻松 mock 了。  


但是实际项目中，我们往往会依赖一些外部库，这些库还会进行 rpc 网络调用。  


比如下面的函数，需要查询 DB。  


```
class Server {
 public:
  virtual ~Server() {}
  virtual int IncEx(int* a) {
    return db_.get(a);
  }
  DB db_;
};
```

如果没写过单侧的人，看到这个问题就会纳闷了：该怎么 mock db 这个对象呢？  


有这个疑惑是正常的，因为上面这段代码是不可单侧的。  


解决方其实很简答，db 这个对象从外面动态传进来就行了。  
这个方法是个著名的设计模式，叫做依赖注入。  


具体代码如下：  


```
class Server {
 public:
  virtual ~Server() {}
  virtual void Init(DB* db){
    db_ = db;
  }
  virtual int IncEx(int* a) {
    return db_->get(a);
  }
  DB* db_;
};
```


这样之后，我们可以 Mock DB 对象，然后将 MockDB 的指针传进来了。  


```
class MockDB: public DB {
 public:
  virtual ~MockDB() {}

  MOCK_METHOD0(get, int(int* a));
};

TEST(Server, IncEx) {
  Server server;
  MockDB mock_db;
  server.Init(&mock_db);

  EXPECT_CALL(mock_db, get(::testing::_)).WillOnce(testing::Return(1));

  int a = 1;
  EXPECT_EQ(server.IncEx(&a), 1);
```

当然，看到这里，聪明的你肯定注意到一件事：被 mock 对象的方法一定要是 virtual 的，即可以进行多态替换掉的，否则也是无法 Mock 的。  


## 五、更复杂的情况  


实际使用过程中，还会遇到很多复杂的情况。  


如果外部依赖是单例，这个时候就需要把单例 mock 掉。  
如果外部依赖是工厂，那就需要工厂提供注册 mock 对象的功能，否则就需要把这个工厂也 mock 掉。  
如果外部依赖是全局函数、静态函数，那就同样需要使用依赖注入，将全局函数和静态函数的指针传进来，mock 的时候实现相同的函数即可。  



就这样，我们通过依赖注入与多态的方式，就可以解决大多数问题了。  


至于剩下的，就需要发生你发挥自己的聪明才智，根据实际情况去做更高级的依赖注入了。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

