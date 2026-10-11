// ==========================================================================
// Exercise 6.3 & 6.4: Interactive Scatterplot
// ==========================================================================

const drawScatterplot = (data) => {
  // 1. Calculate domain extremes
  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  // 2. Set scale domains & ranges
  xScaleS
    .domain([0, maxStar + 0.5]) // Star rating on x-axis
    .range([0, innerWidth])
    .nice();

  yScaleS
    .domain([0, maxEnergy + 50]) // Energy consumption on y-axis
    .range([innerHeight, 0])
    .nice();

  const container = d3.select("#scatterplot");
  container.selectAll("*").remove();

  // 3. Create SVG element
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Scatterplot of television energy star rating versus energy consumption");

  // 4. Assign innerChartS in shared-constants (do not redeclare with const/let)
  innerChartS = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Horizontal Gridlines
  const yGrid = d3.axisLeft(yScaleS)
    .ticks(6)
    .tickSize(-innerWidth)
    .tickFormat("");

  innerChartS.append("g")
    .attr("class", "grid-line")
    .call(yGrid);

  // Vertical Gridlines
  const xGrid = d3.axisBottom(xScaleS)
    .ticks(8)
    .tickSize(innerHeight)
    .tickFormat("");

  innerChartS.append("g")
    .attr("class", "grid-line")
    .attr("transform", `translate(0, 0)`)
    .call(xGrid);

  // 5. Draw scatter plot circles
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4.5)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.55);

  // 6. Append X-axis (Star Rating)
  const xAxis = d3.axisBottom(xScaleS).ticks(8);
  innerChartS.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  // X-axis Title
  innerChartS.append("text")
    .attr("class", "axis-title")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .text("Energy Star Rating (Stars)");

  // 7. Append Y-axis (Energy Consumption)
  const yAxis = d3.axisLeft(yScaleS).ticks(6);
  innerChartS.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  // Y-axis Title
  innerChartS.append("text")
    .attr("class", "axis-title")
    .attr("x", -10)
    .attr("y", -16)
    .attr("text-anchor", "start")
    .text("Annual Energy Consumption (kWh/year)");

  // 8. Add Legend in top-right corner
  const legend = innerChartS.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidth - 110}, 10)`);

  const screenTechs = colorScale.domain();

  screenTechs.forEach((tech, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 22})`);

    legendRow.append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("rx", 3)
      .attr("fill", colorScale(tech))
      .attr("opacity", 0.85);

    legendRow.append("text")
      .attr("x", 22)
      .attr("y", 11)
      .attr("alignment-baseline", "middle")
      .text(tech);
  });
};