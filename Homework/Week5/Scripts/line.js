// lineGraph.js

function lineGraph(){

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);
	 
var z = d3.scaleOrdinal(d3.schemeCategory10);

var lineTG = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tg); });

var lineTN = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tw); });

var lineTX = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tx); });

d3.json("Data/KNMI_20170228.json", function(error, data) {
  if (error) throw error;

// Convert dates to d3 formats
  data.forEach( function(d) { d.date = parseTime(d.date); });
  
	  
  x.domain(d3.extent(data, function(d) { return d.date; }));
 // y.domain(d3.extent(data, function(d) { return d.tg; }));
 var yMax = d3.max(data, function(d) { return Math.max(d.tg, d.tw, d.tx); } );
 var yMin = d3.min(data, function(d) { return Math.min(d.tg, d.tw, d.tx); } );
   
  y.domain([yMin, yMax ]);


  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Tempature (C)");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineTG);
		
		g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineTN);
		
		g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineTX);
		
});
}