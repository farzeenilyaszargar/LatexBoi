"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, FileText, Moon, Play, RotateCcw, Sun } from "lucide-react";
import katex from "katex";

import "katex/dist/katex.min.css";

const STARTER = String.raw`\documentclass{article}
\usepackage{amsmath}
\title{A tiny document}
\author{LatexBoi}

\begin{document}
\maketitle

Hello, world! This is a simple LaTeX workspace.

Here is a famous equation:
\[
  E = mc^2
\]

\section{A new beginning}

Write on the left. Your document appears on the right as you type.

\end{document}`;

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function findMatchingEnvironment(source: string, start: number, env: string) {
  const token = new RegExp(`\\\\(begin|end)\\{${env}\\}`, "g");
  const opening = token.exec(source.slice(start));
  if (!opening) return { content: source.slice(start), end: source.length };
  token.lastIndex = start;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(source))) {
    if (match[1] === "begin") depth += 1;
    else {
      depth -= 1;
      if (depth === 0) return { content: source.slice(start + opening[0].length, token.lastIndex - match[0].length), end: token.lastIndex };
    }
  }
  return { content: source.slice(start), end: source.length };
}

function replaceBraced(text: string, command: string, render: (value: string) => string) {
  const pattern = new RegExp(`\\\\${command}\\{([^{}]*)\\}`, "g");
  let result = text;
  for (let i = 0; i < 5; i += 1) result = result.replace(pattern, (_, value) => render(value));
  return result;
}

function renderMath(formula: string, display = false) {
  try { return katex.renderToString(formula.trim(), { displayMode: display, throwOnError: false }); }
  catch { return `<code>${escapeHtml(formula)}</code>`; }
}

function renderInline(text: string, refs: Record<string, number>, citations: Record<string, number>) {
  const math: string[] = [];
  let value = text
    .replace(/%[^\n]*/g, "")
    .replace(/\\\((.+?)\\\)/g, (_, formula) => { math.push(renderMath(formula)); return `@@MATH${math.length - 1}@@`; })
    .replace(/\\LaTeX\{?\}?/g, "LaTeX")
    .replace(/\\today/g, new Date().toLocaleDateString())
    .replace(/~+/g, " ");
  value = escapeHtml(value);
  value = replaceBraced(value, "textbf", (v) => `<strong>${v}</strong>`);
  value = replaceBraced(value, "textit", (v) => `<em>${v}</em>`);
  value = replaceBraced(value, "underline", (v) => `<u>${v}</u>`);
  value = replaceBraced(value, "texttt", (v) => `<code>${v}</code>`);
  value = replaceBraced(value, "textsc", (v) => `<span class="small-caps">${v}</span>`);
  value = replaceBraced(value, "emph", (v) => `<em>${v}</em>`);
  value = replaceBraced(value, "color", (v) => `<span style="color:${v}">${v}</span>`);
  value = value.replace(/\\color\{([^{}]+)\}\{([^{}]*)\}/g, '<span style="color:$1">$2</span>');
  value = value.replace(/\\href\{([^{}]+)\}\{([^{}]*)\}/g, '<a href="$1" target="_blank" rel="noreferrer">$2</a>');
  value = value.replace(/\\url\{([^{}]+)\}/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
  value = value.replace(/\\\\/g, "<br />");
  value = value.replace(/\\ref\{([^{}]+)\}/g, (_, key) => `<a class="reference">${refs[key] ?? "?"}</a>`);
  value = value.replace(/\\cite\{([^{}]+)\}/g, (_, key) => `<sup class="citation">[${citations[key] ?? "?"}]</sup>`);
  value = value.replace(/\\(quad|qquad|,|;|!)/g, " ");
  value = value.replace(/\\([#%&_{}$])/g, "$1");
  return value.replace(/@@MATH(\d+)@@/g, (_, index) => math[Number(index)]);
}

function extractLabels(source: string) {
  const refs: Record<string, number> = {};
  let section = 0;
  source.replace(/\\section(?:\*)?\{([^}]*)\}|\\label\{([^}]*)\}/g, (_, title, label) => {
    if (title) section += 1;
    if (label) refs[label] = section;
    return "";
  });
  const citations: Record<string, number> = {};
  let citation = 0;
  source.replace(/\\bibitem\{([^}]*)\}/g, (_, key) => { citations[key] = ++citation; return ""; });
  return { refs, citations };
}

function renderTable(content: string, refs: Record<string, number>, citations: Record<string, number>) {
  const rows = content.replace(/\\(toprule|midrule|bottomrule|hline|cline\{[^}]*\})/g, "").split(/\\\\/).map((row) => row.trim()).filter(Boolean);
  return `<div class="table-scroll"><table>${rows.map((row) => {
    const cells = row.split(/(?<!\\)&/).map((cell) => cell.trim()).filter(Boolean);
    return `<tr>${cells.map((cell) => `<td>${renderInline(cell, refs, citations)}</td>`).join("")}</tr>`;
  }).join("")}</table></div>`;
}

