type RatioState = { base: number; ratio: number }
type JourneyState = { a: { x: number; v: number }; b: { x: number; v: number } }

export function mapRatioState(s: RatioState) {
  const A = s.base
  const k = s.ratio
  const B = A * k
  const diff = Math.abs(B - A)
  const lines = [] as string[]
  lines.push(`口语: B是A的${k.toFixed(2)}倍`)
  lines.push(`算式: B=${B.toFixed(2)}, A=${A.toFixed(2)}, 差=${diff.toFixed(2)}`)
  lines.push(`等式: B = k·A, k=${k.toFixed(2)}`)
  return lines.join("\n")
}

export function mapJourneyState(s: JourneyState) {
  const dx = s.b.x - s.a.x
  const dv = s.a.v - s.b.v
  if (dv === 0) return "口语: 两者速度相同, 不相遇"
  const t = dx / dv
  if (t < 0) return "口语: 相遇发生在过去, 当前方向不会相遇"
  const x = s.a.x + s.a.v * t
  const lines = [] as string[]
  lines.push(`口语: 相遇时间为${t.toFixed(2)}秒, 位置${x.toFixed(2)}`)
  lines.push(`等式: xA+vA·t = xB+vB·t, t=${t.toFixed(2)}`)
  return lines.join("\n")
}

export function mapScaleState(l: number[], r: number[]) {
  const L = l.reduce((a, b) => a + b, 0)
  const R = r.reduce((a, b) => a + b, 0)
  const lines = [] as string[]
  lines.push(`口语: 左为${L}, 右为${R}`)
  lines.push(`等式: 左=${L}, 右=${R}`)
  lines.push(L === R ? "结论: 平衡" : (L > R ? "结论: 左重" : "结论: 右重"))
  return lines.join("\n")
}

export function mapAreaState(a: number, b: number) {
  const S = a * b
  const lines = [] as string[]
  lines.push(`口语: 长为${a}, 宽为${b}`)
  lines.push(`算式: 面积=${a}×${b}=${S}`)
  return lines.join("\n")
}

