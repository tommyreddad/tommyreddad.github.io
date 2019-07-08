{
    var CONTENT_DIM = 400,
	POINT_RADIUS = 2,
	INSERT_DELAY = 100,
	n = 250,

	graticule = d3.geoGraticule(),
	rotate = {
	    x: 90,
	    y: 45
	},
	radius = CONTENT_DIM / 2 - 2,
	projection = d3.geoOrthographic()
        .translate([CONTENT_DIM / 2, CONTENT_DIM / 2])
        .clipAngle(90)
        .rotate([rotate.x / 2, -rotate.y / 2])
        .scale(radius),
	path = d3.geoPath()
        .projection(projection)
        .pointRadius(POINT_RADIUS),
	svg = d3.select("div#S2gen")
        .insert("svg")
        .attr("width", CONTENT_DIM)
        .attr("height", CONTENT_DIM),
	point = svg.selectAll("path.point")


    svg.append("path")
        .style("fill", "none")
        .attr("class", "graticule")
        .style("stroke", "#999")
        .style("stroke-width", ".5px")
        .datum(graticule)
        .attr("d", path)

    svg.append("circle")
        .datum(rotate)
        .attr("class", "mouse")
        .style("fill", "none")
        .style("stroke", "black")
        .style("cursor", "move")
        .style("pointer-events", "all")
        .attr("transform", "translate(" + [CONTENT_DIM / 2, CONTENT_DIM / 2] + ")")
        .attr("r", radius)
        .call(d3.drag(projection)
	      .on("drag", function(d) {
		  projection.rotate([(d.x = d3.event.x) / 2, -(d.y = d3.event.y) / 2])
		  svg.selectAll("path").attr("d", path)
	      }))

    function uniform() {
	let points = []
	return function() {
	    let c = 0,
		distance = 0
	    do {
		c = [2.0 * Math.random() - 1.0, 2.0 * Math.random() - 1.0]
		distance = c[0] * c[0] + c[1] * c[1]
	    } while (distance > 1)
	    c = [(c[0] * c[0] - c[1] * c[1]) / distance, 2.0 * c[0] * c[1] / distance]
	    let X1 = 2.0 * Math.random() - 1.0,
		X2 = Math.sqrt(1 - X1 * X1) * c[0],
		X3 = Math.sqrt(1 - X1 * X1) * c[1]
	    // (X1, X2, X3) are Cartesian coordinates for a uniform point
	    // on S2. We need to convert them to spherical coordinates
	    // for D3 rendering.

	    points.push({
		type: "Point",
		coordinates: [Math.atan2(X3, X2) * 180 / Math.PI, Math.acos(X1) * 180 / Math.PI - 90]
	    })
	    if (points.length > n) points.shift()
	    return points
	}
    }
    let uniformGenerator = uniform()

    d3.interval(function() {
	point = point.data(uniformGenerator(), d => d)
	    .join(enter => enter.append("path")
		  .attr("class", "point")
		  .attr("d", path)
		  .style("fill", "black"),
		  exit => exit.remove())
    }, INSERT_DELAY)
}
