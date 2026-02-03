import { createClient } from '@/app/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// TODO: Replace with actual user from authentication
const CURRENT_USER = "Admin";

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error fetching inventory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { etiquetado, ubicacion, unidades, confirmacion } = body

    if (!etiquetado || !ubicacion || unidades === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert({
        etiquetado,
        ubicacion,
        unidades,
        confirmacion: confirmacion || false,
        etiquetado_por: CURRENT_USER,
        ubicado_por: CURRENT_USER,
        contado_por: CURRENT_USER,
        confirmado_por: confirmacion ? CURRENT_USER : null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating inventory item' }, { status: 500 })
  }
}
