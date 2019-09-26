
function LaunchingPad() {
  const part1 = Bodies.fromVertices(60,0,Matter.Vertices.fromPath('0 0 700 480 700 550 0 550'));
  const part2 = Bodies.fromVertices(628,405,Matter.Vertices.fromPath('700 560 830 620 950 760 1040 920 700 920'));
  const part3 = Bodies.fromVertices(895,615,Matter.Vertices.fromPath('1040 920 1200 1020 1040 1020'));
  const part4 = Bodies.fromVertices(1100,675,Matter.Vertices.fromPath('1200 1020 1500 1060 1200 1060'));
  const part5 = Bodies.fromVertices(750,755,Matter.Vertices.fromPath('1500 1060 1900 1060 1900 1200 0 1200 0 1060'));

  this.body = Body.create({
    isStatic: true,
    parts: [part1, part2, part3, part4, part5]
  });
  
  World.add(world, this.body);

  this.tb = Matter.Bodies.fromVertices(166.7, 300, Matter.Vertices.fromPath('100 200 250 300 150 400'), {isStatic:true});

  this.draw = () => {
    push();
    fill(50, 50, 255);
  
    this.body.parts.forEach((part) => {
      beginShape();
      part.vertices.forEach((element) => {
        //vertex(element.x, element.y)
      });
      endShape(CLOSE);
    });

    beginShape();
    this.tb.vertices.forEach((element) => {
      vertex(element.x, element.y);
    });
    endShape(CLOSE);

    fill(50, 255, 255);
    circle(100, 200, 30);
    circle(250, 300, 30);
    circle(150, 400, 30);

    pop();
  }
}