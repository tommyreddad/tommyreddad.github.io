{
    let CONTENT_DIM = 400, // The width/height of the content
	PADDING = 20, // Must be >0 for axis ticks to be drawn properly
	POINT_RADIUS = 2,
	INSERT_DELAY = 250,
	n = 150,

	effectiveDim = CONTENT_DIM + 2 * PADDING,
	svg = d3.select("div#S1gen")
        .append("svg")
        .attr("class", "svg")
        .style("width", `${effectiveDim}px`)
        .style("height", `${effectiveDim}px`)
        .style("background", "white"),
	point = svg.selectAll("g.pointGroup")

    svg.append("circle")
        .attr("r", `${CONTENT_DIM/2}`)
        .attr("cx", `${effectiveDim/2}px`)
        .attr("cy", `${effectiveDim/2}px`)
        .style("fill", "none")
        .style("stroke", "#999")
        .style("stroke-width", "0.5px")
        //.attr("stroke-dasharray", "2 5")

    let scale = d3.scaleLinear()
        .domain([-1.0, 1.0])
        .range([PADDING, CONTENT_DIM + PADDING])
    let ticks = d3.ticks(-1.0, 1.0, 8)
    ticks.splice(ticks.indexOf(0.0), 1) // Remove the origin to avoid overlap
    svg.append("g")
        .attr("transform", `translate(0, ${effectiveDim/2})`)
        .call(d3.axisBottom(scale)
	      .tickValues(ticks))
    // Flip the Y-axis orientation
    svg.append("g")
        .attr("transform", `translate(${effectiveDim/2}, 0)`)
        .call(d3.axisRight(scale.domain([1.0, -1.0]))
	      .tickValues(ticks))

    function toPixel(x) {
	return parseInt(PADDING + x * CONTENT_DIM)
    }

    function leaveShadow(selection, d, color) {
	selection.append("circle")
	    .attr("class", "pointShadow")
	    .attr("cx", d => toPixel(d[0]))
	    .attr("cy", d => toPixel(d[1]))
	    .attr("r", 2)
	    .style("fill", color)
    }

    function uniform() {
	let points = []
	return function() {
	    let newPoint = [Math.random(), Math.random()]
	    points.push(newPoint)
	    if (points.length > n) points.shift()
	    return points
	}
    }
    let uniformGenerator = uniform()

    function transformOrigin(d) {
	return [2.0 * d[0] - 1.0, 2.0 * d[1] - 1.0]
    }

    function transformFirstQuadrant(d) {
	return [(d[0] + 1.0) / 2.0, (d[1] + 1.0) / 2.0]
    }

    function project(d) {
	let c = transformOrigin(d)
	let distance = c[0] * c[0] + c[1] * c[1]

	if (distance > 1) {
	    // Leave a RED shadow, point is rejected
	    d3.select(this)
	        .call(leaveShadow, d, "lightcoral")
	} else {
	    // Leave a GRAY shadow, point is accepted
	    d3.select(this)
	        .call(leaveShadow, d, "lightgray")

	    // Perform transition, project onto circle
	    const t = svg.transition().duration(500)
	    distance = Math.sqrt(distance)
	    c = [c[0] / distance, c[1] / distance]
	    c = transformFirstQuadrant(c)

	    d3.select(this)
	        .append("circle")
	        .attr("class", "point")
	        .attr("cx", toPixel(d[0]))
	        .attr("cy", toPixel(d[1]))
	        .attr("r", POINT_RADIUS)
	        .transition(t)
	        .attr("cx", toPixel(c[0]))
	        .attr("cy", toPixel(c[1]))
	}
    }

    d3.interval(function() {
	point = point.data(uniformGenerator(), d => d)
	    .join(enter => enter.append("g")
		  .attr("class", "pointGroup")
		  .each(project),
		  exit => exit.remove())
    }, INSERT_DELAY)
}
