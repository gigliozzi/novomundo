// src/routes/designacoesGeralRoute.js
const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const DESIGNACOES_FILE = path.join(__dirname, '../data/designacoes.json')

// Rota: GET /api/designacoes/:data/geral?versao=admin ou publica
router.get('/:data/geral', (req, res) => {
  const { data } = req.params
  const versao = req.query.versao || 'admin' // pode ser "admin" ou "publica"

  const raw = fs.readFileSync(DESIGNACOES_FILE, 'utf8')
  const designacoes = JSON.parse(raw)

  if (designacoes.data !== data) {
    return res.status(404).send(`<p>Nenhuma designação encontrada para ${data}</p>`)
  }

  const blocosHtml = []

  for (const sala in designacoes.salas) {
    const partes = designacoes.salas[sala]

    const linhas = Object.entries(partes).map(([parte, info]) => {
      const nome = info.participantes?.nome || ''
      const ajudante = info.participantes?.ajudante
        ? ' / ' + info.participantes.ajudante
        : ''
      const referencia = info.referencia && versao === 'admin' ? `(${info.referencia})` : ''

      return `
        <tr>
          <td>${parte}</td>
          <td>${nome}${ajudante}</td>
          ${versao === 'admin' ? `<td>${referencia}</td>` : ''}
        </tr>
      `
    })

    blocosHtml.push(`
      <h2 style="margin-top: 2rem;">${sala}</h2>
      <table style="width:100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc; padding:4px; text-align:left">Parte</th>
            <th style="border:1px solid #ccc; padding:4px; text-align:left">Participantes</th>
            ${versao === 'admin' ? '<th style="border:1px solid #ccc; padding:4px; text-align:left">Referência</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${linhas.join('\n')}
        </tbody>
      </table>
    `)
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Designações da Semana - ${data}</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 2rem;">
      <h1>Designações da Semana - ${data}</h1>
      ${blocosHtml.join('\n')}
    </body>
    </html>
  `

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

module.exports = router
