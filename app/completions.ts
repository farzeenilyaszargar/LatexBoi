export type Completion = { label: string; description: string; template: string };
// The | marker is the cursor destination, removed before insertion.
const command = (label: string, description: string, template = `\\${label}{|}`): Completion => ({ label, description, template });
export const commands: Completion[] = [
  command("section", "Section heading"), command("subsection", "Subsection heading"),
  command("subsubsection", "Smaller heading"), command("textbf", "Bold text"),
  command("textit", "Italic text"), command("emph", "Emphasized text"),
  command("underline", "Underlined text"), command("texttt", "Monospace text"),
  command("textsc", "Small capitals"), command("title", "Document title"),
  command("author", "Author names"), command("date", "Document date"),
  command("documentclass", "Document type", "\\documentclass{|article}"),
  command("usepackage", "Load a package"), command("begin", "Begin an environment"),
  command("end", "End an environment"), command("frac", "Fraction: numerator / denominator", "\\frac{|}{}"),
  command("sqrt", "Square root"), command("href", "Link URL and text", "\\href{|}{}"),
  command("url", "Web address"), command("cite", "Cite a reference"),
  command("label", "Name a reference target"), command("ref", "Reference a label"),
  command("footnote", "Footnote text"), command("caption", "Figure or table caption"),
  command("includegraphics", "Insert an image", "\\includegraphics[width=\\linewidth]{|}"),
  command("item", "List item", "\\item |"), command("maketitle", "Render the title", "\\maketitle|"),
  command("tableofcontents", "Contents list", "\\tableofcontents|"),
  command("newpage", "Start a new page", "\\newpage\n|"),
  command("clearpage", "Flush floats and start a page", "\\clearpage\n|"),
  command("noindent", "Suppress paragraph indentation", "\\noindent |"),
  command("centering", "Center the current block", "\\centering\n|"),
  command("text", "Text inside mathematics"), command("mathbf", "Bold math symbols"),
  command("mathrm", "Upright math text"), command("mathbb", "Blackboard bold symbols"),
  command("overline", "Line above an expression"), command("hat", "Hat accent"), command("vec", "Vector accent"),
  command("sum", "Summation with bounds", "\\sum_{|}^{ }"),
  command("int", "Integral with bounds", "\\int_{|}^{ }"),
  command("lim", "Limit", "\\lim_{|}"),
  ...["alpha", "beta", "gamma", "delta", "epsilon", "theta", "lambda", "mu", "pi", "rho", "sigma", "tau", "phi", "psi", "omega", "Gamma", "Delta", "Theta", "Lambda", "Sigma", "Phi", "Psi", "Omega", "infty", "partial", "nabla", "times", "cdot", "pm", "leq", "geq", "neq", "approx", "equiv", "in", "notin", "subset", "subseteq", "cup", "cap", "forall", "exists", "rightarrow", "leftarrow", "Rightarrow", "leftrightarrow", "sin", "cos", "tan", "log", "ln", "exp", "quad", "qquad", "today", "LaTeX"].map(label => command(label, "Math symbol or standard LaTeX command", `\\${label}|`)),
  ...["document", "abstract", "itemize", "enumerate", "equation", "equation*", "align", "align*", "center", "quote", "figure", "table", "tabular", "bmatrix", "pmatrix", "cases", "verbatim"].map(env => command(`begin{${env}}`, `${env} environment`, `\\begin{${env}}${env === "tabular" ? "{ll}" : ""}\n  ${["itemize", "enumerate"].includes(env) ? "\\item " : ""}|\n\\end{${env}}`)),
];

export function completionContext(source: string, start: number, end = start) {
  if (start !== end) return null;
  const line = source.slice(source.lastIndexOf("\n", start - 1) + 1, start);
  if (/(^|[^\\])(?:\\\\)*%/.test(line)) return null;
  const match = /(?:^|[^\\])((?:\\\\)*)(\\([a-zA-Z]*(?:\{[a-zA-Z*]*)?))$/.exec(line);
  if (!match) return null;
  return { start: start - match[2].length, end: start, query: match[3] };
}

export function findCompletions(query: string) {
  const lower = query.toLowerCase();
  return commands.filter(item => item.label.toLowerCase().startsWith(lower))
    .sort((a, b) => Number(b.label.startsWith(query)) - Number(a.label.startsWith(query)));
}

export function expandCompletion(item: Completion, indent = "") {
  const template = item.template.replace(/\n/g, `\n${indent}`);
  const cursor = template.indexOf("|");
  return { text: template.replace("|", ""), cursor: cursor < 0 ? template.length : cursor };
}
