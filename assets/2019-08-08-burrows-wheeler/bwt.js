{
      /*
  class Node {
    constructor(data) {
      this.data = data;
      this.prev = null;
      this.next = null;
    }
  }
  
  class LinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    
    find(value) {
      let curr = this.head;
      while (curr !== null) {
        if (curr.data === value)
          return curr;
        curr = curr.next;
      }
      return null;
    }
    
    remove(node) {
      if (node === null)
        return
      if (node.prev !== null)
        node.prev.next = node.next;
      else
        this.head = node.next;
      if (node.next !== null)
        node.next.prev = node.prev;
      else
        this.tail = node.prev;
      node.prev = node.next = null;
    }
    
    remove_value(value) {
      let node = this.find(value);
      if (node !== null)
        this.remove(node);
    }
    
    pop() {
      if (this.tail === null)
        return null;
      let val = this.tail.data;
      if (this.tail.prev === null) {
        this.head = null;
        this.tail = null;
      } else {
        let prev = this.tail.prev;
        prev.next = null;
        this.tail.prev = null;
        this.tail = prev;
      }
      return val;
    }
    
    push(node) {
      if (this.head === null) {
        this.head = this.tail = node;
      } else {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
      }
    }
    
    push_value(value) {
      let node = new Node(value);
      this.push(value);
    }
    
    unshift(node) {
      if (this.head === null) {
        this.head = this.tail = node;
      } else {
        this.head.prev = node;
        node.next = this.head;
        this.head = node;
      }
    }
    
    unshift_value(value) {
      let node = new Node(value);
      this.unshift(node);
    }
    
    shift() {
      if (this.head === null)
        return null;
      let val = this.head.data;
      if (this.head.next === null) {
        this.head = null;
        this.tail = null;
      } else {
        let next = this.head.next;
        next.prev = null;
        this.head.next = null;
        this.head = next;
      }
      return val;
    }
  }
function radix_sort(data, char_map) {
  let stack = [[0, 0, data.length]];
  while (stack.length > 0) {
    let curr = stack.pop();
    let piles = [];
    for (let i = curr[1]; i < curr[2]; ++i) {
      let j = char_map[data[i][curr[0]]];
      if (data[i].length === curr[0] + 1)
        (piles[j] || (piles[j] = [])).unshift(data[i]);
      else
        (piles[j] || (piles[j] = [])).push(data[i]);
    }
    for (let i = 0, ai = curr[1]; i < piles.length; ++i) {
      if (!piles[i]) continue;
      let next = [curr[0] + 1, ai, ai + piles[i].length]
      for (let j = 0; j < piles[i].length; ++j) {
        if (piles[i][j].length === curr[0] + 1)
          next[1]++;
        data[ai++] = piles[i][j];
      }
      if (next[1] < next[2] + 1)
        stack.push(next);
    }
  }
}
      */

    function get_alphabet(str) {
	let Sigma = new Set();
	for (let i = 0; i < str.length; ++i)
	    Sigma.add(str[i]);
	return Array.from(Sigma).sort();
    }

    function mtf(str, Sigma = null) {
	if (Sigma === null)
	    Sigma = get_alphabet(str);
	let compressed = [];
	for (let i = 0; i < str.length; ++i) {
	    let j = Sigma.indexOf(str[i]);
	    compressed.push(j);
	    Sigma.splice(j, 1);
	    Sigma.unshift(str[i])
	}
	return compressed;
    }

    function gamma(i) {
	return ("0".repeat(Math.floor(Math.log2(i + 1)))).concat((i + 1).toString(2));
    }

    function ungamma(stream) {
	let output = [];
	let j = 0;
	while ((j = stream.indexOf("1")) >= 0 && stream.length > 2*j) {
	    output.push(parseInt(stream.slice(j, 2*j + 1), 2) - 1);
	    stream = stream.slice(2*j + 1);
	}
	if (stream.length > 0)
	    return null;
	return output;//output.length === 1 ? output[0] : output;
    }

    function delta(i) {
	let N = Math.floor(Math.log2(i + 1));
	let L = Math.floor(Math.log2(N + 1));
	let bin = (i + 1).toString(2).slice(1);
	return "0".repeat(L) + (N + 1).toString(2) + bin;
    }

    function undelta(stream) {
	let output = [];
	let L = 0;
	while ((L = stream.indexOf("1")) >= 0) {
	    if (stream.length < 2*L + 1) return null;
	    let N = parseInt(stream.slice(L, 2*L + 1), 2) - 1;
	    if (stream.length < 2*L + 1 + N) return null;
	    output.push(parseInt("1" + stream.slice(2*L + 1, 2*L + 1 + N), 2) - 1);
	    stream = stream.slice(2*L + N + 1);
	}
	if (stream.length > 0)
	    return null;
	return output;//output.length === 1 ? output[0] : output;
    }

    function lyndon(str) {
	let fact = [-1],
	    fact_words = [],
	    k = -1;
	while (k < str.length - 1) {
	    let i = k + 1,
		j = k + 2;
	    while (j < str.length && str[i] <= str[j]) {
		if (str[i] === str[j]) {
		    i += 1;
		    j += 1;
		} else {
		    i = k + 1;
		    j += 1;
		}
	    }
	    do {
		k = k + j - i;
		fact_words.push(str.slice(fact[fact.length - 1] + 1, k + 1));
		fact.push(k);
	    } while (k < i);
	}
	return fact, fact_words;
    }

    function get_rotations(str) {
	let cycles = [];
	let cycle = str;
	for (let i = 0; i < str.length; ++i)
	    cycles.push(cycle = cycle.slice(1).concat(cycle[0]));
	return cycles;
    }

    function gcd(a, b) {
	while (a > 0 && b > 0 && a !== b) {
	    if (a > b)
		a -= b;
	    else
		b -= a;
	}
	if (a === 0)
	    return b;
	return a;
    }

    function lcm(a, b) {
	return a*b/gcd(a, b);
    }

    function compare_repeated(a, b) {
	for (let i = 0; i < lcm(a.length, b.length); ++i) {
	    if (a[i % a.length] < b[i % a.length])
		return -1;
	    else if (a[i % a.length] > b[i % b.length])
		return 1;
	}
	return 0;
    }

    function bwt(str) {
	let fact, fact_words = lyndon(str);
	let all_rotations = fact_words.reduce((o, i) => o.concat(get_rotations(i)), []);
	all_rotations.sort(compare_repeated);
	return all_rotations.reduce((o, i) => o + i[i.length - 1], "");
    }

    function get_char_map(Sigma) {
	let char_map = {};
	for (let i = 0; i < Sigma.length; ++i)
	    char_map[Sigma[i]] = i;
	return char_map;
    }

    function match(str, Sigma, char_map) {
	let theta = [];
	let counts = Array(Sigma.length).fill(0);
	for (let i = 0; i < str.length; ++i)
	    counts[char_map[str[i]]] += 1;
	let before = Array(Sigma.length).fill(0);
	for (let i = 1; i < Sigma.length; ++i)
	    before[i] = before[i - 1] + counts[i - 1];
	let seen = Array(Sigma.length).fill(0);
	for (let i = 0; i < str.length; ++i) {
	    theta.push(before[char_map[str[i]]] + seen[char_map[str[i]]]);
	    seen[char_map[str[i]]] += 1;
	}
	return theta;
    }

    function multithread(str, theta) {
	let T = theta.slice();
	let alpha = "";
	let i = str.length - 1;
	for (let j = 0; j < str.length; ++j) {
	    if (T[j] !== -1) {
		let k = j;
		do {
		    alpha = str[k] + alpha;
		    i -= 1;
		    let t = k;
		    k = T[k];
		    T[t] = -1;
		} while (T[k] !== -1);
	    }
	}
	return alpha;
    }

    function inv_bwt(str) {
	let Sigma = get_alphabet(str);
	let char_map = get_char_map(Sigma);
	let theta = match(str, Sigma, char_map);
	return multithread(str, theta);
    }

    function inv_mtf(stream, Sigma) {
	let data = undelta(stream);
	if (data === null || Math.max(...data) >= Sigma.length)
	    return null;
	let str = "";
	for (let i = 0; i < data.length; ++i) {
	    let j = data[i];
	    let c = Sigma[j];
	    str = str + c;
	    Sigma.splice(j, 1);
	    Sigma.unshift(c);
	}
	return str;
    }

    $(document).ready(function () {
	let orig = "",
	    orig_bwt = "",
	    orig_mtf = "",
	    bwt_mtf = "",
	    alphabet = [];
	let selection = "#input";
	let modified = true;
	$("#input").keyup(function () {
	    selection = "#input";
	    modified = true;
	})
	$("#bwt").keyup(function () {
	    selection = "#bwt";
	    modified = true;
	})
	$("#mtf").keyup(function () {
	    selection = "#mtf";
	    modified = true;
	})
	$("#mtfSigma").keyup(function () {
	    selection = "#mtf";
	    modified = true;
	})
	$("#bwtmtf").keyup(function () {
	    selection = "#bwtmtf";
	    modified = true;
	})
	$("#bwtmtfSigma").keyup(function () {
	    selection = "#bwtmtf";
	    modified = true;
	})
	$(".nav-tabs > li").click(function () {
	    if (modified) {
		if (selection === "#input") {
		    orig = $("#input").val();
		    alphabet = get_alphabet(orig);
		    let alphabet_str = alphabet.reduce((o, i) => o + i, "");
		    $("#mtfSigma").val(alphabet_str);
		    $("#bwtmtfSigma").val(alphabet_str);
		    orig_bwt = bwt(orig);
		    $("#bwt").val(orig_bwt);
		    orig_mtf = mtf(orig).reduce((o, i) => o + delta(i), "");
		    $("#mtf").val(orig_mtf);
		    $("#mtfCount").html(orig_mtf.length);
		    bwt_mtf = mtf(orig_bwt).reduce((o, i) => o + delta(i), "");
		    $("#bwtmtf").val(bwt_mtf);
		    $("#bwtmtfCount").html(bwt_mtf.length);
		} else if (selection === "#bwt") {
		    orig_bwt = $("#bwt").val();
		    alphabet = get_alphabet(orig_bwt);
		    let alphabet_str = alphabet.reduce((o, i) => o + i, "");
		    $("#mtfSigma").val(alphabet_str);
		    $("#bwtmtfSigma").val(alphabet_str);
		    orig = inv_bwt(orig_bwt);
		    $("#input").val(orig);
		    orig_mtf = mtf(orig).reduce((o, i) => o + delta(i), "");
		    $("#mtf").val(orig_mtf);
		    $("#mtfCount").html(orig_mtf.length);
		    bwt_mtf = mtf(orig_bwt).reduce((o, i) => o + delta(i), "");
		    $("#bwtmtf").val(bwt_mtf);
		    $("#bwtmtfCount").html(bwt_mtf.length);
		} else if (selection === "#mtf") {
		    let alphabet_str = $("#mtfSigma").val();
		    alphabet = Array.from(alphabet_str);
		    orig_mtf = $("#mtf").val();
		    $("#mtfCount").html(orig_mtf.length);
		    orig = inv_mtf(orig_mtf, alphabet);
		    if (orig !== null) {
			$("#bwtmtfSigma").val(alphabet_str);
			$("#input").val(orig);
			orig_bwt = bwt(orig);
			$("#bwt").val(orig_bwt);
			bwt_mtf = mtf(orig_bwt).reduce((o, i) => o + delta(i), "");
			$("#bwtmtf").val(bwt_mtf);
			$("#bwtmtfCount").html(bwt_mtf.length);
		    } else {
			orig = orig_bwt = bwt_mtf = "";
			$("#bwtmtfSigma").val("");
			$("#input").val(orig);
			$("#bwt").val(orig_bwt);
			$("#bwtmtf").val(bwt_mtf);
			$("#bwtmtfCount").html("");
		    }
		} else if (selection === "#bwtmtf") {
		    let alphabet_str = $("#bwtmtfSigma").val();
		    alphabet = Array.from(alphabet_str);
		    bwt_mtf = $("#bwtmtf").val();
		    $("#bwtmtfCount").html(bwt_mtf.length);
		    orig_bwt = inv_mtf(bwt_mtf, alphabet);
		    if (orig_bwt !== null) {
			$("#mtfSigma").val(alphabet_str);
			$("#bwt").val(orig_bwt);
			orig = inv_bwt(orig_bwt);
			$("#input").val(orig);
			orig_mtf = mtf(orig).reduce((o, i) => o + delta(i), "");
			$("#mtf").val(orig_mtf);
			$("#mtfCount").html(orig_mtf.length);
		    } else {
			orig = orig_bwt = orig_mtf = "";
			$("#mtfSigma").val("");
			$("#input").val(orig);
			$("#bwt").val(orig_bwt);
			$("#mtf").val(orig_mtf);
			$("#mtfCount").html("");
		    }
		}
		modified = false;
	    }
	});
    });
}
