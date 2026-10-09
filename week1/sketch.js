let words = ["Creative", "Code", "Process", "Play", "Pattern", "Chance", "Design", "Iteration"];

function setup() {
  createCanvas(400, 400);
  generateComposition();
}

function generateComposition() {
  background(245);
  noFill();
  stroke(20);

  for (let i = 0; i < 15; i++) {
    let x = random(30, 370);
    let y = random(30, 370);
    let size = random(20, 70);

    if (random(1) < 0.5) {
      ellipse(x, y, size, size);
    } else {
      rect(x, y, size, size);
    }
  }

  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(28);
  text("CREATIVE", 200, 190);
  text("CODING", 200, 225);
}

function mousePressed() {
  generateComposition();
}
