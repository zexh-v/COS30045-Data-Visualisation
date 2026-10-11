const populateFilters = (data) => {
  // 1. Create and render the filter buttons
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
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
  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", d => yScale(d.length))
    .attr("height", d => innerHeight - yScale(d.length));
};

// --- Stubs for Exercise 6.4 (Tooltips) ---
const createTooltip = () => {
  // Will be implemented in Exercise 6.4
};

const handleMouseEvents = () => {
  // Will be implemented in Exercise 6.4
};