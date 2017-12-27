import { ipcRenderer } from 'electron'
import { addImagesEvents, clearImages, selectFirstImage, loadImages} from './image-ui'
import { saveImage } from './filters'
import path from 'path'
function setIpc () {
    ipcRenderer.on('load-images', (event, images) => {
        clearImages()
        loadImages(images)
        addImagesEvents()
        selectFirstImage()
    })
    ipcRenderer.on('save-images', (event, file) => {
        console.log("RECIBI")
        saveImage(file)
    })
}

function openDirectory () {
    ipcRenderer.send('open-directory')
}

function saveFile() {
    const image = document.getElementById('image-displayed').dataset.original
    const ext = path.extname(image)
    ipcRenderer.send('open-save-dialog', ext)
}

module.exports = {
    setIpc: setIpc,
    openDirectory: openDirectory,
    saveFile: saveFile
}