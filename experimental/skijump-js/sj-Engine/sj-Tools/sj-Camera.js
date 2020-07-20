
SJ.Camera =
class {
  constructor(scaleMod) {
    this._offset = createVector(
      -20 * scaleMod,
      -200 * scaleMod
    );
    this._offset = createVector(-200, 0);
    this._offset.x += SJ.SCREEN_WIDTH*0.5;
    this._offset.y += SJ.SCREEN_HEIGHT*0.5;
    this._scale = scaleMod;

    this._currentPosition = createVector(0, 0);
    this._targetPosition = createVector(0, 0);

    this._topPath = new SJ.CameraPath(SJ.V.cameraTopPath);
    this._bottomPath = new SJ.CameraPath(SJ.V.cameraBottomPath);

    this.arrowsOffset = {
      x:0,
      y:0
    }

    this.areArrowsEnabled = false;

    this.restart();
  }

  restart() {
    const jumperPos = SJ.jumper.body.position;
    if(SJ.V.minCameraPosition != undefined) {
      this._minPosition = SJ.V.minCameraPosition;
    }else {
      this._minPosition = null;
    }
    this._currentPosition = createVector(jumperPos.x, jumperPos.y);
    this._targetPosition = createVector(jumperPos.x, jumperPos.y);
    this._setPathIndex();
  }

  _setPathIndex() {
    this._topPath.setPathIndex(this._currentPosition.x);
    this._bottomPath.setPathIndex(this._currentPosition.x);
  }

  update() {
    const jumperPos = SJ.jumper.body.position;
    const minY = this._topPath.getExpectedY();
    const maxY = this._bottomPath.getExpectedY();
    const targetY = constrain(jumperPos.y, minY, maxY);
    
    this._targetPosition.x = jumperPos.x;
    this._targetPosition.y = targetY; 

    const LERP_SPEED = 0.08;
    this._currentPosition.x = lerp(this._currentPosition.x, this._targetPosition.x, LERP_SPEED);
    this._currentPosition.y = lerp(this._currentPosition.y, this._targetPosition.y, LERP_SPEED);
    
    if(this._minPosition != null) {
      this._currentPosition.x = max(this._currentPosition.x, this._minPosition.x + SJ.SCREEN_MIDDLE_X);
      this._currentPosition.y = max(this._currentPosition.y, this._minPosition.y + SJ.SCREEN_MIDDLE_Y);
    }

    this._currentPosition.x += this.arrowsOffset.x;
    this._currentPosition.y += this.arrowsOffset.y;

  }

  transform() {
    const pos = this.getPosition();
    scale(this._scale);
    translate(pos.x, pos.y);
  }

  getPosition() {
    const curPos = this._currentPosition;
    return {
      x: -curPos.x+this._offset.x/this._scale, 
      y: -curPos.y+this._offset.y/this._scale
    };
  }

  drawPath() {
    this._topPath.draw(color(200, 100, 0));
    this._bottomPath.draw(color(100, 200, 0));
  }

  screenToWorld(p) {
    const screenPoint = p.copy();
    screenPoint.sub(this._offset);
    screenPoint.div(this._scale);
    screenPoint.add(this._currentPosition);
    return screenPoint;
  }

  moveWithArrows(keyCode){

    if(this.areArrowsEnabled){
      switch(keyCode){
        case 37:
          this.arrowsOffset.x -= 15;
        break;
        case 39:
          this.arrowsOffset.x += 15;
        break;
        case 38:
          this.arrowsOffset.y -= 15;
        break;
        case 40:
          this.arrowsOffset.y += 15;
        break;
      }
    }

    if(keyCode == 220)
      this.areArrowsEnabled = !this.areArrowsEnabled;

    if(!this.areArrowsEnabled){
      this.arrowsOffset.x = 0; 
      this.arrowsOffset.y = 0;
    }

    console.log(this.areArrowsEnabled);

  }

}