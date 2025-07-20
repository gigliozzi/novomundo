// Script: gerar_pdf_folha_geral.js
// Objetivo: Gerar automaticamente a folha geral de designações da semana como PDF

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const data = "2025-06-04"; // Altere conforme a semana desejada
  const url = `http://localhost:5000/api/designacoes/${data}/geral`;
  const nomeArquivo = `folha-geral-${data}.pdf`;

  console.log(`Gerando PDF da folha geral da semana de ${data}...`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  // Gera o PDF e salva no diretório "pdfs"
  const pdfDir = path.join(__dirname, "pdfs");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

  const caminhoCompleto = path.join(pdfDir, nomeArquivo);
  await page.pdf({
    path: caminhoCompleto,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF gerado com sucesso: ${caminhoCompleto}`);
})();
