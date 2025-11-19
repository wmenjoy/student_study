export type Difficulty = "easy" | "medium" | "hard"

export type Question = {
  prompt: string
  answer: string
  check: (v: string) => boolean
  tags: string[]
  hint?: string
  explain?: string
}

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const toStr = (n: number) => Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(4)))

const qAddWithin20 = (): Question => {
  const a = rnd(1, 19)
  const b = rnd(1, Math.min(20 - a, 19))
  const ans = a + b
  return { prompt: `${a} + ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["一年级", "加法"], hint: "把两个数合在一起", explain: `${a}+${b}=${ans}` }
}

const qSubWithin20 = (): Question => {
  const a = rnd(2, 20)
  const b = rnd(1, a - 1)
  const ans = a - b
  return { prompt: `${a} - ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["一年级", "减法"], hint: "从前面减去后面", explain: `${a}-${b}=${ans}` }
}

const qTenDecompose = (): Question => {
  const a = rnd(1, 9)
  const b = 10 - a
  return { prompt: `10可以分成${a}和几？`, answer: toStr(b), check: v => Math.abs(parseFloat(v) - b) < 1e-6, tags: ["一年级", "组成"], hint: "两个数加起来是10", explain: `${a}+${b}=10` }
}

const qRmbJiao = (): Question => {
  const a = rnd(1, 9)
  const b = rnd(1, 9)
  const ans = a + b
  return { prompt: `${a}角 + ${b}角 = ?角`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["一年级", "人民币"], hint: "角数相加", explain: `${a}+${b}=${ans}角` }
}

const qTwoDigitAdd = (): Question => {
  const a = rnd(10, 89)
  const b = rnd(10, 89)
  const ans = a + b
  return { prompt: `${a} + ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["二年级", "进位加法"], hint: "按位相加，满十进一", explain: `${a}+${b}=${ans}` }
}

const qTwoDigitSub = (): Question => {
  const a = rnd(20, 99)
  const b = rnd(10, a - 1)
  const ans = a - b
  return { prompt: `${a} - ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["二年级", "退位减法"], hint: "不够向前一位借十", explain: `${a}-${b}=${ans}` }
}

const qMulFacts = (): Question => {
  const a = rnd(2, 9)
  const b = rnd(2, 9)
  const ans = a * b
  return { prompt: `${a} × ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["二年级", "乘法口诀"], hint: "几几得几", explain: `${a}×${b}=${ans}` }
}

const qDivFacts = (): Question => {
  const b = rnd(2, 9)
  const ans = rnd(2, 9)
  const a = b * ans
  return { prompt: `${a} ÷ ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["二年级", "除法口诀"], hint: "乘法逆运算", explain: `${a}÷${b}=${ans}` }
}

const qLenUnit = (): Question => {
  const m = rnd(1, 9)
  const cm = m * 100
  return { prompt: `${m}米 = ?厘米`, answer: toStr(cm), check: v => Math.abs(parseFloat(v) - cm) < 1e-6, tags: ["二年级", "长度单位"], hint: "1米=100厘米", explain: `${m}m=${cm}cm` }
}

const qTwoByOneMul = (): Question => {
  const a = rnd(12, 98)
  const b = rnd(2, 9)
  const ans = a * b
  return { prompt: `${a} × ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["三年级", "乘法"], hint: "先算个位再算十位", explain: `${a}×${b}=${ans}` }
}

const qDivByOne = (): Question => {
  const b = rnd(2, 9)
  const ans = rnd(10, 99)
  const a = b * ans
  return { prompt: `${a} ÷ ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["三年级", "除法"], hint: "试商或整除", explain: `${a}÷${b}=${ans}` }
}

const qMassUnit = (): Question => {
  const kg = rnd(1, 9)
  const g = kg * 1000
  return { prompt: `${kg}千克 = ?克`, answer: toStr(g), check: v => Math.abs(parseFloat(v) - g) < 1e-6, tags: ["三年级", "质量单位"], hint: "1千克=1000克", explain: `${kg}kg=${g}g` }
}

const qMixedOps = (): Question => {
  const a = rnd(5, 20)
  const b = rnd(5, 20)
  const c = rnd(2, 9)
  const ans = (a + b) * c
  return { prompt: `(${a} + ${b}) × ${c} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["四年级", "混合运算"], hint: "先算括号再乘", explain: `(${a}+${b})×${c}=${ans}` }
}

const qDecimalAddSub = (): Question => {
  const a = parseFloat((rnd(10, 90) / 10).toFixed(1))
  const b = parseFloat((rnd(10, 90) / 10).toFixed(1))
  const sub = Math.random() < 0.5
  const ans = sub ? a - b : a + b
  return { prompt: `${a} ${sub ? "-" : "+"} ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["四年级", "小数加减"], hint: "对齐小数点", explain: `${a}${sub ? "-" : "+"}${b}=${toStr(ans)}` }
}

const qTotalPrice = (): Question => {
  const p = rnd(2, 9)
  const n = rnd(3, 9)
  const ans = p * n
  return { prompt: `单价${p}元，买${n}个，总价 = ?元`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["四年级", "数量关系"], hint: "单价×数量", explain: `${p}×${n}=${ans}` }
}

