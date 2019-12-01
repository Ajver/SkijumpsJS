
SJ.Label = 
class {
  constructor(content, x, y, align=LEFT, vAlign=CENTER, fontSize=18, fontColor=color(255, 255, 255)) {
    this.x = x;
    this.y = y;
    this.content = content;
    this.align = align;
    this.vAlign = vAlign;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.isVisible = true;
  }

  draw() {
    push();
      textSize(this.fontSize);
      textAlign(this.align, this.vAlign);
      fill(this.fontColor);
      text(this.content, this.x, this.y);
    pop();
  }
  
  show() {
    this.isVisible = true;
  }
  
  hide() {
    this.isVisible = false;
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
    this.onMousePress = onMousePress || (() => {});
    this.onMouseRelease = onMouseRelease || (() => {});
    this.onMouseEnter = onMouseEnter || (() => {});
    this.onMouseLeave = onMouseLeave || (() => {});
    this.disabled = false;
    this.canStopMouse = true;
    this.isMouseIn = false;
    this.isPress = false;
    this.isVisible = true;

    if(overrideLabelDraw) {
      this.label.draw = () => {
        push();
          textSize(this.label.fontSize);
          textAlign(this.label.align, this.label.vAlign);
          text(this.label.content, this.label.x, this.label.y);
        pop();
      }
    }
  }

  draw() {
    push();
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
      rect(this.x, this.y, this.w, this.h);
      translate(this.x+this.w/2, this.y+this.h/2);

      if(this.disabled) {
        fill(60);
      }else {
        fill(0);
      }

      this.label.draw();
    pop();
  }

  show() {
    this.isVisible = true;
  }
  
  hide() {
    this.isVisible = false;
  }
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

SJ.TextWindow = 
class {
  constructor(x, y, txt, txtSize=16, textColor=color(255), bgColor=color(0, 10, 50)) {
    this.x = x;
    this.y = y;
    this.setTextSize(txtSize);
    this.setText(txt);
    this.textColor = textColor;
    this.bgColor = bgColor;
  }
  
  draw() {
    push();
      translate(this.x, this.y);
      fill(this.bgColor);
      stroke(255);
      rectMode(CORNER);
      rect(0, 0, this.w, this.h);

      textSize(this.textSize);  
      textAlign(CENTER, CENTER);
      fill(this.textColor);
      noStroke();
      text(this.text, this.w / 2, this.h / 2);
    pop();
  }

  setText(txt) {
    this.text = txt;
    const lines = txt.split(/\n/gm);
    textSize(this.textSize);
    let longestLineWidth = textWidth(lines[0]);
    for(let i=1; i<lines.length; i++) {
      const lineWidth = textWidth(lines[i]);
      if(lineWidth > longestLineWidth) {
        longestLineWidth = lineWidth;
      }
    }
    this.w = longestLineWidth + 20;
    this.h = lines.length * textLeading() + 20
  }

  setTextSize(textSize) {
    this.textSize = textSize;
  }
}

SJ.MouseFollowingPopup =
class {
  constructor(txt, txtSize=16, textColor=color(255), bgColor=color(0, 10, 50)) {
    this.isVisible = false;
    this.popup = new SJ.TextWindow(0, 0, txt, txtSize, textColor, bgColor);
  }

  draw() {
    push();
      const maxX = SJ.SCREEN_WIDTH - this.popup.w;
      const maxY = SJ.SCREEN_HEIGHT - this.popup.h;
      let x = max(min(maxX, SJ.mouseScreenX-this.popup.w/2), 0);
      let y = max(min(maxY, SJ.mouseScreenY-this.popup.h-10), 0);
      translate(x, y);
      this.popup.draw();
    pop();
  }
  
  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}

SJ.DrawableRect = 
class {
  constructor(x, y, w, h, col) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = col;
    this.mode = CORNER;
  }

  draw() {
    push();
      rectMode(this.mode);
      fill(this.color);
      noStroke();
      rect(this.x, this.y, this.w, this.h);
    pop();
  }
}

SJ.LabelWithBackground = 
class {
  constructor(txt, x, y, w, h, txtSize=16, col=color(255), bgColor=color(0), align=LEFT, vAlign=CENTER) {
    let lx = x; 
    let ly = y;

    switch(align) {
      case LEFT: lx += 10; break;
      case CENTER: lx += w/2; break;
      case RIGHT: lx += w-10; break;
    }
    switch(vAlign) {
      case TOP: ly += 10; break;
      case CENTER: ly += h/2; break;
      case BOTTOM: ly += h-10; break;
    }

    this.label = new SJ.Label(txt, lx, ly, align, vAlign, txtSize, col);
    this.rect = new SJ.DrawableRect(x, y, w, h, bgColor);
  }

  draw() {
    this.rect.draw();
    this.label.draw();
  }

}

