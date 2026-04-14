export type CategoriaItem = 'quarto' | 'cozinha' | 'sala' | 'escritorio' | 'caixa'

export type TipoCaminhao = 'FIORINO' | 'HR' | 'TRES_QUARTOS' | 'BAU'

export interface ItemCatalogo {
  id: string
  nome: string
  categoria: CategoriaItem
  iconeUrl: string
  larguraCm: number
  alturaCm: number
  profundidadeCm: number
  pesoKg: number
  volumeM3: number
}

export interface CaminhaoInfo {
  id: string
  nome: string
  tipo: TipoCaminhao
  capacidadeM3: number
  capacidadeKg: number
  comprimentoCm: number
  larguraCm: number
  alturaCm: number
  imagemUrl?: string
}

export interface ItemPositionado {
  itemId: string
  item: ItemCatalogo
  x: number
  y: number
  rotacao: number
  uid: string        // instância única no canvas
  quantidade: number // quantas unidades deste item (padrão 1)
}

export interface ResumoCanvas {
  volumeTotal: number
  pesoTotal: number
  ocupacaoPercentual: number
  acimaDaCapacidade: boolean
}

export interface TransportadoraCard {
  id: string
  nome: string
  logoUrl?: string
  notaMedia: number
  totalAvaliacoes: number
  cidade: string
  tiposCaminhao: TipoCaminhao[]
}

export interface CotacaoCard {
  id: string
  transportadora: TransportadoraCard
  caminhao: CaminhaoInfo
  precoCentavos: number
  dataDisponivel: string
  seguroIncluso: boolean
  validade: string
}

export interface FiltrosCotacao {
  precoMax?: number
  notaMin?: number
  dataDisponivel?: string
  seguroIncluso?: boolean
  tipoCaminhao?: TipoCaminhao
  ordenarPor: 'preco' | 'nota' | 'data'
}
