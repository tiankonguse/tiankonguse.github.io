---   
layout:  post  
title: ssh 端口转发   
description: 神奇的功能        
keywords: 项目实践  
tags: [项目实践]    
categories: [项目实践]  
updateData:  2023-03-21 18:13:00  
published: false  
---  


![](https://res2023.tiankonguse.com/images/2023/03/21/ssh-tunnel-min.webp)


## 零、背景  


ssh (Secure Shell)，基本的功能是安全的远程登录到客户端。  


之所以“安全”，是因为对传输的数据进行了加密，这样在远端系统执行的命令是安全的，无法被中间节点篡改的。  


而这种安全，也可以帮我们实现一些 Tunneling 的功能，或者称为 Forwarding。  



## 一、SSH 隧道  


SSH 隧道通过 SSH session 来传输额外数据的方法。  

SSH 隧道有很多安全相关的使用场景，例如不暴露端口访问远程WEB服务器，在 NAT 中访问外部服务，不暴露本地的端口等等。  


## 二、工作原理


当使用 SSH 连接一个服务器时，就可以访问服务的 shell。  


此时，SSH 客户端与服务端会创建一个加密的 session。  
不过 SSH session 对传输的数据类型没有限制。  
这就可以获得本地端口转发、远程端口转发、动态端口转发、TUN/TAP隧道，  


![](https://res2023.tiankonguse.com/images/2023/03/21/ssh-tunnel.webp)


## 三、本地端口转发


SSH 在客户端创建一个本地端口。  


本地电脑向本地端口发送的请求，都会自动通过 SSH 转发到远程端口。  


```
ssh -L server_port:remote_ip:local_port ssh_user@ssh_ip:ssh_port
```


这个类似于 nginx 的正向代理（用户主动访问代理端口）。  


## 四、远程端口转发


本地电脑在本地创建了一个本地服务端口，通过 shh 映射到 ssh 服务器的一个远程端口，对外服务。  


外网通过访问 ssh 服务器的远程端口来访问本地电脑的服务。  


这个类似与 nginx 的反向代理（用户不知道代理的存在）。  


```
ssh -R remote_port:local_port ssh_user@ssh_ip:ssh_port
```



![](https://res2023.tiankonguse.com/images/2023/03/21/remote-port-forwarding.webp)


使用这个功能需要打开 `GatewayPorts` 开关。  

```
sudo vim /etc/ssh/sshd_config

GatewayPorts yes

sudo /etc/init.d/ssh restart
```


## 五、动态端口转发  


动态端口转发会创建一个 SOCKS5 代理服务。  


```
ssh -D local_port ssh_user@ssh_server
```


![](https://res2023.tiankonguse.com/images/2023/03/21/dynamic-port-forwarding.webp)


参考资料：  


* [Dynamic port forwarding with SSH and SOCKS5](https://www.antoniogioia.com/dynamic-port-forwarding-with-ssh/)  
* [How to set up SSH dynamic port forwarding on Linux](https://www.redhat.com/sysadmin/ssh-dynamic-port-forwarding)
* [SSH 动态端口转发(Dynamic Port Forwarding)](http://linuxcoming.com/blog/2019/07/18/ssh_socks.html)
* 


## 六、TUN/TAP隧道  

TUN/TAP are virtual network interfaces that can be used to create a tunnel between two servers.   


## 七、HTTP 代理转 SOCKS 代理


```
function FindProxyForURL(url, host) {
    return "SOCKS socks_ip:socks_port";
}
```


参考 [让 iPhone iPad 连接的 wifi 能够使用 socks 代理](https://hellodk.cn/post/848)。  



## 参考资料  


* [SSH Tunneling Explained](https://goteleport.com/blog/ssh-tunneling-explained/)






《完》  


-EOF-  



本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
  

