// Estimate prose words, omitting preamble, comments, math and metadata.
export function countWords(source: string): number {
  let text = source.replace(/(\\*)%[^\n]*/g, (match, slashes: string) => slashes.length % 2 ? match : slashes);
  if (text.includes("\\begin{document}")) text = text.split("\\begin{document}")[1];
  text = text.split("\\end{document}")[0]
    .replace(/\\begin\{(equation\*?|align\*?|alignat\*?|lstlisting|verbatim|tikzpicture)\}[\s\S]*?\\end\{\1\}/g, " ")
    .replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]*\$/g, " ")
    .replace(/\\(?:begin|end|label|ref|eqref|cite|url|includegraphics|bibliography|bibliographystyle)\*?(?:\[[^\]]*\])?\{[^}]*\}/g, " ")
    .replace(/\\href\{[^}]*\}/g, "")
    .replace(/\\[a-zA-Z@]+\*?(?:\[[^\]]*\])?/g, " ")
    .replace(/\\[^a-zA-Z]/g, " ");
  return text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}
