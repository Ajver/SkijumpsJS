
function AirSystem() {
  this.angle = Math.random() * TWO_PI;
  this.airForce = 15;
  this.airDensity = 0.0001;

  this.update = () => {
    this.angle += this.getAngleMod();
    ui.updateAirAngle(this.angle);

    if(jumper.body.isStatic) {
      return;
    }
    const forceVector = this.calculateAerodynamicForce();
    const newVelocity = Matter.Vector.add(jumper.body.velocity, forceVector);
    Body.setVelocity(jumper.body, newVelocity);
  }

  this.getAngleMod = () => {
    const changeAbout = Math.pow(Math.random(), 6) * 0.1;
    const tempAngle = this.angle + QUARTER_PI;
    const directionMod = Math.abs(Math.sin(tempAngle)*0.5) + 0.1;
    const changeDir = Math.random() - directionMod;
    return changeDir * changeAbout;
  }

  this.calculateAerodynamicForce = () => {
    const relativeVelocity = this.getrelativeVelocity();
    const relVelSqr = Matter.Vector.magnitudeSquared(relativeVelocity);
    const liftMod = 1;
    
    let force = this.airDensity * relVelSqr * liftMod * 0.5;

    let forceAngle = this.getVectorAngle(relativeVelocity) - HALF_PI;
    forceVector = this.getVectorFromAngle(forceAngle, force);

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