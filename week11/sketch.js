// Week 11 — Data Visualization / Data Portraiture
// Research question: Which kinds of 311 service requests appear most often
// in each NYC borough, and how does that pattern change by place?

const BOROUGHS = ["BROOKLYN", "QUEENS", "MANHATTAN", "BRONX", "STATEN ISLAND"];
const BOROUGH_LABELS = ["Brooklyn", "Queens", "Manhattan", "Bronx", "Staten Island"];
let rows = [];
let selectedBorough = 0;
let loading = true;
let errorMessage = "";
let lastUpdated = "";

function setup() {
  const canvas = createCanvas(980, 650);
  canvas.parent("sketch");
  textFont("Arial");
  loadRequests();
}

async function loadRequests() {
  loading = true;
  errorMessage = "";
  const params = new URLSearchParams({
    "$select": "borough,complaint_type,count(*) as total",
    "$where": "created_date >= '2025-01-01T00:00:00' AND created_date < '2026-01-01T00:00:00' AND borough in ('BROOKLYN','QUEENS','MANHATTAN','BRONX','STATEN ISLAND')",
    "$group": "borough,complaint_type",
    "$order": "total DESC",
    "$limit": "300"
  });

  try {
    const response = await fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?" + params.toString());
    if (!response.ok) throw new Error("NYC Open Data returned " + response.status);
    rows = await response.json();
    lastUpdated = new Date().toLocaleDateString();
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("No records were returned for 2025.");
    loading = false;
  } catch (error) {
    console.error(error);
    errorMessage = "Could not load the dataset. Check your internet connection and refresh.";
    loading = false;
  }
}

function draw() {
  background(244, 240, 231);
  drawHeader();

  if (loading) {
    fill(45);
    textSize(18);
    text("Loading NYC 311 data…", 42, 190);
    return;
  }

  if (errorMessage) {
    fill(150, 45, 35);
    textSize(16);
    text(errorMessage, 42, 190);
    return;
  }

  drawBoroughTabs();
  if (selectedBorough === -1) drawAllBoroughs();
  else drawOneBorough(selectedBorough);
  drawFooter();
}

function drawHeader() {
  noStroke();
  fill(37, 48, 42);
  textSize(13);
  text("DATA PORTRAIT  /  NEW YORK CITY  /  2025", 42, 38);
  textSize(29);
  text("What does the city ask to be fixed?", 42, 78);
  fill(88, 91, 80);
  textSize(13);
  text("311 requests are a record of reported needs—not a complete measure of every neighborhood's conditions.", 42, 105);
}

function drawBoroughTabs() {
  const labels = ["Brooklyn", "Queens", "Manhattan", "Bronx", "Staten Island", "All"];
  const values = [0, 1, 2, 3, 4, -1];
  let x = 42;
  for (let i = 0; i < labels.length; i++) {
    const active = selectedBorough === values[i];
    const w = labels[i] === "Staten Island" ? 116 : 92;
    noStroke();
    fill(active ? color(48, 83, 68) : color(224, 219, 207));
    rect(x, 128, w - 7, 32, 16);
    fill(active ? 255 : color(55, 60, 52));
    textSize(12);
    textAlign(CENTER, CENTER);
    text(labels[i], x + (w - 7) / 2, 144);
    x += w;
  }
  textAlign(LEFT, BASELINE);
  fill(95, 97, 86);
  textSize(11);
  text("Keys 1–5 select a borough · A compares all", 42, 184);
}

function drawOneBorough(index) {
  const borough = BOROUGHS[index];
  const data = rows.filter(row => row.borough === borough)
    .sort((a, b) => Number(b.total) - Number(a.total))
    .slice(0, 10);

  fill(37, 48, 42);
  textSize(20);
  text(BOROUGH_LABELS[index] + " · most reported request types", 42, 225);

  if (!data.length) {
    fill(100);
    textSize(14);
    text("No matching records in the returned sample.", 42, 260);
    return;
  }

  const maxValue = Number(data[0].total);
  const chartX = 285;
  const chartW = 570;
  const topY = 260;
  const rowH = 32;

  data.forEach((item, i) => {
    const y = topY + i * rowH;
    const amount = Number(item.total);
    fill(55, 58, 50);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(shorten(item.complaint_type, 31), chartX - 18, y + 9);
    noStroke();
    fill(220, 215, 202);
    rect(chartX, y, chartW, 17, 8);
    fill(67 + i * 7, 38, 45);
    rect(chartX, y, chartW * amount / maxValue, 17, 8);
    fill(55, 58, 50);
    textAlign(LEFT, CENTER);
    text(amount.toLocaleString(), chartX + chartW + 12, y + 9);
  });
  textAlign(LEFT, BASELINE);
}

function drawAllBoroughs() {
  fill(37, 48, 42);
  textSize(20);
  text("A comparison across the five boroughs", 42, 225);

  const colW = 174;
  const startX = 42;
  const topY = 270;
  for (let b = 0; b < BOROUGHS.length; b++) {
    const x = startX + b * (colW + 12);
    const data = rows.filter(row => row.borough === BOROUGHS[b])
      .sort((a, c) => Number(c.total) - Number(a.total))
      .slice(0, 6);
    fill(48, 83, 68);
    textSize(13);
    text(BOROUGH_LABELS[b], x, 253);
    const maxValue = data.length ? Number(data[0].total) : 1;
    data.forEach((item, i) => {
      const y = topY + i * 48;
      fill(90, 91, 80);
      textSize(10);
      text(shorten(item.complaint_type, 22), x, y);
      fill(220, 215, 202);
      rect(x, y + 8, colW - 8, 10, 5);
      fill(67 + i * 7, 38, 45);
      rect(x, y + 8, (colW - 8) * Number(item.total) / maxValue, 10, 5);
      fill(70);
      textSize(10);
      text(Number(item.total).toLocaleString(), x, y + 34);
    });
  }
}

function drawFooter() {
  stroke(205, 199, 186);
  line(42, 590, width - 42, 590);
  noStroke();
  fill(90, 91, 80);
  textSize(10);
  text("Source: NYC Open Data · 311 Service Requests from 2020 to Present · filtered to 2025 · Retrieved " + lastUpdated, 42, 613);
  text("A 311 request is a report, not a verified count of all problems. Categories and reporting behavior affect the picture.", 42, 632);
}

function shorten(value, maxLength) {
  if (!value) return "Unspecified";
  return value.length > maxLength ? value.slice(0, maxLength - 1) + "…" : value;
}

function keyPressed() {
  if (key >= "1" && key <= "5") selectedBorough = Number(key) - 1;
  if (key === "a" || key === "A") selectedBorough = -1;
  if (key === "r" || key === "R") loadRequests();
}

function windowResized() {
  resizeCanvas(min(windowWidth - 24, 980), 650);
}