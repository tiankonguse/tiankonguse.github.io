---   
layout: post  
title: 源码阅读 gflags，发现设计缺陷        
description: 有一个功能，很容易误用。  
keywords: 程序人生  
tags: [程序人生]  
categories: [程序人生]  
updateData: 2022-06-04 18:13:00  
published: true  
---  


## 一、背景  


众所周知，大多数程序都支持通过命令行来输入相关参数。  


最常见的就是 `--help` 参数了。  


对于 cpp 开发语言，业界最流行的就是 gflags 命令行工具库了。  


## 二、看源码的缘由


最近我在做性能优化。  


RPC 服务框架的开发同学告诉我可以在配置文件里加一行参数，主动关闭 numa，来对比 numa 优化对性能的影响。  


后来，那位同学又告诉我，他忘记了，在配置文件里 numa 参数应该不会生效。  
因为在新版本里，那个配置只能走命令行输入进行设置。  


我看到消息时，已经压测完成了。  
实际却发现，配置文件的参数生效了。  


随后对命令行参数也进行测试，却发现命令行参数不管设置啥都没有效果。  



起初，大家怀疑框架版本没对齐。  


我通过 strings 命令从二进制中提取出版本号，证明版本没问题。  


后来，我阅读了框架的相关的源代码，直接 GDB 打印出了版本的符号，也没问题。  


最后，框架同学在指定版本上拉了一个分支，加了几行日志，让我切换到分支试试。  


结果日志正常输出了。  


这说明框架版本确实是对齐的。  



所以，现在面临一个很严重的问题。  


看代码，逻辑应该是走命令行得到配置。  


实际运行结果却证明，命令行配置未生效，始终都走配置文件。  



我则怀疑，可能服务框架的同事错误的使用了 gflags 库。  


于是花了半个小时来阅读 gflags 库的源代码。  


最后发现，这算是 gflags 的设计缺陷。  


这个设计缺陷导致服务框架组的同学错误使用了这个库，最终导致上面的问题。  



## 三、 gflags 基本用法



gflags 是 google 开源的命令行工具库。  



源码地址： https://github.com/gflags/gflags  



这个工具入门级的使用只有几个步骤。  



步骤1：在需要的文件里进行参数注册。  


```
#include <gflags/gflags.h>

DEFINE_bool(debug, true, "open debug flag");
DEFINE_string(name, "天空柚子","你的名字")
```


其他的命令行库语言在一个地方统一注册参数，gflags 则允许按需分散到各个文件里。




看到上的代码，很容易想到，应该还支持其他基本的数据类型。  



gflags 共支持 6 种数据类型：  


```
DEFINE_bool: 布尔类型
DEFINE_int32: 32位整型
DEFINE_int64: 64位整型
DEFINE_uint64: 无符号 64-未整型
DEFINE_double: double
DEFINE_string: 字符串
```


对于这些数据类型参数的使用，有两个建议值。  


非布尔flag使用这种形式： `–variable=value`  
布尔flag使用这种形式：`–variable/–novariable`  



步骤2：解析参数  



一般在 main 函数的第一行进行解析。  



```
int main(int argc, char **argv){
  gflags::ParseCommandLineFlags(&argc, &argv, true);
}
```


默认情况下，`ParseCommandLineFlags` 函数会对输入的参数 argv 重排序，flag 参数放在最前面，非 flag 参数在后面。  


如果第三个参数设置为 true，这个函数还会修改 argc 和 argv， 删除 flag 的所有参数，只剩下非 flag 参数。  



步骤3：声明与使用  


由于 `DEFINE_xxx` 一般在 cpp 代码中实现的，其他 cpp 是不可见这些符号的。  


所以，其他文件如果需要这些 flag 参数，就需要先声明，在使用。  


```
DECLARE_bool(debug);
if (FLAGS_debug){
  Debug(); 
}
```


步骤4：参数检查  


这个属于进阶操作，可以注册回调函数对输入的参数进行检查。  


```
static bool ValidateAge(const char* flagname, int32 value) {
   if (value > 0 && value < 150)   // value is ok
     return true;
   printf("Invalid value for --%s: %d\n", flagname, (int)value);
   return false;
}
DEFINE_int32(age, 18, "your age");
DEFINE_validator(age, &ValidateAge);
```


## 四、源码阅读  


源码1：参数定义注册  


当我们写下`DEFINE_xxx` 的代码时，背后会展开一个宏，进行名字注册，以及名字导出。  


```
#define DEFINE_VARIABLE(type, shorttype, name, value, help)             \
  namespace fL##shorttype {                                             \
    static const type FLAGS_nono##name = value;                         \
    /* We always want to export defined variables, dll or no */         \
    GFLAGS_DLL_DEFINE_FLAG type FLAGS_##name = FLAGS_nono##name;        \
    static type FLAGS_no##name = FLAGS_nono##name;                      \
    static GFLAGS_NAMESPACE::FlagRegisterer o_##name(                   \
      #name, MAYBE_STRIPPED_HELP(help), __FILE__,                       \
      &FLAGS_##name, &FLAGS_no##name);                                  \
  }                                                                     \
  using fL##shorttype::FLAGS_##name
```


可以看到，在 `fL##shorttype` 名字空间内，定义了 static 的 `FLAGS_##name` 和 `FLAGS_no##name` 变量。  


