
SJ.SpriteSheet =
class {
  constructor(ssName, frameW, frameH, onload=null, offsetX=0, offsetY=0) {
    SJ.ImageLoader.load(ssName, (ss) => {
      this.frames = SJ.ImageLoader.divideSpriteSheet(ss, frameW, frameH, offsetX, offsetY);

      if(onload) {
        onload();
      }
    });
  }

  draw(frameIdx) {
    image(this.frames[frameIdx], 0, 0);
  }
}