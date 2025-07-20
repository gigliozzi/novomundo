import * as fs from "fs-extra";
import path from "node:path";

interface BastidoresSemana {
  semana: string; // sempre o domingo da semana
  meioDeSemana: {
    audio: string;
    microfones: [string, string];
    indicadores: [string, string];
  };
  fimDeSemana: {
    audio: string;
    microfones: [string, string];
    indicadores: [string, string];
    presidente: string;
    orador: string;
    dirigenteSentinela: string;
    leitorSentinela: string;
  };
}

// 🟡 Exemplo manual de preenchimento inicial
const bastidores: BastidoresSemana[] = [
  {
    semana: "2025-06-08",
    meioDeSemana: {
      audio: "João Batista",
      microfones: ["Bruno Nunes", "César Barbosa"],
      indicadores: ["Júlio César", "Marcelo Milhomem"]
    },
    fimDeSemana: {
      audio: "Alipio Moura",
      microfones: ["Daniel Lessa", "Silvio César"],
      indicadores: ["Jorge Magalhães", "Iago de Lima"],
      presidente: "Elisom Santos",
      orador: "Márcio de Abadia",
      dirigenteSentinela: "Diego Nunes",
      leitorSentinela: "Mateus Talon"
    }
  },
  {
    semana: "2025-06-15",
    meioDeSemana: {
      audio: "Johnathan Teixeira",
      microfones: ["Samuel Leite", "Sebastião Paulo"],
      indicadores: ["Leonita Morais", "Railane Lima"]
    },
    fimDeSemana: {
      audio: "Maikon Farrad",
      microfones: ["Andressa Prestes", "Laiane Talon"],
      indicadores: ["Maria Vieira", "Jeovana Sousa"],
      presidente: "Hugo Martins",
      orador: "Vanildo Gomes",
      dirigenteSentinela: "William Gigliozzi",
      leitorSentinela: "Rauleni Santos"
    }
  }
];

// 🔄 Caminho de saída
const outputPath = path.join(__dirname, "../designacoes-geradas/bastidores.json");

// 🔁 Executa e grava o JSON
async function main() {
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJSON(outputPath, bastidores, { spaces: 2 });
  console.log("✅ Arquivo 'bastidores.json' gerado com sucesso em:", outputPath);
}

main();
