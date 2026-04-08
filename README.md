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
- **Sonner** — toast notifications

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

## Design System

Edite `design-system/tokens.ts` → rode `npm run tokens` para sincronizar com o CSS.

**Nunca use hex hardcoded** — use tokens semânticos.

| Token | Valor | Uso |
|---|---|---|
| `#2563EB` | Azul confiança | Botões, links principais |
| `#F59E0B` | Âmbar caminhão | Alertas, destaques |
| `#F8FAFC` | Fundo | Background da página |

## Planos

| Feature | FREE | TRIAL (14d) | PRO R$29,90/mês |
|---|---|---|---|
| Mudanças ativas | 1 | ∞ | ∞ |
| Itens no canvas | 15 | ∞ | ∞ |
| Cotações/mudança | 3 | ∞ | ∞ |
| Filtros avançados | ✗ | ✓ | ✓ |

## Estrutura

```
mudafacil/
├── app/                  # Rotas Next.js App Router
├── components/canvas/    # CanvasCarga, SeletorCaminhao, ResumoCanvas
├── components/catalog/   # CatalogoPainel (40+ itens)
├── components/cotacoes/  # CardCotacao, FiltrosCotacao
├── components/paywall/   # PaywallGate, TrialBanner
├── design-system/        # tokens.ts (fonte única de verdade)
├── lib/                  # auth, db, stripe, subscription, plan-limits
├── prisma/               # schema.prisma, seed.ts
├── stories/              # Storybook stories
└── types/                # TypeScript types
```