function renderList(content: string, ordered: boolean, refs: Record<string, number>, citations: Record<string, number>) {
  const items: string[] = [];
  let cursor = 0;
  while (cursor < content.length) {
    const match = /\\item(?:\[[^\]]*\])?/.exec(content.slice(cursor));
    if (!match) break;
    const start = cursor + match.index + match[0].length;
    const next = /\\item(?:\[[^\]]*\])?/.exec(content.slice(start));
    const end = next ? start + next.index : content.length;
    items.push(renderContent(content.slice(start, end), refs, citations));
    cursor = end;
  }
  return `<${ordered ? "ol" : "ul"}>${items.map((item) => `<li>${item.trim()}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;
}

function renderEnvironment(env: string, content: string, refs: Record<string, number>, citations: Record<string, number>) {
  if (env === "itemize") return renderList(content, false, refs, citations);
  if (env === "enumerate") return renderList(content, true, refs, citations);
  if (["equation", "equation*"].includes(env)) return `<div class="math-display">${renderMath(content.replace(/\\label\{[^}]*\}/g, ""), true)}</div>`;
  if (["align", "align*", "alignat", "alignat*"].includes(env)) return `<div class="math-display">${renderMath(content.replace(/\\label\{[^}]*\}/g, ""), true)}</div>`;
  if (["bmatrix", "pmatrix", "vmatrix", "matrix"].includes(env)) return renderMath(`\\begin{${env}}${content}\\end{${env}}`, true);
  if (env === "tabular" || env === "tabularx") return renderTable(content, refs, citations);
  if (env === "figure") return `<figure class="figure-placeholder"><div class="image-placeholder">▧</div>${extractArgument(content, "caption") ? `<figcaption>${renderInline(extractArgument(content, "caption"), refs, citations)}</figcaption>` : ""}</figure>`;
  if (env === "tikzpicture") {
    const nodes: string[] = [];
    content.replace(/\\node[\s\S]*?\(([A-Za-z0-9]+)\)[\s\S]*?\{([^}]*)\};/g, (_, id, label) => { nodes.push(`<span class="tikz-node" data-node="${id}">${escapeHtml(label)}</span>`); return ""; });
    const arrows = (content.match(/\\draw\[[^\]]*\]\s*\([^)]+\)\s*--\s*\([^)]+\)/g) || []).length;
    return `<div class="tikz-diagram">${nodes.join(arrows ? '<span class="tikz-arrow">→</span>' : "")}</div>`;
  }
  if (env === "lstlisting") return `<pre class="code-block"><code>${escapeHtml(content.trim())}</code></pre>`;
  if (env === "algorithm" || env === "algorithmic") return `<div class="algorithm"><strong>${extractArgument(content, "caption") || "Algorithm"}</strong><pre>${escapeHtml(content.replace(/\\(Require|Ensure|For|If|EndIf|EndFor|State|Return)/g, "").trim())}</pre></div>`;
  if (["tcolorbox"].includes(env)) return `<aside class="color-box">${renderContent(content, refs, citations)}</aside>`;
  if (["quote", "displayquote"].includes(env)) return `<blockquote>${renderContent(content, refs, citations)}</blockquote>`;
  if (env === "multicols") return `<div class="columns">${renderContent(content, refs, citations)}</div>`;
  if (["theorem", "lemma", "definition", "proof"].includes(env)) return `<div class="theorem"><strong>${env[0].toUpperCase() + env.slice(1)}.</strong> ${renderContent(content, refs, citations)}</div>`;
  if (env === "center") return `<div class="centered">${renderContent(content, refs, citations)}</div>`;
  if (env === "abstract") return `<section class="abstract"><strong>Abstract</strong>${renderContent(content, refs, citations)}</section>`;
  if (env === "thebibliography") {
    const items: string[] = [];
    content.replace(/\\bibitem\{([^}]*)\}([\s\S]*?)(?=\\bibitem\{|$)/g, (_, key, value) => { items.push(`<li id="${escapeHtml(key)}">${renderContent(value, refs, citations)}</li>`); return ""; });
    return `<section class="bibliography"><h2>References</h2><ol>${items.join("")}</ol></section>`;
  }
  return renderContent(content, refs, citations);
}

