
SJ.Camera =
class {
  constructor(scaleMod) {
    this._offset = createVector(
      -200,
      0
    )
    this._offset.x += SJ.SCREEN_WIDTH*0.5;
    this._offset.y += SJ.SCREEN_HEIGHT*0.5;
    this._scale = scaleMod;

    this._targetPosition = createVector(0, 0);

    this.startFollowingJumper();
  }

  update() {
    if(!this._isFollowingJumper) {
      return;
    }

    this._targetPosition.x = SJ.jumper.body.position.x;
    this._targetPosition.y = SJ.jumper.body.position.y;
  }

  transform() {
    const targetPos = this._targetPosition;
    scale(this._scale);
    translate(-targetPos.x+this._offset.x/this._scale, -targetPos.y+this._offset.y/this._scale);
  }

  stopFollowingJumper() {
    this._isFollowingJumper = false;
  }
  
  startFollowingJumper() {
    this._isFollowingJumper = true;
  }

}