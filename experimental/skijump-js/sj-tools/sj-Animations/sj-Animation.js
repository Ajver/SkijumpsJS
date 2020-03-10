
SJ.Timer =
class {
  constructor(duration, autostart=false, loopMode=false, resetAtEnd=false) {
    this._duration = float(duration);
    this._loopMode = loopMode;
    this._resetAtEnd = resetAtEnd;

    this._isPaused = false;

    // Elapsed time in ms in moment of pause
    this._pausedAt = 0;

    this._onTimeoutCallbacks = [];
    
    if(autostart) {
      this._start();
    }else {
      this._startTime = this.now();
      this._isRunning = false;
      this._startTime = 0;
    }
  }

  // Starts timer only when not-running (and/or is paused)
  start() {
    if(this._isRunning) {
      return;
    }

    if(this._isPaused) {
      this._isRunning = true;
      this._isPaused = false;
      this._startTime = this.now() - this._pausedAt;
    }else {
      this._start();
    }
  }

  _start() {
    this._isRunning = true;
    this._startTime = this.now();
  }

  stop() {
    this._isRunning = false;
  }

  pause() {
    this._isPaused = true;
    this._isRunning = false;
    this._pausedAt = this.now();
  }

  restart() {
    this._start();
  }

  tick() {
    if(!this._isRunning) {
      if(this._isPaused) {
        return this._tick();
      }else {
        return false;
      }
    }else {
      return this._tick();
    }
  }

  _tick() { 
    if(this.getElapsedTime() >= this._duration) {
      if(this._loopMode) {
        this.restart();
      }else {
        this.stop();
      }

      this._onTimeoutCallbacks.forEach(callback => {
        callback();
      })

      return true;
    }

    return false;
  }

  // Returns value between <0; 1> (if running)
  // Returns 0 when not running
  getProgress() {
    if(!this._isRunning && !this._isPaused) {
      // Ended or not started

      if(this._resetAtEnd) {
        return 0;
      }else {
        return 1;
      }
    }

    const elapsed = this.getElapsedTime();
    const progress = elapsed / this._duration;

    this._tick();

    return min(progress, 1.0);
  }

  // Returns elapsed time in milliseconds
  getElapsedTime() {
    return (this.now()) - this._startTime;
  }

  isRunning() {
    return this._isRunning;
  }

  isPaused() {
    return this._isPaused;
  }

  getDuration() {
    return this._duration;
  }

  getLoopMode() {
    return this._loopMode;
  }

  getResetAtEnd() {
    return this._resetAtEnd;
  }
  
  now() {
    return new Date();
  }

  onTimeout(callback) {
    this._onTimeoutCallbacks.push(callback);
  }
}

SJ.Animation =
class extends SJ.Timer {
  constructor(frames=[], duration, autostart=false, loopMode=false, resetAtEnd=false) {
    super(duration, autostart, loopMode, resetAtEnd);
    this.frames = frames;
  }

  draw(x=0, y=0) {
    const currentFrame = this.getCurrentFrame();

    if(currentFrame) {
      image(currentFrame, x, y);
    }
  }

  getCurrentFrame() {
    return this.frames[this.getCurrentFrameIndex()];
  }

  getCurrentFrameIndex() {
    const { length } = this.frames;
    return floor(max(min(this.getProgress() * length, length-1), 0));
  }
}