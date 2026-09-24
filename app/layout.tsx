import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LatexBoi — Write. Render. Repeat.",
  description: "A fast, focused LaTeX writing space.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