然后通过 `GFLAGS_NAMESPACE::FlagRegisterer` 把这两个变量注册到 gflag 中。  


最后，通过 `using` 导出 `FLAGS_##name` 变量。  
这样，我们就可以通过 `FLAGS_##name` 来读写这个变量了。  


FlagRegisterer 类是一个模板类，构造函数里会调用 `RegisterCommandLineFlag` 注册这个变量。  


工厂实现也很简单，就是一个 map，操作前会加锁，也会判断是否重复注册。  



源码2：参数检查  


当写下 `DEFINE_validator` 的时候，也会定义一个静态变量，来触发校验函数的注册操作。  


```
#define DEFINE_validator(name, validator) \
    static const bool name##_validator_registered = \
            GFLAGS_NAMESPACE::RegisterFlagValidator(&FLAGS_##name, validator)
```


这里我很奇怪，为啥不把这个静态变量定义到 gflag 自己作用域去。  


`RegisterFlagValidator` 函数就是注册参数检查函数。  
可以发现，这里不是通过 `#name` 来查找的，而是通过 `FLAGS_##name` 的地址来查找的。  
所以，这说明，工厂不仅支持名字查找，还支持指针查找。  


源码3：声明与使用


`DECLARE_xxx` 的源码就简单了，声明变量即可。  


```
#define DECLARE_VARIABLE(type, shorttype, name) \
  /* We always want to import declared variables, dll or no */ \
  namespace fL##shorttype { extern GFLAGS_DLL_DECLARE_FLAG type FLAGS_##name; } \
  using fL##shorttype::FLAGS_##name

#define DECLARE_bool(name) \
  DECLARE_VARIABLE(bool, B, name)
```


源码4：解析参数  


解析函数最复杂，不过没啥解释的，这里就不多做介绍了。  


## 五、实际问题  


看了源代码后，发现 RPC 框架里有三处错误使用了 gflags 库。  


第一个错误是，RPC 框架的同学就认为，对于每个 flag 参数存在三个状态：默认值 、命令行设置值、变量设置值。  


默认值指的是 `DEFINE_XXX` 写死的值。  
命令行设置值，指的是启动程序时，输入参数的值。  
变量设置值，指的是通过 `FLAGS_##name` 设置的值。  


然而，看源码，可以发现，命令行设置值与变量设置值最终储存在一个变量里，都是 `FLAGS_##name`。  


这意味着，启动时命令行参数初始化这些 flag 变量都没有意义。  


因为之后解析配置文件，又会通过 `FLAGS_##name` 对 flag 变量全部进行覆盖。  


这就是为啥命令行参数没有生效的缘故。  



第二个错误是默认值的问题。  


可能是因为 RPC 框架的同学发现 gflags 库有个 `GetCommandLineFlagInfo` 函数。  


然后还发现 `CommandLineFlagInfo` 结构里有个 `is_default` 参数。  


于是RPC 框架的同学便认为，即使手动设置的值与默认值相同，`is_default` 也会返回 false。  


但是我看完源码，却发现 `is_default` 是通过 `modified_` 变量来判断的。  


```
UpdateModifiedBit();
result->is_default = !modified_;
```


`modified_` 这个变量在读的时候会进行更新操作，即判断当前值与默认值是否相等。  


```
void CommandLineFlag::UpdateModifiedBit() {
  // Update the "modified" bit in case somebody bypassed the
  // Flags API and wrote directly through the FLAGS_name variable.
  if (!modified_ && !current_->Equal(*defvalue_)) {
    modified_ = true;
  }
}
```


这意味着，使用 `FLAGS_name` 把变量修改为与默认值一样的值后，`is_default` 依旧是 `true`，即是默认值。  


在这时候，`is_default` 改名为 `is_eq_default` 比较好。  



第三个错误比较严重，算是 gflags 的设计缺陷了。  



实际上，看到 `GetCommandLineFlagInfo` 函数时，我本能的去查找是否有 `SetCommandLineFlagInfo` 函数。  


发现确实存在，通过这个函数进行设置值，不管设置的值是什么，都会强制将 `modified_` 设置为 true。  




这样看来就知道问题出在哪了。  
显然是 gflags 的设计缺陷。  


一方面，gflags 支持通过 `FLAGS_name` 来轻松的来读与更新值。  
另一方面，gflags 又支持通过 `set/get` 函数来读写值，此时可以用来判断值是否修改，以及是否与默认值相等。  


gflags 同时对外支持两种设计，两种设计有不是完全闭环的，这就让使用者错误的使用了 gflags。  


比如通过 `FLAGS_name` 进行写操作时，通过 `get` 来判断是否修改以及是否与默认值相等是不对的。  


实际上，`FLAGS_name` 就不应该有更新操作，应该对外定义为 const。  
毕竟还支持注册检查函数，通过变量来直接更新，无法触发检查函数的。  


## 六、最后  


好了，看完 gflags 源码，我确认 gflags 是存在设计缺陷的。  


一种是快捷的操作方式，一种是高级的操作方式，两个方式混用后，就会互相影响对方的功能，最终导致逻辑不符合预期。  


而对于服务框架，本意是命令行设置了，就不再走配置文件。  


如果命令行设置值了，`modified_` 会标记为 true。  
所以，框架的代码可以修改为这样：  


```
if(!modified_){
  set(name, value);
}
```


你使用过 gflags 吗？ 怎么看这个问题？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

