// src/app/login/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  // Correção: evita qualquer renderização antes da montagem do cliente
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Falha no login')

      localStorage.setItem('token', data.token)
      localStorage.setItem('nome', data.user.nome);
      router.push('/admin/dashboard')
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado')
    }
  }
  console.log("Renderizando: Página de Login")

  if (!mounted) return null // 🔐 garante que o HTML será idêntico no server e no client

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md p-6 rounded max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Acessar o sistema</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="password" // 🔐 fixo! evita variações no SSR/CSR
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-6 p-2 border border-gray-300 rounded"
          required
        />

        {erro && <p className="text-red-600 text-sm mb-4">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </main>
  )
}
