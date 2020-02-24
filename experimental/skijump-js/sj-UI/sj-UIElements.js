
SJ.WindDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();
    this.radius = 220;
    this.offset = 50;
    this.arrowImg = SJ.ImageLoader.load('arrow.png');
    this.rotate = 0;
  }

  draw() {
    push();
      fill(40, 70, 255);
      noStroke();
      translate(SJ.SCREEN_WIDTH, 0);
      circle(-this.offset, this.offset, this.radius);
      push();    
        translate(-60, 60);
        rotate(SJ.airSystem.angle);
        image(this.arrowImg, -40, -40, 80, 80);
      pop();
      fill(255);
      textAlign(CENTER);
      const airForce = SJ.airSystem.airForce;
      const decVal = floor((airForce*10) % 10);
      const roundedForce = floor(airForce);
      text(roundedForce+"."+decVal + " m/s", -this.offset-10, 130);
    pop();

    this.rotate += 0.1;
  }
}

SJ.SpeedDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();
    this.disp = new SJ.LabelWithBackground("Szybkość", SJ.SCREEN_WIDTH-100, 140, 100, 80, 16, color(255), color(0, 0, 80), LEFT, BOTTOM)
    this.addChild(this.disp);
  }
  
  draw() {
    const jumperVel = SJ.jumper.body.velocity
    const velMagn = Matter.Vector.magnitude(jumperVel) * 8.0;
    const jumperSpeed = floor(velMagn*10.0)/10.0;

    if(jumperSpeed > SJ.higherJumperSpeed) {
      SJ.higherJumperSpeed = jumperSpeed;
    }

    this.disp.label.content = "Szybkość\n" + jumperSpeed + " km/h";
  }
}

SJ.HeightDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();
    this.disp = new SJ.LabelWithBackground("Wysokość", SJ.SCREEN_WIDTH-100, 220, 100, 60, 16, color(255), color(0, 0, 60), LEFT, BOTTOM)
    this.addChild(this.disp);
  }
  
  draw() {
    var jumperHeight = 0;
    if(!SJ.jumper.body.isStatic) {
      const jumperX = SJ.jumper.body.position.x;
      for(let i=1; i<SJ.V.padCollisionPoints.length; i++) {
        const p2 = SJ.V.padCollisionPoints[i];
        if(jumperX <= p2.x) {
          const p1 = SJ.V.padCollisionPoints[i-1];
          const diffX = jumperX - p1.x;
          const distX = p2.x - p1.x;
          const diffY = p2.y - p1.y;
          const k = diffX / distX;
          const yUnderJumper = p1.y + k * diffY;

          const heightInPixels = yUnderJumper - SJ.jumper.body.position.y;
          const heightInMeters = heightInPixels * SJ.scoreCounter.PIXELS_TO_METERS;

          if(heightInMeters > SJ.higherJumperHeight) {
            SJ.higherJumperHeight = heightInMeters;
          } 

          jumperHeight = max(floor(heightInMeters), 0);
          break;
        }
      }
    }

    this.disp.label.content = "Wysokość\n" + jumperHeight + " m";
  }
}

SJ.ItemBox = 
class extends SJ.UI.Element {
  constructor(item, x, y, w, h) {
    super(x, y, w, h);
    this.item = item;

    if(this.item.isActiveItem) {
      this._fill = () => {
        if(this.item.isActive) {
          this.img = this.item.imgActive;
        }else {
          if(this.item.disabled) {
            this.img = this.item.imgDisabled;
          }else {
            this.img = this.item.img;
          }
        }
      }
    }else {
      this.img = this.item.img;
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(w, h) {
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
      translate(this.x, this.y);
      rectMode(CORNER);

      this._fill();
      image(this.img, 0, 0, this.w, this.h);
    pop();
  }

  _fill() {
    fill(50, 50, 180);
  }
}

SJ.ItemsDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();
    this._itemsBoxes = [];
  }

  updateItemsList() {
    this._itemsBoxes = [];
    
    const boxWidth = 48;
    const xSeparator = boxWidth + 16;
    const itemsCount = SJ.itemsManager.getItemsCount();
    const allItemsWidth = (itemsCount-1)*xSeparator + boxWidth;
    let boxX = SJ.SCREEN_MIDDLE_X - (allItemsWidth/2); 
    const boxY = SJ.SCREEN_HEIGHT - 64; 
    
    SJ.itemsManager._activeItems.forEach((item) => {
      this._itemsBoxes.push(new SJ.ItemBox(item, boxX, boxY, boxWidth, boxWidth));
      boxX += xSeparator;
    });

    SJ.itemsManager._items.forEach((item) => {
      this._itemsBoxes.push(new SJ.ItemBox(item, boxX, boxY, boxWidth, boxWidth));
      boxX += xSeparator;
    });
  }

