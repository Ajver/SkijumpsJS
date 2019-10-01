

const ImageLoader = {
  
  load: (imageName) => {
    return ImageLoader.loadFromPath('skijump-js/graphics/' + imageName);
  },

  loadFromPath: (path) => {
    return loadImage(path);
  },

}