// lineGraph.js

function lineGraph(){

var svg = d3.select("svg"),
    margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var formatDate = d3.timeFormat("%d-%m-%Y");

var x = d3.scaleTime().rangeRound([0, width]);

var y = d3.scaleLinear().rangeRound([height, 0]);

var lineTG = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tg); });

var lineTN = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tw); });

var lineTX = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tx); });
	 
var dataText = function(d) { return d.tg };
	
// Crosshair
var verticalLine = svg.append("line")
		.attr("opacity", 0)
		.attr("y1", margin.top)
		.attr("y2", margin.top + height)
		.attr("stroke", "grey")
		.attr("stroke-width", 1)
		.attr("pointer-events", "none");
					
var horizontalLine = svg.append("line")
		.attr("opacity", 0)
		.attr("x1", margin.left)
		.attr("x2", margin.left + width)
		.attr("x1", margin.left)
		.attr("x2", margin.left + width)
		.attr("stroke", "grey")
		.attr("stroke-width", 1)
		.attr("pointer-events", "none");

// -- Visualize the data --
	 	
// Load data from a json format file
d3.json("Data/KNMI_20170311.json", function(error, data) {
	if (error) throw error;

// Convert dates to d3 formats
	data.forEach( function(d) { d.date = parseTime(d.date); });  
	
// Calculate max and min values for x and y axis   
  x.domain(d3.extent(data, function(d) { return d.date; }));

	var yMax = d3.max(data, function(d) { return Math.max(d.tg, d.tw, d.tx); } );
	var yMin = d3.min(data, function(d) { return Math.min(d.tg, d.tw, d.tx); } );
   
  y.domain([ yMin, yMax ]);
  
// Nest the entries by symbol
	var dataNest = d3.nest()
        .key(function(d) {return d.name;})
        .entries(data);

// set the colour scale   
	var color = d3.scaleOrdinal(d3.schemeCategory10);  
	
// spacing for the legend
    legendSpace = height/dataNest.length; 
 
 // Loop through each symbol / key
    dataNest.forEach(function(d,i) { 
	
	// Draw the graph for each station
        g.append("path")			
			.attr("fill", "none")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("class", "line")   
			.style("stroke", function() { return d.color = color(d.key); })
         .attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID			
         .attr("d", lineTG(d.values));            
					 
	// Add the Legend
		g.append("text")
         .attr("class", "legend")    				// style the legend       
         .attr("x", width + (margin.right/2) )  // space legend
         .attr("y", (legendSpace/2)+i*legendSpace)
			.style("fill", function() {return d.color = color(d.key); })
	  
		// Mouse click on text
			.on("click", function(){
				
            // Determine if current line is visible 
                var active   = d.active ? false : true,				
                newOpacity = active ? 0 : 1; 				            
			// Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100) 
                    .style("opacity", newOpacity); 
            // Update whether or not the elements are active
                d.active = active;
             })  
            .text(d.key); 
				
	// Add the temperature data  below station name
		g.append("text")
			.attr("class", "temperature")    				// style the legend    
			.attr("id", 'tagt'+d.key.replace(/\s+/g, ''))  	
			.attr("x", width + (margin.right/2) )  // space legend
			.attr("y", (legendSpace/2)+(i*legendSpace) + 15)
			.style("fill", function() {return d.color = color(d.key); })
			.text("TG: ")
			
	// Add the the date below station name
		g.append("text")
			.attr("class", "temperature")    				// style the legend    
			.attr("id", 'tagd'+d.key.replace(/\s+/g, ''))  	
			.attr("x", width + (margin.right/2) )  // space legend
			.attr("y", (legendSpace/2)+(i*legendSpace) + 30)
			.style("fill", function() {return d.color = color(d.key); })
			.text("DATE: ")
			
		});
	
// -- Data dependend objects and functions here --

// X axis
	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.select(".domain")
		.remove();

// Y axis
	g.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Tempature (C)");
	  		
// Data labels for crosshairs		
var focus = svg.append("g")
		.attr("class", "focus")
		.style("display", "none");

	focus.append("circle")
		.attr("r", 4.5);

	focus.append("text")
		.attr("x", 9)
		.attr("dy", ".35em");

// Transarent rectangle for crosshairs
	svg.append("rect")
      .attr("class", "overlay")
		.attr("x", margin.left)
		.attr("y", margin.top)
      .attr("width", width)
      .attr("height", height)
		.style("fill", "none")
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

function mousemove() {
		
		mouse = d3.mouse(this);
		mousex = mouse[0];
		mousey = mouse[1];	
				
		dataNest.forEach(function(d,i) {
			var index = Math.floor( (mousex - margin.left) / (width / d.values.length));
			
			var date = d.values[index].date;
			var tg =   d.values[index].tg;
			
			var xnew = x(d.values[index].date) + margin.left;
			var ynew = y(d.values[index].tg) + margin.top;
			
			console.log( "Index = " + index );
			
		// Show date and temparatures below station names
			d3.select("#tagt" + d.key.replace(/\s+/g), '').text("TG: " +  tg);
			d3.select("#tagd" + d.key.replace(/\s+/g), '').text("DATE: " +  formatDate(date));
		
		// Focus on graph
			focus.attr("transform", "translate(" + xnew + "," + ynew + ")");
			focus.select("text").text("Temperature:" + tg + "<br>" + "Date:" + formatDate(date) );
			
		// Show crosshair
			if(mousex > margin.left && mousex < margin.left + width){
				verticalLine.attr("x1", mousex).attr("x2", mousex).attr("opacity", 1);
			}
			if(mousey > margin.top && mousey < margin.top +height){
				horizontalLine.attr("y1", mousey).attr("y2", mousey).attr("opacity", 1);
			}

		})
					
	};

	svg.on("mouseout", function(){  
		// Hide crosshair when mouse not over svg 
			verticalLine.attr("opacity", 0);
			horizontalLine.attr("opacity", 0);
			
		// Select text by id and then remove
      // d3.select("#t" + mousex + "-" + mousey + "-").remove(); 
	});
			
});
}