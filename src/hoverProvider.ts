/**
 * Hover Provider - 提供鼠标悬停时的 Markdown 渲染
 */

import * as vscode from "vscode";
import {
  CommentParser,
  CommentPattern,
  LANGUAGE_COMMENT_PATTERNS,
} from "./commentParser";

export class CommentMarkdownHoverProvider implements vscode.HoverProvider {
  private parser: CommentParser;

  constructor() {
    this.parser = new CommentParser();
  }

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const languageId = document.languageId;

    // 检查是否支持该语言
    if (!LANGUAGE_COMMENT_PATTERNS[languageId]) {
      return null;
    }

    // 获取当前位置的注释范围
    const commentRange = this.getCommentRange(document, position, languageId);
    if (!commentRange) {
      return null;
    }

    // 提取注释文本
    const commentText = document.getText(commentRange);

    // 检测是否是多行注释
    const pattern = this.parser.detectMultilineComment(commentText, languageId);
    if (!pattern) {
      return null;
    }

    // 解析注释内容
    const markdownContent = this.parser.parseComment(commentText, pattern);
    if (!markdownContent) {
      return null;
    }

    // 创建 Markdown 内容
    const markdown = new vscode.MarkdownString(markdownContent);
    markdown.isTrusted = true;
    markdown.supportHtml = true;

    return new vscode.Hover(markdown, commentRange);
  }

  /**
   * 获取当前位置的注释范围
   */
  private getCommentRange(
    document: vscode.TextDocument,
    position: vscode.Position,
    languageId: string
  ): vscode.Range | null {
    const patterns = LANGUAGE_COMMENT_PATTERNS[languageId];
    if (!patterns) {
      return null;
    }

    // 向上查找注释起始位置
    let startLine = position.line;
    let foundStart = false;
    let matchedPattern: CommentPattern | null = null;

    for (let i = position.line; i >= 0; i--) {
      const lineText = document.lineAt(i).text;

      for (const pattern of patterns) {
        if (lineText.includes(pattern.start)) {
          startLine = i;
          foundStart = true;
          matchedPattern = pattern;
          break;
        }
      }

      if (foundStart) {
        break;
      }

      // 如果遇到空行或其他内容，停止查找
      if (
        i < position.line &&
        lineText.trim() !== "" &&
        !this.looksLikeCommentLine(lineText)
      ) {
        return null;
      }
    }

    if (!foundStart || !matchedPattern) {
      return null;
    }

    // 向下查找注释结束位置
    let endLine = position.line;
    let foundEnd = false;

    // 对于相同的开始和结束标记（如 Python 的 """），需要从下一行开始查找
    const searchStartLine =
      matchedPattern.start === matchedPattern.end ? startLine + 1 : startLine;

    for (let i = searchStartLine; i < document.lineCount; i++) {
      const lineText = document.lineAt(i).text;

      if (lineText.includes(matchedPattern.end)) {
        endLine = i;
        foundEnd = true;
        break;
      }
    }

    if (!foundEnd) {
      return null;
    }

    // 创建范围
    const startPos = new vscode.Position(startLine, 0);
    const endPos = new vscode.Position(
      endLine,
      document.lineAt(endLine).text.length
    );

    return new vscode.Range(startPos, endPos);
  }

  /**
   * 判断一行是否看起来像注释行
   */
  private looksLikeCommentLine(line: string): boolean {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("*") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("#") ||
      trimmed === ""
    );
  }
}
