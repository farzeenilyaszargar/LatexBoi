const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync(require.resolve('../app/line-move.ts'),'utf8'),{module:ts.ModuleKind.CommonJS}),context);
const moveLines = context.exports.moveLines;

test('moves a current line down and preserves the cursor column', () => {
  const result = moveLines('alpha\nbeta\ngamma', 6, 6, 1);
  assert.equal(JSON.stringify(result), JSON.stringify({ source: 'alpha\ngamma\nbeta', selectionStart: 12, selectionEnd: 12 }));
});
test('moves selected lines up as a block', () => {
  const result = moveLines('one\ntwo\nthree\nfour', 4, 14, -1);
  assert.equal(result.source, 'two\nthree\none\nfour');
  assert.equal(result.selectionStart, 0);
  assert.equal(result.selectionEnd, 10);
});
test('does not move beyond document boundaries', () => {
  assert.equal(moveLines('one\ntwo', 1, 1, -1), null);
  assert.equal(moveLines('one\ntwo', 6, 6, 1), null);
});
test('moves a selected final line down without losing selection', () => {
  const result = moveLines('one\ntwo\nthree', 4, 7, 1);
  assert.equal(JSON.stringify(result), JSON.stringify({ source: 'one\nthree\ntwo', selectionStart: 10, selectionEnd: 13 }));
});
