/**
 * Converte um item ID (ex: "cama-casal") para a chave de tradução (ex: "cama_casal").
 * Hífens não são suportados como chaves de objeto JSON sem escape, então usamos underscore.
 */
export function itemKey(id: string): string {
  return id.replace(/-/g, '_')
}
