
SJ.ImageLoader = {};

SJ.ImageLoader.load = (imageName) => {
  return SJ.ImageLoader.loadFromPath('skijump-js/sj-graphics/' + imageName);
}

SJ.ImageLoader.loadFromPath = (path) => {
  return loadImage(path);
}