---
layout: post  
title: coplot 2分钟生成项目文档与 think 模式自动解决编译问题     
description: 拿到一个旧项目的代码，使用 coplot 来帮忙看下。  
keywords: 项目实践 
tags: [项目实践]  
categories: [AIGC]  
updateDate: 2025-04-23 12:13:00
published: true  
---

## 零、背景  


团队内有一个大数据计算任务，使用 scala 语言编写的，但是团队内要么是 cpp 语言开发要么是 go 语言开发，都不了解这个，导致这一块这么多年来都处于无人维护状态。  


这个计算任务是每小时跑一次，经常被投诉任务失败或者超时。  
所以我就打算找个人把这个任务重构一下，从而能够维护起来，并修复任务超时的问题。  



最近招了一个新同学来重构这个任务，方案评审时发现新同学缺少这个旧代码的具体介绍，所以我赶紧现场使用大模型自动分析代码生成了文档，发现太方便了。  



## 一、使用 copilot 生成项目文档  


prompts: 分析下这个项目的代码，画出一个流程图、时序图、架构图。  


![](https://res2025.tiankonguse.com/images/2025/04/23/001.png)   


coplot 竟然使用纯文本画出了流程图、时序图、架构图。  


流程图：  


![](https://res2025.tiankonguse.com/images/2025/04/23/002.png)   


时序图：  


![](https://res2025.tiankonguse.com/images/2025/04/23/003.png)   


架构图:  


![](https://res2025.tiankonguse.com/images/2025/04/23/004.png)   



当然，也有这个项目的功能总结。  


![](https://res2025.tiankonguse.com/images/2025/04/23/005.png)   



由于输出的架构图是文本形式，我赶紧换了一个 prompts，要求输出 mermaid 格式的图。  


prompts: 分三步输出：第一步使用文字输出代码的逻辑，第二步使用 mermaid 输出相关图，第三步看下代码有啥问题。  


生成的 mermaid 贴到 https://mermaid.live/ 即可生成各种图。  


![](https://res2025.tiankonguse.com/images/2025/04/23/006.png)   


## 二、使用 copilot 自动修复编译问题  


评审之后，我也想在我的电脑上尝试编译这个项目，看看能不能编译通过。  


prompts：scala 程序如何编译打包  


![](https://res2025.tiankonguse.com/images/2025/04/23/007.png)   


大概命令是：  


```bash
mvn clean compile
mvn package
```


当然，由于我还没安装 maven，所以报错”zsh: command not found: mvn“。  



![](https://res2025.tiankonguse.com/images/2025/04/23/008.png)   



所以需要先安装 maven。  


```bash
brew install maven
```


随后编译报错：scala.reflect.internal.MissingRequirementError: object java.lang.Object in compiler mirror not found。  



![](https://res2025.tiankonguse.com/images/2025/04/23/009.png)   


随后需要安装 java8。  



```bash
brew install --cask temurin@8
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-8.jdk/Contents/Home
mvn clean compile
```


之后还是报错。  
Claude 3.7 提示额度用完了，于是我把大模型切换的了 Claude 3.5 Sonnet 后，没想到大模型开始自我反思去死循环尝试解决问题了。  


![](https://res2025.tiankonguse.com/images/2025/04/23/010.png)   



从错误信息和前文的上下文来看，这是因为项目需要使用 Java 8，但当前系统使用的是 Java 21。  
我看到您的项目中已经有了 build.sh 脚本，它正确设置了 Java 8 环境。让我们直接使用这个脚本来编译：  


```
chmod +x build.sh && ./build.sh
```


我们尝试运行 build.sh 脚本进行编译。  
如果您仍然看到相同的错误，我们需要进一步确认 Java 8 的安装和配置：  


```bash
/usr/libexec/java_home -V
```


我看到您的系统上已经安装了两个 Java 版本：  


```text
1. Java 21 (arm64)：Home
2. Java 8 (x86_64)：Home
```

让我们修改一下 build.sh 脚本以确保使用正确的 Java 8 路径：`build.sh +11 -0`。  


我看到您的系统上已经正确安装了 Java 8。  
我刚刚修改了 build.sh 脚本，使其直接指向 Java 8 的具体安装路径，这样可以确保编译时使用正确的 Java 版本。  


让我们再次尝试运行编译：`./build.sh`  


刚才我修改了 build.sh 脚本，让它直接使用 Java 8 的具体路径。  
让我们验证一下当前编译环境的 Java 版本：`source build.sh && java -version`  



让我们尝试另一种方式来确保使用 Java 8。  
我将创建一个更完整的构建脚本：  `build.sh +11 -0`。  


我已经修改了构建脚本使其更加完善，现在让我们执行这个更新后的脚本：`chmod +x build.sh && ./build.sh`  


好的！现在我可以看到脚本成功切换到了 Java 8（OpenJDK 1.8.0_452），这正是我们项目需要的版本。  
从输出可以看出：  


```text
1. Java 版本已正确切换到 Java 8
2. Maven 开始执行编译
```

不过我注意到输出被截断了，让我们查看完整的编译结果：  
根据执行结果，我看到 Maven 和 Java 环境已经正确配置：  


```text
1. Maven 版本：3.9.9
2. Java 版本：1.8.0_452 (Temurin)
3. Java 路径：/Library/Java/JavaVirtualMachines/temurin-8.jdk/Contents/Home
```

环境配置正确了，Maven 正在使用 Java 8，这应该能解决之前的 `object java.lang.Object in compiler mirror not found` 错误。  


不过编译输出似乎被截断了，让我们使用 -X 参数来查看详细的编译信息：  
通过执行结果，我可以确认当前环境配置是正确的：Maven 已经在使用 Java 8 运行。  
但是在编译输出中还是看不到完整的错误信息。  


让我们尝试一个不同的方式来解决这个问题。  
既然我们确定 Java 版本正确，问题可能出在 Scala 版本的兼容性上。  
让我们稍微降低一下 scala-maven-plugin 的版本，因为 4.3.1 可能与当前的配置不太兼容：`pom.xml +1 -1`.  


我刚刚将 pom.xml 中的 scala-maven-plugin 版本从 4.3.1 降级到了 3.4.4，因为这个版本与 Java 8 的兼容性更好。  
现在让我们再次尝试编译：`./build.sh`  


我看到现在环境已经正确配置：  
 

```
1. Java 版本已成功切换到 Java 8 (OpenJDK 1.8.0_452)
2. scala-maven-plugin 版本已降级到 3.4.4 以提高兼容性
```

但是编译输出仍然被截断了。让我们尝试一个更可靠的方式来查看编译日志：`./build.sh 2>&1 | tee compile.log`  


从执行结果来看，我们已经成功将环境切换到了 Java 8（OpenJDK 1.8.0_452），并且我也将 scala-maven-plugin 的版本从 4.3.1 降级到了 3.4.4 以提高兼容性。  
虽然输出被截断了，但是我们可以尝试使用 VSCode 的任务系统来编译：  


我们已经采取了几个步骤来解决编译问题：  


```text
1. 确认了系统中安装的 Java 8 版本
2. 修改了 build.sh 脚本以确保使用正确的 Java 8 路径
3. 降级了 scala-maven-plugin 从 4.3.1 到 3.4.4 版本
4. 尝试了多种方式执行编译
```

从执行结果来看，Java 环境已经正确切换到了 Java 8（OpenJDK 1.8.0_452），这是我们需要的版本。我最后启动了 VSCode 的编译任务，它会在后台运行。  

让我们等待一会儿，看看编译结果：`cat compile.log`  


从完整的编译日志中，我发现了几个关键问题：  


```
1. 主要错误仍然是 object java.lang.Object in compiler mirror not found，但现在我们可以看到更多上下文。
2. 发现一个额外的问题：[WARNING] The POM for com.xxx.spark:spark-streaming_2.11:jar:2.4.4 is invalid
```

让我们通过以下方式来解决这个问题：  


清理 Maven 仓库中可能损坏的依赖：`rm -rf ~/.m2/repository/com/xxx/spark/spark-streaming_2.11/2.4.4/`  


从完整的编译日志中，我发现问题主要出在两个地方：  


```
1. 一个损坏的 Spark 依赖包（com.tencent.spark:spark-streaming_2.11:jar:2.4.4）
2. scala-maven-plugin 的版本兼容性问题
```

我已经删除了损坏的依赖包。现在让我们再做一次尝试，这次使用 -U 参数强制更新所有依赖.  


![](https://res2025.tiankonguse.com/images/2025/04/23/011.png)   



当我看到 `<think>` 标签时，突然知道为啥这个自言自语为啥和 DeepSeek 一模一样了。  
就这样，我一直看着，最后，Claude 3.5 Sonnet 告诉我编译成功了。  


![](https://res2025.tiankonguse.com/images/2025/04/23/012.png)   


## 三、最后  


下午的评审会议上，我使用 coplot 几分钟生成了项目逻辑与相关架构图、时序图。  


晚上，我又通过 coplot 帮我解决了编译问题。  


自带 think 模式确实很有意思，可以不断尝试解决问题。  


我们只需要看着，什么都不需要做，coplot 自己会去分析错误日志，然后思考怎么解决，然后去尝试解决，就这样一直循环着，直到问题解决。  


我一点都不了解 scala ，也不了解 maven，通过 coplot 的 think 模式，轻松把这个项目编译通过了。  


就凭这点，我打算继续续费 coplot 会员。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  