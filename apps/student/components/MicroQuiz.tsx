"use client"
import { useMemo, useState } from "react"

type Item = { prompt: string; placeholder?: string; check: (v: string) => boolean }
type Props = { items: Item[]; onFinish: (correct: number, total: number) => void }

export function MicroQuiz({ items, onFinish }: Props) {
  const [values, setValues] = useState<string[]>(items.map(()=>""))
  const [done, setDone] = useState(false)
  const correct = useMemo(()=> items.reduce((acc, it, i)=> acc + (it.check(values[i]) ? 1 : 0), 0), [items, values])
  const submit = () => { setDone(true); onFinish(correct, items.length) }
  return (
    <div className="intro-block">
      <div className="intro-title">微测验</div>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((it, i)=> (
          <div key={i} className="card" style={{ display: "grid", gap: 8 }}>
            <div className="card-desc">{it.prompt}</div>
            <input value={values[i]} placeholder={it.placeholder} onChange={e=> setValues(v => { const n=[...v]; n[i]=e.target.value; return n })} />
            {done && <div className="hint" style={{ color: it.check(values[i]) ? "var(--good)" : "var(--danger)" }}>{it.check(values[i]) ? "答对啦" : "再试试"}</div>}
          </div>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="btn" onClick={submit}>提交</button>
        {done && <div className="hint">正确 {correct} / {items.length}</div>}
      </div>
    </div>
  )
}