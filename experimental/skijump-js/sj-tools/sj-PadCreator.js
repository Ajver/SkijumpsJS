
SJ.PadPart = 
class {

  constructor(p1, p2, img, imgWidth) {
    this.x = p1.x;
    this.y = p1.y;  
    this.img = img;

    const distance = dist(p1.x, p1.y, p2.x, p2.y);
    
    this.scale = 1.7;
    this.scale = distance / imgWidth;

    const diffX = p2.x - p1.x;
    const diffY = p2.y - p1.y;
    this.rotate = atan2(diffY, diffX);
    
    this.offset = { x: -10, y: -26*this.scale};
  }

  draw() {
    push();
      translate(this.x, this.y);
      rotate(this.rotate);
      translate(this.offset.x, this.offset.y)
      scale(this.scale);
      image(this.img, 0, 0);
    pop();
  }

}

SJ.PadCreator = {

  SQRT_3: 1.7320508,

  padImg: null,
  
  loadImages: () => {
    SJ.PadCreator.padImg = SJ.ImageLoader.load(SJ.V.texturesNames.pad);
    SJ.PadCreator.padDescentImg = SJ.ImageLoader.load("descent-part.png");
    SJ.PadCreator.padPartImg = SJ.ImageLoader.load("pad-part.png");
    SJ.PadCreator.padEndImg = SJ.ImageLoader.load("pad-end.png");
  },

  createPadBody: () => {
    PAD_PULLING_POINTS = SJ.V.padPullingPoints;
    // PAD_COLLISION_POINTS = SJ.PadCreator.generatePadCollisionPoints();
    PAD_COLLISION_POINTS = SJ.V.padCollisionPoints;
    JUMP_POINT = SJ.V.jumpStartPoint;
    JUMP_END_POINT = PAD_PULLING_POINTS[PAD_PULLING_POINTS.length-1].x;
    FALL_LINE = PAD_COLLISION_POINTS[PAD_COLLISION_POINTS.length-2].x;

    print(PAD_COLLISION_POINTS);

    return Matter.Body.create({
      isStatic: true,
      parts: SJ.PadCreator.createParts() 
    });
  },

  generatePadCollisionPoints: () => {
    // const scales = [
    //   { x: 1500, y: 1000},
    //   { x: 800, y: 1000},
    //   { x: 1500, y: 800},
    // ];
    const scales = SJ.V.padShapeScalars;

    let points = [];

    const step = 0.05;
    
    const offsetPoint = {
      x: PAD_PULLING_POINTS[PAD_PULLING_POINTS.length-1].x,
      y: PAD_PULLING_POINTS[PAD_PULLING_POINTS.length-1].y + 40
    }

    for(let x=0; x<=1.0; x+=step) {
      const alpha = x * PI;
      const y = 1.0 - ((cos(alpha) + 1.0) / 2.0);
      const scalePart = SJ.PadCreator._getScalePart(x, scales);
      const mx = x * scalePart.x + offsetPoint.x;
      const my = y * scalePart.y + offsetPoint.y;
      points.push({ x: mx, y: my });
    }

    {
      const p1 = points[points.length-2];
      const p2 = points[points.length-1];
      const diffX = p2.x - p1.x;
      const diffY = p2.y - p1.y;

      var distance = dist(p1.x, p1.y, p2.x, p2.y);
      var angle = atan2(diffY, diffX);
    }

    while(angle > 0.2) {
      angle = max(angle*0.4, 0.15);

      const p1 = points[points.length-1];
      const p2 = {
        x: cos(angle) * distance + p1.x,
        y: sin(angle) * distance + p1.y
      };
      points.push(p2);
    }

    angle = 0.07;
    distance = 375 * PAD_SCALE;
    
    const p1 = points[points.length-1];
    const p2 = {
      x: cos(angle) * distance + p1.x,
      y: sin(angle) * distance + p1.y
    };
    points.push(p2);

    return points;
  },

  _getScalePart: (x, scales) => {
    let dp = 1.0 / scales.length;
    let p = dp;
    let i = 0;
    let scale = { x:0, y:0 };
    for(i=0; i<scales.length; i++) {
      scale.x += scales[i].x;
      scale.y += scales[i].y;
      if(x <= p) {
        break;
      }
      p += dp;
    }

    return scale;
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

    // for(let i=1; i<PAD_PULLING_POINTS.length; i++) {
    //   const p1 = PAD_PULLING_POINTS[i-1];
    //   const p2 = PAD_PULLING_POINTS[i];
    //   const part = new SJ.PadPart(p1, p2, SJ.PadCreator.padDescentImg, 110);
    //   parts.offset = {
    //     x: -20,
    //     y: -40,
    //   };
    //   parts.push(part);
    // }

    for(let i=1; i<PAD_COLLISION_POINTS.length-1; i++) {
      const p1 = PAD_COLLISION_POINTS[i-1];
      const p2 = PAD_COLLISION_POINTS[i];
      const part = new SJ.PadPart(p1, p2, SJ.PadCreator.padPartImg, 130);
      parts.push(part);
    }
    
    const i = PAD_COLLISION_POINTS.length-1;
    const p1 = PAD_COLLISION_POINTS[i-1];
    const p2 = PAD_COLLISION_POINTS[i];
    const part = new SJ.PadPart(p1, p2, SJ.PadCreator.padEndImg, 375);
    part.offset.y = -20 * part.scale;
    parts.push(part);

    return parts;
  },

}