

SJ.ScreensManager = {}

SJ.ScreensManager._isSetupped = false;

SJ.ScreensManager.screens = {
  mainMenu: {},
  selectLocation: {},
  shop: {},
  howToPlay: {},
};

SJ.ScreensManager.setup = () => {
  if(SJ.ScreensManager._isSetupped) {
    SJ.ScreensManager.currentScreen = SJ.ScreensManager.screens.mainMenu
    return;
  }

  const backBtn = new SJ.Button("Wróć", 20, SJ.SCREEN_HEIGHT-60, 200, 40, () => {
    SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.mainMenu);
  });

  SJ.ScreensManager.screens.mainMenu = new SJ.Screen((self) => {
    const btnW = 300;
    const btnH = 50; 
    const startY = SJ.SCREEN_HEIGHT * 0.5;
    const btnX = SJ.SCREEN_MIDDLE_X - btnW/2;
    const ySeparation = btnH + 20; 

    self.appendButton(
      new SJ.Button("SKACZ", btnX, startY, btnW, btnH, null, () => {
        SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.selectLocation);
      }));
      
    self.appendButton(
      new SJ.Button("SKLEP", btnX, startY+ySeparation, btnW, btnH, null, () => {
        SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.shop);
      }));
      
    self.appendButton(
      new SJ.Button("JAK GRAĆ?", btnX, startY+ySeparation*2, btnW, btnH, null, () => {
        SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.howToPlay);
      }));
      
    self.appendDrawable(
      new SJ.Label("Space Jump", SJ.SCREEN_MIDDLE_X, 120, CENTER, TOP, 96)
    );

    self.appendDrawable(
      new SJ.Label("version "+SJ.VERSION, 10, SJ.SCREEN_HEIGHT-10, LEFT, BOTTOM, 14, color(200, 200, 200))
    );
  
  });

  SJ.ScreensManager.screens.selectLocation = new SJ.Screen((self) => {

    self.appendButton(backBtn)

    const xSeparation = 240;

    self.appendButton(SJ.createLocationButton("Ziemia", 30, 300));
    self.appendButton(SJ.createLocationButton("Księżyc", 30+xSeparation, 300));

    self.appendDrawable(
      new SJ.Label("Wybierz lokację", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.screens.shop = new SJ.Screen((self) => {

    self.appendButton(backBtn)

    self.appendDrawable(
      new SJ.Label("Sklep", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.screens.howToPlay = new SJ.Screen((self) => {

    self.appendButton(backBtn)

    self.appendDrawable(
      new SJ.Label("Jak grać?", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.currentScreen = SJ.ScreensManager.screens.mainMenu;

  SJ.ScreensManager._isSetupped = true;
}

SJ.ScreensManager.currentScreen = { draw: () => { console.log('...!...!'); }};

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
