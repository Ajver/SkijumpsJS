
const MessagesManager = {};

MessagesManager.setMessage = (message) => {
  ui.updateMessageLabel(message);
}

MessagesManager.waitingForLaunch = () => {
  MessagesManager.setMessage("Press SPACE to launch");
}

MessagesManager.skiingDown = () => {
  MessagesManager.setMessage("");
}

MessagesManager.canJump = () => {
  MessagesManager.setMessage("Press SPACE to jump");
}

MessagesManager.isFlying = () => {
  MessagesManager.setMessage("Use ARROWS to rotate");
}

MessagesManager.fail = () => {
  MessagesManager.setMessage("You failed");
}

MessagesManager.noFail = () => {
  MessagesManager.setMessage("Congratulations!");
}