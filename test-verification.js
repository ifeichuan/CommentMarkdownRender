/**
 * 测试验证脚本 - 验证测试断言的正确性
 */

function parseCommentLogic(text, pattern) {
  const trimmed = text.trim();
  if (!trimmed.startsWith(pattern.start) || !trimmed.endsWith(pattern.end)) {
    return null;
  }

  let content = trimmed.slice(pattern.start.length, -pattern.end.length);
  const lines = content.split("\n");
  const processedLines = [];

  for (let line of lines) {
    line = line.trimStart();

    // 只移除单独的 *，不破坏 markdown 粗体标记 **text**
    if (line.startsWith("*") && !line.startsWith("**")) {
      line = line.slice(1).trimStart();
    }

    line = line.trimEnd();
    processedLines.push(line);
  }

  // 移除首尾空行
  while (processedLines.length > 0 && processedLines[0].trim() === "") {
    processedLines.shift();
  }
  while (processedLines.length > 0 && processedLines[processedLines.length - 1].trim() === "") {
    processedLines.pop();
  }

  return processedLines.join("\n");
}

// 测试用例
const tests = [
  {
    name: "连续星号测试",
    input: `/*
 **** Many stars
 * Normal line
 */`,
    expected: "**** Many stars\nNormal line",
    pattern: { start: "/*", end: "*/" }
  },
  {
    name: "Markdown 粗体测试",
    input: `/*
 * **Bold text** should work
 * ***Extra bold*** should also work
 */`,
    expected: "**Bold text** should work\n***Extra bold*** should also work",
    pattern: { start: "/*", end: "*/" }
  },
  {
    name: "嵌套星号测试",
    input: `/*
 * *Item 1*
 * **Item 2**
 */`,
    expected: "*Item 1*\n**Item 2**",
    pattern: { start: "/*", end: "*/" }
  }
];

console.log("=".repeat(60));
console.log("测试断言验证");
console.log("=".repeat(60));

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = parseCommentLogic(test.input, test.pattern);
  const isPassed = result === test.expected;

  console.log(`\n测试: ${test.name}`);
  console.log(`输入:`);
  console.log(`  "${test.input.replace(/\n/g, '\\n')}"`);
  console.log(`预期: "${test.expected.replace(/\n/g, '\\n')}"`);
  console.log(`实际: "${result?.replace(/\n/g, '\\n')}"`);
  console.log(`结果: ${isPassed ? '✅ 通过' : '❌ 失败'}`);

  if (isPassed) {
    passed++;
  } else {
    failed++;
  }
});

console.log("\n" + "=".repeat(60));
console.log(`总计: ${passed} 通过, ${failed} 失败`);
console.log("=".repeat(60));

// 手动追踪第一个测试
console.log("\n详细追踪：连续星号测试");
console.log("-".repeat(60));
const input = `/*
 **** Many stars
 * Normal line
 */`;
console.log(`原始输入: "${input.replace(/\n/g, '\\n')}"`);

const trimmed = input.trim();
console.log(`1. trim: "${trimmed.replace(/\n/g, '\\n')}"`);

const content = trimmed.slice(2, -2);
console.log(`2. 移除标记: "${content.replace(/\n/g, '\\n')}"`);

const lines = content.split("\n");
console.log(`3. 分割行: ${JSON.stringify(lines)}`);

console.log(`4. 处理每一行:`);
lines.forEach((line, i) => {
  const trimmedLine = line.trimStart();
  const hasStar = trimmedLine.startsWith("*");
  const hasDoubleStar = trimmedLine.startsWith("**");
  const shouldRemove = hasStar && !hasDoubleStar;
  const finalLine = shouldRemove ? trimmedLine.slice(1).trimStart() : trimmedLine.trimEnd();

  console.log(`   行 ${i}: "${line}"`);
  console.log(`     - trimStart: "${trimmedLine}"`);
  console.log(`     - 以"*"开头: ${hasStar}, 以"**"开头: ${hasDoubleStar}`);
  console.log(`     - 是否移除: ${shouldRemove}`);
  console.log(`     - 结果: "${finalLine}"`);
});
