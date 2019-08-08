---
layout: post
title: Generating spherical points without complex operations
use_math: true
use_d3: true
tags: sphere random-generation algorithms
---

These days, most of everyone's favourite languages and libraries for
scientific computing come ready-equipped with random number generators
for most common univariate distributions: the uniform, binomial,
normal, geometric, exponential, beta, etc. In my experience,
multivariate generation is comparatively hit-or-miss. But in any case,
since documentation usually doesn't specify implementation methods or
running time, you usually can't be sure of the efficiency of one of
these functions without personally examining some source code, or
being lucky and finding that someone else on StackExchange already
did. Thankfully, when in doubt, one can always refer to the excellent
and totally free book [Non-Uniform Random Variate
Generation][non-uniform] by my old PhD supervisor Luc Devroye. In
fact, it seems this book is even more than free, as stated in this
plea posted by the author on the book's webpage.
>**I give anyone the permission, even without asking me, to take these PDF files to a printer, print as many copies as you like, and sell them for profit.** If you would like me to advertise the sales points of the hard copies, please let me know. **To the libraries: Please do not charge patrons for copying this book. I grant everyone the right to copy at will, for free.**

The book is a wonder, even with its age. It is a massive resource for
efficient and extremely clever algorithms for generating random
numbers with almost every distribution one could dream of. The
starting point is access to an infinite source of $\mathrm{Uniform}[0,
1]$ random samples. We should note that this is a sensible starting
point for computer science, since we can generate $\mathrm{Uniform}[0,
1]$ random samples with a source of uniformly random bits $X_i \in
\\{0, 1\\}$. Specifically, if $0.x\_1 x\_2 x\_3 \dots$ denotes the
binary expansion of a number in $[0, 1]$, then
\\[
	0.X_1 X_2 X_3 \dots \sim \mathrm{Uniform}[0, 1] .
\\]
With this, it's possible to generating any other
random variable, using the simple *inversion method*.

The inversion method can be used if we know the CDF of the target
distribution. Indeed, if $X$ is a random variable with the target
distribution which has CDF $F$, and $U \sim \mathrm{Uniform}[0, 1]$,
then
\\[
	\mathbf{P}\\{F^{-1}(U) \le t\\} = \mathbf{P}\\{U \le F(t)\\} = F(t) ,
\\]
so $F^{-1}(U)$ has the same distribution as $X$. In other words, we
can generate $X$ by generating $F^{-1}(U)$. This isn't always
practical, considering $F^{-1}$ might be a difficult function, and
working directly with it might introduce some floating point precision
errors. Even more likely and much worse, we might not even be able to
express $F^{-1}$ in a closed form, and it may only be expressed by an
implicit equation involving an integral or a sum. Take, for instance, $X \sim
\mathcal{N}(0, 1)$, the standard normal distribution. Then,
\\[
	F(t) = \int\_{-\infty}^t \frac{1}{\sqrt{2\pi}} e^{-x^2/2} \\,\mathrm{d}x ,
\\]
and $F^{-1}(s)$ is defined implicitly as satisfying
\\[
	s = \int\_{-\infty}^{F^{-1}(s)} \frac{1}{\sqrt{2\pi}} e^{-x^2/2} \\,\mathrm{d}x .
\\]
For this fundamental distribution, the inversion
method fails spectacularly. We need a more clever solution.

In general, we're interested in methods for generating random
variables distributed according to a specific distribution, while
minimizing the number of uniform samples observed, and the number of
mathematical operations. Here, we strongly emphasize avoiding any
complex operation, which includes basically anything other than
addition, subtraction, multiplication, and division.

Incidentally, I've been learning how to use [D3.js][d3] recently,
which is a great JavaScript library for data visualization. In what
follows, I'll use it to demonstrate a few algorithms for generating
random variables according to some special distributions.

Through the following, I'll mostly focus on algorithms for generating
uniform points on the surface of a sphere. This content is covered in
Chapter 5 of [the book][non-uniform].

## The $1$-sphere

We define the unit $(d - 1)$-sphere $\mathbb{S}^{d - 1}$ as
\\[
	\mathbb{S}^{d - 1} = \\{x \in \mathbb{R}^d \colon \\|x\\|\_2 = 1\\} ,
\\]

