"use client"
type Props = { a: number; b: number; op: "+" | "-" }

export function VerticalAddSub({ a, b, op }: Props) {
  const width = 300
  const height = 220
  const A = String(Math.floor(Math.abs(a)))
  const B = String(Math.floor(Math.abs(b)))
  const len = Math.max(A.length, B.length)
  const pad = (s: string) => s.padStart(len, " ")
  const pa = pad(A)
  const pb = pad(B)
  const res = op === "+" ? Number(a) + Number(b) : Number(a) - Number(b)
  const R = String(Math.floor(Math.abs(res))).padStart(len, " ")
  const baseX = 40
  const step = 20
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={28}>竖式</text>
      {pa.split("").map((ch,i)=> (<text key={"a"+i} x={baseX + i*step} y={80}>{ch}</text>))}
      {pb.split("").map((ch,i)=> (<text key={"b"+i} x={baseX + i*step} y={110}>{ch}</text>))}
      <text x={baseX - 16} y={110}>{op}</text>
      <line x1={baseX} y1={120} x2={baseX + len*step} y2={120} stroke="#333" />
      {R.split("").map((ch,i)=> (<text key={"r"+i} x={baseX + i*step} y={150}>{ch}</text>))}
    </svg>
  )
}