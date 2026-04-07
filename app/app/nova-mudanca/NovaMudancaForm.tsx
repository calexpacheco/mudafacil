'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NovaMudancaForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      enderecoOrigem: formData.get('enderecoOrigem'),
      enderecoDestino: formData.get('enderecoDestino'),
      dataDesejada: formData.get('dataDesejada') || null,
    }

    const res = await fetch('/api/mudancas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erro ao criar mudança')
      setLoading(false)
      return
    }

    const { id } = await res.json()
    router.push(`/app/mudanca/${id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-200">
      <Field
        name="enderecoOrigem"
        label="Endereço de origem"
        placeholder="Rua, número, bairro, cidade"
        required
      />
      <Field
        name="enderecoDestino"
        label="Endereço de destino"
        placeholder="Rua, número, bairro, cidade"
        required
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Data desejada (opcional)</label>
        <input
          name="dataDesejada"
          type="date"
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Criando...' : 'Começar planejamento →'}
      </button>
    </form>
  )
}

function Field({ name, label, placeholder, required }: {
  name: string
  label: string
  placeholder: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        required={required}
        className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
