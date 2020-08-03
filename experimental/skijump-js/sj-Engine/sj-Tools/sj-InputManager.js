
const SPACE = 32;

// Little light following mouse.
const flyMode = false;
const arr = []

const posss = () => {
  const pos = SJ.camera.screenToWorld(createVector(
    SJ.mouseScreenX,
    SJ.mouseScreenY
  ));

  pos.x += -28;
  pos.y += -26;

  pos.x -= SJ.V.textureOffset.x;
  pos.y -= SJ.V.textureOffset.y;

  pos.x /= SJ.V.padScale
  pos.y /= SJ.V.padScale

  pos.x = Math.round(pos.x)
  pos.y = Math.round(pos.y)

  return pos;
}

const onKeyPressed = () => { 
  if(SJ._state != SJ._STATE.GAME) { return; }

  SJ.jumper.onKeyPressed();
  SJ.pad.onKeyPressed();
  SJ.itemsManager.onKeyPressed();
  SJ.camera.moveWithArrows(keyCode);

  if (keyCode == CONTROL) {
    const pos = posss();
    arr.push(pos);
    print(pos);
  }else if(keyCode == SHIFT) {
    let str = ""
    arr.forEach(pos => {
      str += `{"x":${pos.x},"y":${pos.y}},\n`;
    })
    print(str);
  }
}

const onKeyReleased = () => {
  if(SJ._state != SJ._STATE.GAME) { return; }

  SJ.jumper.onKeyReleased();
}

const onTouchStarted = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }
  
  updateMouseScreenPosition();
  
  if(SJ.ScreensManager.onMousePress()) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  if(isMouseInCanvas()) {
    SJ.pad.onScreenTouched();
    SJ.jumper.onScreenTouched();
  }
}

const onTouchEnded = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }
  if(SJ.ScreensManager.onMouseRelease()) { return; }
  if(SJ._state != SJ._STATE.GAME) { return; }

  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouchEnded();
  }
}

const onMouseMoved = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }

  updateMouseScreenPosition();

  SJ.ScreensManager.onMouseMove();

  // const pos = posss();
  // SJ.fly.x = pos.x;
  // SJ.fly.y = pos.y;
}

const onMouseDragged = () => {
  if(SJ._state == SJ._STATE.LOADING) { return; }

  updateMouseScreenPosition();
  
  if(SJ._state != SJ._STATE.GAME) { return; }

  if(isMouseInCanvas()) {
    SJ.jumper.onScreenTouchMoved();
  }
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
  mouseMoved = onMouseMoved;
  mouseDragged = onMouseDragged;

  if(SJ.IS_MOBILE) {
    touchStarted = onTouchStarted;
    touchEnded = onTouchEnded;  

    // Remove default behaviour
    // Needed to prevent double event calling on mobile
    mousePressed = () => {};
    mouseReleased = () => {};
  }else {
    mousePressed = onTouchStarted;
    mouseReleased = onTouchEnded;
  }
}