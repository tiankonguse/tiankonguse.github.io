---
layout: post
title: vibe coding：更强大的 spec-kit
description: 体验了一下 spec-kit，太强大了。
keywords: 项目实践
tags: [项目实践]
categories: [程序人生]
updateDate: 2026-04-11 12:13:00
published: true
---


## 零、背景


前文《[2周消耗4亿tokens做8个项目](https://mp.weixin.qq.com/s/UJv--yyyXgzyuKaRbQMvYA)》提到，我连续两周 vibe coding 写了不少项目。  


前几天我在《[spec code 将被 agent 替代](https://mp.weixin.qq.com/s/sO03A59K8c_2fntQrRq4VQ)》中分享了我使用 OpenSpec 的经验。  


这个周末，我体验了一下 spec-kit，发现 spec-kit 更强大。  


## 一、介绍


spec-kit 是由 GitHub 官方团队开发并维护的规格驱动开发（SDD）框架。  
Git 仓库的简介写的是：Toolkit to help you get started with Spec-Driven Development。  


源码地址：https://github.com/github/spec-kit  
官网地址：https://github.github.com/spec-kit/


OpenSpec 默认只有三个步骤：需求规划 `/opsx:propose`、执行 `/opsx:apply`、归档 `/opsx:archive`。  


而 spec-kit 则拆分为 7 个步骤，其中 2 个是可选的，必选的是 5 个步骤，后面会逐一展开介绍。  


## 二、安装 spec-kit


如果你阅读官网的 Installation Guide 页面或者 Quick Start Guide 页面，会发现安装命令非常麻烦，介绍了十几种安装方式。  


官网 Installation Guide 页面：https://github.github.com/spec-kit/installation.html  
官网 Quick Start Guide 页面：https://github.github.com/spec-kit/quickstart.html


之所以麻烦，是因为官网把安装与使用合并在一起了，这也导致第一次使用的人感到非常困惑。  


我个人觉得，官网的文档有点画蛇添足，完全违背了软件文档"简洁明了"的原则。  


实际上安装命令只需要下面一条即可。  


```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```


## 三、初始化到项目 init


对于一个项目，初次使用 specify-cli 时，需要把 specify-cli 初始化到项目中，命令如下。  


```bash
# cd 到项目的目录
specify init .
```


![截图](https://res2026.tiankonguse.com/images/2026/04/11/002.png)
![截图](https://res2026.tiankonguse.com/images/2026/04/11/003.png)
![截图](https://res2026.tiankonguse.com/images/2026/04/11/004.png)



执行这个命令后，spec-kit 会在项目下生成一个 `.specify` 目录，其下又会生成 memory、scripts/bash、templates 三个子目录。  


同时，你也会发现 `.claude` 目录里被安装了 commands 和 skills。  


![截图](https://res2026.tiankonguse.com/images/2026/04/11/001.png)
![截图](https://res2026.tiankonguse.com/images/2026/04/11/005.png)


## 四、生成宪法 constitution


上一步 `specify init .` 只是把 spec-kit 的文件安装到了项目中，接下来还需要让 AI 分析项目并生成项目的"宪法"文件。  


在 Claude 里运行命令 `/speckit.constitution` 即可。  


执行这个命令后，会生成项目的基本信息文件 `constitution.md`。  


spec-kit 把这个文件称为 Constitution（宪法），它定义了项目的核心规则和原则，如技术栈、架构约束、编码规范、安全要求等。  


类似于 Claude 的 `CLAUDE.md` 或者 `Agent.md`，spec-kit 也会生成一份属于自己的项目描述信息。  


这一步执行时，命令支持输入一些自定义的 Constitution 内容，但我们一般不需要手动输入，保持为空，让 AI 自己去分析项目并总结出规则与原则即可。  


这也是我之前在《[spec code 将被 agent 替代](https://mp.weixin.qq.com/s/sO03A59K8c_2fntQrRq4VQ)》中提到的，AI 分析完整个项目后，会记住项目的架构、模式、风格等，后续生成的代码也会与当前项目保持一致。  


## 五、创建规范 specify


虽说这一步叫"创建规范"，但对于我们来说，真实含义是提出需求。  


我们通过这一步的命令来描述需求，让 AI 来分析与拆解需求，俗称对齐颗粒度。  


使用样例如下：  


```claude
/speckit.specify 在 xx 页面点击 xx 按钮时，显示的数据是 A，预期是 B，帮忙分析下原因，解决下这个问题。
```


![截图](https://res2026.tiankonguse.com/images/2026/04/11/006.png)


执行完这个命令后，spec-kit 会在 specs 目录生成一个有编号的类似于 `001-xxx` 的目录。  
另外看官方文档，宣称还会根据需求生成语义化分支名，并直接创建 Git 分支。  
最终会用模板生成规范文档，并填入需求描述，生成 Spec 文档。  


PS：实际执行过程中，你会发现报错导致没有生成分支，文章的最后我再介绍怎么解决。  


```text
ERROR: Not on a feature branch. Current branch: main
Feature branches should be named like: 001-feature-name, 1234-feature-name, or 20260319-143022-feature-name
```


## 六、完善需求 clarify


创建需求后，接下来还有一步可选的完善需求步骤。  
这也很正常，有可能需求描述得太简单，AI 没有理解到位，这时候就需要指出哪些需求理解有误，及时进行纠正。  


```claude
/speckit.clarify 关于你提及的 xxx 内容，理解有误，应该是 xxx。背景信息是 xxx。
```


## 七、规划 plan


如果确认需求没问题了，就可以执行 plan 命令来输出规划了。  


```claude
/speckit.plan
```

这个命令也支持我们输入一些指导性的规划内容，例如技术栈和架构选择。  
但是作为 vibe coding，我们肯定不会输入任何内容，直接输入命令回车即可。  


![截图](https://res2026.tiankonguse.com/images/2026/04/11/007.png)


## 八、任务拆分 tasks


方案输出之后，就是把方案拆分为一系列任务了。  


```claude
/speckit.tasks
```

这一步会基于 plan 的内容，生成一份可执行且按依赖关系排序的 `tasks.md` 文件。  


![截图](https://res2026.tiankonguse.com/images/2026/04/11/008.png)


## 九、分析 analyze


拆分任务与执行任务之间，还有一个可选的步骤，用来最后一次审视需求、规划、任务等材料，检查所有文档之间是否存在矛盾、重复、歧义以及描述不足之处。  


```claude
/speckit.analyze
```

![截图](https://res2026.tiankonguse.com/images/2026/04/11/009.png)


## 十、执行 implement


终于到最后一步——执行了。  


```claude
/speckit.implement
```

![截图](https://res2026.tiankonguse.com/images/2026/04/11/010.png)


![截图](https://res2026.tiankonguse.com/images/2026/04/11/011.png)


## 十一、最后


就这样，我们使用 spec-kit 完成了一个 SDD（规格驱动开发）需求的完整开发流程。  


在这个过程中我遇到了三个问题。  


第一个问题是没有自动创建分支。  
原因是还需要手动安装一个 spec-kit 的 Git 插件。  


```bash
# 直接在命令行里运行
specify extension add git
```

安装之后，插件位置在 `.specify/extensions/git`。  
还需要手动把 `.specify/extensions/git/commands` 中的 commands 都复制到 `./.claude/commands`。  


![截图](https://res2026.tiankonguse.com/images/2026/04/11/012.png)


第二个问题，也算是一条经验教训。  
一次不要做太大的需求，否则会触发 Claude 的 Conversation compacted（自动压缩上下文）。  
一旦触发压缩，Claude 就会失忆，spec-kit 的要求全部会失效。  
例如我有一次正在执行 `tasks` 的时候自动触发了上下文压缩，结果 Claude 一口气就把任务也都执行了。  


第三个问题是这么多步骤导致开发速度变得非常低。  
每一轮交互都需要等几分钟，一个需求迭代一轮至少需要半个小时。  


这或许是规范驱动开发与 AI 自由开发之间的矛盾吧。  
我们通过规范来约束 AI，但效率也随之降低了。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code
