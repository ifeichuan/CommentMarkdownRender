# Comment Markdown Render

一个 Visual Studio Code 扩展，可以直接在代码注释中渲染 Markdown 内容，包括对 LaTeX 数学表达式的支持。它处理各种编程语言中最常见的注释风格，包括多行块注释和堆叠的单行注释。

最初的动机是能够像 Jupyter 笔记本一样在大多数语言中编码，特别是在形式化语言（例如 Lean4）中，渲染数学公式特别有用。

## 示例

如下所示，当悬停在以 `md` 前缀开头的注释块上时，扩展会渲染 Markdown 内容。

![扩展功能演示](image.png)

## 如何使用

要触发 Markdown 渲染，只需在你的注释中以 `md` 前缀开头。

### 多行块注释

该扩展支持大多数语言中的标准块注释：

```javascript
/** md
 * # 文档说明
 * 这是一个带有数学公式的 **JSDoc** 注释：
 * $$ \frac{-b \pm \sqrt{b^2-4ac}}{2a} $$
 */
```

```python
""" md
# Python 文档字符串
你也可以在这里使用 *Markdown*！
- 项目 1
- 项目 2
"""
```

### 单行注释

你也可以堆叠单行注释：

```javascript
// md # 标题
// md 这是一个列表：
// md 1. 第一点
// md 2. 第二点，包含 $\alpha$
```

## 支持的注释风格

| 语法 | 编程语言 |
|------|---------|
| `/* md ... */` 或 `/** md ... */` | JS、TS、C++、Java、CSS 等 |
| `""" md ... """` | Python、Julia |
| `''' md ... '''` | Python |
| `/* md ... */` | Go、Rust、PHP、Swift、Kotlin、Scala |
| `// md` | C 风格语言 |
| `# md` | Python、Ruby、YAML、Bash |
| `-- md` | Lua、Haskell、SQL |
| `/- md ... -/` | Lean4 |
| `<!-- md ... -->` | HTML/XML |

## 功能特性

✅ **多行和单行注释支持** - 支持块注释和堆叠的单行注释

✅ **多语言支持** - 自动检测并处理不同编程语言的注释格式

✅ **完整的 Markdown 渲染** - 支持完整的 Markdown 语法，包括列表、表格、代码块等

✅ **LaTeX 数学表达式** - 使用内联 ($...$) 和显示 ($$...$$) 符号渲染数学公式

✅ **全面的测试覆盖** - 在所有支持的语言和注释风格中进行了全面测试

## 开发

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## 测试

```bash
pnpm test
```

## 许可证

MIT
