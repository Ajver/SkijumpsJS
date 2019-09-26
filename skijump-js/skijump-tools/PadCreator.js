
const PadCreator = {

  SQRT_3: 1.7320508,

  pointsList: [
    { x: 10, y: 10 },
    { x: 20, y: 20 },
  ],

  createBodies: () => {
    console.log(PadCreator.createOneBody());
    return [];
  },

  createOneBody: () => {
    const p1 = Matter.Vector.create(PadCreator.pointsList[0].x, PadCreator.pointsList[0].y);
    const p2 = Matter.Vector.create(PadCreator.pointsList[1].x, PadCreator.pointsList[1].y);

    const vec = Matter.Vector.create(p2.x - p1.x, p2.y - p1.y);
    const angle = Math.atan2(vec.y, vec.x);

    const mag = Matter.Vector.magnitude(vec);
    const r = mag / PadCreator.SQRT_3;

    let body = Matter.Bodies.polygon(
      0, 0,
      3,
      r,
      {isStatic: true}
    );

    Matter.Body.setAngle(body, angle);

    console.log(body.vertices, body.position);

    return body;
  },

}

PadCreator.createBodies();