const db = require('../models/db')
const path = require('path')

exports.uploadDocumento = (req, res) => {
  const { curso, disciplina, tipo, titulo, descricao } = req.body
  const arquivo = req.file

  if (!arquivo) return res.status(400).send('Arquivo não enviado.')

  const query = `
    INSERT INTO documentos 
    (curso, disciplina, tipo, titulo, descricao, nome_arquivo, caminho_arquivo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [
      curso,
      disciplina,
      tipo,
      titulo,
      descricao,
      arquivo.originalname,
      arquivo.path
    ],
    err => {
      if (err) return res.status(500).send(err)
      res.send('Documento enviado com sucesso!')
    }
  )
}

exports.listarDocumentos = (req, res) => {
  db.query(
    'SELECT * FROM documentos ORDER BY data_upload DESC',
    (err, results) => {
      if (err) return res.status(500).send(err)
      res.json(results)
    }
  )
}

exports.baixarDocumento = (req, res) => {
  const id = req.params.id
  db.query('SELECT * FROM documentos WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send('Documento não encontrado')

    const doc = results[0]
    res.download(path.resolve(doc.caminho_arquivo), doc.nome_arquivo)
  })
}

exports.totalDocumentos = (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM documentos', (err, result) => {
    if (err) return res.status(500).send(err)
    res.json(result[0])
  })
}
