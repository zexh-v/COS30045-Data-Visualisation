# Exercise 3 - Data Story: TV Energy Consumption

## Overview

In this exercise, I have tried to develop a data story that focuses on how the selection of hardware for the television influences the use of energy in households. Visualizations will assist the consumers in analyzing data from the Australian TV Energy Rating data set.

---

## Data Story

### Audience

* **Primary Audience:**
    - Everyday consumers, prospective TV buyers, and budget household bill-payers.

* **Audience Persona & Mindset:**
    - Non-technical users unfamiliar with metrics like kilowatt-hours per year (kWh/year) or panel backlighting specs.
    - Driven by real-world trade-offs: Screen Size vs. Sticker Price vs. Ongoing Power Costs.

* **Story Guidelines for Audience:**
    - Avoid raw electrical engineering jargon; frame figures around tangible running efficiency.
    - Use intuitive visualisations (scatter plots with trends and comparison bar charts) rather than complex multi-dimensional plots.
    - Provide concrete buying rules of thumb to help them make informed purchases in retail stores.

### Story Overview

Present retail fashions tend to force consumers into purchasing increasingly bigger screens (55", 65", and 75"+). Nonetheless, due to the fact that surface area is not directly proportional to size but rather increases quadratically, one might face a rapid increase in energy requirements. 

This story attempts to answer the crucial question: **"Would the choice of a bigger television make your electricity bills grow exponentially, and what role does choosing the proper display technology play in mitigating the size impact?"**

It is presented in three chapters:
1. **The Market Overview:** Determining the most popular television screen sizes from the market (based on the Exercise 2 results on size distribution).
2. **The Size Impact:** Exploring the correlation between the diagonal screen size and yearly electricity usage by the means of scatter plotting.
3. **The Technology Impact:** Comparing different screen technologies (OLED vs. traditional LED-backlit LCD screens) efficiency at equal sizes.

---

## About the Data

### Data Source

The dataset used in this project contains information about **television models and their energy consumption characteristics**, including power usage, screen size, technology type, and efficiency ratings.

The dataset was provided as part of the course materials.

### Data Processing

The dataset was preprocessed, transformed and analyzed in KNIME Analytics Platform using structured analytical pipelines:
* **Q1 Analysis of Brand and Market:** Loaded through ***CSV Reader***, filtered relevant columns through ***Column Filter***, standardized text fields through ***String Cleaner*** and ***String Replacer***, filtered out outlier/missing brands through ***Nominal Value Row Filter***, computed market shares via ***GroupBy*** and ***Sorter*** followed by visualization through ***Bar Chart*** and ***Pie Chart***.
* **Q2 Analysis of Screen Dimension:** Reduced to features related to the screen dimensions through ***Column Filter*** and analyzed through the ***Histogram*** view to identify the hot-spots in the market.
* **Q3 Energy Draw:** Preprocessed through ***Column Filter*** node, converted and computed the consumption ratios through ***Expression*** nodes, changed the structure of the data through ***Column Resorter***, rounded values to standard decimal points through ***Number Rounder*** and analyzed the variance through ***Scatter Plot***, ***GroupBy*** and ***Bar Chart*** views.
* **Q4 Impact of Screen Technology:** Analyzed panel efficiency by using ***Column Filter***, ***Expression***, ***Column Resorter*** and ***Number Rounder*** nodes, transformed the data for various panels through ***Pivot*** node and finally visualized via ***Bar Chart***.

### Privacy

The dataset does not contain any **personal or sensitive information**. It focuses solely on product specifications and energy consumption data related to television devices.

### Accuracy and Limitations
These factors should be considered when interpreting the visualisations.

* **Test Setting vs. Real-World Use:**
Annual energy figures assume standardized testing profiles (approx. 4.5 hours active viewing and 10 hours standby per day). 

* **Dynamic Settings:**
Real-world usage differs based on brightness settings, enabling HDR content, dynamic backlight manipulation, room ambient light sensors, and retail "Vivid" modes that draw higher peak power.

* **Model Coverage:**
The dataset reflects models registered under the regulatory scheme in Australia and may omit uncertified or gray-market imports.

### Ethics

When presenting data visualisations, it is important to ensure that the information is represented **accurately and responsibly**.

This project follows ethical data visualisation practices by:

- Avoiding misleading visual representations
- Clearly explaining the context of the data
- Presenting information transparently so viewers can interpret the results correctly

---

## AI Declaration

Artificial Intelligence (AI) tools have been used to assist with aspects of this assignment, such as:

- Gave User Interface (UI) suggestions to improve the visual of the website
- Assisting with KNIME Workflow
- Assisting with basic spelling and grammar checking

All AI-generated assistance was reviewed, modified where necessary, and integrated responsibly into the project.

---

## Website Storytelling

The website has been updated to communicate a **data-driven story** based on the TV energy consumption dataset.

The website includes:

- Visualisations that present key insights from the dataset
- Text explanations that help readers understand the meaning of the visualisations
- Context that connects the data to real-world implications

The aim is to guide the viewer through the data in a way that is **informative, engaging, and easy to understand**.
