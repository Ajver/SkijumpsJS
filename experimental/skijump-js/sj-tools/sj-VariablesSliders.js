
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
        this.jumpForce = select('#jump-force');
        this.jumperTurnForce = select('#jumper-turn-force');
    }

    setDefaultValues() {
        this.gravity.value(SJ.V.gravity);
        this.padFriction.value(SJ.V.padFriction);
        this.airFriction.value(SJ.V.airFriction);
        this.airDensity.value(SJ.V.airDensity);
        this.airRotateForce.value(SJ.V.airRotateForce);
        this.airMinForce.value(SJ.V.airMinForce);
        this.airMaxForce.value(SJ.V.airMaxForce);
        this.jumpForce.value(SJ.V.jumperJumpForce);
        this.jumperTurnForce.value(SJ.V.jumperTurnForce);
    }

    update() {
        SJ.world.gravity.y = this.gravity.value();
        SJ.V.padFriction = this.padFriction.value();
        SJ.jumper.body.frictionAir = this.airFriction.value();
        SJ.V.airDensity = this.airDensity.value();
        SJ.V.airRotateForce = this.airRotateForce.value();
        SJ.V.airMinForce = this.airMinForce.value();
        SJ.V.jumperJumpForce = this.jumpForce.value();
        SJ.V.jumperTurnForce = this.jumperTurnForce.value();
    }
}
