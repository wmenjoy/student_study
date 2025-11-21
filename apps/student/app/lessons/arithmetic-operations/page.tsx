"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { ArithmeticVisualization } from "../../../components/ArithmeticVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function ArithmeticOperationsPage() {
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide">("add")
  const [num1, setNum1] = useState(15)
  const [num2, setNum2] = useState(8)
  const [stage, setStage] = useState(0)
  const [useFraction, setUseFraction] = useState(false)
  const [useDecimal, setUseDecimal] = useState(false)

  const steps = [
    "步骤1：准备——选择运算类型和数字",
    "步骤2：理解——理解运算的几何意义",
    "步骤3：计算——进行算术运算",
    "步骤4：验证——验证计算结果"
  ]

  const onStep = (i: number) => setStage(i)

  // Convert numbers based on selected mode
  const getDisplayNumbers = () => {
    if (useFraction) {
      return {
        num1: `${Math.floor(num1 / 5)}/${5 + Math.floor(num1 % 5)}`,
        num2: `${Math.floor(num2 / 3)}/${3 + Math.floor(num2 % 3)}`
      }
    }
    if (useDecimal) {
      return {
        num1: (num1 / 10).toFixed(1),
        num2: (num2 / 10).toFixed(1)
      }
    }
    return { num1: num1.toString(), num2: num2.toString() }
  }

  // Calculate result
  const calculateResult = () => {
    let result: number
    switch (operation) {
      case "add":
        result = num1 + num2
        break
      case "subtract":
        result = num1 - num2
        break
      case "multiply":
        result = num1 * num2
        break
      case "divide":
        result = num2 !== 0 ? num1 / num2 : 0
        break
      default:
        result = 0
    }

    if (useFraction) {
      const n1 = Math.floor(num1 / 5) / (5 + Math.floor(num1 % 5))
      const n2 = Math.floor(num2 / 3) / (3 + Math.floor(num2 % 3))
      switch (operation) {
        case "add": result = n1 + n2; break
        case "subtract": result = n1 - n2; break
        case "multiply": result = n1 * n2; break
        case "divide": result = n2 !== 0 ? n1 / n2 : 0; break
      }
      return result.toFixed(2)
    }

    if (useDecimal) {
      return (result / 10).toFixed(2)
    }

    return result.toString()
  }

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
    const displayNums = getDisplayNumbers()
    const result = calculateResult()
    const operationName = {
      add: "加法",
      subtract: "减法", 
      multiply: "乘法",
      divide: "除法"
    }[operation]

    const narrationText = [
      `让我们学习${operationName}。选择数字 ${displayNums.num1} 和 ${displayNums.num2}。`,
      `理解${operationName}的几何意义，观察图形的变化。`,
      `进行计算：${displayNums.num1} ${operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"} ${displayNums.num2} = ${result}`,
      `验证计算结果是否正确。`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, operation, num1, num2, useFraction, useDecimal])

  return (
    <LessonRunner
      title="算术运算与几何图解"
      skillId="math-arithmetic-operations"
      intro={{
        story: "通过几何图形理解加减乘除、分数、小数运算的原理。",
        goal: "掌握基本算术运算的几何意义和计算方法",
        steps: ["选择运算", "理解图形", "进行计算", "验证结果"]
      }}
      hints={{
        build: ["选择运算类型和数字", "切换分数或小数模式"],
        map: ["理解运算的几何表示", "掌握计算方法"],
        review: ["尝试不同运算类型", "观察几何规律"]
      }}
      variantGen={(difficulty) => {
        const make = (op: typeof operation, n1: number, n2: number, frac: boolean, dec: boolean) => ({ 
          label: `${op === "add" ? "加" : op === "subtract" ? "减" : op === "multiply" ? "乘" : "除"}: ${n1}, ${n2}${frac ? " (分数)" : dec ? " (小数)" : ""}`, 
          apply: () => { setOperation(op); setNum1(n1); setNum2(n2); setUseFraction(frac); setUseDecimal(dec); setStage(0) } 
        })
        
        if (difficulty === "easy") {
          return [
            make("add", 12, 8, false, false),
            make("subtract", 15, 7, false, false),
            make("multiply", 4, 3, false, false)
          ]
        }
        if (difficulty === "medium") {
          return [
            make("divide", 20, 4, false, false),
            make("add", 18, 12, true, false),
            make("multiply", 6, 7, false, true)
          ]
        }
        return [
          make("add", 24, 18, true, false),
          make("subtract", 15, 9, false, true),
          make("multiply", 8, 9, true, false),
          make("divide", 36, 6, false, false)
        ]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const result = calculateResult()
        const displayNums = getDisplayNumbers()
        
        if (difficulty === "easy") {
          items.push({ prompt: "计算结果是多少？", placeholder: "输入答案", check: v => {
            const clean = v.trim()
            return Math.abs(parseFloat(clean) - parseFloat(result)) < 0.01
          }})
        } else if (difficulty === "medium") {
          items.push({ prompt: "用文字描述这个运算过程", placeholder: "输入描述", check: v => {
            const desc = v.toLowerCase()
            return desc.includes("加") || desc.includes("减") || desc.includes("乘") || desc.includes("除")
          }})
          items.push({ prompt: "如果交换两个数字，结果会变吗？（输入 是/否）", placeholder: "输入是或否", check: v => {
            const answer = v.trim()
            if (operation === "add" || operation === "multiply") {
              return answer === "否"
            } else {
              return answer === "是"
            }
          }})
        } else {
          items.push({ prompt: "这个运算的逆运算是什么？", placeholder: "输入运算名称", check: v => {
            const op = v.trim()
            if (operation === "add") return op === "减法"
            if (operation === "subtract") return op === "加法"
            if (operation === "multiply") return op === "除法"
            if (operation === "divide") return op === "乘法"
            return false
          }})
          items.push({ prompt: "估算结果的数量级（输入 个位/十位/百位）", placeholder: "输入数量级", check: v => {
            const res = parseFloat(result)
            const magnitude = v.trim()
            if (res < 10) return magnitude === "个位"
            if (res < 100) return magnitude === "十位"
            return magnitude === "百位"
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `${operation === "add" ? "加法" : operation === "subtract" ? "减法" : operation === "multiply" ? "乘法" : "除法"}运算：\n${getDisplayNumbers().num1} ${operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"} ${getDisplayNumbers().num2} = ${calculateResult()}\n几何意义：通过图形直观理解运算过程` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们进行${operation === "add" ? "加法" : operation === "subtract" ? "减法" : operation === "multiply" ? "乘法" : "除法"}运算。`}
        {stage === 1 && `观察几何图形，理解${operation === "add" ? "合并" : operation === "subtract" ? "移除" : operation === "multiply" ? "重复" : "分组"}的过程。`}
        {stage === 2 && `计算结果：${getDisplayNumbers().num1} ${operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"} ${getDisplayNumbers().num2} = ${calculateResult()}`}
        {stage === 3 && `验证计算结果，理解运算的几何意义。`}
      </Narration>

      <div className="controls flex flex-wrap gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">运算类型</label>
          <select
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg focus:border-blue-500 outline-none"
            value={operation}
            onChange={e => { setOperation(e.target.value as any); setStage(0) }}
          >
            <option value="add">加法 (+)</option>
            <option value="subtract">减法 (−)</option>
            <option value="multiply">乘法 (×)</option>
            <option value="divide">除法 (÷)</option>
          </select>
        </div>
        
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">第一个数</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={num1}
            onChange={e => { setNum1(Math.max(1, Math.min(50, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="50"
          />
        </div>
        
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">第二个数</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={num2}
            onChange={e => { setNum2(Math.max(1, Math.min(50, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="50"
          />
        </div>

        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">显示模式</label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${!useFraction && !useDecimal ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setUseFraction(false); setUseDecimal(false); setStage(0) }}
            >
              整数
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${useFraction ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setUseFraction(true); setUseDecimal(false); setStage(0) }}
            >
              分数
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${useDecimal ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setUseFraction(false); setUseDecimal(true); setStage(0) }}
            >
              小数
            </button>
          </div>
        </div>
      </div>

      <ArithmeticVisualization 
        operation={operation} 
        num1={num1} 
        num2={num2} 
        stage={stage}
        useFraction={useFraction}
        useDecimal={useDecimal}
      />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}