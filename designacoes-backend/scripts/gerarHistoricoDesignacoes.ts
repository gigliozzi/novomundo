// scripts/gerarHistoricoDesignacoes.ts
import fs from "fs-extra";
import path from "node:path";

// Caminho para o JSON de designações
const designacoesPath = path.join(__dirname, "../data/designacoes.json");
const outputPath = path.join(__dirname, "../data/historico-participantes.json");

interface EntradaHistorico {
  nome: string;
  data: string;
  parte: string;
  sala: string;
}

export async function gerarHistoricoDesignacoes(): Promise<EntradaHistorico[]> {
  const designacoes = await fs.readJson(designacoesPath);
  const historico: EntradaHistorico[] = [];

  for (const semana of designacoes) {
    const { data, salas } = semana;

    for (const sala in salas) {
      const partes = salas[sala];

      for (const parte in partes) {
        const item = partes[parte];
        const participante = item?.participantes?.nome;
        const ajudante = item?.participantes?.ajudante;

        if (participante) {
          historico.push({ nome: participante, data, parte, sala });
        }
        if (ajudante) {
          historico.push({
            nome: ajudante,
            data,
            parte: `Ajudante em ${parte}`,
            sala,
          });
        }
      }
    }
  }

  return historico;
}

// 🟢 EXECUÇÃO: gera e salva no arquivo
async function main() {
  const historico = await gerarHistoricoDesignacoes();
  await fs.writeJson(outputPath, historico, { spaces: 2 });
  console.log("✔️ Histórico salvo em:", outputPath);
}

main().catch((err) => {
  console.error("❌ Erro ao gerar histórico:", err);
});
