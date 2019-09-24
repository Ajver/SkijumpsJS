
function LaunchingPad() {
  this.w = 6000; 
  this.h = 100;
  const options = {
    isStatic: true,
  };
  this.body = Bodies.rectangle(500, 600, this.w, this.h, options);
  
  World.add(world, this.body);

  Matter.Body.setAngle(this.body, radians(40));

  this.draw = () => {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    fill(255);
    translate(pos.x, pos.y);
    rotate(angle);
    rect(0, 0, this.w, this.h);
    circle(0, 0, 3);
    pop();
  }
}