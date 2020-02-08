
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
      if(obj._mouseMoved()) {
        return true;
      }
    }
    
    return false;
  }
  
  onMousePress() {
    for(let i=0; i<this._drawable.length; i++) {
      const obj = this._drawable[i];
      if(obj._mousePressed()) {
        return true;
      }
    }
    
    return false;
  }

  onMouseRelease() {
    for(let i=0; i<this._drawable.length; i++) {
      const obj = this._drawable[i];
      if(obj._mouseReleased()) {
        return true;
      }
    }

    return false;
  }

  appendDrawable(obj) {
    this._drawable.push(obj);
  }

  appendButton(btn) {
    this._buttons.unshift(btn);
    this.appendDrawable(btn);
  }

}