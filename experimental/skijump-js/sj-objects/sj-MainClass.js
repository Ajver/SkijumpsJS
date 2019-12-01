
SJ.MainClass = 
class {
  constructor() {
    this._drawableObjects = [];
    
    SJ.PadCreator.loadImages();

    this._engine = Matter.Engine.create();
    SJ.world = this._engine.world;
    SJ.world.gravity.y = SJ.V.gravity;

    this._createJumper();

    SJ.pad = new SJ.LaunchingPad();
    SJ.scoreCounter = new SJ.ScoreCounter();
    
    SJ.airSystem = new SJ.AirSystem();

    SJ.camera = new SJ.Camera(1);

    SJ.paralaxBackground = new SJ.ParalaxBackground();
  
    this._fillDrawableObjectsArray();

    SJ.pad.onReady();

    Matter.Engine.run(this._engine);

    this._isRunning = true;
  }

  setRunning(flag) {
    this._isRunning = flag;

    if(flag) {
      SJ.jumper.body.isStatic = SJ.jumper.realBodyStatic;
      SJ.ScreensManager.screens.game.pausePopup.hide();
    }else {
      SJ.jumper.realBodyStatic = SJ.jumper.body.isStatic;
      SJ.jumper.body.isStatic = true;
      SJ.ScreensManager.screens.game.pausePopup.show();
    }
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
    if(this._isRunning) {
      this._update();
    }

    background(57, 66, 95);

    push();
      SJ.camera.transform();
      this._drawableObjects.forEach((element) => {
        element.draw();
      });
      // SJ.camera.drawPath();
    pop();
  }

  _update() {
    SJ.jumper.update();
    SJ.pad.update();
    SJ.camera.update();
    SJ.airSystem.update();
  }

  _restartGame() {
    this._createJumper();
    SJ.pad.restart();
    SJ.camera.restart();

    SJ.pad.onReady();
  }

  jumpEnd() {
    SJ.jumpEndPopup.show();
  }

};
