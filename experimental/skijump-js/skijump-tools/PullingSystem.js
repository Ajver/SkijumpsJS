
function PullingSystem() {
  this.pullingArray = PAD_PULLING_POINTS;
  this.p1 = null;
  this.p2 = null;
  this.index = 2;
  this.friction = jumper.friction;

  this.setIndex = (newIndex) => {
    this.index = newIndex;
    this.p1 = this.pullingArray[newIndex-1];
    this.p2 = this.pullingArray[newIndex];    
  }

  this.update = () => {
    const jumperPos = jumper.body.position;
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
      pad.canJump = true;
      MessagesManager.canJump();
    }
    
    if(!jumper.isSlowingDown) {
      if(jumperPos.x >= FALL_LINE) {
        jumper.isSlowingDown = true;
        camera.isFollowingJumper = false;

        window.setTimeout(() => {
          callDeffered(restartGame);
        }, 1000);
      } 
    }

    return true;
  }

  this.setNewVelocityAndAngle = () => {
    const diff_x = this.p2.x - this.p1.x;
    const diff_y = this.p2.y - this.p1.y;
    const alpha = atan2(diff_y, diff_x);
    const acc = sin(alpha) * world.gravity.y;

    const currVel = jumper.body.velocity
    const currVelMag = Matter.Vector.magnitude(currVel);
    
    const velAlpha = atan2(currVel.y, currVel.x);
    const diffAlpha = velAlpha - alpha;
    
    Body.setAngle(jumper.body, alpha+jumper.offsetAngle);

    let newVel = Matter.Vector.create(0, 0);
    newVel.x = cos(diffAlpha) * currVelMag;
    newVel = Matter.Vector.rotate(newVel, alpha);
    
    let accVec = Matter.Vector.create(acc, 0);
    accVec = Matter.Vector.rotate(accVec, alpha);   

    newVel = Matter.Vector.add(newVel, accVec);
    newVel = Matter.Vector.mult(newVel, 1.0 - this.friction);

    jumper.body.velocity = newVel;
  }

  this.setIndex(2);

}

