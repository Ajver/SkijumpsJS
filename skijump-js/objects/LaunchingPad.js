
function LaunchingPad() {
  this.body = PadCreator.createPadBody();
  print(PadCreator.pointsList);
  
  World.add(world, this.body);

  this.img = PadCreator.padImg;

  this.draw = () => {
    push();
    fill(50, 50, 255);
  
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        vertex(element.x, element.y)
        circle(element.x, element.y, 10);
      });
      endShape(CLOSE);
    });

    image(this.img, 0, 0);

    pop();
  }
}