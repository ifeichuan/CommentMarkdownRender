# CommentMarkdown Render

一个 VS Code 扩展，当鼠标悬停在注释上时，自动过滤注释符号，将纯文本以 Markdown 格式渲染在悬浮窗口中。

## 功能特性

1. ✅ **只适配多行注释**（不包括多行 `//`）
2. ✅ **多语言支持**：根据不同的编程语言自动匹配注释格式
3. ✅ **Markdown 渲染**：支持完整的 Markdown 语法
4. ✅ **全面测试**：每个功能都有对应的测试用例

## 支持的语言

- TypeScript/JavaScript (JSX/TSX)
- Java
- C/C++/C#
- Go, Rust, PHP, Swift, Kotlin, Scala
- Python
- HTML/XML
- CSS/SCSS/Less
- SQL

## 使用方法

1. 安装扩展
2. 在支持的语言文件中，将鼠标悬停在多行注释上
3. 查看 Markdown 渲染的内容

## 示例

### 输入（注释）

```typescript
/*
 * # 功能说明
 *
 * 这个函数用于：
 *
 * - 处理用户输入
 * - 验证数据
 * - 返回结果
 *
 * **注意**: 参数不能为空
 */
function processData(input: string) {
  // ...
}
```

### 输出（悬停显示）

渲染后的 Markdown，带有：

- 格式化的标题
- 清晰的列表
- **粗体**强调

## 开发

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)

## 测试

```bash
pnpm test
```

## 已实现的需求

- [x] 只适配多行注释(不包括多行 //)
- [x] 根据不同的编程语言匹配不同的格式
- [x] 实现 Markdown 的基本渲染
- [x] 每一步都写好测试

## 许可

MIT
