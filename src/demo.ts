/*
 * # 欢迎使用 CommentMarkdown
 * 
 * 这个扩展可以在鼠标悬停时，将注释渲染为 **Markdown** 格式。
 * 
 * ## 功能特性
 * 
 * - 支持多种编程语言
 * - 自动识别多行注释
 * - 过滤注释符号
 * - 支持完整的 Markdown 语法
 * 
 * ## 使用方法
 * 
 * 1. 将鼠标悬停在注释上
 * 2. 查看渲染后的 Markdown 内容
 * 3. 享受更好的注释阅读体验
 * 
 * > **提示**: 将鼠标悬停在这个注释块上试试！
 */
function exampleFunction() {
    console.log('Hello from CommentMarkdown!');
}

/*
 * ## 代码示例
 * 
 * 你可以在注释中包含代码：
 * 
 * ```typescript
 * const greeting = 'Hello World';
 * console.log(greeting);
 * ```
 * 
 * 或者内联代码：`const x = 10;`
 */
const anotherExample = true;

/*
 * ### 数学公式支持
 * 
 * VS Code 的 Markdown 支持 KaTeX：
 * 
 * 内联公式：$E = mc^2$
 * 
 * 块级公式：
 * $$
 * \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
 * $$
 */
function mathExample() {
    return 42;
}

// 这是单行注释，不会被渲染
const _singleLine = 1;

// 这是多行的
// 单行注释
// 也不会被渲染
const _multipleSingleLines = 2;

/*
 * # 支持的语言
 * 
 * 以下语言的多行注释都支持：
 * 
 * - JavaScript/TypeScript
 * - Python
 * - HTML
 * - CSS
 * - Java, C, C++, C#
 * - Go, Rust, PHP
 * 
 * 不支持多行的双斜杠注释
 */
const tableExample = 3;

/*
 * ## 链接和图片
 * 
 * 支持 [链接](https://code.visualstudio.com/)
 * 
 * 也可以添加图片（如果支持的话）：
 * ![VS Code](https://code.visualstudio.com/assets/images/code-stable.png)
 */
function linkExample() {
    return 'links work!';
}

export { exampleFunction, anotherExample, mathExample, tableExample, linkExample };
