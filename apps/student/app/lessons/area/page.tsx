"use client"
import { useState, useRef, useEffect } from "react"
import { AreaModel } from "../../../components/AreaModel"
import { mapAreaState } from "../../../lib/mapping"
import { guidanceFor } from "../../../lib/microGuidance"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function AreaPage() {
  const [a, setA] = useState(5)
  const [b, setB] = useState(3)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——设置长方形的长和宽",
    "步骤2：观察——数一数里面有多少个小方格",
    "步骤3：计算——用乘法算出总面积"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => { return () => clearTimer() }, [])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()

    if (i === 1) {
      // Stage 1 triggers the fill animation in the component
      const totalCells = a * b
      const duration = totalCells * 50 + 500
      timerRef.current = setTimeout(() => {
        setStage(2)
      }, duration)
    }
  }

  return (
    <LessonRunner
      title="面积模型"
      skillId="math-area"
      intro={{
        story: "帮小伙伴为操场铺垫子，长与宽决定矩形的面积。",
        goal: "理解面积=长×宽，并能用图形读数",
        steps: ["设置长与宽", "观察矩形面积变化", "点击评估生成表达"]
      }}
      onVariant={() => { setA(Math.floor(3 + Math.random() * 7)); setB(Math.floor(2 + Math.random() * 6)); setStage(0); }}
      hints={{
        build: ["输入长与宽（都要大于0）", "观察矩形大小变化", "认读面积数字"],
        map: ["点击评估", "读出‘面积=长×宽’", "把算式写在本子上"],
        review: ["把长翻倍看看面积如何变化", "把宽翻倍再试试"]
      }}
      variantGen={(diff) => {
        const make = (x: number, y: number) => ({ label: `长=${x}, 宽=${y}`, apply: () => { setA(x); setB(y); setStage(0); } })
        if (diff === "easy") return [make(3, 2), make(4, 3), make(5, 2)]
        if (diff === "medium") return [make(6, 3), make(7, 4), make(5, 5), make(8, 2)]
        return [make(9, 5), make(12, 3), make(10, 6), make(7, 7), make(11, 4)]
      }}
      variantCount={5}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: `已知 长=${a} 宽=${b} 求 面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * b) < 1e-6 })
          items.push({ prompt: `把 长 改为 ${a + 1} 的新面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - (a + 1) * b) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把 宽 增加 2 后的面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * (b + 2)) < 1e-6 })
          items.push({ prompt: `把 长 和 宽 都乘 2 的面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - (2 * a) * (2 * b)) < 1e-6 })
          items.push({ prompt: `面积除以 宽 得到的 长`, placeholder: "输入长", check: v => Math.abs(parseFloat(v) - (a * b) / b) < 1e-6 })
        } else {
          items.push({ prompt: `已知 面积=${(a * b).toFixed(0)} 宽=${b} 求 长`, placeholder: "输入长", check: v => Math.abs(parseFloat(v) - (a * b) / b) < 1e-6 })
          items.push({ prompt: `把 宽 改为 ${b + 3} 的新面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * (b + 3)) < 1e-6 })
          items.push({ prompt: `把 长 改为 ${a + 2} 的新面积`, placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - (a + 2) * b) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => {
        const valid = a > 0 && b > 0
        const text = mapAreaState(a, b)
        const hint = valid ? guidanceFor("area_ok") : guidanceFor("area_invalid")
        return { correct: valid, text, hint }
      }}
    >
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">
        {stage === 0 && "长方形的面积和它的长、宽有关。试着调整一下长和宽吧！"}
        {stage === 1 && "每一个小方格代表面积为1。你能数清一共有多少个小方格吗？"}
        {stage === 2 && "不用一个一个数，用长乘宽，就能快速算出面积啦！"}
      </Narration>

      <div className="controls">
        <div className="control"><label>长</label><input type="number" value={a} onChange={e => setA(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>宽</label><input type="number" value={b} onChange={e => setB(parseFloat(e.target.value || "0"))} /></div>
      </div>

      <AreaModel a={a} b={b} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}