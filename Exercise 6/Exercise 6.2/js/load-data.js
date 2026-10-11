d3.csv("data/Ex6_TVdata_withStar.csv", d => {
  return {
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    star: +d.star,
    energyConsumption: +d.energyConsumption
  };
}).then(data => {
  console.log("Total records loaded:", data.length);

  // Render initial histogram
  drawHistogram(data);

  // Initialize interactive filter buttons
  populateFilters(data);

}).catch(error => {
  console.error("Error reading CSV:", error);
});