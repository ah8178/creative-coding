// Week 10 — Gestural Control
// Gesture Garden: hand position and a pinch gesture shape a growing field.

let video;
let handPose;
let hands = [];
let blooms = [];
let modelReady = false;
let statusMessage = "Loading hand tracking…";

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch");
  colorMode(HSB, 360, 100, 100, 1);

  // Keep the camera fixed in front of the user so hand movement is easy to read.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  startHandTracking();
}

async function startHandTracking() {
  try {
    handPose = await ml5.handPose();
    handPose.detectStart(video, gotHands);
    modelReady = true;
    statusMessage = "Show one hand to begin";
  } catch (error) {
    console.error(error);
    statusMessage = "Could not load HandPose. Check your connection and refresh.";
  }
}

function gotHands(results) {
  hands = results;
}

function getLandmark(hand, index) {
  // HandPose returns 21 landmarks. Index 4 is the thumb tip; index 8 is the index tip.
  if (hand.keypoints && hand.keypoints[index]) return hand.keypoints[index];
  if (hand.landmarks && hand.landmarks[index]) {
    return { x: hand.landmarks[index][0], y: hand.landmarks[index][1] };
  }
  return null;
}

function draw() {
  background(224, 38, 10);

  push();
  tint(255, 38);
  image(video, 0, 0, width, height);
  pop();

  const hand = hands.length > 0 ? hands[0] : null;
  if (hand) {
    const indexTip = getLandmark(hand, 8);
    const thumbTip = getLandmark(hand, 4);

    if (indexTip && thumbTip) {
      const handX = map(indexTip.x, 0, 640, 0, width);
      const handY = map(indexTip.y, 0, 480, 0, height);
      const pinchDistance = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);

      // X controls rotation, Y controls hue, and pinch distance controls bloom size.
      const rotation = map(handX, 0, width, -0.8, 0.8);
      const hue = map(handY, 0, height, 35, 300);
      const bloomSize = map(constrain(pinchDistance, 12, 150), 12, 150, 72, 18);

      drawGestureField(handX, handY, rotation, hue, bloomSize);

      if (pinchDistance < 48 && frameCount % 5 === 0) {
        blooms.push(new Bloom(handX, handY, hue, bloomSize));
      }

      noFill();
      stroke(45, 20, 100, 0.9);
      strokeWeight(2);
      circle(handX, handY, 28);
      line(handX - 18, handY, handX + 18, handY);
      line(handX, handY - 18, handX, handY + 18);

      statusMessage = pinchDistance < 48 ? "Pinch detected · growing" : "Move and explore · pinch to grow";
    } else {
      statusMessage = "Hand found · waiting for landmarks";
    }
  } else if (modelReady) {
    statusMessage = "Show one hand to begin";
  }

  for (let i = blooms.length - 1; i >= 0; i--) {
    blooms[i].update();
    blooms[i].display();
    if (blooms[i].life <= 0) blooms.splice(i, 1);
  }

  drawInterface();
}

function drawGestureField(x, y, rotation, hue, size) {
  push();
  translate(x, y);
  rotate(rotation);
  noFill();
  for (let ring = 0; ring < 5; ring++) {
    stroke((hue + ring * 13) % 360, 55, 95, 0.45);
    strokeWeight(1.5);
    ellipse(0, 0, size + ring * 25, size * 0.7 + ring * 20);
  }
  for (let petal = 0; petal < 8; petal++) {
    push();
    rotate((TWO_PI / 8) * petal + frameCount * 0.006);
    noStroke();
    fill((hue + petal * 9) % 360, 58, 95, 0.55);
    ellipse(size * 0.55, 0, size * 0.7, size * 0.24);
    pop();
  }
  pop();
}

class Bloom {
  constructor(x, y, hue, size) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.size = size;
    this.life = 100;
    this.phase = random(TWO_PI);
  }

  update() {
    this.life -= 0.7;
    this.phase += 0.035;
    this.size += 0.08;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.phase);
    noStroke();
    for (let i = 0; i < 6; i++) {
      rotate(TWO_PI / 6);
      fill((this.hue + i * 8) % 360, 65, 100, this.life / 160);
      ellipse(this.size * 0.32, 0, this.size * 0.62, this.size * 0.22);
    }
    fill(42, 45, 100, this.life / 130);
    circle(0, 0, this.size * 0.18);
    pop();
  }
}

function drawInterface() {
  noStroke();
  fill(225, 35, 8, 0.72);
  rect(14, height - 58, 420, 42, 8);
  fill(42, 12, 98);
  textSize(14);
  text(statusMessage, 26, height - 32);
  textSize(11);
  fill(42, 8, 85, 0.85);
  text("GESTURE GARDEN  /  " + blooms.length + " blooms", width - 205, 26);
}

function windowResized() {
  resizeCanvas(min(windowWidth - 24, 800), 600);
}
