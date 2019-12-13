

SJ._BasicItem =
class {
  constructor(itemName, description, price) {
    this.itemName = itemName;
    this.description = "Koszt: " + price + "\n" + description;
    this.price = price;
  }
}

SJ.Item =
class extends SJ._BasicItem {
  constructor(itemName, changedVarName, varMult, description, price) {
    super(itemName, description, price);

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
  constructor(itemName, description, price, activateFunc, afterActivateFunc) {
    super(itemName, description, price);

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