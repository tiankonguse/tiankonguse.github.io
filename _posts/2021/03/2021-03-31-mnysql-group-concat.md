---   
layout: post  
title: MYSQL 子查询聚合，90% 的人都不知道怎么做   
description:  又学到一个新技能          
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2020-02-18 21:30:00  
published: true  
---  


## 一、背景  


在上篇文章《[mysql 面试题：多值字符串如何联表查询？](https://mp.weixin.qq.com/s/UUA3akXFXxAmXdbytoDSnA)》分享了如何对字符串做子查询。  


最终结果像下面的样子。  


```
select A.c_name, A.c_users, B.c_id, B.c_name 
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users);

+--------+----------+------+--------+
| c_name | c_users  | c_id | c_name |
+--------+----------+------+--------+
| one    | b,c,d,aa | aa   | aa     |
| one    | b,c,d,aa | b    | bb     |
| one    | b,c,d,aa | c    | cc     |
| one    | b,c,d,aa | d    | dd     |
+--------+----------+------+--------+
```


如果你是一个有经验的程序员，可以一眼发现，前面的几列非常冗余。  


于是便有了新的问题：MYSQL 子查询结果如何聚合在一起呢？  


## 二、聚合为计数  


如果仅仅需要聚合后的数量，使用 count 函数就可以了。  


这个在文章《[mysql 的 count(*) 与 count(1)](https://mp.weixin.qq.com/s/knRatHbKTMNlBId-elxnzw)》已经分享，这里就不做过多的介绍了。  


这里只罗列下语句与结果。  



```
mysql> select A.c_name, A.c_users, count(*)  user_count
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users) 
group by c_name;

+--------+----------+------------+
| c_name | c_users  | user_count |
+--------+----------+------------+
| one    | b,c,d,aa |          4 |
+--------+----------+------------+
```


当然，也有人说可以直接从 c_users 得到 count。  
比如需要字符串拆分、去重、统计。  
那个是另外的技术了，感兴趣的话你可以想想怎么直接从 A 表得到 用户的个数。   


## 三、聚合为一行一列  


MYSQL 中有一个 CONCAT 函数，可以将一行中的多列聚合为一列。  
同样的，还有一个 GROUP_CONCAT 函数，可以将多行的内容聚合为一行的一列。  


通过这个函数，我们就可以将子查询的内容聚合为 A 表的一列了。  


语法：  


```
GROUP_CONCAT([DISTINCT] expr [,expr ...]
             [ORDER BY {unsigned_integer | col_name | expr}
                 [ASC | DESC] [,col_name ...]]
             [SEPARATOR str_val])
```


语法看起来很复杂，这里少做解释。  


-）DISTINCT 对后面的表达式列表去重  
-）ORDER BY 由于输出的是拼接的字符串，有先后顺序，排序规则
-）[ASC | DESC] 升序降序开关  
-）[,col_name ...] 指定多维度排序  
-）SEPARATOR 多行之间的分隔符  


最简单的例子如下：  


```
mysql> select A.c_name, A.c_users, GROUP_CONCAT( B.c_name)  user_info
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users) 
group by c_name;

+--------+----------+-------------+
| c_name | c_users  | user_info   |
+--------+----------+-------------+
| one    | b,c,d,aa | aa,bb,cc,dd |
+--------+----------+-------------+
```


此时可能就有人问题：这里只对多行一列聚合了，怎么对多行多列聚合。  


大家还记得这一小节的第一句话吗？  
MYSQL 中有一个 CONCAT 函数，可以将一行中的多列聚合为一列。  


CONCAT 怎么做到将多列聚合，GROUP_CONCAT 就可以用想用的方法做到。  


还不明白，看下面的例子就明白了，表达式列表就是要拼接的多列字段。  



```
select A.c_name, A.c_users, GROUP_CONCAT(B.c_id, '|', B.c_name)  user_info
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users) 
group by c_name;

+--------+----------+----------------------+
| c_name | c_users  | user_info            |
+--------+----------+----------------------+
| one    | b,c,d,aa | aa|aa,b|bb,c|cc,d|dd |
+--------+----------+----------------------+
```

## 四、聚合为数组  


上面介绍了如何将多行多列聚合为一行一列。  


但是有小朋友不满意了：  
聚合的结果是特殊字符拼接的字符串，对于业务来说一点都不好用。  
能不能聚合为结构化的结果呢，比如数组 json。  


这么一说，发现还真有函数可以做到。  


没错，就是 JSON_ARRAYAGG 。   


```
mysql> select A.c_name, A.c_users, JSON_ARRAYAGG( B.c_name)  user_info
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users) 
group by A.c_name;

+--------+----------+-----------------------+
| c_name | c_users  | user_info             |
+--------+----------+-----------------------+
| one    | b,c,d,aa | ["aa","bb","cc","dd"] |
+--------+----------+-----------------------+
```


这个转数组 json 很好用，但是很可惜不支持指定排序。  


## 五、聚合为对象  


上面聚合为数组只支持聚合多行一列为一行一列。  
如果有多行多列的话，该如何操作呢？  


查看 MYSQL 的官方文档，发现剩余的函数只剩下一个函数了。  
那就是 JSON_OBJECTAGG 。  


但是阅读下文档，会发现这个函数只能聚合两列，一列作为 Key，一列作为 Value。  
如果有重复的 key，将会值保留最后一个。  



```
mysql> select A.c_name, A.c_users, JSON_OBJECTAGG(B.c_id, B.c_name)  user_info
from A, B 
where A.c_id = 'tk' and FIND_IN_SET(B.c_id, A.c_users) 
group by A.c_name;

+--------+----------+------------------------------------------+
| c_name | c_users  | user_info                                |
+--------+----------+------------------------------------------+
| one    | b,c,d,aa | {"aa":"aa","b":"bb","c":"cc","d":"dd"}   |
+--------+----------+------------------------------------------+
```





## 六、最后  


可以发现， MYSQL 内置了有限的四类聚合函数。  
分别是计数、拼接字符串、JSON 数组、JSON 键值对。  


至于更复杂的聚合需求，就需要我们自己想办法实现了。  


小问题：比如多行三列，如何聚合为一个字段呢？  


参考文档：https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html  



加油，打工人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

