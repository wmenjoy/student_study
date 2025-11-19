"use client"
import { HanziStroke } from "../../../components/HanziStroke"
import { useState } from "react"
import { LessonShell } from "../../../components/LessonShell"

export default function HanziPage() {
  const [char, setChar] = useState("永")
  return (
    <LessonShell title="笔画演示">
      <div className="controls">
        <div className="control">
          <label>汉字</label>
          <input value={char} onChange={e => setChar(e.target.value.slice(0, 1))} />
        </div>
      </div>
      <HanziStroke char={char} />
      <div className="hint">按笔顺临摹轨迹，观察匹配度。</div>
    </LessonShell>
  )
}