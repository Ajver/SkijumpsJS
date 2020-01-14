
SJ.ParalaxLayer =
class {
  constructor(_scale, pos, imgNr) {
    this.scale = _scale;
    this.img = SJ.ImageLoader.load(SJ.V.texturesNames.background[imgNr]);
    this.x = pos.x;
    this.y = pos.y;
  }

  draw(cameraPos) {
    push();
      rectMode(CORNER);
      // scale(this.scale);
      // translate(this.x, this.y)
      image(this.img, this.x-cameraPos.x*this.scale, this.y-cameraPos.y*this.scale);//this.x
      // fill(this.scale * 255, 0, 0, 70);
      // rect(this.x+cameraPos.x, this.y+cameraPos.y, 10000, 5000);
    pop();
  }
}