const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { verificarToken } = require("../middleware/auth");

const PARTICIPANTES_FILE = path.join(__dirname, "../data/participantes.json");

// Listar participantes aprovados
router.get("/", verificarToken, (req, res) => {
  const data = fs.readFileSync(PARTICIPANTES_FILE);
  const participantes = JSON.parse(data);
  const aprovados = participantes.filter((p) => p.aprovado === true);
  res.json(aprovados);
});

// Listar todos (admin)
router.get("/todos", verificarToken, (req, res) => {
  const data = fs.readFileSync(PARTICIPANTES_FILE);
  const participantes = JSON.parse(data);
  res.json(participantes);
});

module.exports = router;

const DESIGNACOES_FILE = path.join(__dirname, "../data/designacoes.json");

// Histórico por participante
router.get("/:id/historico", verificarToken, (req, res) => {
  const participanteId = parseInt(req.params.id);
  const rawDesignacoes = fs.readFileSync(DESIGNACOES_FILE);
  const designacoes = JSON.parse(rawDesignacoes);

  const historico = [];
  const hoje = new Date();
  const doisMesesAtras = new Date();
  doisMesesAtras.setMonth(hoje.getMonth() - 2);

  designacoes.forEach((desig) => {
    const dataReuniao = new Date(desig.data);

    if (dataReuniao >= doisMesesAtras && dataReuniao <= hoje) {
      for (const parte in desig.partes) {
        const ids = Array.isArray(desig.partes[parte])
          ? desig.partes[parte]
          : [desig.partes[parte]];
        if (ids.includes(participanteId)) {
          historico.push({
            data: desig.data,
            parte,
          });
        }
      }
    }
  });

  res.json({
    participanteId,
    total: historico.length,
    historico,
  });
});
