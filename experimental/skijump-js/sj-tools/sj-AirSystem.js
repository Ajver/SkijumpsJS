
SJ.AirSystem = 
class {
  constructor() {
    this.angle = random() * TWO_PI;
    this.airForce = random(SJ.variables.airMinForce, SJ.variables.airMaxForce);
  }

  update() {
    this.angle += this.getAngleMod();
    this.airForce = this.getNextForce();
    SJ.ui.updateAirAngle(this.angle);

    if(SJ.jumper.body.isStatic) {
      return;
    }
    const forceVector = this.calculateAerodynamicForce();
    const newVelocity = Matter.Vector.add(SJ.jumper.body.velocity, forceVector);
    Matter.Body.setVelocity(SJ.jumper.body, newVelocity);
    
    const rotateForce = this.calculateJumperRotateForce();
    const newAngularVelocity = (SJ.jumper.body.angularVelocity + rotateForce) * SJ.variables.jumperAngularFriction;
    Matter.Body.setAngularVelocity(SJ.jumper.body, newAngularVelocity);
  }

  getAngleMod() {
    const changeAbout = pow(random(), 6) * 0.1;
    const tempAngle = this.angle + QUARTER_PI;
    const directionMod = abs(sin(tempAngle)*0.5) + 0.1;
    const changeDir = random() - directionMod;
    return changeDir * changeAbout;
  }

  getNextForce() {
    const newForce = this.airForce + random(-0.5, 0.5) * SJ.variables.airDynamics;
    return constrain(newForce, SJ.variables.airMinForce, SJ.variables.airMaxForce);
  }

  calculateAerodynamicForce() {
    const relativeVelocity = this.getRelativeVelocity();
    const relVelSqr = Matter.Vector.magnitudeSquared(relativeVelocity);
    const liftMod = 1;
    
    let force = SJ.variables.airDensity * relVelSqr * liftMod * 0.5;

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
    
    let rotateForce = Matter.Vector.magnitude(this.getRelativeVelocity()) * SJ.variables.airDensity;
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