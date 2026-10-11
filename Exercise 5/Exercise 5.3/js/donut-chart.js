// ==========================================================================
// Exercise 5.3: Proportion of TV Sizes (Donut Chart)
// ==========================================================================

// 1. Load the TV size proportion dataset
d3.csv("data/Data_exercise 5.3.csv").then(rawData => {
  console.log("Raw Donut Data Sample:", rawData[0]);

  // Dynamically extract the category column and count/value column
  const keys = Object.keys(rawData[0]);
  const sizeKey = keys[0];   // e.g., "size_category", "Size", "Screen_Size"
  const countKey = keys[1];  // e.g., "count", "Count", "Number of models"

  const data = rawData.map(d => ({
    label: (d[sizeKey] || "").trim().toLowerCase(),
    displayLabel: (d[sizeKey] || "").trim().charAt(0).toUpperCase() + (d[sizeKey] || "").trim().slice(1).toLowerCase(),
    count: +d[countKey]
  }));

  console.log("Cleaned Donut Data:", data);
  drawDonutChart(data);
}).catch(err => {
  console.error("Error loading Exercise 5.3 data:", err);
});

// 2. Main chart drawing function
const drawDonutChart = data => {
  // Chart dimensions matching previous exercises
  const width = 800;
  const height = 480;
  const margin = 35;

  const container = d3.select("#donut-chart");
  container.selectAll("*").remove();

  // Maximum radius that fits inside the shortest dimension, with margin padding
  const radius = Math.min(width, height) / 2 - margin;

  // Inner radius (60% of outer radius) creates the donut hole
  const innerRadius = radius * 0.62;
  const outerRadius = radius;

  // Append SVG container
  const svg = container
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Donut chart showing proportion of TV models by screen size");

  // Inner group translated directly to the center of the SVG
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // 3. Harmonious Color Scale matching Design Tokens
  // Small: Efficiency Green, Medium: Brand Ocean Blue, Large: Energy Amber Gold
  const colorMap = {
    "medium": "#0284C7",
    "large": "#F59E0B",
    "small": "#10B981"
  };

  const colorScale = d => colorMap[d.toLowerCase()] || "#64748B";

  const totalCount = d3.sum(data, d => d.count);

  // 4. Pie Layout Generator (calculates radian angles)
  const pieGenerator = d3.pie()
    .value(d => d.count)
    .sort(null); // Keep categorical sequence

  const annotatedData = pieGenerator(data);

  // 5. Arc Generators
  const arcGenerator = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(0.025)
    .cornerRadius(6);

  const arcHover = d3.arc()
    .innerRadius(innerRadius - 4)
    .outerRadius(outerRadius + 8)
    .padAngle(0.025)
    .cornerRadius(6);

  // Tooltip selector
  const tooltip = d3.select("#sharedTooltip");

  // 6. Draw Arcs as Groups
  const arcs = innerChart
    .selectAll(".donut-arc")
    .data(annotatedData)
    .join("g")
      .attr("class", "donut-arc");

  // Append path for each slice with transition
  const paths = arcs
    .append("path")
      .attr("fill", d => colorScale(d.data.label))
      .each(function(d) { this._current = { startAngle: 0, endAngle: 0 }; });

  paths.transition()
    .duration(900)
    .ease(d3.easeCubicOut)
    .attrTween("d", function(d) {
      const interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arcGenerator(interpolate(t));
      };
    });

  // Interactive Hover on Slices
  arcs
    .on("mouseenter", function (event, d) {
      innerChart.selectAll(".donut-arc path")
        .style("opacity", other => other.data.label === d.data.label ? 1 : 0.4);

      d3.select(this).select("path")
        .transition().duration(200)
        .attr("d", arcHover);

      const pct = ((d.data.count / totalCount) * 100).toFixed(1);

      tooltip.html(`
        <div class="tooltip-header">
          <strong class="tooltip-brand">${d.data.displayLabel} Format</strong>
          <span class="tooltip-rank">${pct}% Share</span>
        </div>
        <div class="tooltip-row">
          <span>Registered Models:</span>
          <strong>${d3.format(",")(d.data.count)} models</strong>
        </div>
        <div class="tooltip-row">
          <span>Market Proportion:</span>
          <strong>${pct}% of all TVs</strong>
        </div>
      `);
      tooltip.classed("visible", true);
      moveTooltip(event);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", function () {
      innerChart.selectAll(".donut-arc path")
        .style("opacity", 1);

      d3.select(this).select("path")
        .transition().duration(200)
        .attr("d", arcGenerator);

      tooltip.classed("visible", false);
    });

  // 7. Add Labels at Arc Centroids
  arcs
    .append("text")
      .attr("class", "donut-label")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("opacity", 0)
      .text(d => {
        const percentage = (d.endAngle - d.startAngle) / (2 * Math.PI);
        return d3.format(".0%")(percentage);
      })
      .transition()
      .duration(600)
      .delay(700)
      .attr("opacity", 1);

  // 8. Center Label with rich styling
  innerChart
    .append("text")
    .attr("class", "donut-center-title")
    .attr("y", -6)
    .text("TV Sizes");

  innerChart
    .append("text")
    .attr("class", "donut-center-sub")
    .attr("y", 18)
    .text(`${d3.format(",")(totalCount)} Models`);

  // 9. Interactive Modern Legend below chart container
  const legendContainer = container.append("div")
    .attr("class", "donut-legend");

  data.forEach(d => {
    const pct = ((d.count / totalCount) * 100).toFixed(1);
    const item = legendContainer.append("div")
      .attr("class", "donut-legend-item");

    item.append("span")
      .attr("class", "donut-legend-color")
      .style("background-color", colorScale(d.label));

    item.append("span")
      .attr("class", "donut-legend-label")
      .text(d.displayLabel);

    item.append("span")
      .attr("class", "donut-legend-count")
      .text(`(${d3.format(",")(d.count)} • ${pct}%)`);

    // Legend hover highlights corresponding slice
    item
      .on("mouseenter", function () {
        innerChart.selectAll(".donut-arc path")
          .style("opacity", other => other.data.label === d.label ? 1 : 0.35);

        innerChart.selectAll(".donut-arc")
          .filter(other => other.data.label === d.label)
          .select("path")
          .transition().duration(200)
          .attr("d", arcHover);
      })
      // In donut-chart.js:
      .on("mouseleave", function () {
        innerChart.selectAll(".donut-arc path")
          .style("opacity", 1)
          .transition().duration(200)
          .attr("d", arcGenerator);
      });
  });

  function moveTooltip(event) {
    tooltip
      .style("left", `${event.pageX}px`)
      .style("top", `${event.pageY - 18}px`);
  }
};