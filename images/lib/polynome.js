





var datanice = {};
datanice.darkBlue = "#114B5F"
datanice.darkGreen = "#1A936F"
datanice.lightGreen = "#88D498"
datanice.lightBlue = "#6ACEEB"
datanice.grey = "#C6DABF"
datanice.lightGrey = "#F3E9D2"

function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

datanice.Parent = function(){
	this.param = 5
	console.log("parent construct")

};
datanice.Parent.prototype.consolih = function(){
	console.log("fff")
}
datanice.Child = function(){
datanice.Parent.call(this)
this.param2 = 6
};
extend(datanice.Child,datanice.Parent);



datanice.Plot = function() {

};
datanice.FunctionPlot = function(){

};
datanice.Grid = function(params,parent){
	if (parent) {	
		this.container = parent.container;
		this.svg = parent.svg;
	}
	this.params = params;
	this.setScale(this.params)
	this.setLine()
	var gElement = document.createElementNS(d3.namespaces.svg, 'g');
	this.element = d3.select(gElement).attr("transform", "translate(" + this.params.margin.left + "," + this.params.margin.top + ")");
	this.xAx =  this.element.append("g");
 	this.yAx = this.element.append("g");


	this.gridX = this.element.append("g")         
	this.gridY = this.element.append("g")         
	this.setAxis()


	this.lab = this.element.append("svg:text")
		.attr("class", "")
		.attr("text-anchor", "middle")
		.style("height", 20)
		.attr("x", this.x_scale(4))
		.attr("y", this.params.h + this.params.margin.bottom -5)

	this._setElement(this.element)
};


datanice.Grid.prototype.setScale = function() {
	this.x_scale = d3.scaleLinear()
	        .range([0, this.params.w])
	        .domain([0,this.params.maxX]);

	this.y_scale = d3.scaleLinear()
	        .range([this.params.h, 0])
	        .domain([0,this.params.maxY]);
};
datanice.Grid.prototype.setLine = function() {
	var x_scale = this.x_scale;
	var y_scale = this.y_scale;
	this.line = d3.line()
				.x(function(d) { 
				 return	x_scale(d[0])

				})
				.y(function(d) { 
					return y_scale(d[1]);
				});	
};

datanice.Grid.prototype.setAxis = function() {
	this.xAxis = d3.axisBottom()
	    .scale(this.x_scale)
	    .ticks(5);

	this.yAxis = d3.axisLeft()
	    .scale(this.y_scale)
	    .ticks(5);	

	this.xAx
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.params.h + ")")
      .call(this.xAxis);

 	this.yAx
      .attr("class", "y axis")
      .call(this.yAxis);

  this.gridX        
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.params.h + ")")
      .call(this.xAxis
          .tickSize(-this.params.h, 0, 0)
          .tickFormat("")
      );
  if (this.hidingGridX){
  	this.gridX.style("opacity",0)
  	this.xAx.style("opacity",0)
  }

	this.gridY
      .attr("class", "grid")
      .call(this.yAxis
          .tickSize(-this.params.w, 0, 0)
          .tickFormat("")
      );

  if (this.hidingGridY){
  	this.gridY.style("opacity",0)
  	this.yAx.style("opacity",0)
  }
};

datanice.Grid.prototype.hideGridX = function() {
	this.hidingGridX = true;
	// this.resize()
}

datanice.Grid.prototype.hideGridY = function() {
	this.hidingGridY = true;
	// this.resize()
}

datanice.Grid.prototype.getNodeFunction = function() {
	var node = this.element.node();
	return function() {
		return node
	}
}

datanice.Grid.prototype._setElement = function(element) {
	this.element = element;
}

datanice.Grid.prototype.append = function(element) {
	return this.element.append(element)
}
datanice.Grid.prototype.resize = function(element) {
  this.params.w = parseInt(d3.select(this.container).style('width'), 10) - this.params.margin.left - this.params.margin.right;
  // this.params.h = parseInt(d3.select(this.container).style('height'), 10) - this.params.margin.top - this.params.margin.bottom;
  this.setScale()
  this.svg
  .attr("width", this.params.w + this.params.margin.left + this.params.margin.right)
  .attr("height", this.params.h + this.params.margin.top + this.params.margin.bottom)
  this.setAxis()

	this.lab
		.attr("x", this.x_scale(2.5))
		.attr("y", this.params.h + this.params.margin.bottom -5)
	this.setLine();
}


datanice.RegularizationPlot = function(container,params,plotPoints) {
	this.container = "#"+container;
	this.svg = d3.select(this.container).append("svg")
    .attr("width",params.w + params.margin.left + params.margin.right)
    .attr("height",params.h + params.margin.top + params.margin.bottom);
	this.grid = new datanice.Grid(params,this)
	this.svg.append(this.grid.getNodeFunction())

	function genFunction(result) {
		var t = [];
		for(var i = 0; i <= params.maxX; i += 0.01) {	
			var line_y = 0
			for (var j=0; j < result.equation.length; j++) {
				line_y = line_y + result.equation[j]*Math.pow(i,j)
			}		
			var line_x = i;
			t.push([line_x,line_y]);
		}
		return t;
	}

	this.t = genFunction(plotPoints);
	this.path = this.grid.append("svg:path")
		.attr("fill","none")
		.attr("stroke",datanice.darkBlue)
		.attr("stroke-width","3px")
		.attr("d", this.grid.line(this.t))
		.attr("id","function-line");
		console.log(plotPoints)
	this.grid.lab.text("Polynomial : Degree " + (plotPoints.equation.length-1))
};

