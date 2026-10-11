// ==========================================
// Exercise 4.2: Manipulate and Add Elements
// ==========================================

// Step 2: Select an HTML element and alter its style
// Targets your hero h1 title
d3.select("h1")
    .style("color", "lightgreen");

// Step 3: Append a paragraph to a container
// Target an existing card or container div on your homepage
d3.select(".card-grid")
    .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Step 4: Append an SVG rectangle and set attributes
d3.select("#chart-svg")
    .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .style("fill", "lightgreen");
