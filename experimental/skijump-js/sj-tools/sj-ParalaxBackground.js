
SJ.ParalaxBackground =
class {
  constructor() {
    this._layers = [];
    
    let sc = 0.2;
    let step = 0.2;
    for(let i=0; i<5; i++) {
      const pos = { 
        x: 200, 
        y: 140 
      };

      const layer = new SJ.ParalaxLayer(sc, pos, i);
      this._layers.push(layer);
      sc += step;
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