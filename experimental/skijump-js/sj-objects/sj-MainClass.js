
SJ.MainClass = 
class {
  constructor() {
    this._drawableObjects = [];
    
    SJ.PadCreator.loadImages();
    
    rectMode(CENTER);

    this._engine = Matter.Engine.create();
    SJ.world = this._engine.world;
    SJ.world.gravity.y = SJ.V.gravity;

    this._createJumper();

    SJ.pad = new SJ.LaunchingPad();
    SJ.scoreCounter = new SJ.ScoreCounter();
    
    SJ.airSystem = new SJ.AirSystem();

    SJ.camera = new SJ.Camera(1);

    SJ.ui = new SJ.UI();

    SJ.paralaxBackground = new SJ.ParalaxBackground();
  
    this._fillDrawableObjectsArray();

    SJ.pad.onReady();

    Matter.Engine.run(this._engine);
  }

  _createJumper() {
    SJ.jumper = new SJ.Jumper(JUMPER_POSITION.x, JUMPER_POSITION.y);
    this._fillDrawableObjectsArray();
  }

  _fillDrawableObjectsArray() {
    this._drawableObjects = [];
    this._drawableObjects.push(SJ.paralaxBackground);
    this._drawableObjects.push(SJ.pad);
    this._drawableObjects.push(SJ.jumper);
  }

  draw() {
    background(57, 66, 95);

    push();
      SJ.jumper.update();
      SJ.pad.update();
    
      push();
        SJ.camera.update();
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
    this._createJumper();
    SJ.pad.restart();
    SJ.camera.startFollowingJumper();

    SJ.pad.onReady();
  }

};
