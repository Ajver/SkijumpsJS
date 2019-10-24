
SJ.variables = {
  jumperFriction: 0.0070,
  jumperAirFriction: 0.0050,
  jumperAngularFriction: 0.94,
  jumperJumpForce: 2.9,

  padFriction: 0.0010,
  padSize: 65.0,
  
  airDensity: 0.0001,
  airMinForce: 10,
  airMaxForce: 15,
  airDynamics: 0.1,
  
  gravity: 0.2,
};

SJ.loadVariablesFromFile = (fileName, callBack) => {
  loadJSON(document.URL + 'skijump-js/sj-locations/' + fileName, (v) => {
    SJ.variables.padFriction = v.padFriction;
    SJ.variables.padSize = v.padSize;
    SJ.variables.airDensity = v.airDensity;
    SJ.variables.airMinForce = v.airMinForce;
    SJ.variables.airMaxForce = v.airMaxForce;
    SJ.variables.airDynamics = v.airDynamics;
    SJ.variables.gravity = v.gravity;

    callBack();
  });
}
