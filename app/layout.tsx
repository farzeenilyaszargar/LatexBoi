import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LatexBoi | Write Research Papers (Fuck Overleaf)",
  description: "Write and render research papers in a lightweight, login-free LaTeX workspace.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
