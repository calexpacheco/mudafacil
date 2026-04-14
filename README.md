# MudaFácil

> Arraste seus móveis, escolha o caminhão e mude sem estresse.

Monte visualmente a carga da sua mudança com drag & drop, compare tamanhos de caminhão em tempo real e receba cotações instantâneas de transportadoras avaliadas.

## Stack

- **Next.js 16** (App Router) + TypeScript strict
- **Tailwind CSS 4** + Design System com tokens
- **Prisma** + PostgreSQL (Neon)
- **Auth.js v5** — Google OAuth + Magic Link (Resend)
- **Stripe** — checkout, webhooks, portal de billing
- **@dnd-kit** — canvas drag & drop
- **TanStack Query** — data fetching
- **Storybook** — documentação de componentes
- **Sonner** — toast notifications (position: `bottom-center`)
- **Leaflet** — mapas de rota nas cotações

## Setup local

### 1. Pré-requisitos

- Node.js v18+, npm v9+
- Contas: Neon, Google Cloud, Resend, Stripe

### 2. Clone e instale

```bash
git clone <repo> && cd mudafacil && npm install
```

### 3. Configure variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 4. Banco (Neon)

```bash
npm run db:push
npm run db:seed
```

### 5. Rode

```bash
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
npm run stripe:listen  # webhooks Stripe (opcional)
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run tokens` | Sincroniza tokens → CSS vars |
| `npm run tokens:check` | Valida tokens (CI) |
| `npm run db:push` | Aplica schema Prisma |
| `npm run db:migrate` | Cria migração |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed dados iniciais |
| `npm run storybook` | Storybook na porta 6006 |
| `npm run stripe:listen` | Escuta webhooks Stripe |

---

## Design System

Edite `design-system/tokens.ts` → rode `npm run tokens` para sincronizar com o CSS.

### ⚠️ Tailwind v4 — Atenção obrigatória

- `blue-*` **não existe** no tema customizado — use **hex explícito** (ex: `bg-[#E83500]`)
- Todos os botões e elementos interativos precisam de `cursor-pointer` (o reset do Tailwind v4 não inclui)
- Prefira `style={{ zIndex: N }}` inline a classes `z-N` quando em conflito com Leaflet

### Paleta de cores ativa

| Token | Valor | Uso |
|---|---|---|
| Laranja-vermelho primário | `#E83500` | Botões CTA, filtros ativos, links de ação |
| Laranja claro | `#FA9370` | Hover em cards de catálogo |
| Fundo geral | `#F8FAFC` | Background da página |
| Âmbar | `#F59E0B` | Alertas, destaques de aviso |

### Hierarquia de z-index (global)

| Camada | z-index | Notas |
|---|---|---|
| Sidebar | `1200` | Acima de tudo, incluindo Leaflet |
| Overlay mobile sidebar | `1100` | Backdrop escuro |
| Topbar | `1050` | Acima do conteúdo |
| FAB / Speed Dial | `1000` | Acima de cards e mapas |
| Leaflet tiles | `200–600` | Interno ao Leaflet |

> **Regra crítica para Leaflet:** Sempre envolva o container do mapa com `style={{ isolation: 'isolate' }}` para conter os z-indexes internos do Leaflet e evitar que ele vaze por cima de outros elementos da UI.

---

## Planos

| Feature | FREE | TRIAL (14d) | PRO R$29,90/mês |
|---|---|---|---|
| Mudanças ativas | 1 | ∞ | ∞ |
| Itens no canvas | 15 | ∞ | ∞ |
| Cotações/mudança | 3 | ∞ | ∞ |
| Filtros avançados | ✗ | ✓ | ✓ |

---

## Estrutura

