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

  // Exercise 6.1 & 6.2: Histogram
  drawHistogram(data);
  populateFilters(data);

  // Exercise 6.3 & 6.4: Scatterplot and tooltip setups
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();

}).catch(error => {
  console.error("Error reading CSV:", error);
});