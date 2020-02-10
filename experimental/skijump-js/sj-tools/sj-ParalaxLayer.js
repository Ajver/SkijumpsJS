
SJ.ParalaxImage =
class {
  constructor(imgName, pos, scale, subrect) {
    this.img = SJ.ImageLoader.load(imgName);
    this.x = pos.x;
    this.y = pos.y;
    this.scale = scale;
    this.subrect = subrect;
  }

  draw() {
    push();
      translate(this.x, this.y);
      scale(this.scale);
      if(this.subrect) {
        image(this.img, 0, 0, this.subrect.w, this.subrect.h, this.subrect.x, this.subrect.y, this.subrect.w, this.subrect.h);
      }else {
        image(this.img, 0, 0);
      }
    pop();
  }
}

SJ.ParalaxLayer =
class {
  constructor(scale, pos, imgNr) {
    this.camScale = scale;
    this.scale = 1.0;
    this.x = pos.x;
    this.y = pos.y;
    this.images = [];

    this._prepareData(imgNr);
  }

  _prepareData(idx) {
    const idxBg = SJ.V.texturesNames.background[idx];
    if(typeof idxBg === "object") {
      if(idxBg.type === "array") {
        idxBg.array.forEach(img => {
          this._prepareImgFromObject(img);
        });
      }else {
        this._prepareImgFromObject(idxBg);
      }
    }else if(typeof idxBg === "string") {
      const pos = {
        x: 0,
        y: 0
      }
      this.images.push(new SJ.ParalaxImage(idxBg, pos, 1.0, null));
    }else {
      print("Error, unexpected type of idxBg:", typeof idxBg);
    }
  }

  _prepareImgFromObject(idxBg) {
    const subrect = idxBg.subrect || null;
    const imgPos = {
      x: 0,
      y: 0
    }
    if(idxBg.position) {
      imgPos.x += idxBg.position.x;
      imgPos.y += idxBg.position.y;
    }
    const scale = idxBg.scale || 1.0;

    this.images.push(new SJ.ParalaxImage(idxBg.name, imgPos, scale, subrect));
  }

  draw(cameraPos) {
    push();
      translate(this.x-cameraPos.x*this.camScale, this.y-cameraPos.y*this.camScale);
      this.images.forEach(img => {
        img.draw();
      });
    pop();
  }
}