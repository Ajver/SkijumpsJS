
SJ.Label = 
class {
  constructor(content, x, y, aling=LEFT, vAling=CENTER, fontSize=18, fontColor=color(255, 255, 255)) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.aling = aling;
    this.vAling = vAling;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
  }

  draw() {
    push();
      textSize(this.fontSize);
      textAlign(this.aling, this.vAling);
      fill(this.fontColor);
      text(this.content, this.x, this.y);
    pop();
  }
}

SJ.Button = 
class {
  constructor(caption, x, y, w, h, onMousePress, onMouseRelease, onMouseEnter, onMouseLeave, draw, overrideLabelDraw=false) {
    this.label = new SJ.Label(caption, 0, 0, CENTER, CENTER, h*0.6);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isMouseIn = false;
    this.isPress = false;
    this.onMousePress = onMousePress || (() => {});
    this.onMouseRelease = onMouseRelease || (() => {});
    this.onMouseEnter = onMouseEnter || (() => {});
    this.onMouseLeave = onMouseLeave || (() => {});
    this.draw = draw || this.draw;
    this.disabled = false;

    if(overrideLabelDraw) {
      this.label.draw = () => {
        push();
          textSize(this.label.fontSize);
          textAlign(this.label.aling, this.label.vAling);
          text(this.label.content, this.label.x, this.label.y);
        pop();
      }
    }
  }

  draw() {
    if(this.disabled) {
      fill(160);
    }else {
      fill(100);
    }

    rect(this.x, this.y, this.w, this.h);
    push();
      translate(this.x+this.w/2, this.y+this.h/2);

      if(this.disabled) {
        fill(60);
      }else {
        fill(0);
      }

      this.label.draw();
    pop();  
  }
}

SJ.createLocationButton = (locationName, x, y, fileName) => {
  const btn = new SJ.Button(locationName, x, y, 200, 120);
  btn.label.fontSize = 18;
  btn.label.vAling = BOTTOM;

  btn.onMouseRelease = () => {
    SJ._startGame(fileName);
  }

  btn.draw = () => {
    push();
      fill(255, 128, 128);
      rect(btn.x, btn.y, btn.w, btn.h);
      push();
        translate(btn.x+btn.w/2, btn.y+btn.h-2);
        btn.label.draw();
      pop();
    pop();
  }

  return btn;
}

SJ.createItemButton = (x, y, item) => {
  const btn = new SJ.Button(item.itemName, x, y, 200, 120);
  btn.label.fontSize = 18;
  btn.label.vAling = BOTTOM;

  btn.onMouseRelease = () => {
    SJ.itemsManager.addItem(item);
    btn.disabled = true;
  }

  btn.draw = () => {
    push();
      if(btn.disabled) {
        fill(100);
      }else {
        fill(100, 80, 255);
      }
      rect(btn.x, btn.y, btn.w, btn.h);
      push();
        translate(btn.x+btn.w/2, btn.y+btn.h-2);
        if(btn.disabled) {
          fill(200);
        }else {
          fill(255);
        }
        btn.label.draw();
      pop();
    pop();
  }

  return btn;
}

SJ.Texture = 
class {
  constructor(textureName, x, y) {
    this.x = x;
    this.y = y;

    this.texture = SJ.ImageLoader.load(textureName, () => {
      this.w = this.texture.width; 
      this.h = this.texture.height;
    });
  }

  draw() {
    image(this.texture, this.x, this.y);
  }
}
