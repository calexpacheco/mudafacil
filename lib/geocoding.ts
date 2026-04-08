// Geocoding via Nominatim (OpenStreetMap) — gratuito, sem API key
// Rate limit: 1 req/s. Suficiente para criação de mudanças.

interface GeoResult {
  lat: number
  lng: number
}

export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=br`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MudaFacil/1.0 (contato@mudafacil.com.br)' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}
