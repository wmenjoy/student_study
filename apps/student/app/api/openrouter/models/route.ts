import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 400 })
    }

    // Fetch models from OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch models from OpenRouter',
        details: response.statusText
      }, { status: response.status })
    }

    const data = await response.json()

    // Filter for free models (models with pricing.prompt === "0" and pricing.completion === "0")
    const freeModels = (data.data || [])
      .filter((model: any) => {
        const pricing = model.pricing
        // Check if both prompt and completion are free (price is "0")
        return pricing &&
               (pricing.prompt === "0" || pricing.prompt === 0) &&
               (pricing.completion === "0" || pricing.completion === 0)
      })
      .map((model: any) => model.id)
      .sort()

    return NextResponse.json({
      models: freeModels,
      total: freeModels.length,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch models',
    }, { status: 500 })
  }
}
