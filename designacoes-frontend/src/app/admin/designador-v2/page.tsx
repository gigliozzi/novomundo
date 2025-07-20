// src/app/admin/designador-v2/page.tsx
"use client";

import { useState } from "react";
import participantes from "../../../../../designacoes-backend/data/participantes.json"; // novo
import historico from "../../../../../designacoes-backend/data/historico-participantes.json"; // novo
import { dir } from "console";

interface Participante {
  nome: string;
  tipo: "anciao" | "servo" | "publicador" | "publicadora";
  apto: boolean;
  genero: "masculino" | "feminino";
}

interface Historico {
  nome: string;
  data: string;
  parte: string;
  sala: string;
}

const restricoesPorIndice: Record<number, Participante["tipo"][]> = {
  0: ["anciao"], // Parte 1: Artigo
  1: ["anciao", "servo"], // Parte 2: Joias
  2: ["servo", "publicador"], // Parte 3: Leitura da Bíblia
  3: ["publicadora"], // Parte 4
  4: ["publicadora"], // Parte 5
  5: ["publicadora"], // Parte 6
  6: ["anciao", "servo", "publicador", "publicadora"], // Parte 7
  7: ["anciao"], // Parte 8: Necessidades Locais
  8: ["anciao", "servo"], // Parte 9: Estudo Bíblico
};



//Restrições de tipos para garantir que os participantes sejam válidos
const restricoesPorParte: Record<string, Participante["tipo"][]> = {
  Presidente: ["anciao"],
  "Oração Inicial": ["anciao", "servo", "publicador"],
  "Tesouros": ["anciao"],
  "Joias": ["anciao", "servo"],
  "Leitura da Bíblia": ["servo", "publicador"],
  "4. Iniciando conversas": ["publicadora"],
  "4. Iniciando conv. (ajudante)": ["publicadora"],
  "5. Cultivando o interesse (TP)": ["publicadora"],
  "6. Cultivando o interesse (TI)": ["publicadora"],
  "7. Explicando suas crenças": [
    "anciao",
    "servo",
    "publicador",
    "publicadora",
  ],
  "8. Necessidades Locais ou artigo": ["anciao"],
  "9. Estudo bíblico de congregação": ["anciao", "servo"],
  Leitor: ["anciao", "servo", "publicador"],
  "Oração final": ["anciao", "servo", "publicador"],
  Dirigente: ["anciao"],
  "Operador Áudio/Vídeo": ["servo"],
  "Indicador 1": ["anciao", "servo"],
  "Indicador 2": ["anciao", "servo"],
  "Mic 1": ["anciao", "servo"],
  "Mic 2": ["anciao", "servo"],
};

// Força o filtro e o mapeamento dos valores válidos
const listaParticipantes: Participante[] = participantes.filter(
  (p): p is Participante =>
    ["anciao", "servo", "publicador", "publicadora"].includes(p.tipo) &&
    ["masculino", "feminino"].includes(p.genero) &&
    typeof p.apto === "boolean" &&
    typeof p.nome === "string"
);

const restricoesPorParteId: Record<string, Participante["tipo"][]> = {
  presidente: ["anciao"], 
  0:   ["anciao","servo","publicador"], // Leitor
  1:   ["anciao", "servo"], // Introdução Tesouros
  2:   ["anciao", "servo"], // Joias Espirituais
  3:   ["servo", "publicador"], // Leitura da Bíblia
  4:   ["publicadora"], // Iniciando conversas ou cultivando o interesse
  5:   ["publicadora"], //  Iniciando conversas ou cultivando o interesse
  6:   ["publicadora"], //  Iniciando conversas ou cultivando o interesse
  7:   ["publicadora","publicador","servo"], //  Explicando suas crenças ou Discurso
  8:   ["anciao"], // Parte 8: Necessidades Locais
  9:   ["anciao", "servo"], // Parte 9: Estudo Bíblico
  10:  ["servo", "publicador"], // Audio/Vídeo
};

