
SJ.ScoreCounter = 
class {
  constructor() {
    // Distance to the point K in metters
    this._PIXELS_TO_METERS = SJ.V.padSize / (POINT_K-JUMP_END_POINT);
    this._POINT_PER_METER = 2.8;
    this.score = 0;
  }

  calculateDistance(landX) {
    const distTo_K = landX - POINT_K;
    
    const mettersDistTo_K = distTo_K * this._PIXELS_TO_METERS;

    let points = 60 + (mettersDistTo_K * this._POINT_PER_METER);
    points = round(points, 2);

    this.score = points;
  }
}

