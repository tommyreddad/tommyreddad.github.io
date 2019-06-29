---
layout: post
title: Discrete minimax estimation with trees
use_math: true
tags: minimax density-estimation trees
---

This morning, I submitted the final version of my paper [Discrete
minimax estimation with trees][density-trees] {% cite density-trees --file
2019-06-27-density-trees.bib %}, which is to appear in the Electronic
Journal of Statistics. I think this paper is conceptually quite
interesting, and I'm very happy with the final result, so in this post
I'll describe some of the main ideas present in the work.

The setting is elementary. We observe $n$ independent and identically
distributed samples coming from an unknown discrete distribution, and
our goal is to concoct an estimate of the underlying distribution
using our observations. In general, we will write $f$ for the
probability mass function of the true distribution $\mu$, and
$\hat{f}$ for an estimate of $f$ with corresponding distribution
$\hat{\mu}$. Note that $\hat{\mu}$ and $\hat{f}$ are random functions.
Our goal is to make a choice of $\hat{f}$ which minimizes
the expected *total variation (TV) distance* between $\mu$ and $\hat{\mu}$,
where this quantity is defined as
\\[
	\mathrm{TV}(\mu, \hat{\mu}) = \sup_A |\mu(A) - \hat{\mu}(A)| .
\\]
If this quantity is small, then $\mu$ and $\hat{\mu}$ assign nearly
the same probabilities to all events.

The TV-distance has several equivalent formulations which makes it
particularly attractive to us. Among them is the following *coupling
characterization*, where if $X$ and $\hat{X}$ are random variables
distributed as $\mu$ and $\hat{\mu}$, then
\\[
	\mathrm{TV}(\mu, \hat{\mu}) = \inf_{(X, \hat{X})} \mathbf{P}\\{X \neq \hat{X}\\} ,
\\]
where the infimum is over all couplings of $X$ and $\hat{X}$. In this sense, we see how the TV-distance really captures our capacity to be able to tell $X$ and $\hat{X}$ apart by any means.

It is also not hard to see that
\\[
	\mathrm{TV}(\mu, \hat{\mu}) = \frac{1}{2} \sum_i |f(i) - \hat{f}(i)| ,
\\]
and for this reason we will abuse notation and work with probability
mass functions instead of probability measures in what follows:
\\[
	\mathrm{TV}(f, \hat{f}) = \frac{1}{2} \sum_i |f(i) - \hat{f}(i)| .
\\]
We also will refer to probability mass functions as densities.
All in all, if we know that $f$ belongs to some class of functions
$\mathcal{F}$, then we are interested in the following quantity,
\\[
	\mathcal{R}\_n(\mathcal{F}) = \inf_{\hat{f}} \sup_{f \in \mathcal{F}} \mathbf{E}\\{\mathrm{TV}(f, \hat{f})\\} ,
\\]
known as the *minimax risk* or *minimax rate* of the class
$\mathcal{F}$. This represents the best worst-case error over all
events and estimators of an unknown density in $\mathcal{F}$.

