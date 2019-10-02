
function Camera(scaleMod) {
  this.offset = createVector(
    -200,
    0
  )
  this.offset.x += width*0.5;
  this.offset.y += height*0.5;
  this.scale = scaleMod;

  this.targetPosition = createVector(0, 0);

  this.isFollowingJumper = true;

  this.update = () => {
    if(!this.isFollowingJumper) {
      return;
    }

    this.targetPosition.x = jumper.body.position.x;
    this.targetPosition.y = jumper.body.position.y;
  }

  this.transform = () => {
    const targetPos = this.targetPosition;
    scale(this.scale);
    translate(-targetPos.x+this.offset.x/this.scale, -targetPos.y+this.offset.y/this.scale);
  }

}