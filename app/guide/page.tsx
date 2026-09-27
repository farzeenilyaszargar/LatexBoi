import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "../seo";
import "./guide.css";

const title = "Free Online LaTeX Editor: Research Paper Guide | Unleaf";
const description = "A quick guide to writing research papers with Unleaf, a free no-login LaTeX editor with live preview, autocomplete, and PDF export.";
const ogImagePath = "/unleaf-social.png";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide" },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/guide`,
    type: "article",
    images: [{ url: ogImagePath, width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }],
  },
  twitter: { title, description, card: "summary_large_image", images: [ogImagePath] },
};

const commands = [
  ["Sections", String.raw`\\section{Introduction}`],
  ["Text", String.raw`\\textbf{bold} \\emph{emphasis}`],
  ["Math", String.raw`$E = mc^2$`],
  ["Lists", String.raw`\\begin{itemize} ... \\end{itemize}`],
];

export default function Guide() {
  return <main className="guide-shell">
    <nav className="guide-nav" aria-label="Main navigation">
      <Link href="/" className="guide-brand"><img src="/unleaf.svg" width="28" height="28" alt="" />Unleaf</Link>
      <Link href="/" className="guide-button">Open editor <span>→</span></Link>
    </nav>
    <article className="guide-article">
      <section className="guide-hero">
        <p className="guide-eyebrow">NO ACCOUNT · JUST WRITE</p>
        <h1>Write your paper without the overhead.</h1>
        <p className="guide-lead">Unleaf is a fast, no-login LaTeX editor with live A4 preview, command autocomplete, and PDF export.</p>
        <Link href="/" className="guide-hero-cta">Start writing <span>→</span></Link>
      </section>
      <section className="guide-section" id="start">
        <div className="section-kicker">01 / START</div>
        <div><h2>From blank page to first draft.</h2><p>Open the editor, replace the sample title and author, then write your abstract, keywords, and sections. The preview updates as you type and keeps your paper in A4 pages.</p></div>
      </section>
      <section className="guide-section" id="commands">
        <div className="section-kicker">02 / COMMANDS</div>
        <div><h2>Type a backslash. Keep moving.</h2><p>Autocomplete filters as you type. Use the arrow keys, then press Enter or Tab to insert a command or environment.</p><div className="command-grid">{commands.map(([label, command]) => <div className="command-card" key={label}><span>{label}</span><code>{command}</code></div>)}</div></div>
      </section>
      <section className="guide-section" id="shortcuts">
        <div className="section-kicker">03 / SHORTCUTS</div>
        <div className="shortcut-grid">
          <div><kbd>⌘ / Ctrl</kbd><strong>B</strong><span>Bold selected text</span></div>
          <div><kbd>⌘ / Ctrl</kbd><strong>I</strong><span>Italic selected text</span></div>
          <div><kbd>⌘ / Ctrl</kbd><strong>/</strong><span>Toggle line comments</span></div>
          <div><kbd>⌥ / Alt</kbd><strong>↑ ↓</strong><span>Move lines</span></div>
        </div>
      </section>
      <section className="guide-section" id="export">
        <div className="section-kicker">04 / EXPORT</div>
        <div><h2>Inspect. Then export.</h2><p>Use the page indicator to jump between pages. Drag to pan and use Ctrl/Cmd + scroll to zoom. When your paper is ready, choose Export PDF and save it as A4 with browser headers and footers disabled.</p></div>
      </section>
      <section className="guide-note" id="questions"><strong>Good to know</strong><p>Your draft is saved locally in this browser. Unleaf is a lightweight browser renderer, so advanced packages and custom class files may not render exactly like a full TeX compiler.</p></section>
      <p className="guide-end"><Link href="/" className="guide-button">Open Unleaf <span>→</span></Link></p>
    </article>
  </main>;
}
