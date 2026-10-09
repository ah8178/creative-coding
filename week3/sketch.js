let size = 40;

function setup() {
  createCanvas(400, 400);
  makePattern();
}

function makePattern() {
  background(245);
  noFill();
  stroke(20);

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      let choice = floor(random(3));

      if (choice == 0) {
        ellipse(x + size / 2, y + size / 2, 25, 25);
      } else if (choice == 1) {
        rect(x + 8, y + 8, 24, 24);
      } else {
        line(x + 8, y + 8, x + 32, y + 32);
        line(x + 32, y + 8, x + 8, y + 32);
      }
    }
  }
}

function mousePressed() {
  makePattern();
}
