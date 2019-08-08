---
layout: post
title: Splay trees and optimality
use_math: true
use_d3: true
tags: trees algorithms
---

The splay tree is probably my favourite data structure. Is it useful
in practice? Probably not, but its remarkable optimality properties
coupled with its bare simplicity are so tantalizing that I've fallen
in love with splaying. In the rest of this post, I'll describe the
splay tree structure, and present some of my favourite splay tree
properties. You will also find an instructive D3 visualization of a
splay tree in motion.

Splay trees are a kind of binary search tree, so they support the
crucial search tree query $\texttt{SEARCH}(k)$ which returns the
smallest value $x \ge k$ stored in the tree. As an aside, many
students ignore the difference between this search query, and what we
may call a $\texttt{FIND}(k)$ query of dictionaries, which only should
return $k$ if $k$ is present in the structure, and nothing
otherwise. Obviously, we can always implement $\texttt{FIND}$ with
$\texttt{SEARCH}$, but the reverse is not true. These are
fundamentally different queries with different goals and limitations,
which is sometimes not emphasized in undergraduate computer science
courses, and indeed, the ignorance of this difference may lend
students to believe for a time that dictionaries ultimately solve all
of the same problems as search trees.

So, splay trees are search trees. They are also *adaptive*; the
structure modifies itself not only upon insertions and deletions, but
also on search queries. Every undergraduate computer science student
encounters *red-black trees*, which are a kind of self-adjusting
binary search tree, which perform *rotations* upon insertions and
deletions so as to constantly maintain logarithmic height. Splay trees
self-adjust also on queries, to be adaptive to input query
sequences. Before describing this transformation in more detail, I'll
present a problem which happens to be solved by splay trees.

