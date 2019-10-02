
function LaunchingPad() {
  this.body = PadCreator.createPadBody();
  
  World.add(world, this.body);

  this.img = PadCreator.padImg;

  this.isWaitingForLaunch = true;
  this.isPullingJumper = false;
  this.canJump = false;
  this.pullingSystem = new PullingSystem();

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