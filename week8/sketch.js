// Week 8: Interactivity Exploration
// Array methods: push(), reverse(), filter(), splice()
let seeds = [];
class Seed {
  constructor(x,y) { this.x=x; this.y=y; this.size=random(12,34); this.hue=random(120,190); this.phase=random(TWO_PI); }
  grow() { this.size=min(70,this.size+0.15); this.phase+=0.025; }
  show() {
    let pulse=sin(this.phase)*4;
    noStroke(); fill(this.hue,65,85,0.78);
    ellipse(this.x,this.y,this.size+pulse,this.size*1.5+pulse);
    fill(35,25,15,0.8); circle(this.x,this.y,4);
  }
}
function setup(){createCanvas(windowWidth,windowHeight);colorMode(HSB,360,100,100,1);for(let i=0;i<12;i++)seeds.push(new Seed(random(width),random(height)));}
function draw(){
  background(225,35,12);
  for(let s of seeds){s.grow();s.show();}
  fill(0,0,100);text("Seeds: "+seeds.length,16,height-18);
}
function mousePressed(){seeds.push(new Seed(mouseX,mouseY));}
function keyPressed(){
  if(key==='r'||key==='R') seeds.reverse();
  if(key==='f'||key==='F') seeds=seeds.filter(s=>s.size>=24);
  if(key==='c'||key==='C') seeds.splice(0,seeds.length);
  if(key==='a'||key==='A') for(let i=0;i<8;i++) seeds.push(new Seed(random(width),random(height)));
}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}