import { remote, ipcRenderer } from 'electron'
import settings from 'electron-settings'
import crypto from 'crypto'
window.addEventListener('load', () => {
  cancelButtom()
  saveButtom()
  if (settings.has('cloudup.user')) {
    document.getElementById('cloudup-user').value = settings.get('cloudup.user')
  }
  if (settings.has('cloudup.passwd')) {
    const decipher = crypto.createDecipher('aes192', 'PLatzipics')
    let decrypted = decipher.update(settings.get('cloudup.passwd'), 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    document.getElementById('cloudup-passwd').value = decrypted
  }
})

function cancelButtom () {
  const cancelButtom = document.getElementById('cancel-button')

  cancelButtom.addEventListener('click', () => {
    const prefsWindow = remote.getCurrentWindow()
    prefsWindow.close()
  })
}

function saveButtom() {
  const saveButtom = document.getElementById('save-button')
  const prefsfrom = document.getElementById('preferences-form')
  saveButtom.addEventListener('click', () => {
    if (prefsfrom.reportValidity()) {
      const cipher = crypto.createCipher('aes192', 'PLatzipics')
      let encrypted = cipher.update(document.getElementById('cloudup-passwd').value)
      encrypted += cipher.final('hex')

      settings.set('cloudup.user', document.getElementById('cloudup-user').value)
      settings.set('cloudup.passwd', encrypted)
      const prefsWindow = remote.getCurrentWindow()
      prefsWindow.close()
    } else {
      ipcRenderer.send('show-dialog', {
        type: 'error', title: 'platziPics', message: 'Por favor complete los campos requeridos'
      })
    }

  })
}