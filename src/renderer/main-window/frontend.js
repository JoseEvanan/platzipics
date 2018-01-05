import os from 'os'
import { setIpc, openDirectory, saveFile, openPreferences } from './main-window/ipcRenderedEvents'
import { addImagesEvents, searchImagesEvent, selectEvent, print } from './main-window/image-ui'

window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por js'
  // console.log(os.cpus())
  setIpc()
  addImagesEvents()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
  buttonEvent('open-preferences', openPreferences)
  buttonEvent('save-buttom', saveFile)
  buttonEvent('print-button', print)
})

function buttonEvent (id, func) {
  console.log("lanzo ", id)
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click',func)
}


