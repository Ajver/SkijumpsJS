
const SPACE = 32;

const onKeyPressed = () => {  
  SJ.jumper.onKeyPressed();
  SJ.pad.onKeyPressed();

  return false;
}

const onKeyReleased = () => {
  SJ.jumper.onKeyReleased();
  
  return false;
}

const onTouchStarted = () => {
  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouched();
    SJ.pad.onScreenTouched();
  }

  return false;
}

const onTouchEnded = () => {
  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouchEnded();
  }

  return false;
}

const onMouseMoved = () => {
  updateMouseScreenPosition()
}

const onMouseDragged = () => {
  updateMouseScreenPosition()

  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouchMoved();
  }

  return false;
}

const isMouseInCanvas = () => {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

const updateMouseScreenPosition = () => {
  SJ.mouseScreenX = floor(mouseX / SJ.canvasScaler.scale);
  SJ.mouseScreenY = floor(mouseY / SJ.canvasScaler.scale);
}

function setupInputManager() {
  keyPressed = onKeyPressed;
  keyReleased = onKeyReleased;
  touchStarted = onTouchStarted;
  touchEnded = onTouchEnded;
  mouseMoved = onMouseMoved;
  mouseDragged = onMouseDragged;
}
