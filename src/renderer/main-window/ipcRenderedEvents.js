import { ipcRenderer, remote } from 'electron'
import settings from 'electron-settings'
import { addImagesEvents, clearImages, selectFirstImage, loadImages} from './image-ui'
import { saveImage } from './filters'
import cloudinary from 'cloudinary'
import crypto from 'crypto'
import path from 'path'
import os from 'os'

function setIpc () {
	if (settings.has('directory')) {
		ipcRenderer.send('load-directory', settings.get('directory'))
	}
	ipcRenderer.on('load-images', (event, dir, images) => {
		clearImages()
		loadImages(images)
		addImagesEvents()
		selectFirstImage()
		settings.set('directory', dir)
		document.getElementById('directory').innerHTML = dir
		console.log(settings.file())
	})
	ipcRenderer.on('save-images', (event, file) => {
		saveImage(file, (err) => {
			if (err) {
				showDialog('error', 'Platzipics', err.message)
			} else {
				showDialog('info', 'Platzipics', 'Imagen guardada')
			}
		})
	})
}

function openPreferences () {
	const BrowserWindow = remote.BrowserWindow
	const mainWindow = remote.getGlobal('win')

	const preferencesWindow = new BrowserWindow({
		width: 400,
		height: 300,
		title: 'Preferencias',
		center: true,
		modal: true,
		frame: false,
		show: false
	})

	if (os.platform() !== 'win32') {
		preferencesWindow.setParentWindow(mainWindow) // en windows no funciona
	}
	preferencesWindow.once('ready-to-show', () => { // cuando esat cargada completamente recien se muestra
		preferencesWindow.show()
		preferencesWindow.focus()
	})
	
	preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)
}

function openDirectory () {
	ipcRenderer.send('open-directory')
}

function showDialog (type, title, msg) {
	ipcRenderer.send('show-dialog', {
		type:type, title: title, message:msg
	})
}
function saveFile() {
	const image = document.getElementById('image-displayed').dataset.original
	console.log("-------")
	console.log(image)
	const ext = path.extname(image)
	console.log(ext)
	console.log("-------")
	ipcRenderer.send('open-save-dialog', ext)
}

function uploadImage () {
	let image = document.getElementById('image-displayed').src
	image = image.replace('file://','')
	let fileName = path.basename(image)
	if ( settings.has('cloudup.user') && settings.has('cloudup.passwd')) {
		const decipher = crypto.createDecipher('aes192', 'PLatzipics')
		let decrypted = decipher.update(settings.get('cloudup.passwd'), 'hex', 'utf-8')
		decrypted += decipher.final('utf-8')

		const 

			exports.cloudinary = {
				cloud_name: process.env.CLOUDINARY_CNAME,
				api_key: process.env.CLOUDINARY_KEY,
				api_secret: process.env.CLOUDINARY_SECRET
			}
		const cloudinary = require('cloudinary')
		const cloudinaryConfig = require('../config').cloudinary

		cloudinary.config(cloudinaryConfig)

		router.post('/nuevo', (req, res) => {
			cloudinary.uploader.upload(req.files.mainImg.path, (result) => {
				var newEvento = new Evento()
				newEvento.mainImg = result.url
				newEvento.save((err, savedEvento) => {
					if (err) return res.status(500).send(err)
					res.redirect('/admin/evento/all')
				})
			})
		})

	} else {
		showDialog('error', 'Platzipics', 'Por Favor complete las preferencias')
	}
}
 
module.exports = {
	setIpc: setIpc,
	openDirectory: openDirectory,
	saveFile: saveFile,
	openPreferences: openPreferences
}