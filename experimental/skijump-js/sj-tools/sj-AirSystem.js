
SJ.AirSystem = 
class {
  constructor() {
    this.angle = random() * TWO_PI;
    this.airForce = 15;
    this.airDensity = 0.0001;
  }

  update() {
    this.angle += this.getAngleMod();
    SJ.ui.updateAirAngle(this.angle);

    if(SJ.jumper.body.isStatic) {
      return;
    }
    const forceVector = this.calculateAerodynamicForce();
    const newVelocity = Matter.Vector.add(SJ.jumper.body.velocity, forceVector);
    Matter.Body.setVelocity(SJ.jumper.body, newVelocity);
    
    const rotateForce = this.calculateJumperRotateForce();
    const newAngularVelocity = (SJ.jumper.body.angularVelocity + rotateForce) * SJ.jumper.angularFriction;
    Matter.Body.setAngularVelocity(SJ.jumper.body, newAngularVelocity);
  }

  getAngleMod() {
    const changeAbout = pow(random(), 6) * 0.1;
    const tempAngle = this.angle + QUARTER_PI;
    const directionMod = abs(sin(tempAngle)*0.5) + 0.1;
    const changeDir = random() - directionMod;
    return changeDir * changeAbout;
  }

  calculateAerodynamicForce() {
    const relativeVelocity = this.getRelativeVelocity();
    const relVelSqr = Matter.Vector.magnitudeSquared(relativeVelocity);
    const liftMod = 1;
    
    let force = this.airDensity * relVelSqr * liftMod * 0.5;

    let forceAngle = this.getVectorAngle(relativeVelocity) - HALF_PI;
    const forceVector = this.getVectorFromAngle(forceAngle, force);

    return forceVector;
  }

  getRelativeVelocity() {
    const airVelocity = this.getAirVelocity();
    return Matter.Vector.sub(SJ.jumper.body.velocity, airVelocity);
  }
  
  getAirVelocity() {
    return this.getVectorFromAngle(this.angle, this.airForce);
  }

  calculateJumperRotateForce() {
    const relativeAngle = this.getRelativeAngle();
    
    let rotateForce = Matter.Vector.magnitude(this.getRelativeVelocity()) * this.airDensity;
    rotateForce = min(rotateForce, 1.0);
    rotateForce = max(rotateForce, -1.0);
    
    return relativeAngle * rotateForce;
  }

  getRelativeAngle() {
    let relativeAngle = SJ.jumper.body.angle - (this.angle - HALF_PI);
    
    while(relativeAngle > PI) {
      relativeAngle -= PI;
    }
    relativeAngle /= PI;

    return relativeAngle;
  }

  getVectorAngle(vector) {
    return atan2(vector.y, vector.x);
  }

  getVectorFromAngle(angle, length=1.0) {
    const x = cos(angle) * length;
    const y = sin(angle) * length;
    return Matter.Vector.create(x, y);
  }

}