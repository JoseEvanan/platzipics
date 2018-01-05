import fs from 'fs-extra'
function applyFilter(filter, currentImage) {
  let imgObj = new Image(); // eslint-disable-line
  imgObj.src = currentImage.src;

  filterous.importImage(imgObj, {}) // eslint-disable-line
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

function saveImage(fileName, callback) {
  let fileSrc = document.getElementById('image-displayed').src
  if (fileSrc.indexOf(';base64,') !== -1 ) {
    fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, '') // El error forma por que el tipo que escribe es jpg pero la rutaesta con png
    console.log('filesave')
    console.log(fileSrc)
    fs.writeFile(fileName, fileSrc, 'base64', callback)
  } else {
    fileSrc = fileSrc.replace('file://', '')
    fs.copy(fileSrc, fileName, callback)
  }

}
// s = "data:image/png;base64"
// let dddd = s.match(/data:image\/([a-zA-Z0-9-.+]+)/)
// console.log(dddd[1])
module.exports = {
  applyFilter: applyFilter,
  saveImage: saveImage
}