function extractArgument(content: string, command: string) {
  const match = new RegExp(`\\\\${command}\\{([^}]*)\\}`).exec(content);
  return match?.[1] ?? "";
}

function renderContent(source: string, refs: Record<string, number>, citations: Record<string, number>): string {
  let output = "";
  let cursor = 0;
  const begin = /\\begin\{([a-zA-Z*]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = begin.exec(source))) {
    const before = source.slice(cursor, match.index);
    output += renderPlain(before, refs, citations);
    const env = match[1];
    const found = findMatchingEnvironment(source, match.index, env);
    output += renderEnvironment(env, found.content, refs, citations);
    cursor = found.end;
    begin.lastIndex = cursor;
  }
  output += renderPlain(source.slice(cursor), refs, citations);
  return output;
}

function renderPlain(source: string, refs: Record<string, number>, citations: Record<string, number>) {
  let text = source.replace(/%[^\n]*/g, "").replace(/\\(documentclass|usepackage|newtheorem|definecolor|setlength|pagestyle|fancyhf|fancyhead|fancyfoot|lstset|vspace|hspace|columnbreak|centering|label|noindent)\b(?:\[[^\]]*\])?(?:\{[^}]*\})?/g, "");
  const displayMath: string[] = [];
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => { displayMath.push(`<div class="math-display">${renderMath(formula, true)}</div>`); return `@@DISPLAY${displayMath.length - 1}@@`; });
  text = text.replace(/\\\$([^$]+)\$/g, (_, formula) => { displayMath.push(renderMath(formula)); return `@@DISPLAY${displayMath.length - 1}@@`; });
  text = text.replace(/\\footnote\{([^{}]*)\}/g, (_, value) => `<sup class="footnote">†</sup><span class="footnote-text">${renderInline(value, refs, citations)}</span>`);
  text = text.replace(/\\includegraphics(?:\[[^\]]*\])?\{([^}]*)\}/g, (_, name) => `<div class="image-placeholder">▧ ${escapeHtml(name)}</div>`);
  text = text.replace(/\\lipsum(?:\[([^\]]*)\])?/g, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, nibh at facilisis volutpat, lectus neque consequat ipsum, vitae suscipit justo sem a justo.");
  text = text.replace(/\\(maketitle|tableofcontents|newpage|end\{document\}|begin\{document\})/g, "");
  text = text.replace(/\\section\*?\{([^}]*)\}/g, (_, title) => `<h2>${renderInline(title, refs, citations)}</h2>`);
  text = text.replace(/\\subsection\*?\{([^}]*)\}/g, (_, title) => `<h3>${renderInline(title, refs, citations)}</h3>`);
  text = text.replace(/\\subsubsection\*?\{([^}]*)\}/g, (_, title) => `<h4>${renderInline(title, refs, citations)}</h4>`);
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return blocks.map((block) => {
    const restored = block.replace(/@@DISPLAY(\d+)@@/g, (_, index) => displayMath[Number(index)]);
    if (block.trim().startsWith("<")) return restored;
    const rendered = renderInline(block, refs, citations).replace(/@@DISPLAY(\d+)@@/g, (_, index) => displayMath[Number(index)]);
    return block.trim().startsWith("@@DISPLAY") ? rendered : `<p>${rendered.replace(/\n/g, "<br />")}</p>`;
  }).join("");
}

