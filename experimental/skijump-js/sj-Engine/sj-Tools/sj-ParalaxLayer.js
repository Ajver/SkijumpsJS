
SJ.ParalaxObject =
class {
  constructor(pos, scale) {
    this.x = pos.x;
    this.y = pos.y;
    this.scale = scale;
  }

  draw() {
    push();
      translate(this.x, this.y);
      scale(this.scale);
      this._drawSelf();
    pop();
  }

  _drawSelf() {}
}

SJ.ParalaxImage =
class extends SJ.ParalaxObject {
  constructor(imgName, pos, scale, subrect) {
    super(pos, scale);
    this.img = SJ.ImageLoader.load(imgName);
    this.subrect = subrect;
  }

  _drawSelf() {
    if(this.subrect) {
      image(this.img, 0, 0, this.subrect.w, this.subrect.h, this.subrect.x, this.subrect.y, this.subrect.w, this.subrect.h);
    }else {
      image(this.img, 0, 0);
    }
  }
}

SJ.ParalaxSpriteSheet =
class extends SJ.ParalaxObject {
  constructor(ssName, pos, scale, ssData) {
    super(pos, scale);

    this.animation = new SJ.Animation([], ssData.duration, true, true, true);
    
    const ss = new SJ.SpriteSheet(ssName, ssData.frameW, ssData.frameH, () => {
      const frames = [];

      ssData.animation.forEach(idx => {
        frames.push(ss.frames[idx]);
      });
  
      this.animation.frames = frames;
    }, ssData.offsetX||0, ssData.offsetY||0);
  }

  _drawSelf() {
    this.animation.draw();
  }
}

SJ.ParalaxLayer =
class {
  constructor(scale, pos, data) {
    this.camScale = scale;
    this.scale = 1.0;
    this.x = pos.x;
    this.y = pos.y;
    this.images = [];

    this._prepareData(data);
  }

  _prepareData(data) {
    if(typeof data === "object") {
      if(data.type === "array") {
        data.array.forEach(img => {
          this._prepareImgFromObject(img);
        });
      }else {
        this._prepareImgFromObject(data);
      }
    }else if(typeof data === "string") {
      this.images.push(new SJ.ParalaxImage(data, { x: 0, y: 0 }, 1.0, null));
    }else {
      print("Error, unexpected type of data:", typeof data);
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

    let obj = idxBg.spritesheet ?
      new SJ.ParalaxSpriteSheet(idxBg.name, imgPos, scale, idxBg.spritesheet) :
      new SJ.ParalaxImage(idxBg.name, imgPos, scale, subrect);

    this.images.push(obj);
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