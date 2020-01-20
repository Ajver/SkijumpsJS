
SJ.LaunchingPad =
class {
  constructor() {
    this.body = SJ.PadCreator.createPadBody();
    Matter.World.add(SJ.world, this.body);
  
    this._img = SJ.PadCreator.padImg;

    this._parts = SJ.PadCreator.createPadParts();
  
    this.restart();
  }

  restart() {
    this._isWaitingForLaunch = true;
    this._isPullingJumper = false;
    this._canJump = false;
    this._pullingSystem = new SJ.PullingSystem();
  }
  
  onReady () {
    SJ.MessagesManager.waitingForLaunch();
  }

  update () {
    if(this._isPullingJumper) {
      if(this._pullingSystem.update()) {
        this.setJumperVelocity();
      }else {
        this.endOfPulling();
      }
    }
  }

  setJumperVelocity() {
    this._pullingSystem.setNewVelocityAndAngle();
  }

  launch () {
    this._isWaitingForLaunch = false;
    this._isPullingJumper = true;
    SJ.MessagesManager.skiingDown();
  }

  endOfPulling() {
    this._isPullingJumper = false;
    this.setJumperDynamic();
    this._canJump = false;
    SJ.jumper.isFlying = true;
    SJ.MessagesManager.isFlying();
  }

  setJumperDynamic() {
    SJ.jumper.letSteering();
  }

  startPullingJumper() {
    this._isPullingJumper = true;
    this._pullingSystem.jumperFrictionMult = 3.0;
    this._pullingSystem.pullingArray = PAD_COLLISION_POINTS;
    for(let i=0; i<PAD_COLLISION_POINTS.length; i++) {
      const point = PAD_COLLISION_POINTS[i];
      if(point.x >= SJ.jumper.body.position.x) {
        this._pullingSystem.setIndex(i);
        this.setJumperRightPosition();
        return;
      }
    }
  }

  setJumperRightPosition() {
    const jumperRightPosition = this.getJumperRightPosition();
    Matter.Body.setPosition(SJ.jumper.body, jumperRightPosition);
  }

  getJumperRightPosition() {
    const jumperX = SJ.jumper.body.position.x;
    const diffX = jumperX - this._pullingSystem.p1.x;
    const pullingPointsDiffX = this._pullingSystem.p2.x - this._pullingSystem.p1.x;
    const pullingPointsDiffY = this._pullingSystem.p2.y - this._pullingSystem.p1.y;
    const k = diffX / pullingPointsDiffX;
    const nextJumperY = this._pullingSystem.p1.y + pullingPointsDiffY * k;
    const nextJumperPos = Matter.Vector.create(jumperX, nextJumperY);
    return Matter.Vector.add(nextJumperPos, SJ.jumper.offsetPoint)
  }

  draw() {
    push();
      stroke(0);
      strokeWeight(4);
      fill(50, 50, 255, 64);
      
      push();
        scale(SJ.V.padScale);
        image(this._img, 0, 0);
      pop();
      
      // this._parts.forEach(part => {
      //   part.draw();
      // });

      // this._drawPullingPoints();
      // this._drawCollisionBoxes();

    pop();
  }

  _drawCollisionBoxes() {
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y);
      });
      endShape();
    });
  }

  _drawPullingPoints() {
    push();
      fill(200, 0, 0);
      noStroke();
      const p = PAD_PULLING_POINTS[0];
      circle(p.x, p.y, 10);
      for(let i=1; i<PAD_PULLING_POINTS.length; i++) {
        const p1 = PAD_PULLING_POINTS[i-1];
        const p2 = PAD_PULLING_POINTS[i];
        stroke(255);
        line(p1.x, p1.y, p2.x, p2.y);
        noStroke();
        circle(p2.x, p2.y, 10);
      }
    pop();
  }
 
  onKeyPressed() {
    if(keyCode == SPACE) {
      this.onSpaceHit();
    }
  }

  onScreenTouched() {
    this.onSpaceHit();
  }
  
  onSpaceHit() {
    if(!SJ.main._isRunning) {
      return;
    }

    if(this._canJump) {
      this.endOfPulling();
      SJ.jumper.jump();
    }else if(this._isWaitingForLaunch) {
      this.launch();
    }
  }

}