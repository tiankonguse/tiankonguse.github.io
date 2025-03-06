---
layout: post  
title: github 把openai 的 key 拦截了，无法推送代码
description: github 的这个功能挺好的，提高了业界整体安全水平。  
keywords: 大模型, Deepseek, RAG, github, openai key 
tags: [大模型, Deepseek, RAG, github, openai key ]  
categories: [大模型]  
updateData: 2025-03-06 12:13:00
published: true  
---

## 背景  


最近创建了一个新的 github 项目，openai 的 key 是通过环境变量传递的，期间把 key 临时写到文档里忘记删除了。  
当我把代码推送到 github 时，github 把我的 key 拦截了，导致代码无法推送。  


![](https://res2025.tiankonguse.com/images/2025/03/06/001.png) 


这里研究下，如何把 key 从已有的 commit 中删除，然后把代码推送到 github。  


## 一、问题分析  


第一步：确认哪些 commit 的哪些文件存在 openai 的 key。  


参考上面的截图，可以发现 `5b7f95a9f57dbc5a57a84baf9d19c93e9b25ee14` commit 的 `langchain/langchain-README.md` 文件的 19 行存在 openai 的 key。  


```
remote:       —— OpenAI API Key ————————————————————————————————————
remote:        locations:
remote:          - commit: 5b7f95a9f57dbc5a57a84baf9d19c93e9b25ee14
remote:            path: langchain/langchain-README.md:19
```


第二步：确定这个 commit 是第几个 commit。  


命令：``git log --oneline`  


结果可能分为两种情况：只有最新的 Comment 存在 key，或者存在非最新 commit 存在 key。  



针对两种情况，可以使用不同的方法来解决。  


## 二、最新 commit 存在 Key 解决方案  


`git log --oneline` 的结果如下，这个一般是最常见的方式，只有一个提交，带了 key。  


```
5b7f95a (HEAD -> main) test key
1cb432f (origin/main, origin/HEAD) add v1
280f518 add
306fc66 add
4e3455a add
6d614fd add
bb83713 add
```

解决方案：直接删除对应文件的 Key。  


之后运行 `git commit --amend --all`，含义是修改最近的一次提交。


此时再执行 `git log --oneline`，可以发现最后一个 commit 的 sha 值被修改了。  


![](https://res2025.tiankonguse.com/images/2025/03/06/005.png) 


最后重新 push 即可。


## 三、非最新 commit 存在 Key 解决方案  


`git log --oneline` 的结果如下，对应的 comment 在倒数第二个。  


![](https://res2025.tiankonguse.com/images/2025/03/06/004.png) 


确定最早存在 key 的 commit id 是 `5e22ad85250cd3f2117619156cf91e0d93dbde2d`， 缩写为前几个字母即 `5e22ad8`。  
执行命令: `git rebase -i 5e22ad85250cd3f2117619156cf91e0d93dbde2d~1` 或 `git rebase -i 5e22ad8~1`。  

可以看到一个编辑区，2025年了，大家的配置应该都是使用 vim 打开的。  


前几行内容如下，我们需要修改的事 `5e22ad8` 这一行，需要把 `pick` 改成 `edit`，然后保存退出。

```
pick 5e22ad8 add key
pick b040e3c del key

# Rebase e0a43d7..b040e3c onto e0a43d7 (2 commands)
```


一定要确定是哪一行，不要修改错了。  
修改后如下.  


```
edit 5e22ad8 add key
pick b040e3c del key

# Rebase e0a43d7..b040e3c onto e0a43d7 (2 commands)
```

然后重新添加文件 `git add .`  
执行修改提交 `git commit --amend`  
执行 `git rebase --continue`  


如果之后的 commit 有修改 key 所在的文件，会报合并冲突。  


![](https://res2025.tiankonguse.com/images/2025/03/06/002.png) 


手动处理冲突,处理完后继续执行 `git rebase --continue`  


此时查看 commit 记录 `git log --oneline`， `5e22ad8` 以及之后的 commit 全部变化了。  


![](https://res2025.tiankonguse.com/images/2025/03/06/003.png) 


最后再次执行推送 `git push `，就可以成功推送到远程仓库了。  


## 四、最后  


github 的这个功能挺好的。  
之前曾听说无数的案例，开发因为没注意安全问题，把 key 上传到 github，导致别人恶意使用。  
现在 github 官方直接从底层做了这个功能，以后再也不用担心 key 不小心 push 到 github。  
这个功能算是提高了业界的整体安全水平。  


《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  