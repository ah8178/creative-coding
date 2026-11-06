// Week 9: Audioreactive visualization — microphone input
let mic, amp, fft, started=false, startButton, petals=[];
function setup(){
  createCanvas(windowWidth,windowHeight);
  colorMode(HSB,360,100,100,1);
  mic=new p5.AudioIn(); amp=new p5.Amplitude(); fft=new p5.FFT(0.8,1024);
  startButton=createButton("START MICROPHONE"); startButton.position(14,82);
  startButton.mousePressed(async()=>{await userStartAudio();mic.start(()=>{amp.setInput(mic);fft.setInput(mic);started=true;startButton.hide();});});
  for(let i=0;i<90;i++)petals.push({angle:random(TWO_PI),radius:random(70,240),phase:random(TWO_PI)});
}
function draw(){
  background(230,55,8,0.24);
  let level=started?amp.getLevel():0.015;
  let spectrum=started?fft.analyze():[];
  let bass=started?fft.getEnergy("bass"):0;
  let mid=started?fft.getEnergy("mid"):0;
  let treble=started?fft.getEnergy("treble"):0;
  let loud=constrain(map(level,0,0.25,0,1),0,1);
  let cx=width/2,cy=height/2;
  push();translate(cx,cy);rotate(frameCount*0.002+map(treble,0,255,0,0.8));
  noFill();strokeWeight(2);
  for(let ring=0;ring<7;ring++){
    stroke((190+mid*.45+ring*7)%360,75,85,0.65);
    let r=55+ring*34+bass*.22+loud*45;
    ellipse(0,0,r*2,r*2*(0.72+treble/900));
  }
  for(let p of petals){
    let wobble=sin(frameCount*.025+p.phase)*12+bass*.08;
    let r=p.radius*(0.55+loud*0.9);
    let x=cos(p.angle+frameCount*.001)*r, y=sin(p.angle+frameCount*.001)*r;
    noStroke();fill((180+mid*.5+p.phase*15)%360,70,95,0.65);
    ellipse(x,y,10+loud*30+wobble,22+loud*48+wobble);
  }
  noStroke();fill(45,80,100);circle(0,0,30+loud*95);
  pop();
  fill(0,0,100);textSize(13);
  text(started?"MIC ACTIVE":"Click START MICROPHONE to begin",16,height-44);
  text("Amplitude: "+level.toFixed(3)+"   Bass: "+round(bass)+"   Mid: "+round(mid)+"   Treble: "+round(treble),16,height-22);
}
function windowResized(){resizeCanvas(windowWidth,windowHeight);}