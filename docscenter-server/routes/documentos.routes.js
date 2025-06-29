const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const controller = require('../controllers/documentos.controller')

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const nome = Date.now() + '-' + file.originalname
    cb(null, nome)
  }
})
const upload = multer({ storage })

router.post('/upload', upload.single('arquivo'), controller.uploadDocumento)
router.get('/lista', controller.listarDocumentos)
router.get('/download/:id', controller.baixarDocumento)
router.get('/total', controller.totalDocumentos)

module.exports = router
