
SJ.PullingSystem =
class {
  constructor() {
    this.pullingArray = SJ.V.padPullingPoints;
    this.jumperFrictionMult = 1.0;
    this.p1 = null;
    this.p2 = null;
    this.setIndex(1);
  }

  setIndex(newIndex) {
    this.index = newIndex;
    this.p1 = this.pullingArray[newIndex-1];
    this.p2 = this.pullingArray[newIndex];    
  }

  update () {
    const jumperX = SJ.jumper.body.position.x;
    if(jumperX >= this.p2.x) {
      this.index++;
      if(this.index < this.pullingArray.length) {
        this.p1 = this.p2;
        this.p2 = this.pullingArray[this.index];
      }else {
        this.index = 1;
        return false;
      }
    }
    
    if(jumperX >= SJ.V.jumpPoint && jumperX <= SJ.V.jumpEndPoint) {
      SJ.pad._canJump = true;
      SJ.MessagesManager.canJump();
    }else {
      const lastPoint = this.pullingArray[this.pullingArray.length-1].x - 100;
      if(jumperX >= lastPoint) {
        return false;
      }
    }
    
    if(!SJ.jumper.isSlowingDown) {
      if(jumperX >= SJ.V.fallLine) {
        SJ.jumper.isSlowingDown = true;
      } 
    }

    return true;
  }

  setNewVelocityAndAngle () {
    const diff_x = this.p2.x - this.p1.x;
    const diff_y = this.p2.y - this.p1.y;
    const alpha = atan2(diff_y, diff_x);
    const acc = sin(alpha) * SJ.world.gravity.y;

    const currVel = SJ.jumper.body.velocity
    const currVelMag = Matter.Vector.magnitude(currVel);

    SJ.jumper.setAngle(lerp(SJ.jumper.body.angle, alpha + SJ.jumper.offsetAngle, 0.1));

    if(SJ.jumper.isSlowingDown) {
      return;
    }

    let newVel = Matter.Vector.create(0, 0);
    newVel.x = currVelMag;
    newVel = Matter.Vector.rotate(newVel, alpha);
    
    let accVec = Matter.Vector.create(acc, 0);
    accVec = Matter.Vector.rotate(accVec, alpha);   

    newVel = Matter.Vector.add(newVel, accVec);
    newVel = Matter.Vector.mult(newVel, 1.0 - SJ.V.padFriction - this.jumperFrictionMult*SJ.V.jumperFriction);

    SJ.jumper.body.velocity = newVel;
  }

  getJumperRightPosition() {
    const jumperX = SJ.jumper.body.position.x;
    const diffX = jumperX - this.p1.x;
    const pullingPointsDiffX = this.p2.x - this.p1.x;
    const pullingPointsDiffY = this.p2.y - this.p1.y;
    const k = diffX / pullingPointsDiffX;
    const nextJumperY = this.p1.y + pullingPointsDiffY * k;
    const nextJumperPos = Matter.Vector.create(jumperX, nextJumperY);
    return Matter.Vector.add(nextJumperPos, SJ.jumper.offsetPoint)
  }

}

