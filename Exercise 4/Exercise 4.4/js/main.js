//Create svg object within the responsive-svg-container
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Step 1 & 2: Row conversion function using d3.csv()
// The unary plus (+d.count) casts string numbers into actual numeric types
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  // Step 2: Verify parsed data array
  console.log("Loaded Data:", data);

  // Step 3: Explore summary features of the dataset
  console.log("Dataset Length:", data.length);
  console.log("Max Count:", d3.max(data, d => d.count));
  console.log("Min Count:", d3.min(data, d => d.count));
  console.log("Extent (Min & Max):", d3.extent(data, d => d.count));

  // Sort data descending by count for easier interpretation
  data.sort((a, b) => b.count - a.count);
  console.log("Sorted Data:", data);

  // Call placeholder function to prepare for Exercise 4.5
  drawBarChart(data);
});


// Step 3: Function stub to receive data (we will build this in 4.5)
function drawBarChart(data) {
  console.log("Ready to draw bar chart with:", data);
}