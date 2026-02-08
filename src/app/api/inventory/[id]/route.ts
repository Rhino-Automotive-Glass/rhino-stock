import { createClient } from '@/app/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth/user'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()
    const { email: currentUser, isAdmin } = await getCurrentUser(supabase)
    const body = await request.json()

    // Fetch the existing item to determine the user's role
    const { data: existingItem, error: fetchError } = await supabase
      .from('inventory')
      .select('contado_por')
      .eq('id', id)
      .single()

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const isCreator = existingItem.contado_por === currentUser

    const { etiquetado, ubicacion, unidades, unidades_2, confirmado_por } = body

    const updateData: Record<string, unknown> = {}

    if (etiquetado !== undefined) {
      updateData.etiquetado = etiquetado
      updateData.etiquetado_por = currentUser
    }

    if (ubicacion !== undefined) {
      updateData.ubicacion = ubicacion
      updateData.ubicado_por = currentUser
    }

    // Route the count to the correct counter based on user role
    if (unidades !== undefined && isCreator) {
      updateData.unidades = unidades
      updateData.contado_por = currentUser
    }

    if (unidades_2 !== undefined && !isCreator) {
      updateData.unidades_2 = unidades_2
      updateData.contado_por_2 = currentUser
    }

    if (confirmado_por !== undefined) {
      updateData.confirmado_por = confirmado_por ? currentUser : null
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

    // Admins see both counters; regular users only see their own
    const filtered = isAdmin ? data : {
      ...data,
      unidades: isCreator ? data.unidades : null,
      unidades_2: !isCreator ? data.unidades_2 : null,
    }

    return NextResponse.json(filtered)
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
