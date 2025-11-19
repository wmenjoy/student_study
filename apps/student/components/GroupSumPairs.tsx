"use client"
type Props = { nums: number[]; target: number; stage: number }

export function GroupSumPairs({ nums, target, stage }: Props) {
  const width = 640
  const height = 260
  const pairs: Array<[number, number]> = []
  const used = new Set<number>()
  for (let i = 0; i < nums.length; i++) {
    if (used.has(i)) continue
    for (let j = i + 1; j < nums.length; j++) {
      if (used.has(j)) continue
      if (nums[i] + nums[j] === target) { pairs.push([i, j]); used.add(i); used.add(j); break }
    }
  }
  const box = (x:number,y:number,w:number,h:number,text:string,hl=false)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill={hl?"#eef2ff":"#ffffff"} stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  const gap = 46
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (
        <g>
          <text x={24} y={24}>目标和={target}</text>
          {nums.map((n,i)=> box(24+i*gap, 50, 40, 34, String(n)))}
        </g>
      )}
      {stage>=1 && (
        <g>
          {pairs.map((p,k)=> (
            <g key={k} className="blink" style={{ animationDelay: `${k*0.12}s` }}>
              <line x1={24+p[0]*gap+20} y1={84} x2={24+p[1]*gap+20} y2={84} stroke="#60a5fa" strokeWidth={2} />
            </g>
          ))}
        </g>
      )}
      {stage>=2 && (
        <g>
          {pairs.map((p,k)=> (
            <g key={"pb"+k}>{box(24+p[0]*gap, 100, 40, 34, String(nums[p[0]]), true)}{box(24+p[1]*gap, 100, 40, 34, String(nums[p[1]]), true)}</g>
          ))}
        </g>
      )}
      {stage>=3 && (
        <g>
          <text x={24} y={160}>对数={pairs.length}</text>
        </g>
      )}
    </svg>
  )
}