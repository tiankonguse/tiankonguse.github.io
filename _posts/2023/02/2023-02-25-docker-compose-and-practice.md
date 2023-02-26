---   
layout:  post  
title: docker compose 实践        
description: 了解 docker compose 技术，并最终实践。  
keywords: 项目实践  
tags: [项目实践]    
categories: [项目实践]  
updateData:  2023-02-25 18:13:00  
published: true  
---  


## 一、背景  



![](https://res2023.tiankonguse.com/images/2023/02/25/001.png)  


前段时间，我在《[NC 攀岩馆的小程序挂了](https://mp.weixin.qq.com/s/H7325ReMp3OgVav408bNQw)》文章提到，NC 的架构比较简单。  


![](https://res2023.tiankonguse.com/images/2023/02/02/001.png)  


如上图，nginx 负责静态网站和接口反向代理转发到 java 服务，java 服务会操作 mongoDB 数据库。   


面对这种架构的服务启动问题，朋友圈有人建议使用 docker compose 来管理多个服务。  


于是我研究了下 docker compose，并把这三个服务通过 docker compose 来管理了。  


这个过程中，我也对 docker 有了更深入的理解。  



## 二、基础准备    


分析架构图，可以明确需要三个 docker 镜像：nginx、java 服务、mongoDB。  


其中 nginx 和 mongoDB 可以直接使用开源的镜像，而 java 服务则需要自己编写 Dockerfile 来制作镜像。  


```Dockerfile
FROM openjdk
EXPOSE 8080
RUN mkdir /app
COPY ./nerdcave.jar /app/nerdcave.jar
CMD ["java", "--illegal-access=warn", "-jar", "/app/nerdcave.jar"]
```


另外三个服务分别有下面的外部依赖。  


mongo 服务：开放 27017 端口，数据需要存在容器外的磁盘。  
java 服务：开放 8080 端口，需要感知到 mongo 服务的存在来通信。  
nginx 服务：开放 80 端口，通过配置文件来感知到 java 服务存在，并转发数据，另外还通过配置文件映射静态网站，静态网站也在容器外的磁盘上。  



docker 容器对文件的依赖可以通过持久化映射来解决。  



默认情况下，每个容器有自己的单独一个网络，容器之间是不能直接互相通信的。  


所以对于端口问题比较麻烦。  


多个 docker 容器如何通信问题解决了，docker 集群也就搭建起来了。  


## 三、主机通信  


docker 之间通信，最简单的方式是通过映射主机端口，所有 docker 容器与主机通信。  


例如我电脑的 IP 是 192.168.0.115，所以所有需要通信的地方，都明确指定电脑的 IP。  


mongoDB 配置如下：  


```
docker run -d \
    --name nerd-cave-mongo-host \
    -p 27017:27017 \
    -v ${nerd_cave_web}/mongo/data:/data/db \
     mongo
```


java 服务配置如下：  


PS：给做这个 java 服务的人点赞，读 mongoDB 时虽然没通过配置文件获取 IP:PORT，代码写死了腾讯云 CVM 的 IP，但是支持环境变量透传。  


```
docker run -d \
    --name nerd-cave-service-host \
    -p 8080:8080 \
    -v ${nerd_cave_web}/mongo/data:/data/db \
    -e SERVERS=192.168.0.115:27017 \
    nerd-cave-service
```


nginx 服务配置如下：  


```
docker run -d \
    --name nerd-cave-nginx-host \
    -p 80:80 \
    -v ${nerd_cave_web}/cms/dist:/usr/share/nginx/html/cms/  \
    -v ${nerd_cave_web}/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
    nginx
```


nginx 配置如下：  


```
location / {
   proxy_pass http://192.168.0.115:8080;
}
```


就这样，依次启动三个服务，我们的网站就在 docker 中运行起来了。  


```
tiankonguse@SKYYUAN-MB0 nerd.cave-web % docker ps
CONTAINER ID   IMAGE              PORTS                      NAMES
4ec9101df7cc   nginx              0.0.0.0:80->80/tcp         nerd-cave-nginx-host
06c9b7ad7892   nerd-cave-service  0.0.0.0:8080->8080/tcp     nerd-cave-service-host
a9f910e73ca8   mongo              0.0.0.0:27017->27017/tcp   nerd-cave-mongo-host
```


## 四、docker network 通信  



我们可以通过 docker network 来把多个容器加入到一个网络中。  
多个容器之间虽然不知道互相之间的 IP，但是可以用网络名通过 DNS 查到对方的 IP，从而可以通信。  


容器间可以直接通信后，mongo 和 java 服务我们甚至不需要与主机映射端口了，这样网络也更安全。  


以 java 服务为例，生成容器时指定 network，并把主机的 ip 换成容器的网络名即可。  


```
docker run -d \
    --name nerd-cave-service \
    --network nerd-cave \
    -v ${nerd_cave_web}/mongo/data:/data/db \
    -e SERVERS=nerd-cave-mongo:27017 \
     nerd-cave-service
```


nginx 的配置而已一样，换成 java 的主机名即可。  


另外，为了避免不同场景切换到不同的 java 服务，这里通过负载均衡配置三个常用的下游地址。  


```
upstream backend {
    server 127.0.0.1:8080; # 非 docker 场景使用
    server nerd-cave-service:8080; # docker network 场景使用
    server 192.168.0.115:8080; # 电脑的IP
}
location / {
   proxy_pass http://backend;
}
```


## 五、docker compose 打包  


通过 docker network ，多个容器可以正常通信运行了，但是管理起来比较麻烦，每次需要手动启动三个服务。  


此时就可以通过 docker compose 来把所有容器打包在一起，一键即可启动服务。  


```
services:
  nerd-cave-mongo:
    image: mongo
    volumes:
      - ./mongo/data:/data/db
  nerd-cave-service:
    image: nerd-cave-service
    env_file:
      - ./server/server.env
    environment:
      SERVERS: "nerd-cave-mongo:27017"
      APP_ENV: "LOCAL"
    depends_on:
      - nerd-cave-mongo
  nerd-cave-nginx:
    image: nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./cms/dist:/usr/share/nginx/html/cms/
    ports:
      - "80:80"
    depends_on:
      - nerd-cave-service
```


可以发现，docker compose 的配置与三个 docker 创建容器的配置几乎一样，只是通过一个文件来统一管理。  


```
tiankonguse@SKYYUAN-MB0 nerd.cave-web % docker ps
CONTAINER ID   IMAGE               PORTS                NAMES
f94d97682f81   nginx               0.0.0.0:80->80/tcp   nerdcave-web_nerd-cave-nginx_1
82a13f37754b   nerd-cave-service   8080/tcp             nerdcave-web_nerd-cave-service_1
571b534ab4be   mongo               27017/tcp            nerdcave-web_nerd-cave-mongo_1
```


## 五、最后  


搭建 docker compose 时，我是参考 docker 官方英文文档进行的。  


不得不对官方的文档点赞，遵循文档一步步执行，自己的 docker compose 就搭建起来了。  


尤其是把三个容器之间通信部分解决后，也理解了 docker 的网络部分。  


官方 docker 文档地址：https://docs.docker.com/get-started/    





《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

