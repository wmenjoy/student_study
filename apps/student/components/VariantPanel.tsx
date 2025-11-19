"use client"
type Item = { label: string; apply: () => void }
type Props = { items: Item[]; onRefresh: () => void }

export function VariantPanel({ items, onRefresh }: Props) {
  return (
    <div className="intro-block">
      <div className="intro-title">变式题</div>
      <div className="grid">
        {items.map((it, i) => (
          <div key={i} className="card" onClick={it.apply}>
            <div className="card-title">{it.label}</div>
            <div className="card-desc">点击应用到题面</div>
          </div>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="btn" onClick={onRefresh}>刷新变式</button>
      </div>
    </div>
  )
}