  draw() {
    push();
      fill(0, 0, 50);
      rect(100, SJ.SCREEN_HEIGHT-80, SJ.SCREEN_WIDTH-200, 80);
    pop();

    this._itemsBoxes.forEach((itemBox) => {
      itemBox.draw();
    });
  }
}

SJ.Popup =
class extends SJ.DrawableRect {
  constructor(w, h, drawable) {
    super(0, 0, SJ.SCREEN_WIDTH, SJ.SCREEN_HEIGHT, color(0, 0, 0, 200));
    this.isVisible = false;
    this.mouseMode = SJ.UI.MOUSE_MODE.BLOCK;

    this.bgRect = new SJ.DrawableRect(SJ.SCREEN_MIDDLE_X, SJ.SCREEN_MIDDLE_Y, w, h, color(50, 70, 140));
    this.bgRect.mode = CENTER;
    this.addChild(this.bgRect);

    drawable.forEach(el => {
      this.addChild(el);
    });
  }
}

SJ.PausePopup =
class extends SJ.Popup {
  constructor() {
    const learnBtn = new SJ.Button("Samouczek", SJ.SCREEN_MIDDLE_X-100, 320, 200, 40, null, () => {
      print("Samouczek!");
    });

    super(300, 500, [
      new SJ.Button("Wznów", SJ.SCREEN_MIDDLE_X-100, 200, 200, 40, null, () => {
        SJ.main.setRunning(true);
      }),
      new SJ.Button("Powtórz skok", SJ.SCREEN_MIDDLE_X-100, 260, 200, 40, null, () => {
        SJ.restartGame();
      }),
      learnBtn,
      new SJ.Button("Wróc do menu", SJ.SCREEN_MIDDLE_X-100, 380, 200, 40, null, () => {
        SJ.ScreensManager.screens.game.pausePopup.hide();
        SJ.backToMenu();
      }),
    ]);

    learnBtn.disabled = true;
  }
}

SJ.JumpEndPopup =
class extends SJ.Popup {
  constructor() {
    super(300, 500, [
      new SJ.Label("Koniec skoku", SJ.SCREEN_MIDDLE_X, 200, CENTER, TOP, 32),
      new SJ.Label("Zdobyte punkty:", SJ.SCREEN_MIDDLE_X, 255, CENTER, TOP, 24),
      new SJ.Button("Powtórz skok", SJ.SCREEN_MIDDLE_X-100, 360, 200, 40, null, () => {
        this.hide();
        SJ.ratersDisplay.hide();
        SJ.restartGame();
      }),
      new SJ.Button("Wróc do menu", SJ.SCREEN_MIDDLE_X-100, 420, 200, 40, null, () => {
        this.hide();
        SJ.ratersDisplay.hide();
        SJ.backToMenu();
      }),
    ]);
    this.color = color(0, 0, 0, 0);
    
    this.scoreLabel = new SJ.Label("520", SJ.SCREEN_MIDDLE_X, 290, CENTER, TOP, 40)
    this.addChild(this.scoreLabel);
    this.addChild(SJ.ratersDisplay);
    this.addChild(SJ.jumpDataDisplay);
  }

  show() {
    super.show();

    SJ.ratersDisplay.show();
    SJ.jumpDataDisplay.show();

    this.scoreLabel.content = SJ.scoreCounter.score;
  }
}

SJ.RaterBox =
class extends SJ.LabelWithBackground {
  constructor(titleText, label, x, y, w, h) {
    super(label, x, y, w, h);

    this.color = color(40, 50, 120);
    this.mouseMode = SJ.UI.MOUSE_MODE.TEST_AND_PASS;

    this.title = new SJ.MouseFollowingPopup(titleText);
  }
  
  onMouseEnter() {
    this.title.show();
  }

  onMouseLeave() {
    this.title.hide();
  }

}