SJ.WindDisplay =
class {
  constructor() {
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
class {
  constructor() {
    this.disp = new SJ.LabelWithBackground("Szybkość", SJ.SCREEN_WIDTH-100, 140, 100, 80, 16, color(255), color(0, 0, 80), LEFT, BOTTOM)
  }
  
  draw() {
    const jumperVel = SJ.jumper.body.velocity
    const jumperSpeed = floor(Matter.Vector.magnitude(jumperVel)*10.0)/10.0;
    this.disp.label.content = "Szybkość\n" + jumperSpeed + " m/s";
    this.disp.draw();
  }
}

SJ.HeightDisplay =
class {
  constructor() {
    this.disp = new SJ.LabelWithBackground("Wysokość", SJ.SCREEN_WIDTH-100, 220, 100, 60, 16, color(255), color(0, 0, 60), LEFT, BOTTOM)
  }
  
  draw() {
    var jumperHeight = 0;
    if(!SJ.jumper.body.isStatic) {
      const jumperPos = SJ.jumper.body.position;
      for(let i=1; i<PAD_COLLISION_POINTS.length; i++) {
        const p2 = PAD_COLLISION_POINTS[i];
        if(jumperPos.x <= p2.x) {
          const p1 = PAD_COLLISION_POINTS[i-1];
          const diffX = jumperPos.x - p1.x;
          const distX = p2.x - p1.x;
          const diffY = p2.y - p1.y;
          const k = distX / diffX;
          const yUnderJumper = p1.y + k * diffY;

          var jumperHeight = max(floor(yUnderJumper-SJ.jumper.body.position.y), 0);
          break;
        }
      }
    }

    this.disp.label.content = "Wysokość\n" + jumperHeight + " m";
    this.disp.draw();
  }
}

SJ.Popup =
class {
  constructor(w, h, drawable) {
    this.x = 0;
    this.y = 0;
    this.w = SJ.SCREEN_WIDTH;    
    this.h = SJ.SCREEN_HEIGHT;  
    this._drawable = drawable;

    this.isVisible = false;
    this.darkBackground = new SJ.DrawableRect(0, 0, SJ.SCREEN_WIDTH, SJ.SCREEN_HEIGHT, color(0, 0, 0, 200));
    this.bgRect = new SJ.DrawableRect(SJ.SCREEN_MIDDLE_X, SJ.SCREEN_MIDDLE_Y, w, h, color(50, 70, 140));
    this.bgRect.mode = CENTER;
    this.canStopMouse = true;
    this.onMousePress = (() => {});
    this.onMouseRelease = (() => {});
    this.onMouseEnter = (() => {});
    this.onMouseLeave = (() => {}); 
  }

  draw() {
    this.darkBackground.draw();
    this.bgRect.draw();
  }
  
  show() {
    this.isVisible = true;
    this._drawable.forEach(obj => {
      obj.show();
    });
  }

  hide() {
    this.isVisible = false;
    this._drawable.forEach(obj => {
      obj.hide();
    });
  }

}

SJ.PausePopup =
class {
  constructor() {
    const learnBtn = new SJ.Button("Samouczek", SJ.SCREEN_MIDDLE_X-100, 320, 200, 40, null, () => {
      print("Samouczek!");
    });
    learnBtn.disabled = true;
    
    const drawable = [
      new SJ.Button("Wznów", SJ.SCREEN_MIDDLE_X-100, 200, 200, 40, null, () => {
        SJ.main.setRunning(true);
      }),
      new SJ.Button("Powtórz skok", SJ.SCREEN_MIDDLE_X-100, 260, 200, 40, null, () => {
        SJ.main.setRunning(true);
        SJ.restartGame();
      }),
      learnBtn,
      new SJ.Button("Wróc do menu", SJ.SCREEN_MIDDLE_X-100, 380, 200, 40, null, () => {
        SJ.main.setRunning(true);
        SJ.backToMenu();
      }),
    ];
    
    this.popup = new SJ.Popup(300, 500, drawable);

    this.hide();
  }

  show() {
    this.popup.show();
  }

  hide() {
    this.popup.hide();
  }

}

SJ.JumpEndPopup =
class {
  constructor() {    
    this.scoreLabel = new SJ.Label("520", SJ.SCREEN_MIDDLE_X, 290, CENTER, TOP, 40)
    const drawable = [
      new SJ.Label("Koniec skoku", SJ.SCREEN_MIDDLE_X, 200, CENTER, TOP, 32),
      new SJ.Label("Zdobyte punkty:", SJ.SCREEN_MIDDLE_X, 260, CENTER, TOP, 24),
      this.scoreLabel,
      new SJ.Button("Powtórz skok", SJ.SCREEN_MIDDLE_X-100, 360, 200, 40, null, () => {
        this.hide();
        SJ.restartGame();
      }),
      new SJ.Button("Wróc do menu", SJ.SCREEN_MIDDLE_X-100, 420, 200, 40, null, () => {
        this.hide();
        SJ.backToMenu();
      }),
    ];
    
    this.popup = new SJ.Popup(300, 500, drawable);

    this.hide();
  }

  show() {
    this.scoreLabel.content = SJ.scoreCounter.score;
    this.popup.show();
  }

  hide() {
    this.popup.hide();
  }

}

//////////////////////////////////////////////////////////////////////

SJ.createLocationButton = (locationName, x, y, fileName) => {
  const btn = new SJ.Button(locationName, x, y, 200, 120);
  btn.label.fontSize = 18;
  btn.label.vAlign = BOTTOM;

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
  btn.label.vAlign = BOTTOM;

  btn.popup = new SJ.MouseFollowingPopup(item.description);

  btn.onMouseEnter = () => {
    btn.popup.show();
  }

  btn.onMouseLeave = () => {
    btn.popup.hide();
  }

  btn.onMouseRelease = () => {
    if(SJ.money < item.price) {
      return;
    }
    SJ.itemsManager.addItem(item);
    btn.disabled = true;
    SJ.money -= item.price;
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