function renderLatex(source: string) {
  const { refs, citations } = extractLabels(source);
  const title = extractArgument(source, "title");
  const author = extractArgument(source, "author");
  const date = extractArgument(source, "date");
  let body = source.replace(/^[\s\S]*?\\begin\{document\}/, "").replace(/\\end\{document\}[\s\S]*$/, "");
  body = body.replace(/\\title\{[^}]*\}|\\author\{[^}]*\}|\\date\{[^}]*\}/g, "");
  let sectionNumber = 0;
  let subsectionNumber = 0;
  body = body.replace(/\\(section|subsection)(\*)?\{([^}]*)\}/g, (_, kind, star, heading) => {
    if (kind === "section") {
      sectionNumber += 1;
      subsectionNumber = 0;
      return star ? `\\section*{${heading}}` : `\\section{${sectionNumber}\\quad ${heading}}`;
    }
    return star ? `\\subsection*{${heading}}` : `\\subsection{${sectionNumber}.${++subsectionNumber}\\quad ${heading}}`;
  });
  const headings = [...body.matchAll(/\\section\*?\{([^}]*)\}/g)].map((match, index) => `<li>${index + 1}. ${renderInline(match[1], refs, citations)}</li>`).join("");
  const toc = headings ? `<nav class="toc"><strong>Contents</strong><ol>${headings}</ol></nav>` : "";
  const header = title ? `<h1>${renderInline(title, refs, citations)}</h1><p class="author">${renderInline(author, refs, citations)}${date ? `<br /><span class="date">${renderInline(date, refs, citations)}</span>` : ""}</p>` : "";
  return header + renderContent(body, refs, citations).replace(/<p><nav class="toc">[\s\S]*?<\/nav><\/p>/, "") + (body.includes("\\tableofcontents") ? toc : "");
}

function highlightLatex(source: string) {
  return source.split("\n").map((line) => {
    const commentStart = line.indexOf("%");
    const code = commentStart >= 0 ? line.slice(0, commentStart) : line;
    const comment = commentStart >= 0 ? line.slice(commentStart) : "";
    const highlighted = escapeHtml(code).replace(/(\\[a-zA-Z@]+|[{}\[\]])/g, (token) => {
      if (token.startsWith("\\")) return `<span class="syntax-command">${token}</span>`;
      return `<span class="syntax-bracket">${token}</span>`;
    });
    return `${highlighted}${comment ? `<span class="syntax-comment">${escapeHtml(comment)}</span>` : ""}`;
  }).join("\n");
}

function paginateHtml(html: string, frame: HTMLElement | null) {
  if (typeof document === "undefined" || !frame) return [html];
  const container = document.createElement("div");
  container.innerHTML = html;
  const blocks = Array.from(container.childNodes).map((node) => node instanceof HTMLElement ? node.outerHTML : escapeHtml(node.textContent || "")).filter(Boolean);
  if (blocks.length === 0) return [html];

  // Keep screen pagination and print pagination on the same physical A4 canvas.
  const pageWidth = 793.7;
  const pageHeight = pageWidth * 297 / 210;
  const measure = document.createElement("article");
  measure.className = "paper";
  Object.assign(measure.style, { position: "absolute", visibility: "hidden", pointerEvents: "none", width: `${pageWidth}px`, height: `${pageHeight}px`, minHeight: "0", maxWidth: "none", overflow: "hidden" });
  document.body.appendChild(measure);

  const pages: string[] = [];
  let page: string[] = [];
  blocks.forEach((block) => {
    measure.innerHTML = page.concat(block).join("");
    if (page.length > 0 && measure.scrollHeight > pageHeight + 1) {
      pages.push(page.join(""));
      page = [block];
      measure.innerHTML = block;
    } else {
      page.push(block);
    }
  });
  if (page.length) pages.push(page.join(""));
  measure.remove();
  return pages;
}

