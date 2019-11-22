
// Default values for Earth
SJ.V = {
  jumperFriction: 0.0065,
  jumperAngularFriction: 0.96,
  jumperJumpForce: 5.1,
  jumperTurnForce: 0.2,

  padFriction: 0.0010,
  padSize: 65.0,
  
  airFriction: 0.0035,
  airDensity: 0.0001,
  airRotateForce: 0.0001,
  airMinForce: 10,
  airMaxForce: 15,
  airDynamics: 0.1,
  
  gravity: 0.2,

  texturesNames: {
    pad: 'pad.png',

    // Placeholders (not implemented yet)
    layer0: 'layer0.png',
    layer1: 'layer1.png',
  },

  padShapeScalars: {
    x: 5000,
    y: 2500
  }
};

SJ.loadVariablesFromFile = (fileName, callBack) => {
  loadJSON(document.URL + 'skijump-js/sj-locations/' + fileName, (v) => {
    SJ.V.padSize = v.padSize;
    SJ.V.airFriction = v.airFriction;
    SJ.V.padFriction = v.padFriction;
    SJ.V.airDensity = v.airDensity;
    SJ.V.airRotateForce = v.airRotateForce;
    SJ.V.airMinForce = v.airMinForce;
    SJ.V.airMaxForce = v.airMaxForce;
    SJ.V.airDynamics = v.airDynamics;
    SJ.V.gravity = v.gravity;
    SJ.V.texturesNames.pad = v.texturesNames.pad;
    SJ.V.padShapeScalars = v.padShapeScalars;
    callBack();
  });
}