datanice.RegularizationPlot.prototype.resize = function() {
	this.grid.resize();
	this.path.attr("d", this.grid.line(this.t))

	var x_scale = this.grid.x_scale;
	var y_scale = this.grid.y_scale;
	this.grid.element.selectAll("circle")
	.attr("cx",function(d){return x_scale(d[0])})
	.attr("cy",function(d){return y_scale(d[1])})
}
datanice.RegularizationPlot.prototype.addPoints = function(data) {
	var x_scale = this.grid.x_scale;
	var y_scale = this.grid.y_scale;
	this.grid.element.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx",function(d){return x_scale(d[0])})
	.attr("cy",function(d){return y_scale(d[1])})
	.attr("r",5)
	.style("fill",datanice.lightBlue);
}

datanice.RegularizationBarPlot = function(container,params,data,d,lambda) {
	this.container = "#"+container;
	this.svg = d3.select(this.container).append("svg")
		.attr("width",params.w + params.margin.left + params.margin.right)
    .attr("height",params.h + params.margin.top + params.margin.bottom);
	
	var texture = textures.lines()
    .size(8)
    .strokeWidth(4).stroke(datanice.lightGreen);
  
  this.svg.append("g").call(texture);


	this.grid = new datanice.Grid(params,this)
	this.grid.hideGridX();
	this.svg.append(this.grid.getNodeFunction())

	this.data = data
	var obj = this.getDataForRegression(data,d,lambda);
	var grid = this.grid;
	var x_scale = this.grid.x_scale;
	var y_scale = this.grid.y_scale;

	// fills

	this.width = 100
	this.rects = this.grid.element.selectAll("rect")
    .data(function(d) { return obj; })
    .enter().append("rect")
    .attr("width", this.width)
		.attr("y", function(d) {return y_scale(d.y0); })
    .attr("height", function(d) {return grid.params.h -y_scale(-d.y1 + d.y0); })
    .style("fill", function(d,i) { if(i==0) {return texture.url()} else{return datanice.darkBlue}});
};



datanice.RegularizationBarPlot.prototype.getDataForRegression = function(data,d,lambda) {
	this.result = regression('polynomial', data,d);
	var error = 0
	for(var i = 0; i < data.length; i++) {	
		var point_value = 0
		for (var j=0; j < this.result.equation.length; j++) {
			point_value = point_value + this.result.equation[j]*Math.pow(data[i][0],j);
		}		
		error = error + Math.pow(Math.abs(point_value-data[i][1]),2);
	}
	this.error = error/data.length;
	// console.log("error",error)
	var complexityTerm = this.getComplexity(lambda)
	return this.getBarData(this.error,complexityTerm)
}

datanice.RegularizationBarPlot.prototype.getComplexity = function(lambda) {
	var complexityTerm = 0;
	// console.log(this.result)
	for (var j=1; j < this.result.equation.length; j++) {
			complexityTerm = complexityTerm + lambda*Math.pow(this.result.equation[j],2);
	}
	this.complexityTerm = complexityTerm/(40*this.data.length)
	return this.complexityTerm;
}

datanice.RegularizationBarPlot.prototype.getTotalCost = function(lambda) {
	var totalCost = 0
	if (this.complexityTerm) {
		totalCost += this.complexityTerm
	} else {
		totalCost += this.getComplexity(lambda)
	}
	totalCost += this.error;
	return totalCost;
}

datanice.RegularizationBarPlot.prototype.sliderChange = function(lambda) {
	var complexityTerm = this.getComplexity(lambda);
	var barData = this.getBarData(this.error,complexityTerm)

	var grid = this.grid

	var y_scale = this.grid.y_scale;
  this.rects
  	.data(barData)
    .transition()
		.attr("y", function(d) {return y_scale(d.y0); })
    .attr("height", function(d) {return grid.params.h -y_scale(-d.y1 + d.y0); })
}

datanice.RegularizationBarPlot.prototype.getBarData = function(error,complexityTerm) {
	return [{y0:error+complexityTerm,y1:error},{y0:error,y1:0}]
}
datanice.RegularizationBarPlot.prototype.resize = function() {
	this.grid.resize()
	var grid = this.grid
	var y_scale = this.grid.y_scale;
	this.width = grid.params.w*8/10
	this.rects
		.attr("width",this.width)
		.attr("x",(grid.params.w - this.width)/2)
		.attr("y", function(d) {return y_scale(d.y0); })
    .attr("height", function(d) {return grid.params.h -y_scale(-d.y1 + d.y0); });
}

