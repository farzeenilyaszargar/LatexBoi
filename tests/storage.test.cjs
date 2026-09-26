const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpile(fs.readFileSync(require.resolve('../app/storage.ts'), 'utf8'), { module: ts.ModuleKind.CommonJS });
function storage(window) {
  const context = { window, exports: {} };
  vm.runInNewContext(code, context);
  return context.exports;
}

test('empty drafts remain distinct from missing drafts', () => {
  const values = new Map();
  const api = storage({ localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } });
  assert.equal(api.readPreference('source').value, null);
  assert.equal(api.savePreference('source', ''), true);
  assert.equal(api.readPreference('source').value, '');
});

test('blocked storage access does not throw', () => {
  const api = storage({ get localStorage() { throw new Error('SecurityError'); } });
  assert.equal(api.readPreference('source').available, false);
  assert.equal(api.savePreference('source', 'draft'), false);
});

test('quota failures are reported without replacing the saved draft', () => {
  const api = storage({ localStorage: { getItem: () => 'previous draft', setItem: () => { throw new Error('QuotaExceededError'); } } });
  assert.equal(api.savePreference('source', 'new draft'), false);
  assert.equal(api.readPreference('source').value, 'previous draft');
});
