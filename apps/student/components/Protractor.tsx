"use client"
type Props = { degrees: number }

export function Protractor({ degrees }: Props) {
  const d = Math.max(0, Math.min(360, degrees))
  const width = 400
  const height = 240
  const cx = 200
  const cy = 160
  const r = 120
  const rad = (d * Math.PI) / 180
  const x = cx + r * Math.cos(rad)
  const y = cy - r * Math.sin(rad)
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={24}>角度={d}°</text>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#e5e7eb" />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#333" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#6ba4ff" />
      {[...Array(18)].map((_,i)=> (
        <line key={i} x1={cx + r*Math.cos((i*10)*Math.PI/180)} y1={cy - r*Math.sin((i*10)*Math.PI/180)} x2={cx + (r-10)*Math.cos((i*10)*Math.PI/180)} y2={cy - (r-10)*Math.sin((i*10)*Math.PI/180)} stroke="#9abcfb" />
      ))}
    </svg>
  )
}