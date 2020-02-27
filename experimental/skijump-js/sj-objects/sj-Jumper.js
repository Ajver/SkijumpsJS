
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
    this.SLOWING_SPEED = 0.01; 
  
    this.turningDir = 0;
    this.turningMod = 0.0;
    this.wantTurn = false;
    this.canSteer = false;
    this.isFlying = false;

    this.canLand = false;
    this.isLanding = false;
    this.landingTimeCounter = 0.0;
    this.LANDING_TIME_MILLIS = 200;
    this.landed = false;
    this.failed = false;
  
    this.offsetPoint = Matter.Vector.create(0, -10);

    this._setupAnimations();

    // this.testNormalizedAngle(PI, PI);
    // this.testNormalizedAngle(TWO_PI, 0);
    // this.testNormalizedAngle(-TWO_PI, 0);
    // this.testNormalizedAngle(PI+HALF_PI, -HALF_PI);
    // this.testNormalizedAngle(-PI-HALF_PI, HALF_PI);
  }

  _setupAnimations() {
    this.animationPlayer = new SJ.AnimationPlayer({
      "downhill": new SJ.Animation([
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 1.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 2.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 3.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 4.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 5.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 6.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 7.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 8.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 9.png"),
        SJ.ImageLoader.load("JumperAnimation/zjazd/Warstwa 10.png"),
      ], 1000, true, true),
      "jump": new SJ.Animation([
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 1.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 2.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 3.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 4.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 5.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok/Warstwa 6.png"),
      ], 250),
      "jump-fly": new SJ.Animation([
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 1.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 2.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 3.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 4.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 5.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 6.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 7.png"),
        SJ.ImageLoader.load("JumperAnimation/wyskok_lot/Warstwa 8.png"),
      ], 500),
      "fly": new SJ.Animation([
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 1.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 2.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 3.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 4.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 5.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 6.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 7.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 8.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 9.png"),
        SJ.ImageLoader.load("JumperAnimation/lot/Warstwa 10.png"),
      ], 1000, true, true),
    });

    this.animationPlayer.animations["downhill"].offset = new p5.Vector(-45, -55);
    this.animationPlayer.animations["jump"].offset = new p5.Vector(-45, -55);
    this.animationPlayer.animations["jump-fly"].offset = new p5.Vector(-45, -55);
    this.animationPlayer.animations["fly"].offset = new p5.Vector(-45, -55);

    this.animationPlayer.play("downhill");
    this.animationPlayer.onAnimationFinished((animationName) => {
      switch(animationName) {
        case 'jump':
          this.animationPlayer.play("jump-fly");
          break;
        case 'jump-fly':
          this.animationPlayer.play("fly");
          break;
      }
      console.log("Animation finished: ", animationName);
    });
  }

  update() {
    if(this.body.isStatic) {
      if(this.isSlowingDown) {
        this.body.velocity.x = lerp(this.body.velocity.x, 0, this.SLOWING_SPEED);
        this.body.velocity.y = lerp(this.body.velocity.y, 0, this.SLOWING_SPEED);
      }
      Matter.Body.translate(this.body, this.body.velocity);
    }

    if(!this.isFlying) {
      return;
    }

    if(this.isLanding) {
      this.landingTimeCounter += deltaTime;

      if(this.landingTimeCounter >= this.LANDING_TIME_MILLIS) {
        print("Land ended");
        this.isLanding = false;
        this.landed = true;
        SJ.scoreCounter.onJumperLand();
      }
    }

    if(Matter.Query.collides(this.body, [SJ.pad.body]).length > 0) {
      this.onPadHit();
      return;
    }

    if(!this.canSteer) {
      return;
    }

    if(this.turningMod) {
      if(this.wantTurn) {
        this.turningMod = lerp(this.turningMod, 0.5, 0.02);
      }else {
        this.turningMod = lerp(this.turningMod, 0, 0.04);
      }

      this.turn();
    }
  }

  onPadHit() {
    Matter.Body.setStatic(this.body, true);
    this.canSteer = false;
    this.isFlying = false;
    this.checkIfFail();
    SJ.main.onJumperPadHit();
  }

  checkIfFail() {
    const angle = this.getNormalizedBodyAngle();
    const padAngle = this.getPadAngle();
    const diffAngle = angle - padAngle;
    if(abs(diffAngle) >= radians(SJ.V.goodLandingAngle) || !this.landed) {
      print("Fail: ", degrees(diffAngle));
      if(diffAngle < 0) {
        this.offsetAngle = -HALF_PI;
      }else {
        this.offsetAngle = HALF_PI;
      }
      SJ.MessagesManager.fail();
      this.failed = true;
      print("FAILED");
    }else {
      SJ.MessagesManager.noFail();
    }
  }

  testNormalizedAngle(enterAngle, exeptedAngle) {
    print(this.normalizeAngle(enterAngle) === exeptedAngle ? "OK" : ("Test failed for:\nEA:" + enterAngle + "\nEA:" + exeptedAngle));
  }

  getNormalizedBodyAngle() {
    return this.normalizeAngle(this.body.angle);
  }

  normalizeAngle(angle) {
    while(angle > PI) {
      angle -= TWO_PI;
    }
    while(angle < -PI) {
      angle += TWO_PI;
    }

    return angle;
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

      const offset = this.animationPlayer.currentAnimation.offset || new p5.Vector(0, 0);
      this.animationPlayer.draw(offset.x, offset.y);
    pop();

    push();
      fill(255, 255, 255, 64);
      this.body.parts.forEach((part) => {
        beginShape();
        part.vertices.forEach((element) => {
          vertex(element.x, element.y);
          // circle(element.x, element.y, 3);
        });
        endShape(CLOSE);
      });
    pop();

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
    }else if(keyCode == SPACE) {
      if(!this.body.isStatic) {
        if(this.canLand) {
          this.land();
        }
      }
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

  land() {
    this.canLand = false;
    this.isLanding = true;
    this.canSteer = false;
  }

  jump() {
    this.accelerateWithForce(SJ.V.jumperJumpForce);
    SJ.scoreCounter.jumpRater.rate();
    this.canLand = true;
    this.animationPlayer.play("jump");
  }

  accelerateWithForce(force) {
    const jumpAngle = this.body.angle;
    let jumpVector = Matter.Vector.create(0, -force);
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
    Matter.Body.setAngle(this.body, angle);
  }

}