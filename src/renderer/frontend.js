import os from 'os'
import { setIpc, openDirectory } from './ipcRenderedEvents'
import { addImagesEvents, searchImagesEvent, selectEvent} from './image-ui'

window.addEventListener('load', () => {
  // document.getElementById('mensaje').innerHTML = 'Este es un mensaje insertado por js'
  // console.log(os.cpus())
  setIpc()
  addImagesEvents()
  searchImagesEvent()
  selectEvent()
  buttonEvent('open-directory', openDirectory)
})

function buttonEvent (id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click',func)
}


