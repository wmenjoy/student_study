"use client"
import { useMemo, useState } from "react"
import { updateSkill } from "../lib/adaptive"
import { guidanceFor } from "../lib/microGuidance"

type QA = { word: string; options: string[]; answer: string; type: "near"|"anti" }

const DATA: QA[] = [
  { word: "快乐", options: ["高兴","悲伤","愤怒"], answer: "高兴", type: "near" },
  { word: "勇敢", options: ["胆怯","无畏","害怕"], answer: "无畏", type: "near" },
  { word: "寒冷", options: ["温暖","清凉","冰凉"], answer: "温暖", type: "anti" },
]

export function WordsGame() {
  const [idx, setIdx] = useState(0)
  const [sel, setSel] = useState<string>("")
  const qa = useMemo(()=>DATA[idx%DATA.length], [idx])
  const correct = sel === qa.answer
  const onNext = async () => {
    await updateSkill("cn-words", !!correct)
    setSel("")
    setIdx(i=>i+1)
  }
  return (
    <div>
      <div className="card" style={{ display: "grid", gap: 8 }}>
        <div className="card-title">词语：{qa.word}</div>
        <div className="card-desc">选择{qa.type === "near" ? "近义词" : "反义词"}</div>
        <div className="controls">
          {qa.options.map(o => (
            <button key={o} className={"btn " + (sel === o ? "secondary" : "ghost")} onClick={() => setSel(o)}>{o}</button>
          ))}
        </div>
        {sel && <div className="hint" style={{ color: correct ? "var(--good)" : "var(--danger)" }}>{correct ? guidanceFor("words_correct") : guidanceFor("words_incorrect")}</div>}
        <div className="controls">
          <button className="btn" onClick={onNext}>下一题</button>
        </div>
      </div>
    </div>
  )}