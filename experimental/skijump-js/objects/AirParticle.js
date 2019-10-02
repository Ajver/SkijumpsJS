
const AIR_R = 10;

function AirParticle(x, y, velocity) {
  this.lifeTime = 18;
  this.FORCE_MULT = 0.000005;

  // Position relative to jumper
  this.position = Matter.Vector.sub(Matter.Vector.create(x, y), jumper.body.position);

  this.body = Bodies.circle(x, y, AIR_R, {
    isSensor: true,
    isStatic: true
  });

  this.body.collisionFilter.group = -1;

  Body.setVelocity(this.body, velocity);

  World.add(world, this.body);

  this.update = () => {
    if(Matter.Query.collides(this.body, [jumper.body]).length > 0) {
      const forceVec = Matter.Vector.mult(this.body.velocity, this.FORCE_MULT);
      Body.applyForce(jumper.body, this.body.position, forceVec);
      return false;
    }
    this.position = Matter.Vector.add(this.position, this.body.velocity);
    const newPos = Matter.Vector.add(jumper.body.position, this.position); 
    Body.setPosition(this.body, newPos);
    return --this.lifeTime > 0;
  }

  this.draw = () => {
    push();
    //noFill();
    fill(255);
    stroke(255, 0, 0);
    circle(this.body.position.x, this.body.position.y, AIR_R);
    pop();
  }
}