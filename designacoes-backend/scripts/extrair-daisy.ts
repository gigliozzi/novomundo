import * as fs from "fs-extra";
import path from "node:path";
const AdmZip = require("adm-zip");
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

const zipPath = path.join(
  __dirname,
  "../apostilas/2025-mai-jun/mwb_T_202505.daisy.zip"
);
const outputJsonPath = path.join(
  __dirname,
  "../designacoes-geradas/mwb_202505.json"
);
const tempExtractDir = path.join(__dirname, "../tmp/extracao-daisy");

async function extrairZip() {
  if (fs.existsSync(tempExtractDir)) {
    await fs.remove(tempExtractDir);
  }
  fs.mkdirpSync(tempExtractDir);

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tempExtractDir, true);
}

function encontrarXml(): string | null {
  const arquivos = fs.readdirSync(tempExtractDir);

  for (const nome of arquivos) {
    if (nome.endsWith(".xml")) {
      return path.join(tempExtractDir, nome);
    }
  }
  return null;
}

function normalizarTexto(texto: string): string {
  return texto.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
}

function processarXml(xmlFilePath: string): any[] {
  const xmlRaw = fs.readFileSync(xmlFilePath, "utf-8");

  // 1. Limpar namespaces e DOCTYPE
  const xmlLimpo = xmlRaw
    .replace(/xmlns(:\w+)?="[^"]*"/g, "") // remove namespaces tipo xmlns="..."
    .replace(/<!DOCTYPE[^>]*>/g, "");     // remove DOCTYPE

  // 2. Carregar com Cheerio
  const $ = cheerio.load(xmlLimpo, { xmlMode: true });

  // 3. Extrair os blocos de semanas (cada <level1>)
  const semanas: any[] = [];

  $("level1").each((i, el) => {
    const $nivel1 = $(el);
    const tituloSemana = $nivel1.find("h1").first().text().trim();

    const partes = $nivel1.find("level2, level3").map((_, sec) => {
      const titulo = $(sec).find("h2,h3").first().text().trim();
      const paragrafo = $(sec).find("p").first().text().trim();
      return {
        titulo,
        conteudo: paragrafo,
      };
    }).get();

    semanas.push({
      dataTexto: tituloSemana,
      partes,
    });
  });

  return semanas;
}

async function main() {
  console.log("🟡 Extraindo arquivo ZIP...");
  await extrairZip();

  console.log("📄 Localizando XML...");
  const xmlPath = encontrarXml();
  if (!xmlPath) {
    console.error("❌ Nenhum arquivo .xml encontrado no zip extraído.");
    return;
  }

  console.log("🔍 Processando XML...");
  const dados = processarXml(xmlPath);

  console.log("💾 Salvando arquivo JSON...");
  fs.ensureDirSync(path.dirname(outputJsonPath));
  fs.writeJSONSync(outputJsonPath, dados, { spaces: 2 });

  console.log("✅ Concluído! Arquivo salvo em:", outputJsonPath);
}

main();
