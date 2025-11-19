"use client"
import { useState, useRef, useEffect } from "react"
import { CutSegments } from "../../../components/CutSegments"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapCutSegments } from "../../../lib/mapping"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function CutSegmentsPage() {
  const [cuts, setCuts] = useState(5)
  const [segLen, setSegLen] = useState(3)
  const [time, setTime] = useState(2)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——确定要锯几次，每次锯成多长",
    "步骤2：锯木头——开始锯了，注意看锯了几次",
    "步骤3：数段数——锯完后，木头变成了几段？"
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
      // Stage 1 triggers the cut animation in the component
      // We can auto-advance to stage 2 after cuts are done if we want, 
      // but let's leave it manual or let the user watch.
      // The component handles the visual animation of cuts.
      const duration = cuts * 500 + 500
      timerRef.current = setTimeout(() => {
        setStage(2)
      }, duration)
    }
  }

  return (
    <LessonRunner
      title="剪绳子/锯木头"
      skillId="math-cut-seg"
      intro={{
        story: "把一根绳子剪成多段或把木头锯成几段。",
        goal: "理解段数=次数+1，并能计算总长度与时间",
        steps: ["设置剪/锯次数", "设置每段长度与每次时间", "观察段数与结果"]
      }}
      hints={{
        build: ["输入剪/锯次数", "输入每段长度", "（可选）输入每次时间"],
        map: ["点击评估", "读出‘段数、总长、时间’"],
        review: ["把次数加1试试，段数如何变化？"]
      }}
      variantGen={(diff) => {
        const make = (c: number, l: number, t: number) => ({ label: `剪${c}段长${l}时间${t}`, apply: () => { setCuts(c); setSegLen(l); setTime(t); setStage(0); } })
        if (diff === "easy") return [make(3, 3, 2), make(5, 2, 1), make(2, 4, 0)]
        if (diff === "medium") return [make(6, 3, 2), make(8, 2, 1), make(4, 5, 3), make(7, 3, 2)]
        return [make(10, 3, 2), make(12, 2, 1), make(9, 4, 3), make(15, 1, 1), make(11, 5, 4)]
      }}
      microTestGen={(diff) => {
        const seg = cuts + 1
        const len = seg * segLen
        const totalT = cuts * time
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: "求段数", placeholder: "输入段数", check: v => Math.abs(parseFloat(v) - seg) < 1e-6 })
          items.push({ prompt: "求总长度", placeholder: "输入总长度", check: v => Math.abs(parseFloat(v) - len) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把每段长度改为 ${segLen + 1} 的总长度`, placeholder: "输入总长度", check: v => Math.abs(parseFloat(v) - seg * (segLen + 1)) < 1e-6 })
          items.push({ prompt: `每次时间为 ${time} 求总时间`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - totalT) < 1e-6 })
        } else {
          items.push({ prompt: `把剪次数改为 ${cuts + 2} 的段数`, placeholder: "输入段数", check: v => Math.abs(parseFloat(v) - (cuts + 2 + 1)) < 1e-6 })
          items.push({ prompt: `把每段长度改为 ${segLen + 2} 的总长度`, placeholder: "输入总长度", check: v => Math.abs(parseFloat(v) - seg * (segLen + 2)) < 1e-6 })
          items.push({ prompt: `把每次时间改为 ${time + 1} 的总时间`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - cuts * (time + 1)) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapCutSegments(cuts, segLen, time) })}
    >
      <Narration avatar="/mascots/bunny.svg" name="泡泡兔">
        {stage === 0 && "准备好了吗？设置好剪的次数和每段的长度。"}
        {stage === 1 && "仔细看，锯子锯下去，木头会变成几段？"}
        {stage === 2 && "知道了段数，就能算出总长度。别忘了算算锯木头花了多少时间！"}
      </Narration>

      <div className="controls">
        <div className="control"><label>剪/锯次数</label><input type="number" value={cuts} onChange={e => setCuts(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>每段长度</label><input type="number" value={segLen} onChange={e => setSegLen(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>每次时间</label><input type="number" value={time} onChange={e => setTime(parseFloat(e.target.value || "0"))} /></div>
      </div>

      <CutSegments cuts={cuts} segLen={segLen} timePerCut={time} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}