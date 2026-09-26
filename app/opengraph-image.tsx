import { ImageResponse } from "next/og";

export const alt = "Unleaf — Less overhead. More paper. Free online LaTeX editor.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f4faf5", color: "#123e29" }}>
      <div style={{ display: "flex", fontSize: 42, fontWeight: 700, color: "#137547" }}>unleaf.lol</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, letterSpacing: -3 }}><span>Less overhead.</span><span>More paper.</span></div>
      <div style={{ display: "flex", fontSize: 27, color: "#486451" }}>LaTeX editor · Live preview · PDF export · No login</div>
    </div>, size,
  );
}
