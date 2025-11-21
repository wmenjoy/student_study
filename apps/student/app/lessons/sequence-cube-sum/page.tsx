"use client"
import { useState, useEffect, useRef } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SequenceCubeSumVisualization } from "../../../components/SequenceCubeSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function SequenceCubeSumPage() {
  const [n, setN] = useState(4)
  const [stage, setStage] = useState(0)
  const [showFormula, setShowFormula] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)

  const steps = [
    "步骤1：理解——什么是立方和数列",
    "步骤2：观察——1³+2³+...+n³的3D图形规律",
    "步骤3：发现——立方和与平方和的关系",
    "步骤4：掌握——立方和公式及其应用"
  ]

  const onStep = (i: number) => setStage(i)

  // Calculate cube sum: 1³ + 2³ + ... + n³
  const calculateCubeSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i * i
    }
    return sum
  }

  // Calculate corresponding square sum
  const calculateSquareSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i
    }
    return sum
  }

  const cubeSum = calculateCubeSum(n)
  const squareSum = calculateSquareSum(n)
  const squareOfSquareSum = squareSum * squareSum

  // Formulas
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
      `小朋友们，今天我们来学习神奇的立方和数列！从1³加到${n}³，看看有什么规律。`,
      `观察这些立方体，它们在变大，但是有特殊的排列规律！`,
      `发现了吗？立方和等于平方和的平方，这是数学中很美妙的规律！`,
      `记住公式：1³+2³+...+n³ = [n(n+1)/2]²`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, n])

  return (
    <LessonRunner
      title="立方和数列求和 1³+2³+...+n³"
      skillId="math-sequence-cube-sum"
      intro={{
        story: "从1的立方开始，依次加到n的立方，就像搭3D金字塔一样！发现立方和与平方和的奇妙关系。",
        goal: "掌握立方和数列求和公式，理解立方和与平方和的关系",
        steps: ["理解概念", "观察3D规律", "发现关系", "掌握公式"]
      }}
      hints={{
        build: ["设置n的值，观察3D图形变化", "注意每个立方体的大小"],
        map: ["理解立方和与平方和的关系", "记住立方和公式"],
        review: ["尝试不同的n值", "验证立方和等于平方和的平方"]
      }}
      variantGen={(difficulty) => {
        const make = (nn: number) => ({ 
          label: `n=${nn}`, 
          apply: () => { setN(nn); setStage(0) } 
        })
        if (difficulty === "easy") return [make(2), make(3), make(4)]
        if (difficulty === "medium") return [make(5), make(6), make(7)]
        return [make(8), make(9), make(10), make(11)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        
        if (difficulty === "easy") {
          items.push({ prompt: "1³+2³+3³等于多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 36) < 1e-6 })
          items.push({ prompt: "1³+2³+3³+4³等于多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 100) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "1³+2³+...+5³等于多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - 225) < 1e-6 })
          items.push({ prompt: "对应的平方和是多少？", placeholder: "输入答案", check: v => Math.abs(parseFloat(v) - squareSum) < 1e-6 })
        } else {
          items.push({ prompt: "立方和公式是什么？", placeholder: "输入公式", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('[n(n+1)/2]²')
          }})
          items.push({ prompt: "立方和与平方和是什么关系？", placeholder: "输入关系", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('平方') || clean.includes('square')
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `立方和数列：1³+2³+...+${n}³ = ${cubeSum}\n平方和数列：1²+2²+...+${n}² = ${squareSum}\n神奇关系：立方和 = 平方和² = ${squareSum}² = ${squareOfSquareSum}\n公式：[n(n+1)/2]² = ${cubeSumFormula}` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `小朋友们，今天我们来学习神奇的立方和数列！从1³加到${n}³，看看有什么规律。`}
        {stage === 1 && `观察这些立方体，它们在变大，但是有特殊的排列规律！`}
        {stage === 2 && `发现了吗？立方和等于平方和的平方，这是数学中很美妙的规律！`}
        {stage === 3 && `记住公式：1³+2³+...+n³ = [n(n+1)/2]²`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">数值 n</label>
          <input
            type="range"
            className="w-32"
            min="2"
            max="11"
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
              3D动画
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

      <SequenceCubeSumVisualization 
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