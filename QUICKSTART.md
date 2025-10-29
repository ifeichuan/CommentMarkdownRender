# 快速开始

## 1. 安装依赖

```bash
pnpm install
```

## 2. 编译项目

```bash
pnpm run compile
```

## 3. 启动开发模式

按 `F5` 或在 VS Code 中选择 "Run > Start Debugging"

这会：

1. 编译扩展代码
2. 打开一个新的 VS Code 窗口（扩展开发主机）
3. 在新窗口中自动加载你的扩展

## 4. 测试扩展

在扩展开发主机窗口中：

### 方法 1：使用示例文件

1. 打开 `src/demo.ts` 文件
2. 将鼠标悬停在任何多行注释上
3. 观察 Markdown 渲染效果

### 方法 2：创建测试文件

创建一个新的 TypeScript 文件，添加注释：

```typescript
/*
 * # 测试标题
 *
 * 这是一个**测试**注释
 *
 * - 列表项 1
 * - 列表项 2
 */
function test() {
  console.log("hello");
}
```

将鼠标悬停在注释上，查看效果。

## 5. 运行测试

```bash
pnpm test
```

或在 VS Code 中：

1. 打开测试文件（如 `src/test/suite/commentParser.test.ts`）
2. 点击测试旁边的运行按钮
3. 查看测试结果

## 6. 常见问题

### Q: 悬停时没有显示 Markdown？

**检查以下几点：**

1. 确保你的注释是多行格式（`/* */`，不是 `//`）
2. 确保文件语言是支持的类型（TypeScript、JavaScript 等）
3. 检查控制台是否有错误（Help > Toggle Developer Tools）

### Q: Markdown 没有正确渲染？

确保：

1. 注释符号（如 `*`）前有空格
2. Markdown 语法正确
3. VS Code 的 Markdown 预览功能正常

### Q: 如何添加新语言支持？

编辑 `src/commentParser.ts`，在 `LANGUAGE_COMMENT_PATTERNS` 中添加：

```typescript
'mylang': [{ start: '/*', end: '*/' }]
```

## 7. 开发工作流

### 监视模式

开发时保持监视模式运行：

```bash
pnpm run watch
```

这会自动重新编译你的更改。

### 重新加载扩展

在扩展开发主机窗口中：

1. 按 `Ctrl+R` (Windows/Linux) 或 `Cmd+R` (Mac)
2. 或使用命令面板：`Developer: Reload Window`

### 查看日志

在扩展开发主机窗口中：

1. Help > Toggle Developer Tools
2. 切换到 Console 标签
3. 查看你的 `console.log` 输出

## 8. 调试

### 设置断点

1. 在 `src/extension.ts` 或其他文件中点击行号左侧设置断点
2. 按 `F5` 启动调试
3. 在扩展开发主机中触发功能
4. 断点会在原窗口暂停

### 调试测试

1. 打开测试文件
2. 设置断点
3. 在测试资源管理器中右键 > Debug Test
4. 或使用 `pnpm run test` 并在输出中查看

## 9. 打包扩展

准备发布时：

```bash
pnpm run package
```

这会创建优化后的生产版本。

## 10. 下一步

- 阅读 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解架构
- 查看 [TEST_EXAMPLES.md](./TEST_EXAMPLES.md) 了解更多示例
- 修改代码并添加新功能
- 编写测试确保质量

祝编码愉快！ 🚀
