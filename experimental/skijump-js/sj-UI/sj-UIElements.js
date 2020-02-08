
// All UI elements in one object
SJ.UI = {};

SJ.UI.MOUSE_MODE = {
  PASS: 0,
  TEST_AND_PASS: 1,
  TEST_AND_BLOCK: 2,
  BLOCK: 3
};

SJ.UI.Element =
class {
  constructor(x=0, y=0, w=0, h=0, onMousePress=null, onMouseRelease=null, onMouseEnter=null, onMouseLeave=null) {
    this.isVisible = true;
    this.parent = null;
    this.children = [];

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.mouseMode = SJ.UI.MOUSE_MODE.PASS;
    this.isMouseIn = false;
    this.isPress = false;

    if(onMousePress)    { this.onMousePress = onMousePress; }
    if(onMouseRelease)  { this.onMouseRelease = onMouseRelease; }
    if(onMouseEnter)    { this.onMouseEnter = onMouseEnter; }
    if(onMouseLeave)    { this.onMouseLeave = onMouseLeave; }
  }
  
  _draw() {
    if(!this.isVisible) {
      return;
    }

    push();
      translate(this.x, this.y);

      this.draw();

      this.forEachChild(child => {
        child._draw();
      });
    pop();
  }

  forEachChild(callback) {
    this.children.forEach(child => {
      callback(child);
    });
  }

  forEachChildReversed(callback) {
    for(let i=this.children.length-1; i>=0; i--) {
      const child = this.children[i];
      callback(child);
    }
  }
  
  addChild(drawable) {
    this.children.push(drawable);
    drawable.parent = this;
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  // Returns true when catched mouse
  // Returns false when ignored mouse
  _mouseMoved() {
    if(!this.isVisible) {
      return false;
    }

    if(this.disabled === true) {
      return false;
    }

    for(let i=this.children.length-1; i>=0; i--) {
      const child = this.children[i];
      if(child._mouseMoved()) {
        return true;
      }
    }

    switch(this.mouseMode) {
      case SJ.UI.MOUSE_MODE.TEST_AND_PASS:
      case SJ.UI.MOUSE_MODE.TEST_AND_BLOCK:
        if(this._isMouseIn()) {
          if(!this.isMouseIn) {
            this.isMouseIn = true;
            this.onMouseEnter();
            return this.mouseMode === SJ.UI.MOUSE_MODE.TEST_AND_BLOCK;
          }
        }else if(this.isMouseIn) {
          this.isMouseIn = false;
          this.onMouseLeave();
        }
        break;
      
      case SJ.UI.MOUSE_MODE.BLOCK:
        if(this._isMouseIn()) {
          return true;
        }
        break;
    }

    return false;
  }

  // Returns true when catched mouse
  // Returns false when ignored mouse
  _mousePressed() {
    if(!this.isVisible) {
      return false;
    }

    if(this.disabled === true) {
      return false;
    }

    for(let i=this.children.length-1; i>=0; i--) {
      const child = this.children[i];
      if(child._mousePressed()) {
        return true;
      }
    }

    switch(this.mouseMode) {
      case SJ.UI.MOUSE_MODE.TEST_AND_PASS:
      case SJ.UI.MOUSE_MODE.TEST_AND_BLOCK:
        if(this._isMouseIn()) {
          this.isPress = true;
          this.onMousePress();
          return this.mouseMode === SJ.UI.MOUSE_MODE.TEST_AND_BLOCK;
        }
        break;
      
      case SJ.UI.MOUSE_MODE.BLOCK:
        if(this._isMouseIn()) {
          return true;
        }
        break;
    }

    return false;
  }

  // Returns true when catched mouse
  // Returns false when ignored mouse
  _mouseReleased() {
    if(!this.isVisible) {
      return false;
    }

    if(this.disabled === true) {
      return false;
    }

    for(let i=this.children.length-1; i>=0; i--) {
      const child = this.children[i];
      if(child._mouseReleased()) {
        return true;
      }
    }
    
    switch(this.mouseMode) {
      case SJ.UI.MOUSE_MODE.TEST_AND_PASS:
      case SJ.UI.MOUSE_MODE.TEST_AND_BLOCK:
        if(this.isPress) {
          this.isPress = false;
          if(this._isMouseIn()) {
            this.onMouseRelease();
            return true;
          }
        }
        break;
      
      case SJ.UI.MOUSE_MODE.BLOCK:
        if(this._isMouseIn()) {
          return true;
        }
        break;
    }

    return false;
  }

  _isMouseIn() {
    return this.isPointIn(
      SJ.mouseScreenX,
      SJ.mouseScreenY
    );
  }

  isPointIn(x, y) {
    const globalPos = this.getGlobalPosition();

    return(x >= globalPos.x && 
      x < globalPos.x + this.w && 
      y >= globalPos.y &&
      y < globalPos.y + this.h);
  }

  getGlobalPosition() {
    const pos = {
      x: this.x,
      y: this.y
    };

    if(this.parent) {
      const parentPos = this.parent.getGlobalPosition();
      pos.x += parentPos.x;
      pos.y += parentPos.y;
    }

    return pos;
  }

  draw() {}
  onMousePress() {}
  onMouseRelease() {}
  onMouseEnter() {}
  onMouseLeave() {}
}

SJ.Label = 
class extends SJ.UI.Element {
  constructor(content, x, y, align=LEFT, vAlign=CENTER, fontSize=18, fontColor=color(255, 255, 255)) {
    super(x, y);
    this.content = content;
    this.align = align;
    this.vAlign = vAlign;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
  }

