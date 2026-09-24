"use client";

import { useMemo, useState } from "react";
import { Copy, Download, FileText, Play, RotateCcw, Sparkles } from "lucide-react";
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

function renderInline(text: string) {
  return text.replace(/\\\((.+?)\\\)/g, (_, formula) => {
    try { return katex.renderToString(formula, { throwOnError: false }); } catch { return formula; }
  });
}

function renderLatex(source: string) {
  const body = source
    .replace(/\\documentclass(?:\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\usepackage(?:\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\title\{([^}]*)\}/g, '<h1>$1</h1>')
    .replace(/\\author\{([^}]*)\}/g, '<p class="author">$1</p>')
    .replace(/\\maketitle/g, "")
    .replace(/\\section\{([^}]*)\}/g, '<h2>$1</h2>')
    .replace(/\\subsection\{([^}]*)\}/g, '<h3>$1</h3>')
    .replace(/\\begin\{document\}|\\end\{document\}/g, "")
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => {
      try { return `<div class="math-display">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`; } catch { return `<pre>${formula}</pre>`; }
    })
    .replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (_, formula) => {
      try { return `<div class="math-display">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`; } catch { return `<pre>${formula}</pre>`; }
    });

  return body.split(/\n\s*\n/).map((block) => {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("<h")) return trimmed;
    return `<p>${renderInline(trimmed).replace(/\n/g, "<br />")}</p>`;
  }).join("");
}

export default function Editor() {
  const [source, setSource] = useState(STARTER);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => renderLatex(source), [source]);

  async function copySource() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Sparkles size={15} strokeWidth={2.5} /></span><span>LatexBoi</span></div>
        <div className="topbar-center"><span className="dot" /> Untitled document <span className="saved">Saved locally</span></div>
        <div className="topbar-actions"><button className="icon-button" onClick={copySource} title="Copy source"><Copy size={16} />{copied ? "Copied" : "Copy"}</button><button className="primary-button"><Download size={16} /> Export PDF</button></div>
      </header>

      <section className="workspace">
        <div className="pane editor-pane">
          <div className="pane-header"><div className="pane-title"><FileText size={15} /> main.tex</div><div className="pane-actions"><span className="language-pill">LaTeX</span><button className="small-button" onClick={() => setSource(STARTER)} title="Reset document"><RotateCcw size={14} /></button></div></div>
          <div className="editor-wrap"><div className="line-numbers">{source.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea spellCheck={false} value={source} onChange={(event) => setSource(event.target.value)} aria-label="LaTeX source editor" /></div>
          <div className="statusbar"><span><span className="status-dot" /> Ready</span><span>{source.length} characters</span></div>
        </div>

        <div className="divider" />

        <div className="pane preview-pane">
          <div className="pane-header"><div className="pane-title"><Play size={14} fill="currentColor" /> Preview</div><div className="pane-actions"><span className="live-pill"><span className="pulse" /> Live</span></div></div>
          <div className="paper-frame"><article className="paper" dangerouslySetInnerHTML={{ __html: html }} /></div>
          <div className="statusbar preview-status"><span>Rendered just now</span><span>100%</span></div>
        </div>
      </section>
      <footer className="footer"><span>Made for focused writing.</span><span>⌘ K <span className="footer-muted">Command menu</span></span></footer>
    </main>
  );
}
