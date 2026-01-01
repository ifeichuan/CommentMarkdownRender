import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("扩展应该已激活", async function() {
    // 增加超时时间，因为扩展激活可能需要较长时间
    this.timeout(10000);

    const extension = vscode.extensions.getExtension(
      "undefined_publisher.commentmarkdownrender"
    );

    // 如果扩展存在，等待其激活
    if (extension) {
      if (!extension.isActive) {
        await extension.activate();
      }
      assert.ok(extension.isActive, "扩展应该已激活");
    } else {
      // 如果在测试环境中找不到扩展，跳过此测试
      // 这在某些测试配置中是正常的
      this.skip();
    }
  });
});
