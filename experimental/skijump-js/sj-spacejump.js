
const SJ = {};

// Screen resolution
SJ.SCREEN_WIDTH = 1200;
SJ.SCREEN_HEIGHT = 720;

// Mouse position in scaled canvas
SJ.mouseScreenX = 0;
SJ.mouseScreenY = 0;

SJ._wantRestartGame = false;

function setup() {
  frameRate(60);
}

function draw() {
  SJ.draw();  
}

SJ.draw = () => {
  if(SJ._isGameReady) {
    SJ.main.draw();
  }
  if(SJ._wantRestartGame) {
    SJ._wantRestartGame = false;
    SJ.main._restartGame();
  }
}

SJ.restartGame = () => {
  SJ._wantRestartGame = true;
}

SJ.ScriptsLoader =
class {
  constructor(callback) {
    this._callback = callback;
    this._scriptsToLoad = 0;
    this._loadedScriptsCounter = 0;
  }

  loadScript = (scriptPath) => {
    const scriptTag = document.createElement('script');
    scriptTag.src = scriptPath;

    this._scriptsToLoad++;
    scriptTag.onload = () => {
      this._loadedScriptsCounter++;

      if(this._done) {
        if(this._loadedScriptsCounter == this._scriptsToLoad) {
          this._callback();
        }
      }
    }

    document.head.appendChild(scriptTag);
  }

  done = () => {
    this._done = true;

    if(this._loadedScriptsCounter == this._scriptsToLoad) {
      this._callback();
    }
  }
}

window.onload = () => {  
  const scriptsLoader = new SJ.ScriptsLoader(() => {
    SJ.LocationManager.changeLocation('Moon', () => {
      const canvas = createCanvas(SJ.SCREEN_WIDTH, SJ.SCREEN_HEIGHT);
      canvas.parent('skijump-game-container');

      SJ.main = new SJ.MainClass();
      SJ._isGameReady = true;
    });
  }); 

  scriptsLoader.loadScript('skijump-js/sj-libraries/matter.js');
  
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-PadCollisionPointsList.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-CanvasScaler.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-InputManager.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-ImageLoader.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-PadCreator.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-ScoreCounter.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-MessagesManager.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-PullingSystem.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-AirSystem.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-Variables.js');
  scriptsLoader.loadScript('skijump-js/sj-tools/sj-LocationManager.js');

  scriptsLoader.loadScript('skijump-js/sj-objects/sj-Camera.js');
  scriptsLoader.loadScript('skijump-js/sj-objects/sj-Jumper.js');
  scriptsLoader.loadScript('skijump-js/sj-objects/sj-LaunchingPad.js');
  scriptsLoader.loadScript('skijump-js/sj-objects/sj-UI.js');
  scriptsLoader.loadScript('skijump-js/sj-objects/sj-MainClass.js');

  scriptsLoader.done();
}