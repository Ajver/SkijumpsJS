
function UI() {
  
  this.scoreLabel;
  this.messageLabel;
  
  this.draw = () => {
    push();
    stroke(255);
    fill(0);
    textSize(32);
    
    text(this.scoreLabel, width-240, 40);

    textAlign(CENTER);
    text(this.messageLabel, width*0.5, height-40);

    pop()
  }

  this.updateScoreLabel = (score) => {
    this.scoreLabel = "Score: " + score;
  }

  this.updateMessageLabel = (message) => {
    this.messageLabel = message;
  }
  
  this.updateScoreLabel(0);
  this.updateMessageLabel("Press SPACE to launch");

}