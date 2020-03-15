
SJ.ParalaxBackground =
class {
  constructor() {
    this._layers = [];
    
    let sc = 0.44;
    let step = 0.2;
    const layersCount = SJ.V.texturesNames.background.length
    for(let i=0; i<layersCount; i++) {
      const pos = { 
        x: 0, 
        y: 100 
      };

      const data = SJ.V.texturesNames.background[i];
      const layer = new SJ.ParalaxLayer(sc, pos, data);
      this._layers.push(layer);
      sc = lerp(sc, 1.0, step);
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