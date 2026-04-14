import type { Meta, StoryObj } from '@storybook/nextjs'
import { IconSearch, IconTruck } from '@tabler/icons-react'

const meta: Meta = {
  title: 'UI/Forms',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
}

export default meta

// ─── Inputs ───────────────────────────────────────────────────────────────────

export const Inputs: StoryObj = {
  name: 'Inputs',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Form Inputs</h2>
        <p className="text-sm text-gray-500 mb-8">
          Padrões de inputs usados nos formulários do produto.
        </p>

        <div className="flex flex-col gap-6">
          {/* Text input */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Text Input — Estados</h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Padrão</label>
                <input
                  type="text"
                  placeholder="Ex: Mudança para apartamento novo"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Com valor</label>
                <input
                  type="text"
                  defaultValue="Mudança Apartamento Centro"
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Focus</label>
                <input
                  type="text"
                  defaultValue="Mudança..."
                  className="px-3 py-2 rounded-lg border border-blue-500 text-sm text-gray-900 outline-none ring-2 ring-blue-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Erro</label>
                <input
                  type="text"
                  defaultValue=""
                  placeholder="Obrigatório"
                  className="px-3 py-2 rounded-lg border border-red-400 bg-red-50 text-sm text-gray-900 outline-none ring-2 ring-red-200"
                />
                <p className="text-xs text-red-600">Este campo é obrigatório</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-400">Desabilitado</label>
                <input
                  type="text"
                  defaultValue="Mudança Bloqueada"
                  disabled
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Email Input</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Seu e-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-400">Vamos enviar o link mágico de login para este e-mail.</p>
            </div>
          </div>

          {/* Search */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Search Input</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch size={16} stroke={1.5} /></span>
              <input
                type="text"
                placeholder="Buscar item..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Range Sliders ────────────────────────────────────────────────────────────

export const Sliders: StoryObj = {
  name: 'Sliders',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-md">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Range Sliders</h2>
        <p className="text-sm text-gray-500 mb-8">
          Usados em FiltrosCotacao para preço máximo e nota mínima.
        </p>

        <div className="flex flex-col gap-6">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">
              Preço máximo: <strong>R$ 1.500</strong>
            </label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              defaultValue={1500}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>R$ 0</span>
              <span>R$ 5.000</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">
              Nota mínima: <strong>4.0 ★</strong>
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              defaultValue={4}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 ★</span>
              <span>5 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ─── Checkboxes ───────────────────────────────────────────────────────────────

export const Checkboxes: StoryObj = {
  name: 'Checkboxes',
  render: () => (
    <div className="p-8 flex flex-col gap-8 max-w-md">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Checkboxes</h2>
        <p className="text-sm text-gray-500 mb-8">
          Checkboxes usados nos filtros de cotação.
        </p>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded accent-blue-600 w-4 h-4" />
            Seguro incluso
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded accent-blue-600 w-4 h-4" />
            Disponível este mês
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-not-allowed">
            <input type="checkbox" disabled className="rounded accent-blue-600 w-4 h-4 cursor-not-allowed" />
            Opção bloqueada
          </label>
        </div>
      </div>
    </div>
  ),
}

// ─── Form completo: Login ─────────────────────────────────────────────────────

export const LoginForm: StoryObj = {
  name: 'Form — Login',
  render: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2"><IconTruck size={24} stroke={1.5} className="text-gray-700" /> MudaFácil</h1>
          <p className="text-sm text-gray-500 mt-2">Entre com seu e-mail para começar</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
              />
            </div>

            <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Enviar link mágico ✨
            </button>

            <div className="relative flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button className="w-full py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Ao entrar, você concorda com os{' '}
            <a href="#" className="underline hover:text-gray-600">Termos de Uso</a>
          </p>
        </div>
      </div>
    </div>
  ),
}
