---
name: leetcode-contest-report
description: 生成 LeetCode 周赛（Weekly Contest）解题报告博客文章。当用户要求输出/撰写/补全 leetcode 周赛解题报告、题解文章，并提供了上一场解题报告作格式参考、以及本场比赛的代码目录（如 leetcode-solutions/contest/5/522，内含 A.md~D.md 题目描述与 A.cpp~D.cpp 题解代码）时使用。技能负责：按历史报告格式撰写新报告、用示例验证代码正确性、交付到博客 _posts 目录。
---

# LeetCode 周赛解题报告

## Overview

把「上一篇周赛解题报告（格式参考）+ 本场比赛代码目录（题目与题解）」转化为一篇可直接发布的周赛解题报告 Markdown 文章，写入博客 `_posts/` 目录。报告用中文，风格与历史文章一致。

## 输入约定

用户通常会提供（缺省时按规则定位）：
- 上一篇报告路径：如 `tiankonguse.github.io/_posts/2026/09/2026-09-27-leetcode-contest-521.md`。
- 比赛代码目录：如 `leetcode-solutions/contest/5/522`，内含 `A.md`~`D.md`（题目描述、官方链接、示例）与 `A.cpp`~`D.cpp`（题解），可能有 `X-AC-100.cpp`、`X-WA-439.cpp` 等多版本。
- 输出路径：如 `tiankonguse.github.io/_posts/2026/10/2026-10-04-leetcode-contest-522.md`。缺省按 `_posts/YYYY/MM/YYYY-MM-DD-leetcode-contest-NNN.md` 生成（日期为比赛日）。

若上一篇报告未提供，在博客 `_posts/` 下按文件名 `*-leetcode-contest-*.md` 找最近一篇；若输出路径未提供，参照上一篇所在 `_posts/YYYY/MM/` 目录。

## 执行流程

### Step 1: 提炼格式模板

通读上一篇报告，提取：
- front matter 字段（layout/title/description/keywords/tags/categories/updateDate/published）。
- 章节骨架：`零、背景` → `一、二、三、四`（每题一节）→ `五、最后` → `《完》` → `-EOF-` → 公众号三行结尾。
- 每题节内结构：`题意`（重述题目）→ `思路：XXX`（一句话 + 推导 + 复杂度）→ ```cpp 代码。
- 排版细节：行尾两个空格硬换行、段落间空行、代码块用 ` ```cpp `。

### Step 2: 读取比赛代码目录

- `ls` 目录确认文件；逐题读 `X.md`（官方中文题名、题意、示例输入/输出）与 `X.cpp`（算法思路）。
- 目录常有多版本：`X-WA-*.cpp` 是失败尝试，`X-AC-100*.cpp` 是 AC 版本，`X.cpp` 可能是后期重写（**可能有潜在 bug，不可默认可信**，见坑 3）。
- 为每题归纳「思路」一句话，与历史文章措辞风格一致（如：模拟 / 枚举 / 递归DP / 矩阵快速幂）。

### Step 3: 撰写报告

- 按 `references/report-format.md` 的模板与写作规范撰写；先读该文件。
- 只写文字与代码，**不插图**（历史文章的图由作者手工上传到外部 CDN，见坑 4）。
- 若目标文件已存在（含草稿），先完整读取，保留已有内容，只补缺失部分并修正明确错误。

### Step 4: 验证（必须执行）

- 用 .md 中的**全部示例**编译运行验证每题输出一致（编译细节见坑 1、2）。
- 额外做多调用鲁棒性检查：同一实例连续调用不同大小输入，防止 memo 残留类 bug。
- 发现 bug 时：修正报告内的代码（如 Init 用 `assign` 清空 memo），**不改用户的源文件**，并在交付说明中如实告知。

### Step 5: 交付

- 用 `present_files` 交付报告文件。
- 回复中简要列出每题思路、验证结果、发现的问题；可附一张核心推导示意（仅聊天回复，不入文章）。

## 已知坑

1. **编译环境是 macOS**：无 `bits/stdc++.h`，需 `#include <vector> <string> <cstdlib> <iostream> <algorithm>`；每个 `X.cpp` 自带 `class Solution`，一次只能 include 一个（重复定义会编译失败）；题解文件在 `#ifdef USACO_LOCAL_JUDGE` 分支外没有头文件，测试主函数需先包含标准头再 include 题解。
2. **左值引用参数**：`maxAlternatingSum(vector<int>& nums)` 不能直接传 `{1,2,3}` 初始化列表，先建命名 vector 再传。
3. **多版本代码**：`X.cpp` 可能是未验证重写。实例：522 场 C 题 `C.cpp` 用 `resize` 初始化 memo，多次调用残留旧值导致后续用例错误；AC 版本 `C-AC-100*.cpp` 无此问题。报告代码以验证结果为准，修正后自洽。
4. **不插图**：历史文章图片在 `res2026.tiankonguse.com`，由作者手工上传；生成的报告只含文字与代码。
5. **推导/证明写作**：特征类结论写双向证明——正方向用递归拆分/归纳，反方向用归纳；措辞精确（如「每个块的长度为奇数」≠「整个字符串长度为奇数」），可用反例澄清（"ab" 是好字符串但长度为 2）。
6. **尊重用户手工调整**：目标文件可能已被用户改过（标题、措辞、删代码块等），先读当前内容，只改被点名范围，不擅自恢复被删内容。

## Resources

- `references/report-format.md`：报告完整模板（front matter、章节骨架、每题节结构、结尾）与写作规范。撰写前必读。
