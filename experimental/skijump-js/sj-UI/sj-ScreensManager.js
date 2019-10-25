
SJ.Label = 
class {
  constructor(x, y, content, aling=LEFT, vAling=CENTER) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.aling = aling;
    this.vAling = vAling;
  }

  draw() {
    push();
      textAlign(this.aling, this.vAling);
      text(this.content, this.x, this.y);
    pop();
  }
  
}

SJ.Screen = 
class {
  constructor(setup, draw) {
    this.drawable = [];
    this.buttons = [];
    setup(this);
  } 

  draw() {
    background(0, 20, 50);

    this.buttons.forEach((btn) => {
      btn.draw();
    });
  }

  onMouseMove() {
    let stopMouse = false;

    this.buttons.forEach((btn) => {
      if(this.isMouseInBtn(btn)) {
        if(!btn.isMouseIn) {
          btn.isMouseIn = true;
          btn.onMouseEnter();
          stopMouse = true;
          return;
        }
      }else if(btn.isMouseIn) {
        btn.isMouseIn = false;
        btn.onMouseLeave();
        stopMouse = true;
        return;
      }
    });
    
    return stopMouse;
  }
  
  onMousePress() {
    let stopMouse = false;

    this.buttons.forEach((btn) => {
      if(this.isMouseInBtn(btn)) {
        btn.isPress = true;
        btn.onMousePress();
        stopMouse = true;
        return;
      }
    });

    return stopMouse;
  }

  onMouseRelease() {
    let stopMouse = false;

    this.buttons.forEach((btn) => {
      if(btn.isPress) {
        btn.isPress = false;
        if(this.isMouseInBtn(btn)) {
          btn.onMouseRelease();
          stopMouse = true;
          return;
        }
      }
    });

    return stopMouse;
  }

  isMouseInBtn(btn) {
    return this.isMouseInRect(btn.x, btn.y, btn.w, btn.h);
  }

  isMouseInRect(x, y, w, h) {
    return(SJ.mouseScreenX >= x && 
      SJ.mouseScreenX < x + w && 
      SJ.mouseScreenY >= y &&
      SJ.mouseScreenY < y + h);
  }
}

SJ.ScreensManager = {}

SJ.ScreensManager._isSetupped = false;

SJ.ScreensManager.setup = () => {
  if(SJ.ScreensManager._isSetupped) {
    SJ.ScreensManager.currentScreen = SJ.ScreensManager.screens.mainMenu
    return;
  }

  SJ.ScreensManager.screens.mainMenu = new SJ.Screen((self) => {
    const btnW = 300;
    const btnH = 50; 
    const startY = SJ.SCREEN_HEIGHT * 0.5;
    const btnX = (SJ.SCREEN_WIDTH / 2) - btnW/2;
    const ySeparation = btnH + 20; 

    self.buttons.push(
      new SJ.Button(btnX, startY, btnW, btnH, null, () => {
        console.log("released SKACZ");
      }));
      
    self.buttons.push(
      new SJ.Button(btnX, startY+ySeparation, btnW, btnH, null, () => {
        console.log("released SKLEP");
      }));
      
    self.buttons.push(
      new SJ.Button(btnX, startY+ySeparation*2, btnW, btnH, null, () => {
        console.log("released JAK GRAĆ?");
      }));
  
  });

  SJ.ScreensManager.currentScreen = SJ.ScreensManager.screens.mainMenu;

  SJ.ScreensManager._isSetupped = true;
}

SJ.ScreensManager.currentScreen = { draw: () => { console.log('...!...!'); }};

SJ.ScreensManager.screens = [];

SJ.ScreensManager.changeScreen = (screen) => {
  SJ.ScreensManager.currentScreen = screen;
}

SJ.ScreensManager.draw = () => {
  SJ.ScreensManager.currentScreen.draw();
}

SJ.ScreensManager.onMouseMove = () => {
  return SJ.ScreensManager.currentScreen.onMouseMove();
}

SJ.ScreensManager.onMousePress = () => {
  return SJ.ScreensManager.currentScreen.onMousePress();
}

SJ.ScreensManager.onMouseRelease = () => {
  return SJ.ScreensManager.currentScreen.onMouseRelease();
}
