
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

    this._currentPosition = createVector(0, 0);
    this._targetPosition = createVector(0, 0);

    this._path = SJ.V.cameraPath;

    this.restart();
  }

  restart() {
    this._pathIndex = 0;
    const jumperPos = SJ.jumper.body.position
    this._currentPosition = createVector(jumperPos.x, jumperPos.y);
    this._targetPosition = createVector(jumperPos.x, jumperPos.y);
  }

  update() {
    const jumperX = SJ.jumper.body.position.x;

    if(jumperX >= this._path[this._pathIndex+1].x && this._pathIndex < this._path.length-1) {
      this._pathIndex++;
    }

    const p1 = this._path[this._pathIndex];
    const p2 = this._path[this._pathIndex+1];
    const diffX = jumperX - p1.x;
    const distX = p2.x - p1.x; 
    const distY = p2.y - p1.y;
    const k = diffX / distX; 

    this._targetPosition.x = jumperX;
    this._targetPosition.y = p1.y + k * distY; //SJ.jumper.body.position.y;

    const LERP_SPEED = 0.1;
    this._currentPosition.x = lerp(this._currentPosition.x, this._targetPosition.x, LERP_SPEED);
    this._currentPosition.y = lerp(this._currentPosition.y, this._targetPosition.y, LERP_SPEED);
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
    push();
      strokeWeight(20);
      fill(200, 0, 0);
      noStroke();
      const p = this._path[0];
      circle(p.x, p.y, 40);
      for(let i=1; i<this._path.length; i++) {
        const p1 = this._path[i-1];
        const p2 = this._path[i];
        stroke(0, 0, 255);
        line(p1.x, p1.y, p2.x, p2.y);
        noStroke();
        circle(p2.x, p2.y, 40);
      }
    pop();
  }

}