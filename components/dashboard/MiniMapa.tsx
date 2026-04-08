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

export function MiniMapa({ latOrigem, lngOrigem, latDestino, lngDestino }: MiniMapaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Guarda a instância do mapa para destruir corretamente no cleanup
  const mapRef = useRef<{ remove: () => void } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    // Evita dupla inicialização no React StrictMode
    if (mapRef.current) return

    let cancelled = false

    import('leaflet').then((Lmod) => {
      const L = Lmod.default ?? Lmod
      if (cancelled || !containerRef.current) return

      const bounds = L.latLngBounds(
        [latOrigem, lngOrigem],
        [latDestino, lngDestino]
      )

      const map = L.map(containerRef.current, {
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

      // Ícone Marcador A — Origem (azul)
      const mkA = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#2563EB;border:2px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-size:10px;font-weight:700;line-height:1;">A</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      })

      // Ícone Marcador B — Destino (laranja)
      const mkB = L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#ea580c;border:2px solid white;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);color:white;font-size:10px;font-weight:700;line-height:1;">B</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      })

      L.marker([latOrigem, lngOrigem], { icon: mkA }).addTo(map)
      L.marker([latDestino, lngDestino], { icon: mkB }).addTo(map)

      L.polyline(
        [[latOrigem, lngOrigem], [latDestino, lngDestino]],
        { color: '#2563EB', weight: 2.5, dashArray: '6 5', opacity: 0.75 }
      ).addTo(map)
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latOrigem, lngOrigem, latDestino, lngDestino])

  return (
    <div
      ref={containerRef}
      style={{ height: 128, width: '100%' }}
      className="rounded-t-xl overflow-hidden bg-gray-100"
    />
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
