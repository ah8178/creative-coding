// Week 7: Projection Mapping starter
// Based on the p5.mapper 3.x API. Connect a projector before calibrating.
let mapper, front, side, modeSelect, mode = "Bloom";

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  mapper = createProjectionMapper(this);
  // Logical surface dimensions; adjust these to match your physical objects.
  front = mapper.createQuadMap(600, 600);
  side = mapper.createQuadMap(400, 600);
  modeSelect = createSelect();
  modeSelect.position(12, 112);
  ["Bloom", "Orbit", "Grid"].forEach(v => modeSelect.option(v));
  modeSelect.changed(() => mode = modeSelect.value());
}

function draw() {
  background(8, 10, 22);
  front.displaySketch(drawFront);
  side.displaySketch(drawSide);
}

function drawFront(pg) {
  pg.clear();
  pg.push();
  pg.background(10, 15, 35);
  pg.translate(pg.width/2, pg.height/2);
  let t = frameCount * 0.015;
  if (mode === "Bloom") {
    pg.noFill();
    for (let i=0; i<18; i++) {
      pg.stroke(120 + i*6, 190, 220, 180);
      pg.strokeWeight(2);
      pg.ellipse(0, 0, 80+i*23+sin(t+i*.3)*18, 80+i*23+sin(t+i*.3)*18);
    }
  } else if (mode === "Orbit") {
    for (let i=0; i<9; i++) {
      let a=t+i*TWO_PI/9, r=110+sin(t*2+i)*45;
      pg.noStroke(); pg.fill(100+i*15, 190, 230);
      pg.circle(cos(a)*r, sin(a)*r, 30+12*sin(t+i));
    }
  } else {
    pg.stroke(90, 180, 220, 160); pg.noFill();
    for(let x=-250;x<=250;x+=35) for(let y=-250;y<=250;y+=35)
      pg.circle(x,y,8+5*sin(t+x*.02+y*.02));
  }
  pg.pop();
}

function drawSide(pg) {
  pg.clear();
  pg.background(20, 8, 30);
  pg.push();
  pg.translate(pg.width/2, pg.height/2);
  for(let i=0;i<14;i++) {
    let y = (i*48 + frameCount*1.5) % (pg.height+60) - pg.height/2;
    pg.noStroke(); pg.fill(190, 100+i*8, 210, 190);
    pg.ellipse(pg.width/2-30, y, 18+8*sin(frameCount*.04+i), 34);
  }
  pg.pop();
}

function keyPressed() {
  if (key === "c" || key === "C") mapper.toggleCalibration();
  if (key === "f" || key === "F") fullscreen(!fullscreen());
  if (key === "s" || key === "S") mapper.save("map.json");
  if (key === "l" || key === "L") mapper.load("map.json");
}
function windowResized(){ resizeCanvas(windowWidth, windowHeight); }