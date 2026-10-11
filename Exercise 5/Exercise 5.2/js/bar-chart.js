// Load the dataset and format row values
d3.csv("data/Data_exercise 5.1-1.csv", d => {
  return {
    screen_type: d["Screen_Tech"].toUpperCase(),
    // Convert string mean consumption to a floating number
    energy: +d["Mean(Labelled energy consumption (kWh/year))"]
  };
}).then(data => {
  // Sort descending by energy consumption
  data.sort((a, b) => b.energy - a.energy);
  console.log("Loaded & Sorted Data:", data);

  // Render chart
  drawBarChart(data);
});

// Function to draw the vertical bar chart
const drawBarChart = data => {
  // 1. Margins and dimensions
  const margin = { top: 40, right: 30, bottom: 60, left: 70 };
  const width = 800;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // 2. SVG container inside the #bar-chart div
  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // 3. Inner chart group offset by left and top margins
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 4. Scales
  // Categorical x-scale (screen types)
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screen_type))
    .range([0, innerWidth])
    .padding(0.35);

  // Linear y-scale (energy consumption with 15% headroom)
  const maxEnergy = d3.max(data, d => d.energy);
  const yScale = d3.scaleLinear()
    .domain([0, maxEnergy * 1.15])
    .range([innerHeight, 0])
    .nice();

  // 5. Axes
  const bottomAxis = d3.axisBottom(xScale);
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

  // Y-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", -10)
      .attr("y", -15)
      .attr("text-anchor", "start")
      .text("Mean Energy Consumption (kWh/year)");

  // 6. Draw vertical bars
  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.screen_type))
      .attr("y", d => yScale(d.energy))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.energy));

  // 7. Value labels above each bar
  innerChart
    .selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.screen_type) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.energy) - 8)
      .attr("text-anchor", "middle")
      .text(d => `${d.energy.toFixed(1)} kWh`);
};