where $\\|\cdot\\|\_2$ denotes the Euclidean norm. One natural way to
generate a uniform point on $\mathbb{S}^{d - 1}$ is to generate a high
dimensional normal vector $Z \sim \mathcal{N}(0, I_d)$, and
normalize it. In other words, $Z/\\|Z\||_2$ is uniformly distributed
on $\mathbb{S}^{d - 1}$. In fact, it may be intuitively clear that if $X$ is
any random variable with a *radially symmetric* distribution on $\mathbb{R}^d$, then
$X/\\|X\\|_2$ will be uniformly distributed on $\mathbb{S}^{d - 1}$, and the
normal distribution is probably the simplest such choice.

Unfortunately, it's not clear to begin with whether generating high
dimensional normals is harder than generating high dimensional
spherical points, so from a first-principles standpoint we're
stuck. To get anywhere, let's begin with the simplest case, $d = 2$,
so $\mathbb{S}^1$ is the usual unit circle
\\[
	\mathbb{S}^1 = \\{(x, y) \in \mathbb{R}^2 \colon x^2 + y^2 = 1\\} .
\\]
In this particular case, there is the well-known [Box-Muller
transform][box-muller] for generating $X \sim \mathcal{N}(0, I_2)$,
whence the above approach becomes applicable, but again it's not
exactly clear if the Box-Muller method is technically harder than the
problem we're already trying to solve. Considering Box-Muller involves
trigonometric functions, we'd like to avoid it if possible.

It's actually easy to generate a radially symmetric random variable
using our source of $\mathrm{Uniform}[0, 1]$ samples by
*rejection*. First, trivially note that we can generate
$\mathrm{Uniform}[-1, 1]$ random variables by simply taking
$2\mathrm{Uniform}[0, 1] - 1$. The following extremely simple
algorithm generates a uniformly random point in the unit disc, which
has a radially symmetric distribution:
~~~
do:
    U, V = Uniform[-1, 1]
while (U*U + V*V > 1)
return (U, V)
~~~

The loop runs until a point falls within the unit disc, so the number
of iterations $N$ is distributed as $\mathrm{Geometric}(\pi/4)$. In
particular, the expected number of iterations is $\mathbf{E} N =
4/\pi \approx 1.27$, and highly concentrated. This is great! We can get a uniform
point on $\mathbb{S}^1$ as before, by simply normalizing the vector on
output.
~~~
do:
    U, V = Uniform[-1, 1]
    D = U*U + V*V
while (D > 1)
D = sqrt(D)
return (U/D, V/D)
~~~

The algorithm is visualized below. Red points are rejected due to
lying outside the unit disc. Accepted points are smoothly projected
onto the unit circle, leaving behind a gray shadow in their original
position.
<div id="S1gen" align="center" style="padding-bottom: 1em"></div>
<script type="text/javascript" src="/assets/2019-07-08-generating-without-complex-operations/S1gen.js"></script>

On average, this costs $8/\pi \approx 2.54$ multiplications.  A simple
optimization, by fitting the unit sphere into an $\ell_1$ ball, allows
us to slightly reduce the average number of multiplications.
~~~
do:
    U, V = Uniform[-1, 1]
    D = |U| + |V|
    Reject = (D > sqrt(2))
    if !Reject:
        D = U*U + V*V
	Reject = (D > 1)
while Reject
D = sqrt(D)
return (U/D, V/D)
~~~

A quick computation shows that the average number of multiplications
is reduced to $(2 + 4\sqrt{2})/\pi \approx 2.43$. Both of the above
algorithms still requires one square root (since the constant
$\sqrt{2}$ can be computed beforehand), which is not the worst
function to compute and can be approximated in multiple robust ways,
but we'd still like to avoid it. It may feel like a square root is
inevitable, but with a clever trick, uniform points on $\mathbb{S}^1$
can in fact be generated without any complex function invocations.

To get towards this, first observe that a uniform point on
$\mathbb{S}^1$ can also be generated by picking a uniform angle in
$[0, 2\pi]$ and finding the appropriate polar coordinate. Simply stated:
~~~
U = Uniform[0, 1]
return (cos(2*pi*U), sin(2*pi*U))
~~~

