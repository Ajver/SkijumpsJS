
const PadCreator = {

  SQRT_3: 1.7320508,

  padImg: null,
  
  loadImages: () => {
    PadCreator.padImg = ImageLoader.load('pad.png');
  },

  createPadBody: () => {
    return Body.create({
      isStatic: true,
      parts: PadCreator.createParts() 
    });
  },

  createParts: () => {    
    let parts = [];

    for(let i=1; i<PAD_COLLISION_POINTS.length; i++) {
      parts.push(PadCreator.createOneBody(i-1, i));
    }

    return parts;
  },

  createOneBody: (p1_idx, p2_idx) => {
    const p1 = Matter.Vector.create(PAD_COLLISION_POINTS[p1_idx].x, PAD_COLLISION_POINTS[p1_idx].y);
    const p2 = Matter.Vector.create(PAD_COLLISION_POINTS[p2_idx].x, PAD_COLLISION_POINTS[p2_idx].y);

    const vec = Matter.Vector.create(p2.x - p1.x, p2.y - p1.y);
    const angle = Math.atan2(vec.y, vec.x);

    const mag = Matter.Vector.magnitude(vec);
    const r = mag / PadCreator.SQRT_3;

    let body = Matter.Bodies.polygon(0, 0, 3, r);

    Matter.Body.setAngle(body, angle-HALF_PI);
    const translateVec = Matter.Vector.sub(p2, body.vertices[0]);
    Matter.Body.translate(body, translateVec);

    return body;
  },

}