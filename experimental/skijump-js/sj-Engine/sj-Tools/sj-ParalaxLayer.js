
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
SJ.ParalaxKeyFrames=
class extends SJ.ParalaxObject {
  constructor(keyFrames,pos,subrect,scale,pointsToTrack,lerpSens,moveTo,moveDuration){
    super(pos,1.0);

    const frames = [];
    const framesDurationTimes = [];
    const framesTimesFromBeginOfAnimation = [];
    const framesTranslates = [];
    const subrects = [];
    const framesScales = [];

    let wholeAnimationDuration = 0;

    const emptyImage = createImage(1,1);
    let translate = {
      x: 0,
      y: 0
    }

    keyFrames.forEach(frameId => {
      if(frameId.frameSourceImage != null)
        frames.push(SJ.ImageLoader.load(frameId.frameSourceImage));
      else
        frames.push(emptyImage);


      if(frameId.subrect)
        subrects.push(frameId.subrect);
      else
        subrects.push(null);

      framesDurationTimes.push(frameId.frameDuration);
      framesTimesFromBeginOfAnimation.push(wholeAnimationDuration);
      wholeAnimationDuration+=frameId.frameDuration;

      if(frameId.translate)
        translate = frameId.translate;
      framesTranslates.push(translate);

      if(frameId.scale)
        framesScales.push(frameId.scale);
      else
        framesScales.push(scale);
        
    });

    this.animation = new SJ.KeyFramesAnimation(frames,framesDurationTimes,framesTranslates,framesTimesFromBeginOfAnimation,subrects,framesScales,pointsToTrack,lerpSens,moveTo,moveDuration,wholeAnimationDuration,scale,true,true,true);
    
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

      if(data.followScale !== undefined) {
        this.camScale *= data.followScale;
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

    let obj;

    if(idxBg.spritesheet)
      obj = new SJ.ParalaxSpriteSheet(idxBg.name, imgPos, scale, idxBg.spritesheet);
    else if(idxBg.pointsToTrack && idxBg.keyFrames) {
      const trackingKeyFrames = new SJ.ParalaxKeyFrames(idxBg.keyFrames,imgPos,idxBg.subrect,scale,idxBg.pointsToTrack,idxBg.lerpSens,null,null);
      SJ.main.appendDrawable(trackingKeyFrames);
    }
    else if(idxBg.moveTo && idxBg.moveDuration && idxBg.keyFrames){
      // const movingKeyFrames = new SJ.ParalaxKeyFrames(idxBg.keyFrames,imgPos,idxBg.subrect,scale,null,idxBg.move,idxBg.moveDuration);
      obj = new SJ.ParalaxKeyFrames(idxBg.keyFrames,imgPos,idxBg.subrect,scale,null,idxBg.moveTo,idxBg.moveDuration);
      // SJ.main.appendDrawable(movingKeyFrames);
    }
    else if(idxBg.keyFrames)
      obj = new SJ.ParalaxKeyFrames(idxBg.keyFrames,imgPos,idxBg.subrect,scale,null,null,null,null);
    else
      obj = new SJ.ParalaxImage(idxBg.name, imgPos, scale, subrect);

    if(obj) {
      this.images.push(obj);
    }
  }

  draw(cameraPos) {
    push();
      translate(this.x, this.y);
      translate(cameraPos.x*this.camScale, cameraPos.y*this.camScale);
      this.images.forEach(img => {
        img.draw();
      });
    pop();
  }
}