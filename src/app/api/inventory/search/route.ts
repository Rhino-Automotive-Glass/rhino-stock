import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

const EXTERNAL_API_URL = 'https://rhino-product-code-description.vercel.app/api/products/search'

export async function GET(request: Request) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Retrieve session for the access token needed by the external API
  const { data: { session } } = await supabase.auth.getSession()

  // Get query parameters
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const limit = searchParams.get('limit') || '50'

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  try {
    // Call external API with Bearer token
    const response = await fetch(
      `${EXTERNAL_API_URL}?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
