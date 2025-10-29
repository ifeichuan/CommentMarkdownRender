import * as assert from "assert";
import { CommentParser, LANGUAGE_COMMENT_PATTERNS } from "../../commentParser";

suite("CommentParser Test Suite", () => {
  let parser: CommentParser;

  setup(() => {
    parser = new CommentParser();
  });

  suite("parseComment", () => {
    test("应该解析简单的 C 风格注释", () => {
      const input = "/* Hello World */";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Hello World");
    });

    test("应该解析多行 C 风格注释", () => {
      const input = `/*
 * This is a title
 * This is content
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "This is a title\nThis is content");
    });

    test("应该解析带有 Markdown 格式的注释", () => {
      const input = `/*
 * # Title
 * 
 * - Item 1
 * - Item 2
 * 
 * **Bold text**
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(
        result,
        "# Title\n\n- Item 1\n- Item 2\n\n**Bold text**"
      );
    });

    test("应该解析 Python 风格的三引号注释", () => {
      const input = `"""
This is a docstring
With multiple lines
"""`;
      const pattern = { start: '"""', end: '"""' };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "This is a docstring\nWith multiple lines");
    });

    test("应该解析 HTML 注释", () => {
      const input = `<!-- 
This is an HTML comment
-->`;
      const pattern = { start: "<!--", end: "-->" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "This is an HTML comment");
    });

    test("不匹配的模式应该返回 null", () => {
      const input = "// This is a line comment";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, null);
    });

    test("应该移除空行", () => {
      const input = `/*

 * Content

 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Content");
    });
  });

  suite("detectMultilineComment", () => {
    test("应该检测 TypeScript 的多行注释", () => {
      const input = "/* comment */";
      const result = parser.detectMultilineComment(input, "typescript");
      assert.notStrictEqual(result, null);
      assert.strictEqual(result?.start, "/*");
      assert.strictEqual(result?.end, "*/");
    });

    test("应该检测 Python 的多行注释", () => {
      const input = '""" docstring """';
      const result = parser.detectMultilineComment(input, "python");
      assert.notStrictEqual(result, null);
      assert.strictEqual(result?.start, '"""');
    });

    test("应该拒绝多行 // 注释", () => {
      const input = `// Line 1
// Line 2
// Line 3`;
      const result = parser.detectMultilineComment(input, "javascript");
      assert.strictEqual(result, null);
    });

    test("不支持的语言应该返回 null", () => {
      const input = "/* comment */";
      const result = parser.detectMultilineComment(
        input,
        "unsupported-language"
      );
      assert.strictEqual(result, null);
    });

    test("单行注释应该返回有效模式", () => {
      const input = "/* single line */";
      const result = parser.detectMultilineComment(input, "javascript");
      assert.notStrictEqual(result, null);
    });
  });

  suite("LANGUAGE_COMMENT_PATTERNS", () => {
    test("应该包含常见的编程语言", () => {
      const expectedLanguages = [
        "typescript",
        "javascript",
        "java",
        "python",
        "c",
        "cpp",
        "csharp",
        "go",
        "rust",
        "php",
        "html",
        "css",
      ];

      for (const lang of expectedLanguages) {
        assert.ok(
          LANGUAGE_COMMENT_PATTERNS[lang],
          `应该包含 ${lang} 的注释模式`
        );
      }
    });

    test("每个语言应该至少有一个注释模式", () => {
      for (const [lang, patterns] of Object.entries(
        LANGUAGE_COMMENT_PATTERNS
      )) {
        assert.ok(patterns.length > 0, `${lang} 应该至少有一个注释模式`);
      }
    });
  });
});
