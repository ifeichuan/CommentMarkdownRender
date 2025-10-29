/**
 * 注释解析器 - 负责从不同语言的注释中提取纯文本内容
 */

export interface CommentPattern {
  start: string;
  end: string;
  linePrefix?: string; // 可选的行前缀，如 *
}

/**
 * 支持的语言及其多行注释格式
 */
export const LANGUAGE_COMMENT_PATTERNS: Record<string, CommentPattern[]> = {
  typescript: [{ start: "/*", end: "*/" }],
  javascript: [{ start: "/*", end: "*/" }],
  typescriptreact: [{ start: "/*", end: "*/" }],
  javascriptreact: [{ start: "/*", end: "*/" }],
  java: [{ start: "/*", end: "*/" }],
  c: [{ start: "/*", end: "*/" }],
  cpp: [{ start: "/*", end: "*/" }],
  csharp: [{ start: "/*", end: "*/" }],
  go: [{ start: "/*", end: "*/" }],
  rust: [{ start: "/*", end: "*/" }],
  php: [{ start: "/*", end: "*/" }],
  swift: [{ start: "/*", end: "*/" }],
  kotlin: [{ start: "/*", end: "*/" }],
  scala: [{ start: "/*", end: "*/" }],
  python: [
    { start: '"""', end: '"""' },
    { start: "'''", end: "'''" },
  ],
  html: [{ start: "<!--", end: "-->" }],
  xml: [{ start: "<!--", end: "-->" }],
  css: [{ start: "/*", end: "*/" }],
  scss: [{ start: "/*", end: "*/" }],
  less: [{ start: "/*", end: "*/" }],
  sql: [{ start: "/*", end: "*/" }],
};

/**
 * 解析注释文本，提取纯文本内容
 */
export class CommentParser {
  /**
   * 从注释块中提取纯文本
   * @param text 完整的注释文本
   * @param pattern 注释模式
   * @returns 提取的纯文本
   */
  public parseComment(text: string, pattern: CommentPattern): string | null {
    // 移除前后空白
    const trimmed = text.trim();

    // 检查是否匹配注释模式
    if (!trimmed.startsWith(pattern.start) || !trimmed.endsWith(pattern.end)) {
      return null;
    }

    // 移除开始和结束标记
    let content = trimmed.slice(pattern.start.length, -pattern.end.length);

    // 按行处理
    const lines = content.split("\n");
    const processedLines: string[] = [];

    for (let line of lines) {
      // 移除行首空白
      line = line.trimStart();

      // 移除常见的装饰符（如 * ）
      if (line.startsWith("*") && !line.startsWith("**")) {
        line = line.slice(1).trimStart();
      } else if (line.startsWith("**/")) {
        // 处理结束标记
        continue;
      }

      // 移除行尾空白
      line = line.trimEnd();
      
      processedLines.push(line);
    }

    // 移除首尾的空行
    while (processedLines.length > 0 && processedLines[0].trim() === "") {
      processedLines.shift();
    }
    while (
      processedLines.length > 0 &&
      processedLines[processedLines.length - 1].trim() === ""
    ) {
      processedLines.pop();
    }

    return processedLines.join("\n");
  }

  /**
   * 检测文本是否是多行注释（排除多行 //）
   * @param text 要检测的文本
   * @param languageId 语言 ID
   * @returns 如果是有效的多行注释则返回匹配的模式，否则返回 null
   */
  public detectMultilineComment(
    text: string,
    languageId: string
  ): CommentPattern | null {
    const patterns = LANGUAGE_COMMENT_PATTERNS[languageId];
    if (!patterns) {
      return null;
    }

    const trimmed = text.trim();

    // 检查是否是多行 //
    if (this.isMultipleSlashComments(trimmed)) {
      return null;
    }

    // 尝试匹配每个模式
    for (const pattern of patterns) {
      if (trimmed.startsWith(pattern.start) && trimmed.endsWith(pattern.end)) {
        return pattern;
      }
    }

    return null;
  }

  /**
   * 检查是否是多行 // 注释
   */
  private isMultipleSlashComments(text: string): boolean {
    const lines = text.split("\n");
    if (lines.length < 2) {
      return false;
    }

    // 如果每行都以 // 开头，则认为是多行 // 注释
    return lines.every((line) => line.trim().startsWith("//"));
  }
}
