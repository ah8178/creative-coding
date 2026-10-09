function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(245);
  translate(200, 200);

  noFill();
  stroke(20);
  strokeWeight(3);
  ellipse(0, 0, 300, 300);

  let seconds = second();
  let minutes = minute();
  let hours = hour();

  let secondAngle = map(seconds, 0, 60, 0, TWO_PI) - HALF_PI;
  let minuteAngle = map(minutes + seconds / 60, 0, 60, 0, TWO_PI) - HALF_PI;
  let hourAngle = map((hours % 12) + minutes / 60, 0, 12, 0, TWO_PI) - HALF_PI;

  strokeWeight(7);
  line(0, 0, cos(hourAngle) * 70, sin(hourAngle) * 70);

  strokeWeight(4);
  line(0, 0, cos(minuteAngle) * 105, sin(minuteAngle) * 105);

  strokeWeight(2);
  line(0, 0, cos(secondAngle) * 125, sin(secondAngle) * 125);

  fill(20);
  noStroke();
  ellipse(0, 0, 10, 10);
}
