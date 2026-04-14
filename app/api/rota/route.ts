import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat1 = searchParams.get('lat1')
  const lng1 = searchParams.get('lng1')
  const lat2 = searchParams.get('lat2')
  const lng2 = searchParams.get('lng2')

  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  try {
    const body = {
      locations: [
        { lon: parseFloat(lng1), lat: parseFloat(lat1) },
        { lon: parseFloat(lng2), lat: parseFloat(lat2) },
      ],
      costing: 'auto',
      shape_match: 'walk_or_snap',
    }

    const res = await fetch(
      `https://valhalla1.openstreetmap.de/route?json=${encodeURIComponent(JSON.stringify(body))}`,
      {
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 86400 }, // cache server-side por 24h
      }
    )

    if (!res.ok) return NextResponse.json({ coords: null }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    })

    const data = await res.json()

    // Valhalla retorna shape encodado — precisamos decodificar
    const shape = data.trip?.legs?.[0]?.shape
    if (!shape) return NextResponse.json({ coords: null })

    // Decode polyline6 (Valhalla usa precisão 6)
    const coords = decodePolyline6(shape)
    return NextResponse.json({ coords }, {
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    })
  } catch {
    return NextResponse.json({ coords: null })
  }
}

// Decodifica polyline com precisão 6 (padrão Valhalla)
function decodePolyline6(encoded: string): [number, number][] {
  const coords: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b: number
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    coords.push([lat / 1e6, lng / 1e6])
  }

  return coords
}
