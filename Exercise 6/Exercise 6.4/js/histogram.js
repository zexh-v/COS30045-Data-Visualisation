// ==========================================================================
// Exercise 6.1 & 6.2: Interactive Histogram
// ==========================================================================

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

  // Clear previous if any
  const container = d3.select("#histogram");
  container.selectAll("*").remove();

  // 4. Create SVG & Inner Chart group
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Histogram of television annual energy consumption");

  // SVG Defs: Linear Gradient
  const defs = svg.append("defs");
  const barGrad = defs.append("linearGradient")
    .attr("id", "histBarGrad")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  barGrad.append("stop").attr("offset", "0%").attr("stop-color", "#38BDF8");
  barGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0284C7");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Horizontal Gridlines
  const yGrid = d3.axisLeft(yScale)
    .ticks(6)
    .tickSize(-innerWidth)
    .tickFormat("");

  innerChart.append("g")
    .attr("class", "grid-line")
    .call(yGrid);

  // Tooltip selector (Shared rich tooltip panel matching Exercise 5.3)
  const tooltip = d3.select("#sharedTooltip");

  function moveTooltip(event) {
    tooltip
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY - 18}px`);
  }

  // 5. Draw histogram bars with rounded corners
  const bars = innerChart.selectAll("rect.hist-bar")
    .data(bins)
    .join("rect")
      .attr("class", "hist-bar")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2)) // 2px bar gap
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "url(#histBarGrad)");

  // Interactive Hover & Tooltip matching Exercise 5.3 bar chart
  bars
    .on("mouseenter", function (event, d) {
      innerChart.selectAll("rect.hist-bar")
        .style("opacity", other => other === d ? 1 : 0.35);

      const allBarsData = innerChart.selectAll("rect.hist-bar").data();
      const totalVisible = d3.sum(allBarsData, b => b.length);
      const sharePct = totalVisible > 0 ? ((d.length / totalVisible) * 100).toFixed(1) : "0.0";
      const rangeStr = `${Math.round(d.x0)} – ${Math.round(d.x1)} kWh`;
      const estAnnualCost = (((d.x0 + d.x1) / 2) * 0.30).toFixed(2);

      // Identify active filter label
      const activeFilter = filters_screen.find(f => f.isActive);
      const filterLabel = activeFilter ? activeFilter.label : "All Technologies";

      tooltip.html(`
        <div class="tooltip-header">
          <strong class="tooltip-brand">${rangeStr} / yr</strong>
          <span class="tooltip-rank">${d.length.toLocaleString()} Models</span>
        </div>
        <div class="tooltip-row">
          <span>Energy Band:</span>
          <strong>${Math.round(d.x0)} to ${Math.round(d.x1)} kWh</strong>
        </div>
        <div class="tooltip-row">
          <span>Model Count:</span>
          <strong>${d.length.toLocaleString()} TVs</strong>
        </div>
        <div class="tooltip-row">
          <span>Active Filter:</span>
          <strong>${filterLabel}</strong>
        </div>
        <div class="tooltip-row">
          <span>Category Share:</span>
          <strong>${sharePct}% of active data</strong>
        </div>
        <div class="tooltip-row">
          <span>Est. Running Cost:</span>
          <strong>~$${estAnnualCost} AUD/yr</strong>
        </div>
      `);
      tooltip.classed("visible", true);
      moveTooltip(event);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", function () {
      innerChart.selectAll("rect.hist-bar").style("opacity", 1);
      tooltip.classed("visible", false);
    });

  // 6. Draw X Axis
  const xAxis = d3.axisBottom(xScale).ticks(8);
  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  // X Axis Title
  innerChart.append("text")
    .attr("class", "axis-title")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .text("Annual Energy Consumption (kWh/year)");

  // 7. Draw Y Axis
  const yAxis = d3.axisLeft(yScale).ticks(6);
  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

  // Y Axis Title
  innerChart.append("text")
    .attr("class", "axis-title")
    .attr("x", -10)
    .attr("y", -16)
    .attr("text-anchor", "start")
    .text("Number of Models");
};