import * as assert from "assert";
import * as vscode from "vscode";

suite("HoverProvider Integration Test Suite", () => {
  // 等待扩展激活
  suiteSetup(async () => {
    const extension = vscode.extensions.getExtension(
      "undefined_publisher.commentmarkdownrender"
    );
    if (extension && !extension.isActive) {
      await extension.activate();
    }
    // 额外等待一下确保 hover provider 注册完成
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  test("应该为 TypeScript 多行注释提供 hover", async () => {
    // 创建一个临时文档
    const content = `
/*
 * # Test Title
 * 
 * This is a **test** comment.
 * 
 * - Item 1
 * - Item 2
 */
function test() {
    console.log('test');
}
`;
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: "typescript",
    });

    await vscode.window.showTextDocument(doc);

    // 等待文档完全加载
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 在注释内部请求 hover
    const position = new vscode.Position(2, 5);
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      doc.uri,
      position
    );

    assert.ok(hovers, "Should return hovers");
    assert.ok(hovers.length > 0, "Should have at least one hover");

    const hover = hovers[0];
    const content0 = hover.contents[0];

    if (content0 instanceof vscode.MarkdownString) {
      const markdownContent = content0.value;
      assert.ok(
        markdownContent.includes("# Test Title"),
        "Should contain title"
      );
      assert.ok(
        markdownContent.includes("**test**"),
        "Should contain bold text"
      );
      assert.ok(
        markdownContent.includes("- Item 1"),
        "Should contain list items"
      );
    } else {
      assert.fail("Content should be MarkdownString");
    }
  });

  test("应该忽略单行 // 注释", async () => {
    const content = `
// This is a single line comment
function test() {}
`;
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: "typescript",
    });

    await vscode.window.showTextDocument(doc);

    const position = new vscode.Position(1, 5);
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      doc.uri,
      position
    );

    // 检查是否有我们的 hover（可能有其他扩展的 hover）
    const ourHovers = hovers?.filter((h) => {
      const content = h.contents[0];
      if (content instanceof vscode.MarkdownString) {
        // 如果是我们的 hover，它不应该包含 // 符号
        return !content.value.includes("//");
      }
      return false;
    });

    // 我们的扩展不应该为单行注释提供 hover
    assert.strictEqual(
      ourHovers?.length || 0,
      0,
      "Should not provide hover for single line comments"
    );
  });

  test("应该忽略多行 // 注释", async () => {
    const content = `
// Line 1
// Line 2
// Line 3
function test() {}
`;
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: "typescript",
    });

    await vscode.window.showTextDocument(doc);

    const position = new vscode.Position(1, 5);
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      doc.uri,
      position
    );

    // 我们的扩展不应该为多行 // 注释提供 hover
    const ourHovers = hovers?.filter((h) => {
      const content = h.contents[0];
      if (content instanceof vscode.MarkdownString) {
        return !content.value.includes("//");
      }
      return false;
    });

    assert.strictEqual(
      ourHovers?.length || 0,
      0,
      "Should not provide hover for multiple // comments"
    );
  });

  test("应该为 Python 三引号注释提供 hover", async () => {
    const content = `
"""
# Python Docstring

This is a **docstring** with markdown.
"""
def test():
    pass
`;
    const doc = await vscode.workspace.openTextDocument({
      content,
      language: "python",
    });

    await vscode.window.showTextDocument(doc);

    // 等待文档完全加载
    await new Promise((resolve) => setTimeout(resolve, 200));

    const position = new vscode.Position(2, 5);
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      doc.uri,
      position
    );

    assert.ok(hovers, "Should return hovers");
    assert.ok(hovers.length > 0, "Should have at least one hover");

    const hover = hovers[0];
    const content0 = hover.contents[0];

    if (content0 instanceof vscode.MarkdownString) {
      const markdownContent = content0.value;
      assert.ok(
        markdownContent.includes("# Python Docstring"),
        "Should contain title"
      );
      assert.ok(
        markdownContent.includes("**docstring**"),
        "Should contain bold text"
      );
    } else {
      assert.fail("Content should be MarkdownString");
    }
  });
});
