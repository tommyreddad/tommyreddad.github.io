{
    const width = 600,
	  height = 500,
	  insertDelay = 500,
	  pointRadius = 3,
	  n = 32,
	  margin = {top: 20, right: 20, bottom: 20, left: 20};

    const svg = d3.select("div#splay")
	  .append("svg")
	  .attr("class", "svg")
	  .style("width", `${width + margin.left + margin.right}px`)
	  .style("height", `${height + margin.top + margin.bottom}px`)
	  .style("font", "10px sans-serif");

    function search(node, value) {
	let current = node;
	while (current.data.type === "internal") {
	    if (value < current.data.value) {
		current = current.children[0];
	    } else if (value > current.data.value) {
		current = current.children[1];
	    } else {
		return current;
	    }
	}
	return current;
    }

    function findLink(u, v, links) {
	let l = links.filter(e => (u === e.source && v === e.target) || (v === e.source && u === e.target))[0]
	if (l.source.depth < l.target.depth) {
	    return [l, true]
	}
	return [l, false]
    }

    function splay(node, links) {
	// nothing should be done if this is the root
	if (node.parent !== null) {
	    let y = node.parent
	    if (node.parent.parent === null) {
		// zig step
		if (node === node.parent.children[0]) {
		    console.log("left zig")
		    let A = node.children[0]
		    let B = node.children[1]
		    let C = y.children[1]

		    let [linkxB, o] = findLink(node, B, links);
		    if (o)
			linkxB.source = y;
		    else
			linkxB.target = y;

		    B.parent = y
		    node.children[0] = A
		    node.children[1] = y
		    node.parent = null
		    y.children[0] = B
		    y.children[1] = C
		    y.parent = node
		} else {
		    console.log("right zig")
		    let A = y.children[0]
		    let B = node.children[0]
		    let C = node.children[1]

		    let [linkxB, o] = findLink(node, B, links);
		    if (o)
			linkxB.source = y;
		    else
			linkxB.target = y;

		    B.parent = y;
		    node.children[0] = y
		    node.children[1] = C
		    node.parent = null
		    y.children[0] = A
		    y.children[1] = B
		    y.parent = node
		}
	    } else {
		let z = y.parent
		if (node === y.children[0] && y === z.children[0]) {
		    console.log("left zig-zig")
		    // left zig-zig
		    let A = node.children[0]
		    let B = node.children[1]
		    let C = y.children[1]
		    let D = z.children[1]

		    let [linkxB, oxB] = findLink(node, B, links);
		    if (oxB)
			linkxB.source = y;
		    else
			linkxB.target = y;

		    let [linkyC, oyC] = findLink(y, C, links);
		    if (oyC)
			linkyC.source = z;
		    else
			linkyC.target = z;

		    node.children[0] = A;
		    node.parent = z.parent
		    node.children[1] = y
		    if (z.parent !== null) {
			let w = z.parent
			if (z === w.children[0]) {
			    w.children[0] = node
			} else {
			    w.children[1] = node
			}
			let [linkwz, owz] = findLink(w, z, links);
			if (owz)
			    linkwz.target = node;
			else
			    linkwz.source = node;
		    }
		    y.children[0] = B
		    y.children[1] = z
		    y.parent = node
		    z.children[0] = C
		    z.children[1] = D
		    z.parent = y
		    B.parent = y
		    C.parent = z
		} else if (node === y.children[1] && y === z.children[1]) {
		    console.log("right zig-zig")
		    // right zig-zig
		    let A = z.children[0]
		    let B = y.children[0]
		    let C = node.children[0]
		    let D = node.children[1]

		    let [linkxC, oxC] = findLink(node, C, links);
		    if (oxC)
			linkxC.source = y;
		    else
			linkxC.target = y;
		    let [linkyB, oyB] = findLink(y, B, links);
		    if (oyB)
			linkyB.source = z;
		    else
			linkyB.target = z;

		    node.parent = z.parent
		    node.children[0] = y
		    node.children[1] = D
		    if (z.parent !== null) {
			let w = z.parent
			if (z === w.children[0]) {
			    w.children[0] = node
			} else {
			    w.children[1] = node
			}
			let [linkwz, owz] = findLink(w, z, links);
			if (owz)
			    linkwz.target = node;
			else
			    linkwz.source = node;
		    }
		    y.children[0] = z
		    y.children[1] = C
		    y.parent = node
		    z.children[0] = A
		    z.children[1] = B
		    z.parent = y
		    B.parent = z
		    C.parent = y
		} else if (node === y.children[1] && y === z.children[0]) {
		    console.log("left zig-zag")

		    // left zig-zag
		    let A = y.children[0]
		    let B = node.children[0]
		    let C = node.children[1]
		    let D = z.children[1]

		    let [linkxB, oxB] = findLink(node, B, links);
		    if (oxB)
			linkxB.source = y;
		    else
			linkxB.target = y;
		    let [linkxC, oxC] = findLink(node, C, links);
		    if (oxC)
			linkxC.source = z;
		    else
			linkxC.target = z;
		    let [linkzy, ozy] = findLink(z, y, links);
		    if (ozy)
			linkzy.target = node;
		    else
			linkzy.source = node;

		    node.parent = z.parent
		    node.children[0] = y
		    node.children[1] = z
		    if (z.parent !== null) {
			let w = z.parent
			if (z === w.children[0]) {
			    w.children[0] = node
			} else {
			    w.children[1] = node
			}
			let [linkwz, owz] = findLink(w, z, links);
			if (owz)
			    linkwz.target = node;
			else
			    linkwz.source = node;
		    }
		    y.parent = node
		    y.children[1] = B
		    z.parent = node
		    z.children[0] = C
		    B.parent = y
		    C.parent = z
		} else {
		    console.log("right zig-zag")
		    // right zig-zag
		    let A = z.children[0]
		    let B = node.children[0]
		    let C = node.children[1]
		    let D = y.children[1]

		    let [linkxB, oxB] = findLink(node, B, links);
		    if (oxB)
			linkxB.source = z;
		    else
			linkxB.target = z;
		    let [linkxC, oxC] = findLink(node, C, links);
		    if (oxC)
			linkxC.source = y;
		    else
			linkxC.target = y;
		    let [linkzy, ozy] = findLink(z, y, links);
		    if (ozy)
			linkzy.target = node;
		    else
			linkzy.source = node;

		    node.parent = z.parent
		    node.children[0] = z
		    node.children[1] = y
		    if (z.parent !== null) {
			let w = z.parent
			if (z === w.children[0]) {
			    w.children[0] = node
			} else {
			    w.children[1] = node
			}
			let [linkwz, owz] = findLink(w, z, links);
			if (owz)
			    linkwz.target = node;
			else
			    linkwz.source = node;
		    }
		    y.children[0] = C
		    y.parent = node
		    z.children[1] = B
		    z.parent = node
		    B.parent = z
		    C.parent = y
		}
	    }
	}
    }

    function computeDepths(node) {
	let dfs_stack = [node];
	while (dfs_stack.length > 0) {
	    let top = dfs_stack.pop();
	    if (top.parent) {
		top.depth = top.parent.depth + 1
	    } else {
		top.depth = 0
	    }
	    if (top.children) {
		dfs_stack.push(...top.children)
	    }
	}
    }

    function unifperm(n) {
	let range = [...Array(n).keys()];
	for (let i = 0; i < range.length - 1; i++) {
	    let current = range[i];
	    let j = Math.floor(Math.random()*(range.length - i));
	    range[i] = range[j];
	    range[j] = current;
	}
	return range;
    }

    let inputValues = unifperm(n);

    const layoutTree = d3.tree()
	  .size([width, height]);
    const renderLink = d3.linkVertical()
	  .source(d => [d.source.x, d.source.y + (d.source.depth < d.target.depth ? 2 : -9)])
	  .target(d => [d.target.x, d.target.y + (d.source.depth < d.target.depth ? -9 : 2)]);

    const Node = d3.hierarchy.prototype.constructor;

    function addExternals(parent) {
	let u = Object.assign(new Node({type: "external"}), {parent, depth: parent.depth + 1});
	let v = Object.assign(new Node({type: "external"}), {parent, depth: parent.depth + 1});
	parent.children = [u, v];
	return parent.children;
    }

    let link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll(".link");
    let node = svg
        .append("g")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll(".node");

    var id = -1;
    var root = null;
    const nodes = [];
    const links = [];
    //const interval = d3.interval(() => {
    const round = () => {
	let selected = null;
	if (nodes.length >= 2*n + 1) {
	    let i = Math.floor(Math.random()*n)
	    selected = nodes.filter(e => e.data.value === i)[0]
	} else {
	    id += 1;
	    // Add a new node to a random parent.
	    if (root === null) {
		selected = root = new Node({type: "internal", value: inputValues[id]});
		nodes.push(root);
	    } else {
		selected = search(root, inputValues[id]);
		selected.data = {type: "internal", value: inputValues[id]};
	    }
	    console.log(root.depth)
	    const [u, v] = addExternals(selected);

	    nodes.push(u, v);
	    links.push({source: selected, target: u}, {source: selected, target: v});
	}

	const adjustLayout = () => {
	    // Recompute the layout.
	    layoutTree(root);

	    // Add entering nodes in the parent’s old position.
	    node = node.data(nodes);
	    node = node.enter()
	        .append("text")
	        .attr("x", d => d.parent ? d.parent.px : d.px = d.x)
	        .attr("y", d => d.parent ? d.parent.py : d.py = d.y)
	        .merge(node)
	        .text(d => d.data.type === "internal" ? d.data.value : "■")
	        .style("fill", d => d === selected ? "red" : "black")
	        .style("font", d => (d === selected) ? "bold 10px sans-serif" : "10px sans-serif");


	    // Add entering links in the parent’s old position.
	    link = link.data(links);
	    link = link.enter().insert("path", ".node")
	        .attr("class", "link")
	        .attr("d", d => {
		    const o = {x: d.source.px, y: d.source.py};
		    return renderLink({source: o, target: o});
		})
	        .merge(link)
	    //.attr("stroke", d => ancestors.includes(d.target) ? "red" : "black")
	    //.attr("stroke-width", d => ancestors.includes(d.target) ? 2 : 1);

	    // Transition nodes and links to their new positions.
	    const t = svg.transition()
	          .duration(insertDelay);
	    link.transition(t)
	        .attr("d", renderLink);
	    node.transition(t)
	        .attr("x", d => d.px = d.x)
	        .attr("y", d => d.py = d.y);
	}
	adjustLayout();
	const splayCallback = () => {
	    console.log("splaying")
	    splay(selected, links);
	    computeDepths(selected);
	    if (selected.parent === null) {
		console.log(`finished splaying ${selected.data.value}`)
		root = selected;
		adjustLayout();
		d3.timeout(round, 2*insertDelay);
		return false;
	    }
	    adjustLayout();
	    d3.timeout(splayCallback, insertDelay);
	    return true;
	}
	d3.timeout(splayCallback, insertDelay);
	return true;
    }
    d3.timeout(round, insertDelay);
}
