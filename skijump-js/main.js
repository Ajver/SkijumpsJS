
let Bodies = Matter.Bodies; 
let World = Matter.World;

let engine = null;
let world = null;

let camera = null;
let jumper = null;
let pad = null;

let drawableObjects = [];

function setup() {
  const canvas = createCanvas(1280, 720);
  canvas.parent('skijump-game-container');
  rectMode(CENTER)

  engine = Matter.Engine.create();
  world = engine.world;

  jumper = new Jumper(40, 50);
  pad = new LaunchingPad();
  
  camera = new Camera(jumper, 0.5);

  drawableObjects.push(pad);
  drawableObjects.push(jumper);
  
  Matter.Engine.run(engine);
}

function draw() {
  background(51);

  push();
  camera.transform();
  drawableObjects.forEach((element) => {
    element.draw();
  });
  pop();

}