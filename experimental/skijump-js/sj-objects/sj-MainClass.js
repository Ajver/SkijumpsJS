
SJ.MainClass = 
class {
  constructor() {
    // Screen resolution
    SJ.SCREEN_WIDTH = 1200;
    SJ.SCREEN_HEIGHT = 720;
    
    // Mouse position in scaled canvas
    SJ.mouseScreenX = 0;
    SJ.mouseScreenY = 0;

    this._drawableObjects = [];
    
    SJ.PadCreator.loadImages();

    const canvas = createCanvas(SJ.SCREEN_WIDTH, SJ.SCREEN_HEIGHT);
    canvas.parent('skijump-game-container');
    
    SJ.canvasScaler = new SJ.CanvasScaler();
    SJ.canvasScaler.setup();

    rectMode(CENTER);

    this._engine = Matter.Engine.create();
    SJ.world = this._engine.world;
    SJ.world.gravity.y = SJ.variables.gravity;

    print(SJ.variables.gravity);

    SJ.airSystem = new SJ.AirSystem();

    this._restartGame();

    Matter.Engine.run(this._engine);

    setupInputManager();
  }

  draw() {
    background(51);
  
    push();
    SJ.canvasScaler.transform();
  
    SJ.jumper.update();
    SJ.pad.update();
  
    SJ.camera.update();
    
    push();
    SJ.camera.transform();
    this._drawableObjects.forEach((element) => {
      element.draw();
    });
    pop();
    
    SJ.airSystem.update();
    
    SJ.ui.draw();
    
    pop();
  }

  _restartGame() {
    this._drawableObjects = [];

    SJ.jumper = new SJ.Jumper(310, 1060);
    SJ.pad = new SJ.LaunchingPad();
    SJ.scoreCounter = new SJ.ScoreCounter();
    
    SJ.camera = new SJ.Camera(1);

    SJ.ui = new SJ.UI();
  
    this._drawableObjects.push(SJ.pad);
    this._drawableObjects.push(SJ.jumper);

    SJ.pad.onReady();
  }

};