const qDecimalMulDiv = (): Question => {
  const a = parseFloat((rnd(10, 50) / 10).toFixed(1))
  const b = rnd(2, 9)
  const mul = Math.random() < 0.5
  const ans = mul ? a * b : parseFloat((a / b).toFixed(2))
  return { prompt: `${a} ${mul ? "×" : "÷"} ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["五年级", "小数乘除"], hint: mul ? "整数乘以小数" : "小数除以整数", explain: `${a}${mul ? "×" : "÷"}${b}=${toStr(ans)}` }
}

const gcd = (a: number, b: number) => {
  let x = Math.abs(a), y = Math.abs(b)
  while (y !== 0) { const t = x % y; x = y; y = t }
  return x
}
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)

const qFractionAdd = (): Question => {
  const a1 = rnd(1, 6), a2 = rnd(a1 + 1, 9)
  const b1 = rnd(1, 6), b2 = rnd(b1 + 1, 9)
  const L = lcm(a2, b2)
  const s = a1 * (L / a2) + b1 * (L / b2)
  return { prompt: `${a1}/${a2} + ${b1}/${b2} = ?`, answer: `${s}/${L}`, check: v => {
    const m = v.trim().split("/"); if (m.length !== 2) return false; const num = parseFloat(m[0]); const den = parseFloat(m[1]); return Math.abs(num / den - s / L) < 1e-6
  }, tags: ["五年级", "分数加法"], hint: "通分后相加", explain: `${a1}/${a2}→${a1 * (L / a2)}/${L},${b1}/${b2}→${b1 * (L / b2)}/${L}` }
}

const qFractionMulDiv = (): Question => {
  const a1 = rnd(1, 5), a2 = rnd(a1 + 2, 9)
  const b1 = rnd(1, 5), b2 = rnd(b1 + 2, 9)
  const mul = Math.random() < 0.5
  if (mul) {
    const num = a1 * b1, den = a2 * b2
    return { prompt: `${a1}/${a2} × ${b1}/${b2} = ?`, answer: `${num}/${den}`, check: v => { const m = v.trim().split("/"); if (m.length !== 2) return false; const n = parseFloat(m[0]); const d = parseFloat(m[1]); return Math.abs(n / d - num / den) < 1e-6 }, tags: ["六年级", "分数乘法"], hint: "分子乘分子，分母乘分母" }
  } else {
    const num = a1 * b2, den = a2 * b1
    return { prompt: `${a1}/${a2} ÷ ${b1}/${b2} = ?`, answer: `${num}/${den}`, check: v => { const m = v.trim().split("/"); if (m.length !== 2) return false; const n = parseFloat(m[0]); const d = parseFloat(m[1]); return Math.abs(n / d - num / den) < 1e-6 }, tags: ["六年级", "分数除法"], hint: "除以分数等于乘以倒数" }
  }
}

const qPercentApp = (): Question => {
  const base = rnd(100, 300)
  const p = pick([10, 20, 25, 40, 50])
  const ans = Math.round((base * p) / 100)
  return { prompt: `一个数的${p}%是${ans}，这个数是多少？`, answer: toStr(base), check: v => Math.abs(parseFloat(v) - base) < 1e-6, tags: ["六年级", "百分数应用"], hint: "用值÷百分比", explain: `${ans}÷${p}%=${base}` }
}

const qRatioSimplify = (): Question => {
  const a = rnd(12, 60)
  const b = rnd(12, 60)
  const g = gcd(a, b)
  const sa = a / g, sb = b / g
  return { prompt: `化简比：${a}:${b}`, answer: `${sa}:${sb}`, check: v => v.replace(/\s/g,"") === `${sa}:${sb}`, tags: ["六年级", "比与比例"], hint: "同时除以最大公因数", explain: `gcd=${g}, ${a}:${b}→${sa}:${sb}` }
}

const qScaleDistance = (): Question => {
  const scale = pick([500, 1000, 2000, 5000])
  const map = rnd(2, 9)
  const real = map * scale
  return { prompt: `比例尺1:${scale}，图上距离${map}cm，实际距离 = ?cm`, answer: toStr(real), check: v => Math.abs(parseFloat(v) - real) < 1e-6, tags: ["六年级", "比例尺"], hint: "图距×比例尺", explain: `${map}×${scale}=${real}cm` }
}

const qNegAdd = (): Question => {
  const a = -rnd(1, 9)
  const b = rnd(1, 9)
  const ans = a + b
  return { prompt: `${a} + ${b} = ?`, answer: toStr(ans), check: v => Math.abs(parseFloat(v) - ans) < 1e-6, tags: ["六年级", "负数"], hint: "负数加正数看差值", explain: `${a}+${b}=${ans}` }
}

const pools = {
  easy: [qAddWithin20, qSubWithin20, qTenDecompose, qRmbJiao, qTwoDigitAdd, qTwoDigitSub, qMulFacts, qDivFacts, qLenUnit],
  medium: [qTwoByOneMul, qDivByOne, qMassUnit, qMixedOps, qDecimalAddSub, qTotalPrice],
  hard: [qDecimalMulDiv, qFractionAdd, qFractionMulDiv, qPercentApp, qRatioSimplify, qScaleDistance, qNegAdd]
} as const

export function generateQuestions(diff: Difficulty, count: number): Question[] {
  const gen = pools[diff]
  const res: Question[] = []
  let last = -1
  for (let i = 0; i < count; i++) {
    let idx = Math.floor(Math.random() * gen.length)
    if (idx === last) idx = (idx + 1) % gen.length
    last = idx
    res.push(gen[idx]())
  }
  return res
}

export function validateAnswer(q: Question, input: string) {
  return q.check(input)
}