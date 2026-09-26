export const STARTER = String.raw`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}
\usepackage{booktabs}
\usepackage{hyperref}

% Welcome to Unleaf! This is a fictional demonstration paper.
% Type a backslash to explore autocomplete. Edit anything.
\title{A-Peeling Results: The Banana Productivity Paradox}
\author{Dr. Penny Peel \\ Institute of Extremely Convenient Conclusions}
\date{}

\begin{document}
\maketitle

\begin{abstract}
Can a banana improve academic productivity, or does it merely improve the appearance of a desk? We conducted an entirely fictional study of twelve imaginary researchers, three banana conditions, and one suspiciously empty fruit bowl. Yellow bananas increased snack satisfaction, green bananas encouraged patience, and overripe bananas produced a statistically impressive quantity of banana bread. We conclude that fruit is useful, but it cannot write your literature review.
\end{abstract}

\noindent
\textbf{Keywords:} bananas, productivity, snack science, questionable methodology

\section{Introduction}
The modern researcher faces three obstacles: difficult questions, approaching deadlines, and remembering where lunch went. The banana offers an elegant response to the third. It arrives in its own packaging, requires no charger, and has never requested a software update.

Previous fictional work suggests that keeping a banana beside a laptop creates the \emph{impression of preparedness} \cite{peel}. Our question is simpler: does the banana help us work, or do we just enjoy having a curved yellow colleague?

\section{Methods}
\label{methods}
Twelve imaginary volunteers completed the same writing task. Each received a laptop, a blank document, and a banana with no relevant qualifications. The protocol had three steps:
\begin{enumerate}
\item Place the banana within respectful conversational distance.
\item Write for twenty minutes without checking the fruit for notifications.
\item Record words written, snacks consumed, and excuses invented.
\end{enumerate}

\subsection{The Peel Productivity Index}
We defined a deliberately unserious score:
\[
  P = \frac{w + 10s}{1 + d}
\]
Here, $w$ is the number of words written, $s$ counts satisfying snacks, and $d$ counts distractions. The coefficient $10$ was chosen because it looked confident. All measurements were stored in \texttt{banana.csv}; none should guide real decisions.

\subsection{Controls}
\begin{itemize}
\item \textbf{Green:} a promising snack scheduled for next Thursday.
\item \textbf{Yellow:} ready to eat and unwilling to attend meetings.
\item \textbf{Spotted:} one missed deadline away from becoming bread.
\end{itemize}

% A deliberate break keeps this demonstration on two pages.
% Remove it to let your own paper paginate automatically.
\newpage

\section{Results}
The yellow condition produced the highest fictional writing total. The spotted condition produced the best afternoon. Table entries below are invented demonstration data, not experimental evidence.

\begin{tabular}{lrr}
\toprule
Condition & Words written & Snacks consumed \\
\midrule
Green & 240 & 0 \\
Yellow & 420 & 1 \\
Spotted & 180 & 2 \\
\bottomrule
\end{tabular}

Compared with green bananas, the yellow condition increased imaginary word count by $75\%$. This sounds excellent until one remembers that we invented both numbers. The spotted group submitted fewer words but attached a recipe \cite{crumb}, which the review committee accepted as supplementary material.

\section{Discussion}
The procedure in Section \ref{methods} cannot separate the effect of a banana from the effect of finally taking a break. Nevertheless, the results support one practical observation: a snack is often more helpful than a fourth rearrangement of your document title.

\begin{quote}
The banana did not solve my research problem, but it listened without suggesting that I add blockchain.
\end{quote}

This anonymous, fictional participant captures the central distinction between \textbf{nutritional support} and \textit{intellectual contribution}. A banana may provide the former. Listing it as a coauthor requires a more generous authorship policy than ours.

\subsection{Limitations}
Our sample was imaginary, the experiment was never performed, and the lead investigator ate the control group. The index ignores sleep, task difficulty, and whether the laptop was switched on. Consequently, \underline{no causal claims are justified}. A replication should begin by actually conducting a study.

\section{Conclusion}
Bananas make agreeable desk companions and poor principal investigators. Future work will compare apples, biscuits, and the radical intervention of going outside. Until then, write a paragraph, take a break, and keep the peel away from your keyboard.

\section*{Acknowledgments}
We thank the fruit bowl for its service and the toaster for declining to review this manuscript. This paper was prepared in \href{https://unleaf.lol}{Unleaf}, where the only thing you need to bring is your next idea.

\begin{thebibliography}{9}
\bibitem{peel}
P. Peel. \textit{Fruit on Desks: A Theory of Looking Busy}. Journal of Imaginary Snack Science, 2026. Fictional reference.
\bibitem{crumb}
B. Crumb. \textit{When Experiments Become Banana Bread}. Proceedings of the Kitchen Counter, 2026. Fictional reference.
\end{thebibliography}

\end{document}`;
