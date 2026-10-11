// Exercise 4.3: SVG Canvas Setup
//Create svg object within the responsive-svg-container
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 500 1600")
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

// Exercise 4.6: Scaling Charts with D3 Scales
const drawBarChart = data => {

  // Step 1: Linear scale for continuous count data (x-axis)
  const xScale = d3.scaleLinear()
    .domain([0, 1200])   // Includes highest count (~1096) with room to spare
    .range([0, 400]);    // Fits comfortably inside the 500px wide viewBox

  // Step 2: Band scale for discrete brand categories (y-axis)
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand)) // Array of brand strings
    .range([0, 1600])               // Spans the full height
    .padding(0.2);                  // Creates a gap between bars

  // Bind data and apply scales to attributes
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", 0)
      .attr("y", d => yScale(d.brand))          // Uses band scale position
      .attr("width", d => xScale(d.count))      // Uses linear scale pixel width
      .attr("height", yScale.bandwidth())       // Uses calculated band thickness
      .attr("fill", "steelblue");
};