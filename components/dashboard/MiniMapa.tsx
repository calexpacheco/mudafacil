'use client'

import { useEffect, useRef } from 'react'

interface MiniMapaProps {
  latOrigem: number
  lngOrigem: number
  latDestino: number
  lngDestino: number
}

export function MiniMapa({ latOrigem, lngOrigem, latDestino, lngDestino }: MiniMapaProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    // Importa Leaflet dinamicamente (só no cliente)
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')

      if (!mapRef.current || instanceRef.current) return

      // Calcula centro e zoom para abranger ambos os pontos
      const bounds = L.latLngBounds(
        [latOrigem, lngOrigem],
        [latDestino, lngDestino]
      )

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      })

      instanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map)

      map.fitBounds(bounds, { padding: [20, 20] })

      // Marcador A — Origem (azul)
      const iconOrigem = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:#2563EB;border:2px solid white;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:700;">A</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })

      // Marcador B — Destino (laranja)
      const iconDestino = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          background:#ea580c;border:2px solid white;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(45deg);color:white;font-size:11px;font-weight:700;">B</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })

      L.marker([latOrigem, lngOrigem], { icon: iconOrigem }).addTo(map)
      L.marker([latDestino, lngDestino], { icon: iconDestino }).addTo(map)

      // Linha tracejada entre A e B
      L.polyline(
        [[latOrigem, lngOrigem], [latDestino, lngDestino]],
        { color: '#2563EB', weight: 2, dashArray: '6 4', opacity: 0.8 }
      ).addTo(map)
    })

    return () => {
      if (instanceRef.current) {
        ;(instanceRef.current as { remove: () => void }).remove()
        instanceRef.current = null
      }
    }
  }, [latOrigem, lngOrigem, latDestino, lngDestino])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden bg-gray-100"
      style={{ height: 120 }}
    />
  )
}

// Placeholder quando não há coordenadas
export function MiniMapaPlaceholder() {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center gap-3" style={{ height: 120 }}>
      <div className="flex items-center gap-2 text-gray-400">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="w-px h-8 bg-gray-300 border-dashed border-l-2 border-gray-300" />
          <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">B</div>
        </div>
        <p className="text-xs text-gray-400">Mapa indisponível</p>
      </div>
    </div>
  )
}
