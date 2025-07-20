"use client";

import React, { useState } from "react";
import { Noto_Sans } from "next/font/google";
import designacoes from "../../../designacoes-backend/data/designacoes.json";
import { formatarIntervaloSemana } from "@/app/utils/formatarIntervaloSemana";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface Parte {
  id: number;
  titulo: string;
  nome: string;
  ajudante?: string;
  referencia?: string;
}

interface DesignacaoSemana {
  data: string;
  presidente: string;
  oracaoInicial: string;
  oracaoFinal: string;
  partes: Parte[];
  salas?: {
    [sala: string]: {
      [titulo: string]: {
        participantes: {
          nome: string;
          ajudante?: string;
        };
        referencia?: string;
      };
    };
  };
}

// ✅ Função para formatar data ISO para "4 de junho"
function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  return `${parseInt(dia)} de ${meses[+mes - 1]}`;
}

export default function HomePage() {
  const hoje = new Date();
  const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
  const diffSegunda =
    hoje.getDate() - (diaDaSemana === 0 ? 6 : diaDaSemana - 1);
  const segundaAtual = new Date(hoje.setDate(diffSegunda));
  const dataAtualSemana = segundaAtual.toISOString().split("T")[0]; // formato YYYY-MM-DD

  const [dataSelecionada, setDataSelecionada] = useState<string>(
    designacoes[0]?.data || ""
  );

  const bruta = designacoes.find((d) => d.data === dataSelecionada);

  const inicial: DesignacaoSemana = {
    data: bruta?.data || "",
    presidente:
      bruta?.salas?.["Salão principal"]?.["Presidente"]?.participantes?.nome ||
      "",
    oracaoInicial:
      bruta?.salas?.["Salão principal"]?.["Oração inicial"]?.participantes
        ?.nome || "",
    oracaoFinal:
      bruta?.salas?.["Salão principal"]?.["Oração final"]?.participantes
        ?.nome || "",
    partes: Object.entries(bruta?.salas?.["Salão principal"] || {})
      .filter(
        ([parte]) =>
          !["Presidente", "Oração inicial", "Oração final"].includes(parte)
      )
      .map(
        (
          [titulo, dados]: [
            string,
            {
              participantes?: { nome?: string; ajudante?: string };
              referencia?: string;
            }
          ],
          i
        ) => ({
          id: i + 1,
          titulo,
          nome: dados.participantes?.nome || "",
          ajudante: dados.participantes?.ajudante || "",
          referencia: dados.referencia || "",
        })
      ),
      salas: bruta?.salas || {},
  };

  const designacao: DesignacaoSemana = {
    data: bruta?.data || "",
    presidente:
      bruta?.salas?.["Salão principal"]?.["Presidente"]?.participantes?.nome ||
      "",
    oracaoInicial:
      bruta?.salas?.["Salão principal"]?.["Oração inicial"]?.participantes
        ?.nome || "",
    oracaoFinal:
      bruta?.salas?.["Salão principal"]?.["Oração final"]?.participantes
        ?.nome || "",
    partes: Object.entries(bruta?.salas?.["Salão principal"] || {})
      .filter(
        ([parte]) =>
          !["Presidente", "Oração inicial", "Oração final"].includes(parte)
      )
      .map(
        (
          [titulo, dados]: [
            string,
            {
              participantes?: { nome?: string; ajudante?: string };
              referencia?: string;
            }
          ],
          i
        ) => ({
          id: i + 1,
          titulo,
          nome: dados.participantes?.nome || "",
          ajudante: dados.participantes?.ajudante || "",
          referencia: dados.referencia || "",
        })
      ),
  };

  const ehSemanaAtual = dataSelecionada === dataAtualSemana;

  console.log("✅ designacao.salas", designacao?.salas);
  console.log("✅ designacao.salas['Sala B']", designacao?.salas?.["Sala B"]);

  return (
    <main
      className={`min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 ${notoSans.className}`}
    >
      <div
        className={`bg-white border ${
          ehSemanaAtual ? "border-blue-600" : "border-gray-300"
        } shadow-xl rounded-2xl w-full max-w-4xl p-6`}
      >
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Escolha o dia da semana: (sempre às quartas-feiras)
          </label>
          <select
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            {designacoes.map((d) => (
              <option key={d.data} value={d.data}>
                {formatarDataBR(d.data)}
                {d.data === dataAtualSemana ? " (Atual)" : ""}
              </option>
            ))}
          </select>
        </div>

        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800">
            {formatarIntervaloSemana(designacao.data)}
          </h1>
          <p className="text-blue-700 font-semibold uppercase text-lg mt-1">
            Provérbios 18
          </p>

          <p className="text-base mt-3">
            Presidente:{" "}
            <strong className="text-gray-900">{designacao.presidente}</strong>
          </p>

          <p className="text-base">
            Oração Inicial:{" "}
            <strong className="text-gray-900">
              {designacao.oracaoInicial}
            </strong>
          </p>

          <p className="text-sm text-gray-700 mt-2">
            🎵 <span className="text-blue-700 font-medium">Cântico 101</span> e
            oração
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-cyan-800 font-bold uppercase text-3xl flex items-center gap-2 mb-4">
            <span className="text-4xl">💎</span> Tesouros da Palavra de Deus
          </h2>

          <div className="space-y-4">
            {designacao.partes.slice(0, 3).map((parte) => (
              <div
                key={parte.id}
                className="p-4 bg-gray-50 rounded-md shadow-sm"
              >
                <p className="text-blue-900 font-semibold text-lg leading-snug">
                  {parte.id}. {parte.titulo}{" "}
                  <span className="text-gray-800 font-normal">
                    ({parte.nome})
                  </span>
                </p>

                {parte.referencia && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {parte.referencia}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-yellow-700 font-bold uppercase text-3xl flex items-center gap-2 mb-4">
            <span className="text-3xl">🍃</span> Faça seu melhor no ministério
          </h2>

          <div className="space-y-4">
            {designacao.partes.slice(3, 7).map((parte) => (
              <div
                key={parte.id}
                className="p-4 bg-yellow-50 rounded-md shadow-sm"
              >
                <p className="text-yellow-900 font-semibold text-lg leading-snug">
                  {parte.id}. {parte.titulo}{" "}
                  <span className="text-gray-800 font-normal">
                    ({parte.nome})
                  </span>
                </p>

                {parte.ajudante && (
                  <p className="text-sm text-gray-700 ml-4">
                    Ajudante:{" "}
                    <span className="font-medium">{parte.ajudante}</span>
                  </p>
                )}

                {parte.referencia && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {parte.referencia}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-red-700 font-bold uppercase text-3xl flex items-center gap-2 mb-4">
            <span className="text-3xl">🐑</span> Nossa Vida Cristã
          </h2>

          <p className="text-sm text-blue-700 mb-2">🎵 Cântico 21</p>

          <div className="space-y-4">
            {designacao.partes.slice(7, 9).map((parte) => (
              <div
                key={parte.id}
                className="p-4 bg-red-50 rounded-md shadow-sm"
              >
                <p className="text-red-900 font-semibold text-lg leading-snug">
                  {parte.id}. {parte.titulo}{" "}
                  <span className="text-gray-800 font-normal">
                    ({parte.nome})
                  </span>
                </p>

                {parte.ajudante && (
                  <p className="text-sm text-gray-700 ml-4">
                    Leitor:{" "}
                    <span className="font-medium">{parte.ajudante}</span>
                  </p>
                )}

                {parte.referencia && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    {parte.referencia}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t pt-4">
          <p className="text-sm mt-1 text-blue-700">🎵 Cântico 101</p>
          <p className="text-sm">
            Oração Final: <strong>{designacao.oracaoFinal}</strong>
          </p>
        </footer>

        {/* Sala B - se existir */}
        {designacao?.salas?.["Sala B"] && (
          <section className="mt-12">
            <h2 className="text-indigo-800 font-bold uppercase text-3xl flex items-center gap-2 mb-4">
              <span className="text-4xl">🅱️</span> Sala B
            </h2>

            <div className="space-y-4">
              {Object.entries(designacao.salas["Sala B"]).map(
                ([titulo, dados]: any, i) => (
                  <div
                    key={i}
                    className="p-4 bg-indigo-50 rounded-md shadow-sm border border-indigo-100"
                  >
                    <p className="text-indigo-900 font-semibold text-lg leading-snug">
                      {titulo}
                      {dados?.participantes?.nome && (
                        <span className="text-gray-800 font-normal">
                          {" "}
                          — {dados.participantes.nome}
                        </span>
                      )}
                    </p>

                    {dados?.participantes?.ajudante && (
                      <p className="text-sm text-gray-700 ml-4">
                        Ajudante:{" "}
                        <span className="font-medium">
                          {dados.participantes.ajudante}
                        </span>
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
