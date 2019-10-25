
SJ.ImageLoader = {};

SJ.ImageLoader.load = (imageName, callback) => {
  return SJ.ImageLoader.loadFromPath('skijump-js/sj-graphics/' + imageName, callback);
}

SJ.ImageLoader.loadFromPath = (path, callback) => {
  return loadImage(path, callback);
}