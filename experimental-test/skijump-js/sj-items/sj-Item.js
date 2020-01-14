

SJ._BasicItem =
class {
  constructor(itemName, imgName, description, price, ) {
    this.itemName = itemName;
    this.imgName = imgName;
    this.img = SJ.ImageLoader.load("Items/" + this.imgName);
    this.description = "Koszt: " + price + "\n" + description;
    this.price = price;
  }
}

SJ.Item =
class extends SJ._BasicItem {
  constructor(itemName, imgName, changedVarName, varMult, description, price) {
    super(itemName, imgName, description, price);

    this.isActiveItem = false;
    this.changedVarName = changedVarName;
    this.varMult = varMult;
  }

  equip() {
    SJ.V[this.changedVarName] *= this.varMult;
  }

  unequip() {
    SJ.V[this.changedVarName] /= this.varMult;
  }
}

SJ.ActiveItem =
class extends SJ._BasicItem {
  constructor(itemName, imgName, description, price, activateFunc, afterActivateFunc) {
    super(itemName, imgName, description, price);
    this.imgActive = SJ.ImageLoader.load("Items/active_" + this.imgName);
    this.imgDisabled = SJ.ImageLoader.load("Items/disabled_" + this.imgName);

    this.isActiveItem = true;
    this.activate = activateFunc;
    this.afterActivate = afterActivateFunc || (() => {
      this.isActive = true;
      this.disabled = true;
    });
    
    this.reset();
  }
  
  reset() {
    this.isActive = false;
    this.disabled = false;
  }

}