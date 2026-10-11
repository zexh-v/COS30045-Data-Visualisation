// ==========================================================================
// Exercise 5.2: Australian Electricity Spot Prices (1998–2024) (Line & Scatter)
// ==========================================================================

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
}).catch(err => {
  console.error("Error loading Exercise 5.2 data:", err);
});

// 2. Main chart drawing function
const drawLineChart = data => {
  // Dimensions and margins matching Exercise 5.1
  const margin = { top: 50, right: 35, bottom: 65, left: 75 };
  const width = 800;
  const height = 480;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const container = d3.select("#line-chart");
  container.selectAll("*").remove();

  // SVG container
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Line chart showing Australian electricity spot prices from 1998 to 2024");

  // SVG Defs: Area Gradient
  const defs = svg.append("defs");
  const areaGrad = defs.append("linearGradient")
    .attr("id", "lineAreaGrad")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  areaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0284C7").attr("stop-opacity", 0.28);
  areaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0284C7").attr("stop-opacity", 0.0);

  // Inner chart group translated by margins
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 3. Scales
  // Continuous linear scale for years (1998 to 2024)
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  // Continuous linear scale for price (0 to max + 15% headroom)
  const maxPrice = d3.max(data, d => d.averagePrice);
  const yScale = d3.scaleLinear()
    .domain([0, maxPrice * 1.15])
    .range([innerHeight, 0])
    .nice();

  // Horizontal Gridlines
  const yGrid = d3.axisLeft(yScale)
    .ticks(6)
    .tickSize(-innerWidth)
    .tickFormat("");

  innerChart.append("g")
    .attr("class", "grid-line")
    .call(yGrid);

  // 4. Axes
  const bottomAxis = d3.axisBottom(xScale)
    .ticks(8)
    .tickFormat(d3.format("d"));

  innerChart
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale).ticks(6);
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
      .attr("y", -18)
      .attr("text-anchor", "start")
      .text("Wholesale Price ($/MWh)");

  // X-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 48)
      .attr("text-anchor", "middle")
      .text("Calendar Year (National Electricity Market)");

  // 6. Area and Line Generators
  const areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)
    .y1(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  // Draw area background fill
  innerChart
    .append("path")
      .datum(data)
      .attr("class", "line-chart-area")
      .attr("d", areaGenerator)
      .attr("fill", "url(#lineAreaGrad)");

  // Draw the connecting line path with animated stroke
  const linePath = innerChart
    .append("path")
      .datum(data)
      .attr("class", "line-chart-path")
      .attr("d", lineGenerator);

  const totalLength = linePath.node() ? linePath.node().getTotalLength() : 1000;
  linePath
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1200)
    .ease(d3.easeCubicOut)
    .attr("stroke-dashoffset", 0);

  // Tooltip selector
  const tooltip = d3.select("#sharedTooltip");

  // 7. Scatter Plot Circles with Entrance and Rich Tooltip
  innerChart
    .selectAll(".line-chart-circle")
    .data(data)
    .join("circle")
      .attr("class", "line-chart-circle")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("r", 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 35 + 300)
      .ease(d3.easeBackOut)
      .attr("r", d => (d.year === 2022 || d.year === 2011) ? 6 : 4.5);

  // Re-select for interactive events
  innerChart.selectAll(".line-chart-circle")
    .on("mouseenter", function (event, d) {
      d3.select(this)
        .transition().duration(150)
        .attr("r", 8)
        .attr("fill", "#F59E0B");

      const note = d.year === 2022
        ? `<div class="tooltip-row" style="color: #F59E0B; font-weight: 600;">⚡ Historic Energy Crisis Peak</div>`
        : (d.year === 2011 ? `<div class="tooltip-row" style="color: #10B981; font-weight: 600;">⭐ 26-Year Record Low</div>` : "");

      tooltip.html(`
        <div class="tooltip-header">
          <strong class="tooltip-brand">Year ${d.year}</strong>
          <span class="tooltip-rank">Spot Price</span>
        </div>
        <div class="tooltip-row">
          <span>Average Price:</span>
          <strong>$${d.averagePrice.toFixed(2)} / MWh</strong>
        </div>
        ${note}
      `);
      tooltip.classed("visible", true);
      moveTooltip(event);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", function (event, d) {
      d3.select(this)
        .transition().duration(150)
        .attr("r", (d.year === 2022 || d.year === 2011) ? 6 : 4.5)
        .attr("fill", "var(--color-brand-blue)");

      tooltip.classed("visible", false);
    });

  function moveTooltip(event) {
    tooltip
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY - 18}px`);
  }
};