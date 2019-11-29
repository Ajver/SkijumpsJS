
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

  padCollisionPoints: [
    {"x": 1754, "y": 1524},
    {"x": 2004, "y": 1539.3895742560778},
    {"x": 2254, "y": 1585.179354631058},
    {"x": 2504, "y": 1660.2418447645402},
    {"x": 2754, "y": 1762.7287570313156},
    {"x": 3004, "y": 1890.1165235168157},
    {"x": 3254, "y": 2039.2684346344085},
    {"x": 3504, "y": 2206.5118753255665},
    {"x": 3754, "y": 2387.7287570313156},
    {"x": 4004, "y": 2578.456918699711},
    {"x": 4254, "y": 2774},
    {"x": 4504, "y": 2969.5430813002886},
    {"x": 4754, "y": 3160.2712429686844},
    {"x": 5004, "y": 3341.4881246744335},
    {"x": 5254, "y": 3508.7315653655915},
    {"x": 5504, "y": 3657.883476483185},
    {"x": 5754.000000000001, "y": 3785.2712429686844},
    {"x": 6004.000000000001, "y": 3887.75815523546},
    {"x": 6254.000000000001, "y": 3962.820645368942},
    {"x": 6504.000000000002, "y": 4008.6104257439224},
    {"x": 7252.163250189961, "y": 4061.067561247072}
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
    SJ.V.padCollisionPoints = v.padCollisionPoints;
    callBack();
  });
}
