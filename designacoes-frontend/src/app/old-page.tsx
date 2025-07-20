// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.msg || 'Erro ao fazer login')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setErro(err.message)
    }
  }
console.log("Renderizando: @>> src/app/page.tsx")
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Acesso Administrativo</h1>

        {erro && <p className="text-red-600 mb-4 text-sm">{erro}</p>}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-6 p-2 border border-gray-300 rounded"
          required
        />

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
