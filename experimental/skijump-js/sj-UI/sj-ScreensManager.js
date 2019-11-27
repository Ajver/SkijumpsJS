

SJ.ScreensManager = {}

SJ.ScreensManager._isSetupped = false;

SJ.ScreensManager.screens = {
  mainMenu: {},
  selectLocation: {},
  shop: {},
  howToPlay: {},
  game: {},
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

    self.appendButton(backBtn);

    const xSeparation = 235;
    const locations = [
      [ "Cyber City", "CyberCity" ],
      [ "Titan Base", "TitanBase" ],
      [ "Star Station", "StarStation" ],
      [ "Alien Colony", "AlienColony" ],
      [ "Planeta X", "PlanetX" ],
    ]

    for(let i=0; i<locations.length; i++) {
      const loc = locations[i];
      self.appendButton(SJ.createLocationButton(loc[0], 30+xSeparation*i, 300, loc[1]));
    }

    self.appendDrawable(
      new SJ.Label("Wybierz lokację", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.screens.shop = new SJ.Screen((self) => {

    self.appendButton(backBtn);

    self.appendDrawable(
      new SJ.Label("Sklep", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

    const xSeparation = 235;
    const ySeparation = 160;
    const items = [
      new SJ.Item("Narty", "padFriction", 0.85, "Super narty zmniejszające tarcie!"),
      new SJ.Item("Buty", "jumperJumpForce", 1.2, "Super buty zwiększające siłę wybicia!"),
      new SJ.Item("Skrzydła", "airDensity", 0.9, "Małe skrzydełka zwiększające siłę nośną!"),
      new SJ.Item("Opływowy kombinezon", "airFriction", 0.9, "Kombinezon o bardziej opływowym kształcie zmniejszający opory powietrza!"),
      new SJ.Item("Stabilizator lotu", "airRotateForce", 0.9, "Wszczep pomagający utrzymać dobrą pozycję przy silnym wietrze!"),
      new SJ.Item("Wspomagacz lądowania", "goodLandingAngle", 3, "Wszczep wspomagający lądowanie pod złym kątem!"),
    ];

    // Drawing buttons in grid 5x[some rows count]
    let yPos = 200;
    let drawedItems = 0;
    let itemsCount = min(items.length, 5);
    while(itemsCount > 0) {
      for(let i=0; i<itemsCount; i++) {
        self.appendButton(SJ.createItemButton(30+xSeparation*i, yPos, items[drawedItems]));
        drawedItems++;
      }
      yPos += ySeparation;
      itemsCount = min(items.length - drawedItems, 5);
    }
    

  });

  SJ.ScreensManager.screens.howToPlay = new SJ.Screen((self) => {

    self.appendDrawable(new SJ.Texture('how_to_play.png', SJ.SCREEN_MIDDLE_X-250, 250, 500, 500));

    self.appendButton(backBtn);

    self.appendDrawable(
      new SJ.Label("Jak grać?", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.screens.game = new SJ.Screen((self) => {

    self.setBackgroundColor(color(0, 0, 0, 0));

  });

  SJ.ScreensManager.currentScreen = SJ.ScreensManager.screens.mainMenu;

  SJ.ScreensManager._isSetupped = true;
}

SJ.ScreensManager.currentScreen = { draw: () => { console.log('No Screen selected!'); }};

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
