let video;
let handPose;
let hands = [];
let statusText;
let targetX, targetY, targetSize = 90;
let smoothX, smoothY, smoothSize = 90;

function setup() {
  const canvas = createCanvas(800, 520);
  canvas.parent("canvas-holder");
  targetX = width / 2;
  targetY = height / 2;
  smoothX = targetX;
  smoothY = targetY;
  statusText = select("#status");

  video = createCapture(VIDEO, () => {
    video.size(640, 480);
    video.hide();
    statusText.html("Camera ready. Loading HandPose…");
    handPose = ml5.handPose({ flipped: true }, () => {
      statusText.html("HandPose ready — show one hand to the camera.");
      handPose.detectStart(video, gotHands);
    });
  });
}

function gotHands(results) {
  hands = results;
}

function draw() {
  background(235, 231, 219);

  // Subtle grid gives the interaction a spatial reference.
  stroke(211, 207, 194);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);

  if (hands.length > 0) {
    const hand = hands[0];
    const indexTip = hand.keypoints[8];
    const thumbTip = hand.keypoints[4];

    targetX = map(indexTip.x, 0, video.width, width, 0);
    targetY = map(indexTip.y, 0, video.height, 0, height);

    const pinchDistance = dist(indexTip.x, indexTip.y, thumbTip.x, thumbTip.y);
    targetSize = constrain(map(pinchDistance, 15, 180, 35, 220), 35, 220);

    // Draw tracked fingertips and the pinch connection.
    stroke(91, 119, 99);
    strokeWeight(3);
    line(
      map(indexTip.x, 0, video.width, width, 0),
      map(indexTip.y, 0, video.height, 0, height),
      map(thumbTip.x, 0, video.width, width, 0),
      map(thumbTip.y, 0, video.height, 0, height)
    );
    noStroke();
    fill(183, 112, 78);
    circle(map(indexTip.x, 0, video.width, width, 0), map(indexTip.y, 0, video.height, 0, height), 13);
    fill(91, 119, 99);
    circle(map(thumbTip.x, 0, video.width, width, 0), map(thumbTip.y, 0, video.height, 0, height), 13);
  } else {
    fill(60, 70, 62);
    noStroke();
    textAlign(CENTER);
    textSize(17);
    text("Show one hand to begin", width / 2, 45);
  }

  smoothX = lerp(smoothX, targetX, 0.18);
  smoothY = lerp(smoothY, targetY, 0.18);
  smoothSize = lerp(smoothSize, targetSize, 0.18);

  noStroke();
  fill(183, 112, 78, 45);
  circle(smoothX, smoothY, smoothSize * 1.65);
  fill(91, 119, 99);
  circle(smoothX, smoothY, smoothSize);
  fill(241, 238, 231);
  circle(smoothX, smoothY, smoothSize * 0.28);

  fill(49, 62, 53);
  textAlign(LEFT);
  textSize(13);
  text("INDEX FINGER = POSITION     PINCH = SIZE", 22, height - 22);
}

function windowResized() {
  // The fixed canvas keeps the hand-to-screen mapping predictable.
}
