import type { ItemCatalogo } from '@/types/mudafacil'

// 40+ itens categorizados com dimensões reais (cm) e volume (m³)
export const CATALOGO_ITENS: ItemCatalogo[] = [
  // QUARTO
  { id: 'cama-casal', nome: 'Cama Casal', categoria: 'quarto', iconeUrl: '/icons/cama-casal.svg', larguraCm: 138, alturaCm: 30, profundidadeCm: 188, pesoKg: 45, volumeM3: 0.78 },
  { id: 'cama-solteiro', nome: 'Cama Solteiro', categoria: 'quarto', iconeUrl: '/icons/cama-solteiro.svg', larguraCm: 88, alturaCm: 30, profundidadeCm: 188, pesoKg: 25, volumeM3: 0.50 },
  { id: 'cama-queen', nome: 'Cama Queen', categoria: 'quarto', iconeUrl: '/icons/cama-queen.svg', larguraCm: 158, alturaCm: 35, profundidadeCm: 198, pesoKg: 55, volumeM3: 1.10 },
  { id: 'guarda-roupa-2', nome: 'Guarda-roupa 2 portas', categoria: 'quarto', iconeUrl: '/icons/guarda-roupa.svg', larguraCm: 100, alturaCm: 200, profundidadeCm: 52, pesoKg: 60, volumeM3: 1.04 },
  { id: 'guarda-roupa-4', nome: 'Guarda-roupa 4 portas', categoria: 'quarto', iconeUrl: '/icons/guarda-roupa-4.svg', larguraCm: 180, alturaCm: 200, profundidadeCm: 52, pesoKg: 90, volumeM3: 1.87 },
  { id: 'comoda', nome: 'Cômoda', categoria: 'quarto', iconeUrl: '/icons/comoda.svg', larguraCm: 90, alturaCm: 90, profundidadeCm: 45, pesoKg: 30, volumeM3: 0.36 },
  { id: 'criado-mudo', nome: 'Criado-mudo', categoria: 'quarto', iconeUrl: '/icons/criado-mudo.svg', larguraCm: 45, alturaCm: 60, profundidadeCm: 40, pesoKg: 12, volumeM3: 0.11 },
  { id: 'penteadeira', nome: 'Penteadeira', categoria: 'quarto', iconeUrl: '/icons/penteadeira.svg', larguraCm: 100, alturaCm: 130, profundidadeCm: 45, pesoKg: 25, volumeM3: 0.59 },
  { id: 'colchao-casal', nome: 'Colchão Casal', categoria: 'quarto', iconeUrl: '/icons/colchao.svg', larguraCm: 138, alturaCm: 25, profundidadeCm: 188, pesoKg: 30, volumeM3: 0.65 },

  // SALA
  { id: 'sofa-2l', nome: 'Sofá 2 lugares', categoria: 'sala', iconeUrl: '/icons/sofa.svg', larguraCm: 140, alturaCm: 85, profundidadeCm: 80, pesoKg: 40, volumeM3: 0.95 },
  { id: 'sofa-3l', nome: 'Sofá 3 lugares', categoria: 'sala', iconeUrl: '/icons/sofa-3l.svg', larguraCm: 200, alturaCm: 85, profundidadeCm: 80, pesoKg: 55, volumeM3: 1.36 },
  { id: 'sofa-canto', nome: 'Sofá de Canto', categoria: 'sala', iconeUrl: '/icons/sofa-canto.svg', larguraCm: 260, alturaCm: 85, profundidadeCm: 180, pesoKg: 90, volumeM3: 3.97 },
  { id: 'mesa-sala', nome: 'Mesa de Jantar', categoria: 'sala', iconeUrl: '/icons/mesa.svg', larguraCm: 140, alturaCm: 75, profundidadeCm: 80, pesoKg: 35, volumeM3: 0.84 },
  { id: 'cadeira', nome: 'Cadeira', categoria: 'sala', iconeUrl: '/icons/cadeira.svg', larguraCm: 45, alturaCm: 85, profundidadeCm: 50, pesoKg: 5, volumeM3: 0.19 },
  { id: 'estante', nome: 'Estante', categoria: 'sala', iconeUrl: '/icons/estante.svg', larguraCm: 120, alturaCm: 180, profundidadeCm: 30, pesoKg: 40, volumeM3: 0.65 },
  { id: 'rack-tv', nome: 'Rack TV', categoria: 'sala', iconeUrl: '/icons/rack.svg', larguraCm: 150, alturaCm: 50, profundidadeCm: 40, pesoKg: 20, volumeM3: 0.30 },
  { id: 'tv-50', nome: 'TV 50"', categoria: 'sala', iconeUrl: '/icons/tv.svg', larguraCm: 113, alturaCm: 70, profundidadeCm: 10, pesoKg: 12, volumeM3: 0.08 },
  { id: 'tapete', nome: 'Tapete', categoria: 'sala', iconeUrl: '/icons/tapete.svg', larguraCm: 200, alturaCm: 5, profundidadeCm: 150, pesoKg: 5, volumeM3: 0.15 },

  // COZINHA
  { id: 'geladeira', nome: 'Geladeira', categoria: 'cozinha', iconeUrl: '/icons/geladeira.svg', larguraCm: 70, alturaCm: 170, profundidadeCm: 65, pesoKg: 70, volumeM3: 0.77 },
  { id: 'freezer', nome: 'Freezer', categoria: 'cozinha', iconeUrl: '/icons/freezer.svg', larguraCm: 70, alturaCm: 85, profundidadeCm: 65, pesoKg: 45, volumeM3: 0.39 },
  { id: 'fogao', nome: 'Fogão 4 bocas', categoria: 'cozinha', iconeUrl: '/icons/fogao.svg', larguraCm: 55, alturaCm: 85, profundidadeCm: 58, pesoKg: 25, volumeM3: 0.27 },
  { id: 'microondas', nome: 'Micro-ondas', categoria: 'cozinha', iconeUrl: '/icons/microondas.svg', larguraCm: 50, alturaCm: 30, profundidadeCm: 35, pesoKg: 10, volumeM3: 0.05 },
  { id: 'maquina-lavar', nome: 'Máquina de Lavar', categoria: 'cozinha', iconeUrl: '/icons/lava-roupa.svg', larguraCm: 60, alturaCm: 90, profundidadeCm: 55, pesoKg: 65, volumeM3: 0.30 },
  { id: 'armario-cozinha', nome: 'Armário de Cozinha', categoria: 'cozinha', iconeUrl: '/icons/armario-cozinha.svg', larguraCm: 120, alturaCm: 90, profundidadeCm: 50, pesoKg: 45, volumeM3: 0.54 },
  { id: 'mesa-cozinha', nome: 'Mesa de Cozinha', categoria: 'cozinha', iconeUrl: '/icons/mesa-cozinha.svg', larguraCm: 100, alturaCm: 75, profundidadeCm: 80, pesoKg: 20, volumeM3: 0.60 },

  // ESCRITÓRIO
  { id: 'mesa-escritorio', nome: 'Mesa de Escritório', categoria: 'escritorio', iconeUrl: '/icons/mesa-escritorio.svg', larguraCm: 120, alturaCm: 75, profundidadeCm: 60, pesoKg: 30, volumeM3: 0.54 },
  { id: 'cadeira-escritorio', nome: 'Cadeira Escritório', categoria: 'escritorio', iconeUrl: '/icons/cadeira-escritorio.svg', larguraCm: 60, alturaCm: 110, profundidadeCm: 60, pesoKg: 12, volumeM3: 0.40 },
  { id: 'armario-escritorio', nome: 'Armário Escritório', categoria: 'escritorio', iconeUrl: '/icons/armario-escritorio.svg', larguraCm: 90, alturaCm: 180, profundidadeCm: 40, pesoKg: 50, volumeM3: 0.65 },
  { id: 'impressora', nome: 'Impressora', categoria: 'escritorio', iconeUrl: '/icons/impressora.svg', larguraCm: 45, alturaCm: 25, profundidadeCm: 35, pesoKg: 6, volumeM3: 0.04 },
  { id: 'computador', nome: 'Computador Desktop', categoria: 'escritorio', iconeUrl: '/icons/computador.svg', larguraCm: 45, alturaCm: 45, profundidadeCm: 20, pesoKg: 8, volumeM3: 0.04 },
  { id: 'monitor', nome: 'Monitor', categoria: 'escritorio', iconeUrl: '/icons/monitor.svg', larguraCm: 60, alturaCm: 40, profundidadeCm: 20, pesoKg: 4, volumeM3: 0.05 },
  { id: 'estante-escritorio', nome: 'Estante Escritório', categoria: 'escritorio', iconeUrl: '/icons/estante.svg', larguraCm: 80, alturaCm: 180, profundidadeCm: 30, pesoKg: 30, volumeM3: 0.43 },

  // CAIXAS
  { id: 'caixa-p', nome: 'Caixa P', categoria: 'caixa', iconeUrl: '/icons/caixa.svg', larguraCm: 30, alturaCm: 30, profundidadeCm: 30, pesoKg: 8, volumeM3: 0.027 },
  { id: 'caixa-m', nome: 'Caixa M', categoria: 'caixa', iconeUrl: '/icons/caixa-m.svg', larguraCm: 40, alturaCm: 40, profundidadeCm: 40, pesoKg: 15, volumeM3: 0.064 },
  { id: 'caixa-g', nome: 'Caixa G', categoria: 'caixa', iconeUrl: '/icons/caixa-g.svg', larguraCm: 50, alturaCm: 50, profundidadeCm: 50, pesoKg: 25, volumeM3: 0.125 },
  { id: 'sacola', nome: 'Sacola/Mala', categoria: 'caixa', iconeUrl: '/icons/mala.svg', larguraCm: 60, alturaCm: 30, profundidadeCm: 30, pesoKg: 5, volumeM3: 0.054 },
  { id: 'bicicleta', nome: 'Bicicleta', categoria: 'sala', iconeUrl: '/icons/bicicleta.svg', larguraCm: 170, alturaCm: 100, profundidadeCm: 50, pesoKg: 12, volumeM3: 0.85 },
  { id: 'moto', nome: 'Moto', categoria: 'sala', iconeUrl: '/icons/moto.svg', larguraCm: 200, alturaCm: 110, profundidadeCm: 80, pesoKg: 130, volumeM3: 1.76 },
  { id: 'piano', nome: 'Piano / Teclado', categoria: 'sala', iconeUrl: '/icons/piano.svg', larguraCm: 145, alturaCm: 90, profundidadeCm: 50, pesoKg: 60, volumeM3: 0.65 },
  { id: 'maquina-secar', nome: 'Máquina de Secar', categoria: 'cozinha', iconeUrl: '/icons/secadora.svg', larguraCm: 60, alturaCm: 85, profundidadeCm: 55, pesoKg: 35, volumeM3: 0.28 },
  { id: 'aquecedor', nome: 'Aquecedor / Ar-cond.', categoria: 'cozinha', iconeUrl: '/icons/arcond.svg', larguraCm: 80, alturaCm: 30, profundidadeCm: 25, pesoKg: 12, volumeM3: 0.06 },
]

export const CATEGORIAS = ['quarto', 'cozinha', 'sala', 'escritorio', 'caixa'] as const

export const CATEGORIA_LABELS: Record<string, string> = {
  quarto: 'Quarto',
  cozinha: 'Cozinha',
  sala: 'Sala',
  escritorio: 'Escritório',
  caixa: 'Caixas',
}
