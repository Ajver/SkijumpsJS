
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
  constructor(texture, x, y, onload=null) {
    super(x, y);

    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.setTexture(texture, onload);
  }

  setTexture(texture, onload=null) {
    if(typeof texture === 'string') {
      this.texture = SJ.ImageLoader.load(texture, () => {
        this.w = this.texture.width; 
        this.h = this.texture.height;

        if(onload) {
          onload();
        }
      });
    }else {
      this.texture = texture;

      if(onload) {
        onload();
      }
    }
  }

  draw() {
    image(this.texture, 0, 0, this.w*this.scaleX, this.h*this.scaleY);
  }
}

SJ.AnimatedTexture =
class extends SJ.UI.Element {
  constructor(texturesArray, x, y, duration, onload=null) {
    super(x, y);
    this.animation = new SJ.Animation(this.texturesArray, duration, true, true, true);
    this.setTextures(texturesArray, onload);
  }
  
  setTextures(texturesArray, onload=null) {
    this.texturesArray = [];

    let loadedTextures = 0;

    texturesArray.forEach((textureName) => {
      if(typeof textureName === 'string') {
        SJ.ImageLoader.load(texture, () => {
          this.texturesArray.push(texture);
          
          if(onload) {
            loadedTextures++;
            if(loadedTextures >= texturesArray.length) {
              onload();
              
              // Prevent running onload second time
              loadedTextures = 0;
            }
          }
        });
      }else {
        this.texturesArray.push(textureName);
        if(onload) {
          loadedTextures++;
        }
      }
    });

    if(onload) {
      if(loadedTextures >= texturesArray.length) {
        onload();
      }
    }

    this.animation.frames = this.texturesArray;
  }

  draw() {
    this.animation.draw();
  }
}

SJ.AnimatedSpriteSheet =
class extends SJ.AnimatedTexture {
  constructor(ssName, x, y, duration, frameW, frameH, onload=null, offsetX=0, offsetY=0) {
    super([], x, y, duration, null);

    SJ.ImageLoader.load(ssName, (ss) => {
      this.setTextures(SJ.ImageLoader.divideSpriteSheet(ss, frameW, frameH, offsetX, offsetY), onload);
    });
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
