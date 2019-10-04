
const SPACE = 32;

function touchStarted() {
  if(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    pad.screenTouched();
  }

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

function mouseMoved() {
  updateMouseScreenPosition()
}

function mouseDragged() {
  updateMouseScreenPosition()
}

function updateMouseScreenPosition() {
  mouseScreenX = floor(mouseX / canvasScaler.scale);
  mouseScreenY = floor(mouseY / canvasScaler.scale);
}