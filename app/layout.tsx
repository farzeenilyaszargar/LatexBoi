import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://unleaf.lol"),
  title: "Unleaf | Write Research Papers With Ease",
  description: "Write research papers with ease using Unleaf, a free online LaTeX editor with live preview, local draft saving, and PDF export.",
  applicationName: "Unleaf",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Unleaf", locale: "en_US",
    title: "Unleaf | Write Research Papers With Ease",
    description: "A lightweight, no-login LaTeX workspace for writing, previewing, and exporting research papers.",
    images: [{ url: "/unleaf-social.png", width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unleaf | Write Research Papers With Ease",
    description: "Write, preview, and export research papers with ease. No login required.",
    images: [{ url: "/unleaf-social.png", width: 1672, height: 941, alt: "Unleaf — the no-login LaTeX editor" }],
  },
  icons: {
    icon: { url: "/unleaf.svg", type: "image/svg+xml" },
    shortcut: "/unleaf.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
