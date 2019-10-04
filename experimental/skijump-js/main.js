
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 720;

const Bodies = Matter.Bodies; 
const World = Matter.World;
const Body = Matter.Body;

let canvasScaler = null;

let engine = null;
let world = null;

let camera = null;
let jumper = null;
let pad = null;
let airSystem = null;
let scoreCounter = null;
let ui = null;

let drawableObjects = [];

let functionsToCall = [];


function preload() {
  PadCreator.loadImages();
}

function setup() {
  const canvas = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  canvas.parent('skijump-game-container');

  canvasScaler = new CanvasScaler();
  canvasScaler.setup();
  
  rectMode(CENTER)

  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = .2;

  airSystem = new AirSystem();
  restartGame();
  
  Matter.Engine.run(engine);
}

function draw() {
  background(51);

  push();
  canvasScaler.transform();

  jumper.update();
  pad.update();

  camera.update();
  
  push();
  camera.transform();
  drawableObjects.forEach((element) => {
    element.draw();
  });
  pop();
  
  airSystem.update();
  
  ui.draw();
  
  pop();

  functionsToCall.forEach((element) => {
    element[0](...element[1]);
  });
  functionsToCall = [];
}

function restartGame() {
  drawableObjects = [];

  jumper = new Jumper(310, 1060);
  // jumper = new Jumper(JUMPER_POSITION.x, JUMPER_POSITION.y);
  pad = new LaunchingPad();
  scoreCounter = new ScoreCounter();
  
  camera = new Camera(1);

  ui = new UI();

  drawableObjects.push(pad);
  drawableObjects.push(jumper);

  pad.onReady();
}

function callDeffered(func, parrams=[]) {
  functionsToCall.push([func, parrams]);
}