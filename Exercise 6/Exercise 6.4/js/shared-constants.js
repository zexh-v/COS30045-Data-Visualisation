// ==========================================================================
// Exercise 6.4: Shared Constants & Dimensions
// ==========================================================================

// Chart dimensions & margins
const width = 800;
const height = 460;
const margin = { top: 40, right: 35, bottom: 60, left: 65 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Shared Colors & Bin Generator for Histogram
const bodyBackgroundColor = "#ffffff";
const barColor = "#0284C7";

const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const filters_screen = [
  { id: "all", label: "All Technologies", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// --- Dedicated constants for Scatterplot (Exercise 6.3 & 6.4) ---
let innerChartS;
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Categorical color scale for screen technologies matching site design tokens
const colorScale = d3.scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#0284C7", "#10B981", "#F59E0B"]); // LED: Ocean Blue, LCD: Emerald Green, OLED: Energy Amber

const tooltipWidth = 110;
const tooltipHeight = 36;