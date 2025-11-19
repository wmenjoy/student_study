"use client"
type Props = { measured: number; scale: number }

export function RulerScale({ measured, scale }: Props) {
  const m = Math.max(0, measured)
  const s = Math.max(1, scale)
  const real = m * s
  const width = 500
  const height = 160
  const unit = 20
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={24}>比例尺 1:{s} 测得长度={m}cm 实际长度={real}cm</text>
      <line x1={24} y1={80} x2={24 + m*unit} y2={80} stroke="#333" strokeWidth={4} />
      {[...Array(m+1)].map((_,i)=> (
        <line key={i} x1={24 + i*unit} y1={80} x2={24 + i*unit} y2={92} stroke="#333" />
      ))}
    </svg>
  )
}