As a warm-up, let us suppose that the true density comes the class of
all densities $\mathcal{F}$ supported on $\\{1, \dots, k\\}$. Write $X_1, \dots,
X_n$ for the observed samples. Since we have no extra information, is
sensible then to choose $\hat{\mu}$ as the empirical measure, i.e., for
each $i \in \\{1, \dots, k\\}$,
\\[
	\hat{f}(i) = \frac{1}{n} \sum_{j = 1}^n \mathbf{1}\\{ X_j = i\\} = \frac{N_i}{n} ,
\\]
where $N_i$ denotes the number of samples equal to $i$. Note that
$N_i$ is distributed as $\mathrm{Binomial}(n, f(i))$. The error of
this estimate can be easily measured:
\\[
\begin{align\*}
	\mathbf{E} \\{\mathrm{TV}(f, \hat{f})\\} &= \frac{1}{2} \sum_{i = 1}^k \mathbf{E}\\{|f(i) - \hat{f}(i)|\\} \\\
	&= \frac{1}{2n} \sum_{i = 1}^k \mathbf{E}\\{|n f(i) - N_i|\\} \\\
	&\le \frac{1}{2n} \sum_{i = 1}^k \sqrt{\mathbf{E}\\{(n f(i) - N_i)^2\\}} ,
\end{align\*}
\\]
by the Cauchy-Schwarz inequality. Each term here is simply the
variance of a binomial random variable, whence
\\[
	\mathcal{R}\_n(\mathcal{F}) \le \frac{1}{2n} \sup_{f \in \mathcal{F}} \sum_{i = 1}^k \sqrt{n f(i)} \le \frac{1}{2} \sqrt{\frac{k}{n}} ,
\\]
again by Cauchy-Schwarz. It's also not hard to see that this is the
optimal rate up to a constant factor, i.e.,
\\[
	\mathcal{R}\_n(\mathcal{F}) \asymp \sqrt{\frac{k}{n}} .
\\]

The estimate $\hat{f}$ above is technically a type of
*histogram*. Histogram estimates create piecewise constant functions
determined by a partition of the support into bins, where each bin
receives a total mass proportional to the number of samples falling
within it. The estimate $\hat{f}$ is a histogram with bins of size
$1$. Histograms can be used to study classes other than $\mathcal{F}$
above, in which case it becomes important to make a good choice of
bins, which is not always an easy move.

In {% cite density-trees --file 2019-06-27-density-trees %}, we
develop a recursive scheme for determining a histogram partition for
estimating discrete non-increasing and non-increasing convex
densities. I'll focus on the first case.

First, write $\mathcal{F}\_k$ for the class of all non-increasing
densities supported on $\\{1, \dots, k\\}$, where $k$ is a power of
two. Let $f \in \mathcal{F}\_k$ be the unknown density generating the
$n$ observations $X_1, \dots, X_n$. We construct a binary tree with a
corresponding partition of the support. Let $\rho$ be the root of the
tree, corresponding to the interval $I_\rho = \\{1, \dots, k\\}$. Let
\\[
\begin{align\*}
	I_v &= \\{1, \dots, k/2\\} , \\\
	I_w &= \\{k/2 + 1, \dots, k\\} 
\end{align\*}
\\]
denote the left and right halves of $I_\rho$. We need to decide
whether or not to split $I_\rho$ into $I_v$ and $I_w$ and recurse, or
use $I_\rho$ as a bin itself. If it appears that $f$ is constant on
$I_\rho$, then we would do well not to recurse, and vice versa. To
this end, let $N_v$ and $N_w$ denote the number of samples falling
into the intervals $I_v$ and $I_w$. Let also $f_v$ and $f_w$ denote
the total mass of $f$ in $I_v$ and $I_w$. Since $f$ is non-increasing,
then we expect that
\\[
	N_v \ge N_w 
\\]
much of the time, so we should not recurse if $N_v < N_w$. In fact,
since $N_v \sim \mathrm{Binomial}(n, f_v)$ and $N_w \sim
\mathrm{Binomial}(n, f_w)$, then with constant probability,
\\[
\begin{equation}
	N_v - N_w \ge \sqrt{N_v + N_w} , \label{greedy-rule}
\end{equation}
\\]
for example by Chebyshev's inequality. We call this the *greedy
splitting rule*, and we split $\rho$ and recurse if and only if either
$(\ref{greedy-rule})$ holds and $|I_\rho| > 1$.

In the end, we obtain a partition of the interval $\\{1, \dots, k\\}$,
which can be used to make a histogram estimate $\hat{f}$, which we
call the *greedy tree-based estimate* for $f$. Our simulations suggest
that $\hat{f}$ well-estimates $f$, but the proof of this eludes
us. Instead, we can use the construction of $\hat{f}$ to develop
another estimate which, along with some black magic, can allow us to
obtain the optimal minimax rate $\mathcal{R}\_n(\mathcal{F})$.

