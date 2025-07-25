---   
layout:     post  
title: go 语言代码规范    
description: 总结下比较重要的规范       
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2021-11-20 21:30:00  
published: true  
---  


## 一、背景


最近 codereview 了不少 go 语言的代码，有必要总结下代码规范，算是一个备忘录了。  


大概分为几大模块，如如何注释、如何命名、基本语法、函数、以及其他。  




##　二、注释  



每个被导出的名字（大写开头），都应该有注释。  


所有注释掉的代码，都需要删除。  
如果没有删除，需要在注释中给出理由。  


对于包、结构体、函数、方法，在上一行写注释。  
对于结构体的成员变量或者普通变量与常量，可以在上一行写注释，也可以在同一行的行尾写注释。  


如果一个包有多个文件，只需要在一个文件里写注释。  
一般在和包同名的那个文件里写注释。  


## 三、命名  


除了包、文件名，代码中的名字（结构体、接口、函数、变量、常量）都需要遵循驼峰式命名。  
第一个字母的大小写区分是否可导出。  


**包名**  


package 的名字需要与目录名保持一致。  
包名应该为小写单词，不要使用下划线或者混合大小写，使用多级目录来划分层级。  
不要使用无意义的包名，如 `common`，名字应该追求清晰且越来越收敛。  


**文件名**   


文件名应该采用小写，并且使用下划线分割各个单词。  


**结构体**  


结构体名应该是名词或名词短语，不应该是动词。  
避免使用 Data、Info 这类意义太宽泛的结构体名。  
结构体的声明和初始化格式采用多行。  


**接口名**  


单个函数的接口名以 er 作为后缀。  
两个函数的接口名综合两个函数名。  
三个以上函数的接口名，类似于结构体名。  


**变量名**  

如果变量为私有，且特有名词为首个单词，则使用小写，如 apiClient；  
其他情况都应该使用该名词原有的写法，如 APIClient。  
若变量类型为 bool 类型，则名称应以 Has，Is，Can 或者 Allow 开头。  


变量名更倾向于选择短命名。特别是对于局部变量。  
基本原则是：变量的使用和声明的位置越远，变量名就需要具备越强的描述性。  


如果是枚举类型的常量，需要先创建相应类型。  



## 四、控制结构  


if 内才需要的局部变量，可以放在 if 内，如 `if err := xxx; err != nil {}`。  
与常量比较时，变量在左，常量在右。  
对于 bool 类型判断时，不要与 true 或者 false 判断。  


for 的下标可以采用短声明，如 `for i:= 0; i < 10; i++`。  


switch 必须有 default。  


return 应该尽早返回，即一旦有错误，就返回。  


goto 禁止使用。  


## 五、函数  


函数返回的参数有多个或者含义不清晰时，可以使用命名参数返回，其他情况不建议使用命名返回。  
传入变量和返回变量以小写字母开头。  
参数数量均不能超过5个。  
尽量用值传递，非指针传递。  
传入参数是 map，slice，chan，interface 不要传递指针。  


当存在资源管理时，成功申请资源之后，应紧跟 defer 函数进行资源的释放。  
禁止在循环中使用 defer。  


方法的接收器：以类名第一个英文首字母的小写作为接收器的命名。  


文件长度不能超过800行。  
函数长度不能超过80行。  
嵌套深度不能超过4层。  


单测文件行数限制是普通文件的2倍，即1600行。  
单测函数行数限制也是普通函数的2倍，即为160行。  


变量声明尽量放在变量第一次使用前面，就近原则。  


如果魔法数字出现超过2次，则禁止使用。  



## 六、错误处理  



error 作为函数的值返回，必须对 error 进行处理, 或将返回值赋值给明确忽略。  
error 作为函数的值返回且有多个返回值的时候，error 必须是最后一个参数。  
采用独立的错误流进行处理。  
错误返回的判断独立处理，不与其他变量组合逻辑判断。  
error 生成方式为：`fmt.Errorf("module xxx: %w", err)`。  


在业务逻辑处理中禁止使用 panic。  
在 main 包中只有当完全不可运行的情况可使用 panic。  
建议在 main 包中使用 log.Fatal 来记录错误，这样就可以由 log 来结束程序。  


panic 捕获只能到 goroutine 最顶层，每个自行启动的 goroutine，必须在入口处捕获 panic，并打印详细堆栈信息或进行其它处理。  



type assertion 的单个返回值形式针对不正确的类型将产生 panic。因此，请始终使用 “comma ok” 的惯用法。  




## 七、其他  


代码都必须用 gofmt 格式化。  


建议一行代码不要超过120列，超过的情况，使用合理的换行方法换行。  



运算符和操作数之间要留空格。  
作为输入参数或者数组下标时，运算符和运算数之间不需要空格，紧凑展示。  


不要使用相对路径引入包，全部使用完整的路径引入包。  
goimports 会自动把依赖包按首字母排序，并对包进行分组管理，通过空行隔开，默认分为标准库、本地包、第三方包。  


本地包和第三方包内部可以继续按实际情况细分不同子类。  
匿名包的引用建议使用一个新的分组引入，并在匿名包上写上注释说明。  


## 八、最后  


go 语言的代码规范还是比较少的，画上半个小时就可以全部看完。  


看完这个规范后，发现之前很多有争议的命名现在都明确了。  


接下来，就是看 go 语言各种功能的源码了，敬请期待。  



《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

