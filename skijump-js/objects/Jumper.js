
function Jumper(x, y) {
  this.w = 40;
  this.h = 80;
  const options = {
    friction: 0.001,
    frictionAir: 0.001
  };
  this.body = Bodies.rectangle(x, y, this.w, this.h, options);
  World.add(world, this.body);

  this.footVertices = Matter.Vertices.create([
    { x: -this.w*0.5, y: this.h*0.5 },
    { x:  this.w*0.5, y: this.h*0.5 },
    { x:  this.w*0.5, y: this.h*0.5+10 },
    { x: -this.w*0.5, y: this.h*0.5+10 }
  ]);
  this.footBounds = Matter.Bounds.create(this.footVertices);

  Body.setAngle(this.body, radians(40));

  this.JUMP_FORCE = .1;
  this.TURN_FORCE = .05;

  this.turningDir = 0;
  this.turningMod = 0.0;
  this.wantTurn = false;

  this.update = () => {
    if(this.turningMod) {
      if(this.wantTurn) {
        this.turningMod = min(this.turningMod + 0.005, 1.0);
      }else {
        this.turningMod = max(this.turningMod - 0.01, 0.0);
      }

      this.turn();
    }
  }

  this.draw = () => {
    return;
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    circle(0, 0, 3);
    pop();
  }

  this.onKeyPressed = (keyCode) => {
    if(keyCode == 'Space') {
      if(this.canJump()) {
        this.jump();
      }
    }else if(keyCode == 'ArrowLeft') {
      this.turningDir = -1;
      this.wantTurn = true;
      this.turningMod = 0.1;
    }else if(keyCode == 'ArrowRight') {
      this.turningDir = 1;
      this.wantTurn = true;
      this.turningMod = 0.1;
    }
    
    if(keyCode == 'CapsLock') {
      // this.body.collisionFilter.mask = 0;
      this.body.isStatic = !this.body.isStatic;
    }

    if(this.body.isStatic) {
      const MOVE_SPEED = 10;
      if(keyCode == 'KeyW') {
        Matter.Body.setPosition(this.body, { x:this.body.position.x, y:this.body.position.y-MOVE_SPEED });
      }else if(keyCode == 'KeyS') {
        Matter.Body.setPosition(this.body, { x:this.body.position.x, y:this.body.position.y+MOVE_SPEED });
      }else if(keyCode == 'KeyA') {
        Matter.Body.setPosition(this.body, { x:this.body.position.x-MOVE_SPEED, y:this.body.position.y });
      }else if(keyCode == 'KeyD') {
        Matter.Body.setPosition(this.body, { x:this.body.position.x+MOVE_SPEED, y:this.body.position.y });
      }
    }
  }

  this.onKeyReleased = (keyCode) => {
    if(keyCode == 'ArrowLeft') {
      this.wantTurn = false;
    }else if(keyCode == 'ArrowRight') {
      this.wantTurn = false;
    }
  }

  this.canJump = () => {
    return Matter.Query.collides(this.body, [pad.body]).length > 0;
  }

  this.jump = () => {
    const jumpAngle = this.body.angle;
    let jumpVector = Matter.Vector.create(0, -this.JUMP_FORCE);
    jumpVector = Matter.Vector.rotate(jumpVector, jumpAngle);
    Body.applyForce(this.body, this.body.position, jumpVector)
  }

  this.turn = () => {
    Body.rotate(this.body, this.TURN_FORCE * this.turningMod * this.turningDir);
  }

}