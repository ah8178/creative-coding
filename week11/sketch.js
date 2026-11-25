let hourlyTotals = Array(24).fill(0);
let dataLoaded = false;
let loadMessage = "Loading public MTA data…";
let maxValue = 1;

function setup() {
  const canvas = createCanvas(900, 540);
  canvas.parent("canvas-holder");
  textFont("system-ui");
  loadRidership();
}

async function loadRidership() {
  const endpoint = "https://data.ny.gov/resource/wujg-7c2s.json?$limit=2000&$order=transit_timestamp%20DESC";
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("The data service returned " + response.status);
    const rows = await response.json();

    hourlyTotals = Array(24).fill(0);
    for (const row of rows) {
      if (!row.transit_timestamp || row.ridership === undefined) continue;
      const hour = new Date(row.transit_timestamp).getHours();
      const riders = Number(row.ridership);
      if (Number.isFinite(riders)) hourlyTotals[hour] += riders;
    }

    maxValue = max(hourlyTotals);
    if (maxValue <= 0) maxValue = 1;
    dataLoaded = true;
    loadMessage = "Loaded " + rows.length + " recent records. Bars show the sum of ridership in the returned sample.";
    select("#status").html(loadMessage);
  } catch (error) {
    loadMessage = "Could not load the live dataset. Check the browser connection or try again later. " + error.message;
    select("#status").html(loadMessage);
  }
}

function draw() {
  background(235, 231, 219);
  const left = 72, right = 28, top = 70, bottom = 95;
  const chartW = width - left - right;
  const chartH = height - top - bottom;

  fill(49, 62, 53);
  noStroke();
  textAlign(LEFT);
  textSize(20);
  text("Ridership by hour", left, 36);
  textSize(12);
  fill(100, 112, 101);
  text("Aggregated from the most recent 2,000 records returned by the public API", left, 56);

  stroke(190, 188, 174);
  line(left, top + chartH, width - right, top + chartH);

  if (!dataLoaded) {
    noStroke();
    fill(91, 119, 99);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Waiting for data…", width / 2, height / 2);
    return;
  }

  const slot = chartW / 24;
  for (let h = 0; h < 24; h++) {
    const barH = (hourlyTotals[h] / maxValue) * chartH;
    const x = left + h * slot + 3;
    const y = top + chartH - barH;

    noStroke();
    fill(91, 119, 99);
    rect(x, y, slot - 6, barH, 5, 5, 0, 0);

    if (h % 2 === 0) {
      fill(74, 85, 75);
      textAlign(CENTER);
      textSize(10);
      text(String(h).padStart(2, "0"), x + (slot - 6) / 2, top + chartH + 20);
    }
  }

  fill(49, 62, 53);
  textAlign(CENTER);
  textSize(12);
  text("Hour of day (24-hour clock)", width / 2, height - 35);
  textAlign(LEFT);
  fill(100, 112, 101);
  textSize(11);
  text("Note: this is a sample-based snapshot, not a complete daily total.", left, height - 12);
}
