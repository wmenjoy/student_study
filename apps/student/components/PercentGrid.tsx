"use client"
type Props = { percent: number }

export function PercentGrid({ percent }: Props) {
  const p = Math.max(0, Math.min(100, Math.round(percent)))
  const width = 300
  const height = 300
  const cols = 10
  const size = 24
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={28}>涂色比例={p}% 小数={(p/100).toFixed(2)} 分数={p}/100</text>
      {[...Array(100)].map((_,i)=> {
        const x = i % cols
        const y = Math.floor(i / cols)
        const filled = i < p
        return (
          <rect key={i} x={24 + x*size} y={50 + y*size} width={size-2} height={size-2} fill={filled?"#6ba4ff":"#ffffff"} stroke="#e5e7eb" />
        )
      })}
    </svg>
  )
}