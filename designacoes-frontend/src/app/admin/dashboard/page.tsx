// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ptBR } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Designacao {
  parte: string;
  nome: string;
  ajudante?: string;
  local: string;
  referencia?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [designacoes, setDesignacoes] = useState<Designacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null); // antes
  const [token, setToken] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  // Dentro do componente:
const [aberto, setAberto] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);


  // Função para formatar a data no formato YYYY-MM-DD (mas não está dando certo)
  function formatarDataISO(date: Date): string {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  // Primeiro UseEffect: carregada o token
  useEffect(() => {
    if (typeof window === "undefined") return; // garante que só rode no client

    const storedToken = localStorage.getItem("token");
    const storedNome = localStorage.getItem("nome");
    console.log("🔎 Nome encontrado no localStorage:", storedNome);
    setNome(storedNome);

    if (!storedToken) {
      console.warn("⚠️ Token ausente — redirecionando para login");
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setDataSelecionada(new Date(2025, 5, 4)); // junho é mês 5
  }, [router]);
  // Fim do primeiro useEffect

  // Segundo useEffect: busca designações após token e data estarem prontos
  useEffect(() => {
    if (!token || !dataSelecionada) return;

    async function fetchDesignacoes() {
      setCarregando(true);
      try {
        const dataFormatada = dataSelecionada
          ? formatarDataISO(dataSelecionada)
          : "";
        console.log(
          "Buscando designações para [dentro do fecth]:",
          dataFormatada
        );
        const res = await fetch(
          `http://localhost:5000/api/designacoes/s89/${dataFormatada}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Erro ao buscar designações");
        const json = await res.json();
        console.log("🔎 JSON recebido do backend:", json);

        if (!json.designacoes || !Array.isArray(json.designacoes)) {
          throw new Error("### Resposta inválida do servidor ###");
        }
        setDesignacoes(json.designacoes);
        setErro(""); // ✅ limpa o erro anterior
      } catch (err: any) {
        setErro(err.message || "Erro inesperado");
      } finally {
        setCarregando(false);
      }
    }

    fetchDesignacoes();
  }, [token, dataSelecionada]);
  // Fim do segundo useEffect

  const dataFormatada = dataSelecionada ? formatarDataISO(dataSelecionada) : "";
  console.log("Buscando designações para [fora do fetch]:", dataFormatada);

  // Terceiro useEffect: para lidar com o dropdown
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setAberto(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Renderiza o Painel Administrativo
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4 relative">
        <div className="relative" ref={dropdownRef}>
  <button
    onClick={() => setAberto(!aberto)}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    {nome} ⌄
  </button>

  {aberto && (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
      <button
        onClick={() => {
          setAberto(false);
          router.push("/admin/dashboard");
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        ⚙️ Painel
      </button>
      <button
        onClick={() => {
          const sair = confirm("Deseja realmente sair?");
          if (sair) {
            localStorage.removeItem("token");
            router.push("/login");
          }
        }}
        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
      >
        🚪 Sair
      </button>
    </div>
  )}
</div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Painel Administrativo</h1>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Escolha a data da reunião:
          </label>
          <DatePicker
            locale={ptBR}
            selected={dataSelecionada}
            onChange={(date) => {
              if (date) {
                // 🛑 Força a hora para evitar UTC→-3 = dia anterior
                const corrigida = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  12
                );
                setDataSelecionada(corrigida);
                console.log("Data recebida do DatePicker:", corrigida);
              }
            }}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>

        {/* Botões do painel administrativo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded p-4">
            <button
              onClick={() => {
                if (!dataSelecionada) {
                  return alert("Selecione uma data válida");
                }
                const dataFormatada = formatarDataISO(dataSelecionada);
                console.log(">>> ENVIANDO REQUISIÇÃO PARA:", dataFormatada);
                window.open(
                  `http://localhost:5000/api/designacoes/geral/${dataFormatada}/`,
                  "_blank"
                );
              }}
              className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Abrir folha geral
            </button>
          </div>

          <div className="bg-white shadow rounded p-4">
            <button
              onClick={() =>
                window.open(
                  `http://localhost:5000/api/designacoes/s89/${dataFormatada}/html`,
                  "_blank"
                )
              }
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Abrir modelo S-89-T
            </button>
          </div>
        </div>

        {/* Designações da Semana */}
        <section className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Designações da Semana</h2>
          {carregando ? (
            <p>Carregando...</p>
          ) : erro ? (
            <p className="text-red-600">{erro}</p>
          ) : (
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Parte</th>
                  <th className="p-2 border">Nome</th>
                  <th className="p-2 border">Ajudante</th>
                  <th className="p-2 border">Local</th>
                  <th className="p-2 border">Referência</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(designacoes) &&
                  designacoes.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 border">{d.parte}</td>
                      <td className="p-2 border">{d.nome}</td>
                      <td className="p-2 border">{d.ajudante || "-"}</td>
                      <td className="p-2 border">{d.local}</td>
                      <td className="p-2 border">{d.referencia || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
