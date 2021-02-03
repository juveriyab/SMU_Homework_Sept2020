// @TODO: YOUR CODE HERE!
$(document).ready(function() {
    doWork();

    //event listener
    $(window).resize(function() {
        doWork();
    });
});

function doWork() {
    d3.csv("assets/data/census.csv").then(function(data_census) {
        console.log(data_census);

        // 1): canvas set up
        $("#scatter").empty();

        var svg_width = window.innerWidth;
        var svg_height = 500;

        var margin = {
            top: 20,
            right: 40,
            bottom: 60,
            left: 50
        };

        var chartWidth = svg_width - margin.left - margin.right;
        var chartHeight = svg_height - margin.top - margin.bottom;

        // 2) create svg if it doesnt exist

        // Create svg wrapper, append SVG grp, and shift svg grp by left and top margins.
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // 3) prepare data
        data_census.forEach(function(row) {
            row.poverty = +row.poverty;
            row.healthcare = +row.healthcare;
        });

        // 4) create scales
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data_census, d => d.poverty))
            .range([0, chartWidth]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(data_census, d => d.healthcare))
            .range([chartHeight, 0]);

        // 5) create axes
        var left_axis = d3.axisLeft(yScale);
        var bottom_axis = d3.axisBottom(xScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottom_axis);

        chartGroup.append("g")
            .call(left_axis);

        // 5.5) text in cirlces
        var textGrp = chartGroup.append("g").selectAll("text")
            .data(data_census)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .attr("font-size", 15)
            .classed("stateText", true);


        // 6) create graph
        // append circles
        var circlesGrp = chartGroup.append("g")
            .selectAll("circle")
            .data(data_census)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "18")
            .style("opacity", 0.5)
            .attr("fill", "blue")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .classed("stateCircle", true);



        // make cirlces zoom in and out w text 
        // 5a) Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([180, -60])
            .html(function(d) {
                return (`<strong>${d.state}<strong><hr><strong>Poverty: ${d.poverty}%</strong><hr><strong>Lacks Healthcare: ${d.healthcare}%</strong>`);
            });

        // 5b) Create the tooltip in chartGroup.
        circlesGrp.call(toolTip);

        // 5c) Create "mouseover" event listener to display tooltip
        circlesGrp.on("mouseover", function(event, d) {
                toolTip.show(d, this);

                //make bubbles big
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 100);
            })
            // 6) Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 15);
            });

        // 7) axes labels
        // 
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("% That Lacks Healthcare");

        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Poverty %");


    }).catch(function(error) {
        console.log(error);
    });
}