'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import devtools from './devtools'
import fs from 'fs'
import isImage from 'is-image'
import path from 'path'
import filesize from 'filesize'

let win
if (process.env.NODE_ENV === 'development') {
  devtools()
}
// console.dir(app)
// imprimir mensaje antes de salir
app.on('before-quit', () => {
  console.log('SALIENDO')
})

// ejecutar cuand inicie la ventana
app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola Mundo!',
    center: true,
    maximizable: false,
    show: false
  })

  // once -- se ejecutauna ves
  win.once('ready-to-show', () => {
    win.show()
  })

  // evento  que se escuchan
  win.on('move', () => {
    const position = win.getPosition()
    // console.log(`la posicion de la ventana es ${position}`)
  })

  // readyto show : espera que sea cargado hasta se tengan lso datos

  // detectando el cierre de la ventana para cerrar el aplicativo
  win.on('closed', () => {
    win = null
    app.quit()
  })

  // abrir una pagina como una ventana
  // win.loadURL('http://devdocs.io/')
  win.loadURL(`file://${__dirname}/renderer/index.html`)
  // win.toggleDevTools()
})

// app.quit()
ipcMain.on('open-directory', (event) => {
  dialog.showOpenDialog(win, {
      title: 'Seleccione la nueva ubicacion',
      buttomLabel: 'Abrir ubicacion',
      properties: ['openDirectory']
  }, 
  (dir) => {
      const images = []
      if (dir) {
        fs.readdir(dir[0], (err, files) => {
            if (err) throw err
            for (let i = 0, length1 = files.length; i < length1; i++) {
              if (isImage(files[i])) {
                let imageFile = path.join(dir[0], files[i])
                let stats = fs.statSync(imageFile)
                let size = filesize(stats.size, {round: 0})
                images.push({ filename: files[i], src: `file://${imageFile}`, size: size})
              }
            }
            console.log(images)
            event.sender.send('load-images', images)
        })
      }
  })
})


ipcMain.on('open-save-dialog', (event, ext) => {
  console.log(ext)
  dialog.showSaveDialog(win, {
    title: 'Guardar imagen modificada',
    buttomLabel: 'Guardar Imagen',
    filters: [{name: 'Images', extensions: [ext.substr(1)]}]
  }, (file) => {
        if (file) {
          console.log("send image")
          event.sender.send('save-images', file)
        }
    })
  })