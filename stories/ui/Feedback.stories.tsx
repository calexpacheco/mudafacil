import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta = {
  title: 'UI/Feedback',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const Alerts: StoryObj = {
  name: 'Alertas',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Alertas & Mensagens</h2>
        <p className="text-sm text-gray-500 mb-8">
          Padrões de feedback usados em toda a interface.
        </p>

        <div className="flex flex-col gap-4">
          {/* Success */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
            <span className="text-green-500 text-lg">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Mudança salva com sucesso!</p>
              <p className="text-xs text-green-600 mt-0.5">Todos os itens foram persistidos no banco de dados.</p>
            </div>
          </div>

          {/* Error */}
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <span className="text-red-500 text-lg">❌</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Erro ao salvar</p>
              <p className="text-xs text-red-600 mt-0.5">Não foi possível conectar ao servidor. Tente novamente.</p>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Carga acima da capacidade!</p>
              <p className="text-xs text-amber-600 mt-0.5">Considere um caminhão maior ou remova alguns itens.</p>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
            <span className="text-blue-500 text-lg">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Dica de otimização</p>
              <p className="text-xs text-blue-600 mt-0.5">O caminhão está subutilizado. Você pode economizar com um modelo menor.</p>
            </div>
          </div>

          {/* Neutral */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 flex items-start gap-3">
            <span className="text-gray-400 text-lg">💡</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Como funciona</p>
              <p className="text-xs text-gray-500 mt-0.5">Arraste itens do catálogo para o canvas para montar sua mudança.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Error States (inline) ────────────────────────────────────────────────────

export const InlineErrors: StoryObj = {
  name: 'Erros Inline',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Erros Inline</h2>
        <p className="text-sm text-gray-500 mb-8">
          Mensagens de erro em campos de formulário.
        </p>

        <div className="flex flex-col gap-6">
          {/* Campo com erro */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              defaultValue="carlos@invalido"
              className="px-3 py-2 rounded-lg border border-red-400 bg-red-50 text-sm text-gray-900 outline-none ring-2 ring-red-200"
            />
            <p className="text-xs text-red-600 flex items-center gap-1">
              <span>⚠</span> E-mail inválido. Use o formato nome@exemplo.com
            </p>
          </div>

          {/* Campo normal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          {/* Campo com sucesso */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="relative">
              <input
                type="email"
                defaultValue="carlos@mudafacil.com"
                className="w-full px-3 py-2 rounded-lg border border-green-400 bg-green-50 text-sm text-gray-900 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
            </div>
            <p className="text-xs text-green-600">E-mail verificado</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Canvas Warnings ──────────────────────────────────────────────────────────

export const CanvasWarnings: StoryObj = {
  name: 'Canvas — Avisos',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Canvas Warnings</h2>
        <p className="text-sm text-gray-500 mb-8">
          Avisos exibidos no ResumoCanvas e CanvasCarga.
        </p>

        <div className="flex flex-col gap-4">
          {/* Acima da capacidade */}
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
            ⚠️ Carga acima da capacidade! Considere um caminhão maior.
          </div>

          {/* Caminhão subutilizado */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            💡 O caminhão está subutilizado. Você pode economizar com um modelo menor.
          </div>

          {/* Limite de itens atingido */}
          <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs text-orange-700 font-medium">
            🔒 Limite de {5} itens no plano FREE. Assine PRO para adicionar sem limite.
          </div>

          {/* Canvas vazio */}
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-3xl mb-2">📦</span>
            <p className="text-sm font-medium text-gray-500">Canvas vazio</p>
            <p className="text-xs text-gray-400 mt-1">Arraste itens do catálogo para começar</p>
          </div>

          {/* Nenhuma cotação */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm text-gray-400">Nenhuma cotação encontrada com esses filtros</p>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Trial Banners ────────────────────────────────────────────────────────────

export const TrialBanners: StoryObj = {
  name: 'Trial Banners',
  render: () => (
    <div className="flex flex-col gap-4">
      {/* Trial ativo com muitos dias */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-amber-500 text-white">
        <span>🎉 Trial ativo — 11 dias restantes de acesso completo</span>
        <a href="#" className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap">
          Assinar PRO →
        </a>
      </div>

      {/* Trial expirando */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium bg-red-600 text-white">
        <span>⚠️ Seu trial expira em 2 dias!</span>
        <a href="#" className="ml-4 text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap">
          Assinar PRO →
        </a>
      </div>

      <div className="p-8 bg-gray-50">
        <p className="text-xs text-gray-400">
          Banner âmbar: &gt;3 dias restantes. Banner vermelho: ≤3 dias.
          Renderizado pelo componente TrialBanner em PaywallGate.tsx.
        </p>
      </div>
    </div>
  ),
}

// ─── Loading States ───────────────────────────────────────────────────────────

export const LoadingStates: StoryObj = {
  name: 'Estados de Carregamento',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Loading States</h2>
        <p className="text-sm text-gray-500 mb-8">Padrões de carregamento do sistema.</p>

        <div className="flex flex-col gap-6">
          {/* Skeleton card */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Skeleton — Card Cotação</p>
            <div className="p-4 rounded-xl border border-gray-200 bg-white animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="w-20 flex flex-col gap-2 items-end">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-gray-200 rounded-full w-24" />
                <div className="h-5 bg-gray-200 rounded-full w-28" />
              </div>
              <div className="h-9 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>

          {/* Spinner inline */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Spinner Inline</p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Carregando cotações...
            </div>
          </div>

          {/* Canvas loading */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Canvas Loading</p>
            <div className="flex items-center justify-center h-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Carregando canvas...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Empty States ─────────────────────────────────────────────────────────────

export const EmptyStates: StoryObj = {
  name: 'Empty States',
  render: () => (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Empty States</h2>
        <p className="text-sm text-gray-500 mb-8">Estados vazios de cada área do produto.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Canvas vazio */}
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <span className="text-4xl mb-3">📦</span>
            <p className="text-sm font-semibold text-gray-700">Nenhum item no canvas</p>
            <p className="text-xs text-gray-400 mt-1">Arraste itens do catálogo para começar a montar sua mudança</p>
          </div>

          {/* Cotações vazias */}
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl bg-gray-50">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-semibold text-gray-700">Nenhuma cotação</p>
            <p className="text-xs text-gray-400 mt-1">Nenhuma cotação encontrada com esses filtros</p>
          </div>

          {/* Mudanças vazias */}
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50">
            <span className="text-4xl mb-3">🚛</span>
            <p className="text-sm font-semibold text-gray-700">Nenhuma mudança criada</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Crie sua primeira mudança e comece a planejar</p>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
              + Nova Mudança
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
}
