{
    const width = 200,
	  height = 200,
	  margin = {top: 20, right: 20, bottom: 20, left: 0};

    const svg = d3.selectAll("div#zigzig")
	  .append("svg")
	  .attr("class", "svg")
	  .style("width", `${2*width + margin.left + margin.right}px`)
	  .style("height", `${height + margin.top + margin.bottom}px`)
	  .style("font", "bold 12px sans-serif");

    const layoutTree = d3.tree()
	  .size([width, height]);
    const renderLink = d3.linkVertical()
	  .source(d => [d.source.x, d.source.y + 5])
	  .target(d => [d.target.x, d.target.y - 12]);

    const Node = d3.hierarchy.prototype.constructor;

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

    let z = new Node({type: "internal", value: 'z'});
    z.depth = 0;
    let y = new Node({type: "internal", value: 'y'});
    y.depth = 1;
    y.parent = z;
    let x = new Node({type: "internal", value: 'x'});
    x.depth = 2;
    x.parent = y;
    let A = new Node({type: "external", value: 'A'});
    A.depth = 3;
    A.parent = x;
    let B = new Node({type: "external", value: 'B'});
    B.depth = 3;
    B.parent = x;
    let C = new Node({type: "external", value: 'C'});
    C.depth = 2;
    C.parent = y;
    let D = new Node({type: "external", value: 'D'});
    D.depth = 1;
    D.parent = z;
    const nodes = [z, y, x, A, B, C, D];
    z.children = [y, D]
    y.children = [x, C]
    x.children = [A, B]
    const links = [{source: y, target: x}, {source: y, target: C}, {source: x, target: A}, {source: x, target: B}, {source: z, target: y}, {source: z, target: D}];
    layoutTree(z)

    node = node.data(nodes);
    node = node.enter()
        .append("text")
        .text(d => d.data.value)
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .style("fill", d => (d.data.type === "external") ? "gray" : "black")
	.merge(node)

    link = link.data(links);
    link = link.enter().insert("path", ".node")
        .attr("class", "link")
        .attr("d", renderLink)
	.merge(link)

    let offset = width + margin.left;
    let linksplay = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("transform", "translate(" + offset + "," + margin.top + ")")
        .selectAll(".linksplay");
    let nodesplay = svg
        .append("g")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + offset + "," + margin.top + ")")
        .selectAll(".nodesplay");

    let zs = new Node({type: "internal", value: 'z'});
    zs.depth = 2;
    let ys = new Node({type: "internal", value: 'y'});
    ys.depth = 1;
    zs.parent = ys;
    let xs = new Node({type: "internal", value: 'x'});
    xs.depth = 0;
    ys.parent = xs;
    let As = new Node({type: "external", value: 'A'});
    As.depth = 1;
    As.parent = xs;
    let Bs = new Node({type: "external", value: 'B'});
    Bs.depth = 2;
    Bs.parent = ys;
    let Cs = new Node({type: "external", value: 'C'});
    Cs.depth = 3;
    Cs.parent = zs;
    let Ds = new Node({type: "external", value: 'D'});
    Ds.depth = 3;
    Ds.parent = zs;
    const nodesplays = [zs, ys, xs, As, Bs, Cs, Ds];
    zs.children = [Cs, Ds]
    ys.children = [Bs, zs]
    xs.children = [As, ys]
    const linksplays = [{source: xs, target: As}, {source: xs, target: ys}, {source: ys, target: Bs}, {source: ys, target: zs}, {source: zs, target: Cs}, {source: zs, target: Ds}];
    layoutTree(xs)

    nodesplay = nodesplay.data(nodesplays);
    nodesplay = nodesplay.enter()
        .append("text")
        .text(d => d.data.value)
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .style("fill", d => (d.data.type === "external") ? "gray" : "black")
	.merge(nodesplay)

    linksplay = linksplay.data(linksplays);
    linksplay = linksplay.enter().insert("path", ".nodesplay")
        .attr("class", "linksplay")
        .attr("d", renderLink)
	.merge(linksplay)
}
