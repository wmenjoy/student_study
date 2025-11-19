"use client"
type Props = { stage: string; hints: string[]; onSpeak?: (msg: string)=>void }

export function GuideBanner({ stage, hints, onSpeak }: Props) {
  const text = `${stage}：${hints.join("，")}`
  return (
    <div className="intro-block">
      <div className="intro-title">步骤（{stage}）</div>
      <ul className="intro-list">
        {hints.map((h,i)=> (<li key={i}>{h}</li>))}
      </ul>
      <div className="controls" style={{ marginTop: 8 }}>
        {onSpeak && <button className="btn ghost" onClick={()=>onSpeak(text)}>朗读</button>}
      </div>
    </div>
  )
}