This is easy enough, and intuitively obvious, but requires two
trigonometric function calls, or one trigonometric function call and
one square root, using the identity $\cos^2 \theta + \sin^2 \theta =
1$.

Here's the trick: Doubling the angle range from $[0, 2\pi]$ to $[0,
4\pi]$ changes nothing---the resulting point is still uniformly
distributed. But now, with the following high-school trigonometric
identities
\\[
\begin{align\*}
	\cos(4\pi U) &= \cos^2(2\pi U) - \sin^2(2\pi U) , \\\
	\sin(4\pi U) &= 2 \sin(2\pi U) \cos(2\pi U) ,
\end{align\*}
\\]

we see that if $(X, Y)$ is uniformly distributed on $\mathbb{S}^1$,
then so is $(X^2 - Y^2, 2 X Y)$. As a sanity check, we can verify that
this point lives on the sphere:
\\[
\begin{align\*}
	\\|(X^2 - Y^2, 2 XY)\\|_2 &= \sqrt{(X^2 - Y^2)^2 + 4 X^2 Y^2} \\\
		&= \sqrt{X^4 + 2 X^2 Y^2 + Y^4} \\\
		&= \sqrt{(X^2 + Y^2)^2} \\\
		&= 1 .
\end{align\*}
\\]
With this, we implement another
algorithm, this time with no complex function calls:
~~~
do:
    U, V = Uniform[-1, 1]
    D = |U| + |V|
    Reject = (D > sqrt(2))
    if !Reject:
        U2 = U*U
	V2 = V*V
        D = U2 + V2
	Reject = (D > 1)
while Reject
return ((U2 - V2)/D, 2.0*U*V/D)
~~~

We can actually use this algorithm to generate a two-dimensional
normal. Since this distribution is radially symmetric, and since we've
just described an efficient method of generating radially symmetric
vectors, it suffices to generate the magnitude of a two-dimensional
normal vector. It's well-known that this length is distributed as
$\sqrt{2 E}$ for $E \sim \mathrm{Exponential}(1)$, and we can also
observe by the inversion method that $\log(1/U) \sim
\mathrm{Exponential}(1)$ for $U \sim \mathrm{Uniform}[0, 1]$. This
finally gives us a manner of generating two-dimensional normal vectors
using one square root, one logarithm, and three total uniform samples,
by the following algorithm:
~~~
do:
    U, V = Uniform[-1, 1]
    D = |U| + |V|
    Reject = (D > sqrt(2))
    if !Reject:
        U2 = U*U
	V2 = V*V
        D = U2 + V2
	Reject = (D > 1)
while Reject
W = sqrt(2*log(1/U))
return (W*(U2 - V2)/D, W*2.0*U*V/D)
~~~

Both coordinates are independent and marginally distributed as
one-dimensional standard normals, so we could turn this into a batch
one-dimensional normal generator, saving the second coordinate for the
next invocation.


## The $2$-sphere

In the next smallest case, $d = 3$. As it turns out, this case is a
little bit special. In particular, if $(X_1, X_2, X_3)$ is uniformly
distributed in $\mathbb{S}^2$, then $X_1, X_2, X_3 \sim
\mathrm{Uniform}[-1, 1]$. Of course, these points are not
independent. But this special property is unique to case $d = 3$, and
can actually help us for the purpose of random point generation.

It's not too hard to see why this is the case. First, it's clear that
$X_1, X_2, X_3$ are identically distributed, so it suffices to show
the claim for $X_1$, which we denote by $X$. We can interpret
$\mathbf{P}\\{X \le t\\}$ as the normalized surface area of the
spherical cap to the left of $t$. Since the unit $2$-sphere has
surface area $4\pi$, and the aforementioned spherical cap has area $2
\pi (1 + t)$ by high-school geometry, then
\\[
	\mathbf{P}\\{X \le t\\} = \frac{2 \pi (1 + t)}{4 \pi} = \frac{1 + t}{2} ,
\\]
and indeed $X \sim \mathrm{Uniform}[-1, 1]$.

