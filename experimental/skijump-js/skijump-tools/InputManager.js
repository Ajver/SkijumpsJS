
const SPACE = 32;

function touchStarted() {
  pad.screenTouched();

  return false;
}

function keyPressed() {  
  jumper.onKeyPressed();
  pad.onKeyPressed();

  return false;
}

function keyReleased() {
  jumper.onKeyReleased();
  
  return false;
}