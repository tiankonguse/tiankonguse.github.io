---   
layout:     post  
title: go 语言 byte 转 string
description: 被这个坑了    
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-09-04 21:30:00  
published: true  
---  


## 一、背景  


最近在做一个项目，使用 go 开发的。  


大概逻辑是从 A 数据库扫除所有数据，并写入到文件了。  


看起来很简单，实际动手的时候，发现 A 数据库中读出的数据是二进制的，具体来说是 redis dump 出的压缩加密数据。  


我的大概思路是将这个数据 restore 进 B redis，然后在读出数据即可。  


结果又遇到了一个问题，A 数据库返回的数据是 `[]int8` 类型，需要转化为 string。  


## 二、转化  


目前的输入数据是 `[]int8`。  


我第一个方法是写一个转化函数。  


```
func ArrayToString(values []int8) string {
  str := ""
  for _, v := range values {
    str += string(byte(v))
  }
  return str
}
```


结果写 redis 的时候提示校验不通过。  


打印出 16 进制手动执行或者写死代码执行都没问题。  
于是怀疑 byte 转 string 不能这样写。  


自己拼出 string 与程序计算的 string 一比较，果然不一样。  


网上一顿搜索，找到了答案。  
原来对于特殊的 byte ， 不能直接转 string。  


此时需要先将 byte 转化为 `[]byte`， 然后就可以转化为 string 了。  


大概像下面这个样子：  


```
func ArrayToString(values []int8) string {
  str := ""
  for _, v := range values {
    str += string([]byte{byte(v)})
  }
  return str
}
```


## 三、样例  


面对这个差异，我写了一个对比程序，发现 byte 直接转 string 的时候就是有问题。  



```
l := []int8{65, 66, 67, -124}
fmt.Println(l) // ABC

s2 := ""
for _, c := range l {
  s2 += string(byte(c))
}
fmt.Println("string(byte(c)) ", len(s2))

s3 := ""
for _, c := range l {
  s3 += string([]byte{byte(c)})
}
fmt.Println("string([]byte{byte(c)})", len(s3))
```


输入如下：  


```
[65 66 67 -124]
string(byte(c))  5
string([]byte{byte(c)}) 4
s2==s3  false
```


可以发现，byte 直接转化为 string 的时候，对于负数，转化为了两字节，导致不符合预期。  


## 四、最后  


这周写了一些 Go 的代码，发现 go 相比 c++ 确实简单多了。  


我有一个感觉， go 后面会继续壮大，最终超越 java 和 c++ 语言。  


思考题：你怎么看到 go 呢？  







《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
知识星球：不止算法  

