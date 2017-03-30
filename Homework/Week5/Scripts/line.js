/*
 lineGraph.js
*/

function lineGraph()
{
// -- Global variables and settings --

// SVG element 
var svg = d3.select("svg"),
    margin = {top: 20, right: 200, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Convert dates to and from javascript format
var parseTime = d3.timeParse("%Y%m%d");
var formatDate = d3.timeFormat("%d-%m-%Y");

// X and Y axis scales
var x = d3.scaleTime().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

// Graph 
var graphName = ["tg", "tn", "tx"]; 
var graphSelect ="Average day temperature"; // Default graph
var graphSelectDefault ="Average day temperature"; // Default graph
var graphSelected = "tg";

var tgOpacity = 1;
var tnOpacity = 0;
var txOpacity = 0;

var lineTG = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tg); });

var lineTN = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tn); });

var lineTX = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.tx); });

	
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

	var yMax = d3.max(data, function(d) { return Math.max(d.tg, d.tn, d.tx); } );
	var yMin = d3.min(data, function(d) { return Math.min(d.tg, d.tn, d.tx); } );
   
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
	
	// Draw the TG-graph for each station
	
		 graphSelected = "tg";
	
      g.append("path")			
			.attr("fill", "none")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("class", "line")   
			.style("stroke", function() { return d.color = color(d.key); }) 
			.style("opacity", tgOpacity)			
			.attr("id", 'tag_'+ graphSelected + d.key.replace(/\s+/g, '')) // assign ID			
			.attr("d", lineTG(d.values));
				
		graphSelected = "tn";
										
      g.append("path")			
			.attr("fill", "none")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("class", "line")   
			.style("stroke", function() { return d.color = color(d.key); }) 
			.style("opacity", tnOpacity)		
			.attr("id", 'tag_'+ graphSelected + d.key.replace(/\s+/g, '')) // assign ID			
			.attr("d", lineTN(d.values));
			
		graphSelected = "tx";					 
		
      g.append("path")			
			.attr("fill", "none")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("class", "line")   
			.style("stroke", function() { return d.color = color(d.key); })       
			.style("opacity", txOpacity)
			.attr("id", 'tag_'+ graphSelected + d.key.replace(/\s+/g, '')) // assign ID			
			.attr("d", lineTX(d.values));

	// Add the Legend at the right side of graph
		g.append("text")
         .attr("class", "legend")    				// style the legend       
         .attr("x", width + (margin.right/2) )  // space legend
         .attr("y", (legendSpace/2)+i*legendSpace)
			.style("fill", function() {return d.color = color(d.key); })
	  
		// Mouse click on text
			.on("click", function(){
				
            // Determine if current line is visible 
				console.log(d.active);
                var active   = d.active ? false : true,				
                newOpacity = active ? 0 : 1; 				            
				// Hide or show the elements based on the ID
                d3.select("#tag_"+ graphSelected + d.key.replace(/\s+/g, ''))
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

// Graph title text
	g.append("text")
		.attr("class", "title")    	// style the title    
		.attr("id","title")
		.attr("x", width/2 )  			// space legend
		.attr("y", 15)
		.style("fill", "orange")
		.text(graphSelectDefault)

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
		
// -- Drop down menu --
	d3.selectAll(".m")
		.on("click", function() {
			graphSelect = this.getAttribute("value");

			d3.select("#title").text(graphSelect).transition().duration(1000) ;
			
			if(graphSelect == "Average day temperature"){				
				var tgOpacity = 1;
				var tnOpacity = 0;
				var txOpacity = 0;
				graphSelected = "tg";
			} 
			else if(graphSelect == "Minimum temperature" ){
				var tgOpacity = 0;
				var tnOpacity = 1;
				var txOpacity = 0;
				graphSelected = "tn";
			} 
			else if(graphSelect == "Maximum temperature" ){
				var tgOpacity = 0;
				var tnOpacity = 0;
				var txOpacity = 1;
				graphSelected = "tx";
			}
			
			//d3.selectAll(".tagGem").style("opacity", txOpacity);
			
			d3.select("path#tag_txSchiphol")
						.style("opacity", txOpacity); 
			d3.select("path#tag_txEelde")
						.style("opacity", txOpacity); 
			d3.select("path#tag_txRotterdam")
						.style("opacity", txOpacity); 			
		
			d3.select("path#tag_tgSchiphol")
						.style("opacity", tgOpacity); 
			d3.select("path#tag_tgEelde")
						.style("opacity", tgOpacity); 
			d3.select("path#tag_tgRotterdam")
						.style("opacity", tgOpacity); 
		
			d3.select("path#tag_tnSchiphol")
						.style("opacity", tnOpacity); 
			d3.select("path#tag_tnEelde")
						.style("opacity", tnOpacity); 
			d3.select("path#tag_tnRotterdam")
						.style("opacity", tnOpacity); 						
			
		});
		
		
function mousemove() {
		
		mouse = d3.mouse(this);
		mousex = mouse[0];
		mousey = mouse[1];	
				
		dataNest.forEach(function(d,i) {
			var index = Math.floor( (mousex - margin.left) / (width / d.values.length));
			
			var date = d.values[index].date;
			
			if(graphSelect == "Average day temperature"){
				var temperature =  d.values[index].tg;	
				var ynew = y(d.values[index].tg) + margin.top;
			} 
			else if(graphSelect == "Minimum temperature" ){
				var temperature =  d.values[index].tn;
				var ynew = y(d.values[index].tn) + margin.top;
			} 
			else if(graphSelect == "Maximum temperature" ){
				var temperature =  d.values[index].tx;
				var ynew = y(d.values[index].tx) + margin.top;
			}
								
			var xnew = x(d.values[index].date) + margin.left;
					
		// Show date and temparatures below station names
			d3.select("#tagt" + d.key.replace(/\s+/g), '').text(graphSelect +  temperature);
			d3.select("#tagd" + d.key.replace(/\s+/g), '').text("DATE: " +  formatDate(date));
		
		// Focus on graph
			focus.attr("transform", "translate(" + xnew + "," + ynew + ")");
			focus.select("text").html("Temperature:" + temperature + " " + "Date:" + formatDate(date) );
			
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
			
	});
	
});
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}