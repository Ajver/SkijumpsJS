
let MBodies = Matter.Bodies; 

let engine = null;
let world = null;

function setup() {
  createCanvas(1280, 720);
  rectMode(CENTER)

  engine = Matter.Engine.create();
  world = engine.world;

  Matter.Engine.run(engine);
}

function draw() {
  background(51);
}