---   
layout:  post  
title: 初步使用 PromQL 语法  
description: PromQL 的语法很有意思。       
keywords: 项目实战  
tags: [项目实战]  
categories: [项目实战]  
updateData:  2023-12-15 18:13:00  
published: true  
---  


# 一、背景  


最近在使用 grafana 来制作系统的各种指标看板。  


其中一个重要的指标来源是监控系统，监控系统对外的提供的API 是 PromQL 语法的接口。  


所以就有必要学习一下 PromQL 的语法。  


# 二、Prometheus  


Prometheus 是一个开源系统监控和警报工具包，拥有非常活跃的开发者和用户社区。  


Prometheus 提供的数据查询语言被称为 PromQL，全称是 Prometheus Query Language，可以用来查询筛选与聚合时间序列数据。  


# 三、数据类型  


PromQL 中有四种数据类型。  


1）Instant vector，即时向量，只有一个数据的时间序列。  
2）Range vector，范围向量，包含多个数据的时间序列。  
3）Scalar，标量，一个浮点数。  
4）String 字符串，未使用。  


# 四、时间序列选择器  


简单的理解，带筛选条件的 API，可以返回带数据的时间序列。  


1）Instant vector selectors 即时向量  


筛选出所有满足条件的时间序列结果。  


例如：`http_requests_total` 查询所有时间的请求数据。  



2）筛选条件   


使用`{}`进行筛选。  
例如 `http_requests_total{job="prometheus",group="canary"}`  


具体语法如下  


```
= 标签完全匹配  
!= 标签不匹配
=~ 标签正则匹配  
!~ 标签正则不匹配  
```


其中正则是完全匹配，即 `env=~"foo"` 等价于 `env=~"^foo$"`。  


3）Range Vector Selectors 范围向量    


筛选出指定时间维度的时间序列结果。  


例如默认数据上报的粒度是秒粒度，我们希望得到每分钟的访问量，这个时候就需要使用1分钟这个时间范围来查询数据。  


语法：`http_requests_total{job="prometheus"}[1m]`  



4) Time Durations 时间  


时间单位有下面这些  


```
ms - milliseconds  毫秒
s - seconds  秒
m - minutes  分钟
h - hours  小时
d - days 天
w - weeks 周
y - years 年
```


时间支持组合，但是单位必须从大到小，例如`1h30m`。  


5）Offset modifier 偏移修正  


监控系统的数据可能会有延迟，这个时候就需要对时间校准，防止画出来的曲线最新的时间掉零。  


例如 `http_requests_total offset 5m` 拉取 5分钟之前的数据。  


注意事项：时间修正必须与 Selectors 在一起使用，函数运算之后，就不能使用时间修正了。  


# 五、运算符  


数据筛选出来后，可以使用内置的运算符进行运算。  


1）二元运算符  


```
+ 加
- 减
* 乘
/ 除
% 模
^ 幂  
```


二元算术运算符可以在标量与标量之间、向量与标量之间、向量与向量之间运算。  


两个标量之间运算之后，结果还是标量。  
瞬时向量和标量运算时，标量会与向量的每个数据样本的值进行运算，结果还是一个瞬时向量。  
两个向量之间运算，两个向量会按标签进行匹配，匹配的进行运算，形成匹配的结果集。  


2）集合运算符  


集合之间的运算如下  


```
and 交集
or 并集
unless 差集
```


3）聚合运算  


Prometheus 支持很多内置聚合运算符，可用于聚合单个即时向量的元素，从而生成具有聚合值的较少元素的新向量。  


```
sum 计算维度上的和
min 计算维度上的最小值
max 计算维度上的最大值
avg 计算维度上的平均值
count 计数
count_values 计算相同值的个数
bottomk 最小的 k 个值
topk 最大的 k 个元素
quantile 计算维度上的 φ 分位数
```


维度选择有两种  


```
without 排除维度
by 选择维度 
```


样例如下，维度选择可以放在前面，也可以放在后面。  


```
# 除了 instance 标签，按其他标签分组求和。  
sum without (instance) (http_requests_total)
sum (http_requests_total) without (instance) 

# 对 application 和 group 标签分组求和  
sum by (application, group) (http_requests_total)
sum (http_requests_total) by (application, group) 

# 不分组，求和
sum(http_requests_total)
```


# 六、函数  


Prometheus 还提供了很多函数可以使用。  


```
abs 绝对值  
ceil 四舍五入
changes 差值向量
floor 向下取整
label_replace 修改标签的值  
round(v, scalar) 按 scalar 的倍数进行四舍五入  
sort 排序
sort_desc 逆序  
avg_over_time 指定区间内所有点的平均值
min_over_time 指定区间内所有点的最小值
max_over_time 指定区间内所有点的最大值
sum_over_time 指定区间内所有值的总和
quantile_over_time 指定区间内的值的 φ 分位数
```


## 七、实战  


通过 Stat Chat 展示总核数。  



![](https://res2023.tiankonguse.com/images/2023/12/15/001.png)



通过 Pie Chat 展示各集群的流量分布。  



![](https://res2023.tiankonguse.com/images/2023/12/15/002.png)


通过 Time series 展示 QPS 与 CPU 的曲线图。  


![](https://res2023.tiankonguse.com/images/2023/12/15/003.png)


通过 Bar gauge 查看各模块的实时负载。  


![](https://res2023.tiankonguse.com/images/2023/12/15/004.png)


通过 Table 查看各个核心业务的 QPS、成功率、负载、同比环比数据。  


![](https://res2023.tiankonguse.com/images/2023/12/15/005.png)


## 八、最后  


PromQL 的语法还算简单，grafana 就相当复杂了。  


后面有机会，分享一下如何使用 grafana 画出上面的哪些曲线与图像。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

