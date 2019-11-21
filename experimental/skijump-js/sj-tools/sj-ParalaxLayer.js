
SJ.ParalaxLayer =
class {
  constructor(_scale, pos, img) {
    this.scale = _scale;
    this.img = img;
    this.x = pos.x;
    this.y = pos.y;
  }

  draw(cameraPos) {
    push();
      rectMode(CORNER);
      scale(this.scale);
      // image(this.img, this.x, this.y);
      fill(this.scale * 255, 0, 0, 70);
      rect(this.x+cameraPos.x, this.y+cameraPos.y, 10000, 5000);
    pop();
  }
}