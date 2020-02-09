
SJ.Animation =
class extends SJ.Timer {
  constructor(duration, frames=[], autostart=false, loopMode=false, resetAtEnd=false) {
    super(duration, autostart, loopMode, resetAtEnd);
    this.frames = frames;
  }

  draw(x=0, y=0) {
    const currentFrame = this.getCurrentFrame();
    image(currentFrame, x, y); 
  }

  getCurrentFrame() {
    return this.frames[this.getCurrentFrameIndex()];
  }

  getCurrentFrameIndex() {
    const { length } = this.frames;
    return min(this.getProgress() * length, length-1);
  }
}