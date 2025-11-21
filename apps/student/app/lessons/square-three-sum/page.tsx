"use client"
import { useState, useEffect, useRef } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SquareThreeSumVisualization } from "../../../components/SquareThreeSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function SquareThreeSumPage() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [c, setC] = useState(4)
  const [stage, setStage] = useState(0)
  const [showExpansion, setShowExpansion] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)

  const steps = [
    "步骤1：准备——设置三个数的值",
    "步骤2：展开——了解(a+b+c)²的展开过程",
    "步骤3：验证——通过图形验证展开式",
    "步骤4：理解——掌握完全平方和公式"
  ]

  const onStep = (i: number) => setStage(i)

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  // Calculate all terms
  const terms = {
    a2: a * a,
    b2: b * b,
    c2: c * c,
    ab2: 2 * a * b,
    ac2: 2 * a * c,
    bc2: 2 * b * c
  }

  const total = terms.a2 + terms.b2 + terms.c2 + terms.ab2 + terms.ac2 + terms.bc2

  useEffect(() => {
    const narrationText = [
      `小朋友们，今天我们来学习三个数的完全平方和公式。设置三个数：a=${a}，b=${b}，c=${c}。`,
      `让我们一步步展开(a+b+c)²，就像搭积木一样！`,
      `通过彩色方块，我们可以看到每一项都对应一个具体的几何图形。`,
      `记住公式：(a+b+c)² = a² + b² + c² + 2ab + 2ac + 2bc`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b, c])

  return (
    <LessonRunner
      title="三个数的完全平方和 (a+b+c)²"
      skillId="math-square-three-sum"
      intro={{
        story: "就像搭积木一样，我们把三个数的和平方，看看会变成什么样子！",
        goal: "掌握完全平方和公式，理解每一项的几何意义",
        steps: ["设置数字", "展开演示", "图形验证", "公式记忆"]
      }}
      hints={{
        build: ["输入三个数，就像选择积木大小", "观察展开的动画过程"],
        map: ["理解每一项对应的图形", "记住展开公式"],
        review: ["尝试不同的数字组合", "发现规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number, cc: number) => ({ 
          label: `a=${aa}, b=${bb}, c=${cc}`, 
          apply: () => { setA(aa); setB(bb); setC(cc); setStage(0) } 
        })
        if (difficulty === "easy") return [make(1, 2, 3), make(2, 3, 4), make(1, 1, 2)]
        if (difficulty === "medium") return [make(3, 4, 5), make(2, 5, 7), make(4, 6, 8)]
        return [make(5, 7, 9), make(6, 8, 10), make(3, 8, 12), make(7, 9, 11)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const result = a * a + b * b + c * c + 2 * a * b + 2 * a * c + 2 * b * c
        
        if (difficulty === "easy") {
          items.push({ prompt: "a²是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - a * a) < 1e-6 })
          items.push({ prompt: "2ab是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - 2 * a * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "(a+b+c)²展开后有几项？", placeholder: "输入数字", check: v => parseInt(v) === 6 })
          items.push({ prompt: "写出展开式（如 a²+b²+...）", placeholder: "输入展开式", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('a²') && clean.includes('b²') && clean.includes('c²') && 
                   clean.includes('2ab') && clean.includes('2ac') && clean.includes('2bc')
          }})
        } else {
          items.push({ prompt: "如果a=b=c=1，结果是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - 9) < 1e-6 })
          items.push({ prompt: "这个公式叫什么？（输入完全平方）", placeholder: "输入公式名称", check: v => v.trim().includes("完全平方") })
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `完全平方和公式：(${a}+${b}+${c})² = ${a}² + ${b}² + ${c}² + 2×${a}×${b} + 2×${a}×${c} + 2×${b}×${c}\n计算结果：${total}\n几何意义：三个正方形加上三个长方形` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `小朋友们，今天我们来学习三个数的完全平方和。设置三个数：a=${a}，b=${b}，c=${c}。`}
        {stage === 1 && `让我们一步步展开(${a}+${b}+${c})²，就像搭积木一样！`}
        {stage === 2 && `通过彩色方块，我们可以看到每一项都对应一个具体的几何图形。`}
        {stage === 3 && `记住公式：(${a}+${b}+${c})² = ${a}² + ${b}² + ${c}² + 2×${a}×${b} + 2×${a}×${c} + 2×${b}×${c}`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">数字 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { setA(Math.max(1, Math.min(5, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="5"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">数字 b</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { setB(Math.max(1, Math.min(5, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="5"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">数字 c</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={c}
            onChange={e => { setC(Math.max(1, Math.min(5, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="5"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">显示选项</label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showExpansion ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowExpansion(!showExpansion); setStage(0) }}
            >
              展开过程
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showCanvas ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowCanvas(!showCanvas); setStage(0) }}
            >
              Canvas图形
            </button>
          </div>
        </div>
      </div>

      <SquareThreeSumVisualization 
        a={a} 
        b={b} 
        c={c} 
        stage={stage}
        showExpansion={showExpansion}
        showCanvas={showCanvas}
      />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}