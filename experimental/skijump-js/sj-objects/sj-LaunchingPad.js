
SJ.LaunchingPad =
class {
  constructor() {
    this.body = SJ.PadCreator.createPadBody();
    Matter.World.add(SJ.world, this.body);

    this._parts = SJ.PadCreator.createPadParts();
    
    this.restart();
  }

  loadImages() {
    this._img = SJ.PadCreator.padImg;
    this._imgFront = SJ.PadCreator.padImgFront;
    this._middleground = SJ.PadCreator.middleground;
  }

  restart() {
    this._canJump = true;
    this.afterFly = false;
    this._pullingSystem = new SJ.PullingSystem();
  }
  
  onReady () {
    SJ.MessagesManager.waitingForLaunch();
  }

  update () {
    const { state, S } = SJ.jumper;
    if(state == S.DOWN || state == S.LANDED) {
      if(this._pullingSystem.update()) {
        this.setJumperVelocity();
      }else {
        // When collision points ends
        if(this.afterFly) {
          SJ.jumper.body.velocity.x = 0;
          SJ.jumper.body.velocity.y = 0;
          SJ.jumper.state = S.END;
        }else {
          // Jump
          this.endOfPulling();
        }
      }
    }
  }

  setJumperVelocity() {
    this._pullingSystem.setNewVelocityAndAngle();
  }

  launch () {
    SJ.jumper.state = SJ.jumper.S.DOWN
    SJ.MessagesManager.skiingDown();
  }

  endOfPulling() {
    SJ.jumper.fly();
    SJ.jumper.animationPlayer.play("jump");
    SJ.MessagesManager.isFlying();
    this.afterFly = true;
  }

  startPullingJumper() {
    this._pullingSystem.jumperFrictionMult = 3.0;
    this._pullingSystem.pullingArray = SJ.V.padCollisionPoints;
    for(let i=1; i<SJ.V.padCollisionPoints.length; i++) {
      const point = SJ.V.padCollisionPoints[i];
      if(point.x >= SJ.jumper.body.position.x) {
        this._pullingSystem.setIndex(i);
        this.setJumperRightPosition();
        return;
      }
    }
  }

  setJumperRightPosition() {
    const jumperRightPosition = this._pullingSystem.getJumperRightPosition();
    Matter.Body.setPosition(SJ.jumper.body, jumperRightPosition);
  }

  draw() {
    push();
      stroke(0);
      strokeWeight(4);
      fill(50, 50, 255, 64);
      
      push();
        translate(SJ.V.textureOffset.x, SJ.V.textureOffset.y);
        scale(SJ.V.padScale);
        image(this._img, 0, 0);

        if(this._middleground) {
          if(this._middleground.length) {
            this._middleground.forEach(layer => {
              layer.draw({x:0, y:0});
            })
          }else {
            image(this._middleground, 0, 0);
          }
        }

        if(flyMode) {
          const pos = posss();
          SJ.fly.x = pos.x;
          SJ.fly.y = pos.y;
          SJ.fly.draw()
        }
      pop();

      this._drawPullingPoints();
      this._drawCollisionLines();
      // this._drawCollisionBoxes();

    pop();
  }

  drawFront() {
    if(this._imgFront) {
      push();
        translate(SJ.V.textureOffset.x, SJ.V.textureOffset.y)
        scale(SJ.V.padScale);
        if(this._imgFront.length) {
          this._imgFront.forEach(layer => {
            layer.draw(SJ.camera);
          })
        }else {
          image(this._imgFront, 0, 0);
        }
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
    this._drawArray(SJ.V.padPullingPoints, color(200, 100, 250), 8.0, false)
  }
  
  _drawCollisionLines() {
    this._drawArray(SJ.V.padCollisionPoints, color(0, 255, 100), 8.0, false)
  }

  _drawArray(array, color, lineWeightScale=1.0, drawCircles=true, circleColor=null) {
    push();
      if(drawCircles && circleColor) {
        fill(circleColor);
      }
      noStroke();
      strokeWeight(2.0 * lineWeightScale)
      const p = array[0];
      circle(p.x, p.y, 10);
      for(let i=1; i<array.length; i++) {
        const p1 = array[i-1];
        const p2 = array[i];
        stroke(color);
        line(p1.x, p1.y, p2.x, p2.y);
        if(drawCircles) {
          noStroke();
          circle(p2.x, p2.y, 10 * lineWeightScale);
        }
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