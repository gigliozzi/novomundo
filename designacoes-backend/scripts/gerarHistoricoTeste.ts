import { gerarHistoricoDesignacoes } from "./gerarHistoricoDesignacoes";

async function main() {
  const historico = await gerarHistoricoDesignacoes();
  console.log(historico.slice(0, 10)); // mostra as 10 primeiras linhas
}

main();
