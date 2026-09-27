"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";

export default function FindReplace({ source, textarea, apply, close }: {
  source: string; textarea: RefObject<HTMLTextAreaElement | null>;
  apply: (start: number, end: number, text: string) => void; close: () => void;
}) {
  const [query, setQuery] = useState(() => {
    const el = textarea.current;
    return el ? el.value.slice(el.selectionStart, el.selectionEnd) : "";
  });
  const [replacement, setReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const haystack = matchCase ? source : source.toLowerCase();
  const needle = matchCase ? query : query.toLowerCase();
  const matches: number[] = [];
  if (needle) for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, at + needle.length)) matches.push(at);
  useEffect(() => { input.current?.focus(); input.current?.select(); }, []);

  function find(direction: number) {
    const el = textarea.current;
    if (!el || !matches.length) return;
    const position = direction > 0 ? el.selectionEnd : el.selectionStart;
    let index = direction > 0 ? matches.findIndex(at => at >= position) : matches.findLastIndex(at => at < position);
    if (index < 0) index = direction > 0 ? 0 : matches.length - 1;
    const at = matches[index];
    el.focus();
    el.setSelectionRange(at, at + query.length);
    const style = getComputedStyle(el);
    el.scrollTop = Math.max(0, source.slice(0, at).split("\n").length * parseFloat(style.lineHeight) - el.clientHeight / 2);
    const canvas = document.createElement("canvas").getContext("2d");
    if (canvas) {
      canvas.font = style.font;
      el.scrollLeft = Math.max(0, canvas.measureText(source.slice(source.lastIndexOf("\n", at - 1) + 1, at)).width - el.clientWidth / 2);
    }
    el.dispatchEvent(new Event("scroll"));
    setActive(index);
  }

  function replaceOne() {
    const el = textarea.current;
    if (!el || !query) return;
    if (matches.includes(el.selectionStart) && el.selectionEnd - el.selectionStart === query.length) {
      apply(el.selectionStart, el.selectionEnd, replacement);
      setActive(-1);
    } else find(1);
  }

  function replaceAll() {
    if (!matches.length) return;
    let result = source;
    for (const at of [...matches].reverse()) result = result.slice(0, at) + replacement + result.slice(at + query.length);
    apply(0, source.length, result);
    setActive(-1);
  }

  return <div className="find-bar" role="search" aria-label="Find and replace" onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); close(); textarea.current?.focus(); }
    if (event.key === "Enter") { event.preventDefault(); find(event.shiftKey ? -1 : 1); }
  }}>
    <div className="tool-row">
      <input ref={input} aria-label="Find text" placeholder="Find text" value={query} onChange={event => { setQuery(event.target.value); setActive(-1); }} />
      <span role="status">{active >= 0 && active < matches.length ? `${active + 1} / ` : ""}{matches.length} matches</span>
      <button className="small-button" aria-label="Previous match" onClick={() => find(-1)} disabled={!matches.length}><ArrowUp size={14} /></button>
      <button className="small-button" aria-label="Next match" onClick={() => find(1)} disabled={!matches.length}><ArrowDown size={14} /></button>
      <button className="small-button" aria-label="Close find" onClick={() => { close(); textarea.current?.focus(); }}><X size={14} /></button>
    </div>
    <div className="tool-row">
      <input aria-label="Replace with" placeholder="Replace with" value={replacement} onChange={event => setReplacement(event.target.value)} />
      <button className="small-button" disabled={!matches.length} onClick={replaceOne}>Replace</button>
      <button className="small-button" disabled={!matches.length} onClick={replaceAll}>All</button>
      <label><input type="checkbox" checked={matchCase} onChange={event => { setMatchCase(event.target.checked); setActive(-1); }} /> Match case</label>
    </div>
  </div>;
}
