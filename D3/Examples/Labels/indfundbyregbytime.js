"use strict";

        // Read in data from JSON convert Date values into javascript objects-----
        var parseDate = d3.time.format("%Y%m%d").parse;

        // define color scale 
        var color = d3.scale.category20b();

        d3.json("multistock_short.json", function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key == "ticker"; }));
                data = data.map( function (d) {
                    d.date = parseDate(d.date);
                    d.adjclose = +d.adjclose;
                    return d;
                });

        data = d3.nest().key(function(d) { return d.ticker; }).entries(data);


        draw(data);
	});
        //-------------------------------------------------------------------------
        // Make a data driven plot with our data. 
        function draw(data) {

            // define some common variables
            var margin = {top: 30, right: 30, bottom: 55, left: 90},
                width  = 900-margin.left-margin.right,
                height = 580-margin.top-margin.bottom;

            var valueline = d3.svg.line()
                                  .x( function(d) { return x(d.date); })
                                  .y( function(d) { return y(d.adjclose); })

            // define range for axes.
            // Date
	    var x = d3.time.scale().range([0, width]);
            // Adjusted Close
	    var y = d3.scale.log().range([height, 0]);

            // Scale the range of the data  -- this will have to change for more than one stock!
            var startdate = new Date("1984", "01", "01");
            var enddate   = new Date("2012", "12", "31");
            x.domain([startdate, enddate]);
            y.domain([1, 60000]);
       
            // Make x axis
            var xaxis = d3.svg.axis()
                              .scale(x)
                              .orient("bottom")
                              .ticks(10);

            var xaxistop = d3.svg.axis()
                                 .scale(x)
                                 .orient("top")
                                 .tickFormat("")
                                 .ticks(10);

            // Make y axis
            var yaxis = d3.svg.axis()
                              .scale(y)
                              .orient("left")
                              .ticks(5);

            var yaxisright = d3.svg.axis()
                                   .scale(y)
                                   .orient("right")
                                   .tickFormat("")
                                   .ticks(5);

             // Select html location and define svg within it with group g shifted to account for margins.
             var vis  = d3.select("#vis")
                          .append("svg")
                          .attr("width", width + margin.left+margin.right)
                          .attr("height", height+margin.top+margin.bottom)
                          .append("g")
                          .attr("transform", "translate("+margin.left+","+margin.top+")");

             // Draw the Plotting region------------------------------
             // X axis lines (bottom and top).
             vis.append("g") 
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xaxis);

             vis.append("g") 
                .attr("class", "x axis")
                .call(xaxistop);

             // x axis title
             vis.append("text")
                .attr("x", width/2)
                .attr("y", height+margin.bottom-10)
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Year");

             // Y axis lines (left and right). 
             vis.append("g") 
                .attr("class", "y axis")
                .call(yaxis);

             vis.append("g") 
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yaxisright);

             vis.append("text")
                .attr("x", 0-height/2)
                .attr("y", -margin.left+20)
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Adjusted Close ($) (Log Scale)");


       // End Draw the Plotting region------------------------------


       var parameter = vis.selectAll(".parameter")
                          .data(data, function(d) { return d.key; })
                          .enter().append("g")
                          .attr("class", "parameter");
 
           parameter.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) { return valueline(d.values); })
                    .style("stroke", function(d) { return color(d.key); })
                    .style("opacity", "0.3")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout);

       function mouseover(d, i) {

          var region = {"SPY"        : "United States",
                        "DJIA"        : "United States",
                        "^FTSE"      : "United Kingdom",
                        "^FCHI"      : "France",
                        "^GDAXI"     : "Germany",
                        "^IBEX"      : "Spain",
                        "^BSESN"     : "India",
                        "^HSI"       : "China Hang Seng",
                        "^N225"      : "Japan Nikkei",
                        "EWJ"        : "Japan",
                        "EWS"        : "Singapore",
                        "EWA"        : "Australia",
                        "WINDX"      : "World Wilshire 5000",
                        "EWH"        : "Hong Kong",
                        "EWT"        : "Taiwan",
                        "EWZ"        : "Brazil",
                        "EWY"        : "South Korea",
                        "EWC"        : "Canada",
                        "EWW"        : "Mexico", 
                        "THD"        : "Thailand", 
                        "TUR"        : "Turkey",
                        "BKF"        : "BRIC Index",
                        "EWK"        : "Belgium",
                        "EPHE"       : "Philippines", 
                        "EPU"        : "Peru",
                        "EIDO"       : "Indonesia",
                        "EZA"        : "South Africa", 
                        "EWN"        : "Netherlands",
                        "EWL"        : "Switzerland", 
                        "ECH"        : "Chile",
                        "EWO"        : "Austria", 
                        "EWD"        : "Sweden",
                        "RTS.RS"     : "Russia"
            }

            d3.select(this).style("stroke","red")
                           .style("opacity", "1");

            var point = d3.mouse(this);

            $("#id1").text(d.key);
            $("#id2").text(region[d.key]);
            $("#id3").text(x.invert(point[0]));
            var hold = y.invert(point[1]); // fix the precision to 2 places
            $("#id4").text(hold.toFixed(2));

       };

       function mouseout(d, i) {
            d3.select(this).style("stroke", function(d) { return color(d.key); })
                           .style("opacity", "0.3");

            $("#id1").html("&nbsp");
            $("#id2").html("&nbsp");
            $("#id3").html("&nbsp");
            $("#id4").html("&nbsp");

       };


     };