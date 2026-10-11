// Chart dimensions & margins
const width = 800;
const height = 450;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Shared Colors
const bodyBackgroundColor = "#ffffff";
const barColor = "#4e79a7";

// Shared Bin Generator
const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

// Shared Scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Filter array for screen technologies
const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "LED", label: "LED", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];