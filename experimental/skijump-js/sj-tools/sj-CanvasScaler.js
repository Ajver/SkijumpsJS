
function CanvasScaler() {
  this.SCREEN_PROPORTION = SJ.SCREEN_WIDTH / SJ.SCREEN_HEIGHT;
  this.scale;
  this.gameContainerDiv = null;

  this.setup = () => {
    this.gameContainerDiv = document.getElementById("skijump-game-container");
    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });
    this.resizeCanvas();
  }

  this.resizeCanvas = () => {
    const containerProportion = this.gameContainerDiv.offsetWidth / this.gameContainerDiv.offsetHeight;

    if(this.SCREEN_PROPORTION < containerProportion) {
      this.scale = this.gameContainerDiv.offsetHeight / SJ.SCREEN_HEIGHT;
    }else {
      this.scale = this.gameContainerDiv.offsetWidth / SJ.SCREEN_WIDTH;
    }

    resizeCanvas(SJ.SCREEN_WIDTH * this.scale, SJ.SCREEN_HEIGHT * this.scale);
  }

  this.transform = () => {
    scale(this.scale);
  }

}