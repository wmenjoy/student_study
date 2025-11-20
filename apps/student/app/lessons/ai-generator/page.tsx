"use client"
import { useState, useEffect } from "react"
import {
  checkOllamaAvailable,
  getAvailableModels,
  generateQuestions,
  GeneratedQuestion,
  QuestionGenerateParams
} from "../../../lib/ollamaService"
import { VisualCanvas } from "../../../components/VisualCanvas"

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
  const [showResult, setShowResult] = useState(false)

  // 配置状态
  const [showConfig, setShowConfig] = useState(false)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [useCloud, setUseCloud] = useState(false)
  const [provider, setProvider] = useState<'ollama' | 'openrouter'>('ollama')

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
  }, [])

  // 保存配置
  const handleSaveConfig = () => {
    localStorage.setItem("ollama_endpoint", apiEndpoint)
    localStorage.setItem("ollama_api_key", apiKey)
    localStorage.setItem("ollama_use_cloud", String(useCloud))
    localStorage.setItem("ollama_provider", provider)
    setShowConfig(false)
    // 重新检查可用性
    checkAvailability()
  }

  // 检查 Ollama 可用性
  const checkAvailability = async () => {
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
              setOllamaAvailable(true)
              return
            }
          }
        } catch (error) {
          // 如果获取失败，使用默认的免费模型列表
        }
      }

      // 使用默认的免费模型列表
      setOllamaAvailable(true)
      setModels(openrouterFreeModels)
      setSelectedModel(openrouterFreeModels[0])
      return
    }

    const config = {
      endpoint: useCloud ? apiEndpoint : undefined,
      apiKey: useCloud ? apiKey : undefined,
    }
    const available = await checkOllamaAvailable(config)
    setOllamaAvailable(available)

    if (available) {
      const modelList = await getAvailableModels(config)
      setModels(modelList)
      if (modelList.length > 0) {
        // 优先选择 qwen 模型
        const qwenModel = modelList.find(m => m.includes('qwen'))
        setSelectedModel(qwenModel || modelList[0])
      }
    }
  }

  useEffect(() => {
    checkAvailability()
  }, [useCloud, provider])

  // 当 OpenRouter API Key 变化时，重新获取模型列表
  useEffect(() => {
    if (provider === 'openrouter' && apiKey) {
      checkAvailability()
    }
  }, [apiKey])

  const handleGenerate = async () => {
    if (!selectedModel) {
      setError("请先选择一个 AI 模型")
      return
    }

    // OpenRouter 需要 API Key
    if (provider === 'openrouter' && !apiKey) {
      setError("使用 OpenRouter 需要配置 API Key，请点击右上角配置按钮")
      return
    }

    setGenerating(true)
    setError(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setShowResult(false)

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
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setUserAnswer("")
      setShowResult(false)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setUserAnswer("")
      setShowResult(false)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = currentQuestion && userAnswer.trim() === String(currentQuestion.answer).trim()

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border-4 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">🤖✨</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  AI 智能出题助手
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  {provider === 'openrouter' ? "🌐 使用 OpenRouter" : (useCloud ? "☁️ 使用云端 AI" : "💻 使用本地 AI")} · 让学习更有趣
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              ⚙️ 配置
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-8 border-4 border-yellow-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> 出题设置
              </h2>

              {/* 新功能提示 */}
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-xl">
                <div className="text-xs text-green-700 leading-relaxed">
                  <div className="font-bold mb-1 flex items-center gap-1">
                    <span>✨</span> 新功能
                  </div>
                  <div>AI 现在会自动绘制图形帮助理解题目！</div>
                </div>
              </div>

              {/* 年级题型说明 */}
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                <div className="text-xs text-blue-700 leading-relaxed">
                  <div className="font-bold mb-1 flex items-center gap-1">
                    <span>📖</span> {grade}年级适合题型
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getAvailableQuestionTypes(grade).map((type) => (
                      <span
                        key={type.value}
                        className={`px-2 py-0.5 rounded-lg text-xs ${
                          type.value === questionType
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {type.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🧠</span> AI 模型
                  </span>
                  {provider === 'openrouter' && apiKey && (
                    <button
                      onClick={() => checkAvailability()}
                      className="text-xs px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded-lg transition-all flex items-center gap-1"
                    >
                      🔄 刷新列表
                    </button>
                  )}
                </label>
                {provider === 'openrouter' ? (
                  <>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all mb-2"
                    >
                      <option value="">选择免费模型或手动输入</option>
                      {models.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      placeholder="或手动输入模型名称（如：google/gemma-2-9b-it:free）"
                      className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                      <span>💡</span>
                      <span>可从下拉列表选择，或手动输入其他免费模型</span>
                    </div>
                  </>
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
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📚</span> 年级
                </label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(parseInt(e.target.value))}
                  className="w-full border-2 border-orange-200 rounded-xl px-3 py-2 focus:border-orange-400 outline-none bg-orange-50/50 hover:bg-orange-50 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>
                      {g}年级 ({getAvailableQuestionTypes(g).length}种题型)
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                  <span>💡</span>
                  <span>题型会根据年级自动筛选</span>
                </div>
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>📝</span> 题型 ({getAvailableQuestionTypes(grade).length}个可选)
                </label>
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
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>⚡</span> 难度
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "easy", label: "简单", color: "green", emoji: "😊" },
                    { value: "medium", label: "中等", color: "yellow", emoji: "🤔" },
                    { value: "hard", label: "困难", color: "red", emoji: "💪" },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value as any)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                        difficulty === d.value
                          ? d.color === 'green' ? 'bg-green-400 text-white' :
                            d.color === 'yellow' ? 'bg-yellow-400 text-white' :
                            'bg-red-400 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg">{d.emoji}</div>
                      <div className="text-xs">{d.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span>🔢</span> 题目数量: <span className="text-orange-500">{count}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-orange-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1题</span>
                  <span>10题</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg text-lg ${
                  generating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 hover:shadow-2xl hover:scale-105"
                }`}
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    AI 思考中...（约需 20-60 秒）
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🚀 生成题目
                  </span>
                )}
              </button>

              {/* Loading tips */}
              {generating && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl text-blue-700 text-sm shadow-md">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">⏳</span> 请耐心等待...
                  </div>
                  <div className="text-xs space-y-1 ml-6">
                    <div>✨ AI 正在思考题目</div>
                    <div>⏰ 每题约需 20-30 秒</div>
                    <div>🎯 首次使用可能较慢</div>
                    <div>🚫 请勿刷新页面</div>
                    <div>💡 如超时请减少题目数量</div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm shadow-md">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">❌</span> 生成失败
                  </div>
                  <div className="whitespace-pre-line text-xs">{error}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Questions */}
          <div className="lg:col-span-2">
            {questions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-pink-200">
                <div className="text-7xl mb-4 animate-pulse">📝✨</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  还没有题目呢
                </h3>
                <p className="text-gray-500 text-lg">
                  在左侧选择设置，然后点击 "🚀 生成题目" 开始吧！
                </p>
                <div className="mt-6 text-4xl">👈</div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">
                {/* Question Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-bold flex items-center gap-2">
                      <span>📖</span> 题目 {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      {difficulty === 'easy' ? '😊 简单' :
                       difficulty === 'medium' ? '🤔 中等' : '💪 困难'}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-r from-orange-100 to-pink-100 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 h-3 rounded-full transition-all shadow-md"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="mb-6 space-y-4">
                  {/* Question */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-5 rounded-r-2xl shadow-md">
                    <div className="text-sm text-blue-600 font-bold mb-2 flex items-center gap-2">
                      <span>📚</span> {currentQuestion.category}
                    </div>
                    <div className="text-xl text-gray-800 font-medium leading-relaxed">{currentQuestion.prompt}</div>
                  </div>

                  {/* Visual Guide - Text Steps */}
                  {currentQuestion.visual_guide && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-5 rounded-r-2xl shadow-md">
                      <div className="text-sm text-purple-600 font-bold mb-3 flex items-center gap-2">
                        <span>🎨</span> 图示分解步骤
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl">
                        {currentQuestion.visual_guide}
                      </div>
                    </div>
                  )}

                  {/* Visual Canvas - NEW! AI绘制的图形 */}
                  {currentQuestion.visual_data && currentQuestion.visual_data.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-400 p-5 rounded-r-2xl shadow-md">
                      <div className="text-sm text-green-600 font-bold mb-3 flex items-center gap-2">
                        <span>🖼️</span> AI 智能绘图
                      </div>
                      <VisualCanvas instructions={currentQuestion.visual_data} width={550} height={350} />
                    </div>
                  )}

                  {/* Hint */}
                  {currentQuestion.hint && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-r-2xl shadow-md">
                      <div className="text-sm text-amber-700 font-medium flex items-center gap-2">
                        <span className="text-lg">💡</span> 提示: {currentQuestion.hint}
                      </div>
                    </div>
                  )}

                  {/* Answer Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">✏️</span> 你的答案:
                    </label>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !showResult) {
                          handleSubmitAnswer()
                        }
                      }}
                      placeholder="输入答案..."
                      disabled={showResult}
                      className="w-full border-3 border-orange-200 rounded-2xl px-5 py-4 text-lg focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none disabled:bg-gray-50 shadow-md transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  {!showResult && (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      className="w-full py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-2xl font-bold text-lg hover:from-blue-500 hover:to-indigo-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        ✅ 提交答案
                      </span>
                    </button>
                  )}

                  {/* Result */}
                  {showResult && (
                    <div className={`p-6 rounded-2xl shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-3 border-green-300' : 'bg-gradient-to-r from-red-50 to-pink-50 border-3 border-red-300'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">{isCorrect ? '🎉' : '💪'}</div>
                        <div className={`font-bold text-xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? '太棒了！回答正确！' : '再想想哦！'}
                        </div>
                      </div>
                      <div className="bg-white/70 p-4 rounded-xl mb-3 shadow-inner">
                        <span className="font-bold text-gray-700">✔️ 正确答案: </span>
                        <span className="text-lg font-bold text-indigo-600">{currentQuestion.answer}</span>
                      </div>
                      {currentQuestion.explain && (
                        <div className="bg-white/70 p-4 rounded-xl shadow-inner">
                          <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📖</span> 详细解析:
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">{currentQuestion.explain}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl font-bold hover:from-gray-300 hover:to-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>⬅️</span> 上一题
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex-1 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl font-bold hover:from-gray-300 hover:to-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    下一题 <span>➡️</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 配置模态框 */}
        {showConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border-4 border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                  <span>⚙️</span> API 配置
                </h2>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl transition-all hover:rotate-90 transform"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span>🤖</span> AI 服务提供商
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setProvider('ollama')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        provider === 'ollama'
                          ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-gray-800 flex items-center justify-center gap-2">
                        <span>💻</span> Ollama
                      </div>
                      <div className="text-xs text-gray-600 mt-1">本地或云端</div>
                    </button>
                    <button
                      onClick={() => setProvider('openrouter')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        provider === 'openrouter'
                          ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-gray-800 flex items-center justify-center gap-2">
                        <span>🌐</span> OpenRouter
                      </div>
                      <div className="text-xs text-gray-600 mt-1">免费云端模型</div>
                    </button>
                  </div>
                </div>

                {/* Ollama: 使用云端 API */}
                {provider === 'ollama' && (
                  <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200 shadow-md">
                    <input
                      type="checkbox"
                      id="useCloud"
                      checked={useCloud}
                      onChange={(e) => setUseCloud(e.target.checked)}
                      className="w-6 h-6 accent-orange-400"
                    />
                    <label htmlFor="useCloud" className="flex-1 cursor-pointer">
                      <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <span>☁️</span> 使用云端 Ollama
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        勾选后将使用云端 Ollama 服务，需要配置 API endpoint 和 API key
                      </div>
                    </label>
                  </div>
                )}

                {/* Ollama Cloud Configuration */}
                {provider === 'ollama' && useCloud && (
                  <>
                    {/* API Endpoint */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🌐</span> API Endpoint
                      </label>
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        placeholder="https://api.example.com"
                        className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none shadow-sm"
                      />
                      <div className="text-xs text-gray-500 mt-2 flex items-start gap-2">
                        <span>💡</span>
                        <span>例如: https://api.openai.com 或自定义的 Ollama 服务地址</span>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🔑</span> API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="输入你的 API Key"
                        className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none shadow-sm"
                      />
                      <div className="text-xs text-gray-500 mt-2 flex items-start gap-2">
                        <span>🔒</span>
                        <span>API Key 将保存在浏览器本地，不会上传到服务器</span>
                      </div>
                    </div>
                  </>
                )}

                {/* OpenRouter Configuration */}
                {provider === 'openrouter' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>🔑</span> OpenRouter API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none shadow-sm"
                    />
                    <div className="text-xs text-gray-500 mt-2 flex items-start gap-2">
                      <span>💡</span>
                      <div>
                        <div>在 <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">OpenRouter</a> 获取免费 API Key</div>
                        <div className="mt-1">API Key 将保存在浏览器本地，不会上传到服务器</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ollama Local Mode Info */}
                {provider === 'ollama' && !useCloud && (
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-md">
                    <div className="font-bold text-blue-700 mb-2 text-lg flex items-center gap-2">
                      <span>💻</span> 本地模式
                    </div>
                    <div className="text-sm text-blue-600 leading-relaxed">
                      将使用本地 Ollama 服务（http://localhost:11434）<br/>
                      请确保 Ollama 已安装并运行
                    </div>
                  </div>
                )}

                {/* OpenRouter Info */}
                {provider === 'openrouter' && (
                  <div className="p-5 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-2xl shadow-md">
                    <div className="font-bold text-green-700 mb-2 text-lg flex items-center gap-2">
                      <span>✨</span> OpenRouter 免费模型
                    </div>
                    <div className="text-sm text-green-600 leading-relaxed">
                      <div className="mb-2">使用 OpenRouter 可以访问多个免费的 AI 模型：</div>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Google Gemma 2 9B</li>
                        <li>Meta Llama 3.1 8B</li>
                        <li>Microsoft Phi-3 Mini</li>
                        <li>Qwen 2 7B</li>
                      </ul>
                      <div className="mt-2">或手动输入其他免费模型名称</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 按钮 */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowConfig(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={
                    (provider === 'ollama' && useCloud && (!apiEndpoint || !apiKey)) ||
                    (provider === 'openrouter' && !apiKey)
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white rounded-xl font-bold hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>✅</span> 保存配置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
