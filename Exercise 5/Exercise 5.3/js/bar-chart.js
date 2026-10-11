// ==========================================================================
// Exercise 5.1: 55" TV Energy Consumption by Screen Technology (Bar Chart)
// ==========================================================================

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
}).catch(err => {
  console.error("Error loading Exercise 5.1 data:", err);
});

// Function to draw the vertical bar chart
const drawBarChart = data => {
  // 1. Margins and dimensions
  const margin = { top: 50, right: 35, bottom: 65, left: 75 };
  const width = 800;
  const height = 480;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const container = d3.select("#bar-chart");
  container.selectAll("*").remove();

  // 2. SVG container inside the #bar-chart div
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Vertical bar chart showing 55 inch TV energy consumption by screen type");

  // SVG Defs: Gradients
  const defs = svg.append("defs");

  // Bar Gradient (Brand Blue to Cyan)
  const barGrad = defs.append("linearGradient")
    .attr("id", "barGrad51")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  barGrad.append("stop").attr("offset", "0%").attr("stop-color", "#38BDF8");
  barGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0284C7");

  // Top Bar Gradient (Highest consumption: Warm Amber / Gold)
  const topGrad = defs.append("linearGradient")
    .attr("id", "topGrad51")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");
  topGrad.append("stop").attr("offset", "0%").attr("stop-color", "#FBBF24");
  topGrad.append("stop").attr("offset", "100%").attr("stop-color", "#D97706");

  // 3. Inner chart group offset by left and top margins
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 4. Scales
  // Categorical x-scale (screen types)
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screen_type))
    .range([0, innerWidth])
    .padding(0.38);

  // Linear y-scale (energy consumption with headroom)
  const maxEnergy = d3.max(data, d => d.energy);
  const yScale = d3.scaleLinear()
    .domain([0, maxEnergy * 1.18])
    .range([innerHeight, 0])
    .nice();

  // Horizontal Gridlines
  const yGrid = d3.axisLeft(yScale)
    .ticks(5)
    .tickSize(-innerWidth)
    .tickFormat("");

  innerChart.append("g")
    .attr("class", "grid-line")
    .call(yGrid);

  // 5. Axes
  const bottomAxis = d3.axisBottom(xScale);
  innerChart
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  const leftAxis = d3.axisLeft(yScale).ticks(5);
  innerChart
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxis);

  // Y-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", -10)
      .attr("y", -18)
      .attr("text-anchor", "start")
      .text("Mean Energy Consumption (kWh/year)");

  // X-axis label
  innerChart
    .append("text")
      .attr("class", "axis-title")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 48)
      .attr("text-anchor", "middle")
      .text("Display Screen Technology (55-Inch Models)");

  // Tooltip selector
  const tooltip = d3.select("#sharedTooltip");

  // 6. Draw vertical bars with animated growth
  const bars = innerChart
    .selectAll(".bar-chart-rect")
    .data(data)
    .join("rect")
      .attr("class", "bar-chart-rect")
      .attr("x", d => xScale(d.screen_type))
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", (d, i) => i === 0 ? "url(#topGrad51)" : "url(#barGrad51)");

  // Smooth entrance transition
  bars.transition()
    .duration(700)
    .delay((d, i) => i * 120)
    .ease(d3.easeCubicOut)
    .attr("y", d => yScale(d.energy))
    .attr("height", d => innerHeight - yScale(d.energy));

  // Interactive Hover & Tooltip
  bars
    .on("mouseenter", function (event, d) {
      innerChart.selectAll(".bar-chart-rect")
        .style("opacity", other => other.screen_type === d.screen_type ? 1 : 0.35);

      tooltip.html(`
        <div class="tooltip-header">
          <strong class="tooltip-brand">${d.screen_type} (55" Model)</strong>
          <span class="tooltip-rank">Technology</span>
        </div>
        <div class="tooltip-row">
          <span>Mean Consumption:</span>
          <strong>${d.energy.toFixed(1)} kWh/yr</strong>
        </div>
        <div class="tooltip-row">
          <span>Est. Annual Cost:</span>
          <strong>~$${((d.energy * 0.30)).toFixed(2)} AUD</strong>
        </div>
      `);
      tooltip.classed("visible", true);
      moveTooltip(event);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", function () {
      innerChart.selectAll(".bar-chart-rect").style("opacity", 1);
      tooltip.classed("visible", false);
    });

  // 7. Value labels above each bar
  const labels = innerChart
    .selectAll(".bar-chart-label")
    .data(data)
    .join("text")
      .attr("class", "bar-chart-label")
      .attr("x", d => xScale(d.screen_type) + xScale.bandwidth() / 2)
      .attr("y", innerHeight - 8)
      .attr("opacity", 0)
      .text(d => `${d.energy.toFixed(1)} kWh`);

  labels.transition()
    .duration(700)
    .delay((d, i) => i * 120 + 200)
    .ease(d3.easeCubicOut)
    .attr("y", d => yScale(d.energy) - 10)
    .attr("opacity", 1);

  function moveTooltip(event) {
    tooltip
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY - 18}px`);
  }
};