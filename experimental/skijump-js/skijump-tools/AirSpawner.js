
function AirSpawner() {
  this.angle = Math.random() * TWO_PI;
  this.size = 80;
  this.radius = 100;
  this.force = 10;
  this.framesCounter = 0;
  this.nextParticleWaitFrames = 2;
  this.airParticles = [];
  this.AIR_CHANGER_MOD = 0.08;

  this.update = () => {
    this.angle += (Math.random() - 0.5) * this.AIR_CHANGER_MOD;
    this.framesCounter++;
  
    for(let i=this.airParticles.length-1; i>=0; i--) {
      let particle = this.airParticles[i];
      if(!particle.update()) {
        this.airParticles.splice(i, 1);
      }
    }

    if(this.framesCounter >= this.nextParticleWaitFrames) {
      this.framesCounter = 0;
      this.spawnParticle();
    }
  }

  this.draw = () => {
    push();
    const jumperPos = jumper.body.position;
    const x = Math.cos(this.angle) * this.radius + jumperPos.x;
    const y = Math.sin(this.angle) * this.radius + jumperPos.y;
    fill(255, 128, 0);
    translate(x, y);
    rotate(this.angle);
    rect(0, 0, 15, this.size);
    circle(0, 0, 20);
    pop();
    this.airParticles.forEach(element => {
      element.draw();
    });
  }

  this.spawnParticle = () => {
    const jumperPos = jumper.body.position;
    const diffX = Math.sin(-this.angle) * this.size;
    const diffY = Math.cos(-this.angle) * this.size;
    const offset = Math.random() - 0.5;
    const offsetX = offset * diffX; 
    const offsetY = offset * diffY; 
    const spawnX = Math.cos(this.angle) * this.radius + jumperPos.x + offsetX;
    const spawnY = Math.sin(this.angle) * this.radius + jumperPos.y + offsetY;
    const velocity = this.getNextParticleVelocity();
    const particle = new AirParticle(spawnX, spawnY, velocity);
    this.airParticles[this.airParticles.length] = particle;
  }

  this.getNextParticleVelocity = () => {
    const velX = Math.cos(this.angle + PI) * this.force;
    const velY = Math.sin(this.angle + PI) * this.force;
    return Matter.Vector.create(velX, velY);
  }

}