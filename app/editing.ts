export type TextEdit = { start: number; end: number; text: string; selectionStart: number; selectionEnd: number };

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
