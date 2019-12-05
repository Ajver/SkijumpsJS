
SJ.Item =
class {
  constructor(itemName, changedVarName, varMult, description, price) {
    this.isActiveItem = false;
    this.itemName = itemName;
    this.changedVarName = changedVarName;
    this.varMult = varMult;
    this.description = "Koszt: " + price + "\n" + description;
    this.price = price;
  }

  equip() {
    SJ.V[this.changedVarName] *= this.varMult;
  }

  unequip() {
    SJ.V[this.changedVarName] /= this.varMult;
  }
}

SJ.ActiveItem =
class {
  constructor(itemName, description, price, activateFunc, afterActivateFunc) {
    this.isActiveItem = true;
    this.itemName = itemName;
    this.description = description;
    this.price = price;
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