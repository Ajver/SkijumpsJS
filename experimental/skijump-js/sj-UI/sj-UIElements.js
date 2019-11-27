
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
