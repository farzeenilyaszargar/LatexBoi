import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_DESCRIPTION } from "./seo";
import { Analytics } from "@vercel/analytics/next";

const ogImagePath = "/unleaf-social.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Unleaf | Write Research Papers With Ease",
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  applicationName: "Unleaf",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: SITE_URL, siteName: "Unleaf", locale: "en_US",
    title: "Unleaf | Write Research Papers With Ease",
    description: "A lightweight, no-login LaTeX workspace for writing, previewing, and exporting research papers.",
    images: [{ url: ogImagePath, width: 1672, height: 941, type: "image/png", alt: "Unleaf — the no-login LaTeX editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unleaf | Write Research Papers With Ease",
    description: "Write, preview, and export research papers with ease. No login required.",
    images: [ogImagePath],
  },
  other: { "twitter:image:alt": "Unleaf — the no-login LaTeX editor" },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/unleaf.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
