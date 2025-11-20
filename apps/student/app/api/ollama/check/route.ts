import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434'

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5秒超时
    })

    if (!response.ok) {
      return NextResponse.json({ available: false, error: 'Ollama service not responding' }, { status: 503 })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    return NextResponse.json({
      available: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let endpoint = OLLAMA_BASE_URL
    let apiKey: string | undefined

    try {
      const body = await request.json()
      if (body.endpoint) {
        endpoint = body.endpoint
      }
      if (body.apiKey) {
        apiKey = body.apiKey
      }
    } catch (e) {
      // 如果没有 body 或 JSON 解析失败，使用默认值
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(5000), // 5秒超时
    })

    if (!response.ok) {
      return NextResponse.json({ available: false, error: 'Ollama service not responding' }, { status: 503 })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    return NextResponse.json({
      available: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    }, { status: 503 })
  }
}
