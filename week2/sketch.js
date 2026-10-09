let shapes = [];

function setup() {
  createCanvas(400, 400);
  background(245);
}

function draw() {
  // The shapes are drawn again every frame.
  for (let s of shapes) {
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    noFill();
    stroke(20);

    if (s.type == 0) {
      ellipse(0, 0, s.size, s.size);
    } else if (s.type == 1) {
      rectMode(CENTER);
      rect(0, 0, s.size, s.size);
    } else {
      triangle(0, -s.size / 2, -s.size / 2, s.size / 2, s.size / 2, s.size / 2);
    }
    pop();
  }
}

function mousePressed() {
  shapes.push({
    x: mouseX,
    y: mouseY,
    size: random(20, 70),
    rotation: random(TWO_PI),
    type: floor(random(3))
  });
}
