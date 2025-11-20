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
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

const questionTypes = [
  { value: "和差问题", label: "和差问题", icon: "🧮", grades: [1, 2, 3, 4, 5, 6], desc: "求两数的和与差" },
  { value: "倍数问题", label: "倍数问题", icon: "✖️", grades: [3, 4, 5, 6], desc: "一个数是另一个的几倍" },
  { value: "行程问题", label: "行程问题", icon: "🚗", grades: [4, 5, 6], desc: "速度、时间、路程" },
  { value: "工程问题", label: "工程问题", icon: "🏗️", grades: [5, 6], desc: "工作效率与时间" },
  { value: "购物问题", label: "购物问题", icon: "🛒", grades: [1, 2, 3, 4, 5, 6], desc: "价格、数量、总价" },
  { value: "容量问题", label: "容量问题", icon: "🥤", grades: [1, 2, 3, 4, 5, 6], desc: "容器的大小和容量" },
  { value: "植树问题", label: "植树问题", icon: "🌳", grades: [3, 4, 5, 6], desc: "间隔与棵数" },
  { value: "鸡兔同笼", label: "鸡兔同笼", icon: "🐔", grades: [4, 5, 6], desc: "经典数学问题" },
  { value: "盈亏问题", label: "盈亏问题", icon: "💰", grades: [4, 5, 6], desc: "多余与不足" },
  { value: "浓度问题", label: "浓度问题", icon: "🧪", grades: [6], desc: "溶液浓度计算" },
  { value: "百分比应用", label: "百分比", icon: "📊", grades: [5, 6], desc: "百分数的应用" },
  { value: "分数应用", label: "分数应用", icon: "🍰", grades: [4, 5, 6], desc: "分数的实际应用" },
]

type Stage = 'setup' | 'generating' | 'answering' | 'result' | 'reviewing'

