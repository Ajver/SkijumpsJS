
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
    push();
      background(this.backgroundColor);

      for(let i=this._drawable.length-1; i>=0; i--) {
        const obj = this._drawable[i];
        obj._draw();
      }
    pop();
  }

  onMouseMove() {
    for(let i=0; i<this._drawable.length; i++) {
      const obj = this._drawable[i];

      if(!obj.canStopMouse) {
        continue;
      }

      if(obj.disabled === true) {
        continue;
      }

      if(obj.isVisible === false) {
        continue;
      }

      if(this.isMouseInBtn(obj)) {
        if(!obj.isMouseIn) {
          obj.isMouseIn = true;
          obj.onMouseEnter();
          return true;
        }
      }else if(obj.isMouseIn) {
        obj.isMouseIn = false;
        obj.onMouseLeave();
        return true;
      }
    }
    
    return false;
  }
  
  onMousePress() {
    for(let i=0; i<this._drawable.length; i++) {
      const obj = this._drawable[i];

      if(!obj.canStopMouse) {
        continue;
      }

      if(obj.disabled === true) {
        continue;
      }
      
      if(obj.isVisible === false) {
        continue;
      }

      if(this.isMouseInBtn(obj)) {
        obj.isPress = true;
        obj.onMousePress();
        return true;
      }
    }

    return false;
  }

  onMouseRelease() {
    for(let i=0; i<this._drawable.length; i++) {
      const obj = this._drawable[i];

      if(!obj.canStopMouse) {
        continue;
      }

      if(obj.disabled === true) {
        continue;
      }
      
      if(obj.isVisible === false) {
        continue;
      }

      if(obj.isPress) {
        obj.isPress = false;
        if(this.isMouseInBtn(obj)) {
          obj.onMouseRelease();
          return true;
        }
      }
    }

    return false;
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