---
layout: post
title: Some conditioned Galton-Watson trees never grow
use_math: true
tags: galton-watson trees
---

When programmers hear the phrase "random tree," they most likely think
of a random binary search tree, i.e., a binary search tree built from
the insertion of a uniformly random permutation of $n$ keys---denote such
a tree by $\mathrm{BST}_n$. A mathematician might instead think that a
``random tree'' is more likely to be a uniformly random tree taken
from some class, like the set of all ordered binary trees with $n$ nodes---denote
such a tree by $\mathrm{UNIF}_n$. Of course, neither would be wrong. It
should be clear, though, that these two distributions on the space of
binary trees are quite different. In particular, most undergraduate
students of computer science learn, through the study of
comparison-based sorting algorithms, that
\\[
	\mathbf{E}\\{\mathrm{height}(\mathrm{BST}_n)\\} = \varTheta(\log n) ,
\\]
and some will learn that
\\[
	\mathbf{E}\\{\mathrm{height}(\mathrm{UNIF}_n)\\} = \varTheta(\sqrt{n}) .
\\]
Though random binary search trees might seem more immediately relevant
to programmers, uniformly random binary trees are part of a bigger
picture which is comparatively more versatile in the probabilistic
analysis of algorithms. To this end, we introduce the concept of
*Galton-Watson trees.*

Galton-Watson trees were originally used to model the spread and
ultimate extinction of aristocratic family names, as part of the
eugenics craze of the late 19-th and early 20-th century. It is a
mathematical model of asexual reproduction. Starting with one
individual, each individual has an independently random number of
children, which each have their own equidistributed independently
random number of children, and so on. The distribution of the
underlying ordered family tree is known as a *Galton-Watson tree,*
which is determined by its *offspring distribution,* i.e., the
distribution of the number of children which each individual
births. We write $\xi$ for a random variable distributed as such. For
example, we might have the following offspring distribution:
\\[
\mathbf{P}\\{\xi = 0\\} = \mathbf{P}\\{\xi = 2\\} = 1/4, \quad \mathbf{P}\\{\xi = 1\\} = 1/2 ;
\\]
in words, each individual has $0$ or $2$ children with probability
$1/4$, and $1$ child with probability $1/2$. Importantly, in this
case, there is a positive probability that individuals can have no
progeny, so there is a positive probability that the Galton-Watson
tree determined by $\xi$ dies off. If each individual represents a
person with a given family name, this would indicate the extinction of
the family name.

What follows is a fascinating and classical result about Galton-Watson
tree extinction:

> **Theorem 1.**  
> Let $q$ denote the probability that a $\xi$-Galton-Watson tree goes extinct. Then, $q = 1$ if and only if $\mathbf{E} \xi \le 1$.

Accordingly, there are three regimes:
* the *subcritical* regime, when $\mathbf{E} \xi < 1$;
* the *critical* regime, when $\mathbf{E} \xi = 1$, and;
* the *supercritical* regime, when $\mathbf{E} \xi > 1$.

The critical regime is of paramount importance. Though it may not be
obvious to a first-time observer, uniformly random binary trees are
actually critical Galton-Watson trees, and indeed, critical
Galton-Watson trees model many kinds of "uniform" random trees.

To see this fact about uniformly random binary trees, we must first
control the number of nodes in a Galton-Watson tree. We define a
*conditioned Galton-Watson tree* to be a Galton-Watson tree
conditioned to have $n$ nodes, and denote it by $T_n$. So, for the
$\xi$-Galton-Watson tree $T$ and specific tree $t$ on $n$ nodes, 
\\[
	\mathbf{P}\\{T_n = t\\} = \mathbf{P}\\{T = t \mid |T| = n\\} = \frac{\mathbf{P}\\{T = t\\}}{\mathbf{P}\\{|T| = n\\}} ,
\\]
where $|T|$ denotes the number of nodes in $T$.

For certain offspring distributions, we may be conditioning on an
event which occurs with zero probability. For example, if
\\[
	\mathbf{P}\\{\xi = 0\\} = \mathbf{P}\\{\xi = 2\\} = 1/2 ,
\\]
then every $\xi$-Galton-Watson tree has an odd number of nodes, so $n$
must be odd. We will ignore this technicality.

Sticking with this choice of $\xi$, observe that if $t$ is a binary
tree with $n = 2k + 1$ nodes, then $n$ has $k$ internal nodes and $k +
1$ leaves, so by independence of the number of offspring of each node
in the Galton-Watson process,
\\[
	\mathbf{P}\\{T = t\\} = ( \mathbf{P} \\{\xi = 0\\} )^{k + 1} ( \mathbf{P}\\{\xi = 2 \\} )^k = 2^{-n} .
\\]
Since $t$ was an arbitrary binary tree on $n$ nodes, this means that $T_n$ is, after all, a uniformly random binary tree.

