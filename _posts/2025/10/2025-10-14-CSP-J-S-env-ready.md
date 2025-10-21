---
layout: post
title: CSP-J/S 备赛必学之环境准备
description: VM虚拟机+noi2.0 linux  
keywords: 算法,CSP,算法比赛
tags: [算法, CSP, 算法比赛]
categories: [算法]
updateDate: 2025-10-15 20:13:00
published: true
---



## 零、背景


CSP-J/S 是从 2019 年开始举办的。  


之前已经在《[近 6 年 CSP-J 算法题型分析](https://mp.weixin.qq.com/s/MkE5yfMLioAxGtiFKz1-cg)》和《[历年 CSP-S 算法题型分析](https://mp.weixin.qq.com/s/meOv7fuSQaXEYU3mlOdb8w)》两篇文章里总结了 CSP-J 和 CSP-S 的题型。  


接下来我的规划分两部分：  


规划1：介绍常见算法如何实现，以及历年的真题中是如何应用的。  
规划2：介绍面对比赛，使用什么样的策略，才能尽可能的得高分。  


规划1的第一篇文章是二分，之前已经在《[CSP-J/S 题型总结之二分](https://mp.weixin.qq.com/s/Wi8Bb1fAvQ7BEAwSUZXLdw)》分享过了。  
规划1的第二篇文章是线段树，之前已经在《[CSP-J/S 题型总结之线段树](https://mp.weixin.qq.com/s/KKgBp_AhWvoKS_wVoKX_Rg)》分享过了。  


这篇打算先分享一下编程环境的准备。  


## 一、上机考试环境


CSP-S/J 第二轮电脑环境通常是基于 NOI Linux 2.0 系统，这是中国计算机学会（CCF）官方指定的评测环境。   
部分考点可能会提供 Windows 环境，但参赛选手应在 NOI Linux 虚拟机内完成比赛，因为最终评测仍会在 NOI Linux 下进行，若因环境差异导致问题，申诉可能不被受理。  


2025 年各省的最新通知预计在 10 月 10 日至 10 月 25 日之内会陆续公布，建议大家登录官网查看。  


我分析了 2024 年各省的考试环境，全国 34 个省/市/自治区，数据如下：  


- 参加 CSP-J/S 的省/市/自治区有 32 个，占比 94%（32/34），后续数据统计均以 32 为基数。  
- 截止到 2024 年 10 月 20 日 24:00，已公布考试环境的有 4 个，占比 12.5%（4/32）。  
- 结合 2024 年数据，同时支持 Windows + Linux 的有 18 个，占比 56.25%（18/32）。  
- 只支持 Linux 的有 6 个，占比 18.75%（6/32）。  
- 只支持 Windows 的有 1 个，占比 3%（1/32）。  
- 未公布考试环境的有 3 个，占比 9%（3/32）。  


注1：只有 Windows 的是河南省，可能也支持 Linux，但在官方公告汇总中未查找到相关信息。  
注2：江苏省、香港、澳门三个地方未查到相关公告，不清楚具体考试环境。  


![](https://res2025.tiankonguse.com/images/2025/10/15/011.png)  



官网各省通知地址： https://www.noi.cn/gs/xw/  



如下图，点击具体的省份，查看最新的关于 CSP-J/S 第二轮的通知，一般标题是"认定者须知"或"考生须知"，不同省份名字可能不一样。  


![](https://res2025.tiankonguse.com/images/2025/10/15/001.png)  


通知点进去，可以看到考试环境的信息，大部分省份都提供 Windows + 虚拟机 NOI Linux 2.0，也有部分省份只提供 NOI Linux 2.0。  


![](https://res2025.tiankonguse.com/images/2025/10/15/002.png)  


如果考点只提供 NOI Linux 2.0，或者需要使用 NOI Linux 2.0 提交题目时，那就需要提前在自己电脑的虚拟机里安装一个 NOI Linux 2.0，熟悉其使用方法。  


## 二、虚拟机下载  


虚拟机软件一般使用 VMware 或者 VirtualBox。  


现在 VMware 已经可以免费供个人使用了，所以这里介绍如何下载安装 VMware。  


首先访问注册页面，通过邮箱进行账号注册。  
注册地址：https://profile.broadcom.com/web/registration  



![](https://res2025.tiankonguse.com/images/2025/10/15/003.png) 


注册完成之后，打开免费下载地址，下载虚拟机软件。  
下载地址：https://support.broadcom.com/group/ecx/free-downloads  


Windows 或者 Linux 系统下载 VMware Workstation Pro。  


![](https://res2025.tiankonguse.com/images/2025/10/15/004.png) 


Mac 电脑下载 VMware Fusion。  


![](https://res2025.tiankonguse.com/images/2025/10/15/005.png) 




下载具体版本时，会发现无法直接下载。  
这是因为需要先勾选协议同意书。
想要勾选协议，需要先点开协议同意书链接浏览，之后就可以勾选，然后点击下载。  



![](https://res2025.tiankonguse.com/images/2025/10/15/006.png) 


## 三、安装虚拟机


下载完成后，双击安装包，按照提示一步步点击"下一步"即可完成安装。  


安装过程中的几个注意事项：  


1. 安装路径建议使用默认路径，或选择一个空间充足的磁盘。  
2. 如果提示是否发送使用数据，建议取消勾选。  
3. 安装完成后可能需要重启电脑。  


## 四、安装 NOI Linux 2.0


先下载 NOI Linux 2.0 的系统镜像文件。  
下载地址：https://noiresources.ccf.org.cn/download/ubuntu-noi-v2.0.iso  
官网地址：https://www.noi.cn/gynoi/jsgz/2021-07-16/732450.shtml  


然后启动虚拟机，开始安装系统。  



第一步需要新建一个虚拟系统。  


![](https://res2025.tiankonguse.com/images/2025/10/15/007.png) 


在类型选择上，选择默认推荐的选项即可。  


![](https://res2025.tiankonguse.com/images/2025/10/15/012.png) 


然后选择刚才下载的 ubuntu-noi-v2.0.iso 镜像文件。  


![](https://res2025.tiankonguse.com/images/2025/10/15/008.png) 



接着输入用户名和密码（建议记住这个密码，后续登录需要使用）。  


![](https://res2025.tiankonguse.com/images/2025/10/15/009.png) 


之后一路点击"下一步"即可，系统会自动开始安装。  


![](https://res2025.tiankonguse.com/images/2025/10/15/010.png) 




**注意**：安装过程中，如果有自动升级和数据上报等选项，建议取消勾选，以避免不必要的网络流量消耗。  



## 五、文件结构准备  


打开虚拟机后，第一件事是登录系统，输入之前设置的用户名和密码。  



![](https://res2025.tiankonguse.com/images/2025/10/15/013.png) 


登录成功后，就可以看到 NOI Linux 的桌面了。  

![](https://res2025.tiankonguse.com/images/2025/10/15/014.png) 


接下来按照比赛要求准备文件结构：  


1. 在 noi 文件夹中，按照自己的考号创建对应的文件夹，例如 GD-S12345（GD 代表广东，S 代表 CSP-S，后面是考号）。  


![](https://res2025.tiankonguse.com/images/2025/10/15/015.png) 


2. 在 GD-S12345 文件夹里，以四道题的英文名称分别创建四个文件夹。  
3. 最后，在每道题的文件夹里创建对应的代码文件，文件名需要与题目英文名保持一致。  


创建完成后，文件夹目录结构如下：  


![](https://res2025.tiankonguse.com/images/2025/10/15/016.png)


**重要提示**：  


- 文件夹和文件名必须严格按照要求命名，否则可能导致无法正确评测。  
- 比赛时会提供具体的题目英文名称，按照实际名称创建即可。  


## 六、编写代码


文件结构准备好之后，就可以开始编写代码了。  


NOI Linux 2.0 上可以用来编写代码的工具有 Code::Blocks 和 VS Code。  


建议大家熟悉 VS Code，它的功能更强大，使用也更方便。  


点击左下角的9个点的图标，就可以打开应用列表。  


![](https://res2025.tiankonguse.com/images/2025/10/15/017.png)


默认就可以看到 Code::Blocks，输入 "vs" 可以搜索到 VS Code。  


![](https://res2025.tiankonguse.com/images/2025/10/15/018.png)



点击 VS Code 打开后，点击左侧的文件图标，然后点击 "Open Folder" 按钮。  


![](https://res2025.tiankonguse.com/images/2025/10/15/019.png)


点击左侧的 "Desktop"（桌面），选择 noi 目录，然后点击右上角的 "OK" 按钮。  


![](https://res2025.tiankonguse.com/images/2025/10/15/020.png)


接下来会触发 VS Code 的安全提示，勾选 "Trust the authors of all files in the parent folder" 后，点击 "Yes, I trust the authors" 即可。 



![](https://res2025.tiankonguse.com/images/2025/10/15/021.png)



在 VS Code 左边的目录树中，可以看到之前创建的文件列表。  


编写好代码后，按 **F5** 键，即可编译调试。  
首次编译时，会提示选择编译环境，选择第一个 `C++ (GDB/LLDB)`。  



![](https://res2025.tiankonguse.com/images/2025/10/15/022.png)


随后需要选择 C++ 的编译器版本，选择第一个 `g++ - Build and debug active file` (编译器路径: /usr/bin/g++)。  


![](https://res2025.tiankonguse.com/images/2025/10/15/023.png)


配置完成后，就可以在下方的 Terminal（终端）里输入测试数据，也可以看到程序输出的结果。  


![](https://res2025.tiankonguse.com/images/2025/10/15/024.png)


### 断点调试


如果需要调试代码，可以在指定的代码行号左侧点击一下，会出现一个红色圆点（断点）。  
之后再按 **F5** 编译调试，程序运行到这一行时会暂停，在左侧的调试面板可以查看变量的值、调用栈等信息。  


![](https://res2025.tiankonguse.com/images/2025/10/15/025.png)


### 文件输入输出


CSP-J/S 的代码要求使用文件输入输出，即从 `.in` 文件读取数据，将结果输出到 `.out` 文件。  
这个功能可以封装成一个函数，使用时只需要修改题目名称即可。  


```cpp
#include <iostream>
using namespace std;

#define TASK "add"  // 修改为题目的英文名称

void InitIO() {
    freopen(TASK ".in", "r", stdin);   // 从 add.in 读取输入
    freopen(TASK ".out", "w", stdout); // 将输出写入 add.out
}

void Solver() {
    // 在这里编写每道题的具体代码
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
}

int main() {
    InitIO();  // 初始化文件输入输出
    Solver();  // 调用解题函数
    return 0;
}
```


**代码说明**：  


1. `TASK` 宏定义为题目的英文名称，只需修改这一处即可。  
2. `freopen` 函数将标准输入输出重定向到文件。  
3. 比赛时，确保 `.in` 文件和 `.cpp` 文件在同一目录下。  


### 调试技巧


在本地调试时，可以暂时注释掉 `InitIO()` 函数的调用，直接在终端输入数据进行测试：  


```cpp
int main() {
    // InitIO();  // 调试时注释掉这行
    Solver();
    return 0;
}
```


测试通过后，记得取消注释，恢复文件输入输出功能。  


## 七、常见问题


**Q1: 虚拟机运行很慢怎么办？**  
A: 在虚拟机设置中增加分配的内存和CPU核心数。建议至少分配 2GB 内存和 2 个 CPU 核心。  


**Q2: 找不到 .in 文件怎么办？**  
A: 确保 .in 文件和 .cpp 文件在同一目录下，文件名要完全匹配（包括大小写）。  


**Q3: 编译出错怎么办？**  
A: 检查代码语法错误，确保使用的是 C++14 或 C++17 标准。  


**Q4: VS Code 无法调试怎么办？**  
A: 确保已经生成了 .vscode 文件夹下的配置文件（launch.json 和 tasks.json），如果无法编译，删除 .vscode 文件夹，重新选择配置选项即可。  


## 八、最后  


本文完整介绍了 CSP-J/S 备赛的环境准备工作，包括：  


1. 考试环境查询方法  
2. VMware 虚拟机的下载和安装  
3. NOI Linux 2.0 系统的安装配置  
4. 比赛文件目录结构的准备  
5. VS Code 的使用和代码调试  
6. 文件输入输出的实现方法  


**重要提醒**：  


- 如果你所在的考点使用 NOI Linux 2.0，强烈建议提前安装虚拟机进行练习。  
- 熟悉 Linux 环境和 VS Code 的使用，避免比赛时因为环境不熟悉而浪费时间。  
- 提前准备好文件输入输出的模板代码，比赛时可以快速使用。  
- 多做几次完整的模拟练习，包括创建文件夹、编写代码、编译调试、文件提交等全流程。  


**相关资源**：  


- NOI 官网：https://www.noi.cn/  
- NOI Linux 2.0 官方指南：https://www.noi.cn/gynoi/jsgz/2021-07-16/732450.shtml  
- CCF 官网：https://www.ccf.org.cn/





《完》  


-EOF-  


本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号 ID：tiankonguse-code  
