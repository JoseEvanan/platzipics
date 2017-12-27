import fs from 'fs'
function applyFilter(filter, currentImage) {
  let imgObj = new Image(); // eslint-disable-line
  imgObj.src = currentImage.src;

  filterous.importImage(imgObj, {}) // eslint-disable-line
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

function saveImage (fileName) {
  let fileSrc = document.getElementById('image-displayed').src
  fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, '') // El error forma por que el tipo que escribe es jpg pero la rutaesta con png
  console.log('filesave')
  console.log(fileSrc)
  fs.writeFile(fileName, fileSrc, 'base64', (err) => {
    if (err) {
      console.log(err)
    }
  })
}

module.exports = {
  applyFilter: applyFilter,
  saveImage: saveImage
}