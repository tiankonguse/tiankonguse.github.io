---
layout: post  
title: 通过 AI 3分钟生成 leetcode 参赛表格           
description: AI 用来开发脚本太方便了。  
keywords: 项目实践 
tags: [项目实践]  
categories: [AIGC]  
updateDate: 2025-05-02 12:13:00
published: true  
---

## 一、背景


每次比赛的代码我都上传到 github 上，地址是 https://github.com/tiankonguse/leetcode-solutions  


最近我想统计两个数据：参加了哪些周赛，做了哪些周赛的题。  


针对这个诉求，以前我大概率会使用 bash 脚本的 sed 和 awk 来处理数据。  


现在 AI 这么强大了，我打算让 AI 来帮忙写 python 脚本。  


## 二、需求分析  


第一步：获取参赛的周赛数据  


leetcode 周赛的参赛记录可以通过 leetcode 的 `graphql/noj-go/` POST 接口获取。  


本来我想把 cookies 储存在本地，然后每次通过接口试试获取数据。  
但是想了想，比赛一周才一次，一周 cookies 早就过期了，所以这个手动把接口的数据复制出来更方便。  


打开自己的个人主页，如 https://leetcode.cn/u/tiankonguse/  
然后搜索 noj-go 的包，最大的那个就是比赛记录。  


![](https://res2025.tiankonguse.com/images/2025/05/02/001.png)   



第二步：获取完成的周赛数据  


完成的周赛都在目录 contest 下，所以脚本可以直接遍历目录获取数据。  


第三步：生成目标表格  


由于比赛比较多，这里打算只显示比赛的数字ID。  
每行显示 10 列，如果做比赛了，显示比赛ID，另外如果参赛了，显示一个✅标记，否则显示为空。   


## 三、prompts 设计  


背景介绍：  


1）有些周赛是比赛期间做的，有些是比赛之后做的。  
2）比赛期间做的成绩记录在 remote-contest.json 中，比赛期间和比赛后做的题都记录在 ../contest/ 中。  
3）比赛ID是递增数字  
4）../contest/ 里面，第一级目录名是百位数字, 第二级目录名是比赛ID  
5）在 remote-contest.json 中，比赛分为周赛和双周赛，周赛标题是 ”第 xxx 场周赛“，双周赛标题是 ”第 xxx 场双周赛“，这里只需要提取双周赛信息。  
5）json 的 data.userContestRankingHistory 是比赛列表(每次比赛信息是 item)， item.contest.title 为 ”第 xxx 场周赛“， xxx 为比赛ID，item.attended 代表是否参赛。  


需求:  


1）编写一个 python 脚本，在 ../ 目录下生成 contest.md 文件，内容是表格。  
2）表格共 10 列，分别为比赛ID的个位从 0 到 9的连续10场比赛  
3）比赛目录存在，代表做了了这次比赛，内容显示比赛ID，超链接为比赛目录地址，例如 `[83](./contest/0/083/)`。  
4）如果 remote-contest.json 里面参赛某场周赛，内容前面显示一个对号，例如 `✅[83](./contest/0/083/)` 。  
5）如果某次比赛没有参加，内容为空。  
6）如果如果一行的10场比赛都没参加，则该行不显示。  



## 四、AI 生成脚本  


由于我是 4 月初开通的 Github Copilot，五月初会员到期了。  
PS：不开通会员，可以长期免试试用，一旦开通会员，过期后就无法试用了。  


所以这次我使用的 Trae AI 来生成代码的。  


![](https://res2025.tiankonguse.com/images/2025/05/02/002.png)   

![](https://res2025.tiankonguse.com/images/2025/05/02/003.png)   


第一次生成的代码可以运行，不过表格数据不对，比赛ID 是乱序的。  
于是告诉 AI，AI 继续修改。  


![](https://res2025.tiankonguse.com/images/2025/05/02/004.png)   



AI 这次排序了，但是是按列数排序的，而不是按比赛ID排序的。  



![](https://res2025.tiankonguse.com/images/2025/05/02/005.png)   



AI 修改后，表格数据还是不对，给 AI 指出问题，让 AI 继续修改。  



![](https://res2025.tiankonguse.com/images/2025/05/02/006.png)   



给了 AI 三次机会，都没有修改成功，所以我只好自己去看下代码，然后告诉 AI 哪里错了。  


![](https://res2025.tiankonguse.com/images/2025/05/02/007.png)  




## 五、效果  


几轮修改下来，表格终于符合预期了，效果如下：  


![](https://res2025.tiankonguse.com/images/2025/05/02/008.png)  


10 列显示的高度超过了笔记本屏幕，所以我把列数调整为 20 列了。  


![](https://res2025.tiankonguse.com/images/2025/05/02/0009.png)  



## 六、最后  


可以发现，第 228 场比赛之后的题目我都做了。  
第 217 场比赛之后有 2 场比赛还没去做。  


后面我会找时间从后到前去做所有比赛的。  
希望每两周能做一场比赛吧。  





《完》  


-EOF-  

本文公众号：天空的代码世界  
个人微信号： tiankonguse  
公众号ID： tiankonguse-code  
  