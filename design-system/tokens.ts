// Design System Tokens — MudaFácil
// Identidade visual: bold red brand + Barlow heading + Inter body
// Fonte única de verdade. Nunca use hex hardcoded nos componentes.

export const colors = {
  // Brand — vermelho vibrante, bold, logística
  primary: {
    50:  '#FEF0EA',
    100: '#FDE0D4',
    200: '#FCC1A9',
    300: '#FA9370',
    400: '#F76040',
    500: '#F04A20',
    600: '#E83500', // PRIMARY principal
    700: '#C42A08', // hover
    800: '#9A2108',
    900: '#7A1A06',
  },
  dark: {
    900: '#1A0808', // dark brand
    800: '#2A0F0F',
    700: '#3D1A1A',
  },
  accent: {
    50:  '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#F59E0B', // ACCENT principal
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  gray: {
    50:  '#F8FAFC', // BACKGROUND principal
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    500: '#22c55e',
    600: '#16a34a',
  },
  danger: {
    500: '#ef4444',
    600: '#dc2626',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
} as const

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

export const typography = {
  fontFamily: {
    heading: ['Barlow', 'system-ui', 'sans-serif'],
    sans:    ['Inter', 'system-ui', 'sans-serif'],
    mono:    ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs:   '12px',
    sm:   '14px',
    base: '16px',
    lg:   '18px',
    xl:   '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  fontWeight: {
    normal:    '400',
    medium:    '500',
    semibold:  '600',
    bold:      '700',
    extrabold: '800',
  },
  lineHeight: {
    tight:   '1.25',
    snug:    '1.375',
    normal:  '1.5',
    relaxed: '1.625',
  },
} as const

export const borderRadius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  brand: '0 8px 30px -4px rgba(232, 53, 0, 0.35)',
} as const

// Semantic tokens — use estes nos componentes
export const semantic = {
  background: {
    page:   colors.gray[50],
    card:   '#ffffff',
    muted:  colors.gray[100],
    canvas: colors.gray[100],
    dark:   colors.dark[900],
  },
  text: {
    primary:   colors.gray[900],
    secondary: colors.gray[600],
    muted:     colors.gray[400],
    inverse:   '#ffffff',
    accent:    colors.accent[500],
    brand:     colors.primary[600],
  },
  border: {
    default: colors.gray[200],
    focus:   colors.primary[600],
    strong:  colors.gray[300],
  },
  brand: {
    primary:      colors.primary[600],
    primaryHover: colors.primary[700],
    light:        colors.primary[50],
    dark:         colors.dark[900],
    accent:       colors.accent[500],
    accentHover:  colors.accent[600],
  },
  plan: {
    trial: colors.accent[500],
    pro:   colors.primary[600],
    free:  colors.gray[400],
  },
  truck: {
    fiorino:     '#6366f1',
    hr:          '#8b5cf6',
    treQuartos:  colors.primary[600],
    bau:         colors.dark[900],
  },
} as const

export type Colors   = typeof colors
export type Semantic = typeof semantic
