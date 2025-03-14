
SJ.VariableSlider = 
class {
  constructor(varName, upd) {
    this.varName = varName;
    this.slider = select("#id-" + varName);

    this.update = upd || (() => {
      SJ.V[this.varName] = Number(this.slider.value());
    });
  }

  setDefaultValue() {
    this.slider.value(SJ.V[this.varName]);
  }

}

SJ.VariableSlidersManager =
class {
  constructor() {
    const gravitySlider = new SJ.VariableSlider("gravity")
    gravitySlider.update = () => {
      SJ.world.gravity.y = Number(gravitySlider.slider.value());
    }

    const airFrictionSlider = new SJ.VariableSlider("airFriction")
    airFrictionSlider.update = () => {
      SJ.jumper.body.frictionAir = Number(airFrictionSlider.slider.value());
    }

    this._sliders = [
      gravitySlider,
      new SJ.VariableSlider("padFriction"),
      airFrictionSlider,
      new SJ.VariableSlider("airDensity"),
      new SJ.VariableSlider("airRotateForce"),
      new SJ.VariableSlider("airMinForce"),
      new SJ.VariableSlider("airMaxForce"),
      new SJ.VariableSlider("jumperJumpForce"),
      new SJ.VariableSlider("jumperTurnForce"),
      new SJ.VariableSlider("airDynamics"),
      new SJ.VariableSlider("goodLandingAngle"),
    ];
  }

  setDefaultValues() {
    this._sliders.forEach(slider => {
      slider.setDefaultValue();
    });
  }

  update() {
    this._sliders.forEach(slider => {
      slider.update();
    })
  }
}