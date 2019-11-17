
SJ.PadPart = 
class {

  constructor(p1, p2) {
    this.x = p1.x;
    this.y = p1.y;  

    const distance = dist(p1.x, p1.y, p2.x, p2.y);
    
    this.scale = 1.7;
    this.scale = distance / 100;
    
    const diffX = p2.x - p1.x;
    const diffY = p2.y - p1.y;
    this.rotate = atan2(diffY, diffX);
    
    this.offset = { x: -10, y: -26};
  }

  draw() {
    push();
      translate(this.x, this.y);
      rotate(this.rotate);
      translate(this.offset.x, this.offset.y)
      scale(this.scale);
      image(SJ.PadCreator.padPartImg, 0, 0);
    pop();
  }

}

SJ.PadCreator = {

  SQRT_3: 1.7320508,

  padImg: null,
  
  loadImages: () => {
    SJ.PadCreator.padImg = SJ.ImageLoader.load(SJ.V.texturesNames.pad);
    SJ.PadCreator.padPartImg = SJ.ImageLoader.load("pad-part.png");
  },

  createPadBody: () => {
    PAD_COLLISION_POINTS = SJ.PadCreator.generatePadCollisionPoints();

    return Matter.Body.create({
      isStatic: true,
      parts: SJ.PadCreator.createParts() 
    });
  },

  generatePadCollisionPoints: () => {
    const scales = [
      { x: 3500, y: 3000}
    ];
    
    const scaleParts = scales.length

    let points = [];

    const step = 0.05;
    
    const offsetPoint = PAD_COLLISION_POINTS[0];

    for(let x=0; x<=1.0; x+=step) {
      const alpha = x * PI;
      const y = 1.0 - ((cos(alpha) + 1.0) / 2.0);
      const p = SJ.PadCreator._getPartIdx(x, scaleParts);
      const mx = x * scales[p].x + offsetPoint.x;
      const my = y * scales[p].y + offsetPoint.y;
      points.push({ x: mx, y: my });
    }

    return points;
  },

  _getPartIdx: (x, partsCount) => {
    let dp = 1.0 / partsCount;
    let p = dp;
    for(let i=0; i<partsCount; i++) {
      if(x <= p) {
        return i;
      }
      p += dp;
    }

    return partsCount;
  },

  createParts: () => {    
    let parts = [];

    for(let i=1; i<PAD_COLLISION_POINTS.length; i++) {
      parts.push(SJ.PadCreator.createOneBody(i-1, i));
    }

    return parts;
  },

  createOneBody: (p1_idx, p2_idx) => {
    const p1 = Matter.Vector.create(PAD_COLLISION_POINTS[p1_idx].x, PAD_COLLISION_POINTS[p1_idx].y);
    const p2 = Matter.Vector.create(PAD_COLLISION_POINTS[p2_idx].x, PAD_COLLISION_POINTS[p2_idx].y);

    const vec = Matter.Vector.create(p2.x - p1.x, p2.y - p1.y);
    const angle = atan2(vec.y, vec.x);

    const mag = Matter.Vector.magnitude(vec);
    const r = mag / SJ.PadCreator.SQRT_3;

    let body = Matter.Bodies.polygon(0, 0, 3, r);

    Matter.Body.setAngle(body, angle-HALF_PI);
    const translateVec = Matter.Vector.sub(p2, body.vertices[0]);
    Matter.Body.translate(body, translateVec);

    return body;
  },

  createPadParts: () => {
    let parts = [];

    for(let i=1; i<PAD_COLLISION_POINTS.length; i++) {
      const p1 = PAD_COLLISION_POINTS[i-1];
      const p2 = PAD_COLLISION_POINTS[i];
      const part = new SJ.PadPart(p1, p2);
      parts.push(part);
    }

    return parts;
  },

}