"use client"
import { useMemo, useState } from "react"

type Props = { parts: string[] }

export function SentenceOrder({ parts }: Props) {
  const [sel, setSel] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const shuffled = useMemo(()=> parts.map(p=>({p, r: Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.p), [parts])
  const add = (p: string) => { if (!done && sel.length < parts.length) setSel(s=> [...s, p]) }
  const reset = () => { setSel([]); setDone(false) }
  const submit = () => setDone(true)
  const correct = done && sel.join("") === parts.join("")
  return (
    <div className="intro-block">
      <div className="card-title">请按顺序拼出句子</div>
      <div className="controls" style={{ flexWrap: "wrap" }}>
        {shuffled.map(p => (
          <button key={p+Math.random()} className="btn ghost" onClick={()=>add(p)}>{p}</button>
        ))}
      </div>
      <div className="hint">当前：{sel.join("")}</div>
      <div className="controls">
        <button className="btn" onClick={submit}>提交</button>
        <button className="btn ghost" onClick={reset}>重置</button>
      </div>
      {done && <div className="hint" style={{ color: correct ? "var(--good)" : "var(--danger)" }}>{correct ? "正确" : "再试试"}</div>}
    </div>
  )
}