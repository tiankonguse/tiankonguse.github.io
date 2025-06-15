---   
layout:  post  
title: 分享下 STL Numeric 库的函数  
description: 只有 5 个函数，也许可以提高编码效率。        
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateDate:  2023-01-26 18:13:00  
published: true  
---  


## 零、背景  


之前在文章《[分享下 STL algorithm 库我常用的函数](https://mp.weixin.qq.com/s/vqb8XvZPT-DWcgQE_aumZg)》中分享了我部分常用的函数。  


有人评论还有 accumulate 求和函数比较常用。  
其实写文章时我也留意到没写 accumulate 这个函数。  
所以我提前去确认了下，发现这个函数在 Numeric 库中。  


Numeric 库只有 5 个函数，现在想想其实有几个也有用的，所以今天专门介绍一下。  


## 一、iota 区间递增  


对于 iota 函数，go 语言的同学应该会比较熟悉。  


因为在 go 语言中，枚举值可以通过 iota 来设置自动递增。  


```go
const (
    Zero = iota // 0
    One         // 1
    Two         // 2
)
```


cpp 中，可以通过迭代器来依次把递增序列储存起来。  


```cpp
iota(nums.begin(), nums.end(), val)

// 等价与
for(auto& v: nums){
    v = val;
    val = val + 1;
}
```


## 二、accumulate 区间和


第二个函数 accumulate 可以方便的区间求和。  


```cpp
accumulate(nums.begin(), nums.end(), 0L);

// 等价与
sum = 0L;
for(auto v: nums){
    sum = sum + v;
}
```


进阶用法：求和操作自定义。  


```cpp
accumulate(nums.begin(), nums.end(), 0L, [](auto& sum, auto& v){
    return sum + v * v;
});

// 等价与
sum = 0L;
for(auto v: nums){
    sum = sum + v * v;
}
```


## 三、inner_product 内积  


第三个函数 `inner_product` 用处不大，因为内积这个操作在算法比赛中不常用，需要的时候自己实现比较好。  


```cpp
inner_product(a.begin(), a.end(), b.begin(), 0L);

// 等价与
sum = 0;
bi = 0;
for(auto av: a){
    sum = sum + av * b[bi];
    bi++;
}
```


进阶操作：求和操作与内积操作自定义。  


```cpp
inner_product(a.begin(), a.end(), b.begin(), 0L, [](auto& sum, auto &v){
    return sum + v;
}, [](auto& a, auto& b){
    return srqt(a * a + b * b);
});

// 等价与
sum = 0;
bi = 0;
for(auto av: a){
    sum = sum + srqt(av * av + b[bi] * b[bi]) ;
    bi++;
}
```



## 四、 partial_sum 前缀和  


第四个函数 `partial_sum` 其实蛮有用的，因为我们经常需要求前缀和。  


```cpp
partial_sum(a.begin(), a.end(), preSum.begin());  

// 等价与
sum = 0;
for(auto v: a){
    sum += v;
    preSum.push_back(sum);
}
```


进阶操作：前缀积。  


```cpp
partial_sum(a.begin(), a.end(), preSum.begin(), [](auto& pre, auto& v){
    return pre * v;
});  

// 等价与
sum = 1;
for(auto v: a){
    sum = sum * v;
    preSum.push_back(sum);
}
```



## 五、 adjacent_difference 相邻差  


第五个函数是 `adjacent_difference` 求相邻差，算法上也很少使用。  


```cpp
adjacent_difference(a.begin(), a.end(), dis.begin());

// 等价与
int pre = 0;
for(auto v: a){
    dis.push_back(v - pre);
    pre = v;
}
```


进阶操作：相邻元素的操作可以封装为函数，例如相邻和。  


```cpp
adjacent_difference(a.begin(), a.end(), dis.begin(), [](auto&a, auto&b){
    return a + b;
});

// 等价与
int pre = 0;
for(auto v: a){
    dis.push_back(v + pre);
    pre = v;
}
```


## 六、最后  


看完 Numeric 库的五个函数，发现有三个可以在算法上可能会用到。  


第一个是区间递增，使用场景是给一个大小为 n 的数组分配 1 到 n 的值。  
第二个是区间求和，这个也是最常用的。  
第三个是前缀和，不少算法都需要求前缀和的。  


如果要使用高阶函数，即自定义操作函数，还不如自己循环事项相关的功能，会更灵活。  


面对 Numeric 库的这几个函数，你怎么看呢？  
觉得封装的有意义吗？  




加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

