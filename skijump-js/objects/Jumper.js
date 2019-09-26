
function Jumper(x, y) {
  this.w = 10;
  this.h = 20;
  const options = {
    friction: 0.0,
    frictionAir: 0.001,
    density: 1,
    parts: [
      Bodies.rectangle(x, y, this.w, this.h),
      Bodies.rectangle(x+5, y+this.h*0.5+3, this.w+15, 5),
      Bodies.circle(x-this.w*0.5-5, y+this.h*0.5+2.5, 3),
      Bodies.circle(x+this.w*0.5+12, y+this.h*0.5+2.5, 3),
    ],
  };

  this.body = Body.create(options);
  
  
  World.add(world, this.body);

  Body.setAngle(this.body, radians(40));

  this.JUMP_FORCE = .0025;
  this.TURN_FORCE = .2;

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
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    pop();

    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y)
        // circle(element.x, element.y, 3);
      });
      endShape(CLOSE);
    });
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