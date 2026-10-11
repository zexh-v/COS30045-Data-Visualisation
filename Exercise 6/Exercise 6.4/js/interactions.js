// ==========================================================================
// Exercise 6.2 & 6.4: Interactive Filters and Mouse Events
// ==========================================================================

const populateFilters = (data) => {
  const container = d3.select("#filters_screen");
  container.selectAll("*").remove();

  container.append("span")
    .attr("class", "filters-label")
    .text("Screen Technology:");

  // 1. Create and render the filter buttons
  container
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .attr("type", "button")
      .text(d => d.label)
      .on("click", (e, d) => {
        // Only trigger if clicked button is not already active
        if (!d.isActive) {
          // Update the isActive state in filters_screen array
          filters_screen.forEach(filter => {
            filter.isActive = d.id === filter.id;
          });

          // Update CSS class for active state
          d3.selectAll("#filters_screen .filter")
            .classed("active", filter => filter.isActive);

          // Update histogram bars
          updateHistogram(d.id, data);
        }
      });
};

const updateHistogram = (filterId, data) => {
  // 1. Filter data based on screenTech (or return full data if "all")
  const updatedData = filterId === "all"
    ? data
    : data.filter(tv => tv.screenTech === filterId);

  // 2. Re-bin filtered data using shared binGenerator
  const updatedBins = binGenerator(updatedData);

  // 3. Smooth transition to update bar heights and positions
  d3.selectAll("#histogram rect.hist-bar")
    .data(updatedBins)
    .transition()
    .duration(550)
    .ease(d3.easeCubicInOut)
    .attr("y", d => yScale(d.length))
    .attr("height", d => innerHeight - yScale(d.length));
};

const createTooltip = () => {
  // 1. Append tooltip group to the scatterplot innerChart (hidden by default)
  const tooltip = innerChartS
    .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // 2. Append background rectangle with modern styling
  tooltip
    .append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "#0F172A")
      .attr("fill-opacity", 0.92)
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 1);

  // 3. Append text element centered in the rectangle
  tooltip
    .append("text")
      .attr("x", tooltipWidth / 2)
      .attr("y", tooltipHeight / 2 + 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#F8FAFC")
      .style("font-family", "var(--font-heading)")
      .style("font-size", "12px")
      .style("font-weight", 700);
};

const handleMouseEvents = () => {
  innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
      // 1. Update text to show screen size
      d3.select(".tooltip text")
        .text(`${d.screenSize}" Screen`);

      // 2. Get circle's center coordinates from event target
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // 3. Position tooltip above circle and transition opacity to 1
      d3.select(".tooltip")
        .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.35 * tooltipHeight})`)
        .transition()
        .duration(150)
        .style("opacity", 1);

      // UX highlight: increase circle radius and stroke
      d3.select(e.target)
        .transition().duration(150)
        .attr("r", 6.5)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 2)
        .attr("opacity", 1);
    })
    .on("mouseleave", (e, d) => {
      // 4. Hide tooltip and move it out of the way
      d3.select(".tooltip")
        .transition()
        .duration(150)
        .style("opacity", 0)
        .attr("transform", `translate(0, 500)`);

      // Revert circle highlight
      d3.select(e.target)
        .transition().duration(150)
        .attr("r", 4.5)
        .attr("stroke", "none")
        .attr("opacity", 0.55);
    });
};