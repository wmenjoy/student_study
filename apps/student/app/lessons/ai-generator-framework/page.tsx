"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { VisualCanvas } from "../../../components/VisualCanvas"
import {
  checkOllamaAvailable,
  getAvailableModels,
  generateQuestions,
  GeneratedQuestion,
  QuestionGenerateParams
} from "../../../lib/ollamaService"

const questionTypes = [
  { value: "和差问题", label: "和差问题", grades: [1, 2, 3, 4, 5, 6] },
  { value: "倍数问题", label: "倍数问题", grades: [3, 4, 5, 6] },
  { value: "行程问题", label: "行程问题", grades: [4, 5, 6] },
  { value: "工程问题", label: "工程问题", grades: [5, 6] },
  { value: "购物问题", label: "购物问题", grades: [1, 2, 3, 4, 5, 6] },
  { value: "容量问题", label: "容量问题", grades: [1, 2, 3, 4, 5, 6] },
  { value: "植树问题", label: "植树问题", grades: [3, 4, 5, 6] },
  { value: "鸡兔同笼", label: "鸡兔同笼", grades: [4, 5, 6] },
  { value: "盈亏问题", label: "盈亏问题", grades: [4, 5, 6] },
  { value: "浓度问题", label: "浓度问题", grades: [6] },
  { value: "百分比应用", label: "百分比应用", grades: [5, 6] },
  { value: "分数应用", label: "分数应用", grades: [4, 5, 6] },
]

const stepLabels = [
  "查看题目要求",
  "阅读题目内容",
  "思考解题方法", 
  "输入你的答案",
  "查看AI图解步骤",
  "跟着图解学习",
  "完成学习总结"
]

