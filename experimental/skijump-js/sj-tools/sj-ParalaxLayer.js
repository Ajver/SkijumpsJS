
SJ.ParalaxLayer =
class {
  constructor(scale, pos, imgNr) {
    this.camScale = scale;
    this.scale = 1.0;
    this.x = pos.x;
    this.y = pos.y;
    this.subrect = null;

    this._prepareData(imgNr);
  }

  _prepareData(idx) {
    const idxBg = SJ.V.texturesNames.background[idx];
    let imgName = "";
    if(typeof idxBg === "object") {
      imgName = idxBg.name;
      this.subrect = idxBg.subrect || null;
      if(idxBg.position) {
        this.x += idxBg.position.x;
        this.y += idxBg.position.y;
      }
      this.scale *= idxBg.scale || 1.0;
    }else if(typeof idxBg === "string") {
      imgName = idxBg;
    }else {
      print("Error, unexpected type of idxBg:", typeof idxBg);
    }
    
    this.img = SJ.ImageLoader.load(imgName);
  }

  draw(cameraPos) {
    push();
      translate(this.x-cameraPos.x*this.camScale, this.y-cameraPos.y*this.camScale);
      scale(this.scale);
      if(this.subrect) {
        image(this.img, 0, 0, this.subrect.w, this.subrect.h, this.subrect.x, this.subrect.y, this.subrect.w, this.subrect.h);
      }else {
        image(this.img, 0, 0);
      }
    pop();
  }
}