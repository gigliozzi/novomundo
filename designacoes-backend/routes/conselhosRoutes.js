const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

const CONSELHOS_FILE = path.join(__dirname, '../data/conselhos.json');
const APLICADOS_FILE = path.join(__dirname, '../data/conselhos_aplicados.json');

// Listar todos os conselhos disponíveis
router.get('/', verificarToken, (req, res) => {
  const data = fs.readFileSync(CONSELHOS_FILE);
  const conselhos = JSON.parse(data);
  res.json(conselhos);
});

// Aplicar um conselho (admin)
router.post('/aplicar', verificarToken, verificarAdmin, (req, res) => {
  const { participanteId, conselhoId, parte, data, observacao } = req.body;

  if (!participanteId || !conselhoId || !parte || !data) {
    return res.status(400).json({ msg: "Campos obrigatórios ausentes." });
  }

  const aplicadosRaw = fs.readFileSync(APLICADOS_FILE);
  const aplicados = JSON.parse(aplicadosRaw);

  // Aqui poderia haver validação para evitar repetições — opcional
  aplicados.push({
    participanteId,
    conselhoId,
    parte,
    data,
    observacao: observacao || null
  });

  fs.writeFileSync(APLICADOS_FILE, JSON.stringify(aplicados, null, 2));

  res.status(201).json({ msg: "Conselho aplicado com sucesso!" });
});

// Consultar histórico de conselhos por participante
router.get('/historico/:id', verificarToken, (req, res) => {
  const participanteId = parseInt(req.params.id);
  const aplicadosRaw = fs.readFileSync(APLICADOS_FILE);
  const conselhosRaw = fs.readFileSync(CONSELHOS_FILE);

  const aplicados = JSON.parse(aplicadosRaw);
  const conselhos = JSON.parse(conselhosRaw);

  const historico = aplicados
    .filter(entry => entry.participanteId === participanteId)
    .map(entry => {
      const conselho = conselhos.find(c => c.id === entry.conselhoId);
      return {
        data: entry.data,
        parte: entry.parte,
        texto: conselho?.texto || "Desconhecido",
        observacao: entry.observacao
      };
    });

  res.json({
    participanteId,
    total: historico.length,
    historico
  });
});

module.exports = router;
