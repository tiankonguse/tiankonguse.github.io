# 提交 Git

分析当前项目变更，编写合理的 commit 信息并提交。

## 执行步骤

1. 运行 `git status` 查看所有变更文件
2. 运行 `git diff` 查看具体改动内容
3. 基于变更内容分析改动类型，按以下规范编写 commit 信息：

### Commit 信息规范

格式：`<type>: <简短描述>`

常用 type：
- `post` - 新增或修改博客文章
- `fix` - 修复问题
- `config` - 配置文件变更
- `style` - 样式调整
- `refactor` - 代码重构
- `data` - 数据文件变更（_data/）
- `chore` - 其他杂项

示例：
- `post: add leetcode contest 493 solution`
- `post: update 2026-03-15 article typo fix`
- `fix: correct image path in post`
- `config: update _config.yml pagination`

4. 只 `git add` 相关文件（不使用 `git add -A`），避免误提交敏感文件
5. 执行 `git commit`
6. 运行 `git status` 确认提交成功

## 使用方式

```
/commit
```

$ARGUMENTS
