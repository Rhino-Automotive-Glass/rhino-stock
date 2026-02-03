import { createClient } from '@/app/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// TODO: Replace with actual user from authentication
const CURRENT_USER = "Admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    const body = await request.json()

    const { etiquetado, ubicacion, unidades, confirmacion } = body

    const updateData: Record<string, unknown> = {}

    if (etiquetado !== undefined) {
      updateData.etiquetado = etiquetado
      updateData.etiquetado_por = CURRENT_USER
    }

    if (ubicacion !== undefined) {
      updateData.ubicacion = ubicacion
      updateData.ubicado_por = CURRENT_USER
    }

    if (unidades !== undefined) {
      updateData.unidades = unidades
      updateData.contado_por = CURRENT_USER
    }

    if (confirmacion !== undefined) {
      updateData.confirmacion = confirmacion
      updateData.confirmado_por = confirmacion ? CURRENT_USER : null
    }

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error updating inventory item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting inventory item' }, { status: 500 })
  }
}
