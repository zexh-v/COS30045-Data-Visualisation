// Chart dimensions & margins
const width = 800;
const height = 450;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Shared Colors & Bin Generator for Histogram
const bodyBackgroundColor = "#ffffff";
const barColor = "#4e79a7";

const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// --- Dedicated constants for Scatterplot (Exercise 6.3) ---
let innerChartS; // Will hold the inner group for the scatterplot
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Categorical color scale for screen technologies (Hue differentiation)
const colorScale = d3.scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#4e79a7", "#e15759", "#76b7b2"]);

// Placeholder constants for tooltips (prepared for Exercise 6.4)
const tooltipWidth = 120;
const tooltipHeight = 40;