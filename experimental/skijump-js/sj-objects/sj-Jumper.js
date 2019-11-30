
SJ.Jumper =
class {
  constructor(x, y) {
    this.start_x = x;
    this.start_y = y;

    this._w = 10;
    this._h = 20;

    const options = {
      friction: 0.0,
      frictionAir: SJ.V.airFriction,
      density: 1,
      isStatic: true,
      parts: [
        Matter.Bodies.rectangle(x, y, this._w, this._h),
        Matter.Bodies.rectangle(x+5, y+this._h*0.5+3, this._w+15, 5),
        Matter.Bodies.circle(x-this._w*0.5-5, y+this._h*0.5+2.5, 3),
        Matter.Bodies.circle(x+this._w*0.5+12, y+this._h*0.5+2.5, 3),
      ],
    };
    this.realBodyStatic = true;
  
    this.body = Matter.Body.create(options);
    
    Matter.World.add(SJ.world, this.body);
  
    Matter.Body.setAngle(this.body, radians(40));
    this.offsetAngle = 0;
    
    this.isSlowingDown = false;
    this.SLOWING_MOD = .995; 
  
    this.turningDir = 0;
    this.turningMod = 0.0;
    this.wantTurn = false;
    this.canSteer = false;
  
    this.offsetPoint = Matter.Vector.create(0, -10);
  }

  update() {
    if(this.body.isStatic) {
      if(this.isSlowingDown) {
        this.body.velocity.x *= this.SLOWING_MOD;
        this.body.velocity.y *= this.SLOWING_MOD;
      }
      Matter.Body.translate(this.body, this.body.velocity);
    }

    if(!this.canSteer) {
      return;
    }

    if(Matter.Query.collides(this.body, [SJ.pad.body]).length > 0) {
      this.onPadHit();
      return;
    }

    if(this.turningMod) {
      if(this.wantTurn) {
        this.turningMod = min(this.turningMod + 0.02, 0.5);
      }else {
        this.turningMod = max(this.turningMod - 0.01, 0.0);
      }

      this.turn();
    }
  }

  onPadHit() {
    Matter.Body.setStatic(this.body, true);
    this.canSteer = false;
    SJ.scoreCounter.calculateDistance(this.body.position.x);
    // SJ.ui.updateScoreLabel(SJ.scoreCounter.score);
    SJ.pad.startPullingJumper();
    this.checkIfFail();
  }

  checkIfFail() {
    const angle = this.body.angle;
    const padAngle = this.getPadAngle();
    const diffAngle = angle - padAngle;
    if(abs(diffAngle) >= radians(SJ.V.goodLandingAngle)) {
      if(diffAngle < 0) {
        this.offsetAngle = -HALF_PI;
      }else {
        this.offsetAngle = HALF_PI;
      }
      SJ.MessagesManager.fail();
    }else {
      SJ.MessagesManager.noFail();
    }
  }

  getPadAngle() {
    const diffX = SJ.pad._pullingSystem.p2.x - SJ.pad._pullingSystem.p1.x; 
    const diffY = SJ.pad._pullingSystem.p2.y - SJ.pad._pullingSystem.p1.y; 
    const padAngle = atan2(diffY, diffX);
    return padAngle;
  }

  draw() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
      translate(pos.x, pos.y);
      rotate(angle);
      fill(255);
      rectMode(CENTER);
      rect(0, 0, this._w, this._h);
    pop();

    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y)
        // circle(element.x, element.y, 3);
      });
      endShape(CLOSE);
    });

    // this._drawVelocityVector();
  }

  _drawVelocityVector() {
    push();
      translate(pos.x, pos.y);
      scale(3.0);
      line(0, 0, this.body.velocity.x, this.body.velocity.y);
    pop();
  }

  onKeyPressed() {
    if(keyCode == LEFT_ARROW) {
      this.wantTurnTo(-1);
    }else if(keyCode == RIGHT_ARROW) {
      this.wantTurnTo(1);
    }
  }

  onKeyReleased() {
    if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
      this.wantTurn = false;
    }
  }

  onScreenTouched() { 
    this.setTurnDirByTouch();
  }

  onScreenTouchMoved() {
    this.setTurnDirByTouch();
  }

  setTurnDirByTouch() {
    if(SJ.mouseScreenX < SJ.SCREEN_WIDTH*0.5) {
      this.wantTurnTo(-1);
    }else {
      this.wantTurnTo(1);
    }
  }
  
  onScreenTouchEnded() {
    this.wantTurn = false;
  }

  wantTurnTo(dir) {
    this.turningDir = dir;
    this.wantTurn = true;
    this.turningMod = 0.1;
  } 

  jump() {
    const jumpAngle = this.body.angle;
    let jumpVector = Matter.Vector.create(0, -SJ.V.jumperJumpForce);
    jumpVector = Matter.Vector.rotate(jumpVector, jumpAngle);
    const newVelocity = Matter.Vector.add(this.body.velocity, jumpVector);
    Matter.Body.setVelocity(this.body, newVelocity);
  }
  
  letSteering() {
    Matter.Body.setStatic(this.body, false);
    this.canSteer = true;
  }

  turn() {
    let deltaAngle = SJ.V.jumperTurnForce * this.turningMod * this.turningDir;
    let angle = this.body.angle + deltaAngle;
    this.setAngle(angle);
  }

  setAngle(angle) {
    while(angle < -PI) {
      angle += TWO_PI;
    }
    while(angle > PI) {
      angle -= TWO_PI;
    }
    
    Matter.Body.setAngle(this.body, angle);
  }

}