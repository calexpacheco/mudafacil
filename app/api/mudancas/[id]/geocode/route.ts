import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { geocodeAddress } from '@/lib/geocoding'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: mudancaId } = await params

  const mudanca = await db.mudanca.findUnique({
    where: { id: mudancaId, userId: session.user.id },
  })
  if (!mudanca) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [geoOrigem, geoDestino] = await Promise.all([
    geocodeAddress(mudanca.enderecoOrigem),
    geocodeAddress(mudanca.enderecoDestino),
  ])

  const updated = await db.mudanca.update({
    where: { id: mudancaId },
    data: {
      latOrigem: geoOrigem?.lat ?? null,
      lngOrigem: geoOrigem?.lng ?? null,
      latDestino: geoDestino?.lat ?? null,
      lngDestino: geoDestino?.lng ?? null,
    },
  })

  return NextResponse.json({
    ok: true,
    latOrigem: updated.latOrigem,
    lngOrigem: updated.lngOrigem,
    latDestino: updated.latDestino,
    lngDestino: updated.lngDestino,
  })
}
