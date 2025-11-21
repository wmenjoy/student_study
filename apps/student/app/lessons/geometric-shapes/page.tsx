"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { GeometricShapesVisualization } from "../../../components/GeometricShapesVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function GeometricShapesPage() {
  const [shape, setShape] = useState<"triangle" | "rectangle" | "circle" | "polygon">("triangle")
  const [size, setSize] = useState(5)
  const [stage, setStage] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(false)

  const steps = [
    "步骤1：选择——选择几何图形类型和大小",
    "步骤2：绘制——绘制几何图形",
    "步骤3：计算——计算面积和周长",
    "步骤4：分析——分析图形性质"
  ]

  const onStep = (i: number) => setStage(i)

  // Calculate properties based on shape
  const calculateProperties = () => {
    switch (shape) {
      case "triangle":
        const base = size * 20
        const height = size * 15
        const side = Math.sqrt((base/2) ** 2 + height ** 2)
        return {
          area: (base * height) / 2,
          perimeter: base + side * 2,
          name: "三角形",
          formula: "面积 = 底 × 高 ÷ 2"
        }
      case "rectangle":
        const width = size * 25
        const rectHeight = size * 15
        return {
          area: width * rectHeight,
          perimeter: 2 * (width + rectHeight),
          name: "矩形",
          formula: "面积 = 长 × 宽"
        }
      case "circle":
        const radius = size * 10
        return {
          area: Math.PI * radius * radius,
          perimeter: 2 * Math.PI * radius,
          name: "圆形",
          formula: "面积 = π × r²"
        }
      case "polygon":
        const sideLength = size * 15
        const n = 6 // Hexagon
        const apothem = sideLength / (2 * Math.tan(Math.PI / n))
        return {
          area: (n * sideLength * apothem) / 2,
          perimeter: n * sideLength,
          name: "六边形",
          formula: "面积 = (边数 × 边长 × 边心距) ÷ 2"
        }
      default:
        return { area: 0, perimeter: 0, name: "", formula: "" }
    }
  }

  const properties = calculateProperties()

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
      `让我们学习${properties.name}几何图形。选择大小为 ${size}。`,
      `绘制${properties.name}，观察它的形状和特征。`,
      `计算${properties.name}的面积和周长：${properties.formula}。`,
      `分析${properties.name}的性质和特点。`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, shape, size, properties])

  return (
    <LessonRunner
      title="几何图形图解"
      skillId="math-geometric-shapes"
      intro={{
        story: "通过可视化图形理解几何图形的性质、面积和周长计算。",
        goal: "掌握基本几何图形的特征和计算方法",
        steps: ["选择图形", "绘制观察", "计算公式", "分析性质"]
      }}
      hints={{
        build: ["选择图形类型和大小", "切换网格和坐标显示"],
        map: ["理解图形的几何性质", "掌握面积周长计算"],
        review: ["尝试不同图形类型", "观察计算规律"]
      }}
      variantGen={(difficulty) => {
        const make = (sh: typeof shape, sz: number, grid: boolean, coords: boolean) => ({ 
          label: `${sh === "triangle" ? "三角形" : sh === "rectangle" ? "矩形" : sh === "circle" ? "圆形" : "六边形"} (大小=${sz})`, 
          apply: () => { setShape(sh); setSize(sz); setShowGrid(grid); setShowCoordinates(coords); setStage(0) } 
        })
        
        if (difficulty === "easy") {
          return [
            make("triangle", 3, true, false),
            make("rectangle", 4, true, false),
            make("circle", 3, true, false)
          ]
        }
        if (difficulty === "medium") {
          return [
            make("polygon", 5, true, true),
            make("triangle", 6, true, true),
            make("rectangle", 7, false, true)
          ]
        }
        return [
          make("circle", 8, false, true),
          make("polygon", 7, true, true),
          make("triangle", 9, false, true),
          make("rectangle", 8, false, false)
        ]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        
        if (difficulty === "easy") {
          items.push({ prompt: "这个图形叫什么名字？", placeholder: "输入图形名称", check: v => {
            const answer = v.trim().toLowerCase()
            const shapeName = properties.name.toLowerCase()
            return answer.includes(shapeName) || shapeName.includes(answer)
          }})
          items.push({ prompt: "面积大约是多少？（输入整数）", placeholder: "输入估算值", check: v => {
            const answer = parseFloat(v)
            return Math.abs(answer - Math.round(properties.area)) <= Math.round(properties.area) * 0.2
          }})
        } else if (difficulty === "medium") {
          items.push({ prompt: "写出面积计算公式", placeholder: "输入公式", check: v => {
            const formula = v.trim().toLowerCase()
            if (shape === "triangle") return formula.includes("底") && formula.includes("高") && formula.includes("÷2")
            if (shape === "rectangle") return formula.includes("长") && formula.includes("宽")
            if (shape === "circle") return formula.includes("π") && formula.includes("r")
            if (shape === "polygon") return formula.includes("边") && formula.includes("边心距")
            return false
          }})
          items.push({ prompt: "周长公式是什么？", placeholder: "输入周长公式", check: v => {
            const formula = v.trim().toLowerCase()
            if (shape === "triangle") return formula.includes("边") && formula.includes("和")
            if (shape === "rectangle") return formula.includes("2") && (formula.includes("长") || formula.includes("宽"))
            if (shape === "circle") return formula.includes("2π") || formula.includes("πd")
            if (shape === "polygon") return formula.includes("边数") && formula.includes("边长")
            return false
          }})
        } else {
          items.push({ prompt: "如果大小加倍，面积变成几倍？", placeholder: "输入倍数", check: v => {
            const answer = parseFloat(v)
            return Math.abs(answer - 4) < 0.1 // Area scales by square of linear dimensions
          }})
          items.push({ prompt: "这个图形有几条对称轴？（输入数字）", placeholder: "输入对称轴数量", check: v => {
            const answer = parseInt(v)
            if (shape === "triangle") return answer === 3
            if (shape === "rectangle") return answer === 2
            if (shape === "circle") return answer >= 10 // Infinite, but accept high numbers
            if (shape === "polygon") return answer === 6
            return false
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `${properties.name}分析：\n面积公式：${properties.formula}\n计算结果：面积 ≈ ${properties.area.toFixed(2)}，周长 ≈ ${properties.perimeter.toFixed(2)}\n几何特征：通过可视化理解图形性质` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="几何老师">
        {stage === 0 && `让我们学习${properties.name}。选择大小为 ${size}。`}
        {stage === 1 && `观察${properties.name}的形状，${showGrid ? "使用网格辅助理解" : "观察纯几何形状"}。`}
        {stage === 2 && `计算${properties.name}：${properties.formula}，面积约为 ${properties.area.toFixed(2)}，周长约为 ${properties.perimeter.toFixed(2)}。`}
        {stage === 3 && `分析${properties.name}的几何性质和对称性。`}
      </Narration>

      <div className="controls flex flex-wrap gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">图形类型</label>
          <select
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg focus:border-blue-500 outline-none"
            value={shape}
            onChange={e => { setShape(e.target.value as any); setStage(0) }}
          >
            <option value="triangle">三角形</option>
            <option value="rectangle">矩形</option>
            <option value="circle">圆形</option>
            <option value="polygon">六边形</option>
          </select>
        </div>
        
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">大小</label>
          <input
            type="range"
            className="w-32"
            min="2"
            max="10"
            value={size}
            onChange={e => { setSize(parseInt(e.target.value)); setStage(0) }}
          />
          <span className="text-center text-sm">{size}</span>
        </div>

        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">显示选项</label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showGrid ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowGrid(!showGrid); setStage(0) }}
            >
              网格
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showCoordinates ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowCoordinates(!showCoordinates); setStage(0) }}
            >
              坐标
            </button>
          </div>
        </div>
      </div>

      <GeometricShapesVisualization 
        shape={shape} 
        size={size} 
        stage={stage}
        showGrid={showGrid}
        showCoordinates={showCoordinates}
      />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}