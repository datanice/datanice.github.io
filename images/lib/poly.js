







rel.svg = d3.select("#svg").append("svg")
    .attr("id", "svg")
    .attr("width", 500)
    .attr("height", 500);

console.log("dd")

rel.g = rel.svg.append("g");



function genError(df) {
	var t = { abs : [],
			  rel : []};

	for(var i = 0; i <= 8; i += 0.01) {
		
		var rel_y = i*2,
			rel_x = i;

		t.rel.push([rel_x,rel_y]);
	}
	return t;

}
rel.t = genError(para.df);


var relt = rel.g.append("svg:path")
	.attr("d", rel.line(rel.t.rel))
	.attr("id","rel-line");