"use client"
import { useState } from "react"

type Props = { text: string; holes: number; answers: string[]; options?: string[] }

export function PunctuationPractice({ text, holes, answers, options = ["，","。","！","？","；"] }: Props) {
  const [sel, setSel] = useState<string[]>(Array(holes).fill(""))
  const set = (i:number, v:string) => setSel(s=> { const n=[...s]; n[i]=v; return n })
  const render = () => {
    let idx = 0
    return text.split("_").map((chunk, i) => (
      <span key={i}>{chunk}{i < holes ? (sel[idx++] || "＿") : ""}</span>
    ))
  }
  const correct = answers.every((a,i)=> a === sel[i])
  return (
    <div className="intro-block">
      <div className="card-title">把合适的标点填进句子</div>
      <div style={{ margin: "8px 0" }}>{render()}</div>
      <div className="controls" style={{ flexWrap: "wrap" }}>
        {sel.map((v,i)=> (
          <select key={i} value={v} onChange={e=> set(i, e.target.value)}>
            <option value="">选择</option>
            {options.map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div className="hint" style={{ color: correct ? "var(--good)" : "var(--muted)" }}>{correct ? "全部正确" : "选择后将自动判定"}</div>
    </div>
  )
}