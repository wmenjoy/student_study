"use client"
import { useState, useEffect, useRef } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SequenceSquareSumVisualization } from "../../../components/SequenceSquareSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function SequenceSquareSumPage() {
  const [n, setN] = useState(5)
  const [stage, setStage] = useState(0)
  const [showFormula, setShowFormula] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)

  const steps = [
    "步骤1：理解——什么是平方和数列",
    "步骤2：观察——1²+2²+...+n²的图形规律",
    "步骤3：发现——高斯求和法的巧妙应用",
    "步骤4：掌握——平方和公式及其应用"
  ]

  const onStep = (i: number) => setStage(i)

  // Calculate square sum: 1² + 2² + ... + n²
  const calculateSquareSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i
    }
    return sum
  }

  // Calculate cube sum: 1³ + 2³ + ... + n³
  const calculateCubeSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i * i
    }
    return sum
  }

  const squareSum = calculateSquareSum(n)
  const cubeSum = calculateCubeSum(n)

  // Formulas
  const squareSumFormula = `n(n+1)(2n+1)/6 = ${n}×${n+1}×${2*n+1}/6 = ${(n*(n+1)*(2*n+1))/6}`
  const cubeSumFormula = `[n(n+1)/2]² = [${n}×${n+1}/2]² = ${Math.pow(n*(n+1)/2, 2)}`

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  useEffect(() => {
    const narrationText = [
      `小朋友们，今天我们来学习神奇的数列求和！从1²加到${n}²，看看有什么规律。`,
      `观察这些正方形，它们的大小在变化，但是排列很有规律！`,
      `高斯小时候就发现了这个规律，我们也可以发现！`,
      `记住公式：1²+2²+...+n² = n(n+1)(2n+1)/6`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, n])

  return (
    <LessonRunner
      title="平方和数列求和 1²+2²+...+n²"
      skillId="math-sequence-square-sum"
      intro={{
        story: "从1的平方开始，依次加到n的平方，就像搭金字塔一样！发现其中的数学规律。",
        goal: "掌握平方和数列求和公式，理解高斯求和思想",
        steps: ["理解概念", "观察规律", "发现方法", "掌握公式"]
      }}
      hints={{
        build: ["设置n的值，观察图形变化", "注意每个正方形的大小"],
        map: ["理解配对求和的思想", "记住平方和公式"],
        review: ["尝试不同的n值", "比较平方和与立方和"]
      }}
      variantGen={(difficulty) => {
        const make = (nn: number) => ({ 
          label: `n=${nn}`, 
          apply: () => { setN(nn); setStage(0) } 
        })
        if (difficulty === "easy") return [make(3), make(4), make(5)]
        if (difficulty === "medium") return [make(6), make(7), make(8)]
        return [make(9), make(10), make(11), make(12)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        
        if (difficulty === "easy") {
          items.push({ prompt: "1²+2²+3²等于多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 14) < 1e-6 })
          items.push({ prompt: "前4个数的平方和是多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 30) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "用公式计算1²+2²+...+5²", placeholder: "输入计算过程", check: v => {
            const clean = v.replace(/\s+/g, '')
            return clean.includes('5×6×11') || clean.includes('5×6×11/6')
          }})
          items.push({ prompt: "1²+2²+...+6²等于多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 91) < 1e-6 })
        } else {
          items.push({ prompt: "平方和公式是什么？", placeholder: "输入公式", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('n(n+1)(2n+1)/6')
          }})
          items.push({ prompt: "如果n=10，平方和是多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 385) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `平方和数列：1²+2²+...+${n}² = ${squareSum}\n公式：n(n+1)(2n+1)/6 = ${squareSumFormula}\n立方和数列：1³+2³+...+${n}³ = ${cubeSum}\n公式：[n(n+1)/2]² = ${cubeSumFormula}` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `小朋友们，今天我们来学习神奇的数列求和！从1²加到${n}²，看看有什么规律。`}
        {stage === 1 && `观察这些正方形，它们的大小在变化，但是排列很有规律！`}
        {stage === 2 && `高斯小时候就发现了这个规律，我们也可以发现！`}
        {stage === 3 && `记住公式：1²+2²+...+n² = n(n+1)(2n+1)/6`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">数值 n</label>
          <input
            type="range"
            className="w-32"
            min="3"
            max="12"
            value={n}
            onChange={e => { setN(parseInt(e.target.value)); setStage(0) }}
          />
          <div className="text-center text-lg font-bold text-blue-600">{n}</div>
        </div>
        
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">显示选项</label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showFormula ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowFormula(!showFormula); setStage(0) }}
            >
              公式推导
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showCanvas ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowCanvas(!showCanvas); setStage(0) }}
            >
              Canvas动画
            </button>
          </div>
        </div>

        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">动画速度</label>
          <select
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={animationSpeed}
            onChange={e => setAnimationSpeed(parseInt(e.target.value))}
          >
            <option value={2000}>慢速</option>
            <option value={1000}>正常</option>
            <option value={500}>快速</option>
          </select>
        </div>
      </div>

      <SequenceSquareSumVisualization 
        n={n} 
        stage={stage}
        showFormula={showFormula}
        showCanvas={showCanvas}
        animationSpeed={animationSpeed}
      />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}