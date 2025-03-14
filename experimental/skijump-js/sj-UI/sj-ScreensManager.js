
SJ.on.preload(() => {

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

  const backBtn = new SJ.Button("Wróć", 20, SJ.SCREEN_HEIGHT-60, 200, 40, null, () => {
    SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.mainMenu);
  });

  SJ.ScreensManager.screens.mainMenu = new SJ.Screen((self) => {
    const btnW = 300;
    const btnH = 50; 
    const startY = SJ.SCREEN_HEIGHT * 0.5;
    const btnX = SJ.SCREEN_MIDDLE_X - btnW/2;
    const ySeparation = btnH + 20; 

    const bgTexture = new SJ.Texture("Menu/menubg.gif", 0, 0, () => {
      const scale = SJ.SCREEN_WIDTH / bgTexture.w;
      bgTexture.scaleX = scale;
      bgTexture.scaleY = scale;
    });
    self.appendDrawable(bgTexture);

    SJ.ImageLoader.load("TitanBase/Drone/dron_idle.png", (ss) => {
      const ssTex = SJ.ImageLoader.divideSpriteSheet(ss, 64, 116);
      self.appendDrawable(
        new SJ.AnimatedTexture([
          ssTex[0],
          ssTex[1],
          ssTex[2],
          ssTex[1],
        ], 800, 390, 1200)
      );
    });

    self.appendDrawable(
      new SJ.Button("SKACZ", btnX, startY, btnW, btnH, null, () => {
        SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.selectLocation);
      }));
      
    self.appendDrawable(
      new SJ.Button("SKLEP", btnX, startY+ySeparation, btnW, btnH, null, () => {
        SJ.ScreensManager.changeScreen(SJ.ScreensManager.screens.shop);
      }));
      
    self.appendDrawable(
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

    self.appendDrawable(backBtn);

    const xSeparation = 235;
    const locations = [
      [ "Cyber City", "CyberCity" ],
      [ "Titan Base", "TitanBase" ],
      [ "Star Station", "StarStation" ],
      [ "Alien Colony", "AlienColony" ],
      [ "Planeta X", "PlanetX" ],
      [ "Szczyrk", "Szczyrk" ],
      [ "Oberstdorf", "Oberstdorf" ]
    ]

    for(let i = 0; i < locations.length/5; i++) {
      for(let j = 0; j < 5; j++){
        if(5*i+j > locations.length - 1) break;

        const loc = locations[j+5*i];
        const btn = SJ.createLocationButton(loc[0], 30+xSeparation*j, 200*(i+1), loc[1]);

        self.appendDrawable(btn);
      }
      
      
      // if(i > 2) {
      //   btn.disabled = true;
      // }
    }

    self.appendDrawable(
      new SJ.Label("Wybierz lokację", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });

  SJ.ScreensManager.screens.shop = new SJ.Screen((self) => {

    const xSeparation = 235;
    const ySeparation = 160;
    const jetPackItem = new SJ.ActiveItem("JetPack", "jetPack.png", "Jet pack wspomagający lot", 200, () => {
      if(SJ.jumper.state == SJ.jumper.S.FLYING) {
        SJ.jumper.accelerateWithForce(SJ.V.jumperJumpForce);
        return true;
      }

      return false;
    });
    jetPackItem.afterActivate = () => {
      jetPackItem.isActive = false;
      jetPackItem.disabled = true;
    }

    const items = [
      new SJ.Item("Narty", "skis.png", "padFriction", 0.85, "Super narty zmniejszające tarcie o 15%", 80),
      new SJ.Item("Buty", "boots.png", "jumperJumpForce", 1.2, "Buty zwiększające siłę wybicia o 20%", 100),
      new SJ.Item("Skrzydła", "wings.png", "airDensity", 0.9, "Małe skrzydełka zwiększające siłę nośną o 10%", 110),
      new SJ.Item("Opływowy kombinezon", "suit.png", "airFriction", 0.9, "Kombinezon o bardziej opływowym kształcie\nzmniejszający opory powietrza o 10%", 140),
      new SJ.Item("Stabilizator lotu", "stabiliser.png", "airRotateForce", 0.7, "Wszczep pomagający utrzymać dobrą\npozycję przy silnym wietrze o 30%", 200),
      new SJ.Item("Wspomagacz lądowania", "landingHelper.png", "goodLandingAngle", 1.5, "Wszczep wspomagający lądowanie\npod złym kątem o 50%", 160),
      jetPackItem,
    ];

    const itemsBtn = []; 

    // Drawing buttons in grid 5x[some rows count]
    let yPos = 200;
    let drawedItems = 0;
    let itemsCount = min(items.length, 5);
    while(itemsCount > 0) {
      for(let i=0; i<itemsCount; i++) {
        const btn = SJ.createItemButton(30+xSeparation*i, yPos, items[drawedItems]);
        self.appendDrawable(btn);
        itemsBtn.push(btn);
        drawedItems++;
      }
      yPos += ySeparation;
      itemsCount = min(items.length - drawedItems, 5);
    }

    itemsBtn.forEach(itemBtn => {
      self.appendDrawable(itemBtn.popup);
    }); 
    
    self.appendDrawable(backBtn);

    self.appendDrawable(
      new SJ.Label("Sklep", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

    const moneyLabel = new SJ.Label("", SJ.SCREEN_WIDTH-350, SJ.SCREEN_HEIGHT-20, LEFT, BOTTOM, 32, color(252, 251, 179));
    moneyLabel.draw = () => {
      push();
        textSize(moneyLabel.fontSize);
        textAlign(moneyLabel.aling, moneyLabel.vAling);
        fill(moneyLabel.fontColor);
        text("Pieniądze: "+SJ.playerData.money, moneyLabel.x, moneyLabel.y);
      pop();
    };
    self.appendDrawable(moneyLabel);
    
  });

  SJ.ScreensManager.screens.howToPlay = new SJ.Screen((self) => {

    self.appendDrawable(new SJ.Texture('how_to_play.png', SJ.SCREEN_MIDDLE_X-250, 250));

    self.appendDrawable(backBtn);

    self.appendDrawable(
      new SJ.Label("Jak grać?", SJ.SCREEN_MIDDLE_X, 80, CENTER, TOP, 64)
    );

  });
  
  SJ.ScreensManager.screens.game = new SJ.Screen((self) => {
    
    self.setBackgroundColor(color(0, 0, 0, 0));

    SJ.jumpDataDisplay = new SJ.JumpDataDisplay();

    SJ.ratersDisplay = new SJ.RatersDisplay();

    SJ.jumpEndPopup = new SJ.JumpEndPopup();
    self.appendDrawable(SJ.jumpEndPopup);
    SJ.ratersDisplay.addRatersBoxesTitlesToScreensManager(self);

    SJ.itemsDisplay = new SJ.ItemsDisplay();
    self.appendDrawable(SJ.itemsDisplay);

    const pauseBtn = new SJ.Button("Pauza", 0, 0, 160, 40, null, () => {
      SJ.main.setRunning(false);
    });

    pauseBtn.label.fontSize = 24;
    self.appendDrawable(pauseBtn);

    self.appendDrawable(
      new SJ.LabelWithBackground(SJ.playerData.nick, SJ.SCREEN_MIDDLE_X-150, 0, 150, 40, 16, color(255), color(0, 0, 100))
    );
    self.appendDrawable(
      new SJ.LabelWithBackground(SJ.playerData.positionInLeaderboard, SJ.SCREEN_MIDDLE_X, 0, 50, 40, 16, color(255), color(0, 0, 60))
    );
    self.appendDrawable(
      new SJ.LabelWithBackground(SJ.playerData.highScore + "pkt.", SJ.SCREEN_MIDDLE_X+50, 0, 100, 40, 16, color(255), color(0, 0, 60))
    );
    
    self.appendDrawable(new SJ.SpeedDisplay());
    self.appendDrawable(new SJ.HeightDisplay());

    self.appendDrawable(new SJ.WindDisplay());
    
    self.pausePopup = new SJ.PausePopup();
    self.appendDrawable(self.pausePopup);
    
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

});