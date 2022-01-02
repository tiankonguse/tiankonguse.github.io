---   
layout: post  
title: mysql count(*) 与 count(1) 的区别    
description: 网上很多文章都介绍错了，纠正一下。   
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2021-03-24 21:30:00  
published: true  
---  


## 一、背景  


最近，我们的系统有往储存的方向发展。  


其中一个功能就是接口需要 SQL 化。  


然后就聊到 count 函数需要支持哪些功能。  


网上搜索 count 的时候，发现大部分都是介绍 count 的实现原理，以及 `count(*)` 与 `count(1)` 的区别。  


当我看了 mysql 的官方文档后，发现不少文章关于 `count(1)` 都解释是错了，故写一篇文章来记录一下。  


## 二、两个功能


mysql 的官方文档地址：  


https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_count  


可以看到，关于 count 函数有两个语法。  


语法 1：`COUNT(expr)`  
含义：对表达 expr 的非空值计数。  


```
Returns a count of the number of non-NULL values of expr in the rows retrieved by a SELECT statement. The result is a BIGINT value.
```



语法2：`COUNT(DISTINCT expr,[expr...])`  
含义：对表达式 `expr,[expr...]` 的非空值去重后计数。  
注意事项：经测试，所有表达式的值都必须非空，只要一个为空，就被过滤。  


关于这个语法，需要展开讲的有两点。  


第一，`expr` 是一个表达式，可以使用很多形式来标示。  
比如`*`代表所有字段，`1`、`"hello"`等代表常量值，`IF`、`IFNULL`等代表函数。  


比如我这里随便创建了一个表，插入了三个值。  


```
mysql> select c_id from t_tiankonguse;
+------+
| c_id |
+------+
|    1 |
|    2 |
|    3 |
+------+
3 rows in set (0.01 sec)
```

可以使用 `count(*)` 来查询所有行的个数。  


```
mysql> select count(*) from t_tiankonguse;
+----------+
| count(*) |
+----------+
|        3 |
+----------+
```


可以使用常量来查询所有行的个数。  


```
mysql> select count(1) from t_tiankonguse;
+----------+
| count(0) |
+----------+
|        3 |
+----------+
```


还可以指定字段，判断这个字段非空的个数。  


```
mysql> select count(c_id) from t_tiankonguse;
+-------------+
| count(c_id) |
+-------------+
|           3 |
+-------------+
```


也可以指定字段，来使用函数来计算非空的个数。  


```
mysql> select count(if(c_id < 2, 1, NULL)) from t_tiankonguse;
+------------------------------+
| count(if(c_id < 2, 1, NULL)) |
+------------------------------+
|                            1 |
+------------------------------+
```

当然，还可以写一个没有意义的 SQL。  


```
mysql> select count(NULL) from t_tiankonguse;
+-------------+
| count(NULL) |
+-------------+
|           0 |
+-------------+
```


不管怎么写，按照定义，统计表达式的值为非空的个数，就可以得到输出的结果。  



第二，语法 1 只支持一个表达式，语法 2 支持多个表达式并去重。  
那就有人有疑问了，这里的逻辑没有形成闭环：多个表达式不去重如何表达呢？多个表达式都为空才算空再去重如何表达？  


可以看到，关于这样的问题还可以提出很多个，所以干脆 MYSQL 就一个也不支持了。  
有这个需求的话，就自己使用 函数去计算。  


这里给大家出两道开放题，大家可以创建一个表自己做一做。  


问题1：两个字段，不去重，如何使用 COUNT 求非空个数？  

比如，下面的答案应该是 3，

```
+----------+----------+
| NULL     | NULL     |
| a        | b        |
| a        | NULL     |
| NULL     | b        |
+----------+----------+
```


问题2：两个字段，两个字段都为空时才算空，求去重个数。  


比如下面的答案是 4，过滤或去重了三行，  


```
+----------+----------+
| a        | NULL     |
| a        | NULL     |
| b        | NULL     |
| NULL     | b        |
| NULL     | b        |
| NULL     | NULL     |
| a        | b        |
+----------+----------+
```


## 三、优化  


COUNT 的原理其实很简单，按照定义取理解就行了。  


具体实现的时候，数据库做了一些优化，我们如果知道了这些优化，程序上就可以大大的提高性能了。  



优化1：MyISAM储存引擎的总个数  


如果数据库使用 MyISAM 储存引擎的话，内部会直接表的总行数储存下来。  
这样不加 where 条件时，就可以直接得到答案。  


当然，InnoDB 因为支持了事务的缘故，没有这样实现。  
所以 InnoDB 储存引擎需要扫描全表才能得到总行数。  


优化2：`COUNT(*)`特殊假设  
MYSQL 对 `COUNT(*)`做了特殊假设，即认为表的所有行都不为空。  
这样 `COUNT(*)` 就代表读取表的所有行。  


```
COUNT(*) is somewhat different in that it returns a count of the number of rows retrieved, whether or not they contain NULL values.
```


优化3：不带 WHERE 和 ORDER BY 时，`COUNT(*)`优先选择较小的索引  
既然是查询所有行，较小的索引 IO 次数少，可以更快的计算出总个数。  


```
InnoDB processes SELECT COUNT(*) statements by traversing the smallest available secondary index unless an index or optimizer hint directs the optimizer to use a different index. 
If a secondary index is not present, InnoDB processes SELECT COUNT(*) statements by scanning the clustered index.
```


优化4：COUNT(1) 与 COUNT(*) 等价。  


```
InnoDB handles SELECT COUNT(*) and SELECT COUNT(1) operations in the same way. 
There is no performance difference.
COUNT(1) is only subject to the same optimization if the first column is defined as NOT NULL.
```

官方原文在介绍这个等价时，最后一句让无数人产生了误解。  


表面意思是，如果第一列定义得空，就会使用这个等价优化。  
于是很多人把`count(1)`里面的这个 `1` 当做第一列的意思。  


![](http://res.tiankonguse.com/images/2021/03/24/001.png)  


但是根据 SQL 的定义，`count(1)`里面的 `1` 只是表达式 exp 的值，我们完全可以写为任意常量值，甚至是字符串。  
所以，这里的 `count(1)` 不是第一列的意思。  


那那句英文是啥意思呢？  


我思考了好久，发现这是一个逻辑游戏，只能说 MYSQL 文档的这句话写的不太好，太容易让人误会了。  



大概要拆分为两个三段式逻辑来证明。  


三段式证明1：  


1、如果 expr 都非空，等价与 count(*)。  
2、expr 的第一列全部非空时，expr 一定都非空  
3、因此，第一列非空时，等价与 count(*)  



三段式证明2：  


1、count(1) 的第一列值都是 1，都非空。  
2、第一列非空时，等价与 count(*)  
3、因此，count(1) 等价与 count(*)  


当然，也许 mysql 真的选择第一列来优化的，而只有一列的常量值当然不为空，自然可以走这个优化了。  



## 四、最后  


`count(1)` 和 `count(*)` 是等价的，官方解释有点模糊不清，


`if the first column is defined as NOT NULL`  


语法 1 表达式 expr 得到的结果只有一列，为何还称之为第一列呢？  


怪怪的。  



加油，技术人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

