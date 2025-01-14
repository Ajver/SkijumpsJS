
SJ.CameraPath =
class {
    constructor(pathArray) {
        this._path = pathArray;
        this._currentIndex = 0;
    }

    setPathIndex(cameraX) {
        for(let i=1; i<this._path.length; i++) {
            if(cameraX < this._path[i].x) {
                this._pathIndex = i-1;
                break;
            }
        }
    }

    getExpectedY() {
        const jumperX = SJ.jumper.body.position.x;

        while(jumperX >= this._path[this._pathIndex+1].x && this._pathIndex < this._path.length-2) {
            this._pathIndex++;
        }

        const p1 = this._path[this._pathIndex];
        const p2 = this._path[this._pathIndex+1];
        const diffX = jumperX - p1.x;
        const distX = p2.x - p1.x; 
        const distY = p2.y - p1.y;
        const k = diffX / distX; 
        
        return p1.y + k * distY;
    }
    
  draw(lineColor) {
    push();
      strokeWeight(20);
      noStroke();
      fill(255, 0, 0);
      const p = this._path[0];
      circle(p.x, p.y, 40);
      for(let i=1; i<this._path.length; i++) {
        const p1 = this._path[i-1];
        const p2 = this._path[i];
        stroke(lineColor);
        line(p1.x, p1.y, p2.x, p2.y);
        noStroke();
        circle(p2.x, p2.y, 40);
      }
    pop();
  }
}