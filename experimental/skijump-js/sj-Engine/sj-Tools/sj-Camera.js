
SJ.Camera =
class {
  constructor(scaleMod) {
    // this._offset = createVector(
    //   -0 * scaleMod,
    //   -0 * scaleMod
    // );
    this._offset = createVector(-200, 0);
    this._offset.x += SJ.SCREEN_WIDTH*0.5;
    this._offset.y += SJ.SCREEN_HEIGHT*0.5;
    this._scale = scaleMod;

    this._targetPosition = createVector(0, 0);

    this._topPath = new SJ.CameraPath(SJ.V.cameraTopPath);
    this._bottomPath = new SJ.CameraPath(SJ.V.cameraBottomPath);

    this.arrowsOffset = {
      x:0,
      y:0
    }

    //Steering freewalk camera loading from cookies
    this.areArrowsEnabled = this._cookieValue('areArrowsEnabled');

    if(!this._cookieValue('arrowsOffsetX'))
      document.cookie = "arrowsOffsetX = 0";

    if(!this._cookieValue('arrowsOffsetY'))
      document.cookie = "arrowsOffsetY = 0";

    if(this.areArrowsEnabled == 'true'){
      this.arrowsOffset.x = parseInt(this._cookieValue('arrowsOffsetX'));
      this.arrowsOffset.y = parseInt(this._cookieValue('arrowsOffsetY'));

      this.areArrowsEnabled = true;
    }
    else this.areArrowsEnabled = false;
    //----------------------------------
    
    this.restart();
  }

  restart() {
    this._currentPosition = createVector(0, 0);

    if(SJ.V.minCameraPosition != undefined) {
      this._minPosition = SJ.V.minCameraPosition;
    }else {
      this._minPosition = null;
    }

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

    const LERP_SPEED_Y = 0.08;
    let LERP_SPEED_X = 0.15;
    
    //Saving variables in cookies
    if(this.areArrowsEnabled){
      LERP_SPEED_X = 0.08;
      document.cookie = "arrowsOffsetX = " + this.arrowsOffset.x;
      document.cookie = "arrowsOffsetY = " + this.arrowsOffset.y;
      document.cookie = "areArrowsEnabled = true";
    }
    else document.cookie = "areArrowsEnabled = false";
    
    this._targetPosition.x = jumperPos.x;
    this._targetPosition.y = targetY;

    this._currentPosition.x = lerp(this._currentPosition.x, this._targetPosition.x, LERP_SPEED_X);
    this._currentPosition.y = lerp(this._currentPosition.y, this._targetPosition.y, LERP_SPEED_Y);
    
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

    if(keyCode == 220){
      this.arrowsOffset.x = parseInt(this._cookieValue('arrowsOffsetX'));
      this.arrowsOffset.y = parseInt(this._cookieValue('arrowsOffsetY'));

      this.areArrowsEnabled = !this.areArrowsEnabled;
    }

    //Setting cookies to 0
    if(keyCode == 114 || keyCode == 82 && this.areArrowsEnabled){
      document.cookie = "arrowsOffsetX = 0";
      document.cookie = "arrowsOffsetY = 0";

      this.arrowsOffset.x = parseInt(this._cookieValue('arrowsOffsetX'));
      this.arrowsOffset.y = parseInt(this._cookieValue('arrowsOffsetY'));
    }
      

    if(!this.areArrowsEnabled){
      this.arrowsOffset.x = 0; 
      this.arrowsOffset.y = 0;
    }

  }
  
  //Function returns cookie value by name
  _cookieValue(cookieName){

    let cookies = document.cookie.split(';');
    
    for(let i = 0; i < cookies.length; i++) {
      if(cookieName == cookies[i].split('=')[0].split(" ").join(""))
        return cookies[i].split('=')[1];
    }

    console.log('cookie ' + cookieName + ' not found.');
    return false;
  }

}