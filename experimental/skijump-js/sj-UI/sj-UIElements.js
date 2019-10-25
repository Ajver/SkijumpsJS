
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
  constructor(caption, x, y, w, h, onMousePress, onMouseRelease, onMouseEnter, onMouseLeave, draw) {
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
  }

  draw() {
    fill(128);
    rect(this.x, this.y, this.w, this.h);
    push();
      translate(this.x+this.w/2, this.y+this.h/2);
      this.label.draw();
    pop();  
  }
}