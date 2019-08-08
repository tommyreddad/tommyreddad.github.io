---
layout: post
title: The Burrows-Wheeler transform and move-to-front compression
use_math: true
use_bootstrap: true
tags: compression algorithms
---

<style type="text/css">
.bitContent {
  display: inline;
  }
.bitCount {
  display: inline;
 	    font-family: Monaco, Menlo, Consolas, "Courier New", DotumChe, monospace;
  }
.bitCountLabel {
  font-weight: 700;
    display: inline;
      padding-right: 10px;
      }
.alphabetContent {
  display: table-cell;
    width: 100%;
      border: 1px solid #e1e1e1;
        margin-bottom: 16px;
		    font-family: Monaco, Menlo, Consolas, "Courier New", DotumChe, monospace;
	}
.alphabet {
  display: table;
    width: 100%;
    }
label {
  font-weight: 700;
    display: table-cell;
      width: 1px;
        padding-right: 10px;
	}
textarea {
  width: 100%;
    display: block;
      height: 300px;
        border: 1px solid #e1e1e1;
	  margin: 0 0 10px;
	    padding: 10px;
	    font-family: Monaco, Menlo, Consolas, "Courier New", DotumChe, monospace;
	    }
.tab-pane {
  min-height: 300px;
  }
.nav-tabs {
  margin: 19px 0px 18px;
    visibility: visible;
      border-bottom: 1px solid #ddd;
      }
.nav-tabs > li.active {
  font-weight: 700;
  }
.nav-tabs > li {
  float: left;
    margin-bottom: -1px;
    }
.tab-content {
  margin-bottom: 10px;
  }
</style>
<ul class="nav nav-tabs">
<li class="active"><a data-toggle="tab" href="#inputContents">Input</a></li>
<li><a data-toggle="tab" href="#bwtContents">BWT</a></li>
<li><a data-toggle="tab" href="#mtfContents">MTF</a></li>
<li><a data-toggle="tab" href="#bwtmtfContents">BWT + MTF</a></li>
</ul>
<div class="tab-content">
<div id="inputContents" class="tab-pane active">
<textarea id="input" placeholder="Text to compress..."></textarea>
</div>
<div id="bwtContents" class="tab-pane">
<textarea id="bwt" placeholder="Burrows-Wheeler transform to invert..."></textarea>
</div>
<div id="mtfContents" class="tab-pane">
<div class="alphabet">
<label for="mtfSigma">Alphabet: </label>
<input class="alphabetContent" type="text" id="mtfSigma">
</div>
<textarea id="mtf" placeholder="MTF-compressed binary to decode..."></textarea>
<div class="bitCount">
<div class="bitCountLabel">Bit count: </div><div class="bitContent" id="mtfCount"></div>
</div>
</div>
<div id="bwtmtfContents" class="tab-pane">
<div class="alphabet">
<label for="bwtmtfSigma">Alphabet: </label>
<input class="alphabetContent" type="text" id="bwtmtfSigma">
</div>
<textarea id="bwtmtf" placeholder="BWT+MTF-compressed binary to decode..."></textarea>
<div class="bitCount">
<div class="bitCountLabel">Bit count: </div><div class="bitContent" id="bwtmtfCount"></div>
</div>
</div>
</div>
<script type="text/javascript" src="/assets/2019-08-08-burrows-wheeler/bwt.js"></script>

