"use client";

import { useEffect, useRef, useState } from "react";

export default function PageJump({ page, total, jump }: { page: number; total: number; jump: (page: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(page));
  const input = useRef<HTMLInputElement>(null);
  const cancelled = useRef(false);
  useEffect(() => { if (editing) { input.current?.focus(); input.current?.select(); } }, [editing]);

  function submit() {
    if (!cancelled.current && value.trim() && Number.isInteger(Number(value))) jump(Math.min(total, Math.max(1, Number(value))));
    setEditing(false);
  }

  return editing ? <span className="page-indicator">Page <input ref={input} className="page-jump-input" type="number" min={1} max={total} aria-label="Go to page" value={value} onChange={event => setValue(event.target.value)} onBlur={submit} onKeyDown={event => {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      cancelled.current = event.key === "Escape";
      event.currentTarget.blur();
    }
  }} /> of {total}</span> : <button className="page-indicator page-jump-button" title="Jump to page" aria-label={`Page ${page} of ${total}. Jump to page`} onClick={() => { cancelled.current = false; setValue(String(page)); setEditing(true); }}>Page {page} of {total}</button>;
}
