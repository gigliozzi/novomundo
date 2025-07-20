// src/app/admin/designador/page.tsx
"use client";

import React, { useState } from "react";
import { Noto_Sans } from "next/font/google";
import participantes from "@/app/data/participantes.json";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function DesignacaoPage() {
  const [presidente, setPresidente] = useState("");
  const [oracaoInicial, setOracaoInicial] = useState("");
  const [partes, setPartes] = useState<{ [key: string]: { nome: string; ajudante?: string } }>({});

  const validar = (p: any, filtro: string) => {
    if (!p.apto) return false;
    switch (filtro) {
      case "anciãos": return p.tipo === "anciao";
      case "publicadores homens": return ["anciao", "servo", "publicador"].includes(p.tipo) && p.genero === "masculino";
      case "livre": return true;
      case "anciãos preferencialmente": return true;
      case "irmãs preferencialmente": return p.genero === "feminino";
      default: return false;
    }
  };

  const verificarRepetido = (nome: string, parteAtual: string) => {
    return Object.entries(partes).some(([chave, dados]) =>
      chave !== parteAtual && dados.nome === nome
    );
  };

  const renderSelect = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    filtro: string,
    includeAjudante: boolean = false,
    ajudanteValue: string = "",
    onAjudanteChange: (v: string) => void = () => {},
    parteId: string = ""
  ) => (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="">Selecione</option>
          {participantes.filter(p => validar(p, filtro)).map((p, idx) => (
            <option key={idx} value={p.nome}>
              {p.nome}{verificarRepetido(p.nome, parteId) ? " ⚠️ já designado" : ""}
            </option>
          ))}
        </select>
        {includeAjudante && (
          <select
            value={ajudanteValue}
            onChange={(e) => onAjudanteChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Ajudante</option>
            {participantes.filter(p => p.apto).map((p, idx) => (
              <option key={idx} value={p.nome}>{p.nome}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );

  const updateParte = (parte: string, campo: "nome" | "ajudante", valor: string) => {
    setPartes((prev) => ({
      ...prev,
      [parte]: {
        ...prev[parte],
        [campo]: valor
      }
    }));
  };

  return (
    <main className={`min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 ${notoSans.className}`}>
      <div className="bg-white border border-gray-300 shadow-xl rounded-2xl w-full max-w-4xl p-6">
        <h1 className="text-xl font-semibold mb-6">Editor de Designações</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderSelect("Presidente", presidente, setPresidente, "anciãos", false, "", () => {}, "presidente")}
          {renderSelect("Oração Inicial", oracaoInicial, setOracaoInicial, "publicadores homens", false, "", () => {}, "oracaoInicial")}
        </div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Partes 1 a 9</h2>
        <div className="space-y-4">
          {renderSelect("1. Tesouros da Palavra de Deus", partes["1"]?.nome || "", (v) => updateParte("1", "nome", v), "anciãos preferencialmente", false, "", () => {}, "1")}
          {renderSelect("2. Joias espirituais", partes["2"]?.nome || "", (v) => updateParte("2", "nome", v), "livre", false, "", () => {}, "2")}
          {renderSelect("3. Leitura da Bíblia", partes["3"]?.nome || "", (v) => updateParte("3", "nome", v), "livre", false, "", () => {}, "3")}
          {renderSelect("4. Iniciando conversas", partes["4"]?.nome || "", (v) => updateParte("4", "nome", v), "irmãs preferencialmente", true, partes["4"]?.ajudante || "", (v) => updateParte("4", "ajudante", v), "4")}
          {renderSelect("5. Cultivando o interesse", partes["5"]?.nome || "", (v) => updateParte("5", "nome", v), "irmãs preferencialmente", true, partes["5"]?.ajudante || "", (v) => updateParte("5", "ajudante", v), "5")}
          {renderSelect("6. Discurso", partes["6"]?.nome || "", (v) => updateParte("6", "nome", v), "livre", false, "", () => {}, "6")}
          {renderSelect("7. Necessidades locais", partes["7"]?.nome || "", (v) => updateParte("7", "nome", v), "anciãos preferencialmente", false, "", () => {}, "7")}
          {renderSelect("8. Vida cristã", partes["8"]?.nome || "", (v) => updateParte("8", "nome", v), "anciãos", false, "", () => {}, "8")}
          {renderSelect("9. Estudo bíblico de congregação", partes["9"]?.nome || "", (v) => updateParte("9", "nome", v), "anciãos preferencialmente", true, partes["9"]?.ajudante || "", (v) => updateParte("9", "ajudante", v), "9")}
        </div>
      </div>
    </main>
  );
}
