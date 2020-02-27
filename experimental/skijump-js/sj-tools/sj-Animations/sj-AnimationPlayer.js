
SJ.AnimationPlayer =
class {
  constructor(animations={}) {
    this.animations = [];

    for(const animation in animations) {
      this.addAnimation(animation, animations[animation]);
    }

    console.log(this.animations);

    this.currentAnimationName = "";
    this.currentAnimation = null;

    this._onAnimationFinishedCallbacks = [];
  }

  addAnimation(animationName, animation) {
    this.animations[animationName] = animation;

    animation.onTimeout(() => {
      this._onAnimationFinishedCallbacks.forEach(callback => {
        callback(animationName);
      })
    });
  }

  play(animationName) {
    this.stop();
    this.currentAnimation = this.animations[animationName];
    this.currentAnimation.restart();
  }

  stop() {
    if(this.currentAnimation) {
      this.currentAnimation.stop();
    }
  }

  draw(x=0, y=0) {
    if(this.currentAnimation) {
      this.currentAnimation.draw(x, y);
    }
  }

  onAnimationFinished(callback) {
    this._onAnimationFinishedCallbacks.push(callback);
  }
}