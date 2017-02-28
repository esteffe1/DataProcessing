// Barchart.js


// Canvas - Drawing area 
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// 
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Adjust the coordinates	 
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Draw some bars according data in the JSON file
d3.json("KNMI_20170220.json", function(error, data) {
  if (error) throw error;
  

// Map the x and y axis on the dataset
  x.domain(data.map(function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function(d) { return d.vis; })]);

// Draw the x axis  
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

// Draw the y axis
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "c"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .text("Visibility");

// And now draw all the bars
  g.selectAll(".bar")
    .data(data)
    .enter()
	 .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Date) })
      .attr("y", function(d) { return  y(d.vis) })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.vis); });
	
});


