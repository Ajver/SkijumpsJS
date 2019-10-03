
function AirSystem() {
  this.angle = Math.random() * TWO_PI;
  this.airForce = 15;
  this.AIR_CHANGER_MOD = 0.08;
  this.airDensity = 0.0001;

  this.update = () => {
    this.angle += (Math.random() - 0.5) * this.AIR_CHANGER_MOD;
    ui.updateAirAngle(this.angle);

    const forceVector = this.calculateAerodynamicForce();
    
    if(jumper.body.isStatic) {
      return;
    }

    const newVelocity = Matter.Vector.add(jumper.body.velocity, forceVector);
    Body.setVelocity(jumper.body, newVelocity);
  }

  this.calculateAerodynamicForce = () => {
    const relativeVelocity = this.getrelativeVelocity();
    const relVelSqr = Matter.Vector.magnitudeSquared(relativeVelocity);
    const liftMod = 1;
    
    let force = this.airDensity * jumper.S * relVelSqr * liftMod * 0.5;
    // force = Math.min(force, 0.0001);

    let forceAngle = this.getVectorAngle(relativeVelocity) - HALF_PI;
    forceVector = this.getVectorFromAngle(forceAngle, force);

    push();

    translate(jumper.body.position.x, jumper.body.position.y);
    strokeWeight(2);
    fill(0);
    let vec = jumper.body.velocity;//this.getVectorFromAngle(this.getVectorAngle(relativeVelocity), 40);
    //line(0, 0, vec.x, vec.y);
    
    vec = Matter.Vector.mult(this.getAirVelocity(), 30);
    stroke(255, 0, 0);
    //line(0, 0, vec.x, vec.y);
    
    vec = Matter.Vector.mult(relativeVelocity, 5);
    stroke(0, 0, 255);
    //line(0, 0, vec.x, vec.y);

    vec = Matter.Vector.mult(forceVector, 1000); //Matter.Vector.mult(Matter.Vector.normalise(forceVector), 50);
    stroke(200, 108, 0);
    line(0, 0, vec.x, vec.y);

    pop()


    return forceVector;
  }

  this.getrelativeVelocity = () => {
    const airVelocity = this.getAirVelocity();
    return Matter.Vector.sub(jumper.body.velocity, airVelocity);
  }

  this.getAirVelocity = () => {
    return this.getVectorFromAngle(this.angle, this.airForce);
  }

  this.getVectorAngle = (vector) => {
    return Math.atan2(vector.y, vector.x);
  }

  this.getVectorFromAngle = (angle, length=1.0) => {
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    return Matter.Vector.create(x, y);
  }

}