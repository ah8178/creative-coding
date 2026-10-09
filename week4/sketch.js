function setup() {
  createCanvas(400, 400, SVG);
  noLoop();
  noFill();
  stroke(0);
  strokeWeight(1.5);

  let boxSize = 30;
  let gap = 10;
  let margin = 30;

  for (let x = margin; x <= width - margin - boxSize; x += boxSize + gap) {
    for (let y = margin; y <= height - margin - boxSize; y += boxSize + gap) {
      if (random(1) < 0.75) {
        rect(x, y, boxSize, boxSize);
      } else {
        ellipse(x + boxSize / 2, y + boxSize / 2, boxSize, boxSize);
      }
    }
  }
}

function keyPressed() {
  if (key == 's') {
    save('week4-svg.svg');
  }
}
