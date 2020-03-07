
SJ.LaunchingPad =
class {
  constructor() {
    this.body = SJ.PadCreator.createPadBody();
    Matter.World.add(SJ.world, this.body);
  
    this._img = SJ.PadCreator.padImg;
    this._imgFront = SJ.PadCreator.padImgFront;

    this._parts = SJ.PadCreator.createPadParts();
  
    this.restart();
  }

  restart() {
    this._canJump = true;
    this._pullingSystem = new SJ.PullingSystem();
  }
  
  onReady () {
    SJ.MessagesManager.waitingForLaunch();
  }

  update () {
    if(SJ.jumper.state == SJ.jumper.S.DOWN) {
      if(this._pullingSystem.update()) {
        this.setJumperVelocity();
      }else {
        // When collision points ends
        this.endOfPulling();
      }
    }
  }

  setJumperVelocity() {
    this._pullingSystem.setNewVelocityAndAngle();
  }

  launch () {
    SJ.MessagesManager.skiingDown();
  }

  endOfPulling() {
    SJ.jumper.fly();
    SJ.MessagesManager.isFlying();
  }

  startPullingJumper() {
    this._pullingSystem.jumperFrictionMult = 3.0;
    this._pullingSystem.pullingArray = SJ.V.padCollisionPoints;
    for(let i=0; i<SJ.V.padCollisionPoints.length; i++) {
      const point = SJ.V.padCollisionPoints[i];
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
        translate(SJ.V.textureOffset.x, SJ.V.textureOffset.y)
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

  drawFront() {
    if(this._imgFront) {
      push();
        translate(SJ.V.textureOffset.x, SJ.V.textureOffset.y)
        scale(SJ.V.padScale);
        image(this._imgFront, 0, 0);
      pop();
    }
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
      const p = SJ.V.padPullingPoints[0];
      circle(p.x, p.y, 10);
      for(let i=1; i<SJ.V.padPullingPoints.length; i++) {
        const p1 = SJ.V.padPullingPoints[i-1];
        const p2 = SJ.V.padPullingPoints[i];
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
    
    switch(SJ.jumper.state) {
      case SJ.jumper.S.READY:
        this.launch();
        break;
      case SJ.jumper.S.DOWN:
        if(this._isInJumpArea()) {
          this.endOfPulling();
          SJ.jumper.jump();
        }
        break;
    }
  }

  _isInJumpArea() {
    const jumperX = SJ.jumper.body.position.x;
    return (
      SJ.V.jumpStartPoint < jumperX &&
      jumperX < SJ.V.jumpEndPoint
    );
  }

}