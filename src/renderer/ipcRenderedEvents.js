import { ipcRenderer } from 'electron'
import { addImagesEvents, clearImages, selectFirstImage, loadImages} from './image-ui'

function setIpc () {
    ipcRenderer.on('load-images', (event, images) => {
        clearImages()
        loadImages(images)
        addImagesEvents()
        selectFirstImage()
    })
}

function openDirectory () {
    ipcRenderer.send('open-directory')
}

module.exports = {
    setIpc: setIpc,
    openDirectory: openDirectory
}