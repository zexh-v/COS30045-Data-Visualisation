// ==========================================================================
// Exercise 4.7: Enhanced D3 Bar Chart - Television Models by Brand
// Incorporates modern scaling, responsive SVG viewBox, animated transitions,
// interactive filtering & sorting, rich tooltips, and theme awareness.
// ==========================================================================

// Helper: Custom display names for brand acronyms & proper capitalization
const BRAND_NAMES = {
  "lg": "LG",
  "tcl": "TCL",
  "jvc": "JVC",
  "eko": "EKO",
  "chiq": "CHiQ",
  "ffalcon": "FFalcon",
  "spark electronics": "Spark Electronics"
};

function formatBrandName(raw) {
  const clean = (raw || "").trim();
  const lower = clean.toLowerCase();
  if (BRAND_NAMES[lower]) return BRAND_NAMES[lower];
  return lower
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Chart configuration and responsive layout dimensions
const chartConfig = {
  width: 850,
  barHeight: 25,
  barPadding: 9,
  margin: { top: 25, right: 90, bottom: 45, left: 145 },
  animationDuration: 650
};

// Application state
let fullData = [];
let totalModels = 0;
let currentFilter = "all";   // "all" | "top10"
let currentSort = "desc";     // "desc" | "asc" | "alpha"
let currentSearch = "";

// DOM Elements
const container = d3.select("#chartContainer");
const tooltip = d3.select("#chartTooltip");
const searchInput = document.getElementById("brandSearchInput");

// Initialize Responsive SVG Canvas and Defs (Gradients & Filters)
const svg = container
  .append("svg")
  .attr("class", "chart-svg")
  .attr("role", "img")
  .attr("aria-label", "Horizontal bar chart showing television models by brand");

// Append defs for linear gradients and visual depth
const defs = svg.append("defs");

// Standard Bar Gradient (Ocean/Sky Blue -> Bright Cyan)
const barGrad = defs
  .append("linearGradient")
  .attr("id", "barGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

barGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0284C7");
barGrad.append("stop").attr("offset", "100%").attr("stop-color", "#38BDF8");

// Market Leader Bar Gradient (#1 Rank: Energy Gold / Amber)
const leaderGrad = defs
  .append("linearGradient")
  .attr("id", "leaderGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

leaderGrad.append("stop").attr("offset", "0%").attr("stop-color", "#D97706");
leaderGrad.append("stop").attr("offset", "100%").attr("stop-color", "#FBBF24");

// SVG Structural Groups
const gridGroup = svg.append("g").attr("class", "grid-line");
const axisXGroup = svg.append("g").attr("class", "axis-x");
const barsGroup = svg.append("g").attr("class", "bars-container");
const axisTitle = svg
  .append("text")
  .attr("class", "axis-title")
  .attr("text-anchor", "middle")
  .text("Number of Registered TV Models");

// ==========================================================================
// Exercise 4.4: Load and Format Data
// ==========================================================================
d3.csv("data/tvBrandCount.csv", d => {
  return {
    rawBrand: d.brand,
    brand: formatBrandName(d.brand),
    count: +d.count
  };
}).then(data => {
  // Sort descending to establish baseline ranking
  data.sort((a, b) => b.count - a.count);

  // Calculate dataset metrics
  totalModels = d3.sum(data, d => d.count);

  data.forEach((d, index) => {
    d.rank = index + 1;
    d.share = ((d.count / totalModels) * 100).toFixed(1);
  });

  fullData = data;

  // Update Summary KPI Cards dynamically
  updateKpiCards();

  // Attach interactive toolbar listeners
  setupToolbarListeners();

  // Draw chart initially with animated entrance
  renderChart(true);
}).catch(err => {
  console.error("Error loading tvBrandCount.csv:", err);
  container.html("<div class='chart-empty'>⚠️ Failed to load dataset. Please check data/tvBrandCount.csv.</div>");
});

// ==========================================================================
// Update KPI Summary Metrics
// ==========================================================================
function updateKpiCards() {
  const kpiTotalModels = document.getElementById("kpiTotalModels");
  const kpiTotalBrands = document.getElementById("kpiTotalBrands");
  const kpiTopBrand = document.getElementById("kpiTopBrand");
  const kpiTopBrandSub = document.getElementById("kpiTopBrandSub");
  const kpiTop3Share = document.getElementById("kpiTop3Share");

  if (kpiTotalModels) kpiTotalModels.textContent = d3.format(",")(totalModels);
  if (kpiTotalBrands) kpiTotalBrands.textContent = fullData.length;

  if (fullData.length > 0) {
    const leader = fullData[0];
    if (kpiTopBrand) kpiTopBrand.textContent = leader.brand;
    if (kpiTopBrandSub) kpiTopBrandSub.textContent = `${d3.format(",")(leader.count)} models • ${leader.share}%`;

    const top3Count = d3.sum(fullData.slice(0, 3), d => d.count);
    const top3Pct = ((top3Count / totalModels) * 100).toFixed(1);
    if (kpiTop3Share) kpiTop3Share.textContent = `${top3Pct}%`;
  }
}

// ==========================================================================
// Data Transformation Pipeline (Filter, Search, Sort)
// ==========================================================================
function getProcessedData() {
  let list = [...fullData];

  // 1. Text Search Filter
  if (currentSearch.trim() !== "") {
    const q = currentSearch.trim().toLowerCase();
    list = list.filter(d => d.brand.toLowerCase().includes(q));
  }

  // 2. Count Filter (Top 10 vs All)
  if (currentFilter === "top10") {
    // Slices top 10 by overall rank
    list = list.filter(d => d.rank <= 10);
  }

  // 3. Sorting
  if (currentSort === "desc") {
    list.sort((a, b) => b.count - a.count);
  } else if (currentSort === "asc") {
    list.sort((a, b) => a.count - b.count);
  } else if (currentSort === "alpha") {
    list.sort((a, b) => a.brand.localeCompare(b.brand));
  }

  return list;
}

// ==========================================================================
// Chart Rendering Function
// ==========================================================================
function renderChart(isInitial = false) {
  const data = getProcessedData();
  const { width, barHeight, barPadding, margin, animationDuration } = chartConfig;

  // Handle empty search results
  if (data.length === 0) {
    barsGroup.selectAll("g.bar-group").remove();
    gridGroup.selectAll("*").remove();
    axisXGroup.selectAll("*").remove();
    axisTitle.attr("opacity", 0);

    svg.attr("viewBox", `0 0 ${width} 120`);
    if (container.select(".chart-empty").empty()) {
      container.append("div")
        .attr("class", "chart-empty")
        .text(`No brands found matching "${currentSearch}". Try a different keyword.`);
    }
    return;
  }

  // Remove any empty notification
  container.selectAll(".chart-empty").remove();
  axisTitle.attr("opacity", 1);

  // Dynamic Height calculation according to active dataset length
  const height = margin.top + margin.bottom + data.length * (barHeight + barPadding);
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  // Transition definition
  const t = svg.transition().duration(animationDuration).ease(d3.easeCubicOut);

  // Exercise 4.6: Scaling Charts with D3 Scales
  const maxCount = d3.max(data, d => d.count) || 100;
  const xScale = d3.scaleLinear()
    .domain([0, maxCount * 1.08])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([margin.top, height - margin.bottom])
    .padding(0.24);

  // 1. Gridlines behind bars
  const gridAxis = d3.axisBottom(xScale)
    .ticks(6)
    .tickSize(-(height - margin.top - margin.bottom))
    .tickFormat("");

  gridGroup
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .transition(t)
    .call(gridAxis);

  // 2. Bottom X-Axis
  const xAxis = d3.axisBottom(xScale)
    .ticks(6)
    .tickFormat(d3.format(","));

  axisXGroup
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .transition(t)
    .call(xAxis);

  // Axis title placement
  axisTitle
    .transition(t)
    .attr("x", margin.left + (width - margin.left - margin.right) / 2)
    .attr("y", height - 8);

  // 3. Bars Data Binding using D3 Join
  const barGroups = barsGroup
    .selectAll("g.bar-group")
    .data(data, d => d.brand);

  // EXIT: Remove leaving bars
  barGroups.exit()
    .transition(t)
    .style("opacity", 0)
    .remove();

  // ENTER: Create new bar elements
  const barEnter = barGroups.enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`)
    .style("opacity", 0);

  // Background hover hit area for smooth pointer interaction
  barEnter.append("rect")
    .attr("class", "bar-hit-area")
    .attr("x", 0)
    .attr("y", -2)
    .attr("width", width)
    .attr("height", yScale.bandwidth() + 4)
    .attr("fill", "transparent");

  // Visual Bar Rectangle
  barEnter.append("rect")
    .attr("class", "bar-rect")
    .attr("x", margin.left)
    .attr("y", 0)
    .attr("height", yScale.bandwidth())
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", d => d.rank === 1 ? "url(#leaderGradient)" : "url(#barGradient)")
    .attr("width", 0);

  // Category Label (Brand Name on the left)
  barEnter.append("text")
    .attr("class", "brand-label")
    .attr("x", margin.left - 12)
    .attr("y", yScale.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .text(d => d.brand);

  // Numeric Count Label (at the tip of each bar)
  barEnter.append("text")
    .attr("class", "count-label")
    .attr("x", margin.left + 8)
    .attr("y", yScale.bandwidth() / 2 + 4)
    .text(d => d3.format(",")(d.count));

  // Percentage share label
  barEnter.append("text")
    .attr("class", "pct-label")
    .attr("x", margin.left + 50)
    .attr("y", yScale.bandwidth() / 2 + 4)
    .text(d => `(${d.share}%)`);

  // MERGE / UPDATE: Animate existing and entering elements
  const barMerged = barEnter.merge(barGroups);

  barMerged
    .transition(t)
    .style("opacity", 1)
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  barMerged.select("rect.bar-rect")
    .attr("fill", d => d.rank === 1 ? "url(#leaderGradient)" : "url(#barGradient)")
    .transition(t)
    .attr("height", yScale.bandwidth())
    .attr("width", d => Math.max(4, xScale(d.count) - margin.left));

  barMerged.select(".brand-label")
    .text(d => d.brand)
    .transition(t)
    .attr("y", yScale.bandwidth() / 2 + 4);

  barMerged.select(".count-label")
    .text(d => d3.format(",")(d.count))
    .transition(t)
    .attr("x", d => xScale(d.count) + 8)
    .attr("y", yScale.bandwidth() / 2 + 4);

  barMerged.select(".pct-label")
    .text(d => `(${d.share}%)`)
    .transition(t)
    .attr("x", d => xScale(d.count) + 14 + (d.count >= 1000 ? 44 : (d.count >= 100 ? 34 : 26)))
    .attr("y", yScale.bandwidth() / 2 + 4);

  // Attach interactive hover & tooltip events
  barMerged
    .on("mouseenter", function (event, d) {
      // Dim surrounding bars
      barsGroup.selectAll("g.bar-group")
        .style("opacity", other => other.brand === d.brand ? 1 : 0.35);

      // Tooltip HTML content
      const rankBadge = d.rank === 1
        ? `<span class="tooltip-rank rank-1">⭐ #1 Leader</span>`
        : `<span class="tooltip-rank">Rank #${d.rank}</span>`;

      tooltip.html(`
        <div class="tooltip-header">
          <span class="tooltip-brand">${d.brand}</span>
          ${rankBadge}
        </div>
        <div class="tooltip-row">
          <span>Registered Models:</span>
          <strong>${d3.format(",")(d.count)}</strong>
        </div>
        <div class="tooltip-row">
          <span>Market Share:</span>
          <strong>${d.share}%</strong>
        </div>
      `);

      tooltip.classed("visible", true);
      positionTooltip(event);
    })
    .on("mousemove", function (event) {
      positionTooltip(event);
    })
    .on("mouseleave", function () {
      // Restore opacity
      barsGroup.selectAll("g.bar-group").style("opacity", 1);
      tooltip.classed("visible", false);
    });
}

// Tooltip positioning helper relative to the chart card wrapper
function positionTooltip(event) {
  const chartWrapper = document.querySelector(".chart-wrapper");
  if (!chartWrapper) return;

  const rect = chartWrapper.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  tooltip
    .style("left", `${mouseX}px`)
    .style("top", `${mouseY - 12}px`);
}

// ==========================================================================
// Setup Toolbar Event Listeners
// ==========================================================================
function setupToolbarListeners() {
  const btnAll = document.getElementById("btnFilterAll");
  const btnTop10 = document.getElementById("btnFilterTop10");

  const btnDesc = document.getElementById("btnSortDesc");
  const btnAsc = document.getElementById("btnSortAsc");
  const btnAlpha = document.getElementById("btnSortAlpha");

  // Filter Buttons
  if (btnAll && btnTop10) {
    btnAll.addEventListener("click", () => {
      if (currentFilter === "all") return;
      currentFilter = "all";
      btnAll.classList.add("active");
      btnTop10.classList.remove("active");
      renderChart();
    });

    btnTop10.addEventListener("click", () => {
      if (currentFilter === "top10") return;
      currentFilter = "top10";
      btnTop10.classList.add("active");
      btnAll.classList.remove("active");
      renderChart();
    });
  }

  // Sort Buttons
  const sortButtons = [
    { btn: btnDesc, mode: "desc" },
    { btn: btnAsc, mode: "asc" },
    { btn: btnAlpha, mode: "alpha" }
  ];

  sortButtons.forEach(item => {
    if (item.btn) {
      item.btn.addEventListener("click", () => {
        if (currentSort === item.mode) return;
        currentSort = item.mode;
        sortButtons.forEach(o => o.btn.classList.remove("active"));
        item.btn.classList.add("active");
        renderChart();
      });
    }
  });

  // Search Input Filter
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value;
      renderChart();
    });
  }
}