export function mapProbTreeState(first: Array<{ p: number; label: string }>, second: Array<{ p: number; label: string }>) {
  const lines = [] as string[]
  for (const f of first) for (const s of second) lines.push(`${f.label}→${s.label}: 合=${(f.p * s.p).toFixed(2)}`)
  return lines.join("\n")
}
export function mapErrorAdjust(wrongSum: number, wrongDigit: number, correctDigit: number, place: number) {
  const delta = (correctDigit - wrongDigit) * place
  const rightSum = wrongSum + delta
  return `口语: 少算了${delta}, 正确和=${rightSum}`
}
export function mapMixAdd(start: number, inMorning: number, outAfternoon: number) {
  const afterIn = start + inMorning
  const end = afterIn - outAfternoon
  return `口语: 先加${inMorning}到${afterIn}, 再减${outAfternoon}到${end}`
}
export function mapCutSegments(cuts: number, segLen: number, timePerCut: number) {
  const seg = cuts + 1
  const len = seg * segLen
  const t = cuts * timePerCut
  return `段数=${seg}, 总长=${len}${timePerCut ? `, 时间=${t}` : ""}`
}
export function mapPlanting(trees: number, spacing: number) {
  const intervals = Math.max(0, trees - 1)
  const roadLen = intervals * spacing
  return `间隔=${intervals}, 路长=${roadLen}`
}
export function mapStairs(from: number, to: number, timePerFloor: number) {
  const floors = Math.abs(from - to)
  const total = floors * timePerFloor
  return `层数=${floors}, 总时间=${total}`
}
export function mapClockDiff(sh: number, sm: number, eh: number, em: number) {
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return `用时=${diff}分钟`
}
export function mapSumDiff(total: number, diff: number) {
  const a = (total + diff) / 2
  const b = (total - diff) / 2
  return `A=${a}, B=${b}`
}
export function mapMoveEqual(a: number, b: number) {
  const m = (a - b) / 2
  return `转移${Math.abs(m)}后相等`
}
export function mapCompareMore(base: number, delta: number) {
  const other = base + delta
  return `另一项=${other}`
}
export function mapNetWeight(gBefore: number, gAfter: number) {
  const net = (gBefore - gAfter) * 2
  return `原物重=${net}`
}
export function mapPairing(a: number, b: number) { return `总搭配=${a * b}` }
export function mapSeriesPair(start: number, end: number, step: number) {
  const nums: number[] = []; for (let x = start; x <= end; x += step) nums.push(x)
  const n = nums.length
  const first = nums[0], last = nums[n - 1]
  const pairSum = first + last
  const pairs = Math.floor(n / 2)
  const mid = n % 2 === 1 ? nums[Math.floor(n / 2)] : 0
  const total = pairSum * pairs + mid
  const lines: string[] = []
  lines.push(`数列=${nums.join('+')}`)
  lines.push(`每对和=${pairSum}, 对数=${pairs}${mid ? `, 中项=${mid}` : ''}`)
  lines.push(`公式: (首+尾)×项数÷2 = (${first}+${last})×${n}÷2 = ${total}`)
  return lines.join("\n")
}
export function mapChickenRabbit(heads: number, legs: number) {
  const allChickenLegs = heads * 2
  const extra = Math.max(0, legs - allChickenLegs)
  const rabbits = Math.floor(extra / 2)
  const chickens = heads - rabbits
  const lines: string[] = []
  lines.push(`题面: 头=${heads}, 腿=${legs}`)
  lines.push(`假设: 全鸡腿=${allChickenLegs}`)
  lines.push(`多余腿=${extra} → 兔=${rabbits}`)
  lines.push(`鸡=${chickens}`)
  return lines.join("\n")
}
export function mapGroupSum(nums: number[], target: number) {
  const used = new Set<number>(); const ps: Array<[number, number]> = []
  for (let i = 0; i < nums.length; i++) { if (used.has(i)) continue; for (let j = i + 1; j < nums.length; j++) { if (used.has(j)) continue; if (nums[i] + nums[j] === target) { ps.push([nums[i], nums[j]]); used.add(i); used.add(j); break } } }
  const lines: string[] = []
  lines.push(`数列=${nums.join('+')}, 目标和=${target}`)
  lines.push(`配对=${ps.map(p => p.join('+')).join(',')}`)
  lines.push(`对数=${ps.length}`)
  return lines.join("\n")
}
export function mapFigureCount(rows: number, cols: number, filled: number) {
  const total = Math.min(rows * cols, Math.max(0, filled))
  const perRow = Math.floor(total / rows)
  const rem = total % rows
  return `网格=${rows}×${cols}\n每行约=${perRow}${rem ? `, 余=${rem}` : ''}\n总数=${total}`
}
export function mapTicket(pa: number, pc: number, n: number, r: number) {
  const A = Math.floor((r - pc * n) / (pa - pc))
  const C = n - A
  return `方程: ${pa}A+${pc}C=${r}, A+C=${n}\n解: A=${A}, C=${C}`
}
export function mapAge(sum: number, diff: number, years: number) {
  const A = (sum + diff) / 2, B = (sum - diff) / 2
  const Af = A + years, Bf = B + years
  return `当前: A=${A}, B=${B}\n${years}年后: A=${Af}, B=${Bf}`
}
export function mapRiver(v: number, c: number, L: number) {
  const up = L / Math.max(0.1, v - c)
  const down = L / Math.max(0.1, v + c)
  const diff = up - down
  return `上行时间=${up.toFixed(2)}, 下行时间=${down.toFixed(2)}\n时间差=${diff.toFixed(2)}`
}
// Optional mapping for ticket/age/figure for readability in LessonRunner

export function mapDefectGum() {
  return `策略: 先(1,2,3) vs (4,5,6)。\n若不平衡: 轻的一侧三选二称一次确定；\n若平衡: 次品在(7,8)，再称一次确定。\n最少称次=2。`
}