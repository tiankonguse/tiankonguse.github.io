---   
layout:     post  
title:  升级linux内核，初步使用docker
description: 使用的一个东西被打包进docker了，所以我也被动学习了一下docker。  
keywords: 程序人生  
tags: [程序人生]    
categories: [程序人生]  
updateData:  2019-11-01 21:30:00  
published: true  
wxurl: https://mp.weixin.qq.com/s/vc-QsIJ7rcst_Ch1EG5R2A  
---  


## 一、背景  


最近参加一个项目，由于依赖较多的东西，编译环境突然迁移到 docker 里面去了。  
当我尝试使用 docker 时，发现 docker 依赖的最低 Linux 内核版本我的机器不达标。  
所以就需要先升级 Linux 内核，然后再操作 docker 了。  


下面记录一下这两个事情。  


## 二、升级 Linux 内核  


对于内核，我们需要能够先查看版本。  


```
$ uname -r
3.10.107-1-linux2-0048
```


然后就是升级到目标版本。  


```
yum install kernel-linux2-3.10.107-1.0049.tl2
yum update -y systemd rsyslog
```


最后重启即可。  


```
reboot
```


此时，再查看 linux 内核版本，就是自己安装的版本了。  


## 三、安装 docker  


现在的操作系统，一般都有源，一条命令即可安装。  


```
yum install docker-ce -y  
```


然后配置一下网络。  


```
sudo brctl addbr docker0
sudo ip addr add 192.168.100.1/24 dev docker0
sudo ip link set dev docker0 up
ip addr show docker0
```


最后重启 docker 即可。  


```
systemctl daemon-reload
systemctl restart docker
```


## 四、使用 docker  


1）搜索镜像  


```
docker search centos
```


[](//res2019.tiankonguse.com/images/2019/01/001.png)  


2）拉取镜像    


```
docker pull 地址[:端口号]/仓库名[:标签]
```


3）查看镜像  


```
docker images  
```


4）运行容器    


```
docker run -it centos:latest /bin/bash 

-i 交互式操作
-t 分配伪终端
--rm：容器退出后随之将其删除（默认不删除）
-d 后台运行
--name 指定容器名
-v 可以指定持久化目录。  

```


5）查看运行的容器   


```
docker ps
```



6）登录容器  


```
docker exec -it [container_id 或 container_name] /bin/bash
```


7）退出容器  


```
exit
```


8）停止容器  


```
docker container stop
```


9）删除容器  


```
docker rm [container_id]
```


## 五、最后  


有了上面的九个命令，我们就可以愉快的进入或退出容器了。  


容器指定持久化目录很有用。  
因为指定之后一方面容器可以和机器互相传文件了，另一方面容器的数据也可以保存起来。  
毕竟容器自身是没有状态的，死了数据就可能丢失了。  


调查问卷1：你使用过上面这些命令吗？  
调查问卷2：你制作过 docker 镜像吗？


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
QQ算法群：165531769（不止算法）  
知识星球：不止算法  

