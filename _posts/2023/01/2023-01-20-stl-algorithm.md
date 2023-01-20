---   
layout:  post  
title: 分享下 STL algorithm 库我常用的函数  
description: 多使用库函数，可以提高比赛效率。        
keywords: 算法,leetcode,算法比赛  
tags: [算法,leetcode,算法比赛]    
categories: [算法]  
updateData:  2023-01-20 18:13:00  
published: true  
---  


## 零、背景  


对于一个数组，经常会遇到这样的要求：优先按值大小进行选择，相等的按下标顺序顺序选择。  
比赛的时候，我一般是按题意写一个排序函数。  


后来想，值相同按下标顺序，其实就是稳定排序，即排序不改变相同值的前后顺序。  
如果直接调用 STL 的稳定排序库函数，比赛时的代码量就可以降低很多，从而提高编码速度。  


所以我研究了下 STL 的 algorithm 有哪些功能，方便比赛的时候可以直接使用这些功能，防止重复造轮子而浪费时间。  


## 一、库位置  


algorithm 库提供的每个功能对应一个文件，存放在 `__algorithm` 目录中，通过 include 引入。  


可以看到，这个库共有 93 个功能文件，下面按分类分别介绍些这些功能。  


![](https://res2023.tiankonguse.com/images/2023/01/20/001.png) 



## 二、我最常用的功能  


看完 algorithm 库的所有函数，发现我用的好少，只有 7 个。  


* max 求最大值（可以传多个参数）  
* min 求最小值（可以传多个参数）  
* `lower_bound` 二分查找，大于等于  
* `upper_bound` 二分查找，大于  
* sort 快排  
* reverse 反转容器  
* swap 交换两个容器  


## 三、未来打算使用的功能  


在 algorithm 库看了所有函数，发现大部分功能都用不上，可以新增的只有 6 个函数。  


* `max_element` 迭代器的最大值  
* `min_element` 迭代器的最小值  
* `stable_sort` 稳定排序  
* unique 移除指定范围中彼此相邻的重复元素  
* `is_sorted` 判断迭代器是否有序  
* fill 填充值  


## 四、暂时不打算用的功能  


algorithm 库还有很多其他功能，目前我暂时没找到使用场景。  


* count 与目标值匹配的元素个数  
* `count_if` 满足条件的个数  
* equal 判断两个容器是否相等  
* find 查找第一个相等的位置  
* `find_if` 查找第一个满足条件的位置  
* `find_if_not` 查找第一个不满足条件的位置  
* `find_first_of` 子串查找第一个出现位置  
* `find_end` 子串查找最后一个出现位置  
* `adjacent_find` 查找第一个相邻元素满足条件的位置  
* `minmax_element` 同时计算最小值和最大值  
* minmax 同时计算最小值和最大值  
* `binary_search` 二分查找是否存在  
* `equal_range` 二分查找存在的区间   
* `all_of` 是否都满足  
* `any_of` 是否至少一个满足  
* `none_of` 是否都不满足  
* clamp 将值与上限和下限进行比较  
* `generate/generate_n` 依次把生成器生成的值赋值给迭代器  
* shuffle 随机打乱  
* `inplace_merge` 合并两个有序迭代器。  
* merge 合并两个有序的迭代器。  
* `partition/partition_copy/partition_point` 将迭代器划分为两部分  
* includes 判断一个有序迭代器是否包含另外一个有序迭代器  
* `lexicographical_compare` 字典序比较两个迭代器  
* mismatch 两个迭代器第一个不同的位置  
* `make_heap/pop_heap/push_heap` 堆操作  
* `sort_heap` 堆排序  
* `is_heap/is_heap_until` 迭代器是否是堆。  
* `is_partitioned` 判断是否条件值为 true 的元素都在条件值为 false 的前面  
* `nth_element` 按指定迭代器的值对迭代器进行分区  
* `is_permutation/next_permutation/prev_permutation` 排列函数  
* `is_sorted_until` 判断是否有序，返回第一个不满足有序的位置  
* `partial_sort/partial_sort_copy` 部分排序，即得到最小的 n 个有序元素  
* `iter_swap` 交换迭代器的值  
* `remove/remove_copy/remove_copy_if/remove_if` 删除指定值  
* `replace/replace_copy/replace_copy_if/replace_if` 替换指定值  
* `copy/copy_n/copy_if` 复制迭代器的值  
* `for_each/for_each_n` 遍历容器  
* `fill_n` 迭代器填充值  
* `move/move_backward` 移动迭代器的值  
* `reverse_copy` 反转迭代器  
* `rotate/rotate_copy` 交换迭代器的前后部分  


## 五、最后  


看完 algorithm 的功能列表，最终我会使用的功能也只有 13 个， 你都使用了哪些功能呢？  



加油，算法人。  


《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

