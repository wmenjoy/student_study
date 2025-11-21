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

  // 添加随机种子和时间戳，确保每次生成不同的题目
  const randomSeed = Math.floor(Math.random() * 10000)
  const timestamp = Date.now()
  
  // 随机场景列表，增加题目多样性
  const scenarios = [
    '购物、旅游、运动、学习',
    '游戏、比赛、聚会、活动',
    '家务、做饭、种植、养宠物',
    '交通、出行、探险、郊游',
    '节日、庆祝、分享、礼物',
    '科学实验、手工制作、艺术创作',
    '图书馆、博物馆、公园、游乐场'
  ]
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]

  return `你是一位经验丰富的小学数学老师。请生成${count}道${gradeDesc}${questionType}应用题，难度为${difficultyDesc}。

【重要】每次生成的题目必须不同！请使用不同的数字、不同的场景、不同的人物名字。
- 随机种子：${randomSeed}
- 时间戳：${timestamp}
- 建议场景：${randomScenario}
- 请确保题目具有创意和多样性，避免重复

要求：
1. 每道题目必须包含：题目、答案、提示、详细解析、图示分解步骤、可视化绘图指令
2. 题目要贴近生活，有趣味性
3. 数字要合理，符合年级水平
4. 答案必须是准确的整数或小数
5. 解析要详细，帮助学生理解
6. **图示分解步骤(visual_guide)的数量必须与可视化绘图指令(visual_data)的step数量一致**
   - 如果绘图有5个step(0-4)，那么visual_guide应该有5行说明
   - 每行说明对应一个step的内容
   - 用换行符(\n)分隔每个步骤
7. 可视化绘图指令必须详细展示解题逻辑，**每个指令必须包含step属性，用于分步骤动画显示**

可视化绘图指令格式说明（动画效果）：
- 支持的图形类型：
  * **基础图形**：
    - line(线段): 直线连接两点，参数：x1,y1,x2,y2
    - rect(矩形): 表示数量、区域，参数：x,y,width,height,fill,fillColor
    - circle(圆形): 表示物品、强调，参数：x,y,radius,fill,fillColor
    - ellipse(椭圆): 容器、几何图形，参数：x,y,radiusX,radiusY,fill,fillColor
    - polygon(多边形): 三角形、梯形等，参数：points[{x,y}],closed,fill,fillColor
  * **连接标注**：
    - arrow(箭头): 单向指向，参数：x1,y1,x2,y2
    - double-arrow(双向箭头): 相向关系，参数：x1,y1,x2,y2
    - bracket(大括号): 标注范围、总数，参数：x1,y1,x2,y2
    - dashed-line(虚线): 辅助线、分隔，参数：x1,y1,x2,y2,dash
    - curve(曲线): 连接、关系，参数：x1,y1,x2,y2,x,y(控制点)
  * **特殊图形**：
    - arc(圆弧/扇形): 角度、饼图，参数：x,y,radius,startAngle,endAngle,fill
    - fraction(分数): 分数显示，参数：x,y,numerator,denominator,size
    - text(文字): 标注、说明，参数：x,y,text,size
    - clear(清除): 清除区域，参数：x,y,width,height 或 clearPrevious
- 通用属性：color(颜色), lineWidth(线宽), **step(步骤编号，从0开始)**
- 填充属性：fill(是否填充), fillColor(填充颜色，不设置则半透明)
- 画布尺寸：600x300像素
- **step属性是动画的关键**：
  * step=0: 第一帧显示的内容（通常是标题和初始状态）
  * step=1: 第二帧显示的内容（在第一帧基础上增加）
  * step=2: 第三帧显示的内容（在前两帧基础上增加）
  * 以此类推，每一步都是累积显示的
- **动画设计原则**：
  * 每个step应该展示一个清晰的解题步骤
  * 建议3-6个step，不要太多也不要太少
  * 先画基础图形，再画辅助线，最后画文字说明
  * 使用不同颜色区分不同概念（如：蓝色表示已知，红色表示关键，黄色表示结果）
  * **避免内容重叠的关键规则**：
    - 如果要在同一位置显示不同内容（如虚线框变成实线框），有两种清除方法：
    - **方法1（推荐）**：使用 clear 指令清除指定区域
      * {"type":"clear","x":95,"y":55,"width":210,"height":45,"step":5}
      * 清除区域要比旧内容稍大（上下左右各多5像素）
    - **方法2**：使用 clear 指令清除之前所有内容，重新开始
      * {"type":"clear","clearPrevious":true,"step":5}
      * 然后重新画所有需要显示的内容
    - 示例：旧内容在(100,60,200,35)，清除区域应该是(95,55,210,45)
- 必须展示解题过程，不能只画静态的标签框

和差问题绘图示例（正确的图解逻辑）：
题目：李明和王华分月饼，李明比王华多6块，两人一共34块，问各有多少？

[
  // Step 0: 标题和总数
  {"type":"text","x":300,"y":20,"text":"和差问题图解","size":16,"color":"#1e40af","step":0},
  {"type":"bracket","x1":80,"y1":60,"x2":80,"y2":160,"color":"#6b7280","step":0},
  {"type":"text","x":50,"y":110,"text":"总数34","size":13,"color":"#6b7280","step":0},
  
  // Step 1: 画出李明的部分（未知，用虚线框）
  {"type":"dashed-line","x1":100,"y1":60,"x2":300,"y2":60,"color":"#93c5fd","lineWidth":2,"step":1},
  {"type":"dashed-line","x1":100,"y1":95,"x2":300,"y2":95,"color":"#93c5fd","lineWidth":2,"step":1},
  {"type":"dashed-line","x1":100,"y1":60,"x2":100,"y2":95,"color":"#93c5fd","lineWidth":2,"step":1},
  {"type":"dashed-line","x1":300,"y1":60,"x2":300,"y2":95,"color":"#93c5fd","lineWidth":2,"step":1},
  {"type":"text","x":200,"y":77,"text":"李明: ?","size":14,"color":"#1e40af","step":1},
  
  // Step 2: 画出王华的部分（也是未知）
  {"type":"dashed-line","x1":100,"y1":110,"x2":250,"y2":110,"color":"#93c5fd","lineWidth":2,"step":2},
  {"type":"dashed-line","x1":100,"y1":145,"x2":250,"y2":145,"color":"#93c5fd","lineWidth":2,"step":2},
  {"type":"dashed-line","x1":100,"y1":110,"x2":100,"y2":145,"color":"#93c5fd","lineWidth":2,"step":2},
  {"type":"dashed-line","x1":250,"y1":110,"x2":250,"y2":145,"color":"#93c5fd","lineWidth":2,"step":2},
  {"type":"text","x":175,"y":127,"text":"王华: ?","size":14,"color":"#1e40af","step":2},
  
  // Step 3: 标注多出的6块
  {"type":"rect","x":260,"y":110,"width":40,"height":35,"color":"#fcd34d","step":3},
  {"type":"text","x":280,"y":127,"text":"+6","size":14,"color":"#dc2626","step":3},
  {"type":"arrow","x1":250,"y1":80,"x2":280,"y2":110,"color":"#dc2626","step":3},
  {"type":"text","x":320,"y":80,"text":"李明多6块","size":12,"color":"#dc2626","step":3},
  
  // Step 4: 计算步骤
  {"type":"text","x":400,"y":70,"text":"① 去掉多的6块","size":12,"color":"#059669","step":4},
  {"type":"text","x":400,"y":90,"text":"   34-6=28块","size":12,"color":"#059669","step":4},
  {"type":"text","x":400,"y":115,"text":"② 平均分给两人","size":12,"color":"#059669","step":4},
  {"type":"text","x":400,"y":135,"text":"   28÷2=14块","size":12,"color":"#059669","step":4},
  
  // Step 5: 显示答案（使用 clear 指令清除旧内容）
  {"type":"clear","x":95,"y":55,"width":210,"height":45,"step":5},
  {"type":"rect","x":100,"y":60,"width":200,"height":35,"color":"#93c5fd","step":5},
  {"type":"text","x":200,"y":77,"text":"李明: 14+6=20块","size":13,"color":"#1e40af","step":5},
  {"type":"clear","x":95,"y":105,"width":210,"height":45,"step":5},
  {"type":"rect","x":100,"y":110,"width":150,"height":35,"color":"#93c5fd","step":5},
  {"type":"text","x":175,"y":127,"text":"王华: 14块","size":13,"color":"#1e40af","step":5},
  {"type":"rect","x":260,"y":110,"width":40,"height":35,"color":"#fcd34d","step":5},
  {"type":"text","x":280,"y":127,"text":"+6","size":14,"color":"#dc2626","step":5}
]

关键点：
1. 总数34是两人的和，不是某一个人的数量
2. 用虚线框表示未知数量
3. 先画出相等部分，再标注多出的部分
4. **显示答案时，使用 clear 指令清除旧内容（虚线框），再画实线框和答案**
5. clear 区域要比旧内容稍大一点，确保完全覆盖

倍数问题绘图示例（动画分步展示，避免重叠）：
[
  // Step 0: 标题和1倍数量
  {"type":"text","x":300,"y":20,"text":"倍数问题图解","size":16,"color":"#1e40af","step":0},
  {"type":"rect","x":80,"y":60,"width":60,"height":35,"color":"#93c5fd","step":0},
  {"type":"text","x":110,"y":45,"text":"小数(1倍)","size":11,"color":"#1e40af","step":0},
  {"type":"text","x":110,"y":77,"text":"?","size":16,"color":"#6b7280","step":0},
  
  // Step 1: 3倍数量
  {"type":"rect","x":80,"y":120,"width":60,"height":35,"color":"#fcd34d","step":1},
  {"type":"rect","x":145,"y":120,"width":60,"height":35,"color":"#fcd34d","step":1},
  {"type":"rect","x":210,"y":120,"width":60,"height":35,"color":"#fcd34d","step":1},
  {"type":"text","x":170,"y":105,"text":"大数(3倍)","size":11,"color":"#d97706","step":1},
  
  // Step 2: 标注差值
  {"type":"arrow","x1":145,"y1":75,"x2":275,"y2":75,"color":"#dc2626","step":2},
  {"type":"text","x":210,"y":60,"text":"相差24","size":12,"color":"#dc2626","step":2},
  {"type":"text","x":340,"y":75,"text":"差=2倍","size":13,"color":"#dc2626","step":2},
  
  // Step 3: 第一步计算
  {"type":"text","x":400,"y":100,"text":"① 1倍 = 24÷2 = 12","size":12,"color":"#059669","step":3},
  
  // Step 4: 第二步计算
  {"type":"text","x":400,"y":125,"text":"② 大数 = 12×3 = 36","size":12,"color":"#059669","step":4},
  
  // Step 5: 标注答案（使用 clear 指令清除问号）
  {"type":"clear","x":75,"y":70,"width":70,"height":20,"step":5},
  {"type":"text","x":110,"y":77,"text":"12","size":16,"color":"#059669","step":5},
  {"type":"rect","x":75,"y":100,"width":70,"height":25,"color":"#dcfce7","step":5},
  {"type":"text","x":110,"y":112,"text":"小数: 12","size":13,"color":"#059669","step":5},
  {"type":"rect","x":370,"y":110,"width":200,"height":30,"color":"#fef3c7","step":5},
  {"type":"text","x":470,"y":125,"text":"大数: 12×3=36","size":13,"color":"#dc2626","step":5}
]

注意：Step 5 使用 clear 指令清除 Step 0 的问号，然后显示答案。

请严格按照以下 JSON 格式返回（只返回JSON数组，不要有其他文字）：
[
  {
    "prompt": "题目内容",
    "answer": "答案（纯数字或算式结果）",
    "hint": "解题提示",
    "explain": "详细解析过程",
    "visual_guide": "第一步说明\n第二步说明\n第三步说明\n第四步说明\n第五步说明（每步用\\n分隔，步骤数量必须与visual_data的最大step+1相等）",
    "visual_data": [详细的绘图指令JSON数组，每个指令必须包含step属性，step从0开始]
  }
]

示例：如果visual_data中最大step是4，那么visual_guide应该有5行说明（对应step 0-4）

**更多题型示例**：

分数问题（饼图）：使用 arc 画扇形，fraction 显示分数
几何问题（三角形）：使用 polygon 画多边形，dashed-line 画高
行程问题（相向而行）：使用 double-arrow 表示双向，circle 表示地点
容量问题（水杯）：使用 ellipse 画杯口，rect 画杯身，arc 画液面

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
          temperature: 0.9, // 提高温度增加随机性
          max_tokens: 2048,
          top_p: 0.95, // 添加 top_p 增加多样性
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
            temperature: 0.9, // 提高温度增加随机性
            top_p: 0.95, // 添加 top_p 增加多样性
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
