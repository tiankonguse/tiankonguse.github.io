---   
layout: post  
title: mysql 面试题：多值字符串如何联表查询？      
description: 即使使用 like，能想到的也没几个人吧       
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2021-03-25 21:30:00  
published: true  
---  


## 一、背景  


最近在分析 SQL 的级联功能，发现存在这样一个场景：  


假设 A 表是公众号表，B 表是用户表。  
现在 公众号 A 表有一个字段 users，代表一个公众号号的订阅用户列表。  
users 字段的值是一个字符串，格式是使用逗号将用户 ID连接起来。  


现在告诉你公众号ID，求拉出公众号的信息与订阅用户的信息。  


## 二、表信息  


上面的描述可能比较抽象，直接看数据。  


公众号表有三个作者，名字和关注的用户如下。  


```
mysql> select * from A;
+------+--------+----------+
| c_id | c_name | c_users  |
+------+--------+----------+
| kong | three  | a        |
| tian | two    | a,c      |
| tk   | one    | b,c,d,aa |
+------+--------+----------+
```

用户表是每个用户的 ID 和名字。  


```
mysql> select * from B;
+------+--------+
| c_id | c_name |
+------+--------+
| a    | aa     |
| aa   | aa     |
| b    | bb     |
| c    | cc     |
| d    | dd     |
+------+--------+
```

## 三、标准的子查询  


标准的子查询有两个方法。  


第一种方法是直接用等于来筛选，我们会发现只能搜出一个用户的公众号及用户。  


```
mysql> select A.c_name, A.c_users, B.c_id, B.c_name from A, B where A.c_users = B.c_id;
+--------+---------+------+--------+
| c_name | c_users | c_id | c_name |
+--------+---------+------+--------+
| three  | a       | a    | aa     |
+--------+---------+------+--------+
```


然后可能有人就说了，这种是多个值，使用等于当然有问题了。  
应该使用 `in` 来判断是否在集合里。  


于是便于了第二种方法，但是搜索结果竟然和等于完全一样。  


```
mysql> select A.c_name, A.c_users, B.c_id, B.c_name from A, B where B.c_id in (A.c_users);
+--------+---------+------+--------+
| c_name | c_users | c_id | c_name |
+--------+---------+------+--------+
| three  | a       | a    | aa     |
+--------+---------+------+--------+
```

此时可能有人就会发现，这里的列表是字符串，`in` 不是这样用的。 


## 四、like 子查询  


发现无法使用 `in` 子查询时，有人可能会想到 `like` 子查询。  


那 `like` 需要模糊匹配符，该如何办呢？  
聪明的你马上想到了`CONCAT` 函数，拼接处模糊匹配符不就行了。  


```
mysql> select A.c_name, A.c_users, B.c_id, B.c_name from A, B where A.c_id = 'tk' and A.c_users like CONCAT('%', B.c_id, '%');
+--------+----------+------+--------+
| c_name | c_users  | c_id | c_name |
+--------+----------+------+--------+
| one    | b,c,d,aa | a    | aa     |
| one    | b,c,d,aa | aa   | aa     |
| one    | b,c,d,aa | b    | bb     |
| one    | b,c,d,aa | c    | cc     |
| one    | b,c,d,aa | d    | dd     |
+--------+----------+------+--------+
```


搜索数据后，发现大部分数据是对的，但是多了一些数据。  


比如 `a` 不是 `one` 的用户，但是被搜出来了。  


此时，聪明的马上又想到，可以使用精确搜索、前缀精确搜索、中缀精确搜索、后缀精确搜索结合起来做到全部精确搜索。  


精确搜索用于搜索只有一个用户的情况，即不加任何匹配符 `c_id`。  
如果有多个用户，那要搜索的用户可能在最前面，此时用户后面有一个逗号，所以可以补充一个逗号来精确搜索 `c_id,%`。  
后缀精确搜索相同的道理，当前用户在最后一个，前面加一个逗号，就可以精确搜索了 `%,c_id`。  
当这个用户在中间时，前后都加一个逗号，就可以精确搜索了 `%,c_id,%`。  


SQL 如下，超级复杂。  


```
select A.c_name, A.c_users, B.c_id, B.c_name from A, B where A.c_id = 'tk' and 
    (A.c_users like CONCAT('', B.c_id, '') or
    A.c_users like CONCAT('', B.c_id, ',%') or 
    A.c_users like CONCAT('%,', B.c_id, ',%') or 
    A.c_users like CONCAT('%,', B.c_id, ''));
+--------+----------+------+--------+
| c_name | c_users  | c_id | c_name |
+--------+----------+------+--------+
| one    | b,c,d,aa | aa   | aa     |
| one    | b,c,d,aa | b    | bb     |
| one    | b,c,d,aa | c    | cc     |
| one    | b,c,d,aa | d    | dd     |
+--------+----------+------+--------+
```


这样做确实可以，但是很复杂。  


## 五、集合查询  


其实，MYSQL 内置了一个函数，可以将字符串按照逗号分隔为集合，然后判断一个元素是否在集合里。  


没错，就是 `FIND_IN_SET`。  


有了这个函数，我们几行代码就可以解决这个问题了。  

```
mysql> select A.c_name, A.c_users, B.c_id, B.c_name from A, B where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users);
+--------+----------+------+--------+
| c_name | c_users  | c_id | c_name |
+--------+----------+------+--------+
| one    | b,c,d,aa | aa   | aa     |
| one    | b,c,d,aa | b    | bb     |
| one    | b,c,d,aa | c    | cc     |
| one    | b,c,d,aa | d    | dd     |
+--------+----------+------+--------+
```


这个函数的官方文档地址在这里。  
https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_find-in-set  


感兴趣的可以去读一下，非常有用的一个函数。  
唯一的不足是字符串拆分符号不能自定义。  



## 六、最后  


面对这个字符串子查询问题。  
我们一开始使用 `in` 没有解决问题。  
然后使用 `like` 通过很复杂的语句解决了问题。  
最后使用一个内置函数，轻松解决了问题。  


面对这个问题，你有什么其他的方法，可以一条语句解决这个问题吗？  




加油，技术人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