export default function Editor() {
  const [source, setSource] = useState(STARTER);
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [paperScale, setPaperScale] = useState(1);
  const highlightRef = useRef<HTMLPreElement>(null);
  const paperFrameRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => renderLatex(source), [source]);
  const [pages, setPages] = useState<string[]>([html]);
  const highlightedSource = useMemo(() => highlightLatex(source), [source]);

  useEffect(() => {
    const repaginate = () => {
      const frame = paperFrameRef.current;
      if (frame) setPaperScale(Math.min(1, Math.max(0.55, (frame.clientWidth - 40) / 793.7)));
      setPages(paginateHtml(html, frame));
    };
    repaginate();
    const observer = typeof ResizeObserver !== "undefined" && paperFrameRef.current ? new ResizeObserver(repaginate) : null;
    if (observer && paperFrameRef.current) observer.observe(paperFrameRef.current);
    return () => observer?.disconnect();
  }, [html]);

  useEffect(() => {
    const savedSource = window.localStorage.getItem("latexboi:source");
    const savedTheme = window.localStorage.getItem("latexboi:theme");
    if (savedSource) setSource(savedSource);
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (hydrated) window.localStorage.setItem("latexboi:theme", theme);
  }, [hydrated, theme]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("latexboi:source", source);
  }, [hydrated, source]);

  async function copySource() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><img className={`brand-logo ${theme === "light" ? "logo-light" : "logo-dark"}`} src="/latexboi-logo.png" alt="" /></span><span>LatexBoi</span></div>
        <div className="topbar-center"><span className="dot" /> Untitled document <span className="saved">Saved locally</span></div>
        <div className="topbar-actions"><button className="icon-button" onClick={copySource} title="Copy source"><Copy size={16} />{copied ? "Copied" : "Copy"}</button><button className="icon-button theme-button" onClick={() => setTheme((current) => current === "light" ? "dark" : "light")} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button><button className="primary-button" onClick={() => window.print()}><Download size={16} /> Export PDF</button></div>
      </header>

      <section className="workspace">
        <div className="pane editor-pane">
          <div className="pane-header"><div className="pane-title"><FileText size={15} /> main.tex</div><div className="pane-actions"><span className="language-pill">LaTeX</span><button className="small-button" onClick={() => { setSource(STARTER); window.localStorage.removeItem("latexboi:source"); }} title="Reset document"><RotateCcw size={14} /></button></div></div>
          <div className="editor-wrap"><div className="line-numbers">{source.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div><div className="code-editor"><pre ref={highlightRef} aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlightedSource }} /><textarea wrap="soft" spellCheck={false} value={source} onScroll={(event) => { if (highlightRef.current) { highlightRef.current.scrollTop = event.currentTarget.scrollTop; highlightRef.current.scrollLeft = event.currentTarget.scrollLeft; } }} onChange={(event) => setSource(event.target.value)} aria-label="LaTeX source editor" /></div></div>
          <div className="statusbar"><span><span className="status-dot" /> Ready</span><span>{source.length} characters</span></div>
        </div>

        <div className="divider" />

        <div className="pane preview-pane">
          <div className="pane-header"><div className="pane-title"><Play size={14} fill="currentColor" /> Preview</div><div className="pane-actions"><span className="live-pill"><span className="pulse" /> Live</span></div></div>
          <div className="paper-frame" ref={paperFrameRef}><div className="paper-stack" style={{ zoom: paperScale }}>{pages.map((page, index) => <article className="paper" key={index} aria-label={`Page ${index + 1}`} dangerouslySetInnerHTML={{ __html: page }} />)}</div></div>
          <div className="statusbar preview-status"><span>Rendered just now</span><span>100%</span></div>
        </div>
      </section>
    </main>
  );
}