If we replace the quantities in $(\ref{greedy-rule})$ with their
expectations, we get what we call the *idealized splitting rule*
\\[
\begin{equation}
	f_v - f_w \ge \sqrt{\frac{f_v + f_w}{n}} . \label{ideal-rule}
\end{equation}
\\]
We can still use the idealized splitting rule to construct a
piecewise-constant function $f^*$ which has, on each bin, the average
value of $f$ along that bin.

This may seem contrary to the point of the problem, considering this
construction depends heavily upon prior knowledge of the true density
$f$. This is where the black magic kicks in, but we need a few
definitions first.

For a class of functions $\mathcal{G}$, define its *Yatracos class*
$\mathcal{A}$ as
\\[
	\mathcal{A} = \\{\\{x \colon f(x) > g(x)\\} \colon f \neq g \in \mathcal{G}\\} .
\\]
Define also the Vapnik-Chervonenkis (VC) dimension of a class
$\mathcal{A}$ of subsets of $\mathcal{X}$ as the size of the largest
$X \subseteq \mathcal{X}$ such that for every $Y \subseteq X$, there
exists $B \in \mathcal{A}$ such that $X \cap B = Y$. This is an
important quantity in combinatorial statistics and machine learning.

> **Theorem 1.**
> Let $\mathcal{G}$ be some class of density estimates with Yatracos class $\mathcal{A}$. Then, there is a universal constant $c > 0$ for which
>\\[
>	\mathcal{R}\_n(\mathcal{F}) \le 3 \sup_{f \in \mathcal{F}} \inf_{g \in \mathcal{G}} \mathrm{TV}(f, g) + c \sqrt{\frac{\mathrm{VC}(\mathcal{A})}{n}} + \frac{3}{2n} .
>\\]

Let $T^\*$ denote the underlying binary tree in the construction of
$f^\*$, and say it has leaves $L^\*$. Suppose that $\mathcal{G}$ is
the class of all density estimates with at most $\ell$
piecewise constant parts, for $\ell \ge |L^\*|$. Then, $f^\* \in \mathcal{G}$. Furthermore,
if $\mathcal{A}$ is the Yatracos class of $\mathcal{G}$, then
$\mathcal{A} \subset \mathcal{B}$, where $\mathcal{B}$ is the class of
unions of at most $\ell$ intervals. In particular, it is well-known
that $\mathrm{VC}(\mathcal{B}) = 2 \ell$, so applying Theorem 1,
\\[
	\mathcal{R}\_n(\mathcal{F}\_k) \le 3 \sup_{f \in \mathcal{F}} \mathrm{TV}(f, f^*) + c \sqrt{\frac{\ell}{n}} + \frac{3}{2n} .
\\]

We can also control the total-variation distance to the idealized
tree-based estimate:
\\[
\begin{align\*}
	\mathrm{TV}(f, f^*) &= \frac{1}{2} \sum_{i = 1}^k |f(i) - f^\*(i)| \\\
		       &= \frac{1}{2} \sum\_{u \in L^\*} \sum_{i \in I\_u} |f(i) - f^\*(i)| \\\
		       &= \frac{1}{2} \sum\_{u \in L^\*} \sum_{i \in I_u} |f(i) - \bar{f}\_u| ,
\end{align\*}
\\]
where $\bar{f}\_u = f\_u/|I\_u|$ is the average value of $f$ on
$I_u$. For $u \in L^\*$, write
\\[
	A\_u = \sum_{x \in I\_u} |f(i) - \bar{f}\_u| .
\\]