export default function DesignadorV2Page() {
  const [dataSelecionada, setDataSelecionada] = useState("");
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Editor de Designações</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escolha a data da reunião
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </div>

        {/* Grade principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salão Principal */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Salão Principal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectCampo label="Presidente" parteId="presidente" historico={historico}/>
                <SelectCampo label="Oração Inicial" parteId="0" historico={historico} />
              </div>
              <SelectCampo label="Tesouros da Palavra de Deus" parteId="1" historico={historico} />
              <SelectCampo label="Joias Espirituais" parteId="2" historico={historico} />
              <SelectCampo label="Leitura da Bíblia" parteId="3" historico={historico} />
              <div className="grid grid-cols-2 gap-4">
                <SelectCampo label="4. Iniciando conversas" parteId="4" historico={historico} />
                <SelectCampo label="4. Iniciando conv. (ajudante)" parteId="4" historico={historico} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectCampo label="5. Cultivando Interesse" parteId="5" historico={historico} />
                <SelectCampo label="5. Cultivando Int. (ajudante)" parteId="5" historico={historico} />
              </div>              
              <SelectCampo label="Discurso" parteId="3" historico={historico} />
              <SelectCampo label="Seja paciente, mas não aceite mau comportamento" parteId="7" historico={historico} />
              <SelectCampo label="Estudo bíblico de congregação" parteId="8" historico={historico} />
              <SelectCampo label="Leitor" parteId="3" historico={historico} />
              <SelectCampo label="Oração final" parteId="0" historico={historico} />
            </div>
          </div>

          {/* Sala B */}
          <div className="rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Sala B</h2>
            <div className="space-y-4">
              <SelectCampo label="Dirigente" parteId="presidente" historico={historico} />
              <SelectCampo label="3. Leitura da Bíblia" parteId="3" historico={historico} />
              <div className="grid grid-cols-2 gap-4">
                <SelectCampo label="4. Iniciando conversas" parteId="4" historico={historico} />
                <SelectCampo label="4. Iniciando conv. (ajudante)" parteId="4" historico={historico} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectCampo label="5. Cultivando Interesse" parteId="5" historico={historico} />
                <SelectCampo label="5. Cultivando Int. (ajudante)" parteId="5" historico={historico} />
              </div>              
              <SelectCampo label="6. Discurso" parteId="6" historico={historico} />

              <SelectCampo label="Operador Áudio/Vídeo" parteId="10" historico={historico} />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <SelectCampo label="Indicador 1" parteId="0" historico={historico} />
                <SelectCampo label="Indicador 2" parteId="0" historico={historico} />
                <SelectCampo label="Mic 1" parteId="0" historico={historico} />
                <SelectCampo label="Mic 2" parteId="0" historico={historico} />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end mt-6 gap-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Cancelar
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Salvar Designações
          </button>
        </div>
      </div>
    </main>
  );
}

