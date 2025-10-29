# CommentMarkdown 测试示例

此文件包含各种注释格式的测试示例。

## TypeScript/JavaScript 示例

````typescript
/*
 * # 这是一个标题
 *
 * 这是一段 **粗体** 和 *斜体* 文本。
 *
 * ## 列表示例
 *
 * - 第一项
 * - 第二项
 * - 第三项
 *
 * ## 代码示例
 *
 * 内联代码：`console.log('hello')`
 *
 * 代码块：
 * ```
 * function hello() {
 *   return 'world';
 * }
 * ```
 */
function exampleFunction() {
  return true;
}

/*
 * 简单的单行块注释
 */
const simpleComment = 1;

/* 另一个简单注释 */
const anotherComment = 2;
````

## Python 示例

```python
"""
# Python 文档字符串

这是一个 **Python** 文档字符串示例。

## 特性

- 支持 Markdown
- 自动渲染
- 多语言支持

### 使用方法

将鼠标悬停在注释上即可看到渲染的 Markdown。
"""
def example_function():
    pass

'''
# 单引号文档字符串

同样支持单引号的三引号注释。
'''
def another_function():
    pass
```

## Java 示例

```java
/*
 * # Java 注释示例
 *
 * 这是一个标准的 **JavaDoc** 风格注释。
 *
 * ## 参数说明
 *
 * - param1: 第一个参数
 * - param2: 第二个参数
 *
 * ## 返回值
 *
 * 返回计算结果
 */
public int exampleMethod(int param1, int param2) {
    return param1 + param2;
}
```

## HTML 示例

```html
<!-- 
# HTML 注释

这是一个 **HTML** 注释示例。

- 支持所有 Markdown 语法
- 自动渲染
-->
<div class="example">
  <p>Example content</p>
</div>
```

## CSS 示例

```css
/*
 * # CSS 样式注释
 * 
 * 这个类用于：
 * 
 * - 设置背景色
 * - 设置文字颜色
 * - 添加边距
 * 
 * **注意**: 这是一个示例样式
 */
.example-class {
  background-color: #f0f0f0;
  color: #333;
  padding: 10px;
}
```

## 测试要点

将鼠标悬停在以上各种注释上，应该能看到：

1. ✅ 多行 `/* */` 注释被正确渲染为 Markdown
2. ✅ Python 的 `"""` 和 `'''` 注释被正确渲染
3. ✅ HTML 的 `<!-- -->` 注释被正确渲染
4. ✅ 标题、列表、粗体、斜体等 Markdown 语法正确显示
5. ✅ 注释符号（`*`、`//` 等）被正确过滤
6. ❌ 多行 `//` 注释不会被渲染（这是期望的行为）
