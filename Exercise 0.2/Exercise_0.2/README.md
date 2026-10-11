# Appliance Energy Consumption Website

A small three-page website about appliance energy consumption in the Australian market, built with plain HTML, CSS, and vanilla JavaScript.

## Folder Structure

```
/
  index.html            Home page
  televisions.html      Televisions page
  about.html            About Us page
  assets/
    style.css           All site styling
    scripts.js          Shared behaviour: footer year, mobile nav, FAQ accordion, and interactive appliance energy calculator logic
    img/
      PowerIcon.png     Site logo
  README.md
```

## Pages & Navigation

- Three pages: Home, Televisions, About Us.
- A shared top navigation bar appears on every page, with the PowerIcon logo in the top-left
  corner. Clicking the logo returns the user to `index.html`.
- The nav bar highlights the current page (`.active` class) and has a hover effect on all links.
- On small screens the nav collapses behind a hamburger button (handled in `main.js`).

## Home Page

- Placeholder content about appliance energy use in Australia.
- A FAQ section built as an accordion: each question is a `<button>` that toggles a hidden answer
  panel via JavaScript (`main.js`). Only one answer is open at a time.

## Televisions Page

- A comparison table of example TV models and their average wattage.
- An interactive **Appliance Energy Calculator**:
  - Choose a preset TV model (auto-fills wattage) or enter a custom wattage.
  - Enter average daily hours of use and an electricity price (cents/kWh).
  - On submit, JavaScript calculates daily, monthly, and yearly energy use (kWh) plus estimated
    monthly and yearly cost, and updates the results panel in place (no page reload, no alerts).
  - Inputs are validated; invalid values show inline error messages instead of breaking the page.
  - A Reset button clears the form and results.

## About Us Page

- Placeholder project description and author bio section.
- Generative AI acknowledgement.

## Styling

- All styling lives in `assets/css/style.css` (no inline styles, no per-page `<style>` blocks).
- The colour palette is drawn from the PowerIcon logo and applied consistently across all three pages.

## Footer

Every page includes a footer with the current year (set dynamically via JavaScript), the author's name.

## Notes / To-Do Before Submission

- Replace `assets/img/PowerIcon.png` with the actual logo file supplied for the assignment if this
  placeholder differs from it.
- Replace "Your Name Here" in the footer of each page with your actual name.
- Replace placeholder paragraph text with your own original wording where required by your unit's
  academic integrity rules.
- If you used GenAI, keep the acknowledgement; adjust the wording to match your institution's
  required citation format if one is specified.

## Generative AI Acknowledgement

Generative AI (Claude by Anthropic) was used to assist with creating the Appliance Energy Calculator, then reviewed and adapted for this project.