SJ.RatersDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();

    this._ratersBoxes = [];

    const boxesX = SJ.SCREEN_WIDTH - 400;
    let boxY = 200;
    const ySeparator = 40;

    this.label = new SJ.Label("Oceny sędziów", boxesX, boxY, LEFT, TOP, 24);

    const ratersTitles = [
      "Ocena za wybicie",
      "Ocena za stabilność lotu",
      "Ocena za gwałtowność obracania się",
      "Ocena za długość skoku",
      "Ocena za lądowanie"
    ];

    for(let i=0; i<5; i++) {
      const raterBox = new SJ.RaterBox(ratersTitles[i], "17.5", boxesX, boxY+=ySeparator, 100, 35);
      this._ratersBoxes.push(raterBox);
      this.addChild(raterBox);
    }

    this.addChild(this.label);
  }

  addRatersBoxesTitlesToScreensManager(screensManager) {
    this._ratersBoxes.forEach(raterBox => {
      screensManager.appendDrawable(raterBox.title);
    });
  }

  show() {
    let i = 0;
    SJ.scoreCounter.forEachRaters((rater) => {
      const raterBox = this._ratersBoxes[i++];
      raterBox.label.content = rater.getScore();
    });

    this.isVisible = true;
  }

}

SJ.JumpDataBox =
class extends SJ.LabelWithBackground {
  constructor(titleText, label, x, y, w, h) {
    super(label, x, y, w, h, 16, color(255), color(0), RIGHT);
    this.titleText = titleText;
    this.setData("");
    this.color = color(40, 50, 120);
  }

  setData(data) {
    this.label.content = this.titleText + '\n' + data;
  }
}

SJ.JumpDataDisplay =
class extends SJ.UI.Element {
  constructor() {
    super();

    this._dataBoxes = [];

    const boxesX = SJ.SCREEN_MIDDLE_X - 400;
    let boxY = 170;
    const boxW = 200;
    const boxH = 65;
    const ySeparator = 70;

    this.label = new SJ.Label("Parametry skoku", boxesX+boxW, boxY+30, RIGHT, TOP, 24);
    this.addChild(this.label);

    const dataTitles = [
      "Długość skoku",
      "Maksymalna prędkość",
      "Maksymalna wysokość"
    ];

    for(let i=0; i<3; i++) {
      const dataBox = new SJ.JumpDataBox(dataTitles[i], "", boxesX, boxY+=ySeparator, boxW, boxH);
      this._dataBoxes.push(dataBox);
    }

    this._dataBoxes.forEach(dataBox => {
      this.addChild(dataBox);
    });
  }

  show() {
    this._dataBoxes[0].setData(round(SJ.scoreCounter.mettersDistTo_K*10.0)/10.0 + " m");
    this._dataBoxes[1].setData(round(SJ.higherJumperSpeed*10.0)/10.0 + " km/h");
    this._dataBoxes[2].setData(round(SJ.higherJumperHeight*10.0)/10.0 + " m");
    
    this.isVisible = true;
  }
}


//////////////////////////////////////////////////////////////////////

SJ.createLocationButton = (locationName, x, y, fileName) => {
  const btn = new SJ.Button(locationName, x, y, 200, 120);
  btn.label.fontSize = 18;
  btn.label.vAlign = BOTTOM;
  btn.label.x = btn.w/2;
  btn.label.y = btn.h-2;

  btn.onMouseRelease = () => {
    SJ._startGame(fileName);
  }

  btn.draw = () => {
    push();
      if(btn.disabled) {
        fill(64, 57, 57);
      }else {
        if(btn.isMouseIn) {
          if(btn.isPress) {
            fill(158, 55, 55);
          }else {
            fill(224, 130, 130);
          }
        }else {
          fill(196, 94, 94);
        }
      }
      rect(0, 0, btn.w, btn.h);
    pop();
  }

  return btn;
}

SJ.createItemButton = (x, y, item) => {
  const btn = new SJ.Button(item.itemName, x, y, 200, 120);
  btn.label.fontSize = 18;
  btn.label.vAlign = BOTTOM;
  btn.label.x = btn.w/2;
  btn.label.y = btn.h-2;

  btn.popup = new SJ.MouseFollowingPopup(item.description);

  btn.onMouseEnter = () => {
    btn.popup.show();
  }

  btn.onMouseLeave = () => {
    btn.popup.hide();
  }

  btn.onMouseRelease = () => {
    if(SJ.playerData.money < item.price) {
      return;
    }
    SJ.itemsManager.addItem(item);
    btn.disabled = true;
    SJ.playerData.money -= item.price;
    btn.popup.hide();
  }

  btn.draw = () => {
    push();
      if(btn.disabled) {
        fill(24, 150, 49);
      }else {
        if(btn.isMouseIn) {
          if(btn.isPress) {
            fill(25, 49, 115);
          }else {
            fill(46, 95, 230);
          }
        }else {
          fill(32, 76, 199);
        }
      }
      
      rect(0, 0, btn.w, btn.h);
      image(item.img, (btn.w-48)/2, 20);
    pop();
  }

  return btn;
}