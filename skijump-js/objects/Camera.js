
function Camera(scaleMod) {
  this.offset = createVector(
    -200,
    0
  )
  this.offset.x += width*0.5;
  this.offset.y += height*0.5;
  this.scale = scaleMod;

  this.transform = () => {
    const targetPos = jumper.body.position;
    scale(this.scale);
    translate(500, 500);
    //translate(-targetPos.x+this.offset.x/this.scale, -targetPos.y+this.offset.y/this.scale);
  }

}