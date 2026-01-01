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

    test("应该正确处理 Markdown 粗体标记（不破坏 **text**）", () => {
      const input = `/*
 * **Bold text** should work
 * ***Extra bold*** should also work
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "**Bold text** should work\n***Extra bold*** should also work");
    });

    test("应该处理嵌套的星号", () => {
      const input = `/*
 * *Item 1*
 * **Item 2**
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "*Item 1*\n**Item 2**");
    });

    test("应该处理连续的星号前缀", () => {
      const input = `/*
 **** Many stars
 * Normal line
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      // 第一个 * 会被移除（作为装饰符），保留前导的 ***
      assert.strictEqual(result, "**** Many stars\nNormal line");
    });

    test("应该保留行内的代码标记", () => {
      const input = `/*
 * Use \`console.log()\` for debugging
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Use `console.log()` for debugging");
    });

    test("应该处理 JSDoc 注释", () => {
      const input = `/**
 * @param {string} name - The name parameter
 * @returns {string} A greeting
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "@param {string} name - The name parameter\n@returns {string} A greeting");
    });

    // 边界情况测试
    test("应该处理空注释", () => {
      const input = "/**/";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "");
    });

    test("应该处理只有装饰符的注释", () => {
      const input = `/*
 *
 *
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "");
    });

    test("应该处理包含 Tab 的注释", () => {
      const input = "/*\t\tHello\t\tWorld\t\t*/";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Hello\t\tWorld");
    });

    test("应该处理 Unicode 字符", () => {
      const input = "/* 你好世界 🌍 */";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "你好世界 🌍");
    });

    test("应该处理包含 URL 的注释", () => {
      const input = "/* Visit https://example.com */";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Visit https://example.com");
    });

    test("应该处理注释内的结束标记", () => {
      const input = "/* This contains */ inside */";
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      // 注意：只会匹配第一个 */，所以输出会包含 " inside"
      assert.ok(result && result.includes("This contains"));
      assert.ok(result && result.includes("inside"));
    });

    test("应该处理多行空白字符", () => {
      const input = `/*


Content


*/`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.strictEqual(result, "Content");
    });

    test("应该处理特殊 Markdown 语法", () => {
      const input = `/*
 * # Heading 1
 * ## Heading 2
 * ### Heading 3
 *
 * - [ ] Task item
 * - [x] Completed task
 *
 * | Col 1 | Col 2 |
 * |-------|-------|
 * | Val 1 | Val 2 |
 */`;
      const pattern = { start: "/*", end: "*/" };
      const result = parser.parseComment(input, pattern);
      assert.ok(result && result.includes("# Heading 1"));
      assert.ok(result && result.includes("- [ ] Task item"));
      assert.ok(result && result.includes("| Col 1 |"));
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

    test("应该拒绝混合注释（包含代码）", () => {
      const input = `/* comment */
const x = 1;`;
      const result = parser.detectMultilineComment(input, "javascript");
      // 由于包含结束标记后的代码，不应该被识别为有效的多行注释
      assert.strictEqual(result, null);
    });

    test("应该处理空的注释内容", () => {
      const input = "/**/";
      const result = parser.detectMultilineComment(input, "javascript");
      assert.notStrictEqual(result, null);
    });

    test("应该拒绝只有一行 // 的注释", () => {
      const input = "// single line";
      const result = parser.detectMultilineComment(input, "javascript");
      assert.strictEqual(result, null);
    });

    test("应该接受混合的 // 和其他内容", () => {
      const input = `/* comment with // inside
still comment */`;
      const result = parser.detectMultilineComment(input, "javascript");
      assert.notStrictEqual(result, null);
    });

    // 负面测试和错误情况
    test("空字符串应该返回 null", () => {
      const result = parser.detectMultilineComment("", "javascript");
      assert.strictEqual(result, null);
    });

    test("只有开始标记应该返回 null", () => {
      const result = parser.detectMultilineComment("/* ", "javascript");
      assert.strictEqual(result, null);
    });

    test("不匹配的标记应该返回 null", () => {
      const input = "/* comment */";
      const result = parser.detectMultilineComment(input, "python");
      assert.strictEqual(result, null);
    });

    test("混合的单行和多行注释应该被拒绝", () => {
      const input = `// First line
/* Second line */`;
      const result = parser.detectMultilineComment(input, "javascript");
      assert.strictEqual(result, null);
    });
  });

  // 性能和不变量测试
  suite("Invariants and Properties", () => {
    test("解析后的内容不应以换行符开头或结尾", () => {
      const inputs = [
        "/* content */",
        `/*
 * content
 */`,
        "/*\ncontent\n*/",
      ];

      inputs.forEach(input => {
        const result = parser.parseComment(input, { start: "/*", end: "*/" });
        if (result) {
          assert.ok(!result.startsWith("\n"), "不应以换行符开头");
          assert.ok(!result.endsWith("\n"), "不应以换行符结尾");
        }
      });
    });

    test("解析后的内容长度应小于等于输入", () => {
      const inputs = [
        "/* test */",
        `/*
 * test
 */`,
        "/***/",
      ];

      inputs.forEach(input => {
        const result = parser.parseComment(input, { start: "/*", end: "*/" });
        if (result) {
          assert.ok(result.length <= input.length, `输出长度 (${result.length}) <= 输入长度 (${input.length})`);
        }
      });
    });

    test("有效的注释解析不应返回 null", () => {
      const validInputs = [
        { input: "/* test */", pattern: { start: "/*", end: "*/" } },
        { input: '""" test """', pattern: { start: '"""', end: '"""' } },
        { input: "<!-- test -->", pattern: { start: "<!--", end: "-->" } },
      ];

      validInputs.forEach(({ input, pattern }) => {
        const result = parser.parseComment(input, pattern);
        assert.notStrictEqual(result, null, `有效输入 "${input}" 不应返回 null`);
      });
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
