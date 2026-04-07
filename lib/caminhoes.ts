import type { CaminhaoInfo } from '@/types/mudafacil'

export const CAMINHOES: CaminhaoInfo[] = [
  {
    id: 'fiorino',
    nome: 'Fiorino',
    tipo: 'FIORINO',
    capacidadeM3: 2.5,
    capacidadeKg: 650,
    comprimentoCm: 200,
    larguraCm: 140,
    alturaCm: 110,
    imagemUrl: '/trucks/fiorino.svg',
  },
  {
    id: 'hr',
    nome: 'HR / Sprinter',
    tipo: 'HR',
    capacidadeM3: 7.5,
    capacidadeKg: 1500,
    comprimentoCm: 350,
    larguraCm: 180,
    alturaCm: 180,
    imagemUrl: '/trucks/hr.svg',
  },
  {
    id: 'tres-quartos',
    nome: '3/4 Truck',
    tipo: 'TRES_QUARTOS',
    capacidadeM3: 18,
    capacidadeKg: 4000,
    comprimentoCm: 550,
    larguraCm: 220,
    alturaCm: 200,
    imagemUrl: '/trucks/tres-quartos.svg',
  },
  {
    id: 'bau',
    nome: 'Baú',
    tipo: 'BAU',
    capacidadeM3: 40,
    capacidadeKg: 10000,
    comprimentoCm: 750,
    larguraCm: 240,
    alturaCm: 240,
    imagemUrl: '/trucks/bau.svg',
  },
]

export const CAMINHAO_CORES: Record<string, string> = {
  FIORINO: '#6366f1',
  HR: '#8b5cf6',
  TRES_QUARTOS: '#2563EB',
  BAU: '#0f172a',
}
