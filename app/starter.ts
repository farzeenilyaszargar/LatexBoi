export const STARTER = String.raw`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}

% Replace the title and author details with your own.
% Type a backslash to explore command suggestions.
\title{Your Research Paper Title}
\author{Your Name \\ Department, University or Institution}
\date{}

\begin{document}
\maketitle

\begin{abstract}
Summarize your study in one concise paragraph. Introduce the problem, explain why it matters, and describe the approach you used to investigate it. Then state your main finding and its implications. A useful abstract should make sense on its own: avoid unexplained abbreviations and detailed citations. Replace this guidance with a summary of your actual work after you have written the rest of the paper.
\end{abstract}

\noindent
\textbf{Keywords:} research topic, method, application, evaluation

\section{Introduction}
Introduce the broader topic and the specific problem your paper addresses. Explain who is affected, why the problem is worth studying, and what remains unknown. Move from the general context toward a clear statement of the gap your work aims to fill.

State the purpose of your study in a sentence or two. Explain what your work contributes, without claiming results that you have not demonstrated. End the introduction by briefly describing how the rest of the paper is organized.

\subsection{Research Question}
Write a focused question that your study can answer. Identify the system, population, or setting you are studying and the outcome you intend to measure. If appropriate, add a testable hypothesis and explain what evidence would support or challenge it.

\section{Related Work}
Describe the most relevant previous approaches and findings. Organize the discussion around ideas or methods rather than listing papers one by one. Explain where earlier studies agree, where they differ, and which limitations motivate your approach.

Add citations to the sources you discuss. Make the distinction between established findings and your own interpretation clear, and explain how the present study extends or tests the existing evidence.

\section{Methodology}
Describe the study design, materials, and procedure in enough detail for another researcher to understand and reproduce your work. Explain why you selected this approach and identify any assumptions that could influence the results.

\subsection{Data and Procedure}
Specify how data were collected or selected, the inclusion criteria, and the size of the sample. Describe preprocessing steps and the order of the experiment. Record relevant settings, tools, and controls so that the procedure can be repeated.

% This deliberate break keeps the starter organized into two pages.
% Remove it when you prefer automatic pagination for your finished paper.
\newpage

\section{Results}
Present the observations that answer your research question. Begin with the main result, then report supporting measurements in a logical order. Keep this section focused on what was observed; reserve broader explanations and implications for the discussion.

\subsection{Evaluation}
Define your evaluation criteria before comparing outcomes. Report units, sample sizes, and uncertainty where relevant. If you compare multiple methods, apply the same evaluation procedure to each and explain any exceptions.

For example, the mean of a set of measurements can be written as:
\[
  \bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
\]
Here, $n$ is the number of observations and $x_i$ is the value of observation $i$. Replace this illustrative equation with the expressions relevant to your study, and define every symbol when it first appears.

\section{Discussion}
Interpret your findings in relation to the research question and previous work. Explain what the results suggest, which alternative explanations remain plausible, and whether the evidence supports the original hypothesis. Separate evidence from speculation.

Consider the practical or theoretical implications of the study. Describe the situations in which your findings may be useful and the conditions under which they may not apply. Avoid generalizing beyond the data you collected.

\subsection{Limitations}
Identify the main sources of uncertainty, possible bias, and constraints of the study. These might include a small sample, a restricted setting, measurement error, or assumptions in the analysis. Explain how each limitation affects the interpretation of your findings.

\section{Conclusion}
Return to the problem introduced at the beginning and summarize the answer your study provides. Highlight the main contribution in clear language. Do not introduce new evidence here; draw together the conclusions supported by the results.

Suggest one or two specific directions for future work. Explain which remaining question is most useful to investigate next and how a follow-up study could address it.

\section*{Acknowledgments}
Thank the people, institutions, or funding sources that supported the work, where applicable. Remove this section if it is not needed.

\section*{References}
Replace this paragraph with the sources cited in your paper. Follow the citation style required by your journal, conference, or institution, and check that every citation has a corresponding reference entry.

\end{document}`;
