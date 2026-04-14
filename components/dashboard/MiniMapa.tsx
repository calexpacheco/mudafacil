'use client'

// CSS do Leaflet DEVE ser import estático — import dinâmico de CSS não funciona no Next.js
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

interface MiniMapaProps {
  latOrigem: number
  lngOrigem: number
  latDestino: number
  lngDestino: number
}

// Haversine — distância em km entre dois pontos lat/lng
function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Cache client-side para evitar refetch da mesma rota
const rotaCache = new Map<string, Promise<[number, number][] | null>>()

function buscarRota(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): Promise<[number, number][] | null> {
  const key = `${lat1.toFixed(4)},${lng1.toFixed(4)},${lat2.toFixed(4)},${lng2.toFixed(4)}`
  if (rotaCache.has(key)) return rotaCache.get(key)!

  const promise = (async (): Promise<[number, number][] | null> => {
    try {
      const params = new URLSearchParams({
        lat1: String(lat1), lng1: String(lng1),
        lat2: String(lat2), lng2: String(lng2),
      })
      const res = await fetch(`/api/rota?${params}`)
      if (!res.ok) return null
      const data = await res.json()
      const coords: [number, number][] = data.coords
      return coords?.length ? coords : null
    } catch {
      return null
    }
  })()

  rotaCache.set(key, promise)
  return promise
}

// Distância máxima para usar rota de rua (acima disso, linha reta)
const LIMITE_ROTA_KM = 300

export function MiniMapa({ latOrigem, lngOrigem, latDestino, lngDestino }: MiniMapaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const genRef = useRef(0)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Reseta quando as coords mudam
    initializedRef.current = false

    const container = containerRef.current
    const gen = ++genRef.current

    // Limpa mapa anterior
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = container as any
    delete el._leaflet_id
    el.className = el.className.replace(/leaflet-[^\s]*/g, '').trim()
    el.innerHTML = ''

    const init = async () => {
      if (initializedRef.current) return
      initializedRef.current = true

      const Lmod = await import('leaflet')
      const L = Lmod.default ?? Lmod
      if (genRef.current !== gen || !container) return

      const bounds = L.latLngBounds(
        [latOrigem, lngOrigem],
        [latDestino, lngDestino]
      )

      const map = L.map(container, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      })

      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      map.fitBounds(bounds, { padding: [24, 24] })

      const mkA = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#2563EB;border:2px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-size:10px;font-weight:700;line-height:1;">A</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      })

      const mkB = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#ea580c;border:2px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-size:10px;font-weight:700;line-height:1;">B</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      })

      L.marker([latOrigem, lngOrigem], { icon: mkA }).addTo(map)
      L.marker([latDestino, lngDestino], { icon: mkB }).addTo(map)

      const dist = distanciaKm(latOrigem, lngOrigem, latDestino, lngDestino)

      if (dist < LIMITE_ROTA_KM) {
        const rota = await buscarRota(latOrigem, lngOrigem, latDestino, lngDestino)
        if (genRef.current !== gen) return
        if (rota) {
          L.polyline(rota, { color: '#2563EB', weight: 3, opacity: 0.85 }).addTo(map)
        } else {
          L.polyline(
            [[latOrigem, lngOrigem], [latDestino, lngDestino]],
            { color: '#2563EB', weight: 2.5, dashArray: '6 5', opacity: 0.75 }
          ).addTo(map)
        }
      } else {
        L.polyline(
          [[latOrigem, lngOrigem], [latDestino, lngDestino]],
          { color: '#2563EB', weight: 2.5, dashArray: '6 5', opacity: 0.75 }
        ).addTo(map)
      }
    }

    // Só inicializa o mapa quando o card entra no viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          init()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latOrigem, lngOrigem, latDestino, lngDestino])

  return (
    <div style={{ isolation: 'isolate' }}>
      <div
        ref={containerRef}
        style={{ height: 128, width: '100%' }}
        className="rounded-t-xl overflow-hidden bg-gray-100"
      />
    </div>
  )
}

// Placeholder quando não há coordenadas
export function MiniMapaPlaceholder() {
  return (
    <div
      className="w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center gap-4"
      style={{ height: 128 }}
    >
      <div className="flex items-center gap-3 text-gray-400">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
          <div className="flex flex-col gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-px h-1.5 bg-gray-300 mx-auto" />
            ))}
          </div>
          <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">B</div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Mapa não disponível</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Crie uma nova mudança<br/>para ver a rota</p>
        </div>
      </div>
    </div>
  )
}
