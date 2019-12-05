
SJ.PullingSystem =
class {
  constructor() {
    this.pullingArray = PAD_PULLING_POINTS;
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
    const jumperPos = SJ.jumper.body.position;
    if(jumperPos.x >= this.p2.x) {
      this.index++;
      if(this.index < this.pullingArray.length) {
        this.p1 = this.p2;
        this.p2 = this.pullingArray[this.index];
      }else {
        this.index = 1;
        return false;
      }
    }
    
    if(jumperPos.x >= JUMP_POINT && jumperPos.x <= JUMP_END_POINT) {
      SJ.pad._canJump = true;
      SJ.MessagesManager.canJump();
    }
    
    if(!SJ.jumper.isSlowingDown) {
      if(jumperPos.x >= FALL_LINE) {
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
    
    SJ.jumper.setAngle(alpha + SJ.jumper.offsetAngle);

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

}

