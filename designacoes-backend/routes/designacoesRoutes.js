const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { verificarToken, verificarAdmin } = require("../middleware/auth");
const DESIGNACOES_FILE = path.join(__dirname, "../data/designacoes.json");
const PARTICIPANTES_FILE = path.join(__dirname, "../data/participantes.json");

// Validações auxiliares
function carregarParticipantes() {
  const raw = fs.readFileSync(PARTICIPANTES_FILE);
  return JSON.parse(raw);
}

// Carrega os participantes e verifica se o ID existe (não está sendo usado)
function participantePorId(id) {
  return carregarParticipantes().find((p) => p.id === id);
}

// POST /api/designacoes (admin)
router.post("/", verificarToken, verificarAdmin, (req, res) => {
  const { data, partes, origem } = req.body;
  const designacoesRaw = fs.readFileSync(DESIGNACOES_FILE);
  const designacoes = JSON.parse(designacoesRaw);

  if (!data || !partes || typeof partes !== "object") {
    return res.status(400).json({ msg: "Dados insuficientes ou inválidos." });
  }

  const usados = new Set();

  for (const parte in partes) {
    const info = partes[parte];
    if (!info?.participantes?.nome) {
      return res
        .status(400)
        .json({ msg: `Participante principal ausente na parte "${parte}".` });
    }

    const participante = carregarParticipantes().find(
      (p) => p.nome === info.participantes.nome
    );
    if (!participante) {
      return res.status(400).json({
        msg: `Participante ${info.participantes.nome} não encontrado.`,
      });
    }

    if (!participante.aprovado) {
      return res
        .status(400)
        .json({ msg: `${participante.nome} não está aprovado.` });
    }

    // Partes restritas a anciãos
    if (
      (parte === "7. Vida cristã" || parte === "8. Estudo Bíblico") &&
      participante.categoria !== "ancião"
    ) {
      return res.status(400).json({
        msg: `${participante.nome} não pode ser designado para "${parte}".`,
      });
    }

    const chave = `${data}_${participante.nome}`;
    if (usados.has(chave)) {
      console.warn(
        `⚠️ ${participante.nome} já está designado em outra parte neste dia.`
      );
    }

    usados.add(chave);
  }

  designacoes.push({ data, origem, partes });
  fs.writeFileSync(DESIGNACOES_FILE, JSON.stringify(designacoes, null, 2));

  res.status(201).json({ msg: "Designações salvas com sucesso!" });
});

