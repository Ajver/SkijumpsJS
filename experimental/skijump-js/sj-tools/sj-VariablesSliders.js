
SJ.VariableSlidersManager = 
class {
    constructor() {
        this.gravity = select('#gravity');
        this.padFriction = select('#pad-friction');
        this.airFriction = select('#air-friction');
        this.airDensity = select('#air-density');
        this.airRotateForce = select('#air-rotate-force');
        this.airMinForce = select('#air-min-force');
        this.airMaxForce = select('#air-max-force');
    }

    setDefaultValues() {
        this.gravity.value(SJ.V.gravity);
        this.padFriction.value(SJ.V.padFriction);
        this.airFriction.value(SJ.V.airFriction);
        this.airDensity.value(SJ.V.airDensity);
        this.airRotateForce.value(SJ.V.airRotateForce);
        this.airMinForce.value(SJ.V.airMinForce);
        this.airMaxForce.value(SJ.V.airMaxForce);
    }

    update() {
        SJ.world.gravity.y = this.gravity.value();
        SJ.V.padFriction = this.padFriction.value();
        SJ.jumper.body.frictionAir = this.airFriction.value();
        SJ.V.airDensity = this.airDensity.value();
        SJ.V.airRotateForce = this.airRotateForce.value();
        SJ.V.airMinForce = this.airMinForce.value();
        SJ.V.airMaxForce = this.airMaxForce.value();
    }
}
