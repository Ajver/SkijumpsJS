
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
      btn._draw();
    });
  }
}

SJ.ScreensManager = {}

SJ.ScreensManager.setup = () => {
  SJ.ScreensManager.currentScreen = new SJ.Screen((self) => {
  
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
}

SJ.ScreensManager.currentScreen = { draw: () => { console.log('...!...!'); }};

SJ.ScreensManager.screens = [];

SJ.ScreensManager.changeScreen = (screen) => {
  SJ.ScreensManager.currentScreen = screen;
}

SJ.ScreensManager.draw = () => {
  SJ.ScreensManager.currentScreen.draw();
}