function normalizarData(dataISO) {
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

// Rota para obter designações S-89
router.get("/s89/:data", verificarToken, verificarAdmin, (req, res) => {
  const { data } = req.params;
  const designacoesRaw = fs.readFileSync(DESIGNACOES_FILE);
  const designacoes = JSON.parse(designacoesRaw);

  console.log("Solicitado:", data);
  console.log("Datas disponíveis no JSON:");

  const registro = designacoes.find((d) => d.data === data);

  if (!registro) {
    console.log("🔴 Registro não encontrado para:", data);
    return res
      .status(404)
      .json({ msg: `Nenhuma designação encontrada para a data ${data}` });
  }

  const partesAlvo = [
    "Tesouros",
    "Faça melhor",
    "Vida Cristã",
  ];

  const resultado = [];

  for (const sala in registro.salas) {
    const partes = registro.salas[sala];

    for (const parte in partes) {
      if (partesAlvo.some((p) => parte.includes(p))) {
        const info = partes[parte];
        resultado.push({
          parte,
          nome: info.participantes?.nome || "",
          ajudante: info.participantes?.ajudante || "",
          local: sala,
          referencia: info.referencia || "",
        });
      }
    }
  }

  res.json({
    data: registro.data,
    total: resultado.length,
    designacoes: resultado,
  });
});

// Rota para gerar HTML das designações S-89
router.get("/s89/:data/html", (req, res) => {
  const { data } = req.params;
  console.log("[ROTA S89] Data recebida:", `"${data}"`);
  const designacoesRaw = fs.readFileSync(DESIGNACOES_FILE);
  const designacoes = JSON.parse(designacoesRaw);

  const registro = designacoes.find((d) => d.data === data);

  if (!registro) {
    return res
      .status(404)
      .send(`<p>Nenhuma designação encontrada para ${data}</p>`);
  }

  const partesAlvo = [
    "Tesouros",
    "Faça melhor",
    "Vida Cristã",    
  ];

  const blocos = [];

  for (const sala in registro.salas) {
    const partes = registro.salas[sala];

    for (const parte in partes) {
      if (partesAlvo.some((p) => parte.startsWith(p))) {
        const info = partes[parte];
        blocos.push(`
          <div class="card">
            <div class="titulo">DESIGNAÇÃO PARA A REUNIÃO NOSSA VIDA E MINISTÉRIO CRISTÃO</div>
            <div class="campo"><strong>Nome:</strong> ${
              info.participantes?.nome || ""
            }</div>
            <div class="campo"><strong>Ajudante:</strong> ${
              info.participantes?.ajudante || ""
            }</div>
            <div class="campo"><strong>Data:</strong> ${new Date(
              data
            ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</div>
            <div class="campo"><strong>Número da parte:</strong> ${parte}</div>
            <div class="local">
              <label class="checkbox"><input type="checkbox" ${
                sala === "Salão principal" ? "checked" : ""
              }/> Salão principal</label>
              <label class="checkbox"><input type="checkbox" ${
                sala === "Sala B" ? "checked" : ""
              }/> Sala B</label>
              
            </div>
            <div class="obs">
              Observação para o estudante: A lição e a fonte de matéria para a sua designação estão na <b>Apostila Vida e Ministério</b>. Veja as instruções na S-38.
            </div>
          </div>
        `);
      }
    }
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Designações S-89-T</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; }
        .page { display: flex; flex-wrap: wrap; justify-content: none; page-break-after: always; break-after: page; }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .pagina {
            page-break-after: always;
            break-after: page;
          }
          .evita-quebra {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          /* Ajustar tamanho da página (A4, retrato) */
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
        }                
        .card {
          width: 48%;
          border: 0.25px solid #000;
          padding: 1rem;
          margin-bottom: 0rem;
          height: 330px;
          box-sizing: border-box;
          page-break-inside: avoid; /* Evita que o card seja quebrado */
          break-inside: avoid; /* Para navegadores mais novos */
        }
        .titulo { font-weight: bold; margin-bottom: 0.5rem; }
        .campo { margin-bottom: 0.5rem; }
        .local { margin-top: 1rem; }
        .checkbox { margin-right: 1rem; }
        .obs { font-size: 0.9rem; margin-top: 1rem; }
      </style>
    </head>
    <body>
    <button onclick="window.print()">🖨️ Imprimir</button>
      <div class="page">
        ${blocos.join("\n")}
      </div>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Rota para gerar Folha geral da semana
router.get("/geral/:data", (req, res) => {
  const { data } = req.params;
  console.log("[ROTA GERAL] Data recebida:", `"${data}"`);
  const designacoesRaw = fs.readFileSync(DESIGNACOES_FILE);
  const designacoes = JSON.parse(designacoesRaw);

  // Depuração
  console.log("Data solicitada:", data);
  console.log("Datas disponíveis no JSON:");
  designacoes.forEach((d) => console.log("-", d.data));

  console.log("Data recebida no req.params:", `"${data}"`);
  console.log("Comparando com registro.data:");
  designacoes.forEach((d) =>
    console.log(`"${d.data}" === "${data}" =>`, d.data === data)
  );

  const registro = designacoes.find((d) => d.data === data);

  if (!registro) {
    return res
      .status(404)
      .send(`<p>Nenhuma designação encontrada para ${data}</p>`);
  }

  const partesAlvo = [
    "3. Leitura da Bíblia",
    "4. Iniciando conversas",
    "5. Cultivando o interesse",
    "6. Discurso",
  ];

  const blocos = [];

  for (const sala in registro.salas) {
    const partes = registro.salas[sala];

    for (const parte in partes) {
      if (partesAlvo.some((p) => parte.startsWith(p))) {
        const info = partes[parte];
        const nome = info.participantes?.nome || "";
        const ajudante = info.participantes?.ajudante
          ? ` / ${info.participantes.ajudante}`
          : "";
        const local = sala || "";
        const referencia = info.referencia ? ` (${info.referencia})` : "";

        blocos.push(`
        <tr>
          <td>${parte}</td>
          <td>${nome}${ajudante}</td>
          <td>${local}</td>
          <td>${referencia}</td>
        </tr>
      `);
      }
    }
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Designações - ${data}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        h1 { text-align: center; margin-bottom: 2rem; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          border: 1px solid #999;
          padding: 0.6rem;
          text-align: left;
        }
        th {
          background-color: #eee;
        }
      </style>
    </head>
    <body>
      <h1>Designações – Semana de ${new Date(data).toLocaleDateString(
        "pt-BR"
      )}</h1>
      <table>
        <thead>
          <tr>
            <th>Parte</th>
            <th>Participantes</th>
            <th>Local</th>
            <th>Referência</th>
          </tr>
        </thead>
        <tbody>
          ${blocos.join("\n")}
        </tbody>
      </table><br>
      <button onclick="window.print()">Imprimir folha geral</button>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Rota para obter as designações da semana mais recente
router.get("/semana", (req, res) => {
  const raw = fs.readFileSync(DESIGNACOES_FILE);
  const todas = JSON.parse(raw);

  if (!Array.isArray(todas) || todas.length === 0) {
    return res.status(404).json({ msg: "Nenhuma designação encontrada" });
  }

  // Ordena por data descendente (mais recente primeiro)
  const ultima = todas
    .slice()
    .sort((a, b) => new Date(b.data) - new Date(a.data))[0];

  res.json(ultima);
});

module.exports = router;
