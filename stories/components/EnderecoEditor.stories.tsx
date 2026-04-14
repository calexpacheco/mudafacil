import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconPencil, IconAlertTriangle, IconCheck, IconArrowDown } from '@tabler/icons-react'

// EnderecoEditor usa useRouter e chamadas de API — criamos versão visual estática

interface ViewProps {
  enderecoOrigem: string
  enderecoDestino: string
  cotacoesResetadas?: boolean
}

interface EditProps {
  origem: string
  destino: string
  saveState?: 'idle' | 'saving' | 'error'
}

function EnderecoViewMode({ enderecoOrigem, enderecoDestino, cotacoesResetadas = false }: ViewProps) {
  return (
    <div className="flex flex-col gap-1 group">
      {cotacoesResetadas && (
        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-1 flex items-center gap-1.5">
          <IconCheck size={14} stroke={2} /> Endereços atualizados. Cotações resetadas — solicite novas cotações.
        </p>
      )}

      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Origem */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              A
            </div>
            <span className="text-base font-bold text-gray-900 truncate">{enderecoOrigem}</span>
          </div>

          <div className="flex items-center gap-2 pl-0.5">
            <div className="w-4 flex justify-center">
              <div className="w-0 border-l-2 border-dashed border-gray-300 h-3" />
            </div>
            <IconArrowDown size={12} stroke={1.5} className="text-gray-400" />
          </div>

          {/* Destino */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              B
            </div>
            <span className="text-base font-bold text-gray-900 truncate">{enderecoDestino}</span>
          </div>
        </div>

        {/* Botão de editar — sempre visível no storybook */}
        <button
          title="Editar endereços"
          className="mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"
        >
          <IconPencil size={16} stroke={1.5} />
        </button>
      </div>
    </div>
  )
}

function EnderecoEditMode({ origem, destino, saveState = 'idle' }: EditProps) {
  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-1.5">
        <IconAlertTriangle size={14} stroke={1.5} className="flex-shrink-0 mt-0.5" /> <span>Alterar os endereços vai <strong>resetar as cotações</strong> desta mudança.</span>
      </p>

      {/* Endereço A */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          A
        </div>
        <input
          defaultValue={origem}
          placeholder="Endereço de origem"
          className="flex-1 text-sm border border-blue-400 rounded-lg px-3 py-1.5 outline-none ring-2 ring-blue-300"
        />
      </div>

      {/* Seta */}
      <div className="flex items-center gap-2 pl-1">
        <div className="w-4 border-l-2 border-dashed border-gray-300 h-4 ml-1" />
      </div>

      {/* Endereço B */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
          B
        </div>
        <input
          defaultValue={destino}
          placeholder="Endereço de destino"
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
        />
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="submit"
          disabled={saveState === 'saving'}
          className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5 transition-colors"
        >
          {saveState === 'saving' ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar endereços'
          )}
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-gray-500 text-sm hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        {saveState === 'error' && (
          <span className="text-xs text-red-600 flex items-center gap-1"><IconAlertTriangle size={13} stroke={1.5} /> Erro ao salvar. Tente novamente.</span>
        )}
      </div>
    </form>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/EnderecoEditor',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
}

export default meta

// ─── Modo visualização ────────────────────────────────────────────────────────

export const ModoVisualizacao: StoryObj = {
  name: 'Modo visualização (hover para editar)',
  render: () => (
    <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Endereços da mudança</p>
      <EnderecoViewMode
        enderecoOrigem="Rua das Flores, 123 - São Paulo, SP"
        enderecoDestino="Av. Atlântica, 500 - Rio de Janeiro, RJ"
      />
    </div>
  ),
}

// ─── Modo edição ──────────────────────────────────────────────────────────────

export const ModoEdicao: StoryObj = {
  name: 'Modo edição (formulário aberto)',
  render: () => (
    <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Endereços da mudança</p>
      <EnderecoEditMode
        origem="Rua das Flores, 123 - São Paulo, SP"
        destino="Av. Atlântica, 500 - Rio de Janeiro, RJ"
      />
    </div>
  ),
}

// ─── Salvando ─────────────────────────────────────────────────────────────────

export const Salvando: StoryObj = {
  name: 'Estado — salvando',
  render: () => (
    <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Endereços da mudança</p>
      <EnderecoEditMode
        origem="Rua Augusta, 200 - São Paulo, SP"
        destino="Rua XV de Novembro, 1 - Curitiba, PR"
        saveState="saving"
      />
    </div>
  ),
}

// ─── Erro ao salvar ───────────────────────────────────────────────────────────

export const ErroAoSalvar: StoryObj = {
  name: 'Estado — erro ao salvar',
  render: () => (
    <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Endereços da mudança</p>
      <EnderecoEditMode
        origem="Rua Augusta, 200 - São Paulo, SP"
        destino="Rua XV de Novembro, 1 - Curitiba, PR"
        saveState="error"
      />
    </div>
  ),
}

// ─── Cotações resetadas ───────────────────────────────────────────────────────

export const CotacoesResetadas: StoryObj = {
  name: 'Após salvar — cotações resetadas',
  render: () => (
    <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">Endereços da mudança</p>
      <EnderecoViewMode
        enderecoOrigem="Rua Augusta, 200 - São Paulo, SP"
        enderecoDestino="Rua XV de Novembro, 1 - Curitiba, PR"
        cotacoesResetadas={true}
      />
    </div>
  ),
}

// ─── Todos os estados ─────────────────────────────────────────────────────────

export const TodosEstados: StoryObj = {
  name: 'Todos os estados',
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">1. Visualização</p>
        <EnderecoViewMode
          enderecoOrigem="Rua das Flores, 123 - SP"
          enderecoDestino="Av. Atlântica, 500 - RJ"
        />
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">2. Edição</p>
        <EnderecoEditMode
          origem="Rua das Flores, 123 - SP"
          destino="Av. Atlântica, 500 - RJ"
        />
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">3. Salvando...</p>
        <EnderecoEditMode
          origem="Rua Augusta, 200 - SP"
          destino="Rua XV de Novembro, 1 - PR"
          saveState="saving"
        />
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">4. Após salvar (cotações resetadas)</p>
        <EnderecoViewMode
          enderecoOrigem="Rua Augusta, 200 - SP"
          enderecoDestino="Rua XV de Novembro, 1 - PR"
          cotacoesResetadas={true}
        />
      </div>
    </div>
  ),
}
