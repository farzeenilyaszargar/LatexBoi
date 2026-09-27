const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync("app/editing.ts", "utf8"), { module: ts.ModuleKind.CommonJS }), context);
const { bracketEdit } = context.exports;
const { commentEdit } = context.exports;
const { formatEdit } = context.exports;
test("format shortcuts wrap selections and leave empty insertion points inside braces", () => {
  const bold = formatEdit("a banana", 2, 8, "textbf");
  assert.equal(bold.text, "\\textbf{banana}");
  assert.equal(bold.selectionStart, 10);
  assert.equal(bold.selectionEnd, 16);
  const italic = formatEdit("", 0, 0, "textit");
  assert.equal(italic.text, "\\textit{}");
  assert.equal(italic.selectionStart, 8);
  assert.equal(italic.selectionEnd, 8);
});
test("comments a selection without touching the next unselected line", () => {
  const edit = commentEdit("one\ntwo\nthree", 0, 8);
  assert.equal(edit.text, "% one\n% two");
  assert.equal(edit.selectionEnd, 12);
});
test("uncomments indented lines and retains caret position", () => {
  const edit = commentEdit("  % banana", 10, 10);
  assert.equal(edit.text, "  banana");
  assert.equal(edit.selectionStart, 8);
});
test("brackets wrap selected text and place the cursor inside empty pairs", () => {
  assert.equal(bracketEdit("banana", 0, 6, "{").text, "{banana}");
  assert.equal(bracketEdit("", 0, 0, "[").selectionStart, 1);
});
test("skip closers, delete empty pairs, leave escaped braces and comments alone", () => {
  assert.equal(bracketEdit("{}", 1, 1, "}").selectionStart, 2);
  assert.equal(bracketEdit("{}", 1, 1, "Backspace").end, 2);
  assert.equal(bracketEdit("\\", 1, 1, "{"), null);
  assert.equal(bracketEdit("% comment", 9, 9, "{"), null);
});
