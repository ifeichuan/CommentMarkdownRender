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
    let startOffset = 0;

    for (let i = position.line; i >= 0; i--) {
      const lineText = document.lineAt(i).text;

      for (const pattern of patterns) {
        // 使用正则表达式精确匹配注释标记
        // 确保不是字符串内容的一部分
        const startIndex = this.findCommentStart(lineText, pattern.start, languageId);
        if (startIndex !== -1) {
          startLine = i;
          startOffset = startIndex;
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
    let endOffset = 0;
    let foundEnd = false;

    // 对于相同的开始和结束标记（如 Python 的 """），需要从下一行开始查找
    const searchStartLine =
      matchedPattern.start === matchedPattern.end ? startLine + 1 : startLine;

    for (let i = searchStartLine; i < document.lineCount; i++) {
      const lineText = document.lineAt(i).text;

      // 使用正则表达式精确匹配注释标记
      const endIndex = this.findCommentEnd(lineText, matchedPattern.end, languageId);
      if (endIndex !== -1) {
        endLine = i;
        endOffset = endIndex + matchedPattern.end.length;
        foundEnd = true;
        break;
      }
    }

    if (!foundEnd) {
      return null;
    }

    // 创建范围
    const startPos = new vscode.Position(startLine, startOffset);
    const endPos = new vscode.Position(endLine, endOffset);

    return new vscode.Range(startPos, endPos);
  }

  /**
   * 查找注释开始标记的位置，避免误匹配字符串
   */
  private findCommentStart(
    lineText: string,
    startMarker: string,
    languageId: string
  ): number {
    // 简单检查：确保注释标记前面没有非空白字符（排除字符串中的情况）
    // 这是一个启发式方法，不是完美的解析
    const index = lineText.indexOf(startMarker);

    // 检查标记前是否只有空白字符
    if (index === 0) {
      return index;
    }

    // 检查标记前面是否有引号（可能在字符串中）
    const beforeMarker = lineText.substring(0, index);
    const trimmedBefore = beforeMarker.trim();

    // 如果前面有非空白字符且不是注释符号，可能在字符串中
    if (trimmedBefore.length > 0 && !this.looksLikeCommentLine(beforeMarker)) {
      // 检查是否在字符串中（简单启发式）
      const quoteCount = (beforeMarker.match(/["']/g) || []).length;
      if (quoteCount % 2 === 1) {
        // 奇数个引号，可能在字符串中
        return -1;
      }
    }

    return index;
  }

  /**
   * 查找注释结束标记的位置，避免误匹配字符串
   */
  private findCommentEnd(
    lineText: string,
    endMarker: string,
    languageId: string
  ): number {
    const index = lineText.indexOf(endMarker);

    if (index === -1) {
      return -1;
    }

    // 简单验证：确保后面没有其他字符在同一个"词"中
    const afterMarker = lineText.substring(index + endMarker.length).trim();

    // 如果后面紧跟字母数字，可能是误匹配
    if (afterMarker.length > 0 && /^[a-zA-Z0-9_]/.test(afterMarker)) {
      return -1;
    }

    return index;
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
