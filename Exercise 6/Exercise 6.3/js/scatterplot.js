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

  // 3. Create SVG element
  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

  // 4. Assign innerChartS in shared-constants (do not redeclare with const/let)
  innerChartS = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 5. Draw scatter plot circles
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5); // Opacity makes dense overlapping points visible

  // 6. Append X-axis (Star Rating)
  const xAxis = d3.axisBottom(xScaleS);
  innerChartS.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  // X-axis Title
  innerChartS.append("text")
    .attr("class", "axis-title")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#333")
    .text("Star Rating");

  // 7. Append Y-axis (Energy Consumption)
  const yAxis = d3.axisLeft(yScaleS);
  innerChartS.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  // Y-axis Title
  innerChartS.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#333")
    .text("Energy Consumption (kWh/year)");

  // 8. Add Legend in top-right corner
  const legend = innerChartS.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidth - 90}, 10)`);

  const screenTechs = colorScale.domain();

  screenTechs.forEach((tech, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`); // Space out by 20px

    legendRow.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", colorScale(tech))
      .attr("opacity", 0.8);

    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("font-size", "11px")
      .attr("fill", "#333")
      .text(tech);
  });
};