
SJ.UI =
class {
  constructor() {
    this._scoreLabel;
    this._messageLabel;
    this._airAngle;  
    this.updateScoreLabel(0);
    this.updateAirAngle(0);

    this.pauseBtn = new SJ.Button(10, 10, 100, 25, 
    () => {
      this.pauseBtn.r = 255; 
    }, 
    () => {
      this.pauseBtn.r = 128;
    },
    () => { 
      this.pauseBtn.r = 128;
    },
    () => { 
      this.pauseBtn.r = 0;
    },
    () => {
      fill(this.pauseBtn.r, 0, 0);
      rect(this.pauseBtn.x, this.pauseBtn.y, this.pauseBtn.w, this.pauseBtn.h);
    });

    this.pauseBtn.r = 0;

    this._buttons = [];
    this._buttons.unshift(this.pauseBtn);
  }

  onMouseMove() {
    let stopMouse = false;

    this._buttons.forEach((btn) => {
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

  draw() {
    push();
      stroke(255);
      fill(0);
      textSize(32);
      //noSmooth();
      
      text(this._scoreLabel, SJ.SCREEN_WIDTH-240, 40);

      textAlign(CENTER);
      text(this._messageLabel, SJ.SCREEN_WIDTH*0.5, SJ.SCREEN_HEIGHT-40);

      push();
        translate(80, 80);
        strokeWeight(4);
        fill(0);
        const vec = SJ.airSystem.getVectorFromAngle(this._airAngle, 60);
        const force = floor(SJ.airSystem.airForce * 10) / 10;
        stroke(0);
        line(-vec.x, -vec.y, vec.x, vec.y);
        circle(vec.x, vec.y, 10);
        
        strokeWeight(1);
        textSize(16);
        text("F: "+force, 0, 80);
      pop();

      rectMode(CORNER);
      this._buttons.forEach((btn) => {
        btn._draw();
      });

    pop()
  }

  updateScoreLabel(score) {
    this._scoreLabel = "Score: " + score;
  }

  updateMessageLabel(message) {
    this._messageLabel = message;
  }

  updateAirAngle(angle) {
    this._airAngle = angle;
  }

}