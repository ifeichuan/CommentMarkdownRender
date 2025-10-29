// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CommentMarkdownHoverProvider } from "./hoverProvider";
import { LANGUAGE_COMMENT_PATTERNS } from "./commentParser";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("CommentMarkdownRender extension is now active!");

  // 注册 Hover Provider，支持所有配置的语言
  const supportedLanguages = Object.keys(LANGUAGE_COMMENT_PATTERNS);
  const hoverProvider = new CommentMarkdownHoverProvider();

  const disposable = vscode.languages.registerHoverProvider(
    supportedLanguages,
    hoverProvider
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
