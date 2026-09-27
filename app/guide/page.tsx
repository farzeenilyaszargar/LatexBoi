import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { SITE_URL } from "../seo";
import "./guide.css";

const title = "LaTeX Guide | Unleaf";
const description = "Unleaf is a simple no-login LaTeX editor with autocomplete, instant preview, and PDF export.";
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

const twitterUrl = "https://twitter.com/farzeenilya";

export default function Guide() {
  return <main className="guide-shell">
    <nav className="guide-nav" aria-label="Main navigation">
      <Link href="/" className="guide-brand"><img src="/unleaf.svg" width="28" height="28" alt="" />Unleaf</Link>
      <Link href="/" className="guide-button">Open editor <span>→</span></Link>
    </nav>

    <article className="guide-article">
      <h1>Overleaf made LaTeX feel like enterprise software.</h1>
      <p className="guide-lead">So I made Unleaf.</p>

      <div className="guide-points" aria-label="Unleaf principles">
        <p>→ No login.</p>
        <p>→ No workspace.</p>
        <p>→ No clutter.</p>
      </div>

      <p className="guide-copy">Just write LaTeX with <strong>autocomplete</strong>, compile instantly, and get your PDF.</p>

      <p className="guide-credit"><span>Made with</span> <Heart size={14} fill="currentColor" aria-hidden="true" /> <span>by <a href={twitterUrl} target="_blank" rel="noopener noreferrer">@farzeenilya</a></span></p>
    </article>
  </main>;
}
