import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://unleaf.lol"),
  title: "Unleaf — Free Online LaTeX Editor, No Login",
  description: "Write research papers with Unleaf, a free online LaTeX editor with live preview, local draft saving, and PDF export. No account. Just write.",
  applicationName: "Unleaf",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Unleaf", locale: "en_US",
    title: "Unleaf — Less overhead. More paper.",
    description: "A lightweight, no-login LaTeX workspace. Write, preview, export. No account. Just write.",
    images: [{ url: "/unleaf-social.png", width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unleaf — Free Online LaTeX Editor",
    description: "Less overhead. More paper. Write LaTeX with live preview and PDF export—no login required.",
    images: [{ url: "/unleaf-social.png", width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }],
  },
  icons: {
    icon: { url: "/unleaf.svg", type: "image/svg+xml" },
    shortcut: "/unleaf.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
