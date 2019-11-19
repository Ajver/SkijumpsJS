
SJ.AirSystem = 
class {
  constructor() {
    this.angle = random(TWO_PI);
    this.airForce = random(SJ.V.airMinForce, SJ.V.airMaxForce);
  }

  update() {
    this.angle += this.getAngleMod();

    while(this.angle < -PI) {
      this.angle += TWO_PI;
    }
    while(this.angle > PI) {
      this.angle -= TWO_PI;
    }
    
    this.airForce = this.getNextForce();
    SJ.ui.updateAirAngle(this.angle);

    if(SJ.jumper.body.isStatic) {
      return;
    }

    const forceVector = this.calculateAerodynamicForce();
    const newVelocity = Matter.Vector.add(SJ.jumper.body.velocity, forceVector);
    Matter.Body.setVelocity(SJ.jumper.body, newVelocity);
    
    const rotateForce = this.calculateJumperRotateForce();
    const newAngularVelocity = (SJ.jumper.body.angularVelocity + rotateForce) * SJ.V.jumperAngularFriction;
    Matter.Body.setAngularVelocity(SJ.jumper.body, newAngularVelocity);
  }

  getAngleMod() {
    const changeAbout = pow(random(), 2) * SJ.V.airDynamics;
    const changeDir = random(-1, 1);
    return changeDir * changeAbout;
  }

  getNextForce() {
    const newForce = this.airForce + random(-0.5, 0.5) * SJ.V.airDynamics;
    return constrain(newForce, SJ.V.airMinForce, SJ.V.airMaxForce);
  }

  calculateAerodynamicForce() {
    const relativeVelocity = this.getRelativeVelocity();
    const relVelSqr = Matter.Vector.magnitudeSquared(relativeVelocity);
    const liftMod = 1;
    
    let force = SJ.V.airDensity * relVelSqr * liftMod * 0.5;

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
    let relativeAngle = this.getRelativeAngle();
    if(abs(relativeAngle) < 0.07) {
      relativeAngle = 0;
    }

    const relativeVelocityMagnitude = Matter.Vector.magnitude(this.getRelativeVelocity())
    let rotateForce = relativeVelocityMagnitude * SJ.V.airDensity;
    const MAX_ROTATE_FORCE = 0.1;
    rotateForce = min(rotateForce, MAX_ROTATE_FORCE);
    rotateForce = max(rotateForce, -MAX_ROTATE_FORCE);
    
    return relativeAngle * rotateForce;
  }

  getRelativeAngle() {
    let jumperAngle = SJ.jumper.body.angle;

    if(this.isWindFacingRight()) {
      return jumperAngle - this.angle;
    }else {
      let angle = 0;
      if(this.angle > 0) {
        angle = this.angle - PI;
      }else {
        angle = this.angle + PI;
      }
      return jumperAngle - angle;
    }
  }

  isWindFacingRight() {
    return abs(this.angle) < HALF_PI;
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