import { dialog, app } from 'electron'

function relaunchApp (win) {
  dialog.showMessageBox(win, {
    type: 'error',
    title: 'Platzipics',
    message: 'Ocurrio un error inesperado, se reiniciara el aplicativo'
  }, () => {
    app.relaunch()
    app.exit(0)
  })
}

function setupErrors (win) {
  win.webContents.on('crashed', () => {
    relaunchApp(win)
  })
  win.on('unresponsive', () => {
    relaunchApp(win)
  })
  win.on('unresponsive', () => {
    dialog.showMessageBox(win, {
      type: 'warning',
      title: 'Platzipics',
      message: 'EL proceso está tardando demasiado, puede esperar o reiniciar el aplicativo'
    }, () => {
      app.relaunch()
      app.exit(0)
    })
  })
  process.on('uncaughtException', () => {
    relaunchApp(win)
  })
}

module.exports = setupErrors
