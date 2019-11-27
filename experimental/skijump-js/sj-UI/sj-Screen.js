
SJ.Screen = 
class {
  constructor(setup, draw) {
    this._drawable = [];
    this._buttons = [];
    this.draw = draw || this.draw;
    this.setBackgroundColor(color(10, 10, 50));
    setup(this);
  } 

  setBackgroundColor(bgColor) {
    this.backgroundColor = bgColor;
  }

  draw() {
    background(this.backgroundColor);

    this._drawable.forEach((obj) => {
      obj.draw();
    });
  }

  onMouseMove() {
    let stopMouse = false;

    this._buttons.forEach((btn) => {
      if(btn.disabled) {
        return;
      }

      if(this.isMouseInBtn(btn)) {
        if(!btn.isMouseIn) {
          btn.isMouseIn = true;
          btn.onMouseEnter();
          stopMouse = true;
          return;
        }
      }else if(btn.isMouseIn) {
        btn.isMouseIn = false;
        btn.onMouseLeave();
        stopMouse = true;
        return;
      }
    });
    
    return stopMouse;
  }
  
  onMousePress() {
    let stopMouse = false;

    this._buttons.forEach((btn) => {
      if(btn.disabled) {
        return;
      }
      
      if(this.isMouseInBtn(btn)) {
        btn.isPress = true;
        btn.onMousePress();
        stopMouse = true;
        return;
      }
    });

    return stopMouse;
  }

  onMouseRelease() {
    let stopMouse = false;

    this._buttons.forEach((btn) => {
      if(btn.disabled) {
        return;
      }
      
      if(btn.isPress) {
        btn.isPress = false;
        if(this.isMouseInBtn(btn)) {
          btn.onMouseRelease();
          stopMouse = true;
          return;
        }
      }
    });

    return stopMouse;
  }

  isMouseInBtn(btn) {
    return this.isMouseInRect(btn.x, btn.y, btn.w, btn.h);
  }

  isMouseInRect(x, y, w, h) {
    return(SJ.mouseScreenX >= x && 
      SJ.mouseScreenX < x + w && 
      SJ.mouseScreenY >= y &&
      SJ.mouseScreenY < y + h);
  }

  appendDrawable(obj) {
    this._drawable.push(obj);
  }

  appendButton(btn) {
    this._buttons.unshift(btn);
    this.appendDrawable(btn);
  }

}