In comparison, when $(X_1, X_2)$ is uniform on $\mathbb{S}^1$, the
same technique shows that
\\[
	\mathbf{P}\\{X_1 \le t\\} = 1 - \frac{1}{\pi} \arccos(t) .
\\]
So, $X_1^2$ has the well-known arcsine distribution. This
illustrates that the case $d = 3$ is in fact special.
In general, if $X$ is the one-dimensional marginal of a uniform point
on $\mathbb{S}^{d - 1}$, then
\\[
	X^2 \sim \mathrm{Beta}\left(1, \frac{d - 1}{2} \right) .
\\]

It may be intuitively clear that if $(X_1, \dots, X_d)$ is uniform on
$\mathbb{S}^{d - 1}$, then for any index set $I \subseteq \{1, \dots,
d\}$ of size $k$, writing
\\[
	S = \sqrt{\sum\_{i \in I} X\_i^2} ,
\\]
then $(X\_i/S \colon i \in I)$ is uniformly distributed on the sphere
$\mathbb{S}^{k - 1}$. In English, uniform points on high-dimensional
spheres are uniform along every sub-sphere.

When $d = 3$, this makes some more sense. If we fix $X_1$, then
writing
\\[
	(X_1, X_2, X_3) = \left(X_1, \sqrt{1 - X_1^2} Y_2, \sqrt{1 - X_1^2} Y_3\right) ,
\\]
then $(Y_2, Y_3)$ is uniformly distributed on $\mathbb{S}^1$. Using
the fact that $X_1 \sim \mathrm{Uniform}[-1, 1]$, and our method from
the preceding section, we then have a method of generating uniform points
on $\mathbb{S}^2$ with only one square root.

<div id="S2gen" align="center" style="padding-bottom: 1em"></div>
<script type="text/javascript" src="/assets/2019-07-08-generating-without-complex-operations/S2gen.js">
</script>

Try dragging the sphere to rotate it with your mouse!

Is it possible to generate a uniform point on $\mathbb{S}^2$ without a
square root or other complex function? If so, is there a minimum $d$
for which it becomes impossible on $\mathbb{S}^{d - 1}$?

## The $(d - 1)$-sphere

The rejection method from earlier does not scale well with $d$ for
generating uniform points on higher-dimensional spheres. Indeed, the
volume of the unit $(d - 1)$-sphere is
\\[
	\frac{\pi^{d/2}}{\Gamma\left(\frac{d}{2} + 1\right)} \sim \frac{\pi^{d/2}}{\sqrt{\pi d} \left(\frac{d}{2e}\right)^{d/2}} ,
\\]
while the volume of the unit cube $[-1, 1]^d$ is $2^d$. So the average
number of rounds taken by the rejection algorithm is asymptotically
superexponential in $d$,
\\[
	\frac{2^d \sqrt{\pi d} \left(\frac{d}{2e}\right)^{d/2}}{\pi^{d/2}} .
\\]

When $d$ is even, we can avoid the rejection method using algorithm
based on uniform spacings, which we outline below.
~~~
U_1, U_2, ..., U_{d/2 - 1} = Uniform[0, 1]
V_1, V_2, ..., V_{d/2 - 1} = sort(U_1, U_2, ..., U_{d/2 - 1})

V_0 = 0, V_{d/2} = 1
for i = 1 to d/2:
    S_i = V_i - V_{i - 1}

for i = 1 to d/2:
    (X_i, Y_i) = Uniform(S^1)

return (X_1*sqrt(S_1), Y_1*sqrt(_1), X_2*sqrt(S_2), Y_2*sqrt(S_2), ..., X_{d/2}*sqrt(S_{d/2}), Y_{d/2}*sqrt(S_{d/2}))
~~~

I won't describe why this algorithm works, but I'll just note that it
uses $d/2$ square roots using our algorithm for generating uniform
points on $\mathbb{S}^1$, and can be made to run in expected time
$O(d)$.

[non-uniform]: http://nrbook.com/devroye/
[d3]: https://d3js.org
[box-muller]: https://en.wikipedia.org/wiki/Box-Muller_transform