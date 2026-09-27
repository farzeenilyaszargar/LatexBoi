// Prose count, not a TeX compiler: custom macros are not expanded.
export function proseText(input: string): string {
  const source = input.replace(/\\[\s\S]|%[^\n]*(?:\n|$)/g, token => token.startsWith("%") ? "" : token);
  let i = 0;
  const group = (open = "{", close = "}") => {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (source[i] !== open) return "";
    const start = ++i;
    let depth = 1;
    while (i < source.length) {
      if (source[i] === "\\") { i += 2; continue; }
      if (source[i] === open) depth++;
      if (source[i] === close && --depth === 0) return source.slice(start, i++);
      i++;
    }
    return source.slice(start);
  };
  const options = () => {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (source[i] === "[") group("[", "]");
  };
  const ignored: Record<string, number> = {
    documentclass: 1, usepackage: 1, label: 1, ref: 1, eqref: 1, pageref: 1,
    cite: 1, citep: 1, citet: 1, autocite: 1, parencite: 1, nocite: 1,
    url: 1, includegraphics: 1, bibliography: 1, bibliographystyle: 1, bibitem: 1,
    hspace: 1, vspace: 1, setlength: 2, addtolength: 2, color: 1,
    newcommand: 2, renewcommand: 2, providecommand: 2, newenvironment: 3,
    renewenvironment: 3, newtheorem: 2, definecolor: 3, rule: 2,
    input: 1, include: 1, multicolumn: 2, multirow: 2, textcolor: 1,
    href: 1, fontsize: 2, geometry: 1, pagestyle: 1
  };
  const titles: Record<string, string> = {};
  let body = !/\\begin\s*\{document\}/.test(source);
  let out = "";
  while (i < source.length) {
    const char = source[i++];
    if (char === "$") {
      const delimiter = source[i] === "$" ? "$$" : "$";
      if (delimiter.length === 2) i++;
      while (i < source.length) {
        if (source[i] === "\\") { i += 2; continue; }
        if (source.startsWith(delimiter, i)) { i += delimiter.length; break; }
        i++;
      }
      if (body) out += " ";
      continue;
    }
    if (char !== "\\") {
      if (body) out += /[{}]/.test(char) ? "" : /[~&]/.test(char) ? " " : char;
      continue;
    }
    const command = /^[a-zA-Z@]+/.exec(source.slice(i))?.[0];
    if (!command) {
      const symbol = source[i++];
      if (symbol === "(" || symbol === "[") {
        const end = source.indexOf("\\" + (symbol === "(" ? ")" : "]"), i);
        i = end < 0 ? source.length : end + 2;
        if (body) out += " ";
      } else if (body) out += symbol === "\\" ? " " : symbol ?? "";
      continue;
    }
    i += command.length;
    if (source[i] === "*") i++;
    if (command === "verb") {
      const delimiter = source[i++];
      const end = source.indexOf(delimiter, i);
      i = end < 0 ? source.length : end + 1;
      continue;
    }
    options();
    if (command === "begin" || command === "end") {
      const env = group();
      if (env === "document") { if (command === "end") break; body = true; continue; }
      if (command === "begin" && /^(equation|align|alignat|gather|multline|displaymath|math|eqnarray|matrix|[bpvBV]matrix|aligned|cases|tikzpicture|lstlisting|verbatim|comment)\*?$/.test(env)) {
        const closing = "\\end{" + env + "}";
        const end = source.indexOf(closing, i);
        i = end < 0 ? source.length : end + closing.length;
      } else if (command === "begin") {
        options();
        if (["tabular", "array", "thebibliography", "multicols", "minipage"].includes(env)) group();
        if (["tabularx", "tabular*"].includes(env)) { group(); group(); }
      }
      if (body) out += " ";
      continue;
    }
    if (["title", "author", "date"].includes(command)) { titles[command] = group(); continue; }
    if (command === "maketitle") {
      if (body) out += " " + proseText((titles.title ?? "") + " " + (titles.author ?? "")) + " ";
      continue;
    }
    if (command in ignored) {
      for (let n = 0; n < ignored[command]; n++) { options(); group(); }
      continue;
    }
    if (body && /^(section|subsection|subsubsection|paragraph|item|par|newline|newpage|clearpage|quad|qquad)$/.test(command)) out += " ";
    if (body && /^(LaTeX|TeX)$/.test(command)) out += command;
  }
  return out;
}

export function countWords(source: string): number {
  return proseText(source).match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}
