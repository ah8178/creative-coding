// Week 7 — Luminous Garden: animated projection-mapping artwork
let mapper, front, side, modeSelect, mode = "Bloom";

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mapper = createProjectionMapper(this);
  front = mapper.createQuadMap(600, 600);
  side = mapper.createQuadMap(400, 600);

  modeSelect = createSelect();
  modeSelect.position(12, 12);
  ["Bloom", "Orbit", "Grid"].forEach(v => modeSelect.option(v));
  modeSelect.changed(() => mode = modeSelect.value());
  modeSelect.style("opacity", "0.18");
}

function draw() {
  background(5, 7, 18);
  front.displaySketch(drawFront);
  side.displaySketch(drawSide);
}

function drawFront(pg) {
  const t = frameCount * 0.012;
  pg.background(5, 9, 26);
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  // Soft atmospheric rings
  pg.noFill();
  for (let i = 0; i < 22; i++) {
    const r = 38 + i * 15 + sin(t * 1.5 + i * 0.24) * 7;
    pg.stroke(35 + i * 3, 105 + i * 4, 170 + i * 3, 45);
    pg.strokeWeight(1.4);
    pg.circle(0, 0, r * 2);
  }

  if (mode === "Bloom") {
    // A slowly opening, luminous flower made from layered petals
    for (let layer = 0; layer < 4; layer++) {
      const petals = 12 + layer * 4;
      for (let i = 0; i < petals; i++) {
        pg.push();
        pg.rotate(TWO_PI * i / petals + layer * 0.13 + t * (layer % 2 ? -0.12 : 0.12));
        pg.noFill();
        pg.stroke(70 + layer * 38, 170 + (i % 4) * 15, 220 + layer * 7, 155);
        pg.strokeWeight(2.2);
        const reach = 105 + layer * 34 + sin(t * 2 + i) * 13;
        pg.ellipse(0, -reach * 0.48, 34 + layer * 8, reach);
        pg.pop();
      }
    }
    // Glowing center
    for (let i = 12; i >= 1; i--) {
      pg.noStroke();
      pg.fill(80, 190, 235, 12 + i * 3);
      pg.circle(0, 0, i * 13);
    }
  } else if (mode === "Orbit") {
    for (let ring = 0; ring < 5; ring++) {
      pg.push();
      pg.rotate(t * (ring % 2 ? -1 : 1) * (0.25 + ring * 0.08));
      pg.noFill();
      pg.stroke(80 + ring * 25, 175, 230, 150);
      pg.strokeWeight(2);
      pg.ellipse(0, 0, 170 + ring * 65, 100 + ring * 48);
      for (let j = 0; j < 3; j++) {
        const a = TWO_PI * j / 3 + t * 1.5;
        pg.noStroke();
        pg.fill(130, 220, 245, 220);
        pg.circle(cos(a) * (85 + ring * 32), sin(a) * (50 + ring * 24), 9 + ring * 2);
      }
      pg.pop();
    }
  } else {
    pg.noFill();
    for (let x = -260; x <= 260; x += 28) {
      for (let y = -260; y <= 260; y += 28) {
        const pulse = 5 + 5 * sin(t * 2 + x * 0.025 + y * 0.025);
        pg.stroke(80, 190, 230, 125);
        pg.circle(x, y, pulse);
      }
    }
  }

  // Floating points of light
  for (let i = 0; i < 55; i++) {
    const a = i * 2.399 + t * 0.18;
    const r = 70 + (i * 37 % 220);
    const x = cos(a) * r;
    const y = sin(a) * r;
    pg.noStroke();
    pg.fill(155, 225, 245, 100 + 80 * sin(t * 2 + i));
    pg.circle(x, y, 2 + (i % 3));
  }
  pg.pop();
}

function drawSide(pg) {
  const t = frameCount * 0.018;
  pg.background(8, 5, 24);
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  // Vertical flowing ribbons, designed to spill down a second surface
  for (let band = 0; band < 9; band++) {
    const offset = band * 42 - 160;
    pg.noFill();
    pg.stroke(80 + band * 14, 105 + band * 11, 220, 135);
    pg.strokeWeight(2.5 + (band % 3));
    pg.beginShape();
    for (let y = -340; y <= 340; y += 12) {
      const x = offset + sin(y * 0.012 + t + band * 0.7) * (34 + band * 2)
        + cos(y * 0.025 - t * 0.7) * 12;
      pg.vertex(x, y);
    }
    pg.endShape();
  }

  // Drifting illuminated droplets
  for (let i = 0; i < 34; i++) {
    const y = ((i * 31 + frameCount * (0.8 + (i % 4) * 0.25)) % 680) - 340;
    const x = sin(y * 0.015 + t + i) * 95 + cos(t + i * 0.4) * 35;
    pg.noStroke();
    pg.fill(115, 205, 245, 190);
    pg.ellipse(x, y, 4 + (i % 4), 10 + (i % 5) * 2);
  }
  pg.pop();
}

function keyPressed() {
  if (key === "c" || key === "C") mapper.toggleCalibration();
  if (key === "f" || key === "F") fullscreen(!fullscreen());
  if (key === "s" || key === "S") mapper.save("map.json");
  if (key === "l" || key === "L") mapper.load("map.json");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}