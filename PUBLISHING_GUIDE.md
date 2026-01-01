# VS Code 扩展发布指南

## 📋 发布前检查清单

### 1. 代码质量检查 ✅

- [x] 所有测试通过（45/45）
- [x] TypeScript 类型检查通过
- [x] ESLint 代码检查通过
- [x] 所有 BUG 已修复
- [x] 代码已提交到 Git

### 2. 版本更新 ✅

- [x] package.json 版本号已更新到 0.0.3
- [x] CHANGELOG.md 已更新
- [x] 遵循语义化版本规范（Semantic Versioning）

### 3. 文档检查

- [ ] README.md 是最新的
- [ ] CHANGELOG.md 已更新
- [ ] package.json 中的描述准确
- [ ] 图标文件正确

### 4. 依赖检查

```bash
# 检查是否有安全漏洞
pnpm audit

# 检查依赖是否过时
pnpm outdated
```

---

## 🚀 发布步骤

### 步骤 1：准备发布

```bash
# 1. 确保所有改动已提交
git status
git add .
git commit -m " chore: bump version to 0.0.3 for release"

# 2. 创建发布标签（可选但推荐）
git tag -a v0.0.3 -m "Release v0.0.3 - 修复核心 BUG 并完善测试体系"

# 3. 推送到远程仓库
git push origin main
git push origin v0.0.3
```

### 步骤 2：安装发布工具

```bash
# vsce 已经安装在系统中
# 如果需要安装或更新：
npm install -g @vscode/vsce
```

### 步骤 3：创建 Personal Access Token (PAT)

#### 首次发布需要：

1. **访问 Azure DevOps**
   - 访问：https://dev.azure.com/
   - 使用你的账户登录

2. **创建 Personal Access Token**
   - 点击右上角头像 → User settings → Personal access tokens
   - 点击 "New Token"
   - 填写信息：
     - Organization: `vscode` (或选择 all accessible organizations)
     - Scopes: **Marketplace** → **Manage**
   - 点击 Create
   - **重要：复制并保存这个 token**（只显示一次）

3. **验证 PAT**
   ```bash
   # 使用 PAT 登录（会提示输入 token）
   vsce login your-publisher-name
   ```

### 步骤 4：打包扩展

```bash
# 1. 清理并编译
pnpm install
pnpm run compile

# 2. 运行测试确保一切正常
pnpm test

# 3. 打包扩展（会生成 .vsix 文件）
vsce package
```

这将创建一个名为 `commentmarkdownrender-0.0.3.vsix` 的文件。

### 步骤 5：测试打包的扩展（可选）

```bash
# 在本地测试 .vsix 文件
code --install-extension commentmarkdownrender-0.0.3.vsix
```

### 步骤 6：发布到市场

```bash
# 发布扩展（会提示输入 PAT）
vsce publish

# 或者指定版本发布
vsce publish 0.0.3

# 或者发布预发布版本
vsce publish prerelease
```

---

## 📝 发布后的验证

### 1. 在 VS Code Marketplace 查看扩展

访问：https://marketplace.visualstudio.com/items?itemName=CommentMarkdownRender.commentmarkdownrender

### 2. 测试安装

```bash
# 在新的 VS Code 实例中安装
code --install-extension CommentMarkdownRender.commentmarkdownrender
```

### 3. 检查扩展信息

- 版本号显示正确
- CHANGELOG 显示在市场页面
- 图标显示正确
- 描述信息准确

---

## 🔄 版本更新流程

### 语义化版本（Semantic Versioning）

```
MAJOR.MINOR.PATCH

例子：1.2.3
- MAJOR (1): 不兼容的 API 变更
- MINOR (2): 向后兼容的功能新增
- PATCH (3): 向后兼容的 BUG 修复
```

### 当前项目版本策略

- `0.0.3` → `0.0.4` : BUG 修复
- `0.0.4` → `0.1.0` : 新增功能
- `0.1.0` → `1.0.0` : 稳定版本发布

---

## 🛠️ 常见问题

### Q: 如何撤销已发布的扩展？

```bash
# vsce 不支持直接撤销
# 需要在 Marketplace 网站上操作：
# 1. 访问扩展的管理页面
# 2. 点击 "Remove from Marketplace"
```

### Q: 发布失败怎么办？

1. **检查 PAT 是否过期**
   ```bash
   vsce logout
   vsce login your-publisher-name
   ```

2. **检查 publisher 名称是否正确**
   ```bash
   # 在 package.json 中查看
   cat package.json | grep publisher
   ```

3. **检查版本号是否已存在**
   - 每个版本号只能发布一次
   - 如果版本已存在，需要升级版本号

### Q: 如何发布预发布版本？

```bash
# 方法 1：在 package.json 中添加预发布标识
"version": "0.0.3-beta.1"

# 方法 2：使用 vsce 的 prerelease 命令
vsce publish prerelease
```

### Q: 如何更新现有扩展？

```bash
# 1. 修改代码
# 2. 更新版本号（package.json）
# 3. 更新 CHANGELOG.md
# 4. 提交代码
# 5. 重新发布
vsce publish
```

---

## 📊 发布检查命令

```bash
# 完整的发布前检查脚本
#!/bin/bash

echo "🔍 发布前检查..."

# 1. 检查测试
echo "▶️ 运行测试..."
pnpm test
if [ $? -ne 0 ]; then
  echo "❌ 测试失败！"
  exit 1
fi

# 2. 检查类型
echo "▶️ 检查类型..."
pnpm run check-types
if [ $? -ne 0 ]; then
  echo "❌ 类型检查失败！"
  exit 1
fi

# 3. 检查代码规范
echo "▶️ 检查代码规范..."
pnpm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint 失败！"
  exit 1
fi

# 4. 检查版本号
echo "▶️ 检查版本号..."
VERSION=$(node -p "require('./package.json').version")
echo "当前版本: $VERSION"

# 5. 检查 CHANGELOG
if ! grep -q "## \[$VERSION\]" CHANGELOG.md; then
  echo "❌ CHANGELOG.md 中没有版本 $VERSION 的条目！"
  exit 1
fi

echo "✅ 所有检查通过！可以发布。"
echo "运行以下命令发布："
echo "  vsce publish"
```

---

## 🎯 快速发布命令

```bash
# 一键发布（确保所有检查都通过）
pnpm test && vsce package && vsce publish
```

---

## 📱 发布后推广

### 1. 更新 README

在 README 中添加版本徽章：

```markdown
![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/CommentMarkdownRender.commentmarkdownrender)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/CommentMarkdownRender.commentmarkdownrender)
```

### 2. 通知用户

- GitHub Release
- 项目文档更新
- 社交媒体分享

### 3. 收集反馈

- 监控 VS Code Marketplace 的评论
- 查看 GitHub Issues
- 关注使用统计

---

## 📞 需要帮助？

- VS Code 扩展发布文档：https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- vsce 工具文档：https://github.com/microsoft/vscode-vsce
- VS Code Marketplace：https://marketplace.visualstudio.com/

---

## ✅ 当前发布状态

- 版本：0.0.3
- 状态：准备发布
- 测试：✅ 全部通过 (45/45)
- 类型检查：✅ 通过
- 代码检查：✅ 通过
- CHANGELOG：✅ 已更新
- 版本号：✅ 已更新

**可以执行发布了！** 🚀
