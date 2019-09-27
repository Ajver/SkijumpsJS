
function LaunchingPad() {
  this.body = PadCreator.createPadBody();
  print(PadCreator.pointsList);
  
  World.add(world, this.body);

  this.img = PadCreator.padImg;

  this.isPullingJumper = true;
  this.pullingSystem = {
    p1: PAD_PULLING_POINTS[1],
    p2: PAD_PULLING_POINTS[2],
    index: 2,

    update: () => {
      if(jumper.body.position.x >= this.pullingSystem.p2.x) {
        this.pullingSystem.index++;
        if(this.pullingSystem.index < PAD_PULLING_POINTS.length) {
          this.pullingSystem.p1 = this.pullingSystem.p2;
          this.pullingSystem.p2 = PAD_PULLING_POINTS[this.pullingSystem.index];
        }else {
          this.pullingSystem.index = 1;
          this.isPullingJumper = false;
          return false;
        }
      }
      return true;
    },

    getNewVelocity: () => {
      const diff_x = this.pullingSystem.p2.x - this.pullingSystem.p1.x;
      const diff_y = this.pullingSystem.p2.y - this.pullingSystem.p1.y;
      const alpha = Math.atan2(diff_y, diff_x);
      const acc = Math.sin(alpha) * world.gravity.y;

      const currVel = jumper.body.velocity
      const currVelMag = Matter.Vector.magnitude(currVel);
      
      const velAlpha = Math.atan2(currVel.y, currVel.x);
      const diffAlpha = velAlpha - alpha;
      
      let newVel = Matter.Vector.create(0, 0);
      newVel.x = Math.cos(diffAlpha) * currVelMag;
      newVel = Matter.Vector.rotate(newVel, alpha);

      Body.setAngle(jumper.body, alpha);
      
      let accVec = Matter.Vector.create(acc, 0);
      accVec = Matter.Vector.rotate(accVec, alpha);   

      return Matter.Vector.add(newVel, accVec);
    },

  };

  this.update = () => {
    if(this.isPullingJumper) {
      if(this.pullingSystem.update()) {
        const vel = this.pullingSystem.getNewVelocity();
        jumper.body.velocity = vel;
      }
    }
  }

  this.draw = () => {
    push();
    fill(50, 50, 255);
  
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y)
        circle(element.x, element.y, 10);
      });
      endShape(CLOSE);
    });

    image(this.img, 0, 0);

    pop();
  }
}