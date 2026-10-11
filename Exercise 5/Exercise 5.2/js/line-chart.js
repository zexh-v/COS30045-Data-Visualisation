// 1. Load the electricity spot prices dataset
d3.csv("data/ARE_Spot_Prices.csv", d => {
  return {
    year: +d["Year"],
    averagePrice: +d["Average Price (notTas-Snowy)"]
  };
}).then(data => {
  // Sort chronologically by year
  data.sort((a, b) => a.year - b.year);
  console.log("Spot Prices Data:", data);

  drawLineChart(data);
});

// 2. Main chart drawing function
const drawLineChart = data => {
  // Dimensions and margins matching Exercise 5.1
  const margin = { top: 40, right: 30, bottom: 60, left: 70 };
  const width = 800;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // SVG container
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Inner chart group translated by margins
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 3. Scales
  // Continuous linear scale for years (1998 to 2024)
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  // Continuous linear scale for price (0 to max + 10% headroom)
  const maxPrice = d3.max(data, d => d.averagePrice);
  const yScale = d3.scaleLinear()
    .domain([0, maxPrice * 1.1])
    .range([innerHeight, 0])
    .nice();

  // 4. Axes
  // Force integer formatting so years display without decimals (e.g., 2000 not 2,000.0)
  const bottomAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));

  innerChart
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxis);

  // 5. Axis Labels
  // Y-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", -10)
      .attr("y", -15)
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Price ($/MWh)");

  // X-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 45)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Year");

  // 6. Line Generator
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  // Draw the connecting line path
  innerChart
    .append("path")
      .attr("class", "line-chart-path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "#75485E")
      .attr("stroke-width", 2);

  // 7. Scatter Plot Circles
  innerChart
    .selectAll(".line-chart-circle")
    .data(data)
    .join("circle")
      .attr("class", "line-chart-circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("fill", "#75485E");
};