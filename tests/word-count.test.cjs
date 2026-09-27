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
test("includes title and author only when typeset and preserves nested formatting", () => {
  assert.equal(countWords("\\title{Banana \\emph{science}}\\author{Penny Peel}\\begin{document}\\maketitle\nA \\textbf{very \\emph{yellow} banana}.\\end{document}"), 8);
  assert.equal(countWords("un\\textbf{break}able"), 1);
});
test("counts table prose and bibliography without column specs or citation keys", () => {
  assert.equal(countWords("\\begin{tabular}{p{3cm}rr}Yellow banana & Nice fruit \\\\ \\end{tabular}\\begin{thebibliography}{99}\\bibitem{long-key}Research paper\\end{thebibliography}"), 6);
});
test("omits dimensions, colors, citations, code and math environments", () => {
  assert.equal(countWords("\\textcolor{dark green}{Fresh banana}\\citep[see][p. 42]{peel}\\vspace{2cm}\\begin{gather}a+b=c\\end{gather}\\verb|hidden code|"), 2);
});
test("tolerates incomplete drafts and distinguishes escaped percent signs", () => {
  assert.equal(countWords("\\textbf{yellow banana"), 2);
  assert.equal(countWords("A \\% sign % omit this\nand fruit"), 4);
  assert.equal(countWords("banana% comment\nbread"), 1);
  assert.equal(countWords("hello $unfinished math words"), 1);
});
