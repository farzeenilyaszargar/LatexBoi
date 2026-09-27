"use client";

import { useEffect, useRef } from "react";
import { Palette, Check } from "lucide-react";

export const THEMES = [
  { id: "light-green", name: "Light Green", note: "White & soft sage", colors: ["#f6f8f7", "#ffffff", "#24704f"] },
  { id: "dark-green", name: "Dark Green", note: "Charcoal & muted mint", colors: ["#171b1a", "#222825", "#90c9ad"] },
  { id: "dark-academia", name: "Dark Academia", note: "Espresso & antique gold", colors: ["#201d19", "#2b2722", "#d8bb85"] },
  { id: "light-academia", name: "Light Academia", note: "Paper white & scholarly blue", colors: ["#f6f7f9", "#ffffff", "#356ae6"] },
] as const;
export type Theme = typeof THEMES[number]["id"];
export function savedTheme(value: string | null): Theme {
  if (value === "light") return "light-green";
  if (value === "dark") return "dark-green";
  return THEMES.find(theme => theme.id === value)?.id ?? "light-academia";
}

export default function ThemePicker({ theme, choose }: { theme: Theme; choose: (theme: Theme) => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const outside = (event: globalThis.PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) ref.current.open = false;
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return <details ref={ref} className="theme-picker" onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); if (ref.current) ref.current.open = false; ref.current?.querySelector("summary")?.focus(); }
  }}>
    <summary className="icon-button theme-button" title="Choose theme" aria-label="Choose theme"><Palette size={16} /></summary>
    <fieldset className="theme-menu">
      <legend>Appearance</legend>
      {THEMES.map(item => <label key={item.id} className="theme-option">
        <input type="radio" name="appearance" value={item.id} checked={theme === item.id} onChange={() => choose(item.id)} />
        <span className="theme-swatches" aria-hidden="true">{item.colors.map(color => <i key={color} style={{ background: color }} />)}</span>
        <span><strong>{item.name}</strong><small>{item.note}</small></span>
        {theme === item.id && <Check size={14} aria-hidden="true" />}
      </label>)}
    </fieldset>
  </details>;
}
