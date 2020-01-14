
SJ.MessagesManager = {};

SJ.MessagesManager.setMessage = (message) => {
  // SJ.ui.updateMessageLabel(message);
}

SJ.MessagesManager.waitingForLaunch = () => {
  if(SJ.IS_MOBILE) {
    SJ.MessagesManager.setMessage("Dotknij ekranu by zjechać");
  }else {
    SJ.MessagesManager.setMessage("Wciśnij SPACJĘ by zjechać");
  }
}

SJ.MessagesManager.skiingDown = () => {
  SJ.MessagesManager.setMessage("");
}

SJ.MessagesManager.canJump = () => {
  if(SJ.IS_MOBILE) {
    SJ.MessagesManager.setMessage("Dotknij ekranu by skoczyć");
  }else {
    SJ.MessagesManager.setMessage("Wciśnij SPACJĘ by skoczyć");
  }
}

SJ.MessagesManager.isFlying = () => {
  SJ.MessagesManager.setMessage("Użyj STRZAŁEK by się obrócić");
}

SJ.MessagesManager.fail = () => {
  SJ.MessagesManager.setMessage("Nie udało się.");
}

SJ.MessagesManager.noFail = () => {
  SJ.MessagesManager.setMessage("Gratulacje!");
}