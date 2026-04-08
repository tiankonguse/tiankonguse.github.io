---
layout: post
title: spec code 将被 agent 替代
description: spec 变成 agent，agent 变成模型基础能力。
keywords: 项目实践
tags: [项目实践]
categories: [程序人生]
updateDate: 2026-04-08 12:13:00
published: true
---


## 零、背景


前文《[2周消耗4亿tokens做8个项目](https://mp.weixin.qq.com/s/UJv--yyyXgzyuKaRbQMvYA)》提到，我连续两周 vibe coding 写了不少项目。  
7 个全新的工具都是前端页面，全部用 Node.js 实现。  


最后一个则是团队的线上服务。  
一开始我还怕 AI 会自由发挥乱修改，把项目改得乱七八糟。  
试了之后才发现，AI 分析完整个项目后，会记住项目的架构、模式、风格等，生成的代码也会与当前项目保持一致。  


随后的一周里，我尝试了 OpenSpec 这个 Spec 工具，有不少体验与感悟，简单记录一下。  


## 一、Spec Code


Spec 编码一般称为 SDD，全称是 Spec-Driven Development（规范驱动开发）。  
简单理解，就是通过制定明确的规范来指导 AI 编程，即先把"做什么"定义清楚，然后再按照规范去实现目标。  


这种方式并不是 AI 时代才有的，而是很早之前就有的方法论。  


例如以前大家做一个较大的系统，一般第一步是写一个详细的技术方案。  
技术方案会分析目标、调研现状、进行方案选型，最后确定选型方案的架构分层、API 与协议、数据库 Schema 等等。  
一切都整理为文档，经过一轮轮评审后，最终才会分工去执行开发。  


方案材料需要技术比较资深的 Owner 来做。  
而具体执行方案的细节时，则是一群人分工来执行。  
这时候，不需要执行的人有很高的水平，每个人只需要按照方案设计，实现对应的模块即可。  


这个过程其实就是规范驱动开发——前期做好规划，后期按照规划实现功能。  


AI 领域中，目前主流的 Spec Code 工具有很多。  
例如 Spec Kit、OpenSpec、IntentSpec、AWS Kiro 等。  


这些工具本质上做的事情都差不多，分为几个步骤。  
第一步：需求分析。  
第二步：设计规划（Design/Plan），并拆分出若干任务（Task）。  
第三步：进行编码（Code/Implement）。  
第四步：可选的归档。  


通过对比这些工具，我最终选择了 OpenSpec，因为 OpenSpec 是专门为存量系统设计的，在已有的项目上运行也非常高效。  


## 二、OpenSpec 安装


首先安装一个 Node 工具。  


```bash
npm install -g @fission-ai/openspec@latest
```


然后在对应的项目里执行初始化操作 `openspec init`。  


这个初始化会在项目里安装对应的 Skill 和 Commands，以及创建对应的 Spec 目录。  


```text
project
├── .codebuddy
│   ├── commands
│   │   └── opsx
│   │       ├── apply.md
│   │       ├── archive.md
│   │       ├── explore.md
│   │       └── propose.md
│   └── skills
│       ├── openspec-apply-change
│       │   └── SKILL.md
│       ├── openspec-archive-change
│       │   └── SKILL.md
│       ├── openspec-explore
│       │   └── SKILL.md
│       └── openspec-propose
│           └── SKILL.md
└── openspec
    ├── changes
    │   └── archive
    ├── config.yaml
    └── specs
```


然后我们打开 AI 工具，按照下面三部曲来操作即可。  


第一步：描述需求与生成执行计划 `/opsx:propose`。  
第二步：执行 `/opsx:apply`。  
第三步：归档 `/opsx:archive`。  


## 三、Spec 封装为 Agent


有没有发现，Spec 的核心在第一步，后两个步骤都只是输入固定的命令。  
既然这样，为何后两步还需要手动输入呢？  


于是，我就实现了一个 Spec Agent，来自动完成这些事情。  


![截图](https://res2026.tiankonguse.com/images/2026/04/08/001.png)


Agent 里面是 OpenSpec 的命令，以及我附加的一些条件，全文如下：  


```markdown
---
name: OpenSpec
description: 
tools: list_dir, search_file, search_content, read_file, read_lints, replace_in_file, write_to_file, execute_command, delete_file, preview_url, web_fetch, use_skill, web_search, automation_update, openspec, cd, mkdir
agentMode: manual
enabled: true
enabledAutoRun: true
---

第一步：`/opsx:propose` 针对用户诉求输出完整方案，必须包含：目标、方案设计、风险点、测试策略。
第二步：`/opsx:continue` 如果方案有问题或需要追加需求，使用该命令补充、修改或细化 Spec。
第三步：`/opsx:apply` 根据 Spec 实现代码，需满足构建成功、所有测试通过、新增逻辑单测覆盖率至少 50%、通过本地代码规范扫描。  
第四步：`/opsx:verify` 对实现进行验证，包括功能验证（核心用例）、回归验证（已有功能不受影响）、边界验证（异常 / 极端输入），输出验证结果或验证 checklist
第五步：`/opsx:archive` 归档最终方案，记录关键决策、取舍（trade-off）与已知限制
```


可以发现，我新增了一些额外的要求，例如构建成功、测试通过、覆盖率等。  
这是因为我在实际使用过程中发现，执行 `/opsx:apply` 后，代码有时候竟然还无法编译，或者编译通过了但单测未通过。  
更常见的是发起 MR 时，被扫描到增量单测覆盖率不够，或者存在代码规范问题。  


这些步骤以前需要手动一个个发起，现在封装为 Agent 后，就可以自动执行了。  


通过这个 Agent，我给团队的 MCP 服务增加了七八个 MCP 接口，并封装了一个 Skill。  


![截图](https://res2026.tiankonguse.com/images/2026/04/08/002.png)


做完之后回头看，其实我做的事情就是把一套 Spec 流程编排进了 Agent。  
那么问题来了：既然个人都能做这样的封装，AI 编辑器本身为什么不直接内置这种能力呢？  


## 四、Spec 被 Agent 替代


带着这个疑问，我重新审视了之前常用的几个 AI 编辑器，突然意识到，它们的 Plan 模式其实就是 Spec 编程。  


当然，不同的 AI 编辑器，Plan 模式的差异也很大。  
我这边主要使用两个 AI 编辑器。  


第一个 AI 编辑器的 Plan 模式比较简单，就是先规划，再按待办清单逐步实现。  
这相当于一个轻量版的 Spec：只有粗粒度的任务拆分，没有明确的方案设计和验证环节。  


第二个 AI 编辑器的 Plan 模式则分为三个步骤。  
第一步是分析需求，第二步是设计方案与拆分任务，第三步是执行。  
这和我在第一节中介绍的 Spec Code 标准流程几乎一模一样。  


也就是说，Spec 的核心能力——需求分析、方案设计、任务拆分、逐步执行——正在被 AI 编辑器以 Plan/Agent 模式原生集成。  
用户不再需要安装额外的 Spec 工具，也不再需要手动编排流程，AI 编辑器自身就能完成整套 Spec 工作流。  


这就是我认为 Spec 必然会被 Agent 替代的原因：当 AI Agent 把 Spec 的理念内化为自身能力后，独立的 Spec 工具就不再是必需品了。  


## 五、最后


回顾这段实践，我看到了一条清晰的演进路径。  


第一阶段是 Spec 工具时代：需要安装独立工具，手动执行每个步骤，人来充当流程的调度者。  
第二阶段是 Agent 时代：Spec 的流程被封装进 Agent，自动编排和执行，人只需要描述需求。  
第三阶段是大模型原生能力时代：Agent 的这些编排能力最终会被大模型本身学会，届时不再需要外挂的 Spec 上下文和流程定义，模型自己就知道该先分析、再设计、再实现、再验证。  


每一阶段都在做同一件事——把上一阶段需要人工参与的环节自动化。  
我们要做的，就是尽早拥抱新工具，把时间花在想清楚"要做什么"上，而不是纠结"怎么一步步去做"。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号：tiankonguse  
公众号ID：tiankonguse-code  
