
const SPACE = 32;

const onKeyPressed = () => { 
  if(SJ._state == SJ._STATE.LOADING) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  SJ.jumper.onKeyPressed();
  SJ.pad.onKeyPressed();

  return false;
}

const onKeyReleased = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  SJ.jumper.onKeyReleased();
  
  return false;
}

const onTouchStarted = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }
  if(SJ.ScreensManager.onMousePress()) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouched();
    SJ.pad.onScreenTouched();
  }

  return false;
}

const onTouchEnded = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }
  if(SJ.ScreensManager.onMouseRelease()) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouchEnded();
  }

  return false;
}

const onMouseMoved = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }

  updateMouseScreenPosition();

  SJ.ScreensManager.onMouseMove();
}

const onMouseDragged = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }

  updateMouseScreenPosition();
  
  if(SJ._state != SJ._STATE.GAME) { return; }

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
  mousePressed = onTouchStarted;
  mouseReleased = onTouchEnded;
  mouseMoved = onMouseMoved;
  mouseDragged = onMouseDragged;
}
