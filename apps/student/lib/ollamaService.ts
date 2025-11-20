// Ollama API 服务
// 通过 Next.js API 路由与本地或云端 Ollama 模型通信

export interface OllamaConfig {
  endpoint?: string
  apiKey?: string
  provider?: 'ollama' | 'openrouter'
}

export interface QuestionGenerateParams {
  grade: number
  questionType: string
  difficulty: 'easy' | 'medium' | 'hard'
  count: number
  model?: string
  endpoint?: string
  apiKey?: string
  provider?: 'ollama' | 'openrouter'
}

export interface GeneratedQuestion {
  prompt: string
  answer: string
  hint?: string
  explain?: string
  visual_guide?: string
  visual_data?: any[] // Canvas绘图指令
  category: string
  difficulty: number
}

/**
 * 检查 Ollama 是否可用
 */
export async function checkOllamaAvailable(config?: OllamaConfig): Promise<boolean> {
  try {
    const response = await fetch('/api/ollama/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config || {}),
    })
    const data = await response.json()
    return data.available === true
  } catch (error) {
    return false
  }
}

/**
 * 获取可用的模型列表
 */
export async function getAvailableModels(config?: OllamaConfig): Promise<string[]> {
  try {
    const response = await fetch('/api/ollama/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config || {}),
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.models || []
  } catch (error) {
    return []
  }
}

/**
 * 完整的题目生成流程
 */
export async function generateQuestions(
  params: QuestionGenerateParams
): Promise<GeneratedQuestion[]> {
  const model = params.model || 'qwen2.5:7b'

  try {
    const response = await fetch('/api/ollama/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        grade: params.grade,
        questionType: params.questionType,
        difficulty: params.difficulty,
        count: params.count,
        endpoint: params.endpoint,
        apiKey: params.apiKey,
        provider: params.provider || 'ollama',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.questions || []
  } catch (error) {
    throw error instanceof Error ? error : new Error('生成题目失败')
  }
}
