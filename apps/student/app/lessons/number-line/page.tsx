"use client"
import { NumberLine } from "../../../components/NumberLine"
import { useState } from "react"
import { LessonShell } from "../../../components/LessonShell"

export default function NumberLinePage() {
  const [value, setValue] = useState(5)
  const [step, setStep] = useState(1)
  return (
    <LessonShell title="数轴">
      <div className="controls">
        <div className="control">
          <label>步长</label>
          <input type="number" value={step} onChange={e => setStep(parseFloat(e.target.value || "1"))} />
        </div>
      </div>
      <NumberLine min={0} max={20} step={step} value={value} onChange={setValue} />
      <div className="hint">当前值：{value}</div>
    </LessonShell>
  )
}