The above form implements algorithms to code and decode from the
move-to-front compression scheme, with or without an additional
application of the Burrows-Wheeler transform. These extremely slick
algorithms blew my mind when I first heard of them. They are currently
in use, among other places, in
[bzip2](https://en.wikipedia.org/wiki/Bzip2) file compression.

[Move-to-front](https://en.wikipedia.org/wiki/Move-to-front_transform)
is a natural and elegant compression scheme for encoding streams of
data into a binary sequence, which performs particularly well when its
input has many repetitions. In general, move-to-front is optimal in
the sense that the length of its output sequence asymptotically
attains at most a constant factor of the empirical entropy of the
input stream.

We first suppose that our input stream has characters drawn from the
alphabet $\Sigma$; for binary inputs, $\Sigma = \{0, 1\}$. If the
encoder and decoder were both aware of the alphabet maintained in a
fixed and agreed upon order, then we could encode the input stream by
simply sending the stream of indices in the alphabet corresponding to
each character. For example, with the alphabet $\Sigma = (a, b, c,
\dots, z)$, we could represent the message `mississippi` with the
sequence of indices `13, 9, 19, 19, 9, 19, 19, 9, 16, 16,
9`.

Move-to-front makes the simple change over this trivial scheme that
each time a character is polled, it is moved to the front of the
alphabet. For example, in the first step of encoding `mississippi`,
the alphabet $\Sigma$ is scanned from left to right until the symbol
`m` is encountered in the 13-th index, so we write `13` and move `m`
to the front of the alphabet, which now becomes $\Sigma = (m, a, b, c,
\dots, l, n, \dots, z)$. Each step of encoding `mississippi` is
detailed below:

* `m` index `13`, $\Sigma = (m, a, b, \dots, z)$.
* `i` index `10`, $\Sigma = (i, m, a, b, \dots, z)$.
* `s` index `19`, $\Sigma = (s, i, m, a, b, \dots, z)$.
* `s` index `1`, $\Sigma = (s, i, m, a, b, \dots, z)$.
* `i` index `2`, $\Sigma = (i, s, m, a, b, \dots, z)$.
* `s` index `2`, $\Sigma = (s, i, m, a, b, \dots, z)$.
* `s` index `1`, $\Sigma = (s, i, m, a, b, \dots, z)$.
* `i` index `1`, $\Sigma = (i, s, m, a, b, \dots, z)$.
* `p` index `17`, $\Sigma = (p, i, s, m, a, b, \dots, z)$.
* `p` index `1`, $\Sigma = (p, i, s, m, a, b, \dots, z)$.
* `i` index `2`, $\Sigma = (i, p, s, m, a, b, \dots, z)$.

With move-to-front, `mississippi` is thus encoded with the sequence
`13, 10, 19, 1, 2, 2, 1, 1, 17, 1, 2`. In comparison with the trivial
scheme, this has drastically reduced the magnitude of frequently used
characters.

We still have to encode the integers in this index sequence. When we
know that these indices are bounded within some range, as they are in
this case between $1$ and $|\Sigma|$, it is common to use a
fixed-width encoding; in computing terms, each character is
represented using a fixed number of bits or bytes. However, in order
to take advantage of the magnitude reduction of indices in
move-to-front, it is judicious to make use of a variable-length
encoding. We focus here on Elias codes.

The Elias codes are each prefix-free codes of natural numbers. A code
is prefix-free if no codeword is the prefix of another. Note that it
is possible to decode a sequence of codewords from a prefix-free code
immediately once each new codeword is encountered. The simplest
prefix-free code for natural numbers is the *unary code*, where the
integer `i` is encoded using a sequence of $i - 1$ `0` characters,
followed by a single `1`. This last `1` is necessary to delimit
codewords in order to make the code prefix-free. It's obvious that the
unary codeword for $i$ has length $i$.

The Elias $\gamma$-code is another prefix-free code of natural
numbers. Observe first that the binary codeword for the integer `i`
has length $\lfloor \log\_2 i \rfloor + 1$ bits, and the
most-significant bit here is always a `1`. This by itself is not a
prefix-free code. The Elias $\gamma$-code prepends a sequence of
$\lfloor \log\_2 i \rfloor$ `0` bits to the binary codeword for `i`,
thereby creating a prefix-free code of length $2 \lfloor \log\_2 i
\rfloor + 1$ for the integer `i`.

In principle, the Elias $\gamma$-code presents the number $\lfloor
\log\_2 i \rfloor + 1$ in a unary encoding through the most
significant bits of the codeword for `i`, which tells us the remaining
bits to be read in order to guarantee prefix-freeness. If we encode
this integer instead with an Elias $\gamma$-code itself instead of
unary, then we obtain the Elias $\delta$-code. For the integer $i$,
the Elias $\delta$-code has length $\log\_2 i + O(\log \log i)$. It's
actually possible to iterate this process as much as possible to
obtain the Elias $\omega$-code, but the Elias $\delta$-code is
powerful enough for most purposes that the $\omega$-code is rarely
used, even in theoretical works.

You can try to use the form at the top of this post to encode
`mississippi` in move-to-front with Elias $\delta$-codes, by typing it
in the input tab and switching to the MTF tab.

There is one simple and reversible transformation which we can make to
the input in order to greatly improve move-to-front compression
performance on highly structured inputs: this is the [Burrows-Wheeler
transform](https://en.wikipedia.org/wiki/Burrows%E2%80%93Wheeler_transform). Simply
put, the Burrows-Wheeler transform of an input string `str` takes all
all cyclic rotations of the string `str + $`, where `$` is an
otherwise unused character, and sorts these rotations in lexicographic
order, taking the last character of each of these sorted
rotations.

It's not hard to see why this transform can be inverted. But why
should it help in move-to-front compression for structured input? As
stated on Wikipedia,
> To understand why this creates more-easily-compressible data, consider transforming a long English text frequently containing the word "the". Sorting the rotations of this text will group rotations starting with "he " together, and the last character of that rotation (which is also the character before the "he ") will usually be "t", so the result of the transform would contain a number of "t" characters along with the perhaps less-common exceptions (such as if it contains "Brahe ") mixed in. So it can be seen that the success of this transform depends upon one value having a high probability of occurring before a sequence, so that in general it needs fairly long samples (a few kilobytes at least) of appropriate data (such as text).

There are bijective variants of the Burrows-Wheeler transform, which
don't require the introduction of a new character at the end of the
input; I implemented the variant of [Gil and
Scott](http://bijective.dogma.net/00yyy.pdf) in the form at the top of
this post.

So how well does this perform? The text above this paragraph, encoded
with move-to-front by itself, takes 42260 bits. With the addition of
the Burrows-Wheeler transform, this is brought all the way down to
21452 bits, almost half as many!