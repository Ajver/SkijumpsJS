
function LaunchingPad() {
  this.body = PadCreator.createPadBody();
  
  World.add(world, this.body);

  this.hmm = false;

  this.draw = () => {
    push();
    fill(50, 50, 255);
  
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element, index) => {
        if(index >= 0) {
          vertex(element.x, element.y)
          circle(element.x, element.y, 10);
          if(!this.hmm) {
            print(element);
          }
        }
      });
      endShape(CLOSE);
    });

    this.hmm = true;

    fill(255);
    circle(0, 0, 30);
    fill(255, 255, 0);
    circle(this.body.position.x, this.body.position.y, 20);
    fill(255, 0, 255);
    circle(160, 100, 25);
    circle(350, 450, 25);
    circle(500, 500, 25);

    pop();
  }
}