```
mudafacil/
├── app/
│   ├── layout.tsx                   # Root layout — <Toaster position="bottom-center" />
│   └── app/
│       ├── layout.tsx               # Usa <AppShell> (client component)
│       ├── dashboard/               # Lista de mudanças
│       └── mudanca/[id]/
│           └── CanvasEditor.tsx     # Editor principal — responsivo, com Speed Dial FAB
│
├── components/
│   ├── canvas/
│   │   ├── CanvasCarga.tsx          # Área de drag & drop
│   │   ├── SeletorCaminhao.tsx      # Carrossel mobile + grid desktop
│   │   ├── ResumoCanvas.tsx         # ResumoBar (horizontal) + ResumoCanvasPanel (lateral)
│   │   └── ListaItensCanvas.tsx     # Grid responsivo de itens adicionados
│   │
│   ├── catalog/
│   │   └── CatalogoPainel.tsx       # Catálogo com busca, filtro por categoria, botão +
│   │
│   ├── cotacoes/
│   │   ├── CardCotacao.tsx          # Card de empresa com MiniMapa
│   │   ├── FiltrosCotacao.tsx       # Filtros com cores corretas e flex-wrap
│   │   └── EmpresaContratadaBanner.tsx  # Banner com botão "Aceitar estimativa"
│   │
│   ├── dashboard/
│   │   ├── MudancaCard.tsx          # Card com botão delete acima do mapa (zIndex:1000)
│   │   ├── BotaoDeletarMudanca.tsx  # Variante icon com cursor-pointer
│   │   └── MiniMapa.tsx             # Mapa lazy (IntersectionObserver) + cache de rotas
│   │
│   ├── layout/
│   │   ├── AppShell.tsx             # Shell client: sidebar + topbar + FAB mobile + modal
│   │   ├── AppSidebar.tsx           # Sidebar responsiva (mobileOpen/onMobileClose props)
│   │   └── AppTopbar.tsx            # Topbar com hamburger mobile, botão desktop hidden
│   │
│   ├── paywall/
│   │   ├── PaywallGate.tsx
│   │   └── TrialBanner.tsx
│   │
│   └── ui/
│       ├── NovaMudancaModal.tsx     # Bottom sheet animado no mobile
│       └── AppFlowMockup.tsx        # Carrossel mobile (5s) + efeito 3D desktop
│
├── design-system/
│   └── tokens.ts                   # Fonte única de verdade de cores/espaçamentos
│
├── lib/
│   ├── auth.ts
│   ├── catalogo-itens.ts           # 40+ itens com volumeM3, pesoKg, categoria
│   ├── db.ts
│   ├── stripe.ts
│   ├── subscription.ts
│   └── plan-limits.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── stories/                        # Storybook stories
│
├── hooks/                          # Custom hooks
│
└── types/
    └── mudafacil.ts                # ItemCatalogo, ItemPositionado, CaminhaoInfo, etc.
```

---

## Padrões de UI estabelecidos

### 1. Bottom Sheet / Gaveta animada (mobile)

Usado em: `NovaMudancaModal`, catálogo no `CanvasEditor`.

```tsx
// Estado duplo: panelOpen (montagem) + panelVisible (transição CSS)
const [panelOpen, setPanelOpen] = useState(false)
const [panelVisible, setPanelVisible] = useState(false)

function openPanel() {
  setPanelOpen(true)
  requestAnimationFrame(() => requestAnimationFrame(() => setPanelVisible(true)))
}

function closePanel() {
  setPanelVisible(false)
  setTimeout(() => setPanelOpen(false), 300)
}

// JSX — sempre via createPortal para escapar stacking contexts
{panelOpen && createPortal(
  <div className="fixed inset-0 flex items-end" style={{ zIndex: 1050 }}>
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 transition-opacity duration-300"
      style={{ opacity: panelVisible ? 1 : 0 }}
      onClick={closePanel}
    />
    {/* Sheet */}
    <div
      className="relative w-full bg-white rounded-t-2xl transition-transform duration-300"
      style={{ transform: panelVisible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      {/* conteúdo */}
    </div>
  </div>,
  document.body
)}
```

### 2. Speed Dial FAB

Usado em: `CanvasEditor` (tela de canvas de carga).

```tsx
// 3 ações com stagger animation
const ACTIONS = [
  { icon: <IconPlus />, label: 'Nova Mudança', onClick: ... },
  { icon: <IconPackage />, label: 'Adicionar itens', onClick: openPanel },
  { icon: <IconTrash />, label: 'Excluir mudança', onClick: ... },
]

// Botão principal gira 45° quando aberto
<button style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
  <IconPlus />
</button>

// Itens aparecem com delay crescente (stagger)
{ACTIONS.map((action, i) => (
  <div
    key={i}
    style={{
      transition: `opacity 0.2s ${i * 50}ms, transform 0.2s ${i * 50}ms`,
      opacity: fabOpen ? 1 : 0,
      transform: fabOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(8px)',
    }}
  >
    {/* label + botão circular */}
  </div>
))}
```