  draw() {
    push();
      textSize(this.fontSize);
      textAlign(this.align, this.vAlign);
      fill(this.fontColor);
      text(this.content, 0, 0);
    pop();
  }
}

SJ.Button = 
class extends SJ.UI.Element {
  constructor(caption, x, y, w, h, onMousePress, onMouseRelease, onMouseEnter, onMouseLeave, draw, overrideLabelDraw=false) {
    super(x, y, w, h, onMousePress, onMouseRelease, onMouseEnter, onMouseLeave);
    this.disabled = false;
    
    this.mouseMode = SJ.UI.MOUSE_MODE.TEST_AND_BLOCK;

    this.label = new SJ.Label(caption, 0, 0, CENTER, CENTER, h*0.6);
    
    if(overrideLabelDraw) {
      this.label.draw = () => {
        push();
          textSize(this.label.fontSize);
          textAlign(this.label.align, this.label.vAlign);
          text(this.label.content, this.label.x, this.label.y);
        pop();
      }
    }

    this.addChild(this.label);
  }

  draw() {
    if(this.disabled) {
      fill(37, 53, 64);
    }else {
      if(this.isMouseIn) {
        if(this.isPress) {
          fill(17, 91, 140);
        }else {
          fill(14, 143, 230);
        }
      }else {
        fill(10, 123, 199);
      }
    }

    rectMode(CORNER);
    rect(0, 0, this.w, this.h);
    translate(this.w/2, this.h/2);

    if(this.disabled) {
      fill(60);
    }else {
      fill(0);
    }
  }
}

SJ.Texture = 
class extends SJ.UI.Element {
  constructor(textureName, x, y, w=0, h=0, onload=null) {
    super(x, y, w, h);

    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.texture = SJ.ImageLoader.load(textureName, () => {
      this.w = this.texture.width; 
      this.h = this.texture.height;
      if(onload) {
        onload();
      }
    });
  }

  draw() {
    image(this.texture, 0, 0, this.w*this.scaleX, this.h*this.scaleY);
  }
}

SJ.TextWindow = 
class extends SJ.UI.Element {
  constructor(x, y, txt, txtSize=16, textColor=color(255), bgColor=color(0, 10, 50)) {
    super(x, y, 0, 0);

    this.textColor = textColor;
    this.bgColor = bgColor;
    
    this._setPadding(10, 10, 10, 10);
    this._setTextSize(txtSize);
    this._setText(txt);

    this._calculateSize()
  }
  
  draw() {
    push();
      fill(this.bgColor);
      stroke(255);
      rectMode(CORNER);
      rect(0, 0, this.w, this.h);

      textSize(this.textSize);  
      textAlign(LEFT, TOP);
      fill(this.textColor);
      noStroke();
      text(this.text, this._paddingLeft, this._paddingTop);
    pop();
  }

  _calculateSize() {
    const lines = this.text.split(/\n/gm);
    textSize(this.textSize);
    let longestLineWidth = textWidth(lines[0]);
    for(let i=1; i<lines.length; i++) {
      const lineWidth = textWidth(lines[i]);
      if(lineWidth > longestLineWidth) {
        longestLineWidth = lineWidth;
      }
    }
    this.w = longestLineWidth + this._paddingLeft + this._paddingRight;
    this.h = lines.length * this.textSize + this._paddingTop + this._paddingBottom;
  }

  setText(txt) {
    this._setText(txt);
    this._calculateSize();
  }

  _setText(txt) {
    this.text = txt;
  }

  setTextSize(txtSize) {
    _setTextSize(txtSize);
    this._calculateSize();
  }

  _setTextSize(txtSize) {
    this.textSize = txtSize;
  }

  setPadding(pLeft, pRight, pTop, pBottom) {
    this._setPadding(pLeft, pRight, pTop, pBottom);
    this._calculateSize();
  }

  _setPadding(pLeft, pRight, pTop, pBottom) {
    this._paddingLeft = pLeft;
    this._paddingRight = pRight;
    this._paddingTop = pTop;
    this._paddingBottom = pBottom;
  }
}

SJ.MouseFollowingPopup =
class extends SJ.UI.Element {
  constructor(txt, txtSize=16, textColor=color(255), bgColor=color(0, 10, 50)) {
    super();
    this.isVisible = false;
    this.popup = new SJ.TextWindow(0, 0, txt, txtSize, textColor, bgColor);
    this.children.push(this.popup);
  }

  draw() {
    const maxX = SJ.SCREEN_WIDTH - this.popup.w;
    const maxY = SJ.SCREEN_HEIGHT - this.popup.h;
    const x = max(min(maxX, SJ.mouseScreenX - this.popup.w/2), 0);
    const y = max(min(maxY, SJ.mouseScreenY - this.popup.h-10), 0);
    translate(x, y);
  }
}

SJ.DrawableRect = 
class extends SJ.UI.Element {
  constructor(x, y, w, h, col) {
    super(x, y, w, h);
    this.color = col;
    this.mode = CORNER;
  }

  draw() {
    push();
      rectMode(this.mode);
      fill(this.color);
      noStroke();
      rect(0, 0, this.w, this.h);
    pop();
  }
}

SJ.LabelWithBackground = 
class extends SJ.DrawableRect {
  constructor(txt, x, y, w, h, txtSize=16, col=color(255), bgColor=color(0), align=LEFT, vAlign=CENTER) {
    super(x, y, w, h, bgColor)

    let lx = 0; 
    let ly = 0;

    switch(align) {
      case LEFT: lx = 10; break;
      case CENTER: lx = w/2; break;
      case RIGHT: lx = w-10; break;
    }
    switch(vAlign) {
      case TOP: ly = 10; break;
      case CENTER: ly = h/2; break;
      case BOTTOM: ly = h-10; break;
    }

    this.label = new SJ.Label(txt, lx, ly, align, vAlign, txtSize, col);
    this.children.push(this.label)
  }
}

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
  constructor(screensManager) {
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