datanice.BarPlotGroup = function(list){
	this.barPlotGroup = list;
	
}
datanice.BarPlotGroup.prototype.sliderChange = function(lambda){
	var totalCost =[]
	for (var i = 0; i< this.barPlotGroup.length ; i ++) {
		this.barPlotGroup[i].sliderChange(lambda)
		totalCost[i]=Math.round(this.barPlotGroup[i].getTotalCost(lambda)*10000);
	};
	var width = this.barPlotGroup[0].grid.params.w + this.barPlotGroup[0].grid.params.margin.left + this.barPlotGroup[0].grid.params.margin.right;
	this.indexMin = totalCost.indexOf(Math.min(totalCost[0],totalCost[1],totalCost[2]));
	bounce = new datanice.JellyEffect();
	this.bestBox =document.querySelectorAll(".jelly-best-target")
	this.bestBox[0].setAttribute("style","opacity:1;margin-left:"+(width*this.indexMin+70)+"px");
	bounce.applyTo(this.bestBox);
	document.getElementById("lambdaValue").innerHTML = lambda;
	console.log(document.getElementById("lambdaValue"))
}

datanice.BarPlotGroup.prototype.resize = function() {
	for (var i = 0; i< this.barPlotGroup.length ; i ++) {
		this.barPlotGroup[i].resize()
	};
	var width = this.barPlotGroup[0].grid.params.w + this.barPlotGroup[0].grid.params.margin.left + this.barPlotGroup[0].grid.params.margin.right;
	var indexMin = this.indexMin;
	this.bestBox =document.querySelectorAll(".jelly-best-target")
	this.bestBox[0].setAttribute("style","margin-left:"+(width*this.indexMin+70)+"px");
}

datanice.JellyEffect = function() {
	var bounce = new Bounce();
	bounce
  .scale({
    from: { x: 1, y: 0.5 },
    to: { x: 1, y: 1 },
    easing: "bounce",
    duration: 1000,
    delay: 0,
    stiffness: 1,
    bounces :4
  })
  .scale({
    from: { x: 0.5, y: 1},
    to: { x: 1, y: 1 },
    easing: "bounce",
    duration: 1000,
    delay: 0,
    stiffness: 4,
    bounces :6
  })
  return bounce;
}

datanice.focusEffect = function() {
	var bounce = new Bounce();
	bounce
  .scale({
    from: { x: 1.3, y: 1.3 },
    to: { x: 1, y: 1 },
    easing: "bounce",
    duration: 2000,
    delay: 0,
    stiffness: 1,
    bounces :1
  })
  return bounce;
}

var init = function() {
	var params = {}
	params.maxX= 5
	params.maxY = 5
	params.w= 300
	params.h = 100
	params.margin = {}
	params.margin.bottom = 60
	params.margin.top = 20
	params.margin.left = 30
	params.margin.right = 20


  var data = [[0.8,0.9],[1,2],[2.5,3.2],[4, 3],[5, 3]];

	
	var plot = new datanice.RegularizationPlot("plot1",params,regression('polynomial', data,1))
	plot.addPoints(data)
	var plot2 = new datanice.RegularizationPlot("plot2",params,regression('polynomial', data,2))
	plot2.addPoints(data)
	var plot3 = new datanice.RegularizationPlot("plot3",params,regression('polynomial', data,3))
	plot3.addPoints(data)

	lambda = 0
	params2 = JSON.parse(JSON.stringify(params))
	params2.maxY = 1.4
	params2.h = 200
	params2.margin.bottom = 30
	params2.margin.top = 40
	var barPlot = new datanice.RegularizationBarPlot("bar1",params2,data,1,lambda)
	var barPlot2 = new datanice.RegularizationBarPlot("bar2",params2,data,2,lambda)
	var barPlot3 = new datanice.RegularizationBarPlot("bar3",params2,data,3,lambda)

	var barPlotGroup = new datanice.BarPlotGroup([barPlot,barPlot2,barPlot3])


	var $slider = $("#slider");
	if ($slider.length > 0) {
	  $slider.slider({
	    min: 0,
	    max: 20,
	    value: lambda,
	    orientation: "horizontal",
	    range: "min",
		animate: "fast",
		step: 1,
		change: function(event, ui) {barPlotGroup.sliderChange(ui.value);},
		slide: function(event, ui) {
			$(".tooltip-inner").text(ui.value);},
		start: function(event, ui) {tooltip.tooltip("show"); $(".tooltip-inner").text(ui.value)},
		stop: function() {tooltip.tooltip("hide")}
		 });
		}
	$slider.find(".ui-slider-handle").append("<div class='ui-slider-focus'/>");
	$slider.find(".ui-slider-handle").append("<div class='slide-tooltip'/>");
	var tooltip = $(".slide-tooltip").tooltip( {title: $("#slider").slider("value")+'', trigger: "manual"});
	var bounce = new datanice.focusEffect();
	var focusHandle =document.querySelectorAll(".ui-slider-focus");
	bounce.applyTo(focusHandle[0],{loop:true});
	var resize = function() {
		plot.resize()
		plot2.resize()
		plot3.resize()
		barPlotGroup.resize()
	}
	// resize
	$(window).on("resize", resize);
	barPlotGroup.sliderChange(lambda)
	resize()
}

window.onload = init;