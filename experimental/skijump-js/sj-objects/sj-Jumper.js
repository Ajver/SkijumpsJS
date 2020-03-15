
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

    this.S = {
      START    : 0, // start walk, hand waving
      READY    : 1, // Ready to go
      DOWN     : 2, // Downhill
      FLYING   : 3, // Flying
      LANDED   : 5, // Landed on pad (or failed)
    }
    this.state = this.S.START

    this.FLY_S = {
      JUMP     : 0, // Jump animation, cannot start landing yet
      FLY      : 1, // Static fly animation, can land
      FALLDOWN : 2, // Fly with velocity.y > 0
      LANDING  : 3, // Landing animation, but not landed yet
      LANDED   : 4, // Landing animation ended, ready to hit pad
    }
    this.flyState = this.FLY_S.JUMP
  
    this.walkSystem = new SJ.StartWalkSystem();

    this.body = Matter.Body.create(options);
    
    Matter.World.add(SJ.world, this.body);
  
    this.offsetAngle = 0;
    
    this.SLOWING_SPEED = 0.01; 
  
    this.turningDir = 0;
    this.turningMod = 0.0;
    this.wantTurn = false;

    this.landingTimeCounter = 0.0;
    this.LANDING_TIME_MILLIS = 200;
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
    const animationsFolder = "JumperAnimation/";

    this.animationPlayer = new SJ.AnimationPlayer({
      "start_walk": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"start_spacer/1.png"),
        SJ.ImageLoader.load(animationsFolder+"start_spacer/2.png"),
        SJ.ImageLoader.load(animationsFolder+"start_spacer/3.png"),
        SJ.ImageLoader.load(animationsFolder+"start_spacer/4.png"),
        SJ.ImageLoader.load(animationsFolder+"start_spacer/5.png"),
        SJ.ImageLoader.load(animationsFolder+"start_spacer/6.png"),
      ], 800, true, true),
      "wave": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"start_machanie/1.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/2.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/3.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/4.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/5.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/6.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/7.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/8.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/9.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/10.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/11.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/12.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/11.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/10.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/9.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/8.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/7.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/6.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/5.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/4.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/3.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/2.png"),
        SJ.ImageLoader.load(animationsFolder+"start_machanie/1.png"),
      ], 2000),
      "downhill": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"zjazd/1.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/2.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/3.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/4.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/5.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/6.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/7.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/8.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/9.png"),
        SJ.ImageLoader.load(animationsFolder+"zjazd/10.png"),
      ], 1000, true, true),
      "jump": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"wyskok/1.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok/2.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok/3.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok/4.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok/5.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok/6.png"),
      ], 200),
      "jump-fly": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/1.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/2.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/3.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/4.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/5.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/6.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/7.png"),
        SJ.ImageLoader.load(animationsFolder+"wyskok_lot/8.png"),
      ], 300),
      "fly": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"lot/1.png"),
        SJ.ImageLoader.load(animationsFolder+"lot/2.png"),
        SJ.ImageLoader.load(animationsFolder+"lot/3.png"),
        SJ.ImageLoader.load(animationsFolder+"lot/4.png"),
        SJ.ImageLoader.load(animationsFolder+"lot/5.png"),
        SJ.ImageLoader.load(animationsFolder+"lot/6.png"),
      ], 1000, true, true),
      "fly-falldown": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"lot_lotdol/1.png"),
        SJ.ImageLoader.load(animationsFolder+"lot_lotdol/2.png"),
        SJ.ImageLoader.load(animationsFolder+"lot_lotdol/3.png"),
        SJ.ImageLoader.load(animationsFolder+"lot_lotdol/4.png"),
      ], 400),
      "falldown": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"lotdol/1.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/2.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/3.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/4.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/5.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/6.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/7.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/8.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/9.png"),
        SJ.ImageLoader.load(animationsFolder+"lotdol/10.png"),
      ], 1000, true, true),
      "land": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"ladowanie/1.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie/2.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie/3.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie/4.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie/5.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie/6.png"),
      ], this.LANDING_TIME_MILLIS),
      "land2": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/1.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/2.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/3.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/4.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/5.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/6.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie2/7.png"),
      ], 400),
      "land_downhill": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/1.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/2.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/3.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/4.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/5.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3/6.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3_zjazd/1.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3_zjazd/2.png"),
        SJ.ImageLoader.load(animationsFolder+"ladowanie3_zjazd/3.png"),
      ], 600),
      "fail": new SJ.Animation([
        SJ.ImageLoader.load(animationsFolder+"lot/1.png"),
      ], 1000),
    });

    this.animationPlayer.forEachAnimation(animation => {
      animation.offset = new p5.Vector(-45, -65);
    })

    this.animationPlayer.play("start_walk");

    this.animationPlayer.onAnimationFinished((animationName) => {
      switch(animationName) {
        case 'wave':
          this.state = this.S.READY;
          this.animationPlayer.play("downhill")
          this.walkSystem = null;
          break;
        case 'jump':
          this.animationPlayer.play("jump-fly");
          break;
        case 'jump-fly':
          this.animationPlayer.play("fly");
          this.flyState = this.FLY_S.FLY
          break;
        case 'fly-falldown':
          this.animationPlayer.play("falldown");
          break;
        case 'land':
          this.animationPlayer.play("land2");
          break;
      }
    });
  }

  update() {
    switch(this.state) {
      case this.S.START:
        this.walkSystem.update()
        break;
      case this.S.FLYING:
        this._updateOnFly()      
        break;
      case this.S.LANDED:
        this.body.velocity.x = lerp(this.body.velocity.x, 0, this.SLOWING_SPEED);
        this.body.velocity.y = lerp(this.body.velocity.y, 0, this.SLOWING_SPEED);
        break;
    }
  
    if(this.body.isStatic) {
      Matter.Body.translate(this.body, this.body.velocity);
    }
  }

  _updateOnFly() {
    switch(this.flyState) {
      case this.FLY_S.FLY:
      case this.FLY_S.JUMP:
      case this.FLY_S.FALLDOWN:
        if(this.turningMod) {
          if(this.wantTurn) {
            this.turningMod = lerp(this.turningMod, 0.5, 0.02);
          }else {
            this.turningMod = lerp(this.turningMod, 0, 0.04);
          }
    
          this.turn();
        }
        break;
      case this.FLY_S.LANDING:
        this.landingTimeCounter += deltaTime;

        if(this.landingTimeCounter >= this.LANDING_TIME_MILLIS) {
          print("Land ended");
          SJ.scoreCounter.onJumperLand();
          this.flyState = this.FLY_S.LANDED;
        }
        break;
    }

    // if(this.flyState == this.FLY_S.FLY) {
    //   if(this.body.velocity.y > 0) {
    //     this.flyState = this.FLY_S.FALLDOWN;
    //     this.animationPlayer.play("fly-falldown")
    //   }
    // }
    
    if(Matter.Query.collides(this.body, [SJ.pad.body]).length > 0) {
      this.onPadHit();
      return;
    }
  }

  onPadHit() {
    Matter.Body.setStatic(this.body, true);
    this.state = this.S.LANDED
    this.checkIfFail();
    SJ.main.onJumperPadHit();
  }

  checkIfFail() {
    const padAngle = this.getPadAngle();

    if(this.flyState != this.FLY_S.LANDED) {
      this._fail()
    }else {
      const angle = this.getNormalizedBodyAngle();
      const diffAngle = degrees(angle - padAngle);

      if(abs(diffAngle) >= SJ.V.goodLandingAngle) {
        this._fail(diffAngle)
      }else {
        this._landSuccess()
      } 
    }

    this.setAngle(padAngle);
  }

  _fail(deg) {
    if(deg !== undefined) {
      print("Fail with angle: ", deg);
    }else {
      print("Failed because not Landed")
    }

    this.animationPlayer.play("fail");
    SJ.MessagesManager.fail();
    this.failed = true;
  }

  _landSuccess() {
    this.animationPlayer.play("land_downhill")
    SJ.MessagesManager.noFail();
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
      // fill(255);
      // rectMode(CENTER);
      // rect(0, 0, this._w, this._h);

      const offset = this.animationPlayer.currentAnimation.offset || new p5.Vector(0, 0);
      this.animationPlayer.draw(offset.x, offset.y);
    pop();

    // push();
    //   fill(255, 255, 255, 64);
    //   this.body.parts.forEach((part) => {
    //     beginShape();
    //     part.vertices.forEach((element) => {
    //       vertex(element.x, element.y);
    //       // circle(element.x, element.y, 3);
    //     });
    //     endShape(CLOSE);
    //   });
    // pop();

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
      if(this.state == this.S.FLYING) {
        if(this.flyState == this.FLY_S.FLY || this.flyState == this.FLY_S.FALLDOWN) {
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
    this.animationPlayer.play("land");
    this.flyState = this.FLY_S.LANDING;
  }

  jump() {
    this.accelerateWithForce(SJ.V.jumperJumpForce);
    SJ.scoreCounter.jumpRater.rate();
    this.animationPlayer.play("jump");
    this.flyState = this.FLY_S.JUMP
  }

  accelerateWithForce(force) {
    const jumpAngle = this.body.angle;
    let jumpVector = Matter.Vector.create(0, -force);
    jumpVector = Matter.Vector.rotate(jumpVector, jumpAngle);
    const newVelocity = Matter.Vector.add(this.body.velocity, jumpVector);
    Matter.Body.setVelocity(this.body, newVelocity);
  }
 
  fly() {
    this.letSteering();
  }

  letSteering() {
    Matter.Body.setStatic(this.body, false);
    this.state = this.S.FLYING
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