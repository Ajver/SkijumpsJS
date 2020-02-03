
SJ.higherJumperSpeed = 0;
SJ.higherJumperHeight = 0;

SJ.Rater =
class {
  constructor(rateFunc, getScore) {
    this.rate = rateFunc;
    this.score = 0;
    this.getScore = getScore || (() => { return this.score; })
  }
}

SJ.ScoreCounter = 
class {
  constructor() {
    this.previousJumperAngle = 0;

    this.jumpRater = new SJ.Rater(() => {
      const jumperX = SJ.jumper.body.position.x;
      const jumpAreaWidth = SJ.V.jumpEndPoint - SJ.V.jumpStartPoint;

      const jumperRelativeX = jumperX - SJ.V.jumpStartPoint;

      const proportion = jumperRelativeX / jumpAreaWidth;

      this.jumpRater.score = round(40.0 * proportion);
      this.jumpRater.score /= 2; 
    });

    this.stableFlyRater = new SJ.Rater(() => {
      const currentAnlge = SJ.jumper.body.angle;
      const relativeAngle = abs(currentAnlge - this.previousJumperAngle);
      this.stableFlyRater.reachedJumperAngle += relativeAngle;  
      // print(degrees(this.stableFlyRater.reachedJumperAngle));
      // print(degrees(relativeAngle));

    }, () => {
      const reachedAngle = degrees(this.stableFlyRater.reachedJumperAngle);
      const maxBestAngle = 50;
      if(reachedAngle < maxBestAngle) {
        return 20;
      }else {
        const maxAcceptedRotate = 300;
        const score = round((maxAcceptedRotate - reachedAngle) / (maxAcceptedRotate-maxBestAngle) * 40.0)  / 2.0;
        return max(score, 0);
      }
    });
    this.stableFlyRater.reachedJumperAngle = 0;

    this.rotatingSpeedRater = new SJ.Rater(() => {
      const currentAnlge = SJ.jumper.body.angle;
      const relativeAngle = abs(currentAnlge - this.previousJumperAngle);

      const maxAcceptedRelativeAngle = radians(1);

      if(relativeAngle > maxAcceptedRelativeAngle) {
        this.rotatingSpeedRater.score -= 0.1;
      }
    }, () => {
      const score = round(this.rotatingSpeedRater.score) / 2
      return max(score, 0);
    });
    this.rotatingSpeedRater.score = 40.0;

    this.distanceRater = new SJ.Rater(() => {
      const relativeDist = this.mettersDistTo_K - SJ.V.minJumpDistance;
      const maxminDist = SJ.V.maxJumpDistance - SJ.V.minJumpDistance;
      const proportion = relativeDist / maxminDist;

      this.distanceRater.score = max(min(round(proportion * 40.0) / 2, 20), 0);
    });

    this.landingRater = new SJ.Rater(() => {
      if(SJ.jumper.failed) {
        this.landingRater.score = 0;
        print("Jumper failed!");
      }else {
        const diff = millis() - this.landingRater.landMoment;
        print("Current moment: ", millis());
        const maxBestDiff = 50;
        if(diff <= maxBestDiff) {
          this.landingRater.score = 20;
        }else {
          const maxAcceptedDiff = 200;
          const score = round((maxAcceptedDiff - diff) / (maxAcceptedDiff-maxBestDiff) * 40.0)  / 2.0;
          this.landingRater.score = max(score, 0);
        }

        print("Landing time diff: ", diff);
        print("Score: ", this.landingRater.score);
      }
    });

    this.landingRater.onJumperLand = () => {
      this.landingRater.landMoment = millis();
      print("Landed moment: ", this.landingRater.landMoment);
    }
 
    this._raters = [
      this.jumpRater,
      this.stableFlyRater,
      this.rotatingSpeedRater,
      this.distanceRater,
      this.landingRater,
    ];

    // Distance to the point K in metters
    this.PIXELS_TO_METERS = SJ.V.padSize / (SJ.V.pointK-SJ.V.jumpEndPoint);
    this._POINT_PER_METER = 2.8;
    this.score = 0;
  }

  update() {
    if(SJ.jumper.body.isStatic) {
      return;
    }

    this.stableFlyRater.rate();
    this.rotatingSpeedRater.rate();

    this.previousJumperAngle = SJ.jumper.body.angle;
  }

  calculateDistance() {
    const landX = SJ.jumper.body.position.x;
    const distTo_K = landX - SJ.V.pointK;
    
    this.mettersDistTo_K = distTo_K * this.PIXELS_TO_METERS;

    let points = 60 + (this.mettersDistTo_K * this._POINT_PER_METER);
    points = round(points, 2);

    return points;
  }

  calculateScore() {
    let score = this.calculateDistance();
    this.distanceRater.rate();
    this.landingRater.rate();

    this._raters.forEach(rater => {
      score += rater.getScore();
      print(rater);
    });
    this.score = max(score, 0);
  }

  forEachRaters(callback) {
    this._raters.forEach(rater => {
      callback(rater);
    });
  }

  onJumperLand() {
    this.landingRater.onJumperLand();
  }

  rate() {
    
  }

}

