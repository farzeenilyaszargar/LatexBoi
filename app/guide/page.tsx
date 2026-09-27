import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "../seo";
import "./guide.css";

const title = "Free Online LaTeX Editor: Research Paper Guide | Unleaf";
const description = "Learn to write a research paper in Unleaf: LaTeX commands, abstracts, equations, tables, autocomplete shortcuts, local saving, and PDF export without an account.";
const ogImagePath = "/unleaf-social.png";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/guide" },
  openGraph: { title, description, url: `${SITE_URL}/guide`, type: "article", images: [{ url: ogImagePath, width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }] },
  twitter: { title, description, card: "summary_large_image", images: [ogImagePath] },
};

export default function Guide() {
  return <main className="guide-shell">
    <nav aria-label="Main navigation"><Link href="/" className="guide-brand"><img src="/unleaf.svg" width="28" height="28" alt="" />Unleaf</Link><Link href="/" className="guide-button">Open editor →</Link></nav>
    <article>
      <p className="guide-eyebrow">NO ACCOUNT. JUST WRITE.</p>
      <h1>A simpler way to write research papers in LaTeX</h1>
      <p className="guide-lead">Unleaf is a free online LaTeX editor with command autocomplete, a live paper preview, and PDF export. Open it in your browser and start writing without creating an account.</p>
      <p>Use it for a first paper draft, a short report, or learning common LaTeX commands. A two-page fictional banana research paper gives you a working example of an abstract, keywords, equations, tables, lists, and references.</p>
      <nav aria-label="On this page" className="guide-contents"><a href="#start">Start a paper</a><a href="#commands">Commands and shortcuts</a><a href="#export">Export a PDF</a><a href="#questions">Common questions</a></nav>
      <h2 id="start">Start your research paper</h2>
      <ol><li>Open the editor and replace the sample title and author with your own.</li><li>Write your abstract and keywords, then organize your argument into sections.</li><li>Watch the preview as you edit. Drag the divider to give either pane more space.</li><li>Check every page and use Export PDF when your draft is ready.</li></ol>
      <p>This small example demonstrates a title, an abstract, and a section:</p>
      <pre><code>{String.raw`\documentclass{article}
\title{My Research Paper}
\author{Your Name}
\begin{document}
\maketitle
\begin{abstract}
A short summary of the question, method, and result.
\end{abstract}
\textbf{Keywords:} research, methods, evaluation
\section{Introduction}
Explain your question and why it matters.
\end{document}`}</code></pre>
      <h2 id="commands">LaTeX commands you can use right away</h2>
      <p>Type a backslash in the editor to see suggestions. Keep typing to filter them, use the arrow keys to choose, and press Enter or Tab to insert. Escape closes the menu. Snippets add braces and environment endings and place the cursor inside the next argument.</p>
      <div className="guide-table"><table><caption>Common commands for research papers</caption><thead><tr><th>Purpose</th><th>Example</th></tr></thead><tbody>
        <tr><td>Section heading</td><td><code>{String.raw`\section{Methods}`}</code></td></tr>
        <tr><td>Bold or italic text</td><td><code>{String.raw`\textbf{bold} \emph{emphasis}`}</code></td></tr>
        <tr><td>Inline mathematics</td><td><code>{String.raw`$E = mc^2$`}</code></td></tr>
        <tr><td>Display equation</td><td><code>{String.raw`\[ x = \frac{a}{b} \]`}</code></td></tr>
        <tr><td>Bulleted list</td><td><code>{String.raw`\begin{itemize} \item A finding \end{itemize}`}</code></td></tr>
        <tr><td>Explicit page break</td><td><code>{String.raw`\newpage`}</code></td></tr>
      </tbody></table></div>
      <p>Move a line or selected lines with Option + ↑/↓ on macOS or Alt + ↑/↓ on Windows and Linux. In the preview, drag to pan, scroll to move, and use Ctrl/Cmd + scroll to zoom. The percentage button fits the paper to the pane.</p>
      <p>Select text and press Ctrl/Cmd + B for bold or Ctrl/Cmd + I for italic. With no selection, the cursor lands inside an empty formatting command. Ctrl/Cmd + / toggles comments on the current or selected lines. Opening braces, brackets, and parentheses automatically get a closing partner.</p>
      <p>The editor shows an approximate prose word count, excluding the preamble, comments, and mathematics. Click the preview’s page indicator, type a page number, and press Enter to jump there.</p>
      <h2 id="export">Preview and export your paper as a PDF</h2>
      <p>The preview arranges the document into A4 pages. Use its page indicator to navigate your draft and inspect equations and tables before exporting. Click Export PDF to open your browser’s print dialog, then choose Save as PDF. Use A4 paper, no additional margins, and disable browser headers and footers.</p>
      <p>The paper stays white in both interface themes. If your browser offers background graphics, enable them when your document includes colored blocks. Check the print preview before saving.</p>
      <h2 id="questions">Common questions</h2>
      <h3>Is Unleaf free? Do I need to sign up?</h3><p>Unleaf’s editor is free to use and does not require an account. You can write, preview, and export a document directly in your browser.</p>
      <h3>Where is my draft saved?</h3><p>Your source is saved in local storage in the browser you are using. It is not synced across devices or domains. Clearing site data can remove it. Use Copy source to keep a separate copy of important work; private browsing or storage restrictions can prevent persistent saving.</p>
      <h3>Can I use every LaTeX package?</h3><p>Unleaf currently uses a browser-based renderer for common LaTeX structures and mathematics. It is not a full TeX compiler: arbitrary packages, custom class files, and advanced document layouts may not render faithfully. Check your target journal’s requirements before using the output for a submission.</p>
      <h3>Is Unleaf an Overleaf alternative?</h3><p>Unleaf offers a lightweight workflow for people who want a no-login editor, immediate preview, and PDF export. It does not currently provide collaborative editing, cloud projects, or full TeX package compatibility. Unleaf is an independent project and is not affiliated with Overleaf.</p>
      <h3>Does autocomplete support every command?</h3><p>Suggestions cover common headings, text formatting, mathematics, references, and environments. You can also type commands manually. A suggestion helps enter syntax; it does not guarantee that every package-dependent command is supported by the preview.</p>
      <p className="guide-end"><Link href="/" className="guide-button">Start writing in Unleaf →</Link></p>
    </article>
  </main>;
}