This is just one way of viewing a uniformly random tree as a critical
Galton-Watson tree. Some other important offspring distributions
include:
* the $\mathrm{Geometric}(1/2)$ offspring distribution,
\\[
	\mathbf{P}\\{\xi = i\\} = 2^{- (i + 1) } ,
\\]
corresponding to uniformly random ordered trees (with any valence);
* the $\mathrm{Poisson}(1)$ offspring distribution,
\\[
	\mathbf{P}\\{\xi = i\\} = \frac{e^{-1}}{i!} ,
\\]
corresponding to uniformly random unordered labelled trees, and;
* the $\mathrm{Binomial}(d, 1/d)$ offspring distribution,
\\[
	\mathbf{P}\\{\xi = i\\} = \binom{d}{i} \frac{1}{d^i} \left(1 - \frac{1}{d}\right)^{d - i} ,
\\]
corresponding to uniformly random (up to-) $d$-ary trees.

Critical Galton-Watson trees have many marvelous qualities which are
too numerous to even summarize here. In particular, writing
$\mathrm{Var}\\{\xi\\} = \sigma^2$, if $0 < \sigma^2 < \infty$, then
\\[
	\mathbf{E}\\{\mathrm{height}(T_n)\\} = \varTheta(\sqrt{n}) ,
\\]
and this height is even highly concentrated {% cite subgaussian --file 2019-06-26-conditioned-gw-trees %}.

Even more fascinating is the local limit to the *size-biased tree,*
also known as *Kesten's tree.* To describe this structure, first we
introduce the size-biased random variable $\hat{\xi}$, where
\\[
	\mathbf{P}\\{\hat{\xi} = i\\} = i \mathbf{P}\\{\xi = i\\} .
\\]

Since $\xi$ is critical, then the size-biased distribution is indeed a
probability distribution, i.e.,
\\[
	\sum_{i \ge 0} \mathbf{P}\\{\hat{\xi} = i\\} = \sum_{i \ge 0} i \mathbf{P}\\{\xi = i\\} = \mathbf{E} \xi = 1 .
\\]

With this, we construct the infinite Kesten's tree, denoted by
$T_\infty$. This random tree has a set of mortal and immortal nodes,
starting with one immortal node at the root. Each immortal node has an
independently random number of children distributed as $\hat{\xi}$,
where one among these is chosen as its immortal successor, and all
others are made mortal. Each mortal node has an independently random
number of children distributed as $\xi$.

Observe that $\mathbf{P}\\{\hat{\xi} = 0\\} = 0$, so each immortal has
at least one child, and on average $\mathbf{E} \hat{\xi} = 1 +
\sigma^2$ children. Thus, Kesten's tree has an infinite "spine" along
the sequence of immortal nodes, with several independent
$\xi$-Galton-Watson trees hanging off this spine on either side.

For a tree $t$, let $[t]_r$ denote the tree $t$ truncated to include
only the nodes of depth at most $r$. The following classical result describes
the local limit to Kesten's tree mentioned earlier:
> **Theorem 2**  
> Suppose that $\mathbf{E} \xi = 1$. Then, for each $r \ge 1$ and each tree $t$,
> \\[
  \lim_{n \to \infty} \mathbf{P}\\{ [T_n]\_r = t \\} = \mathbf{P}\\{ [T_\infty]\_r = t\\} .
> \\]

So, in the limit, conditioned Galton-Watson trees look like Kesten's
tree.

It may seem that $T_n$ "grows into" $T_\infty$ in some sense, if only
because they are the same in the limit and because $T_\infty$ is
"larger" than $T_n$, but this is not always true. To be more precise,
the question is whether or not there exists a coupling of $T_n$ and
$T_\infty$ for which $T_n \subset T_\infty$, where "$\subset$" denotes
subtree inclusion at the root along some subsequence of children. More
generously, some have asked whether or not conditioned Galton-Watson
trees can be grown incrementally, i.e., whether or not there exists a
coupling between $T_n$ and $T_{n + 1}$ for which $T_n \subset T_{n +
1}$. Equivalently, this is asking whether or not $T_{n + 1}$ can be
grown from $T_n$ by the insertion of a leaf. Recall that inserting
leaves uniformly at random in a binary tree creates a random binary
search tree, so certainly if we have any hope of creating uniform
random binary trees, the insertion profile must be radically
nonuniform.

Note that if $T_n \subset T_{n + 1}$ for each $n$, then $T_n \subset
T_\infty$, so incremental growth implies growth into Kesten's
tree. Observe also that this kind of incremental growth can be
extremely useful to study monotone properties of $T_n$, since it
allows us to use the coupling between $T_n$ and $T_\infty$ to transfer
the study of a property of $T_n$ onto the nearly-Galton-Watson
Kesten's tree $T_\infty$, which carries a lot of independence. If
finiteness of the tree is required, we can even truncate $T_\infty$ at
some level around $\sqrt{n}$, since the height of $T_n$ is highly
concentrated.