### 3. Carrossel horizontal mobile (scroll-snap)

Usado em: `SeletorCaminhao`, `AppFlowMockup`.

```tsx
// Container
<div
  ref={scrollRef}
  style={{
    display: 'flex',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    paddingTop: '6px',    // evita clipping do scale
    paddingBottom: '6px',
  }}
>
  {/* Item */}
  <div style={{ minWidth: '75%', scrollSnapAlign: 'center' }}>
    {/* conteúdo */}
  </div>
</div>

// Dots indicator
<div className="flex gap-1.5 justify-center">
  {items.map((_, i) => (
    <div key={i} className={cn('w-1.5 h-1.5 rounded-full', i === active ? 'bg-[#E83500]' : 'bg-gray-300')} />
  ))}
</div>
```

### 4. Lazy loading de mapas (IntersectionObserver)

Usado em: `MiniMapa`.

```tsx
const containerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const el = containerRef.current
  if (!el) return
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { initMap(); observer.disconnect() } },
    { rootMargin: '100px' }
  )
  observer.observe(el)
  return () => observer.disconnect()
}, [])
```

Cache client-side de rotas para evitar re-fetch:

```tsx
const rotaCache = new Map<string, Promise<GeoJSON>>()

function getRoute(key: string): Promise<GeoJSON> {
  if (!rotaCache.has(key)) rotaCache.set(key, fetchRoute(key))
  return rotaCache.get(key)!
}
```

### 5. Toast notifications

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'
<Toaster position="bottom-center" richColors />

// Uso em qualquer componente
import { toast } from 'sonner'
toast.success('Item adicionado!')
```

### 6. Catálogo — botão de adição por toque (mobile)

O `CatalogoPainel` aceita `onAdd?: (item: ItemCatalogo) => void`. Quando fornecido, exibe botão `+` dentro do card (canto inferior direito) e muda o hint text. O `onPointerDown` do botão faz `stopPropagation` para não ativar o drag do dnd-kit.

---

## API

### `GET /api/rota`

Proxy para OSRM (roteamento). Retorna GeoJSON da rota entre dois pontos.

- Cache server-side: `Cache-Control: public, max-age=86400`
- Cache Prisma `next: { revalidate: 86400 }`

---

## Responsividade — resumo de decisões

| Componente | Mobile | Desktop |
|---|---|---|
| `AppShell` | Sidebar oculta, FAB "Nova Mudança" | Sidebar fixa 256px, botão no topbar |
| `AppSidebar` | Gaveta com overlay, botão X | Sempre visível (`lg:translate-x-0`) |
| `NovaMudancaModal` | Bottom sheet animado | Modal centralizado com scale |
| `CanvasEditor` | Coluna única, Speed Dial FAB | Duas colunas (canvas + lista) |
| `SeletorCaminhao` | Carrossel com scroll-snap + dots | Grid 4 colunas |
| `CatalogoPainel` | Bottom drawer (portal + animation) | Painel lateral |
| `ResumoBar` | Grid 2×2 + data abaixo | Flex row com data inline |
| `ListaItensCanvas` | 1 coluna | 2 colunas (`sm:grid-cols-2`) |
| `AppFlowMockup` | Carrossel com auto-advance 5s | Efeito 3D scroll |
| `FiltrosCotacao` | `flex-wrap` nos botões | Linha única |

---

## Convenções de desenvolvimento

1. **`cursor-pointer` em tudo** — Tailwind v4 não aplica automaticamente.
2. **Hex direto para brand color** — `bg-[#E83500]`, nunca `bg-blue-600`.
3. **`accentColor: '#E83500'`** via inline style em `<input type="range">` e `<input type="checkbox">`.
4. **`isolation: 'isolate'`** em qualquer container que envolva um mapa Leaflet.
5. **`createPortal(…, document.body)`** para drawers/modais que precisam escapar de stacking contexts.
6. **Padrão duplo de estado** (`open` + `visible`) para animações CSS de entrada/saída.
7. **`style={{ zIndex: N }}`** inline — não classes Tailwind — para garantir sobreposição acima do Leaflet.
