
SJ.MainClass = 
class {
  constructor() {
    this._drawableObjects = [];
    
    SJ.PadCreator.loadImages();

    this._engine = Matter.Engine.create();
    SJ.world = this._engine.world;
    SJ.world.gravity.y = SJ.V.gravity;

    this._createJumper();
    this._createScoreCounter();
    this._createAirSystem();

    SJ.pad = new SJ.LaunchingPad();

    SJ.camera = new SJ.Camera(1);

    SJ.paralaxBackground = new SJ.ParalaxBackground();
  
    this._fillDrawableObjectsArray();

    SJ.pad.onReady();

    Matter.Engine.run(this._engine);

    this._isRunning = true;
    this._wantShowJumpEndPopup = false;
  }

  setRunning(flag) {
    this._isRunning = flag;

    if(flag) {
      SJ.jumper.body.isStatic = SJ.jumper.realBodyStatic;
      SJ.ScreensManager.screens.game.pausePopup.hide();

      if(this._wantShowJumpEndPopup) {
        print("Huh!?");
        this._wantShowJumpEndPopup = false;
        this._showJumpEndPopup();
      }
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

  _createScoreCounter() {
    SJ.scoreCounter = new SJ.ScoreCounter();
  }

  _createAirSystem() {
    SJ.airSystem = new SJ.AirSystem();
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
    SJ.scoreCounter.update();
  }

  _restartGame() {
    print("=== NEW JUMP ===");
    this._wantShowJumpEndPopup = false;
    this.setRunning(true);

    this._createJumper();
    this._createScoreCounter();
    this._createAirSystem();
    SJ.pad.restart();
    SJ.camera.restart();

    SJ.pad.onReady();
  }

  onJumperPadHit() {
    SJ.scoreCounter.calculateScore();
    SJ.pad.startPullingJumper();
   
    window.setTimeout(() => {
      if(!this._isRunning) {
        this._wantShowJumpEndPopup = true;
      }else {
        this._showJumpEndPopup();
      }
    }, 1000);
  }

  _showJumpEndPopup() {
    SJ.jumpEndPopup.show();
    SJ.ratersDisplay.show();
  }

};
