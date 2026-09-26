export function moveLines(source: string, selectionStart: number, selectionEnd: number, direction: -1 | 1) {
  const lines = source.split("\n");
  const startLine = source.slice(0, selectionStart).split("\n").length - 1;
  const endProbe = Math.max(selectionStart, selectionEnd - (selectionEnd > selectionStart ? 1 : 0));
  const endLine = source.slice(0, endProbe).split("\n").length - 1;
  const targetLine = direction < 0 ? startLine - 1 : endLine + 1;
  if (targetLine < 0 || targetLine >= lines.length) return null;

  const block = lines.splice(startLine, endLine - startLine + 1);
  const insertion = direction < 0 ? startLine - 1 : startLine + 1;
  lines.splice(insertion, 0, ...block);
  const next = lines.join("\n");
  const oldStart = lines.slice(0, insertion).join("\n").length + (insertion ? 1 : 0);
  const movedStart = lines.indexOf(block[0], insertion);
  const newStart = lines.slice(0, movedStart).join("\n").length + (movedStart ? 1 : 0);
  const delta = newStart - (source.slice(0, selectionStart).lastIndexOf("\n") + 1);
  return { source: next, selectionStart: selectionStart + delta, selectionEnd: selectionEnd + delta };
}
