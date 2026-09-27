export type TextEdit = { start: number; end: number; text: string; selectionStart: number; selectionEnd: number };

export function formatEdit(source: string, start: number, end: number, command: "textbf" | "textit"): TextEdit {
  const prefix = "\\" + command + "{";
  return { start, end, text: prefix + source.slice(start, end) + "}", selectionStart: start + prefix.length, selectionEnd: end + prefix.length };
}

export function commentEdit(source: string, start: number, end: number): TextEdit {
  const first = source.lastIndexOf("\n", start - 1) + 1;
  const probe = Math.max(start, end - (end > start ? 1 : 0));
  const newline = source.indexOf("\n", probe);
  const last = newline < 0 ? source.length : newline;
  const lines = source.slice(first, last).split("\n");
  const uncomment = lines.filter(line => line.trim()).every(line => /^\s*%/.test(line)) && lines.some(line => line.trim());
  let offset = first;
  const changes: { at: number; removed: number; added: number }[] = [];
  const text = lines.map(line => {
    const indent = /^\s*/.exec(line)![0].length;
    const remove = uncomment ? (/^% ?/.exec(line.slice(indent))?.[0].length ?? 0) : 0;
    changes.push({ at: offset + indent, removed: remove, added: uncomment ? 0 : 2 });
    offset += line.length + 1;
    return line.slice(0, indent) + (uncomment ? "" : "% ") + line.slice(indent + remove);
  }).join("\n");
  const map = (position: number) => changes.reduce((next, change) => {
    if (position < change.at) return next;
    return next + change.added - Math.min(change.removed, position - change.at);
  }, position);
  return { start: first, end: last, text, selectionStart: map(start), selectionEnd: map(end) };
}

export function bracketEdit(source: string, start: number, end: number, key: string): TextEdit | null {
  const line = source.slice(source.lastIndexOf("\n", start - 1) + 1, start);
  if (/(^|[^\\])(?:\\\\)*%/.test(line)) return null;
  const escaped = (source.slice(0, start).match(/\\+$/)?.[0].length ?? 0) % 2 === 1;
  if (escaped) return null;
  const pairs: Record<string, string> = { "{": "}", "[": "]", "(": ")" };
  if (pairs[key] && (start !== end || !source[start] || /[\s}\])]/.test(source[start]))) {
    return { start, end, text: key + source.slice(start, end) + pairs[key], selectionStart: start + 1, selectionEnd: end + 1 };
  }
  if (start === end && "}])".includes(key) && source[start] === key)
    return { start, end, text: "", selectionStart: start + 1, selectionEnd: start + 1 };
  if (key === "Backspace" && start === end && pairs[source[start - 1]] === source[start] && source[start])
    return { start: start - 1, end: end + 1, text: "", selectionStart: start - 1, selectionEnd: start - 1 };
  return null;
}
