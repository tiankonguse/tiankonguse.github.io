---   
layout:     post  
title:  写个bash采集CPU信息  
description: 有个bash命令我不会，向大家请教个一下  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateDate:  2020-01-12 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 零、背景  


最近在做性能优化。  


性能优化其实有一套科学方法的。  
比如最基本的是对照试验，即除了一个因素不同外，其他因素都需要保持不变。  


对照试验做完之后，就是数据采集了。  


压测数据阶段数据一般比较稳定，我都是人工采集的。  
而线上服务进行对照试验时，数据有一定的波动，人工采集就会产生较大的误差。  


所以我写了一个 BASH 函数来采集各个对照系统的数据，最终生成数据结果。  


是的。这篇文章是介绍这个 BASH 函数的，如何科学的性能优化以后再分享。  


## 一、采集需求  


性能优化，访问量相同的情况下自然是采集优化前与优化后的 CPU 数据了。  


但是我的服务是多进程模式，即一个 8 核的机器，跑了 8 个进程，CPU 没有那么均匀。  
另外每一秒的请求量也是有波动的，虽然相同两秒波动不大，但是时间拉长到十几秒，最大值与最小值相差还是蛮大的。  


面对这两个问题，我得出两个结论。  


1、需要采集所有 CPU 的数据。  
2、需要连续采集一段时间的数据。  


这两个结论分别为了解决上面的两种波动与不均匀。  



那总结下就是，需要采集所有 CPU 在连续若干时间内的数据，并计算出一个 CPU 核的平均值。  


## 二、相关技术  


第一步是获取所有进程。  


原先我是手动 TOP 上 copy 出来的， 后来重复了几次，怒了，就写了一个命令自动获取进程列表。  


思路是 `ps` 出所有进程，然后 `grep` 出目标进程， 最后 `awk` 计算出进程列表。  


大概命令如下：  


```
pidlist=$(
ps -aef |
grep "name" | 
grep -v "name" | 
awk 'BEGIN{ iplist=""; }
    { 
        if(iplist=="") iplist=$2;
        else iplist=iplist","$2; 
    }
    END{ print iplist }')
```


`grep -v` 参数是为了过滤 `grep` 自身这个命令。  
`awk` 是为了提取出对应的进程号，然后使用逗号链接起来。  
`$()` 代表运行一个命令，结果返回给前面的变量。  


第二步是统计与计算各进程的`CPU`信息。  


思路是先使用`top`收集所有时间这些进程的`CPU`信息，然后使用`sed`和`awk` 来处理文本，得到`CPU`值，最后重定向到文件里。  



大概命令如下：  


```
top -b -n 60 -p $pidlist 
| grep "name"  
| sed "s/ \+/ /g"  
| awk '{print $9 }'  
> cpu_base.log  
```


`top -b -n 60 -p $pidlist` 是为了使用命令行模式采集 60 次这些进程的信息。  
`sed` 是为了进程正则替换。  
`awk` 是提取信息。  
`>` 重定向到文件。  


当然我的实际情况是不同机器输出的TOP不一样，我对数据进行了归一化，写的非常复杂的`sed`正在表达式，这里简化只为了演示。  


那么问题来了：大家知道怎么用`TOP`命令行式来输出指定的字段吗？  
比如只输出进程和`CPU`，那就不需要那么多`sed`和`awk`了。  



第三步是对数据加工去燥。  


思路是排序，去掉最大的 8 个数据和最小的 8 个数据，然后保存起来。  


```
cat cpu_base.log 
| sort -n 
| head --lines=-8 
| tail --lines=+9  
> cpu_sort.log  
```


`sort -n` 是按数字进行排序。  
`head --lines=-8` 过滤最后8行。  
`tail --lines=+9` 过滤前8行。  


第四步是数据整理。  


思路是对所有数据求和，求平均值。  


```
sum=0
num=0
for v in $(cat cpu_sort.log);
do
    num=$((num+1))
    sum=$(echo "$sum + $v" | bc)
done 
avg=$(echo "$sum / $num" | bc)
echo "SUM[$sum] num[$num] avg[$avg]"
```


`for in ; do done` 是 bash 的循环语法。  
`$(())` 是进行整数运算。  
`bc` 是进程浮点数运算。  


这样，我就采集完数据了。 


![](https://res2020.tiankonguse.com/images/2020/01/13/001.png)  


## 三、最后  


上面我提到了，有个bash命令我不会，向大家请教个一下。  


问题：大家知道怎么用`TOP`命令行式来输出指定的字段吗？  
如果你知道的话可以告诉我，有红包奖励。  



-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

