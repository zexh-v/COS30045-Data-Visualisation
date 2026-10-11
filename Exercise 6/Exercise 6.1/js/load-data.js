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
  console.log("Total records loaded:", data.length); // Should show 4233
  console.log("First row preview:", data[0]);

  // Optional: If you want to omit the 2652 outlier TV noted in your instructions:
  // const filteredData = data.filter(d => d.energyConsumption <= 1800);
  // drawHistogram(filteredData);

  drawHistogram(data);
}).catch(error => {
  console.error("Error reading CSV:", error);
});