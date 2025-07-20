import { NextResponse } from "next/server";
import fs from "fs-extra";
import path from "path";

const DESIGNACOES_PATH = path.join(process.cwd(), "src", "app", "data", "designacoes.json");

export async function POST(req: Request) {
  try {
    const novaDesignacao = await req.json(); // Espera: { data: "2025-06-26", salas: { ... } }

    if (!novaDesignacao?.data || !novaDesignacao?.salas) {
      return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
    }

    const listaAtual: any[] = await fs.readJson(DESIGNACOES_PATH);

    // Verifica se a data já existe
    const indexExistente = listaAtual.findIndex((item) => item.data === novaDesignacao.data);

    if (indexExistente !== -1) {
      // Substitui a designação existente
      listaAtual[indexExistente] = novaDesignacao;
    } else {
      // Adiciona nova semana
      listaAtual.push(novaDesignacao);
    }

    // Ordena pela data (opcional, mas útil)
    listaAtual.sort((a, b) => a.data.localeCompare(b.data));

    await fs.writeJson(DESIGNACOES_PATH, listaAtual, { spaces: 2 });

    return NextResponse.json({ sucesso: true });
  } catch (erro) {
    console.error("Erro ao salvar designação:", erro);
    return NextResponse.json({ erro: "Erro interno ao salvar." }, { status: 500 });
  }
}
