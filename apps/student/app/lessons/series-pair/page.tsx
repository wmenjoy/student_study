"use client"
import { useState, useRef, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { SeriesPairSum } from "../../../components/SeriesPairSum"
import { SeriesBarSum } from "../../../components/SeriesBarSum"
import { seriesScript } from "../../../lib/stepdsl"
import { mapSeriesPair } from "../../../lib/mapping"

export default function SeriesPairPage() {
  const [start, setStart] = useState(1)
  const [end, setEnd] = useState(10)
  const [step, setStep] = useState(1)
  const [stage, setStage] = useState(0)
  const [vizMode, setVizMode] = useState<"pair" | "bar">("pair")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = seriesScript.labels

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
  }

  const sum = () => {
    const nums: number[] = []
    for (let x = start; x <= end; x += step) nums.push(x)
    const pairSum = nums[0] + nums[nums.length - 1]
    const pairs = Math.floor(nums.length / 2)
    const mid = nums.length % 2 === 1 ? nums[Math.floor(nums.length / 2)] : 0
    return pairSum * pairs + mid
  }

  return (
    <LessonRunner
      title="等差配对求和"
      skillId="math-series-pair"
      intro={{
        story: "德国数学家高斯在课堂上用配对的方法快速求1到100的和。",
        goal: "会用配对法或平均法求等差数列之和",
        steps
      }}
      hints={seriesScript.hints}
      variantGen={(diff) => {
        const make = (a: number, b: number, s: number) => ({
          label: `${a}+...+${b} 步长${s}`,
          apply: () => { setStart(a); setEnd(b); setStep(s); setStage(0) }
        })
        if (diff === "easy") return [make(1, 10, 1), make(2, 18, 2), make(5, 15, 1)]
        if (diff === "medium") return [make(1, 20, 1), make(3, 21, 3), make(2, 26, 3)]
        return [make(1, 100, 1), make(2, 100, 2), make(1, 99, 2)]
      }}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const sumFor = (a: number, b: number, s: number) => {
          const n = Math.floor((b - a) / s) + 1
          const first = a
          const last = b
          return (first + last) * n / 2
        }
        if (diff === "easy") {
          items.push({ prompt: "计算 1+2+3+4+5+6+7+8+9+10 的和", placeholder: "输入55", check: x => parseInt(x) === 55 })
        } else if (diff === "medium") {
          items.push({ prompt: "计算 3+6+9+12+15+18 的和", placeholder: "输入结果", check: x => parseInt(x) === 63 })
          items.push({ prompt: "计算 2+5+8+11+14+17+20+23+26 的和", placeholder: "输入结果", check: x => parseInt(x) === 126 })
        } else {
          items.push({ prompt: "计算 (2+4+...+100) − (1+3+...+99)", placeholder: "输入结果", check: x => parseInt(x) === 50 })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapSeriesPair(start,end,step) })}
    >
      <Narration avatar="/icons/number-line.svg" name="老师">{seriesScript.narration[stage]||""}</Narration>

      <div className="controls">
        <div className="control"><label>起点</label><input type="number" value={start} onChange={e => setStart(parseFloat(e.target.value || "1"))} /></div>
        <div className="control"><label>终点</label><input type="number" value={end} onChange={e => setEnd(parseFloat(e.target.value || "10"))} /></div>
        <div className="control"><label>步长</label><input type="number" value={step} onChange={e => setStep(parseFloat(e.target.value || "1"))} /></div>
        <div className="control">
          <label>展示方式</label>
          <select value={vizMode} onChange={e => setVizMode(e.target.value as "pair" | "bar")}>
            <option value="pair">配对连线</option>
            <option value="bar">条形堆叠</option>
          </select>
        </div>
      </div>

      {vizMode === "pair" ? (
        <SeriesPairSum start={start} end={end} step={step} stage={stage} />
      ) : (
        <SeriesBarSum start={start} end={end} step={step} stage={stage} />
      )}

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={seriesScript.durations} auto />
    </LessonRunner>
  )
}