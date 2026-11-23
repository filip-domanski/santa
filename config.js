// Secret Santa settings.
//
// To use a Google Sheet as the backend (lost-link re-sending, "times opened"
// counter, old links stop working after a redraw), paste your Apps Script
// web app URL below. See README.md → "Google Sheet backend".
//
// Leave it empty to run without a backend: each link then carries its whole
// encrypted draw and nothing is stored anywhere.
window.SANTA_CONFIG = {
  sheetApiUrl: "https://script.google.com/macros/s/AKfycbyb2DkU7ujqT9ulzaNL6qDWBeg4_2gFEXagBNW7A9v6sItLjICZHnOxNPlzIUKuw_Ha/exec",
};
