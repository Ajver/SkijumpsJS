
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
    
    this.offset = { x: -10, y: -26*this.scale };
  }

  draw() {
    push();
      translate(this.x, this.y);
      rotate(this.rotate);
      translate(this.offset.x, this.offset.y);
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
    SJ.PadCreator._loadMiddleground()
    SJ.PadCreator._loadForeground()
  },

  _loadMiddleground: () => {
    const middleground = SJ.V.texturesNames.middleground || null;

    if(!middleground) {
      SJ.PadCreator.middleground = null;
      return;
    }

    const middlegroundArray = new Array(middleground.length);
    for(let i=0; i<middleground.length; i++) {
      const data = middleground[i];
      const layer = new SJ.ParalaxLayer(1.0, { x: 0, y: 0 }, data);
      middlegroundArray[i] = layer;
    }

    SJ.PadCreator.middleground = middlegroundArray;
  },

  _loadForeground: () => {
    const foreground = SJ.V.texturesNames.foreground || null;

    if(!foreground) {
      SJ.PadCreator.padImgFront = null;
      return;
    }

    const foregroundArray = new Array(foreground.length);
    for(let i=0; i<foreground.length; i++) {
      const data = foreground[i];
      const layer = new SJ.ParalaxLayer(1.0, { x: 0, y: 0 }, data);
      foregroundArray[i] = layer;
    }

    SJ.PadCreator.padImgFront = foregroundArray;
  },

  createPadBody: () => {
    SJ.V.fallLine = SJ.V.padCollisionPoints[SJ.V.padCollisionPoints.length-2].x;

    return Matter.Body.create({
      isStatic: true,
      parts: SJ.PadCreator.createParts() 
    });
  },

  generatePadCollisionPoints: () => {
    const scales = [
      { 
        x: 7900, 
        y: 3900
      }
    ];

    let points = [];

    const step = 0.05;
    
    const offsetPoint = {
      x: SJ.V.padPullingPoints[SJ.V.padPullingPoints.length-1].x,
      y: SJ.V.padPullingPoints[SJ.V.padPullingPoints.length-1].y + 40
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
    distance = 375 * SJ.V.padScale;
    
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

    for(let i=1; i<SJ.V.padCollisionPoints.length; i++) {
      parts.push(SJ.PadCreator.createOneBody(i-1, i));
    }

    return parts;
  },

  createOneBody: (p1_idx, p2_idx) => {
    const p1 = Matter.Vector.create(SJ.V.padCollisionPoints[p1_idx].x, SJ.V.padCollisionPoints[p1_idx].y);
    const p2 = Matter.Vector.create(SJ.V.padCollisionPoints[p2_idx].x, SJ.V.padCollisionPoints[p2_idx].y);

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

    for(let i=1; i<SJ.V.padCollisionPoints.length-1; i++) {
      const p1 = SJ.V.padCollisionPoints[i-1];
      const p2 = SJ.V.padCollisionPoints[i];
      const part = new SJ.PadPart(p1, p2, SJ.PadCreator.padPartImg, 130);
      parts.push(part);
    }
    
    const i = SJ.V.padCollisionPoints.length-1;
    const p1 = SJ.V.padCollisionPoints[i-1];
    const p2 = SJ.V.padCollisionPoints[i];
    const part = new SJ.PadPart(p1, p2, SJ.PadCreator.padEndImg, 375);
    part.offset.y = -20 * part.scale;
    parts.push(part);

    return parts;
  },

}