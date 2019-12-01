
// Default values for Earth
SJ.V = {
  jumperFriction: 0.0065,
  jumperAngularFriction: 0.96,
  jumperJumpForce: 5.1,
  jumperTurnForce: 0.2,
  goodLandingAngle: 20, // in degrees
  
  texturesNames: {},
};

SJ.loadVariablesFromFile = (fileName, callBack) => {
  loadJSON(document.URL + 'skijump-js/sj-locations/' + fileName, (v) => {
    SJ.V.padSize = v.padSize;
    SJ.V.minJumpDistance = v.minJumpDistance;
    SJ.V.maxJumpDistance = v.maxJumpDistance;
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
