---
layout: post
title: A uniform sum threshold problem
use_math: true
tags: random-generation
---

Let $U\_1, U\_2, \dots$ be an infinite sequence of independent
$\mathrm{Uniform}[0, 1]$ random variables. Let $N$ be the minimum
index for which
\\[
	U\_1 + U\_2 + \dots + U\_N > 1 .
\\]
What is the expected value $\mathbf{E}\\{N\\}$?

This problem was originally posed to me by some students of a course I
was TA-ing, as part of a homework problem in another course they were
taking. It didn't take long for me to find the solution, but I was
unsatisfied with the cleanliness of the proof. At the time, my
ex-labmate Xing Shi Cai was visiting my lab, and I relayed the problem
to him. He cleaned up the messy bits and presented to me the slickest
possible proof.

Firstly, by what is sometimes called the tail formula for
expectations, we have that
\\[
\begin{align\*}
	\mathbf{E}\\{N\\} &= \sum\_{i \ge 0} \mathbf{P}\\{N \ge i\\} \\\
			  &= \sum\_{i \ge 0} \mathbf{P}\\{U\_1 + \dots + U\_i \le 1\\} .
\end{align\*}
\\]
Rearranging,
\\[
\begin{align\*}
	\mathbf{P}\\{U\_1 + \dots + U\_i \le 1\\} &= \mathbf{P}\\{U\_1 + \dots + U\_{i - 1} \le 1 - U\_i\\} \\\
	       		 &= \mathbf{P}\\{U\_1 + \dots + U\_{i - 1} \le U\_i'\\} ,
\end{align\*}
\\]
where $U\_i' \sim \mathrm{Uniform}[0, 1]$, and $U\_i'$ is independent of $U\_1, \dots, U\_{i - 1}$.

Consider the event $\mathcal{E}\_i$ that
\\[
	U\_i' = \max\\{U\_1, \dots, U\_{i - 1}, U\_i'\\} .
\\]

Since this is just a collection of independent uniform random
variables, then $U\_i'$ is maximum among them with probability exactly
$\mathbf{P}\\{\mathcal{E}\_i\\} = 1/i$. Moreover, conditionally upon
$\mathcal{E}\_i$, then $U\_1/U\_i', \dots, U\_{i - 1}/U\_i'$
normalizes the variables to lie in the interval $[0, 1]$, and in fact
now each of these is independent and distributed as
$\mathrm{Uniform}[0, 1]$. On the other hand, conditionally upon
$\overline{\mathcal{E}\_i}$, one of the other variables is larger than
$U\_i'$, and in particular,
\\[
	U\_1 + \dots + U\_{i - 1} > U\_i' .
\\]
Therefore,
\\[
\begin{align\*}
	 \mathbf{P}\\{U\_1 + \dots + U\_{i - 1} \le U\_i'\\} &= \mathbf{P}\\{U\_1 + \dots + U\_{i - 1} \le U\_i' \mid \mathcal{E}\_i\\} \mathbf{P}\\{\mathcal{E}\_i\\} \\\
	 		   &= \frac{1}{i} \mathbf{P}\left\\{\frac{U\_1}{U\_i'} + \dots + \frac{U\_{i - 1}}{U\_i'} \le 1 \,\Big|\, \mathcal{E}\_i\right\\} \\\
			   &= \frac{1}{i} \mathbf{P}\\{U\_1 + \dots + U\_{i - 1} \le 1\\} ,
\end{align\*}
\\]
and upon iterating, we get the following very satisfying equation,
\\[
	\mathbf{P}\\{U\_1 + \dots + U\_i \le 1\\} = \frac{1}{i!} .
\\]
Replacing this into the formula for the expectation, we get the magical result
\\[
	\mathbf{E}\\{N\\} = \sum\_{i \ge 0} \frac{1}{i!} = e .
\\]

Incidentally, we've derived the entire distribution above, not just
the expectation,
\\[
	\mathbf{P}\\{N \ge i\\} = \frac{1}{i!} , \qquad \mathbf{P}\\{N = i\\} = \frac{1}{(i - 1)! (i + 1)} .
\\]

Consider also the value of the first uniform sum exceeding $1$,
\\[
	S_N = U_1 + \dots + U_N .
\\]
Deterministically, this quantity must be between $1$ and
$2$. Intuitively, it seems likely that it will be at most $3/2$, since
uniforms have expected value $1/2$, and since we're adding one last
uniform before exceeding the threshold $1$.

Since $N$ is a stopping time, by Wald's lemma, we can easily nail the
expectation of $S_N$,
\\[
	\mathbf{E}\\{S_N\\} = \mathbf{E}\\{N\\} \mathbf{E}\\{U\\} = e/2 \approx 1.359,
\\]
which is indeed less than $3/2$.