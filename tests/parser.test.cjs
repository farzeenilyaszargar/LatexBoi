const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the actual renderer without mounting React or requiring a browser.
const editor = fs.readFileSync(require.resolve('../app/editor.tsx'), 'utf8');
const parser = editor.slice(editor.indexOf('const escapeHtml'), editor.indexOf('function highlightLatex'));
const context = { katex: require('katex') };
vm.createContext(context);
vm.runInContext(ts.transpile(parser, { target: ts.ScriptTarget.ES2022 }), context);
const render = (source) => context.renderLatex(source);

test('unfinished environments remain renderable during typing', () => {
  assert.match(render('\\begin{abstract}Still writing'), /Still writing/);
  assert.match(render('\\begin{quote}\\begin{abstract}Nested draft'), /Nested draft/);
});

test('starred equations close at their own end marker', () => {
  const html = render('\\begin{equation*}x=1\\end{equation*}\n\nAfter equation');
  assert.match(html, /katex-display/);
  assert.match(html, /<p>After equation<\/p>/);
  assert.doesNotMatch(html, /katex-error/);
});

test('tables omit column specs and preserve empty cells', () => {
  const html = render(String.raw`\begin{tabular}{lll}A & & C \\ D & E & F\end{tabular}`);
  assert.doesNotMatch(html, /lll/);
  assert.match(html, /<td>A<\/td><td><\/td><td>C<\/td>/);
  assert.equal((html.match(/<td>/g) || []).length, 6);
});

test('commented structures do not affect section numbering or content', () => {
  const html = render('% \\begin{abstract}\n% \\section{Hidden}\n\\section{First}\n\nVisible');
  assert.doesNotMatch(html, /abstract|Hidden/);
  assert.match(html, /1\s+First/);
});

test('unnumbered sections do not increment the next section', () => {
  const html = render('\\section*{Preface}\n\n\\section{First}');
  assert.match(html, /<h2>Preface<\/h2>/);
  assert.match(html, /1\s+First/);
});

test('escaped percent signs remain literal text', () => {
  assert.match(render(String.raw`Accuracy is 95\% today.`), /Accuracy is 95% today/);
});
