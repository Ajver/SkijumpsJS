
const SPACE = 32;

const onKeyPressed = () => {  
  jumper.onKeyPressed();
  pad.onKeyPressed();

  return false;
}

const onKeyReleased = () => {
  jumper.onKeyReleased();
  
  return false;
}

const onTouchStarted = () => {
  if(isMouseInCanvas()) {
    jumper.onScreenTouched();
    pad.onScreenTouched();
  }

  return false;
}

const onTouchEnded = () => {
  if(isMouseInCanvas()) {
    jumper.onScreenTouchEnded();
  }

  return false;
}

const onMouseMoved = () => {
  updateMouseScreenPosition()
}

const onMouseDragged = () => {
  updateMouseScreenPosition()

  if(isMouseInCanvas()) {
    jumper.onScreenTouchMoved();
  }

  return false;
}

const isMouseInCanvas = () => {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

const updateMouseScreenPosition = () => {
  mouseScreenX = floor(mouseX / canvasScaler.scale);
  mouseScreenY = floor(mouseY / canvasScaler.scale);
}

function setupInputManager() {
  keyPressed = onKeyPressed;
  keyReleased = onKeyReleased;
  touchStarted = onTouchStarted;
  touchEnded = onTouchEnded;
  mouseMoved = onMouseMoved;
  mouseDragged = onMouseDragged;
}
