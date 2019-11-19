
// Default values for Earth
SJ.V = {
  jumperFriction: 0.0065,
  jumperAirFriction: 0.0035,
  jumperAngularFriction: 0.96,
  jumperJumpForce: 5.1,

  padFriction: 0.0010,
  padSize: 65.0,
  
  airDensity: 0.0001,
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
};

SJ.loadVariablesFromFile = (fileName, callBack) => {
  loadJSON(document.URL + 'skijump-js/sj-locations/' + fileName, (v) => {
    SJ.V.padFriction = v.padFriction;
    SJ.V.padSize = v.padSize;
    SJ.V.airDensity = v.airDensity;
    SJ.V.airMinForce = v.airMinForce;
    SJ.V.airMaxForce = v.airMaxForce;
    SJ.V.airDynamics = v.airDynamics;
    SJ.V.gravity = v.gravity;
    SJ.V.texturesNames.pad = v.texturesNames.pad;

    callBack();
  });
}