If $|I_u| = 1$, then $A_u = 0$, so we assume that $|I_u| > 1$. In this
case, let $I_v$ and $I_w$ be the left and right halves of $I_u$. Write
also
\\[
\begin{align\*}
	B_v &= \sum_{x \in I\_v} |f(i) - \bar{f}\_v| , \\\
	B_w &= \sum_{x \in I\_w} |f(i) - \bar{f}\_w| .
\end{align\*}
\\]
By the triangle inequality,
\\[
\begin{align\*}
	A\_u &\le (\bar{f}\_v - \bar{f}\_u) |I\_v| + (\bar{f}\_u - \bar{f}\_w) |I\_w| + B\_v + B\_w \\\
	&= (f\_v - f\_w) + B\_v + B\_w .
\end{align\*}
\\]
Let $i_v$ be the largest point in $I_v$ for which $f(i) \ge \bar{f}\_v$. Then,
\\[
\begin{align\*}
	B\_v &= \sum_{i \in I\_v, i \le i\_v} (f(i) - \bar{f}\_v) + \sum_{i \in I\_v, i > i\_v} (\bar{f}\_v - f(i)) \\\
	    &= 2 \sum_{i \in I\_v, i > i\_v} (\bar{f}\_v - f(i)) \\\
	    &\le 2 |I_v| (\bar{f}\_v - \bar{f}\_w) \\\
	    &= 2 (f\_v - f\_w) .
\end{align\*}
\\]
A similar relation holds for $B_w$, whence
\\[
	A\_u \le 5 (f\_v - f\_w) \le 5 \sqrt{f\_u/n} 
\\]
by the idealized splitting rule $(\ref{ideal-rule})$. Putting this all together,
\\[
	\mathrm{TV}(f, f^*) \le \frac{5}{2 \sqrt{n}} \sum_{u \in L^\*} \sqrt{f\_u} \le \frac{5}{2} \sqrt{\frac{\ell}{n}} 
\\]
by the Cauchy-Schwarz inequality. So for some universal constant $c > 0$,
\\[
	\mathcal{R}\_(\mathcal{F}\_k) \le c \sqrt{\ell/n} .
\\]
So it suffices to find a uniform upper bound on $|L^\*|$.

The idea here is that each time a split occurs on a fixed level in
$T^\*$ creating children $v, w$ in order from left to right, we know
that
\\[
	f\_v - f\_w \ge  + \sqrt{\frac{f\_v + f\_w}{n}} .
\\]
So, the more splits there are on a level, the taller the density grows
towards the origin. The above equation ressembles a differential equation,
\\[
	\mathrm{d} f \ge \sqrt{f/n} ,
\\]
which has the solution $f(x) \ge x^2/(4n)$. More formally, if $U_j$ is
the set of nodes at depth $j - 1$ in $T^\*$ which have at least one
leaf as a child, with all the children of nodes in $U_j$ labelled
$u\_1, \dots, u_{2|U\_j|}$, then it can be shown that
\\[
	f\_{u\_{2i}} \ge \frac{i^2}{n} .
\\]
Let $L_j$ be the set of leaves at level $j$ in $T^\*$, with total mass $q_j$. Then, ignoring integer effects,
\\[
	q\_j \ge \sum\_{i = 1}^{|L\_j|/2} f\_{u\_{2i}} \ge \sum\_{i = 1}^{|L\_j|/2} \frac{i^2}{n} \ge \frac{|L\_j|^3}{24n} ,
\\]
and $|L\_j| \le (24 n q\_j)^{1/3}$, so by Hölder's inequality,
\\[
\begin{align\*}
	|L^\*| &\le (24 n)^{1/3} \sum_{i = 1}^{\log\_2 k} q\_j^{1/3} \\\
	       &\le (24 n)^{1/3} \left(\sum_{i = 1}^{\log\_2 k} q\_j \right)^{1/3} \left( \sum_{i = 1}^{\log\_2 k} 1 \right)^{2/3} \\\
	       &= (24 n)^{1/3} (\log\_2 k)^{2/3} ,
\end{align\*}
\\]
and finally
\\[
	\mathcal{R}\_n(\mathcal{F}\_k) \le c \left( \frac{\log k}{n} \right)^{1/3} .
\\]
This is just a sketch of the full computation---for the fully
articulated argument, [read our paper][density-trees].

[density-trees]: https://arxiv.org/abs/1812.06063

{% bibliography --file 2019-06-27-density-trees %}