Let $D$ be some data structure implementing $\texttt{SEARCH}$. We
perform a sequence of queries $x_1, x_2, \dots$ on $D$. For a
particular $x$, let $w(x)$ denote the number of distinct elements of
$D$ which have been queried since $x$ was last queried. For example,
if $x_1 = x_2 = x_3 = 1$ and we are performing the fourth query, then
$w(1) = 0$. On the other hand, if $x_1 = x_2 = 1$ and $x_3 = 2$, then
$w(1) = 1$. If $\texttt{SEARCH}(x)$ takes time $O(\log w(x))$,
then $D$ is said to have the *working set property.* If a structure
has this property, then this structure allows us to efficiently
perform sequences of queries in which there are many recurring
items. It's not totally obvious how to implement a structure which has
the working set property, but one relatively easy example is given by
[Iacono's working set structure][iacono].

Intuitively, if we wanted to make a binary search tree which has the
working set property, we might simply rotate any queried element all
the way up to the root. This isn't quite right. Take for example the
sequence of insertions $x_1 = 1, x_2 = 2, \dots, x_n = n$. Each
insertion in this structure will take constant time, and the final
tree looks like a root with one right child, and a path of $n - 2$
nodes hanging off its left child. Then, the query $x_{n + 1} = 1$
takes $\varOmega(n)$ time. In fact, if $x_{n + i} = i$ for each $i$,
then the queries will even take $\varOmega(n)$ amortized time. So, the
most obvious suggestion fails to implement the working set property.

Splay trees are the next simplest choice. Instead of performing
rotations to bubble up queried nodes to the root, nodes are *splayed*
to the root. A single splaying operation is a kind of rotation which
happens on one or two levels at a time. There are three kinds of
splaying up to symmetries, based on the parent-grandparent orientation
of a target splayed node: the zig, the zig-zig, and the zig-zag.

### The zig

This is an ordinary binary tree rotation, as seen for example in
red-black trees. The zig is only performed when the splayed node is a
child of the root. On the left, the node to be splayed is $x$, and the
root is $y$. The zig transforms the left tree into the right tree.

<div id="zig" align="center"></div>
<script type="text/javascript" src="/assets/2019-07-27-splay-trees/zig.min.js"></script>

### The zig-zig

A zig-zig is performed whenever the splayed node $x$ is the left-left
child or the right-right child of its grandparent. A zig-zig of $x$
transforms the left tree into the right tree.

<div id="zigzig" align="center"></div>
<script type="text/javascript" src="/assets/2019-07-27-splay-trees/zigzig.min.js"></script>

## The zig-zag

In all remaining cases, a zig-zag is performed, transforming the left
tree into the right tree.

<div id="zigzag" align="center"></div>
<script type="text/javascript" src="/assets/2019-07-27-splay-trees/zigzag.min.js"></script>

Notice that each of the above transformations retains the in-order
sequence of keys. In the following visualization, 32 keys are inserted
in a uniformly random order and splayed to the root. Once all keys are
inserted, uniformly random keys are queried from inside the tree, and
their nodes are splayed to the root. Nodes currently being splayed are
highlighted in red. Black squares represent external nodes.

<div id="splay" align="center"></div>
<script type="text/javascript" src="/assets/2019-07-27-splay-trees/splay.min.js"></script>

This simple modification is enough to give splay trees some serious
power.

>**The Static Optimality Meta-Theorem.**  
> Let $T$ be some fixed binary search tree, and let $d(x)$ be the depth of the node $x$ in $T$. Let $x\_1, x\_2, \dots, x\_m$ be a sequence of queries in $T$. The cost of accessing $x\_1, x\_2, \dots, x\_m$ in a splay tree is at most  
>\\[
>	O\left(n \log n + m + \sum\_{i = 1}^m d(x\_i)\right) .
>\\]

The $n \log n + m$ part can be thought of as the cost of doing
business in any balanced binary tree. The remaining part is the cost
of the sequence of queries $x\_1, \dots, x\_m$ in $T$. So what this
result says is that, for long enough query sequences, splay trees
perform as well as any static binary search tree. In particular, if we
pick $T$ to be a balanced complete binary tree, then we get the
following corollary.

>**The Balance Theorem.**  
> The cost of any sequence of $m$ queries in a splay tree is at most
>\\[
>	O(n\log n + m \log n) .
>\\]

From this, we learn that the amortized cost of each operation is
$O(\log n)$, so splay trees behave like balanced binary search trees.

As it turns out, splay trees also have the amortized working set
property which we discussed earlier, though this is not a consequence
of the static optimality meta-theorem.

>**The Working-Set Theorem.**  
> The cost of the query sequence $x\_1, x\_2, \dots, x\_m$ in a splay tree is at most
>\\[
>	O\left(n \log n + m + \sum_{i = 1}^m \log w(x\_i) \right) .
>\\]

Every year that I've TA'd the undergraduate honours data structures
class at McGill University, students have been asked to design a data
structure which has the *dynamic finger property*, where if $\Delta$
is the difference in keys between the current and preceding queries,
then the current operation should cost $O(\log \Delta)$. It's a
tricky problem, but with some work, this can be accomplished using
a self-balancing binary search tree with level-linked lists, some
smart traversal, and a bit of careful thinking... But who has the time
for that?

>**The Dynamic Finger Theorem.**  
> The cost of the query sequence $x\_1, x\_2, \dots, x\_m$ in a splay tree is at most
>\\[
>	O\left(n + m + \sum_{i = 1}^m \log(1 + |x_i - x_{i - 1}|)\right) ,
>\\]
> where $x_0 = 0$.

Is there anything splay trees can't do? We simply do not yet know,
considering the following conjecture remains open.

>**The Dynamic Optimality Conjecture.**  
> Let $T$ be a binary search tree and $x\_1, x\_2, \dots, x\_m$ be a sequence of queries in $T$. Suppose that we are allowed to modify $T$ by rotations after each query. Let $S(T)$ be the sum of the lengths of access paths and the number of rotations made in the query sequence. The cost of accessing $x\_1, x\_2, \dots, x\_m$ in a splay tree is at most
> \\[
>	O(n + S(T)) .
> \\]

[iacono]: https://en.wikipedia.org/wiki/Iacono%27s_working_set_structure