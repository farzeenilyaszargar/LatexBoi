const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync("app/editing.ts", "utf8"), { module: ts.ModuleKind.CommonJS }), context);
const { bracketEdit } = context.exports;
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
