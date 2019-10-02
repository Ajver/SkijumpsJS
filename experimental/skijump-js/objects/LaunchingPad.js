
function LaunchingPad() {
  this.body = PadCreator.createPadBody();
  
  World.add(world, this.body);

  this.img = PadCreator.padImg;

  this.isWaitingForLaunch = true;
  this.isPullingJumper = false;
  this.canJump = false;
  this.pullingSystem = {
    pullingArray: PAD_PULLING_POINTS, 
    p1: null,
    p2: null,
    index: 2,
    friction: jumper.friction,

    setIndex: (newIndex) => {
      const {pullingSystem} = this;
      const {pullingArray} = pullingSystem;
      pullingSystem.index = newIndex;
      pullingSystem.p1 = pullingArray[newIndex-1];
      pullingSystem.p2 = pullingArray[newIndex];    
    },

    update: () => {
      const {position} = jumper.body;
      const {pullingSystem} = this;
      const {pullingArray} = pullingSystem;
      if(position.x >= pullingSystem.p2.x) {
        pullingSystem.index++;
        if(pullingSystem.index < pullingArray.length) {
          pullingSystem.p1 = pullingSystem.p2;
          pullingSystem.p2 = pullingArray[pullingSystem.index];
        }else {
          pullingSystem.index = 1;
          this.isPullingJumper = false;
          this.canJump = false;
          MessagesManager.isFlying();
          return false;
        }
      }
      
      if(position.x >= JUMP_POINT && position.x <= JUMP_END_POINT) {
        this.canJump = true;
        MessagesManager.canJump();
      }
      
      if(!jumper.isSlowingDown) {
        if(position.x >= FALL_LINE) {
          jumper.isSlowingDown = true;
          camera.isFollowingJumper = false;

          window.setTimeout(() => {
            callDeffered(restartGame);
          }, 1000);
        } 
      }

      return true;
    },

    setNewVelocityAndAngle: () => {
      const diff_x = this.pullingSystem.p2.x - this.pullingSystem.p1.x;
      const diff_y = this.pullingSystem.p2.y - this.pullingSystem.p1.y;
      const alpha = Math.atan2(diff_y, diff_x);
      const acc = Math.sin(alpha) * world.gravity.y;

      const currVel = jumper.body.velocity
      const currVelMag = Matter.Vector.magnitude(currVel);
      
      const velAlpha = Math.atan2(currVel.y, currVel.x);
      const diffAlpha = velAlpha - alpha;
      
      Body.setAngle(jumper.body, alpha+jumper.offsetAngle);

      let newVel = Matter.Vector.create(0, 0);
      newVel.x = Math.cos(diffAlpha) * currVelMag;
      newVel = Matter.Vector.rotate(newVel, alpha);
      
      let accVec = Matter.Vector.create(acc, 0);
      accVec = Matter.Vector.rotate(accVec, alpha);   

      newVel = Matter.Vector.add(newVel, accVec);
      newVel = Matter.Vector.mult(newVel, 1.0 - this.pullingSystem.friction);

      jumper.body.velocity = newVel;
    },

  };

  this.pullingSystem.setIndex(2);

  this.onReady = () => {
    MessagesManager.waitingForLaunch();
  }

  this.update = () => {
    if(this.isPullingJumper) {
      if(this.pullingSystem.update()) {
        this.setJumperVelocity();
      }else {
        this.setJumperDynamic();
      }
    }
  }

  this.setJumperVelocity = () => {
    this.pullingSystem.setNewVelocityAndAngle();
  }

  this.launch = () => {
    this.isWaitingForLaunch = false;
    this.isPullingJumper = true;
    MessagesManager.skiingDown();
  }

  this.setJumperDynamic = () => {
    jumper.letSteering();
    Body.setVelocity(jumper.body, jumper.body.velocity);
  }

  this.startPullingJumper = () => {
    this.isPullingJumper = true;
    this.pullingSystem.friction = jumper.friction * 3;
    this.pullingSystem.pullingArray = PAD_COLLISION_POINTS;
    for(let i=0; i<PAD_COLLISION_POINTS.length; i++) {
      const point = PAD_COLLISION_POINTS[i];
      if(point.x >= jumper.body.position.x) {
        this.pullingSystem.setIndex(i);
        this.setJumperRightPosition();
        return;
      }
    }
  }

  this.setJumperRightPosition = () => {
    const jumperRightPosition = this.getJumperRightPosition();
    Body.setPosition(jumper.body, jumperRightPosition);
  }

  this.getJumperRightPosition = () => {
    const jumperX = jumper.body.position.x;
    const diffX = jumperX - this.pullingSystem.p1.x;
    const pullingPointsDiffX = this.pullingSystem.p2.x - this.pullingSystem.p1.x;
    const pullingPointsDiffY = this.pullingSystem.p2.y - this.pullingSystem.p1.y;
    const k = diffX / pullingPointsDiffX;
    const nextJumperY = this.pullingSystem.p1.y + pullingPointsDiffY * k;
    const nextJumperPos = Matter.Vector.create(jumperX, nextJumperY);
    return Matter.Vector.add(nextJumperPos, jumper.offsetPoint)
  }

  this.draw = () => {
    push();
    fill(50, 50, 255, 128);
    
    push();
    scale(PAD_SCALE);
    image(this.img, 0, 0);
    pop();

    /*
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y)
        circle(element.x, element.y, 3);
      });
      endShape(CLOSE);
    });
    */
   
    pop();
  }

  this.onKeyPressed = (keyCode) => {
    if(keyCode == 'Space') {
      if(this.canJump) {
        this.setJumperDynamic();
        jumper.jump();
      }else if(this.isWaitingForLaunch) {
        this.launch();
      }
    }
  }
}