
SJ.MainClass = 
class extends SJ.EventHandler {
  init() {
    this.createEvent('restart');
    
    this._drawableObjects = [];

    this._engine = Matter.Engine.create();
    SJ.world = this._engine.world;
    SJ.world.gravity.y = SJ.V.gravity;

    this._createJumper();
    this._createScoreCounter();
    this._createAirSystem();

    this._prepareScreenLayer();
    
    SJ.itemsManager.resetActiveItems();
    this.addEventListener('restart', () => {
      SJ.itemsManager.resetActiveItems();
    });

    SJ.pad = new SJ.LaunchingPad();
    this.addEventListener('restart', () => {
      SJ.pad.restart();
    });

    SJ.camera = new SJ.Camera(1);
    this.addEventListener('restart', () => {
      SJ.camera.restart();
    });

    SJ.paralaxBackground = new SJ.ParalaxBackground();
  
    this._fillDrawableObjectsArray();
    
    SJ.PadCreator.loadImages();
    SJ.pad.loadImages();

    SJ.pad.onReady();

    Matter.Engine.run(this._engine);

    this._isRunning = true;
    this._wantShowJumpEndPopup = false;

    if(flyMode) {
      const texture = SJ.ImageLoader.load("TitanBase/Pad/white_light.png");
      SJ.fly = new Light(0, 0, texture)
    }
  }

  _prepareScreenLayer() {
    this.screenLayer = [];
    SJ.V.screenLayer.forEach(data => {
      if(data.type === "particlesystem") {
        if(data.system === "wind") {
          this.screenLayer.push(new SJ.WindParticleSystem());
        }
      }
    })
  }

  setRunning(flag) {
    this._isRunning = flag;

    if(flag) {
      SJ.jumper.body.isStatic = SJ.jumper.realBodyStatic;
      SJ.ScreensManager.screens.game.pausePopup.hide();

      if(this._wantShowJumpEndPopup) {
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
    SJ.jumper = new SJ.Jumper(SJ.V.jumperPosition.x, SJ.V.jumperPosition.y);
    this.addEventListener('restart', () => {
      SJ.jumper.reset();
    })
  }

  _createScoreCounter() {
    SJ.scoreCounter = new SJ.ScoreCounter();
  }

  _createAirSystem() {
    SJ.airSystem = new SJ.AirSystem();
  }

  _fillDrawableObjectsArray() {
    this._drawableObjects = [];
    this.appendDrawable(SJ.paralaxBackground);
    this.appendDrawable(SJ.pad);
    this.appendDrawable(SJ.jumper);
  }

  appendDrawable(drawable) {
    this._drawableObjects.push(drawable);
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
      SJ.pad.drawFront();
      // SJ.camera.drawPath();
    pop();

    this._drawScrenLayer();
  }

  _update() {
    SJ.jumper.update();
    SJ.pad.update();
    SJ.camera.update();
    SJ.airSystem.update();
    SJ.scoreCounter.update();
  }

  _drawScrenLayer() {
    this.screenLayer.forEach(element => {
      element.draw();
    })
  }

  _restartGame() {
    print("=== NEW JUMP ===");
    this._wantShowJumpEndPopup = false;
    
    SJ.higherJumperSpeed = 0.0;
    SJ.higherJumperHeight = 0.0;

    this.setRunning(true);

    this._createScoreCounter();
    this._createAirSystem();

    SJ.pad.onReady();

    this.callEvent('restart')
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
    }, 2000);
  }

  _showJumpEndPopup() {
    SJ.jumpEndPopup.show();
  }

};
