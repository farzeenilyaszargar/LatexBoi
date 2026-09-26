const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {} };
vm.runInNewContext(ts.transpile(fs.readFileSync(require.resolve('../app/completions.ts'),'utf8'),{module:ts.ModuleKind.CommonJS}),context);
const { completionContext: ctx, findCompletions: find, expandCompletion: expand } = context.exports;
test('backslash opens commands and prefix filters', () => {
  assert.equal(ctx('\\',1).query,'');
  assert.equal(ctx('Hello \\fra',10).query,'fra');
  assert.equal(find('fra')[0].label,'frac');
});
test('comments, selections and line breaks do not open completion', () => {
  assert.equal(ctx('% \\sec',7),null);
  assert.equal(ctx('\\\\',2),null);
  assert.equal(ctx('\\sec',4,1),null);
  assert.equal(ctx('\\sec\n',5),null);
  assert.ok(ctx('95\\% \\sec',10));
});
test('environment snippets preserve indentation and cursor placement', () => {
  const entry=find('begin{itemize')[0];
  const result=expand(entry,'  ');
  assert.equal(result.text,'\\begin{itemize}\n    \\item \n  \\end{itemize}');
  assert.equal(result.text.slice(result.cursor), '\n  \\end{itemize}');
});
test('fraction cursor lands inside numerator', () => {
  assert.equal(expand(find('frac')[0]).cursor,6);
  assert.equal(expand(find('frac')[0]).text,'\\frac{}{}');
});
