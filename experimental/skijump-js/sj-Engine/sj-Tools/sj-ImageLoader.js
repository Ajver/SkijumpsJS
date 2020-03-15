
SJ.ImageLoader = {};

SJ.ImageLoader.load = (imageName, callback) => {
  return SJ.ImageLoader.loadFromPath('skijump-js/sj-graphics/' + imageName, callback);
}

SJ.ImageLoader.loadArray = (imageNamesArray, callback) => {
  const images = new Array(imageNamesArray.length);

  let loaded = 0;
  for(let i=0; i<images.length; i++) {
    images[i] = SJ.ImageLoader.load(imageNamesArray[i], () => {
      if(++loaded >= images.length) {
        callback(images);
      }
    })
  }

  return images;
}

SJ.ImageLoader.loadFromPath = (path, callback) => {
  return loadImage(path, callback);
}

SJ.ImageLoader.divideSpriteSheet = (ss, frameW, frameH, offsetX=0, offsetY=0) => {
  const frames = [];

  for(let y=offsetY; y<ss.height; y+=frameH) {
    for(let x=offsetX; x<ss.width; x+=frameW) {
      if(x + frameW <= ss.width && y + frameH <= ss.height) {
        frames.push(
          SJ.ImageLoader.getSubImage(ss, x, y, frameW, frameH)
        );
      }
    }
  }

  return frames;
}

SJ.ImageLoader.getSubImage = (image, sx, sy, w, h) => {
  const subImg = createImage(w, h);
  subImg.loadPixels();

  image.loadPixels();

  let i=0;
  for(let y=sy; y<sy+h; y++) {
    for(let x=sx; x<sx+w; x++) {
      let index = (x + y * image.width) * 4;
      for(let j=0; j<4; j++) {
        subImg.pixels[i++] = image.pixels[index++];
      }
    }
  }

  subImg.updatePixels();

  return subImg;
}