// Week 12 — Data Visualization continuation
// Research question: How does the volume of NYC 311 requests change through 2025,
// and do the five boroughs show similar or different monthly patterns?

const BOROUGHS = ["BROOKLYN", "QUEENS", "MANHATTAN", "BRONX", "STATEN ISLAND"];
const LABELS = ["Brooklyn", "Queens", "Manhattan", "Bronx", "Staten Island"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SERIES_COLORS = [155, 35, 205, 12, 275];

let records = [];
let totals = [];
let loading = true;
let errorMessage = "";
let selected = -1; // -1 compares all boroughs

function setup() {
  const canvas = createCanvas(980, 650);
  canvas.parent("sketch");
  textFont("Arial");
  loadMonthlyData();
}

async function loadMonthlyData() {
  loading = true;
  errorMessage = "";
  const params = new URLSearchParams({
    "$select": "date_trunc_ym(created_date) as month, borough, count(*) as total",
    "$where": "created_date >= '2025-01-01T00:00:00' AND created_date < '2026-01-01T00:00:00' AND borough in ('BROOKLYN','QUEENS','MANHATTAN','BRONX','STATEN ISLAND')",
    "$group": "month, borough",
    "$order": "month ASC",
    "$limit": "100"
  });

  try {
    const response = await fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?" + params.toString());
    if (!response.ok) throw new Error("NYC Open Data returned " + response.status);
    records = await response.json();
    if (!records.length) throw new Error("The API returned no monthly records.");
    totals = BOROUGHS.map(borough => MONTHS.map((month, index) => {
      const row = records.find(item => item.borough === borough && Number(item.month.slice(5, 7)) === index + 1);
      return row ? Number(row.total) : 0;
    }));
    loading = false;
  } catch (error) {
    console.error(error);
    errorMessage = "Could not load monthly data. Check your internet connection and refresh.";
    loading = false;
  }
}

function draw() {
  background(244, 240, 231);
  noStroke();
  fill(37, 48, 42);
  textSize(13);
  text("DATA PORTRAIT  /  NEW YORK CITY  /  MONTHLY VIEW", 42, 38);
  textSize(29);
  text("A year of reported city needs", 42, 78);
  fill(88, 91, 80);
  textSize(13);
  text("Monthly 311 service-request totals by borough · January–December 2025", 42, 105);

  if (loading) {
    textSize(18);
    fill(45);
    text("Loading monthly NYC 311 data…", 42, 190);
    return;
  }
  if (errorMessage) {
    fill(150, 45, 35);
    textSize(16);
    text(errorMessage, 42, 190);
    return;
  }

  drawControls();
  drawChart();
  drawLegend();
  drawFooter();
}

function drawControls() {
  const labels = ["All boroughs", ...LABELS];
  let x = 42;
  for (let i = 0; i < labels.length; i++) {
    const active = selected === i - 1;
    const w = i === 0 ? 116 : (i === 5 ? 116 : 100);
    noStroke();
    fill(active ? color(48, 83, 68) : color(224, 219, 207));
    rect(x, 128, w - 8, 32, 16);
    fill(active ? 255 : color(55, 60, 52));
    textSize(11);
    textAlign(CENTER, CENTER);
    text(labels[i], x + (w - 8) / 2, 144);
    x += w;
  }
  textAlign(LEFT, BASELINE);
}

function drawChart() {
  const x0 = 92;
  const y0 = 520;
  const chartW = 820;
  const chartH = 300;
  const indices = selected === -1 ? [0, 1, 2, 3, 4] : [selected];
  let maxValue = 0;
  indices.forEach(i => totals[i].forEach(value => maxValue = max(maxValue, value)));
  maxValue = maxValue * 1.12 || 1;

  stroke(190, 185, 173);
  strokeWeight(1);
  for (let step = 0; step <= 4; step++) {
    const y = y0 - chartH * step / 4;
    line(x0, y, x0 + chartW, y);
    noStroke();
    fill(95, 91, 82);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(Math.round(maxValue * step / 4).toLocaleString(), x0 - 12, y);
    stroke(190, 185, 173);
  }

  for (let m = 0; m < 12; m++) {
    const x = x0 + chartW * m / 11;
    noStroke();
    fill(70, 70, 63);
    textSize(11);
    textAlign(CENTER, TOP);
    text(MONTHS[m], x, y0 + 12);
  }

  indices.forEach(i => {
    noFill();
    stroke(SERIES_COLORS[i], 58, 48);
    strokeWeight(3);
    beginShape();
    for (let m = 0; m < 12; m++) {
      const x = x0 + chartW * m / 11;
      const y = y0 - chartH * totals[i][m] / maxValue;
      vertex(x, y);
    }
    endShape();

    noStroke();
    fill(SERIES_COLORS[i], 58, 48);
    for (let m = 0; m < 12; m++) {
      const x = x0 + chartW * m / 11;
      const y = y0 - chartH * totals[i][m] / maxValue;
      circle(x, y, 7);
    }
  });
  textAlign(LEFT, BASELINE);
}

function drawLegend() {
  let x = 92;
  const y = 590;
  const indices = selected === -1 ? [0, 1, 2, 3, 4] : [selected];
  indices.forEach(i => {
    noStroke();
    fill(SERIES_COLORS[i], 58, 48);
    circle(x, y, 9);
    fill(65, 65, 58);
    textSize(11);
    text(LABELS[i], x + 10, y + 4);
    x += 145;
  });
}

function drawFooter() {
  stroke(205, 199, 186);
  line(42, 614, width - 42, 614);
  noStroke();
  fill(90, 91, 80);
  textSize(10);
  text("Source: NYC Open Data · 311 Service Requests from 2020 to Present · grouped by month and borough", 42, 635);
}

function mousePressed() {
  if (mouseY < 164 && mouseY > 125) {
    const starts = [42, 158, 258, 358, 458, 558];
    for (let i = 0; i < starts.length; i++) {
      const ends = i === 0 ? 150 : starts[i] + 92;
      if (mouseX >= starts[i] && mouseX <= ends) selected = i - 1;
    }
  }
}

function keyPressed() {
  if (key >= "1" && key <= "5") selected = Number(key) - 1;
  if (key === "a" || key === "A") selected = -1;
  if (key === "r" || key === "R") loadMonthlyData();
}

function windowResized() {
  resizeCanvas(min(windowWidth - 24, 980), 650);
}