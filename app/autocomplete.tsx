"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { completionContext, expandCompletion, findCompletions } from "./completions";

type Menu = { start: number; end: number; query: string; left: number; top: number; height: number };

export default function Autocomplete({ textarea, onApply }: { textarea: RefObject<HTMLTextAreaElement | null>; onApply: (value: string) => void }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [selected, setSelected] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const applying = useRef(false);
  const items = menu ? findCompletions(menu.query) : [];
  const current = useRef({ menu, items, selected, onApply });
  current.current = { menu, items, selected, onApply };

  function accept(index: number) {
    const el = textarea.current;
    const state = current.current;
    const item = state.items[index];
    if (!el || !state.menu || !item) return;
    const context = completionContext(el.value, el.selectionStart, el.selectionEnd);
    if (!context || context.start !== state.menu.start || context.end !== state.menu.end) { setMenu(null); return; }
    const lineStart = el.value.lastIndexOf("\n", context.start - 1) + 1;
    const indent = /^\s*/.exec(el.value.slice(lineStart, context.start))?.[0] ?? "";
    const snippet = expandCompletion(item, indent);
    el.focus();
    el.setSelectionRange(context.start, context.end);
    // Native insertion preserves the textarea's undo stack where supported.
    applying.current = true;
    if (!document.execCommand("insertText", false, snippet.text)) el.setRangeText(snippet.text, context.start, context.end, "end");
    applying.current = false;
    current.current.onApply(el.value);
    el.setSelectionRange(context.start + snippet.cursor, context.start + snippet.cursor);
    setMenu(null);
  }

  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    let frame = 0;
    let composing = false;
    const close = () => setMenu(null);
    const update = () => {
      if (composing) return;
      const context = completionContext(el.value, el.selectionStart, el.selectionEnd);
      if (!context || !findCompletions(context.query).length) { close(); return; }
      const style = getComputedStyle(el);
      const mirror = document.createElement("div");
      Object.assign(mirror.style, { position: "fixed", visibility: "hidden", whiteSpace: "pre", font: style.font, letterSpacing: style.letterSpacing, tabSize: style.tabSize });
      mirror.textContent = el.value.slice(0, el.selectionStart);
      const caret = document.createElement("span");
      caret.textContent = "\u200b";
      mirror.appendChild(caret);
      document.body.appendChild(mirror);
      const x = caret.offsetLeft + parseFloat(style.paddingLeft) - el.scrollLeft;
      const y = caret.offsetTop + parseFloat(style.paddingTop) - el.scrollTop;
      mirror.remove();
      const height = Math.min(260, el.clientHeight - 12);
      if (x < 0 || y < 0 || y > el.clientHeight || height < 70) { close(); return; }
      const top = y + 25 + height <= el.clientHeight ? y + 25 : Math.max(6, y - height);
      setMenu({ ...context, left: Math.max(6, Math.min(x, el.clientWidth - 346)), top, height });
      setSelected(0);
    };
    const schedule = () => { if (applying.current) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const keydown = (event: KeyboardEvent) => {
      if (event.isComposing || composing) return;
      const state = current.current;
      if (!state.menu || !state.items.length) return;
      if (["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) {
        event.preventDefault();
        if (event.key === "Escape") close();
        else if (event.key === "ArrowDown" || event.key === "ArrowUp") setSelected((value) => (value + (event.key === "ArrowDown" ? 1 : -1) + state.items.length) % state.items.length);
        else accept(state.selected);
      } else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) close();
    };
    const start = () => { composing = true; close(); };
    const end = () => { composing = false; schedule(); };
    el.addEventListener("input", schedule);
    el.addEventListener("keydown", keydown);
    el.addEventListener("blur", close);
    el.addEventListener("click", close);
    el.addEventListener("scroll", close);
    el.addEventListener("compositionstart", start);
    el.addEventListener("compositionend", end);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("input", schedule); el.removeEventListener("keydown", keydown);
      el.removeEventListener("blur", close); el.removeEventListener("click", close); el.removeEventListener("scroll", close);
      el.removeEventListener("compositionstart", start); el.removeEventListener("compositionend", end);
    };
  }, [textarea]);

  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.setAttribute("aria-autocomplete", "list");
    if (menu && items.length) {
      el.setAttribute("aria-controls", "latex-completions");
      el.setAttribute("aria-activedescendant", `latex-option-${selected}`);
      list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    } else {
      el.removeAttribute("aria-controls"); el.removeAttribute("aria-activedescendant");
    }
  }, [menu, selected, items.length, textarea]);

  if (!menu || !items.length) return null;
  return <div className="completion-popup" style={{ left: menu.left, top: menu.top, maxHeight: menu.height }} onMouseDown={event => event.preventDefault()}>
    <div ref={list} id="latex-completions" role="listbox" aria-label="LaTeX commands" className="completion-list">
      {items.map((item, index) => <div key={item.label} id={`latex-option-${index}`} role="option" aria-selected={index === selected} onMouseDown={event => { event.preventDefault(); accept(index); }} className="completion-option">
        <code>\{item.label}</code><span>{item.description}</span>
      </div>)}
    </div>
  </div>;
}
