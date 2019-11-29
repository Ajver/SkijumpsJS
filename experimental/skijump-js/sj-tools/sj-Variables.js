
// Default values for Earth
SJ.V = {
  jumperFriction: 0.0065,
  jumperAngularFriction: 0.96,
  jumperJumpForce: 5.1,
  jumperTurnForce: 0.2,
  goodLandingAngle: 20, // in degrees

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

    background: [],
  },

  cameraPath: [
    
  ],

  jumpStartPoint: 1448,

  padPullingPoints: [
    {x:416.0,y:708.0},
    {x:656.0,y:918.0},
    {x:968.0,y:1136.0},
    {x:1350.0,y:1382.0},
    {x:1406.0,y:1416.0},
    {x:1446.0,y:1432.0},
    {x:1556.0,y:1454.0},
    {x:1754.0,y:1484.0},
  ],

  padShapeScalars: [
    {
      x: 5000,
      y: 2500
    },
  ],
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
    SJ.V.texturesNames.background = v.texturesNames.background;
    SJ.V.cameraPath = v.cameraPath;
    SJ.V.jumpStartPoint = v.jumpStartPoint;
    SJ.V.padPullingPoints = v.padPullingPoints;
    SJ.V.padShapeScalars = v.padShapeScalars;
    callBack();
  });
}
