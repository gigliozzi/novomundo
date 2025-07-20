// src/app/admin/designacoes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DesignacoesPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [designacoes, setDesignacoes] = useState<any[]>([]);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) router.push("/login");
    setToken(stored);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/participantes", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setParticipantes);

      fetch("http://localhost:5000/api/designacoes", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setDesignacoes);
    }
  }, [token]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Editor de Designações</h1>

        <p className="text-sm mb-6 text-gray-600">
          Aqui você pode organizar as partes da reunião Vida e Ministério Cristão.
        </p>

        <form className="space-y-6">
          {/* Exemplo de entrada simples */}
          <div>
            <label className="block font-medium mb-1">Data da Reunião</label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Presidente</label>
              <select className="border rounded px-3 py-2 w-full">
                {participantes.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Oração Inicial</label>
              <select className="border rounded px-3 py-2 w-full">
                {participantes.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aqui podemos expandir parte por parte... */}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Salvar Designações
          </button>
        </form>
      </div>
    </main>
  );
}
