
SJ.ParalaxBackground =
class {
  constructor() {
    this._layers = [];
    
    let sc = 1.0;
    let step = 0.2;
    for(let i=0; i<3; i++) {
      const pos = { 
        x: -3800, 
        y: -3000 
      };

      const layer = new SJ.ParalaxLayer(sc, pos, null);
      this._layers.push(layer);
      sc -= step;
    }

    this._layers.reverse();
  }

  draw() {
    const cameraPos = SJ.camera.getPosition();
    this._layers.forEach(layer => {
      layer.draw(cameraPos);
    });
  }
}