export default function AIGeneratorPage() {
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")

  const [grade, setGrade] = useState(3)
  const [questionType, setQuestionType] = useState("和差问题")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [count, setCount] = useState(1)

  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [hasAnswered, setHasAnswered] = useState(false)
  const [diagramStep, setDiagramStep] = useState(0)

  // 配置状态
  const [showConfig, setShowConfig] = useState(false)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [useCloud, setUseCloud] = useState(false)
  const [provider, setProvider] = useState<'ollama' | 'openrouter'>('ollama')
  
  // 跟踪是否已初始化
  const initializationRef = useRef(false)

  // OpenRouter 免费模型列表
  const openrouterFreeModels = [
    'google/gemma-2-9b-it:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
  ]

  // 根据年级获取可用题型
  const getAvailableQuestionTypes = (currentGrade: number) => {
    return questionTypes.filter(type => type.grades.includes(currentGrade))
  }

  // 当年级改变时，检查题型是否仍可用
  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade)
    const availableTypes = getAvailableQuestionTypes(newGrade)

    // 如果当前题型不在新年级的可用题型中，切换到第一个可用题型
    if (!availableTypes.find(type => type.value === questionType)) {
      setQuestionType(availableTypes[0].value)
    }
  }

  // 从 localStorage 加载配置
  useEffect(() => {
    const savedEndpoint = localStorage.getItem("ollama_endpoint")
    const savedApiKey = localStorage.getItem("ollama_api_key")
    const savedUseCloud = localStorage.getItem("ollama_use_cloud")
    const savedProvider = localStorage.getItem("ollama_provider") as 'ollama' | 'openrouter'

    if (savedEndpoint) setApiEndpoint(savedEndpoint)
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedUseCloud) setUseCloud(savedUseCloud === "true")
    if (savedProvider) setProvider(savedProvider)
    else {
      // 默认先尝试 Ollama
      setProvider('ollama')
    }
  }, [])
  
  // 初始化检查 - 只在组件挂载时运行一次
  useEffect(() => {
    if (initializationRef.current) return
    initializationRef.current = true
    
    const performInitialCheck = async () => {
      // 先尝试 Ollama
      const config = {
        endpoint: useCloud ? apiEndpoint : undefined,
        apiKey: useCloud ? apiKey : undefined,
      }
      const available = await checkOllamaAvailable(config)
      
      if (available) {
        setOllamaAvailable(true)
        const modelList = await getAvailableModels(config)
        if (modelList.length > 0) {
          setModels(modelList)
          // 优先选择 qwen 模型
          const qwenModel = modelList.find(m => m.includes('qwen'))
          setSelectedModel(qwenModel || modelList[0])
        }
      } else {
        // Ollama 不可用，自动切换到 OpenRouter 作为后备方案
        setProvider('openrouter')
        setOllamaAvailable(true)
        setModels(openrouterFreeModels)
        setSelectedModel(openrouterFreeModels[0])
      }
    }
    
    performInitialCheck()
  }, [])

  // 手动检查当前提供商的可用性
  const manualCheckAvailability = useCallback(async () => {
    if (provider === 'openrouter') {
      // OpenRouter: 如果有 API Key，尝试获取免费模型列表
      if (apiKey) {
        try {
          const response = await fetch('/api/openrouter/models', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.models && data.models.length > 0) {
              setModels(data.models)
              setSelectedModel(data.models[0])
              return
            }
          }
        } catch (error) {
          // 如果获取失败，使用默认的免费模型列表
        }
      }

      // 使用默认的免费模型列表
      setModels(openrouterFreeModels)
      setSelectedModel(openrouterFreeModels[0])
      return
    }

    // 检查 Ollama
    const config = {
      endpoint: useCloud ? apiEndpoint : undefined,
      apiKey: useCloud ? apiKey : undefined,
    }
    const available = await checkOllamaAvailable(config)
    
    if (available) {
      const modelList = await getAvailableModels(config)
      if (modelList.length > 0) {
        setModels(modelList)
        // 优先选择 qwen 模型
        const qwenModel = modelList.find(m => m.includes('qwen'))
        setSelectedModel(qwenModel || modelList[0])
      }
    }
  }, [provider, useCloud, apiEndpoint, apiKey, openrouterFreeModels])

  // 保存配置
  const handleSaveConfig = () => {
    localStorage.setItem("ollama_endpoint", apiEndpoint)
    localStorage.setItem("ollama_api_key", apiKey)
    localStorage.setItem("ollama_use_cloud", String(useCloud))
    localStorage.setItem("ollama_provider", provider)
    setShowConfig(false)
    // 重新检查可用性
    manualCheckAvailability()
  }

  const handleGenerate = async () => {
    if (!selectedModel) {
      setError("请先选择一个 AI 模型")
      return
    }

    // OpenRouter 需要 API Key
    if (provider === 'openrouter' && !apiKey) {
      setError("使用 OpenRouter 需要配置 API Key，请点击配置按钮")
      return
    }

    setGenerating(true)
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setHasAnswered(false)
    setDiagramStep(0)

    try {
      const params: QuestionGenerateParams = {
        grade,
        questionType,
        difficulty,
        count,
        model: selectedModel,
        endpoint: provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : (useCloud ? apiEndpoint : undefined),
        apiKey: provider === 'openrouter' ? apiKey : (useCloud ? apiKey : undefined),
        provider,
      }

      const generatedQuestions = await generateQuestions(params)

      if (generatedQuestions.length === 0) {
        throw new Error('没有生成任何题目，请重试')
      }

      setQuestions(generatedQuestions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "生成题目失败"

      let tips = "\n\n💡 提示：\n- 确保 Ollama 正在运行\n- 尝试减少题目数量（建议1题）\n- 使用更小的模型（如 qwen2.5:3b）\n- 检查模型是否已下载"

      if (errorMessage.includes('timeout') || errorMessage.includes('超时') || errorMessage.includes('408')) {
        tips = "\n\n💡 提示：\n- 生成超时，请减少题目数量\n- 每题约需 20-30 秒\n- 建议一次只生成 1 题\n- 或使用更小更快的模型"
      } else if (errorMessage.includes('JSON') || errorMessage.includes('格式') || errorMessage.includes('解析')) {
        tips = "\n\n💡 提示：\n- AI 响应格式有误或被截断\n- 请重试或减少题目数量\n- 建议一次只生成 1 题\n- 使用较新的 qwen2.5 模型效果更好"
      }

      setError(errorMessage + tips)
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmitAnswer = () => {
    setHasAnswered(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer("")
      setHasAnswered(false)
      setDiagramStep(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserAnswer("")
      setHasAnswered(false)
      setDiagramStep(0)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = currentQuestion && userAnswer.trim() === String(currentQuestion.answer).trim()

  // 获取图解步骤
  const getDiagramSteps = () => {
    if (!currentQuestion || !hasAnswered) return []
    
    const steps = []
    if (currentQuestion.visual_guide) {
      // 将文本说明分解为步骤
      const lines = currentQuestion.visual_guide.split('\n').filter(line => line.trim())
      steps.push(...lines)
    }
    if (currentQuestion.visual_data && currentQuestion.visual_data.length > 0) {
      steps.push("查看AI绘制的图形帮助理解")
    }
    if (currentQuestion.explain) {
      steps.push("学习详细的解题方法")
    }
    return steps.length > 0 ? steps : ["查看解题过程"]
  }

  const diagramSteps = getDiagramSteps()

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  if (ollamaAvailable === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-orange-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-medium">正在检测 Ollama 服务...</p>
          <p className="text-gray-500 text-sm mt-2">请稍候 ⏳</p>
        </div>
      </div>
    )
  }

  if (!ollamaAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-red-200">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Ollama 服务未启动</h1>
              <p className="text-gray-600 mb-8 text-lg">
                请确保已安装并启动 Ollama 本地服务 🚀
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-left shadow-inner">
                <h3 className="font-bold text-gray-700 mb-4 text-xl flex items-center gap-2">
                  <span>📋</span> 安装步骤：
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-orange-500 text-lg">1.</span>
                    <span>访问 <a href="https://ollama.ai" target="_blank" className="text-blue-500 underline hover:text-blue-600 font-bold">ollama.ai</a> 下载安装</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-orange-500 text-lg">2.</span>
                    <span>安装后运行: <code className="bg-gray-200 px-3 py-1 rounded-lg font-mono text-xs">ollama serve</code></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-orange-500 text-lg">3.</span>
                    <span>下载模型: <code className="bg-gray-200 px-3 py-1 rounded-lg font-mono text-xs">ollama pull qwen2.5:7b</code></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-orange-500 text-lg">4.</span>
                    <span>刷新此页面 🔄</span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white rounded-2xl font-bold text-lg hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  🔄 重新检测
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md mb-4">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖✨</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                AI 智能出题助手 <span className="text-sm text-gray-500">(框架版本)</span>
              </h1>
              <p className="text-xs text-gray-600">
                <a href="/lessons/ai-generator" className="text-blue-500 hover:underline">
                  ← 切换到自定义UI版本
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <LessonRunner
      title="AI 智能出题助手"
      skillId="ai-generator"
      intro={{
        story: "AI 会根据你的年级和选择的题型，为你生成有趣的数学题目，并绘制图形帮助你理解解题过程。",
        goal: "学会思考解题方法，跟着图解步骤掌握知识点",
        steps: stepLabels
      }}
      hints={{
        build: [
          "仔细阅读题目内容",
          "理解题目要求",
          "思考解题方法",
          "输入你的答案"
        ],
        map: [
          "查看AI图解步骤",
          "跟着图解学习",
          "理解解题思路"
        ],
        microtest: [
          "检查理解程度",
          "巩固知识点"
        ],
        review: [
          "回顾学习过程",
          "总结解题方法"
        ]
      }}
      variantGen={(diff) => {
        const make = (g: number, type: string, diffx: string, cnt: number) => ({ 
          label: `${g}年级 ${type} ${diffx} (${cnt}题)`, 
          apply: () => { 
            setGrade(g); 
            setQuestionType(type); 
            setDifficulty(diffx as any); 
            setCount(cnt); 
            setQuestions([]); 
            setUserAnswer(""); 
            setHasAnswered(false); 
            setDiagramStep(0);
          } 
        })
        
        const availableTypes = getAvailableQuestionTypes(grade)
        return [
          make(grade, availableTypes[0]?.value || "和差问题", "easy", 1),
          make(grade, availableTypes[1]?.value || "和差问题", "medium", 1),
          make(grade, availableTypes[0]?.value || "和差问题", "hard", 1)
        ]
      }}
      microTestGen={(diff) => {
        if (!currentQuestion || !hasAnswered) return []
        
        const items = []
        if (currentQuestion.hint) {
          items.push({
            prompt: "这道题的关键提示是什么？",
            placeholder: "输入关键提示",
            check: (v: string) => v.toLowerCase().includes(currentQuestion.hint!.toLowerCase().substring(0, 10))
          })
        }
        items.push({
          prompt: "这道题的正确答案是？",
          placeholder: "输入答案",
          check: (v: string) => v.trim() === String(currentQuestion.answer).trim()
        })
        return items
      }}
      onEvaluate={() => {
        if (!hasAnswered) {
          return { correct: false, text: "请先回答问题并查看图解步骤", hint: "完成答题后才能进行评估" }
        }
        return { 
          correct: isCorrect, 
          text: isCorrect ? "太棒了！你掌握了这道题的解题方法！" : "继续努力，多看看图解步骤会帮助你理解",
          hint: currentQuestion?.hint 
        }
      }}
    >
      <Narration avatar="/icons/area.svg" name="老师">
        {questions.length === 0 ? "让我们先来设置题目参数，生成适合你的题目吧！" :
         !hasAnswered ? "请仔细阅读题目，思考后输入你的答案" :
         isCorrect ? "太棒了！回答正确！让我们看看详细的图解步骤" :
         "没关系，让我们跟着AI图解来学习解题方法"}
      </Narration>

      <div className="controls" style={{ flexWrap: "wrap" }}>
        {questions.length === 0 && (
          <>
            {/* Model Selection */}
            <div className="control">
              <label>AI 模型</label>
              {provider === 'openrouter' ? (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
                >
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
                >
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grade Selection */}
            <div className="control">
              <label>年级</label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(parseInt(e.target.value))}
                className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>
                    {g}年级
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className="control">
              <label>题型</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
              >
                {getAvailableQuestionTypes(grade).map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="control">
              <label>难度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>

            {/* Count */}
            <div className="control">
              <label>题目数量: {count}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-orange-400"
              />
            </div>

            {/* Config Button */}
            <div className="control">
              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                ⚙️ 配置
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                generating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 hover:shadow-xl hover:scale-105"
              }`}
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  AI思考中...
                </span>
              ) : (
                "🚀 生成题目"
              )}
            </button>
          </>
        )}

        {questions.length > 0 && (
          <>
            {/* Question Navigation */}
            <div className="control">
              <label>题目 {currentQuestionIndex + 1} / {questions.length}</label>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⬅️ 上一题
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一题 ➡️
                </button>
              </div>
            </div>

            {/* New Question Button */}
            <div className="control">
              <button
                onClick={() => {
                  setQuestions([])
                  setUserAnswer("")
                  setHasAnswered(false)
                  setDiagramStep(0)
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                📝 生成新题目
              </button>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="intro-block" style={{ borderColor: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <div className="intro-title" style={{ color: 'var(--danger)' }}>❌ 生成失败</div>
          <div className="whitespace-pre-line text-sm">{error}</div>
        </div>
      )}

      {/* Question Display */}
      {currentQuestion && (
        <div className="intro-block">
          <div className="intro-title">📚 {currentQuestion.category}</div>
          <div style={{ fontSize: 18, lineHeight: 1.6, margin: '12px 0' }}>
            {currentQuestion.prompt}
          </div>

          {/* Hint - only show if not answered yet */}
          {!hasAnswered && currentQuestion.hint && (
            <div style={{ 
              backgroundColor: 'rgba(251, 191, 36, 0.1)', 
              border: '1px solid rgba(251, 191, 36, 0.3)', 
              borderRadius: 8, 
              padding: 12, 
              margin: '12px 0' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#d97706', marginBottom: 4 }}>
                💡 提示:
              </div>
              <div style={{ fontSize: 14, color: '#92400e' }}>
                {currentQuestion.hint}
              </div>
            </div>
          )}

          {/* Answer Input */}
          {!hasAnswered && (
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 8 }}>
                ✏️ 你的答案:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitAnswer()
                  }
                }}
                placeholder="输入答案..."
                style={{
                  width: '100%',
                  border: '2px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                style={{
                  marginTop: 12,
                  padding: '12px 24px',
                  backgroundColor: userAnswer.trim() ? 'var(--primary)' : 'var(--muted)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                ✅ 提交答案
              </button>
            </div>
          )}

          {/* Result */}
          {hasAnswered && (
            <div style={{ 
              margin: '16px 0',
              padding: 16,
              borderRadius: 8,
              backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 32 }}>{isCorrect ? '🎉' : '💪'}</div>
                <div style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: isCorrect ? '#16a34a' : '#dc2626' 
                }}>
                  {isCorrect ? '太棒了！回答正确！' : '再想想哦！'}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: 12, borderRadius: 6, marginBottom: 12 }}>
                <span style={{ fontWeight: 'bold', color: '#374151' }}>✔️ 正确答案: </span>
                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#4f46e5' }}>
                  {currentQuestion.answer}
                </span>
              </div>
            </div>
          )}

          {/* Diagram Steps - only show after answering */}
          {hasAnswered && diagramSteps.length > 0 && (
            <div style={{ margin: '20px 0' }}>
              <StepPlayer 
                steps={diagramSteps} 
                title="🎨 AI图解步骤" 
                index={diagramStep} 
                onIndexChange={setDiagramStep}
                auto={false}
              />
              
              {/* Show visual content based on current step */}
              <div style={{ margin: '16px 0', minHeight: 200 }}>
                {diagramStep < diagramSteps.length - 1 && currentQuestion.visual_guide && (
                  <div style={{ 
                    backgroundColor: 'rgba(168, 85, 247, 0.1)', 
                    border: '1px solid rgba(168, 85, 247, 0.3)', 
                    borderRadius: 8, 
                    padding: 16 
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#7c3aed', marginBottom: 8 }}>
                      📝 解题步骤:
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: '#4c1d95' }}>
                      {currentQuestion.visual_guide.split('\n')[diagramStep] || ''}
                    </div>
                  </div>
                )}
                
                {diagramStep === diagramSteps.length - 1 && currentQuestion.visual_data && currentQuestion.visual_data.length > 0 && (
                  <div style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)', 
                    borderRadius: 8, 
                    padding: 16 
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: 12 }}>
                      🖼️ AI 智能绘图:
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <VisualCanvas instructions={currentQuestion.visual_data} width={500} height={300} />
                    </div>
                  </div>
                )}
                
                {currentQuestion.explain && diagramStep === diagramSteps.length - 1 && (
                  <div style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)', 
                    borderRadius: 8, 
                    padding: 16,
                    marginTop: 12
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#2563eb', marginBottom: 8 }}>
                      📖 详细解析:
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: '#1e40af' }}>
                      {currentQuestion.explain}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 配置模态框 */}
      {showConfig && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: 16
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 24,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: 600,
            width: '100%',
            padding: 32,
            border: '4px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#374151' }}>
                ⚙️ API 配置
              </h2>
              <button
                onClick={() => setShowConfig(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Provider Selection */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
                  🤖 AI 服务提供商
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button
                    onClick={() => setProvider('ollama')}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: `2px solid ${provider === 'ollama' ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: provider === 'ollama' ? 'rgba(92, 157, 255, 0.1)' : '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>
                      💻 Ollama
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                      本地或云端
                    </div>
                  </button>
                  <button
                    onClick={() => setProvider('openrouter')}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: `2px solid ${provider === 'openrouter' ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: provider === 'openrouter' ? 'rgba(92, 157, 255, 0.1)' : '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>
                      🌐 OpenRouter
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                      免费云端模型
                    </div>
                  </button>
                </div>
              </div>

              {/* Ollama: 使用云端 API */}
              {provider === 'ollama' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 20, backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: 12, border: '2px solid rgba(251, 191, 36, 0.3)' }}>
                  <input
                    type="checkbox"
                    id="useCloud"
                    checked={useCloud}
                    onChange={(e) => setUseCloud(e.target.checked)}
                    style={{ width: 20, height: 20 }}
                  />
                  <label htmlFor="useCloud" style={{ cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', color: '#374151', fontSize: 16 }}>
                      ☁️ 使用云端 Ollama
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                      勾选后将使用云端 Ollama 服务，需要配置 API endpoint 和 API key
                    </div>
                  </label>
                </div>
              )}

              {/* API Endpoint */}
              {provider === 'ollama' && useCloud && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
                    🌐 API Endpoint
                  </label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.example.com"
                    style={{
                      width: '100%',
                      border: '2px solid var(--border)',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {/* API Key */}
              {(provider === 'openrouter' || (provider === 'ollama' && useCloud)) && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 }}>
                    🔑 API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={provider === 'openrouter' ? "sk-or-v1-..." : "输入你的 API Key"}
                    style={{
                      width: '100%',
                      border: '2px solid var(--border)',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                    💡 API Key 将保存在浏览器本地，不会上传到服务器
                  </div>
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button
                onClick={() => setShowConfig(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={
                  (provider === 'ollama' && useCloud && (!apiEndpoint || !apiKey)) ||
                  (provider === 'openrouter' && !apiKey)
                }
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: ((provider === 'ollama' && useCloud && (!apiEndpoint || !apiKey)) ||
                            (provider === 'openrouter' && !apiKey)) ? 0.5 : 1
                }}
              >
                ✅ 保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </LessonRunner>
    </>
  )
}