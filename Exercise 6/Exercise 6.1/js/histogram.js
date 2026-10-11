const drawHistogram = (data) => {
  // 1. Bin the data
  const bins = binGenerator(data);
  console.log("Generated Bins (14 groups):", bins);

  // 2. Derive scale domains from bins
  const minEnergy = bins[0].x0;
  const maxEnergy = bins[bins.length - 1].x1;
  const binsMaxLength = d3.max(bins, d => d.length);

  // 3. Set scales
  xScale
    .domain([minEnergy, maxEnergy])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  // 4. Create SVG & Inner Chart group
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 5. Draw histogram bars
  innerChart.selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1)) // 1px bar gap
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor);

  // 6. Draw X Axis
  const xAxis = d3.axisBottom(xScale);
  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  // 7. Draw Y Axis
  const yAxis = d3.axisLeft(yScale);
  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);
};