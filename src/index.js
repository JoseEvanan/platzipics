'use strict'

import { app, BrowserWindow, Tray } from 'electron'
import devtools from './devtools'
import setMainIpc from './ipcMainEvents'
import handlerErros from './handler-errros'
import os  from 'os'
import path from 'path'

global.win // eslint-disabled-line
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
  global.win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola Mundo!',
    center: true,
    maximizable: false,
    show: false
  })
  setMainIpc(global.win)
  handlerErros(global.win)
  // once -- se ejecutauna ves
  global.win.once('ready-to-show', () => {
    global.win.show()
  })

  // evento  que se escuchan
  global.win.on('move', () => {
    const position = global.win.getPosition()
    // console.log(`la posicion de la ventana es ${position}`)
  })

  // readyto show : espera que sea cargado hasta se tengan lso datos

  // detectando el cierre de la ventana para cerrar el aplicativo
  global.win.on('closed', () => {
    global.win = null
    app.quit()
  })
  let icon
  if (os.platform() === 'win32') {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.ico')
  } else {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  }
  // TRAY no esta probado para ubuntu el tutorial esta en windows
  // global.tray = new Tray()

  
  // abrir una pagina como una ventana
  // win.loadURL('http://devdocs.io/')
  global.win.loadURL(`file://${__dirname}/renderer/index.html`)
  // win.toggleDevTools()
})

// app.quit()
