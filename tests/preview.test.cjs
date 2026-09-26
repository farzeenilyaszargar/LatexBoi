const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync(require.resolve('../app/preview.ts'), 'utf8'), { module: ts.ModuleKind.CommonJS }), context);
const { wheelZoom } = context.exports;

test('zero and tiny wheel events do not cause coarse zoom jumps', () => {
  assert.equal(wheelZoom(1, 0, 0, 800), 1);
  assert.ok(wheelZoom(1, -1, 0, 800) < 1.01);
});
test('wheel zoom is reversible away from bounds', () => {
  assert.ok(Math.abs(wheelZoom(wheelZoom(1, -30, 0, 800), 30, 0, 800) - 1) < 1e-12);
});
test('line and pixel deltas yield equivalent zoom and respect limits', () => {
  assert.equal(wheelZoom(1, 1, 1, 800), wheelZoom(1, 16, 0, 800));
  assert.equal(wheelZoom(3, -100, 0, 800), 3);
  assert.equal(wheelZoom(0.1, 100, 0, 800), 0.1);
});
