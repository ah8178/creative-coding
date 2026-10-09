function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(245);
  translate(200, 200);

  let seconds = second();
  let minutes = minute();
  let hours = hour();

  let secondAngle = map(seconds, 0, 60, 0, TWO_PI) - HALF_PI;
  let minuteAngle = map(minutes + seconds / 60, 0, 60, 0, TWO_PI) - HALF_PI;
  let hourAngle = map((hours % 12) + minutes / 60, 0, 12, 0, TWO_PI) - HALF_PI;

  noFill();
  stroke(20);
  strokeWeight(2);
  ellipse(0, 0, 300, 300);

  // Seconds control the small circles around the clock.
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI * i / 12 + secondAngle;
    let distance = 120 + sin(secondAngle + i) * 15;
    let x = cos(angle) * distance;
    let y = sin(angle) * distance;
    ellipse(x, y, 10, 10);
  }

  // Minute ring.
  let minuteSize = map(minutes, 0, 59, 50, 150);
  ellipse(0, 0, minuteSize, minuteSize);

  // Hour line.
  strokeWeight(6);
  line(0, 0, cos(hourAngle) * 80, sin(hourAngle) * 80);

  // Minute line.
  strokeWeight(3);
  line(0, 0, cos(minuteAngle) * 120, sin(minuteAngle) * 120);

  fill(20);
  noStroke();
  ellipse(0, 0, 12, 12);
}
