// Week 7 — Luminous Garden
// Full-screen generative projection artwork. No mapper plugin is required to preview it.

let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noCursor();
}

function draw() {
  t += 0.012;
  background(5, 8, 24);

  // Subtle atmospheric glow behind the composition
  noStroke();
  for (let r = max(width, height) * 0.8; r > 20; r -= 24) {
    fill(12, 35, 75, 2);
    ellipse(width * 0.48, height * 0.5, r, r);
  }

  drawFlower(width * 0.48, height * 0.5, min(width, height) * 0.34);

  // Flowing luminous ribbons on the right, like a second projection surface
  drawRibbons();

  // Floating points of light throughout the scene
  for (let i = 0; i < 90; i++) {
    const a = i * 2.399 + t * 0.12;
    const radius = 25 + ((i * 47) % (min(width, height) * 0.48));
    const x = width * 0.48 + cos(a) * radius;
    const y = height * 0.5 + sin(a) * radius;
    const alpha = 90 + 90 * sin(t * 2 + i);
    noStroke();
    fill(145, 220, 255, alpha);
    circle(x, y, 1.5 + (i % 3));
  }

  // Soft center light
  noStroke();
  for (let r = 70; r > 2; r -= 4) {
    fill(105, 220, 255, map(r, 70, 2, 5, 28));
    circle(width * 0.48, height * 0.5, r);
  }
}

function drawFlower(cx, cy, size) {
  push();
  translate(cx, cy);
  const layers = 5;
  for (let layer = layers - 1; layer >= 0; layer--) {
    const petals = 12 + layer * 4;
    for (let i = 0; i < petals; i++) {
      push();
      rotate(TWO_PI * i / petals + t * (layer % 2 ? -0.12 : 0.12) + layer * 0.11);
      noFill();
      stroke(55 + layer * 24, 145 + layer * 15, 225, 150);
      strokeWeight(1.5 + layer * 0.35);
      const reach = size * (0.38 + layer * 0.105) * (1 + 0.035 * sin(t * 2 + i));
      ellipse(0, -reach * 0.48, size * (0.11 + layer * 0.025), reach);
      pop();
    }
  }

  // Inner luminous petals
  for (let i = 0; i < 8; i++) {
    push();
    rotate(TWO_PI * i / 8 - t * 0.3);
    noStroke();
    fill(115, 225, 255, 70);
    ellipse(0, -size * 0.11, size * 0.12, size * 0.3);
    pop();
  }
  pop();
}

function drawRibbons() {
  push();
  const ribbonStart = width * 0.72;
  const ribbonWidth = width * 0.28;
  for (let band = 0; band < 9; band++) {
    noFill();
    stroke(75 + band * 12, 105 + band * 10, 230, 145);
    strokeWeight(1.5 + (band % 3));
    beginShape();
    for (let y = -20; y <= height + 20; y += 10) {
      const x = ribbonStart + band * (ribbonWidth / 9)
        + sin(y * 0.009 + t + band * 0.65) * (18 + band * 3)
        + cos(y * 0.018 - t * 0.7) * 10;
      curveVertex(x, y);
    }
    endShape();
  }

  // Drifting droplets
  for (let i = 0; i < 45; i++) {
    const y = (i * 37 + frameCount * (0.7 + (i % 4) * 0.18)) % (height + 30) - 15;
    const x = ribbonStart + ribbonWidth * 0.48
      + sin(y * 0.012 + t + i) * ribbonWidth * 0.35;
    noStroke();
    fill(130, 220, 255, 180);
    ellipse(x, y, 3 + (i % 4), 9 + (i % 5) * 2);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}