// Week 13 — Working with Models
// Train your own IMAGE model in Teachable Machine and paste its uploaded URL below.
// Keep the trailing slash in the URL.

const MODEL_URL = "PASTE_YOUR_TEACHABLE_MACHINE_MODEL_URL_HERE/";
let video;
let classifier;
let label = "Waiting for your model";
let confidence = 0;
let modelReady = false;
let statusMessage = "Add your model URL in sketch.js";
let particles = [];

async function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch");
  colorMode(HSB, 360, 100, 100, 1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  if (MODEL_URL.includes("PASTE_YOUR")) {
    statusMessage = "Paste your Teachable Machine model URL in sketch.js";
    return;
  }

  try {
    statusMessage = "Loading your classifier…";
    classifier = await ml5.imageClassifier(MODEL_URL + "model.json");
    modelReady = true;
    statusMessage = "Model ready · classifying";
    classifyVideo();
  } catch (error) {
    console.error(error);
    statusMessage = "Model could not load. Check the URL and try again.";
  }
}

function classifyVideo() {
  if (classifier && modelReady) classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    statusMessage = "Classification error. Check the browser console.";
    return;
  }

  if (results && results.length > 0) {
    label = results[0].label;
    confidence = results[0].confidence;
    particles.push(new ModelParticle(random(width), random(height), labelHue(label)));
  }
  classifyVideo();
}

function draw() {
  const hue = labelHue(label);
  background((hue + 205) % 360, 42, 12);

  // Camera preview provides context for what the model is seeing.
  push();
  tint(255, 45);
  image(video, width - 230, 18, 210, 158);
  pop();

  // The predicted class changes the field's hue, movement, and particle density.
  const pulse = map(confidence, 0, 1, 12, 90);
  noFill();
  stroke(hue, 65, 95, 0.8);
  strokeWeight(2);
  for (let i = 0; i < 7; i++) {
    const diameter = 90 + i * 52 + sin(frameCount * 0.025 + i) * pulse;
    ellipse(width / 2, height / 2, diameter, diameter * 0.72);
  }

  if (frameCount % 12 === 0 && modelReady) {
    particles.push(new ModelParticle(random(width), random(height), hue));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(confidence);
    particles[i].display();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  drawLabels(hue);
}

class ModelParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.life = 100;
    this.size = random(8, 28);
    this.speed = random(0.3, 1.8);
    this.phase = random(TWO_PI);
  }

  update(confidenceValue) {
    this.phase += 0.03 + confidenceValue * 0.08;
    this.y -= this.speed + confidenceValue * 2;
    this.x += sin(this.phase) * 1.3;
    this.life -= 0.65;
  }

  display() {
    noStroke();
    fill(this.hue, 65, 95, this.life / 120);
    circle(this.x, this.y, this.size * (0.5 + confidence));
  }
}

function labelHue(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) % 360;
  return hash;
}

function drawLabels(hue) {
  noStroke();
  fill(0, 0, 0, 0.62);
  rect(18, 18, 480, 112, 12);
  fill(0, 0, 100);
  textSize(12);
  text("TEACHABLE MACHINE · LIVE CLASSIFICATION", 34, 43);
  textSize(25);
  text(label, 34, 77);
  textSize(13);
  text("Confidence: " + (confidence * 100).toFixed(1) + "%", 34, 103);
  fill(hue, 55, 95);
  text(statusMessage, 34, height - 28);
}

function windowResized() {
  resizeCanvas(min(windowWidth - 24, 800), 600);
}