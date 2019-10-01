
const Bodies = Matter.Bodies; 
const World = Matter.World;
const Body = Matter.Body;

let engine = null;
let world = null;

let camera = null;
let jumper = null;
let pad = null;
let scoreCounter = null;

let drawableObjects = [];

function preload() {
  PadCreator.loadImages();
}

function setup() {
  const canvas = createCanvas(1280, 720);
  canvas.parent('skijump-game-container');
  rectMode(CENTER)

  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = .2;

  jumper = new Jumper(290, 1040);
  // jumper = new Jumper(JUMPER_POSITION.x, JUMPER_POSITION.y);
  pad = new LaunchingPad();
  scoreCounter = new ScoreCounter();
  
  camera = new Camera(1);

  drawableObjects.push(pad);
  drawableObjects.push(jumper);
  
  Matter.Engine.run(engine);
}

function draw() {
  background(51);

  jumper.update();
  pad.update();

  push();
  camera.transform();
  drawableObjects.forEach((element) => {
    element.draw();
  });
  pop();

  scoreCounter.draw();
}

function keyPressed(e) {
  jumper.onKeyPressed(e.code);
  pad.onKeyPressed(e.code);
}

function keyReleased(e) {
  jumper.onKeyReleased(e.code);
}