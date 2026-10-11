// Exercise 4.3: SVG Canvas Setup
//Create svg object within the responsive-svg-container
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Exercise 4.4: Load and Format Data
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  // Sort descending so the largest bar appears on top
  data.sort((a, b) => b.count - a.count);

  // Call the bar chart drawing function
  drawBarChart(data);
});

// Exercise 4.5: Bind and Draw Bars with Data
const drawBarChart = data => {
  // Step 2 constants
  const barHeight = 20;
  const spacing = 5;

  // Step 1: Bind data and join rectangles to DOM
  // Step 2 & 3: Assign class, width, height, x, and spaced y
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => `bar bar-${d.count}`) // Dynamic class matching lecture slide pattern
      .attr("x", 0)                              // Bars start on the left
      .attr("y", (d, i) => i * (barHeight + spacing)) // Space out bars along y-axis
      .attr("width", d => d.count)               // Bar length reflects the count
      .attr("height", barHeight)                 // Uniform bar thickness
      .attr("fill", "steelblue");                // Visual fill colour (or 'blue', 'green', etc.)
};