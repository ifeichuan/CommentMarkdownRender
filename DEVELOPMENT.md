# CommentMarkdown Render - 开发指南

## 项目结构

```
src/
├── extension.ts              # 扩展入口，注册 Hover Provider
├── commentParser.ts          # 注释解析器，处理不同语言的注释格式
├── hoverProvider.ts          # Hover Provider 实现
├── demo.ts                   # 功能演示文件
└── test/
    ├── extension.test.ts     # 基础扩展测试
    └── suite/
        ├── commentParser.test.ts    # 注释解析器单元测试
        └── hoverProvider.test.ts    # Hover Provider 集成测试
```

## 核心功能

### 1. 注释解析器 (`commentParser.ts`)

负责识别和解析多行注释：

- **支持的语言**: TypeScript, JavaScript, Java, C/C++, C#, Go, Rust, PHP, Python, HTML, CSS 等
- **注释格式**:
  - C 风格: `/* */`
  - Python: `"""` 或 `'''`
  - HTML: `<!-- -->`
- **功能**:
  - 提取注释中的纯文本
  - 过滤注释符号（如 `*`）
  - 排除多行 `//` 注释

### 2. Hover Provider (`hoverProvider.ts`)

提供鼠标悬停时的 Markdown 渲染：

- 检测当前位置是否在注释块内
- 解析注释内容
- 以 Markdown 格式显示

### 3. 支持的 Markdown 语法

- 标题：`# H1`, `## H2`, `### H3`
- 粗体：`**bold**`
- 斜体：`*italic*`
- 列表：`-` 或 `*`
- 代码：`` `code` `` 或 `code block`
- 引用：`>`
- 链接：`[text](url)`
- 数学公式：`$inline$` 或 `$$block$$`

## 开发和测试

### 编译项目

```bash
pnpm run compile
```

### 监视模式（开发时使用）

```bash
pnpm run watch
```

这会同时启动 TypeScript 类型检查和 esbuild 打包的监视模式。

### 运行测试

```bash
pnpm test
```

测试包括：

- 单元测试：注释解析器的各种格式测试
- 集成测试：Hover Provider 的端到端测试

### 调试扩展

1. 按 `F5` 启动扩展开发主机
2. 在新窗口中打开 `src/demo.ts` 文件
3. 将鼠标悬停在注释上，查看 Markdown 渲染效果

## 测试场景

### ✅ 应该工作的场景

1. **TypeScript/JavaScript 多行注释**

```typescript
/*
 * # Title
 * Content with **bold**
 */
```

2. **Python 文档字符串**

```python
"""
# Title
Content
"""
```

3. **HTML 注释**

```html
<!-- 
# Title
Content
-->
```

### ❌ 不应该工作的场景

1. **单行注释**

```typescript
// This won't be rendered
```

2. **多行双斜杠注释**

```typescript
// Line 1
// Line 2
// Won't be rendered
```

## 使用示例

打开 `src/demo.ts` 文件，将鼠标悬停在各种注释上：

- **基本 Markdown**: 查看标题、列表、粗体等格式
- **代码示例**: 内联代码和代码块
- **数学公式**: KaTeX 支持（如果 VS Code 支持）
- **链接**: 可点击的链接

## 扩展支持的语言

当前支持的语言列表在 `commentParser.ts` 的 `LANGUAGE_COMMENT_PATTERNS` 中定义。

要添加新语言：

1. 在 `LANGUAGE_COMMENT_PATTERNS` 中添加语言 ID 和注释模式
2. 添加相应的测试用例
3. 在 `TEST_EXAMPLES.md` 中添加示例

## 已知限制

1. 只支持多行注释（不包括多行 `//`）
2. 表格在某些情况下可能有显示问题（取决于 VS Code 版本）
3. 图片需要有效的 URL 才能显示
4. 数学公式需要 VS Code 的 Markdown 渲染器支持 KaTeX

## 下一步改进

- [ ] 添加配置项，允许用户自定义支持的语言
- [ ] 支持更多的注释装饰符过滤
- [ ] 改进注释块边界检测
- [ ] 添加性能优化
- [ ] 支持注释模板和代码片段
