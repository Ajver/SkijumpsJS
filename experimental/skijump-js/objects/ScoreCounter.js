
// Distance to the point K in metters
const PAD_SIZE = 65.0;
const PIXELS_TO_METERS = PAD_SIZE / (POINT_K-JUMP_END_POINT);
const POINT_PER_METER = 2.8;

function ScoreCounter() {

  this.score = 0;

  this.calculateDistance = (landX) => {
    const distTo_K = landX - POINT_K;
    const jumpLength = landX - JUMP_END_POINT;
    
    const mettersDistTo_K = distTo_K * PIXELS_TO_METERS;
    // const mettersJumpLength = jumpLength * PIXELS_TO_METERS;

    let points = 60 + (mettersDistTo_K * POINT_PER_METER);
    points = Math.round(points, 2);

    this.score = points;
    return mettersDistTo_K;
  }

  this.draw = () => {
    if(this.score) {
      // text("Score: " + this.score, width - 100, 40);
    }
    push();
    stroke(255);
    fill(0);
    textSize(32);
    text("Score: " + this.score, width - 240, 40);
    pop()
  }

}