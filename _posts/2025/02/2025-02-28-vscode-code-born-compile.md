---
layout: post  
title: 代码生成实战：本地DeepSeek与云端大模型Copilot/Cousor/Gemini/通义/豆包
description: 对比本地DeepSeek与五大云端大模型（Gemini/Copilot/Cousor/通义/MarsCode）的代码生成能力，最终得出本地模型效果不佳，云端大模型更为优越的结论，并分享了各模型的优缺点及使用体验。。  
keywords: 大模型, Deepseek, RAG 
tags: [大模型, Deepseek, RAG ]  
categories: [大模型]  
updateDate: 2025-02-28 12:13:00  
published: true  
---


## 零、背景  


此前，我成功搭建了本地大模型 ollama-server 和 DeepSeek，详细记录在文章《[推荐这样使用 Deepseek-R1 本地知识库](https://mp.weixin.qq.com/s/TYmYcyObrecJtVp_cvnibw)》中，其中涵盖了多种搭建方案。  


随后，我在 Vscode 上安装了 DeepSeek 插件，实现了本地大模型的代码分析、解释、重构等功能，效果显著。相关实践记录在《[vscode+DeepSeek，轻松代码解释、找BUG、重构、补单侧](https://mp.weixin.qq.com/s/QVEdqYMyOsxusfnfS078dw)》中。  


有人评论可以使用 Cousor 或者 通义灵码。  
其实这些工具我都知道，但是在公司使用第三方网络大模型进行代码分析或代码生成肯定是不合规的，所以我才决定搭建一个本地代码模型。  


代码分析、代码解释等主动问答式的大模型搞定后，接下来就是研究本地代码生成了。  


周末折腾了好久，体验下来，下载了大量的模型和插件，发现本地大模型的代码生成效果并不理想。  


后来试了下网络版第三方大模型，比如 github 的 Copilot、谷歌的 Gemini Code Assist、大家鼓吹的 Cousor、阿里巴巴的通义灵码，字节跳动的豆包 MarsCode等，相比之下，这些工具的效果明显优于本地模型。  


这里，我对各模型的效果进行简要对比，并决策出以后要使用哪家代码生成大模型。  


## 一、问题设计  


要测试大模型的代码生成能力，问题既不能太简单，也不能太复杂。  


但是也不能过于深奥，比如像 DeepSeek 那样需要深度思考几十分钟，那代码早就自己写完了。
因此，代码生成不仅要保证正确性，实时性同样至关重要。 


基于此，我设计了一个算法问题：求 `C(n,m) % MOD`，其中 `MOD=1e9+7`，`N=1e5`，并提示需要预处理，要求以 `O(1)` 复杂度完成任意查询。 


这个问题不能直接定义二维数组，查询时也不能通过循环暴力计算，必须通过预处理，在查询时直接套用公式得出答案。  


下面分别看下各个大模型的效果吧。  



## 一、本地 DeepSeek  


本地的 `ollama` 插件虽然非常多，但本质上没什么区别，都是作为连接器，将 `vscode` 与本地的 `ollama` 服务连接起来。  


不同的插件会推荐不同的代码模型。为此，我下载了十几个模型，比如 `codegemma`、`codellama`、`deepseek-coder`、`gemma2`、`llama3`、`mistral`、`qwen2.5-coder`、`stable-code`、`starcoder2` 等。  


PS：还好家里的网速给力。之前在公司研究大模型时，网速慢得离谱，下载一个模型要花一下午，而在家里只需要几分钟甚至几十秒。  


![](https://res2025.tiankonguse.com/images/2025/02/28/001.png)  



这些模型中，大多数要么无法自动生成代码，要么生成的代码完全无关。  


经过测试，只有两个模型生成了目标相关的代码，但算法逻辑并不符合要求。 


![](https://res2025.tiankonguse.com/images/2025/02/28/002.png)  


![](https://res2025.tiankonguse.com/images/2025/02/28/003.png)  



因此，本地大模型目前还无法满足我的日常开发需求。


## 二、谷歌的 Gemini Code Assist  


前几天，谷歌的 `Gemini Code Assist` 宣布免费了，那就先从它开始测试吧。  


`Gemini Code Assist` 默认不会自动生成代码，需要手动按下 `ctrl + enter` 才会触发代码生成。  


每次会生成四份代码，并在新窗口中展示。  
我仔细查看了这四份代码，发现它们差别不大，主要是一些边界检查的处理略有不同。  


![](https://res2025.tiankonguse.com/images/2025/02/28/004.png)  



谷歌生成的这份代码完全符合要求，封装了 `power`、`modInverse`、`combinations` 三个函数，预处理部分在主函数中完成。  
代码可以直接运行，随机输入测试数据后，结果也是正确的。打印 10 以内的答案，看起来也没问题。  


![](https://res2025.tiankonguse.com/images/2025/02/28/009.png)  




## 三、github 的 Copilot  


GitHub 的 `Copilot` 插件让我折腾了好久，一直遇到登录超时的问题。  


起初我以为是公司安全策略的原因，于是回到家后开启了全局网络加速，但问题依旧。  
我询问了各家大模型，都没得到答案。后来找到插件的具体日志，通过 Google 搜索，发现大家的解决方案如下。  


日志显示：`Extension activation failed: "Timed out waiting for authentication provider to register"`  


有人建议卸载并重新安装 VSCode，我试了几次，无效。  
有人说是新版 VSCode 的问题，建议安装 2024 年某个时间段之前的版本，尝试后依然无效。  
还有人推荐删除所有 VSCode 缓存文件，我先是重命名了缓存文件，无效后干脆删除了，结果还是不行。  


不少解决方案类似这个帖子，需要找到 `GitHub Authentication`，启动 GitHub 鉴权。  
一开始我没找到这个开关，直到安装旧版本时才找到，打开鉴权后，终于登录成功。  
帖子地址：https://github.com/orgs/community/discussions/11324  



![](https://res2025.tiankonguse.com/images/2025/02/28/010.png)  


`Copilot` 安装好后，按下回车就会自动生成代码。  
接着一路按 `TAB` 键，代码就会持续自动生成。  



最终生成的代码如下，只封装了一个函数，名字叫 `qmi`。  


![](https://res2025.tiankonguse.com/images/2025/02/28/005.png)  


`qmi` 这个名字有点奇怪，我问了大模型，有的解释是 `Quickly Modulo Integer` 的缩写，也有说是 `Quick Modular Exponentiation` 的缩写。  


![](https://res2025.tiankonguse.com/images/2025/02/28/006.png)  


我增加了注释，引导 `Copilot` 将组合数封装成函数。  
`Copilot` 不仅自动封装了函数，还主动删除了冗余代码。  
最后，我打印了 10 以内的所有组合数，代码一次性编译通过，并输出了正确答案。  


![](https://res2025.tiankonguse.com/images/2025/02/28/011.png)  


## 四、Cousor  


`Cousor` 生成的代码让我不太满意。  
它竟然没有进行预处理，虽然使用了快速幂将复杂度降低了一个数量级，但仍然保留了一层循环。  
不过，运行生成的代码时，一次性编译通过，并且输出了正确答案。  


![](https://res2025.tiankonguse.com/images/2025/02/28/007.png)  


## 五、阿里巴巴的通义灵码  


阿里巴巴的 `通义灵码` 也让我不太满意，生成的代码少了很多行，运行后直接陷入了死循环。  


仔细想了想，`通义灵码` 的体验存在一个缺陷：它只会基于当前光标生成代码。  
对于函数，它会提前生成大括号，导致我在不断生成下一行代码时，无法判断函数是否已经结束。  


体验上的问题在于，函数生成完后，需要将光标移到函数外，隔一行再继续生成代码。  
这种做法容易导致函数内部少生成一些关键代码。  


比如下面的代码，快速幂 `qp` 函数在循环 `b` 时，没有修改 `b` 的值，结果导致了死循环。  


![](https://res2025.tiankonguse.com/images/2025/02/28/008.png)  



修复新循环后，运行生成的代码后，输出的答案也是错误的。  


## 六、字节跳动的 MarsCode  


字节跳动的 MarsCode 体验效果也不错，生成的代码也符合要求。  
代码也是一次性编译通过的，并且输出正确答案。  


![](https://res2025.tiankonguse.com/images/2025/02/28/012.png)  



## 七、代码修复  


现在使用 `通义灵码` 生成的代码陷入了死循环，即使修复了死循环，输出的答案依然是错误的。  
接下来，我们对比一下各家大模型，看看谁能修复这两个问题。  


**谷歌的 `Gemini Code Assist`**：找到了死循环，但未解决算法错误。  


**GitHub 的 `Copilot`（GPT-4o）**：找到了死循环，但未解决算法错误。  


**`Cousor`（claude 3.7 sonnet）**：修复了死循环，但未解决算法错误。  


**阿里巴巴的 `通义灵码`（DeepSeek 满血版 R1）**：成功修复了这两个问题。  


![](https://res2025.tiankonguse.com/images/2025/02/28/012.png)  


**字节跳动的 `MarsCode`（DeepSeek 满血版 R1）**：直接使用 `fix` 快捷命令仅修复了死循环，但通过自定义 `prompts` 成功修复了这两个问题。  


**本地大模型**：成功修复了这两个问题。  


**prompts**: 优化和修复下这个代码  


## 八、总结  


在大模型生成代码方面，`Cousor` 和阿里巴巴的 `通义灵码` 生成的代码存在问题，其他模型的表现都还不错。  


而在代码查错上，还是需要 `DeepSeek` 的深度思考能力。无论是本地的 `DeepSeek 8B`，还是 `通义灵码`、`MarsCode`，都能成功解决问题。  


因此，以后写代码时，我会放弃使用 `Cousor`，其他模型则会根据情况对比使用。  
至于修复代码，我会不断优化迭代自己的 `prompts`，结合 `DeepSeek` 的深度思考能力，无论是本地大模型，还是 `通义灵码` 和 `MarsCode`，都是不错的选择。  



《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  