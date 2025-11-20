import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434'

export const maxDuration = 120 // 最长120秒 (2分钟)

interface GenerateRequest {
  model: string
  grade: number
  questionType: string
  difficulty: string
  count: number
  endpoint?: string
  apiKey?: string
  provider?: 'ollama' | 'openrouter' // 新增：提供商类型
}

function buildQuestionPrompt(params: Omit<GenerateRequest, 'model' | 'endpoint' | 'apiKey'>): string {
  const { grade, questionType, difficulty, count } = params

  const difficultyDesc = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }[difficulty] || '中等'

  const gradeDesc = `${grade}年级`

  return `你是一位经验丰富的小学数学老师。请生成${count}道${gradeDesc}${questionType}应用题，难度为${difficultyDesc}。

要求：
1. 每道题目必须包含：题目、答案、提示、详细解析、图示分解步骤、可视化绘图指令
2. 题目要贴近生活，有趣味性
3. 数字要合理，符合年级水平
4. 答案必须是准确的整数或小数
5. 解析要详细，帮助学生理解
6. 图示分解步骤要清晰，用于辅助学生可视化理解
7. 可视化绘图指令必须详细展示解题逻辑，不能只画简单的框

可视化绘图指令格式说明：
- 支持的图形类型：line(线段), rect(矩形), circle(圆形), text(文字), arrow(箭头)
- 每个指令包含：type(类型), x/y(位置), width/height(尺寸), text(文本), color(颜色), size(字号)等
- 画布尺寸：550x350像素
- 必须展示解题过程，不能只画静态的标签框

和差问题绘图示例（必须包含对齐的线段图）：
[
  {"type":"text","x":275,"y":30,"text":"和差问题图解","size":16,"color":"#1e40af"},
  {"type":"rect","x":80,"y":80,"width":200,"height":35,"color":"#93c5fd"},
  {"type":"text","x":180,"y":97,"text":"小丽","size":14,"color":"#1e40af"},
  {"type":"rect","x":80,"y":140,"width":200,"height":35,"color":"#93c5fd"},
  {"type":"rect","x":280,"y":140,"width":50,"height":35,"color":"#fcd34d"},
  {"type":"text","x":180,"y":157,"text":"小华（相等部分）","size":12,"color":"#1e40af"},
  {"type":"text","x":305,"y":157,"text":"+6","size":14,"color":"#dc2626"},
  {"type":"line","x1":280,"y1":70,"x2":280,"y2":180,"color":"#dc2626"},
  {"type":"text","x":310,"y":60,"text":"多6个","size":13,"color":"#dc2626"},
  {"type":"text","x":400,"y":90,"text":"① 去掉6: 48-6=42","size":12,"color":"#6b7280"},
  {"type":"text","x":400,"y":110,"text":"② 平均分: 42÷2=21","size":12,"color":"#6b7280"},
  {"type":"text","x":400,"y":130,"text":"③ 小华: 21+6=27","size":12,"color":"#6b7280"}
]

倍数问题绘图示例（必须用多个矩形展示倍数关系）：
[
  {"type":"text","x":275,"y":30,"text":"倍数问题图解","size":16,"color":"#1e40af"},
  {"type":"rect","x":80,"y":80,"width":60,"height":35,"color":"#93c5fd"},
  {"type":"text","x":110,"y":65,"text":"1倍","size":12,"color":"#6b7280"},
  {"type":"rect","x":80,"y":140,"width":60,"height":35,"color":"#fcd34d"},
  {"type":"rect","x":145,"y":140,"width":60,"height":35,"color":"#fcd34d"},
  {"type":"rect","x":210,"y":140,"width":60,"height":35,"color":"#fcd34d"},
  {"type":"text","x":170,"y":125,"text":"3倍","size":12,"color":"#6b7280"},
  {"type":"line","x1":275,"y1":95,"x2":310,"y2":95,"color":"#dc2626"},
  {"type":"text","x":330,"y":95,"text":"差=2倍","size":12,"color":"#dc2626"}
]

请严格按照以下 JSON 格式返回（只返回JSON数组，不要有其他文字）：
[
  {
    "prompt": "题目内容",
    "answer": "答案（纯数字或算式结果）",
    "hint": "解题提示",
    "explain": "详细解析过程",
    "visual_guide": "图示分解步骤文字说明",
    "visual_data": [详细的绘图指令JSON数组，必须展示解题逻辑]
  }
]

现在开始生成 ${count} 道题目：`
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { model, grade, questionType, difficulty, count, endpoint, apiKey, provider = 'ollama' } = body

    if (!model) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 })
    }

    const prompt = buildQuestionPrompt({ grade, questionType, difficulty, count })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 115000) // 115秒超时 (留5秒buffer)

    let data: any

    if (provider === 'openrouter') {
      // OpenRouter API (OpenAI compatible)
      const openrouterEndpoint = endpoint || 'https://openrouter.ai/api/v1'

      if (!apiKey) {
        clearTimeout(timeoutId)
        return NextResponse.json({ error: 'API Key is required for OpenRouter' }, { status: 400 })
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Math Tutor'
      }

      const response = await fetch(`${openrouterEndpoint}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`)
      }

      const openrouterData = await response.json()
      data = {
        response: openrouterData.choices?.[0]?.message?.content || '',
        model: openrouterData.model,
      }
    } else {
      // Ollama API (original)
      const ollamaEndpoint = endpoint || OLLAMA_BASE_URL

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const response = await fetch(`${ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 2048, // 增加到2048确保完整响应
          }
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`)
      }

      data = await response.json()
    }

    // 解析生成的题目
    try {
      // 先尝试匹配完整的 JSON 数组
      let jsonMatch = data.response.match(/\[[\s\S]*\]/)

      if (!jsonMatch) {
        throw new Error('AI返回格式不正确，未找到JSON数组，请重试')
      }

      let jsonStr = jsonMatch[0]

      // 尝试修复常见的截断问题
      // 如果 JSON 不完整，尝试补全
      const openBraces = (jsonStr.match(/\{/g) || []).length
      const closeBraces = (jsonStr.match(/\}/g) || []).length
      const openBrackets = (jsonStr.match(/\[/g) || []).length
      const closeBrackets = (jsonStr.match(/\]/g) || []).length

      // 如果花括号不匹配，说明对象被截断了
      if (openBraces > closeBraces) {
        // 添加缺失的闭合花括号
        for (let i = 0; i < openBraces - closeBraces; i++) {
          jsonStr += '}'
        }
      }

      // 如果方括号不匹配
      if (openBrackets > closeBrackets) {
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          jsonStr += ']'
        }
      }

      // 尝试解析
      let questions
      try {
        questions = JSON.parse(jsonStr)
      } catch (parseErr) {
        throw new Error('AI生成的JSON格式无效，请重试或减少题目数量')
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('生成的题目数量为0')
      }

      // 验证并修复题目格式
      const validQuestions = questions
        .filter(q => q && typeof q === 'object') // 过滤掉无效的条目
        .map((q, index) => {
          // 清理可能被截断的字段
          const cleanText = (text: string) => {
            if (!text) return ''
            text = String(text).trim()

            // 移除未完成的句子（以标点符号结尾为完整句子）
            const punctuations = ['。', '！', '？', '.', '!', '?', '）', ')']
            let lastPuncIndex = -1

            for (const punct of punctuations) {
              const idx = text.lastIndexOf(punct)
              if (idx > lastPuncIndex) {
                lastPuncIndex = idx
              }
            }

            // 如果找到标点符号且在文本后80%位置，就截断到那里
            if (lastPuncIndex > text.length * 0.7) {
              return text.substring(0, lastPuncIndex + 1)
            }

            return text
          }

          const cleaned = {
            prompt: cleanText(q.prompt || `题目 ${index + 1}`),
            answer: String(q.answer || '').trim(),
            hint: cleanText(q.hint || '仔细思考'),
            explain: cleanText(q.explain || '请参考答案'),
            visual_guide: cleanText(q.visual_guide || ''),
            visual_data: Array.isArray(q.visual_data) ? q.visual_data : [],
            category: questionType,
            difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
          }

          return cleaned
        })
        .filter(q => q.prompt && q.answer) // 确保至少有题目和答案

      if (validQuestions.length === 0) {
        throw new Error('没有生成有效的题目')
      }

      return NextResponse.json({
        questions: validQuestions,
        model: data.model,
        duration: data.total_duration,
      })
    } catch (parseError) {
      return NextResponse.json({
        error: 'AI生成的题目格式解析失败，请重试',
        details: parseError instanceof Error ? parseError.message : 'Parse failed'
      }, { status: 500 })
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({
        error: '生成超时，请尝试减少题目数量或使用更小的模型'
      }, { status: 408 })
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : '生成题目失败',
      details: 'Server error'
    }, { status: 500 })
  }
}
