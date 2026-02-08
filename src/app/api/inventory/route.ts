import { createClient } from '@/app/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth/user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { email: currentUser, isAdmin } = await getCurrentUser(supabase)

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Admins see both counters; regular users only see their own
    const filtered = isAdmin ? data : (data || []).map((item) => {
      const isCreator = item.contado_por === currentUser
      const isEditor = item.contado_por_2 === currentUser

      return {
        ...item,
        unidades: isCreator ? item.unidades : null,
        unidades_2: isEditor ? item.unidades_2 : null,
      }
    })

    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json({ error: 'Error fetching inventory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email: currentUser } = await getCurrentUser(supabase)
    const body = await request.json()

    const { etiquetado, ubicacion, unidades } = body

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
        etiquetado_por: currentUser,
        ubicado_por: currentUser,
        contado_por: currentUser,
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
