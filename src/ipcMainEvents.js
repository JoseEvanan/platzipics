import { ipcMain, dialog } from 'electron'
import fs from 'fs'
import isImage from 'is-image'
import path from 'path'
import filesize from 'filesize'


function setMainIpc (win){
  ipcMain.on('open-directory', (event) => {
    dialog.showOpenDialog(win, {
      title: 'Seleccione la nueva ubicacion',
      buttomLabel: 'Abrir ubicacion',
      properties: ['openDirectory']
    },
      (dir) => {
        const images = []
        if (dir) {
          loadImages(event, dir[0])
        }
      })
  })

  ipcMain.on('load-directory', (event, dir) => {
    loadImages(event, dir)
  })

  ipcMain.on('open-save-dialog', (event, ext) => {
    console.log(ext)
    dialog.showSaveDialog(win, {
      title: 'Guardar imagen modificada',
      buttomLabel: 'Guardar Imagen',
      filters: [{ name: 'Images', extensions: [ext.substr(1)] }]
    }, (file) => {
      if (file) {
        console.log("send image")
        event.sender.send('save-images', file)
      }
    })
  })

  ipcMain.on('show-dialog', (event, info) => {
    dialog.showMessageBox(win, {
      type: info.type,
      title: info.title,
      buttons: ['OK'], // En windows no se necesita
      message: info.message
    })
  })
}

function loadImages (event, dir) {
  const images = []
  fs.readdir(dir, (err, files) => {
    if (err) throw err
    for (let i = 0, length1 = files.length; i < length1; i++) {
      if (isImage(files[i])) {
        let imageFile = path.join(dir, files[i])
        let stats = fs.statSync(imageFile)
        let size = filesize(stats.size, { round: 0 })
        images.push({ filename: files[i], src: `file://${imageFile}`, size: size })
      }
    }
    console.log(images)
    event.sender.send('load-images', dir, images)
  })
}

module.exports = setMainIpc
