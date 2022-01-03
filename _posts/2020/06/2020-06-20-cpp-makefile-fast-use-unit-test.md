---   
layout:     post  
title: 三十分钟接入单元测试，真香  
description: 怎么才能防止某个逻辑忘记加单元测试呢？  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-06-20 21:30:00  
published: true  
---  


## 一、背景  


昨天在文章《[高端的写 if 与 else](https://mp.weixin.qq.com/s/Ot4FgN-BQs07fLg7t8g-lQ)》 中提到，我写了一个简化版的引擎，这个引擎可以通过 DB 配置来自由组装各种算子。  


引擎写完了，面对 700 行代码，怎么保证代码的正确性是一个问题。  


所以我花了几十分钟引入单元测试，使用后的感受是：真香。  


下面我们来看看怎么接入单元测试吧。  


## 二、安装 gtest  


对于单元测试，我选择的是 google 的框架，即 gtest 。  


去 github 下载、编译、安装即可。  
一般是编译三部曲：`cmake .`、`make`、`make install`。  
下载地址：https://github.com/google/googletest  


编译出来的库有两个，一个是`gtest`，一个是`gtest_main`。  
前一个用来做单元测试，后一个用来管理这些单元测试。  
具体的含义到后面跑程序的时候就知道了。  


## 三、简单用法  


先来看一个最简单的单元测试，掌握一些基本概念。  


如下图，就是一个最精简的单元测试。  


```
#include "gtest/gtest.h"

int Add(int a, int b) {
    return a + b;
}

TEST(TestClass, TestName1) {
    EXPECT_EQ(2, Add(1, 1))
    ASSERT_EQ(5, Add(2, 3))
}
```


可以看到，使用 `TEST` 来定义一个测试用例。  
`TestClass` 参数是测试类名，可以理解为一个分组。  
`TestName1` 类中的功能名字，可以理解为具体的一个测试。  


在核心的测试代码中，我们看到了`EXPECT_EQ`和`ASSERT_EQ`两个判断。  
很容易猜到，这个就是单元测试的核心所在了。  


通过构造预期的结果，然后与测试代码块的结果进行检查判断。  
符合预期算测试成功一次，不符合预期算测试失败一次。  


`EXPECT` 与 `ASSERT` 的区别是，如果当前测试不通过，当前的测试用例`TestName1`是否继续运行。   
`EXPECT` 会一直运行下去，`ASSERT`会停止运行。  


另外 gtest 提供了很多检查判断的方法，大概如下：  



```
EXPECT_TRUE(condition);
EXPECT_FALSE(condition);

EXPECT_EQ(val1,val2);
EXPECT_NE(val1,val2);
EXPECT_LT(val1,val2);
EXPECT_LE(val1,val2);
EXPECT_GT(val1,val2);
EXPECT_GE(val1,val2);

EXPECT_STREQ(str1,str_2);
EXPECT_STRNE(str1,str2);

EXPECT_STRCASEEQ(str1,str2);
EXPECT_STRCASENE(str1,str2);
```


含义看名字也可以理解，分四组。  
第一组是 `bool`判断  
第二组是大小比较  
第三组是字符串判断  
第四组是字符串忽略大小写的判断。  


注：`ASSERT`和`EXPECT` 都有下面的方法，这里以`EXPECT`为例。  


上面的概念掌握了，我们就可以对大部分代码进行单元测试了。  


## 四、高级用法  


大多数的时候，同一个分组内的测试都是对同一个类的。  
而测试每个用例都需要构造相同的上下文，非常比较繁琐。  


此时就可以使用`TEST_F` 宏来共享一些数据，避免重复构造上下文。 


```
class TestFixture : public testing::Test {
protected:
    // 运行一次
    static void SetUpTestCase() {  }
    static void TearDownTestCase() {}
    // 每个测试用例之前都会运行
    virtual void SetUp() {
        v.push_back(1);
    }
    virtual void TearDown() {}

    //公共参数或变量
    vector<int> v_;
}

TEST_F(TestFixture, TestName) {
    EXPECT_EQ(1, v_.size());
}
TEST_F(TestFixture, TestName2) {
    v_.clear();
    EXPECT_EQ(0, v_.size());
}
```


如上面的代码，可以构造一个类的上下文，然后所有测试共享这一个上下文。  


另外，gtest 还支持定义全局的`SetUp`和`TearDown`，用在所有测试用例中。  
这里就不展开介绍了。  


## 五、编译运行  


我们写完单元测试后，就是编译与运行了。  


假设 gtest 的安装位置在 `/lib/googletest/`，我们可以先定义如下的变量。  


```
INC=-I/lib/googletest/include
LIB=-L/lib/googletest/lib -lgtest -lgtest_main -lpthread
```


然后就可以愉快的使用 `g++` 命令编译了。  


```
g++ xxx_test.cpp -o xxx_test $(INC) $(LIB)
```


## 六、makefile管理  


一般我们都是使用 makefile 来管理项目的。  


所以对于单元测试也需要加入到 makefile 中。  


项目的代码比较多，一般是通过自动扫描获取头文件的。  


大概如下  


```
SRCS += $(shell find ./  -name "*.cpp")
```


此时，扫描需要把单元测试代码过滤掉，即改成下面的样子。  


```
SRCS += $(shell find ./  -name "*.cpp" | grep -v "_test.cpp")
```


注：如果有`cc`后缀的文件，也需要做相同的过滤。  


然后为单元测试单独写一套命令。  


```
TEST_SRCS += $(shell find ./  -name "*_test.cpp")
TEST_OBJS += $(patsubst %.cpp,%.o,$(MIX_SRC_CPP))

%_test: %_test.o 
    g++ -o $@ $< $(FLAGS) $(INC) $(LIB) 

one_unit_test: $(TEST_OBJS)
    g++ -o one_unit_test $^ $(FLAGS) $(INC) $(LIB)  
```


这样，我们所有的单元测试就跑起来了。  


## 七、最后  


上篇文章提到，项目代码 700 行，写完单元测试后就是 1500 行了。  


大概写了下面这些单元测试程序。  


![](//res2020.tiankonguse.com/images/2020/06/20/001.png)  


统计后，发现估计的行数差不多，而且估计少了。  


![](//res2020.tiankonguse.com/images/2020/06/20/002.png)  


运行效果看着不多，有了单元测试，心里感觉靠谱多了。  


![](//res2020.tiankonguse.com/images/2020/06/20/002.png)  


只是我项目真实跑起来的时候，发现还是有个小问题。  
反过来查看单元测试的时候，发现那部分逻辑忘记加单元测试了。  


所以面对单元测试，最大的问题是怎么防止某个逻辑没测试到。  


面对这个问题，很容易想到引入单元测试覆盖率工具。  
如果某部分代码没测试到，那肯定是那部分逻辑忘记写测试用例了。  


不过，这次我出问题的地方是一个原子功能忘记加到工厂中去了。  
这里是直接没写对应的代码，所以覆盖率也没法解决这个问题了。  


当然，能想到的另一个解决方案是测试这个原子功能时，使用工厂获得原子对象。  
不过这样原子功能就与工厂耦合起来了。  


思考题1：怎么才能防止某个逻辑忘记加单元测试呢？  
思考题2：原子、工厂、单元测试之间的耦合关系如何调和呢？  


《完》  



-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

