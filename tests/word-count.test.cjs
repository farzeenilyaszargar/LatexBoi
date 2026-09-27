const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync("app/word-count.ts", "utf8"), { module: ts.ModuleKind.CommonJS }), context);
const { countWords } = context.exports;
test("counts prose while excluding preamble, comments and equations", () => {
  assert.equal(countWords("\\documentclass{article}\n\\title{Not counted}\n\\begin{document}\n\\section{Hello world}\nA \\textbf{yellow banana}. % ignore these words\n\\[ x = y + z \\]\n\\begin{equation}x+y=z\\end{equation}\n\\label{not-a-word}\n\\end{document}"), 5);
});
test("retains link labels and Unicode words", () => {
  assert.equal(countWords("\\href{https://example.com}{Read more} café naïve"), 4);
  assert.equal(countWords(""), 0);
});
