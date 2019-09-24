
function Jumper(x, y) {
  this.w = 40;
  this.h = 60;
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

  this.draw = () => {
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
    } 
  }

  this.canJump = () => {
    return Matter.Query.collides(this.body, [pad.body]).length > 0;
  }

  this.jump = () => {
    const jumpAngle = this.body.angle - QUARTER_PI;
    const jumpVector = Matter.Vector.create(0, -this.JUMP_FORCE);
    Matter.Vector.rotate(jumpVector, jumpAngle);
    Body.applyForce(this.body, this.body.position, jumpVector)

    print("jumped");
  }

}