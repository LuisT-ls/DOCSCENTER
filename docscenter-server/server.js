const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const documentosRoutes = require('./routes/documentos.routes')

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api/documentos', documentosRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
})
