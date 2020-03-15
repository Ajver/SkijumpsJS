SJ.Node =
class {
    constructor() {
        this.isVisible = true;
        this.parent = null;
        this.children = [];
    }

    _draw() {
        if (!this.isVisible) {
            return;
        }

        this._drawSelfAndChildren()
    }

    _drawSelfAndChildren() {
        this.draw();

        this.forEachChild(child => {
            child._draw();
        });
    }

    forEachChild(callback) {
        this.children.forEach(child => {
            callback(child);
        });
    }

    forEachChildReversed(callback) {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            callback(child);
        }
    }

    addChild(drawable) {
        this.children.push(drawable);
        drawable.parent = this;
    }

    show() {
        this.isVisible = true;
    }

    hide() {
        this.isVisible = false;
    }

    draw() {}
}

SJ.Node2D =
class extends SJ.Node {
    constructor() {
        this.position = createVector(0, 0)
    }
    
    _draw() {
        if (!this.isVisible) {
            return;
        }

        push();
            translate(this.x, this.y);
            this._drawSelfAndChildren();
        pop();
    }

    getGlobalPosition() {
        const pos = this.position.copy()
    
        if(this.parent) {
          const parentPos = this.parent.getGlobalPosition();
          pos.add(parentPos);
        }
    
        return pos;
    }
}