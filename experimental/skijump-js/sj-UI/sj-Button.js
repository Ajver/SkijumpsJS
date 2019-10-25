
SJ.Button = 
class {
  constructor(x, y, w, h, onMousePress, onMouseRelease, onMouseEnter, onMouseLeave, draw) {
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
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

}