In {% cite luczak --file 2019-06-26-conditioned-gw-trees %}, it is
shown that for any $d \ge 2$ and $\xi \sim \mathrm{Binomial}(d, 1/d)$,
$T_n$ can indeed be grown incrementally. There are a few more results
about growing conditioned Galton-Watson trees---see {% cite lyons
--file 2019-06-26-conditioned-gw-trees %}, {% cite broman-binomial
--file 2019-06-26-conditioned-gw-trees %}, {% cite broman-geometric
--file 2019-06-26-conditioned-gw-trees %}---but as far as I am aware,
these are virtually the only papers including positive results
about which offspring distributions admit incremental growth or growth
into Kesten's tree.

In the reverse direction, {% cite janson-dont-grow --file
2019-06-26-conditioned-gw-trees %} shows that for *some* critical
offspring distributions and for some $n$, there is no coupling for
which $T_n \subset T_{n + 1}$, or $T_n \subset T_\infty$. We summarize
the argument here, since it is quite simple.

Let $Z_k(t)$ denote the number of nodes at depth $k$ in the tree
$t$. Observe that
\\[
	\mathbf{E} Z_k(T_\infty) = \sigma^2 + \mathbf{E} Z_{k - 1}(T_\infty) = 1 + k \sigma^2 .
\\]
If $T_n \subset T_\infty$, then
\\[
	\mathbf{E} Z_k (T_n) \le \mathbf{E} Z_k (T_\infty) = 1 + k \sigma^2 
\\]
for each $k$, and if $T_n \subset T_{n + 1}$, then
\\[
	\mathbf{E} Z_k (T_n) \le \mathbf{E} Z_k(T_{n + 1})
\\]
for each $k$. Janson proposes the following offspring distribution:
\\[
	\mathbf{P}\\{\xi = 0\\} = \mathbf{P}\\{\xi = 2\\} = \frac{1 - \varepsilon}{2}, \quad \mathbf{P}\\{\xi = 1\\} = \varepsilon ,
\\]
for some fixed $\varepsilon > 0$, and then simply enumerates all small
trees to compute that
\\[
	\mathbf{E} Z_1 (T_3) > \mathbf{E} Z_1 (T_4) 
\\]
for a small enough choice of $\varepsilon$, where we emphasize that
$Z_1$ is simply the degree of the root node.

So indeed, some small conditioned Galton-Watson trees do not grow
incrementally. When I first saw this result, I thought that perhaps
this is a small $n$ problem, and that maybe for large enough $n$, it
may still be true that $T_n \subset T_{n + 1}$. After some more
thinking, I realized that I was wrong.

Pick the following offspring distribution for some fixed $d \ge 2$:
\\[
	\mathbf{P}\\{\xi = 0\\} = \left(1 - \frac{1}{d}\right)^2, \quad \mathbf{P}\\{\xi = 1\\} = \frac{1}{d}, \quad \mathbf{P}\\{\xi = d\\} = \frac{1}{d}\left(1 - \frac{1}{d}\right) .
\\]
It can be verified that $\mathbf{E} \xi = 1$ and $\sigma^2 = d - 2 +
1/d$, so
\\[
	\mathbf{E} Z_1 (T_\infty) = d - 1 + \frac{1}{d} .
\\]
We also know the distribution of the root degree for conditioned
Galton-Watson trees from {% cite janson-survey --file
2019-06-26-conditioned-gw-trees %}, so
\\[
\begin{align\*}
	\mathbf{P}\\{Z_1(T_n) = i\\} &= \frac{n}{n - 1} i \mathbf{P}\\{\xi_1 = i \mid \xi_1 + \xi_2 + \dots + \xi_n = n - 1\\} \\\
	&= \frac{n i \mathbf{P}\\{S_{n - 1} = n - 1 - i\\}}{(n - 1) \mathbf{P}\\{S_n = n - 1\\}} ,
\end{align\*}
\\]
where $\xi_1, \dots, \xi_n$ are independent and identically distibuted
as $\xi$, and $S_n = \xi_1 + \dots + \xi_n$. Using tedious
computations through local limit theorems {% cite petrov --file
2019-06-26-conditioned-gw-trees %}, we can estimate the above
probabilities in order, finally, to compute that
\\[
	\mathbf{E} Z_1(T_n) = d - 1 + \frac{1}{d} + \frac{d^2 + o(d^2)}{2n} + o(1/n) , 
\\]
where the function $o(d^2)$ does not depend on $n$.

What this implies is that we can pick $d$ large enough so that $d^2$
dominates $o(d^2)$ in the numerator, and then, for all sufficiently large
$n$,
\\[
	\mathbf{E} Z_1 (T_n) > \mathbf{E} Z_1 (T_\infty) .
\\]
So, there are even arbitrarily large conditioned Galton-Watson trees
which still cannot be grown within Kesten's tree.

{% bibliography --file 2019-06-26-conditioned-gw-trees %}