// @@@@ Função SelectCampo @@@@@ -----
function SelectCampo({
  label,
  parteId,
  historico,
}: {
  label: string;
  parteId: string
  historico: Historico[];
}) {
  console.log("Historico recebido:", historico);
  console.log("Participantes filtrados:", participantes);

  const [selectedName, setSelectedName] = useState("");

  const tiposPermitidos = restricoesPorParteId[parteId] || [
    "anciao","servo","publicador","publicadora",
  ];

  const participantesFiltrados = listaParticipantes.filter(
    (p) => tiposPermitidos.includes(p.tipo) && p.apto
  );

  const historicoDoSelecionado = selectedName
    ? historico
        .filter(
          (h) =>
            h.nome.trim().toLowerCase() === selectedName.trim().toLowerCase()
        )
        .sort((a, b) => b.data.localeCompare(a.data))
        .slice(0, 4)
    : [];

  const oitoSemanasAtras = new Date();
  oitoSemanasAtras.setDate(oitoSemanasAtras.getDate() - 56);

  // Participantes com designação recente
  const nomesComDesignacaoRecente = historico
    .filter((h) => new Date(h.data) >= oitoSemanasAtras)
    .map((h) => h.nome);
  console.log("Nomes com designação recente:", nomesComDesignacaoRecente);  

  // Sugestões de participantes aptos que não aparecem nas designações recentes
  const sugestoes = participantesFiltrados.filter(
    (p) => !nomesComDesignacaoRecente.includes(p.nome)
  );

  console.log("🔍 Participante selecionado:", selectedName);
  console.log("🧾 Histórico correspondente:", historicoDoSelecionado);
  console.log("💡 Sugestoes:", sugestoes);

  return (
    <div>
      <label className="block text-base font-bold text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={selectedName}
        onChange={(e) => {
          console.log("Selecionado:", e.target.value);
          setSelectedName(e.target.value);
        }}
      >
        <option value="">Selecione</option>
        {participantesFiltrados.map((p) => (
          <option key={p.nome} value={p.nome}>
            {p.nome}
          </option>
        ))}
      </select>
      

      {/* Filtro que mostra o historico do participante @- SELECIONADO NO SELECT -@ na parte designada*/}
      {selectedName && (
        <div className="mt-2 text-xs text-blue-800 bg-blue-50 p-2 rounded border border-blue-200">
          <p className="font-semibold mb-1">🧾 Histórico nesta parte:</p>
          {historico.filter(
            (h) =>
              h.nome === selectedName &&
              h.parte.toLowerCase().includes(label.toLowerCase())
          ).length > 0 ? (
            <ul className="list-disc ml-4">
              {historico
                .filter(
                  (h) =>
                    h.nome === selectedName &&
                    h.parte.toLowerCase().includes(label.toLowerCase())
                )
                .sort((a, b) => b.data.localeCompare(a.data))
                .slice(0, 10)
                .map((h, i) => (
                  <li key={i}>
                    {h.data} — {h.parte}{" "}
                    <span className="italic text-gray-500">({h.sala})</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p>
              Este participante não foi designado nesta parte nas últimas 8
              semanas.
            </p>
          )}
        </div>
      )}

      {selectedName && historicoDoSelecionado.length > 0 && (
        <div className="mt-2 text-xs bg-yellow-100 border border-yellow-400 text-black p-2 rounded shadow-lg">
          <p className="font-semibold mb-1">Histórico recente de outras partes:</p>
          <ul className="list-disc ml-4">
            {historicoDoSelecionado.map((h, i) => (
              <li key={i}>
                {h.data} — {h.parte}{" "}
                <span className="italic text-gray-500">({h.sala})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      

      {!selectedName && (
        <div className="mt-2 text-xs text-indigo-800 bg-indigo-50 p-2 rounded border border-indigo-200">
          <p className="font-semibold mb-1">
            💡 Sugestões (Não recebem designações para ESTA PARTE há mais de 8 semanas):
          </p>
          <ul className="list-disc ml-4">
            {participantesFiltrados
              .filter((p) => {
                const historicoNaParte = historico.find(
                  (h) =>
                    h.nome === p.nome &&
                    h.parte.toLowerCase().includes(label.toLowerCase())
                );
                return !historicoNaParte;
              })
              .slice(0, 8) // mostra só os 6 primeiros
              .map((p) => (
                <li key={p.nome}>{p.nome}</li>
              ))}
          </ul>
        </div>
      )}

      {sugestoes.length > 0 && (
        <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
          <p className="font-semibold mb-1">
            ⚠️ Sugestões (Não recebem NENHUMA designação há mais de 8 semanas):
          </p>
          <ul className="list-disc ml-4">
            {sugestoes.slice(0, 10).map((p) => (
              <li key={p.nome}>{p.nome}</li>
            ))}
          </ul>
        </div>
      )}

      
    </div>
  );
}
