#!/usr/bin/env node
// Gera variáveis CSS a partir dos tokens de design
// Rode: npm run tokens

import { colors, semantic, typography, shadows } from './tokens'
import { writeFileSync } from 'fs'
import { join } from 'path'

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key
    if (typeof value === 'string') {
      result[newKey] = value
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value as Record<string, unknown>, newKey))
    }
  }
  return result
}

const colorVars = flatten(colors as unknown as Record<string, unknown>, 'color')
const semanticVars = flatten(semantic as unknown as Record<string, unknown>, 'semantic')

const cssVars = Object.entries({ ...colorVars, ...semanticVars })
  .map(([k, v]) => `  --${k}: ${v};`)
  .join('\n')

const cssContent = `/* AUTO-GENERATED — não edite manualmente */
/* Edite design-system/tokens.ts e rode npm run tokens */
:root {
${cssVars}
}
`

const outputPath = join(process.cwd(), 'app', 'globals.css')
const existing = require('fs').readFileSync(outputPath, 'utf-8')

// Substitui apenas o bloco :root {} gerado automaticamente
const marker = '/* AUTO-GENERATED — não edite manualmente */'
const idx = existing.indexOf(marker)

let finalCSS: string
if (idx !== -1) {
  finalCSS = existing.slice(0, idx) + cssContent
} else {
  finalCSS = existing + '\n' + cssContent
}

writeFileSync(outputPath, finalCSS)
console.log('✅ CSS tokens gerados em app/globals.css')