export default function AIGeneratorPage() {
  const [stage, setStage] = useState<Stage>('setup')
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")

  // 配置状态
  const [grade, setGrade] = useState(3)
  const [questionType, setQuestionType] = useState("和差问题")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  // 题目状态
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 解析状态
  const [stepIndex, setStepIndex] = useState(0)

  // API 配置状态
  const [showConfig, setShowConfig] = useState(false)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [useCloud, setUseCloud] = useState(false)
  const [provider, setProvider] = useState<'ollama' | 'openrouter'>('ollama')

  const openrouterFreeModels = [
    'google/gemma-2-9b-it:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
  ]

  // 语音播报函数
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  // 根据年级获取可用题型
  const getAvailableQuestionTypes = (currentGrade: number) => {
    return questionTypes.filter(type => type.grades.includes(currentGrade))
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
    checkAvailability()
  }

  // 检查 AI 可用性
  const checkAvailability = async () => {
    if (provider === 'openrouter') {
      if (apiKey) {
        try {
          const response = await fetch('/api/openrouter/models', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          // 使用默认免费模型
        }
      }
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
        const qwenModel = modelList.find(m => m.includes('qwen'))
        setSelectedModel(qwenModel || modelList[0])
      }
    }
  }

  useEffect(() => {
    checkAvailability()
  }, [useCloud, provider])

  // 生成题目
  const handleGenerate = async () => {
    if (!selectedModel) {
      setError("请先选择一个 AI 模型")
      return
    }

    if (provider === 'openrouter' && !apiKey) {
      setError("使用 OpenRouter 需要配置 API Key")
      setShowConfig(true)
      return
    }

    setStage('generating')
    setError(null)

    try {
      const params: QuestionGenerateParams = {
        grade,
        questionType,
        difficulty,
        count: 1, // 一次生成一题
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
      setCurrentQuestionIndex(0)
      setUserAnswer("")
      setStage('answering')
      speak("题目已准备好，请开始答题")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "生成题目失败"
      setError(errorMessage)
      setStage('setup')
    }
  }

  // 提交答案
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = currentQuestion && userAnswer.trim() === String(currentQuestion.answer).trim()

    if (isCorrect) {
      speak("太棒了！回答正确！")
    } else {
      speak("再想想哦！")
    }

    setStage('result')
    setStepIndex(0)
  }

  // 查看详细解析
  const handleViewExplanation = () => {
    setStage('reviewing')
    setStepIndex(0)
  }

  // 下一题或重新开始
  const handleNext = () => {
    setUserAnswer("")
    setStage('setup')
  }

  // 生成解析步骤
  const getExplanationSteps = (): string[] => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return []

    const steps: string[] = []
    steps.push(`题目：${currentQuestion.prompt}`)

    if (currentQuestion.hint) {
      steps.push(`💡 提示：${currentQuestion.hint}`)
    }

    if (currentQuestion.visual_guide) {
      const guideLines = currentQuestion.visual_guide.split('\n').filter(line => line.trim())
      guideLines.forEach(line => steps.push(line.trim()))
    }

    if (currentQuestion.explain) {
      steps.push(`📖 完整解析：${currentQuestion.explain}`)
    }

    return steps
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = currentQuestion && userAnswer.trim() === String(currentQuestion.answer).trim()
  const explanationSteps = getExplanationSteps()

  // 加载检查
  if (ollamaAvailable === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-orange-400 mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-medium">正在检测 AI 服务...</p>
        </div>
      </div>
    )
  }

  if (!ollamaAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 border-4 border-red-200">
          <div className="text-center">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">AI 服务未启动</h1>
            <p className="text-gray-600 mb-8 text-lg">请先配置 AI 服务</p>
            <button
              onClick={() => setShowConfig(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white rounded-2xl font-bold text-lg hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              ⚙️ 打开配置
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🤖✨</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                AI 智能出题助手
              </h1>
              <p className="text-sm text-gray-600">
                {provider === 'openrouter' ? "🌐 云端 AI" : (useCloud ? "☁️ 云端 AI" : "💻 本地 AI")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            ⚙️ 设置
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* 阶段 1: 初始配置 */}
        {stage === 'setup' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 欢迎卡片 */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-200 text-center">
              <div className="text-6xl mb-4">📚✨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">开始你的学习之旅</h2>
              <p className="text-gray-600 text-lg">选择适合你的题目类型，AI 老师会为你精心准备练习题</p>
            </div>

            {/* 年级选择 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📖</span> 你在读几年级？
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                      grade === g
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {g}年级
                  </button>
                ))}
              </div>
            </div>

            {/* 题型选择 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> 选择题目类型
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getAvailableQuestionTypes(grade).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setQuestionType(type.value)}
                    className={`p-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-left ${
                      questionType === type.value
                        ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white scale-105'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-700 hover:from-blue-100 hover:to-indigo-100'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-bold">{type.label}</div>
                    <div className="text-xs mt-1 opacity-80">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 难度选择 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚡</span> 选择难度
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "easy", label: "简单", color: "green", emoji: "😊", desc: "适合初学" },
                  { value: "medium", label: "中等", color: "yellow", emoji: "🤔", desc: "巩固提高" },
                  { value: "hard", label: "困难", color: "red", emoji: "💪", desc: "挑战自我" },
                ].map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value as any)}
                    className={`py-6 px-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                      difficulty === d.value
                        ? d.color === 'green' ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-105' :
                          d.color === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-105' :
                          'bg-gradient-to-br from-red-400 to-pink-500 text-white scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-4xl mb-2">{d.emoji}</div>
                    <div className="text-lg">{d.label}</div>
                    <div className="text-xs mt-1 opacity-80">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                className="px-12 py-6 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white rounded-3xl font-bold text-2xl hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  🚀 开始生成题目
                </span>
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border-4 border-red-300 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">❌</div>
                  <div>
                    <div className="font-bold text-red-700 text-lg mb-1">生成失败</div>
                    <div className="text-red-600 text-sm whitespace-pre-line">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 阶段 2: 生成中 */}
        {stage === 'generating' && (
          <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-purple-200 max-w-2xl">
              <div className="text-8xl mb-6 animate-bounce">🎨🤖</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">AI 老师正在为你出题...</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600 text-lg">请稍等片刻，这需要 20-30 秒...</p>
            </div>
          </div>
        )}

        {/* 阶段 3: 答题 */}
        {stage === 'answering' && currentQuestion && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
              <Narration avatar="/icons/area.svg" name="AI老师">
                <div className="text-sm text-blue-600 font-bold mb-2">
                  📚 {currentQuestion.category}
                </div>
                <div className="text-xl font-medium leading-relaxed">{currentQuestion.prompt}</div>
              </Narration>

              {currentQuestion.hint && (
                <div className="mt-6">
                  <Narration avatar="/icons/area.svg" name="小提示">
                    💡 {currentQuestion.hint}
                  </Narration>
                </div>
              )}

              <div className="mt-8">
                <label className="block text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✏️</span> 请输入你的答案：
                </label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim()) {
                      handleSubmitAnswer()
                    }
                  }}
                  placeholder="输入答案后按回车..."
                  className="w-full border-4 border-orange-200 rounded-3xl px-6 py-5 text-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none shadow-lg transition-all"
                  autoFocus
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="flex-1 py-5 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-3xl font-bold text-xl hover:from-blue-500 hover:to-indigo-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ✅ 提交答案
                </button>
                <button
                  onClick={() => setStage('setup')}
                  className="px-6 py-5 bg-gray-200 text-gray-700 rounded-3xl font-bold hover:bg-gray-300 transition-all shadow-lg"
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 阶段 4: 结果展示 */}
        {stage === 'result' && currentQuestion && (
          <div className="space-y-6 animate-fadeIn">
            <div className={`bg-white rounded-3xl shadow-2xl p-10 border-4 ${
              isCorrect ? 'border-green-300' : 'border-orange-300'
            }`}>
              <div className="text-center mb-8">
                <div className="text-9xl mb-4 animate-bounce">{isCorrect ? '🎉' : '💪'}</div>
                <h2 className={`text-4xl font-bold mb-3 ${
                  isCorrect ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {isCorrect ? '太棒了！回答正确！' : '加油！再想想'}
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <span className="font-bold text-gray-700 text-lg">📝 你的答案: </span>
                  <span className="text-xl font-bold text-gray-800">{userAnswer}</span>
                </div>
                <div className={`p-6 rounded-2xl ${isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <span className="font-bold text-gray-700 text-lg">✔️ 正确答案: </span>
                  <span className="text-xl font-bold text-indigo-600">{currentQuestion.answer}</span>
                </div>
              </div>

              <div className="flex gap-4">
                {explanationSteps.length > 0 && (
                  <button
                    onClick={handleViewExplanation}
                    className="flex-1 py-5 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-3xl font-bold text-xl hover:from-purple-500 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      🎨 查看详细解析
                    </span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 py-5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-3xl font-bold text-xl hover:from-orange-500 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    ➡️ 再来一题
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 阶段 5: 详细解析 */}
        {stage === 'reviewing' && currentQuestion && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                <span>🎨</span> 分步图解演示
              </h3>

              <Narration avatar="/icons/area.svg" name="解题步骤">
                {explanationSteps[stepIndex]}
              </Narration>

              {/* Visual Canvas */}
              {currentQuestion.visual_data && currentQuestion.visual_data.length > 0 && stepIndex > 1 && (
                <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner">
                  <VisualCanvas instructions={currentQuestion.visual_data} width={700} height={400} />
                </div>
              )}

              <div className="mt-8">
                <StepPlayer
                  steps={explanationSteps}
                  title="让我们一步步来理解"
                  index={stepIndex}
                  onIndexChange={setStepIndex}
                  auto={false}
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleNext}
                  className="w-full py-5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-3xl font-bold text-xl hover:from-orange-500 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    ➡️ 再来一题
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 配置模态框 */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border-4 border-orange-200 max-h-[90vh] overflow-y-auto">
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

              {/* Ollama 配置 */}
              {provider === 'ollama' && (
                <>
                  <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200">
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
                    </label>
                  </div>

                  {useCloud && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          🌐 API Endpoint
                        </label>
                        <input
                          type="text"
                          value={apiEndpoint}
                          onChange={(e) => setApiEndpoint(e.target.value)}
                          placeholder="https://api.example.com"
                          className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          🔑 API Key
                        </label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="输入你的 API Key"
                          className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* OpenRouter 配置 */}
              {provider === 'openrouter' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🔑 OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:border-orange-400 outline-none"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    在 <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">OpenRouter</a> 获取免费 API Key
                  </div>
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 py-3 bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 text-white rounded-xl font-bold hover:from-orange-500 hover:via-pink-500 hover:to-yellow-500 transition-all shadow-lg hover:shadow-xl"
              >
                ✅ 保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
