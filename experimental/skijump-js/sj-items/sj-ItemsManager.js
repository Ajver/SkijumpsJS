
SJ.ItemsManager = 
class {
  constructor() {
    this._items = []; 
  }

  _testItems() {
    const it = new SJ.Item("Foka", "padFriction", 0.5);

    print("Begin\n")
    print("Pad friction ", SJ.V.padFriction);
    
    this.addItem(it)
    print("After add:\n", this._items);
    print("Pad friction ", SJ.V.padFriction);
    
    this.removeItem(it);
    print("After remove:\n", this._items);
    print("Pad friction ", SJ.V.padFriction);

    print("END")
  }

  addItem(item) {
    this._items.push(item);
  }

  removeItem(item) {
    item.unequip();
    for(let i=0; i<this._items.length; i++) {
      if(this._items[i] === item) {
        this._items.splice(i, 1);
        return;
      }
    }
  }
  
  equipAllItems() {
    this._items.forEach(item => {
      item.equip();
    });
    SJ.itemsDisplay.updateItemsList();
  }

  unequipAllItems() {
    this._items.forEach(item => {
      item.unequip();
    });
  }

}